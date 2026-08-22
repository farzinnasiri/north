import { useMemo, useState } from 'react';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { InstrumentSlider } from '@/components/ui/instrument-slider';
import { NorthButton } from '@/components/ui/north-button';
import { NorthField } from '@/components/ui/north-field';
import { NorthScreen } from '@/components/ui/north-screen';
import { NorthText } from '@/components/ui/north-text';
import { Reveal } from '@/components/ui/reveal';
import { MAX_DEADLINE_DAYS, MIN_DEADLINE_DAYS } from '@/domains/actions/action';
import { swapsLeft } from '@/domains/actions/swaps';
import { ActionBrief } from '@/domains/actions/ui/action-brief';
import { nextAction } from '@/domains/content/selection';
import { useJourney } from '@/domains/journey/store';
import { commitImpact } from '@/platform/haptics';
import { colors, spacing } from '@/theme';

type Step = 'proposal' | 'naming' | 'deadline';

/**
 * Taking the next Action, in the order the product asks for it: read what the
 * system proposes, decide what it means for you, then choose how long you are
 * giving yourself. Each step asks for exactly one thing, because a sheet that
 * asks for three at once is how a commitment becomes a form.
 */
export function StartAction() {
  const journey = useJourney((state) => state.journey);
  const open = useJourney((state) => state.open);
  const swap = useJourney((state) => state.swap);

  const [step, setStep] = useState<Step>('proposal');
  const [named, setNamed] = useState('');
  const [days, setDays] = useState(3);
  const [now] = useState(() => Date.now());

  const proposal = useMemo(() => {
    if (!journey) return null;
    return nextAction({
      closed: journey.closed.map((action) => action.actionId),
      passed: journey.passed,
      readings: journey.readings,
    });
  }, [journey]);

  if (!journey || !proposal) return null;

  const swaps = swapsLeft(journey.swapsUsedAt, now);

  return (
    <NorthScreen contentStyle={styles.screen}>
      <Reveal key={step} style={styles.step}>
        {step === 'proposal' ? (
          <>
            <NorthText variant="label">THE NEXT ACTION</NorthText>
            <ActionBrief action={proposal} />
            <View style={styles.actions}>
              <NorthButton label="This is the one" onPress={() => go('naming')} />
              <NorthButton
                disabled={swaps === 0}
                label={swaps === 0 ? 'No swaps left this month' : `Swap it · ${swaps} left`}
                onPress={() => swap(proposal.id, Date.now())}
                tone="quiet"
              />
            </View>
          </>
        ) : null}

        {step === 'naming' ? (
          <>
            <View style={styles.recall}>
              <NorthText variant="label">THE ACTION</NorthText>
              <NorthText style={styles.paper}>{proposal.title}</NorthText>
            </View>
            <View style={styles.head}>
              <NorthText variant="title">Name it in your own words.</NorthText>
              <NorthText>
                What does it mean for you, this week? Write the version you will recognise when
                you come back to it.
              </NorthText>
            </View>
            <NorthField
              accessibilityLabel="Your named action"
              autoFocus
              onChangeText={setNamed}
              placeholder="Speak up in Thursday’s meeting instead of nodding along."
              value={named}
            />
            <View style={styles.actions}>
              <NorthButton
                disabled={named.trim().length === 0}
                label="Set the deadline"
                onPress={() => go('deadline')}
              />
              <NorthButton label="Back" onPress={() => go('proposal')} tone="quiet" />
            </View>
          </>
        ) : null}

        {step === 'deadline' ? (
          <>
            <View style={styles.recall}>
              <NorthText variant="label">YOU NAMED IT</NorthText>
              <NorthText style={styles.paper}>{named.trim()}</NorthText>
            </View>
            <View style={styles.head}>
              <NorthText variant="title">How long are you giving yourself?</NorthText>
              <NorthText>
                One to seven days. Choose the length you will actually keep, not the one that
                sounds impressive tonight.
              </NorthText>
            </View>
            <InstrumentSlider
              accessibilityLabel="Deadline in days"
              leftLabel="1 day"
              maximum={MAX_DEADLINE_DAYS}
              minimum={MIN_DEADLINE_DAYS}
              onChange={setDays}
              readout={`${days} ${days === 1 ? 'DAY' : 'DAYS'}`}
              rightLabel="7 days"
              value={days}
            />
            <View style={styles.actions}>
              <NorthButton label="Open it" onPress={openIt} />
              <NorthButton label="Back" onPress={() => go('naming')} tone="quiet" />
            </View>
            <NorthText style={styles.footnote} variant="small">
              Nothing will remind you. The deadline is a promise you are making to yourself.
            </NorthText>
          </>
        ) : null}
      </Reveal>
    </NorthScreen>
  );

  function go(next: Step) {
    setStep(next);
  }

  function openIt() {
    void commitImpact();
    open({
      actionId: proposal!.id,
      axis: proposal!.axis,
      deadlineDays: days,
      named: named.trim(),
      note: null,
      openedAt: Date.now(),
    });
    router.back();
  }
}

const styles = StyleSheet.create({
  actions: {
    gap: spacing.sm,
    paddingTop: spacing.sm,
  },
  footnote: {
    color: colors.slate,
    textAlign: 'center',
  },
  head: {
    gap: spacing.sm,
  },
  paper: {
    color: colors.paper,
  },
  recall: {
    borderLeftColor: colors.lineSoft,
    borderLeftWidth: 2,
    gap: spacing.xs,
    paddingLeft: spacing.lg,
  },
  screen: {
    gap: spacing.lg,
  },
  step: {
    gap: spacing.lg,
  },
});

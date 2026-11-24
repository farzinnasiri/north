import { Link } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AppState, Platform, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GlassGroup } from '@/components/ui/glass';
import { NorthBackdrop } from '@/components/ui/north-backdrop';
import { NorthButton } from '@/components/ui/north-button';
import { NorthText } from '@/components/ui/north-text';
import { TAB_TOP_INSET } from '@/components/ui/tab-inset';
import { Reveal } from '@/components/ui/reveal';
import type { Outcome } from '@/domains/actions/action';
import { DAY_MS, clockLabel, dayLabel, localDay } from '@/domains/actions/action';
import { lineById } from '@/domains/content/catalogue';
import { suggestions } from '@/domains/content/selection';
import { useCatalogue } from '@/domains/content/store';
import { LineCard } from '@/domains/content/ui/line-card';
import { DirectionCompass } from '@/domains/direction/ui/direction-compass';
import { actionState, canPass, northState, seenLines } from '@/domains/journey/journey';
import { useJourney } from '@/domains/journey/store';
import { closeoutNotification, commitImpact } from '@/platform/haptics';
import { playSoundCue } from '@/platform/sound';
import { colors, spacing, typography } from '@/theme';

/**
 * Today answers one question at a time: which way is forward, what is the
 * one thing, and did he do it. The compass stays put above all three.
 */
export function Today() {
  const { height, width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const journey = useJourney((state) => state.journey);
  const pending = useJourney((state) => state.pendingMovement);
  const settleNeedle = useJourney((state) => state.settleNeedle);
  const checkIn = useJourney((state) => state.checkIn);
  const pass = useJourney((state) => state.pass);
  const catalogue = useCatalogue((state) => state.catalogue);
  const now = useNow();
  const [chosen, setChosen] = useState<string | null>(null);

  const day = localDay(now);
  const offered = useMemo(() => journey ? suggestions({
    day,
    honestThing: journey.honestThing,
    lines: catalogue.lines,
    northStar: journey.northStar,
    readings: journey.readings,
    seen: seenLines(journey),
  }) : [], [catalogue.lines, day, journey]);

  const sound = journey?.preferences.sound ?? false;
  const moveStarted = useCallback(() => {
    if (!pending) return;
    playSoundCue(pending.to === 0 ? 'reach-north' : 'direction-move', sound);
  }, [pending, sound]);

  if (!journey) return null;

  const state = actionState(journey, now);
  const north = northState(journey, now);
  const compass = Math.min(width - spacing.screen * 2, height < 740 ? 236 : 288);
  const selected = offered.find((line) => line.id === chosen) ?? offered[0];
  const openLine = journey.open ? lineById(catalogue, journey.open.lineId) : undefined;
  const dayNumber = Math.max(1, Math.floor((now - journey.committedAt) / DAY_MS) + 1);

  function answer(outcome: Outcome) {
    if (!journey?.open) return;
    const moved = checkIn({ instanceId: journey.open.instanceId, outcome });
    if (moved) void closeoutNotification();
    else void commitImpact();
  }

  return (
    <View style={styles.screen}>
    <NorthBackdrop />
    <ScrollView
      // iOS adds the safe area through contentInsetAdjustmentBehavior; elsewhere it is padding.
      contentContainerStyle={[styles.content, { paddingTop: (Platform.OS === 'ios' ? 0 : insets.top) + TAB_TOP_INSET + spacing.sm }]}
      contentInsetAdjustmentBehavior="automatic"
      style={styles.scroll}
    >
      <View style={styles.header}>
        <NorthText variant="label">{`NORTH · DAY ${dayNumber}`}</NorthText>
        <NorthText variant="label">{northLabel(north, journey.direction)}</NorthText>
      </View>

      <View style={styles.instrument}>
        <DirectionCompass
          direction={journey.direction}
          onMoveEnd={settleNeedle}
          field={false}
          onMoveStart={moveStarted}
          size={compass}
          startingDirection={journey.startingDirection}
        />
      </View>

      <View style={styles.readout}>
        <NorthText style={styles.degrees}>{`${format(journey.direction)}°`}</NorthText>
        <NorthText style={styles.unit}>off north</NorthText>
      </View>
      <View style={styles.rule} />

      {north.kind === 'exit' ? (
        <Reveal style={styles.block}>
          <NorthText variant="title">You don&apos;t need this anymore.</NorthText>
          <NorthText>
            Thirty days at north. A compass doesn&apos;t walk for you. It tells you which way is forward, and then you go.
          </NorthText>
        </Reveal>
      ) : state.kind === 'choosing' ? (
        <Reveal key={`choose-${offered.map((line) => line.id).join()}`} style={styles.block}>
          <NorthText variant="label">{journey.closed.length === 0 ? 'YOUR FIRST ACTION · PICK ONE' : 'TODAY · PICK ONE'}</NorthText>
          {offered.map((line) => (
            <LineCard
              key={line.id}
              line={line}
              onPress={() => setChosen(line.id)}
              quoteLines={3}
              selected={line.id === selected?.id}
            />
          ))}
          <GlassGroup style={styles.actions}>
            {selected ? (
              <Link asChild href={{ params: { line: selected.id }, pathname: '/action' }}>
                <NorthButton label="Take this one" />
              </Link>
            ) : null}
            {canPass(journey, now) ? (
              <NorthButton
                label="Show two others"
                onPress={() => { setChosen(null); pass(offered.map((line) => line.id)); }}
                tone="quiet"
              />
            ) : (
              <NorthText style={styles.centre} variant="small">Two new ones tomorrow.</NorthText>
            )}
          </GlassGroup>
        </Reveal>
      ) : state.kind === 'running' ? (
        <Reveal key="running" style={styles.block}>
          <NorthText variant="label">
            {`THE ONE THING · CHECK-IN ${dayLabel(state.action.checkInAt, now).toUpperCase()} ${clockLabel(journey.preferences.checkInMinutes)}`}
          </NorthText>
          {openLine ? <LineCard action={state.action.action} line={openLine} /> : (
            <NorthText style={styles.paper}>{state.action.action}</NorthText>
          )}
          {state.action.note ? (
            <View style={styles.note}>
              <NorthText variant="label">NOTE</NorthText>
              <NorthText selectable variant="small">{state.action.note}</NorthText>
            </View>
          ) : null}
          <GlassGroup style={styles.actions}>
            <Link asChild href="/closeout"><NorthButton label="Check in now" tone="secondary" /></Link>
            <Link asChild href="/note"><NorthButton label={state.action.note ? 'Edit note' : 'Add a note'} tone="quiet" /></Link>
          </GlassGroup>
        </Reveal>
      ) : (
        <Reveal key="due" style={styles.block}>
          <NorthText variant="label">CHECK-IN</NorthText>
          <NorthText variant="title">Did you do it?</NorthText>
          <NorthText selectable style={styles.paper}>{state.action.action}</NorthText>
          <GlassGroup style={styles.actions}>
            <NorthButton label="I did it" onPress={() => answer('done')} />
            <NorthButton label="Partly" onPress={() => answer('partly')} tone="secondary" />
            <NorthButton label="I didn’t" onPress={() => answer('missed')} tone="quiet" />
          </GlassGroup>
          <NorthText style={styles.centre} variant="small">No proof. A miss moves nothing back.</NorthText>
        </Reveal>
      )}
    </ScrollView>
    </View>
  );
}

/** Minute-accurate time that also catches up when the app returns to the front. */
function useNow(): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60_000);
    const subscription = AppState.addEventListener('change', (next) => {
      if (next === 'active') setNow(Date.now());
    });
    return () => { clearInterval(timer); subscription.remove(); };
  }, []);
  return now;
}

function northLabel(north: ReturnType<typeof northState>, direction: number): string {
  if (north.kind === 'holding') return `HOLDING · ${north.daysLeft} DAYS LEFT`;
  if (north.kind === 'near') return `${format(direction)}° TO GO`;
  if (north.kind === 'exit') return 'ARRIVED';
  return 'ONE THING AT A TIME';
}

function format(value: number): string {
  return Number.isInteger(value) ? `${value}` : value.toFixed(1);
}

const styles = StyleSheet.create({
  actions: {
    gap: spacing.sm,
    paddingTop: spacing.sm,
  },
  block: {
    gap: spacing.md,
  },
  centre: {
    textAlign: 'center',
  },
  content: {
    gap: spacing.lg,
    paddingBottom: spacing.xxxl,
    paddingHorizontal: spacing.screen,
  },
  degrees: {
    color: colors.paper,
    fontFamily: typography.monoMedium,
    fontSize: 46,
    fontVariant: ['tabular-nums'],
    letterSpacing: -1,
    lineHeight: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 32,
    alignItems: 'center',
  },
  instrument: {
    alignItems: 'center',
  },
  note: {
    borderLeftColor: colors.line,
    borderLeftWidth: 2,
    gap: spacing.xs,
    paddingLeft: spacing.md,
  },
  paper: {
    color: colors.paper,
  },
  readout: {
    alignItems: 'baseline',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  rule: {
    backgroundColor: colors.lineSoft,
    height: StyleSheet.hairlineWidth,
  },
  screen: {
    backgroundColor: colors.fieldDeep,
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  unit: {
    color: colors.slate,
    fontFamily: typography.mono,
    fontSize: 14,
  },
});

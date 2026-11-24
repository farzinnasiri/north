import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { InstrumentSlider } from '@/components/ui/instrument-slider';
import { GLASS_AVAILABLE, GlassGroup } from '@/components/ui/glass';
import { NorthButton } from '@/components/ui/north-button';
import { NorthField } from '@/components/ui/north-field';
import { NorthScreen } from '@/components/ui/north-screen';
import { NorthText } from '@/components/ui/north-text';
import { MAX_DAYS, MIN_DAYS, checkInTime, clockLabel, dayLabel } from '@/domains/actions/action';
import { lineById } from '@/domains/content/catalogue';
import { useCatalogue } from '@/domains/content/store';
import { LineCard } from '@/domains/content/ui/line-card';
import { degreesForClose } from '@/domains/direction/movement';
import { useJourney } from '@/domains/journey/store';
import { commitImpact } from '@/platform/haptics';
import { colors, spacing } from '@/theme';

/**
 * Taking the Action. Two decisions and no more: how many days it gets, and
 * whether to put it in his own words. The check-in time comes from Settings.
 */
export function TakeAction() {
  const { line: lineId } = useLocalSearchParams<{ line?: string }>();
  const journey = useJourney((state) => state.journey);
  const open = useJourney((state) => state.open);
  const catalogue = useCatalogue((state) => state.catalogue);
  const line = lineId ? lineById(catalogue, lineId) : undefined;
  const [days, setDays] = useState(1);
  const [rewording, setRewording] = useState(false);
  const [text, setText] = useState('');
  const [now] = useState(() => Date.now());

  if (!journey || !line || journey.open) return null;
  const checkIn = checkInTime(now, days, journey.preferences.checkInMinutes);

  return (
    <NorthScreen bare={GLASS_AVAILABLE} contentStyle={styles.screen}>
      <LineCard action={text.trim() || undefined} line={line} />

      {rewording ? (
        <NorthField
          accessibilityLabel="The action, in your words"
          autoFocus
          maxLength={240}
          onChangeText={setText}
          placeholder={line.takeaway}
          value={text}
        />
      ) : (
        <NorthButton label="Put it in my words" onPress={() => setRewording(true)} tone="quiet" />
      )}

      <View style={styles.when}>
        <NorthText variant="label">HOW LONG</NorthText>
        <InstrumentSlider
          accessibilityLabel="Days for this action"
          leftLabel="Today"
          maximum={MAX_DAYS}
          minimum={MIN_DAYS}
          onChange={setDays}
          readout={days === 1 ? 'Today' : `${days} days`}
          rightLabel="7 days"
          value={days}
        />
        <NorthText variant="label">
          {`CHECK-IN ${dayLabel(checkIn, now).toUpperCase()} ${clockLabel(journey.preferences.checkInMinutes)} · WORTH ${degreesForClose(days).toFixed(2)}°`}
        </NorthText>
      </View>

      <GlassGroup style={styles.actions}>
        <NorthButton
          label="Commit"
          onPress={() => {
            open({ action: text, days, line });
            void commitImpact();
            router.back();
          }}
        />
        <NorthText style={styles.footnote} variant="small">
          {journey.preferences.checkIns
            ? 'North will ask once, at the check-in. Nothing else.'
            : 'Check-ins are off. Answer on Today when you are ready.'}
        </NorthText>
      </GlassGroup>
    </NorthScreen>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: spacing.sm,
  },
  footnote: {
    color: colors.slate,
    textAlign: 'center',
  },
  screen: {
    gap: spacing.lg,
  },
  when: {
    gap: spacing.md,
  },
});

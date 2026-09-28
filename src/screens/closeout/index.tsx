import { useState } from 'react';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { NorthButton } from '@/components/ui/north-button';
import { NorthField } from '@/components/ui/north-field';
import { NorthScreen } from '@/components/ui/north-screen';
import { NorthText } from '@/components/ui/north-text';
import { Surface } from '@/components/ui/surface';
import { degreesForClose } from '@/domains/direction/movement';
import { useJourney } from '@/domains/journey/store';
import { closeoutNotification } from '@/platform/haptics';
import { playSoundCue } from '@/platform/sound';
import { colors, spacing } from '@/theme';

/**
 * The honour system, in one screen. There is nothing to upload and nothing to
 * prove, so the only thing this asks for is an answer — and the quiet way out
 * changes nothing, because a man who is not finished has not failed.
 */
export function Closeout() {
  const journey = useJourney((state) => state.journey);
  const close = useJourney((state) => state.close);
  const [note, setNote] = useState(journey?.open?.note ?? '');
  const soundEnabled = journey?.preferences.sound ?? false;

  const open = journey?.open;
  if (!open) return null;

  return (
    <NorthScreen contentStyle={styles.screen}>
      <View style={styles.head}>
        <NorthText variant="title">Did you do what you named?</NorthText>
        <NorthText>No proof needed.</NorthText>
      </View>

      <Surface>
        <NorthText variant="label">YOU NAMED IT</NorthText>
        <NorthText selectable style={styles.named}>
          {open.named}
        </NorthText>
      </Surface>

      <NorthField
        accessibilityLabel="Optional note"
        onChangeText={setNote}
        placeholder="Add a note if you want."
        value={note}
      />

      <View style={styles.actions}>
        <NorthButton label="Yes, it's done" onPress={keep} />
        <NorthButton label="Not yet" onPress={() => router.back()} tone="quiet" />
      </View>

      <NorthText style={styles.footnote} variant="label">
        {`WORTH · ${degreesForClose(open.deadlineDays).toFixed(2)}°`}
      </NorthText>
    </NorthScreen>
  );

  function keep() {
    void closeoutNotification();
    close({ at: Date.now(), kept: true, note: note.trim() === '' ? null : note.trim() });
    playSoundCue('close-out', soundEnabled);
    router.back();
  }
}

const styles = StyleSheet.create({
  actions: {
    gap: spacing.sm,
  },
  footnote: {
    color: colors.slate,
    textAlign: 'center',
  },
  head: {
    gap: spacing.sm,
  },
  named: {
    color: colors.paper,
  },
  screen: {
    gap: spacing.lg,
  },
});

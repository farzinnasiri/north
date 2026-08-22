import { useState } from 'react';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { NorthButton } from '@/components/ui/north-button';
import { NorthField } from '@/components/ui/north-field';
import { NorthScreen } from '@/components/ui/north-screen';
import { NorthText } from '@/components/ui/north-text';
import { Surface } from '@/components/ui/surface';
import { degreesForClose } from '@/domains/bearing/movement';
import { useJourney } from '@/domains/journey/store';
import { closeoutNotification } from '@/platform/haptics';
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

  const open = journey?.open;
  if (!open) return null;

  return (
    <NorthScreen contentStyle={styles.screen}>
      <View style={styles.head}>
        <NorthText variant="title">Did you do what you named?</NorthText>
        <NorthText>
          There is nothing to upload and nobody checking. Answer once, honestly, and move on.
        </NorthText>
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
        placeholder="One honest line, if it helps. Never required."
        value={note}
      />

      <View style={styles.actions}>
        <NorthButton label="I kept my word" onPress={keep} />
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

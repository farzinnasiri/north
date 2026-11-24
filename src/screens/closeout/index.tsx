import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { GLASS_AVAILABLE, GlassGroup } from '@/components/ui/glass';
import { NorthButton } from '@/components/ui/north-button';
import { NorthField } from '@/components/ui/north-field';
import { NorthScreen } from '@/components/ui/north-screen';
import { NorthText } from '@/components/ui/north-text';
import { Surface } from '@/components/ui/surface';
import type { Outcome } from '@/domains/actions/action';
import { earnedFor } from '@/domains/direction/movement';
import { useJourney } from '@/domains/journey/store';
import { closeoutNotification, commitImpact } from '@/platform/haptics';
import { playSoundCue } from '@/platform/sound';
import { colors, spacing } from '@/theme';

/**
 * The check-in, in one screen. Three honest answers and an optional note.
 * There is nothing to upload and nothing to prove.
 */
export function Closeout() {
  const journey = useJourney((state) => state.journey);
  const checkIn = useJourney((state) => state.checkIn);
  const [note, setNote] = useState(journey?.open?.note ?? '');
  const [showNote, setShowNote] = useState(false);
  const [targetId] = useState(() => journey?.open?.instanceId);

  const open = journey?.open;
  if (!journey || !open || open.instanceId !== targetId) return null;

  function answer(outcome: Outcome) {
    if (!targetId) return;
    const moved = checkIn({ instanceId: targetId, note: note.trim() === '' ? null : note.trim(), outcome });
    if (moved) {
      void closeoutNotification();
      playSoundCue('close-out', journey?.preferences.sound ?? false);
    } else {
      void commitImpact();
    }
    if (router.canGoBack()) router.back();
    else router.replace('/');
  }

  return (
    <NorthScreen bare={GLASS_AVAILABLE} contentStyle={styles.screen}>
      <View style={styles.head}>
        <NorthText variant="title">Did you do it?</NorthText>
        <NorthText>No proof needed. Say how it went.</NorthText>
      </View>

      <Surface>
        <NorthText variant="label">THE ONE THING</NorthText>
        <NorthText selectable style={styles.paper}>{open.action}</NorthText>
      </Surface>

      <GlassGroup style={styles.actions}>
        <NorthButton label={`I did it · ${earnedFor('done', open.days).toFixed(2)}°`} onPress={() => answer('done')} />
        <NorthButton label={`Partly · ${earnedFor('partly', open.days).toFixed(2)}°`} onPress={() => answer('partly')} tone="secondary" />
        <NorthButton label="I didn’t" onPress={() => answer('missed')} tone="quiet" />
      </GlassGroup>

      {showNote ? (
        <NorthField
          accessibilityLabel="Optional note"
          maxLength={2000}
          onChangeText={setNote}
          placeholder="One line on how it went, if you want."
          value={note}
        />
      ) : (
        <NorthButton label={open.note ? 'Edit note' : 'Add a note'} onPress={() => setShowNote(true)} tone="quiet" />
      )}
      <NorthText style={styles.footnote} variant="small">A miss moves nothing back.</NorthText>
    </NorthScreen>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: spacing.sm,
  },
  footnote: {
    textAlign: 'center',
  },
  head: {
    gap: spacing.sm,
  },
  paper: {
    color: colors.paper,
  },
  screen: {
    gap: spacing.lg,
  },
});

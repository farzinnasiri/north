import { useState } from 'react';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { NorthButton } from '@/components/ui/north-button';
import { NorthField } from '@/components/ui/north-field';
import { NorthScreen } from '@/components/ui/north-screen';
import { NorthText } from '@/components/ui/north-text';
import { useJourney } from '@/domains/journey/store';
import { spacing } from '@/theme';

/**
 * A Note is reflection, not evidence. It is never required, never shown to
 * anyone, and never used to decide whether an Action counted.
 */
export function Note() {
  const journey = useJourney((state) => state.journey);
  const save = useJourney((state) => state.note);
  const [text, setText] = useState(journey?.open?.note ?? '');

  if (!journey?.open) return null;

  return (
    <NorthScreen contentStyle={styles.screen}>
      <NorthText>
        Keep only what will matter when you read it back. This is not a journal and nothing here
        is graded.
      </NorthText>
      <NorthField
        accessibilityLabel="Action note"
        autoFocus
        onChangeText={setText}
        placeholder="Write one line."
        value={text}
      />
      <View style={styles.actions}>
        <NorthButton
          label="Keep the note"
          onPress={() => {
            save(text.trim());
            router.back();
          }}
        />
        <NorthButton label="Not now" onPress={() => router.back()} tone="quiet" />
      </View>
    </NorthScreen>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: spacing.sm,
  },
  screen: {
    gap: spacing.lg,
  },
});

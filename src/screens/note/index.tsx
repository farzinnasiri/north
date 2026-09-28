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
        Optional. Write what you want to remember.
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
          label="Save note"
          onPress={() => {
            save(text.trim());
            router.back();
          }}
        />
        <NorthButton label="Cancel" onPress={() => router.back()} tone="quiet" />
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

import { useState } from 'react';
import { router } from 'expo-router';
import { StyleSheet } from 'react-native';

import { GLASS_AVAILABLE, GlassGroup } from '@/components/ui/glass';
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
  const [targetId] = useState(() => journey?.open?.instanceId);

  if (!journey?.open || !targetId || journey.open.instanceId !== targetId) return null;

  return (
    <NorthScreen bare={GLASS_AVAILABLE} contentStyle={styles.screen}>
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
      <GlassGroup style={styles.actions}>
        <NorthButton
          label="Save note"
          onPress={() => {
            save(text);
            returnFromEditor();
          }}
        />
        <NorthButton label="Cancel" onPress={returnFromEditor} tone="quiet" />
      </GlassGroup>
    </NorthScreen>
  );
}

function returnFromEditor() {
  if (router.canGoBack()) router.back();
  else router.replace('/');
}

const styles = StyleSheet.create({
  actions: {
    gap: spacing.sm,
  },
  screen: {
    gap: spacing.lg,
  },
});

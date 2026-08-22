import { Alert, StyleSheet, Switch, View } from 'react-native';
import { router } from 'expo-router';

import { NorthRow } from '@/components/ui/north-row';
import { NorthScreen } from '@/components/ui/north-screen';
import { NorthText } from '@/components/ui/north-text';
import { Section } from '@/components/ui/section';
import { useJourney } from '@/domains/journey/store';
import { colors, spacing } from '@/theme';

/**
 * Settings is deliberately short. Almost everything a settings screen usually
 * offers — reminders, streak repair, goal editing, a notification schedule —
 * is a promise North made in the opposite direction, so the only switches here
 * are the ones that genuinely change what the app does.
 */
export function Settings() {
  const journey = useJourney((state) => state.journey);
  const preferences = useJourney((state) => state.preferences);
  const erase = useJourney((state) => state.erase);

  if (!journey) return null;

  return (
    <NorthScreen contentStyle={styles.screen}>
      <Section label="FEEDBACK">
        <NorthRow
          control={
            <Switch
              accessibilityLabel="Haptics"
              ios_backgroundColor={colors.line}
              onValueChange={(haptics) =>
                preferences({ ...journey.preferences, haptics })
              }
              thumbColor={colors.paper}
              trackColor={{ false: colors.line, true: colors.brassDim }}
              value={journey.preferences.haptics}
            />
          }
          detail="A tick when a dial moves, one impact when you close an action."
          label="Haptics"
        />
        <NorthRow
          detail="Four cues exist in the whole product, all of them in onboarding or at a closeout. They follow your silent switch."
          label="Sound"
        />
      </Section>

      <Section label="THE PROMISE" ruled>
        <NorthText style={styles.paper}>North will never notify you.</NorthText>
        <NorthText variant="small">
          No reminders, no streak warnings, no re-engagement. You signed for the responsibility
          and the app does not take it back by nagging you.
        </NorthText>
        <NorthText variant="small">
          Nothing is verified. Closing an action is your word, and it is enough.
        </NorthText>
        <NorthText variant="small">
          North is built to be finished. Reach north, hold it for thirty days, and it closes.
        </NorthText>
      </Section>

      <Section label="THIS DEVICE" ruled>
        <NorthRow detail="Frontend prototype · nothing leaves this phone" label="Where your data lives" />
        <NorthRow
          label="Start over"
          onPress={confirmErase}
          detail="Erases the contract, the bearing, and every action."
          tone="destructive"
        />
      </Section>

      <View style={styles.footer}>
        <NorthText variant="label">NORTH · V1 · LOCAL PROTOTYPE</NorthText>
      </View>
    </NorthScreen>
  );

  function confirmErase() {
    Alert.alert(
      'Start over?',
      'This erases your contract, your bearing, and everything you have closed. It cannot be undone.',
      [
        { style: 'cancel', text: 'Keep it' },
        {
          onPress: () => {
            erase();
            router.replace('/onboarding');
          },
          style: 'destructive',
          text: 'Erase everything',
        },
      ],
    );
  }
}

const styles = StyleSheet.create({
  footer: {
    alignItems: 'center',
    paddingTop: spacing.xl,
  },
  paper: {
    color: colors.paper,
  },
  screen: {
    gap: spacing.xl,
  },
});

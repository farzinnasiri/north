import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Switch, View } from 'react-native';

import { NorthButton } from '@/components/ui/north-button';
import { NorthField } from '@/components/ui/north-field';
import { NorthRow } from '@/components/ui/north-row';
import { NorthScreen } from '@/components/ui/north-screen';
import { NorthText } from '@/components/ui/north-text';
import { Section } from '@/components/ui/section';
import { useSignalTheme } from '@/components/ui/signal-theme';
import { useAccount } from '@/domains/account/store';
import { useJourney } from '@/domains/journey/store';
import type { SignalIdentity } from '@/domains/personalization/signal';
import { SIGNAL_IDENTITIES } from '@/domains/personalization/signal';
import { colors, radii, spacing } from '@/theme';

/** Frontend-only settings shaped around the few things North actually lets a person change. */
export function Settings() {
  const journey = useJourney((state) => state.journey);
  const preferences = useJourney((state) => state.preferences);
  const rename = useJourney((state) => state.rename);
  const erase = useJourney((state) => state.erase);
  const accountEmail = useAccount((state) => state.email);
  const accountName = useAccount((state) => state.name);
  const currentSignal = useAccount((state) => state.signalId);
  const logOut = useAccount((state) => state.logOut);
  const setAccountName = useAccount((state) => state.setName);
  const setSignal = useAccount((state) => state.setSignal);
  const signal = useSignalTheme();
  const [name, setName] = useState(accountName || journey?.name || '');

  if (!journey) return null;

  const savedName = accountName || journey.name;
  const nameChanged = name.trim().length > 0 && name.trim() !== savedName;

  return (
    <NorthScreen contentStyle={styles.screen}>
      <Section label="YOU">
        <View style={styles.field}>
          <NorthText variant="label">NAME</NorthText>
          <NorthField
            autoCapitalize="words"
            multiline={false}
            onChangeText={setName}
            returnKeyType="done"
            value={name}
          />
        </View>
        {nameChanged ? (
          <NorthButton
            label="Save name"
            onPress={() => {
              const next = name.trim();
              rename(next);
              setAccountName(next);
            }}
            style={styles.save}
          />
        ) : null}
        <View style={styles.field}>
          <NorthText variant="label">EMAIL</NorthText>
          <NorthField
            editable={false}
            multiline={false}
            value={accountEmail || 'Not connected in this prototype'}
          />
        </View>
      </Section>

      <Section label="PROFILE COLOR" ruled>
        <View style={styles.signalGrid}>
          {SIGNAL_IDENTITIES.map((identity) => (
            <SignalSetting
              identity={identity}
              key={identity.id}
              onPress={() => setSignal(identity.id)}
              selected={currentSignal === identity.id}
            />
          ))}
        </View>
      </Section>

      <Section label="FEEDBACK" ruled>
        <NorthRow
          control={(
            <Switch
              accessibilityLabel="Haptics"
              ios_backgroundColor={colors.line}
              onValueChange={(haptics) => preferences({ ...journey.preferences, haptics })}
              thumbColor={colors.paper}
              trackColor={{ false: colors.line, true: signal.muted }}
              value={journey.preferences.haptics}
            />
          )}
          detail="Feedback when controls change or confirm."
          label="Haptics"
        />
        <NorthRow
          control={(
            <Switch
              accessibilityLabel="Sound"
              ios_backgroundColor={colors.line}
              onValueChange={(sound) => preferences({ ...journey.preferences, sound })}
              thumbColor={colors.paper}
              trackColor={{ false: colors.line, true: signal.muted }}
              value={journey.preferences.sound}
            />
          )}
          detail="Sounds for closeout and Direction changes."
          label="Sound"
        />
      </Section>

      <Section label="ACCOUNT" ruled>
        <NorthRow
          detail="Leaves your local journey on this device."
          label="Log out"
          onPress={() => {
            logOut();
            router.replace('/welcome');
          }}
        />
        <NorthRow
          detail="Erases your Direction and every Action."
          label="Start over"
          onPress={confirmErase}
          tone="destructive"
        />
      </Section>

      <View style={styles.footer}>
        <NorthText variant="label">LOCAL FRONTEND PROTOTYPE</NorthText>
      </View>
    </NorthScreen>
  );

  function confirmErase() {
    Alert.alert(
      'Start over?',
      'This erases your Direction and everything you have closed. It cannot be undone.',
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

function SignalSetting({
  identity,
  onPress,
  selected,
}: {
  identity: SignalIdentity;
  onPress: () => void;
  selected: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={[
        styles.signalChoice,
        selected && { borderColor: identity.primary, backgroundColor: colors.fieldRaised },
      ]}
    >
      <View style={[styles.signalDisc, { backgroundColor: identity.primary }]}>
        <View style={[styles.signalCore, { backgroundColor: identity.light }]} />
      </View>
      <NorthText style={styles.signalLabel} variant="label">{identity.label}</NorthText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: spacing.sm,
  },
  footer: {
    alignItems: 'center',
    paddingTop: spacing.lg,
  },
  save: {
    minHeight: 54,
  },
  screen: {
    gap: spacing.xxl,
  },
  signalChoice: {
    alignItems: 'center',
    borderColor: colors.lineSoft,
    borderRadius: radii.card,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.md,
    width: '47%',
  },
  signalCore: {
    borderRadius: radii.full,
    height: 18,
    width: 18,
  },
  signalDisc: {
    alignItems: 'center',
    borderRadius: radii.full,
    height: 54,
    justifyContent: 'center',
    width: 54,
  },
  signalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  signalLabel: {
    color: colors.paper,
  },
});

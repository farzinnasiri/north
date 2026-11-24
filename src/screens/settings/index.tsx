import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Platform, Pressable, StyleSheet, Switch, View } from 'react-native';

import { InstrumentSlider } from '@/components/ui/instrument-slider';
import { NorthButton } from '@/components/ui/north-button';
import { NorthField } from '@/components/ui/north-field';
import { NorthRow } from '@/components/ui/north-row';
import { NorthScreen } from '@/components/ui/north-screen';
import { NorthText } from '@/components/ui/north-text';
import { Section } from '@/components/ui/section';
import { useSignalTheme } from '@/components/ui/signal-theme';
import { clockLabel } from '@/domains/actions/action';
import { useCatalogue } from '@/domains/content/store';
import { useJourney } from '@/domains/journey/store';
import { clearDraft } from '@/domains/onboarding/persistence';
import type { SignalIdentity } from '@/domains/personalization/signal';
import { SIGNAL_IDENTITIES } from '@/domains/personalization/signal';
import { allowCheckIns } from '@/platform/check-in';
import { colors, radii, spacing } from '@/theme';

/** Check-in time from 17:00 to 23:30, in half hours. */
const EARLIEST = 17 * 60;
const LATEST = 23 * 60 + 30;

/** Settings for a Journey that lives only on this phone. */
export function Settings() {
  const journey = useJourney((state) => state.journey);
  const preferences = useJourney((state) => state.preferences);
  const rename = useJourney((state) => state.rename);
  const erase = useJourney((state) => state.erase);
  const catalogue = useCatalogue((state) => state.catalogue);
  const signal = useSignalTheme();
  const [name, setName] = useState(journey?.name ?? '');
  const [denied, setDenied] = useState(false);

  if (!journey) return null;
  const nameChanged = name.trim().length > 0 && name.trim() !== journey.name;
  const minutes = journey.preferences.checkInMinutes;

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
        {nameChanged ? <NorthButton label="Save name" onPress={() => rename(name)} /> : null}
      </Section>

      <Section label="CHECK-IN" ruled>
        <NorthRow
          control={(
            <Switch
              accessibilityLabel="Check-in notification"
              ios_backgroundColor={colors.line}
              onValueChange={(on) => { void toggleCheckIns(on); }}
              thumbColor={colors.paper}
              trackColor={{ false: colors.line, true: signal.muted }}
              value={journey.preferences.checkIns}
            />
          )}
          detail={denied
            ? 'Notifications are off for North in iOS Settings.'
            : 'One notification, on the day you chose, asking if you did it.'}
          label="Ask me how it went"
        />
        <View style={styles.field}>
          <NorthText variant="label">{`TIME · ${clockLabel(minutes)}`}</NorthText>
          <InstrumentSlider
            accessibilityLabel="Check-in time"
            leftLabel={clockLabel(EARLIEST)}
            maximum={(LATEST - EARLIEST) / 30}
            minimum={0}
            onChange={(step) => preferences({ checkInMinutes: EARLIEST + step * 30 })}
            readout={clockLabel(minutes)}
            rightLabel={clockLabel(LATEST)}
            value={Math.round((Math.min(LATEST, Math.max(EARLIEST, minutes)) - EARLIEST) / 30)}
          />
        </View>
      </Section>

      <Section label="PROFILE COLOR" ruled>
        <View style={styles.signalGrid}>
          {SIGNAL_IDENTITIES.map((identity) => (
            <SignalSetting
              identity={identity}
              key={identity.id}
              onPress={() => preferences({ signal: identity.id })}
              selected={journey.preferences.signal === identity.id}
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
              onValueChange={(haptics) => preferences({ haptics })}
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
              onValueChange={(sound) => preferences({ sound })}
              thumbColor={colors.paper}
              trackColor={{ false: colors.line, true: signal.muted }}
              value={journey.preferences.sound}
            />
          )}
          detail="Sounds for the check-in and the needle."
          label="Sound"
        />
      </Section>

      <Section label="PRIVACY" ruled>
        <NorthText variant="small">
          {`No account. Your answers, actions and notes stay on this phone. North downloads its library of ${catalogue.lines.length} lines and sends nothing back.`}
        </NorthText>
        <NorthRow
          detail="Deletes your Journey, actions and notes from this phone. It cannot be undone."
          label="Erase everything"
          onPress={confirmErase}
          tone="destructive"
        />
      </Section>
    </NorthScreen>
  );

  async function toggleCheckIns(on: boolean) {
    if (!on) {
      preferences({ checkIns: false });
      return;
    }
    const allowed = await allowCheckIns();
    setDenied(!allowed);
    preferences({ checkIns: allowed });
  }

  function confirmErase() {
    const run = () => {
      erase();
      clearDraft();
      router.replace('/onboarding');
    };
    if (Platform.OS === 'web') {
      if (globalThis.confirm('Erase everything? This cannot be undone.')) run();
      return;
    }
    Alert.alert('Erase everything?', 'Your Journey, actions and notes are deleted from this phone. This cannot be undone.', [
      { style: 'cancel', text: 'Keep it' },
      { onPress: run, style: 'destructive', text: 'Erase' },
    ]);
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

import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';

import { NorthButton } from '@/components/ui/north-button';
import { NorthScreen } from '@/components/ui/north-screen';
import { NorthText } from '@/components/ui/north-text';
import { useAccount } from '@/domains/account/store';
import { useJourney } from '@/domains/journey/store';
import type { SignalIdentity } from '@/domains/personalization/signal';
import {
  SIGNAL_IDENTITIES,
  signalIdentity,
  suggestedSignal,
} from '@/domains/personalization/signal';
import { colors, radii, spacing } from '@/theme';

export function Personalize() {
  const { width } = useWindowDimensions();
  const journey = useJourney((state) => state.journey);
  const saved = useAccount((state) => state.signalId);
  const save = useAccount((state) => state.setSignal);
  const suggestion = suggestedSignal(journey?.northStar ?? null);
  const [selected, setSelected] = useState(saved === 'signal' ? suggestion : saved);
  const identity = signalIdentity(selected);
  const compact = width < 360;

  return (
    <NorthScreen contentStyle={styles.screen}>
      <View style={styles.copy}>
        <NorthText variant="label">PROFILE COLOR</NorthText>
        <NorthText variant="title">Make North look like yours.</NorthText>
      </View>

      <View style={styles.grid}>
        {SIGNAL_IDENTITIES.map((option) => (
          <SignalChoice
            compact={compact}
            key={option.id}
            onPress={() => setSelected(option.id)}
            option={option}
            selected={selected === option.id}
            suggested={suggestion === option.id}
          />
        ))}
      </View>

      <View style={styles.action}>
        <NorthButton
          label={`Use ${identity.label}`}
          onPress={() => {
            save(selected);
            router.replace('/');
          }}
          style={{ backgroundColor: identity.primary, borderColor: identity.primary }}
        />
      </View>
    </NorthScreen>
  );
}

function SignalChoice({
  compact,
  onPress,
  option,
  selected,
  suggested,
}: {
  compact: boolean;
  onPress: () => void;
  option: SignalIdentity;
  selected: boolean;
  suggested: boolean;
}) {
  return (
    <Pressable
      accessibilityLabel={`${option.label}${suggested ? ', suggested' : ''}`}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={[
        styles.choice,
        compact && styles.choiceCompact,
        selected && { borderColor: option.primary, backgroundColor: colors.fieldRaised },
      ]}
    >
      <View style={[styles.swatch, compact && styles.swatchCompact]}>
        <View style={[styles.swatchMain, { backgroundColor: option.primary }]} />
        <View style={styles.swatchRail}>
          <View style={[styles.swatchPart, { backgroundColor: option.light }]} />
          <View style={[styles.swatchPart, { backgroundColor: option.muted }]} />
        </View>
      </View>
      <View style={styles.choiceCopy}>
        <View style={styles.choiceTitle}>
          <NorthText style={styles.paper}>{option.label}</NorthText>
          {suggested ? <NorthText style={{ color: option.primary }} variant="label">SUGGESTED</NorthText> : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  action: {
    marginTop: 'auto',
    paddingTop: spacing.lg,
  },
  choice: {
    borderColor: colors.lineSoft,
    borderCurve: 'continuous',
    borderRadius: radii.card,
    borderWidth: 1,
    gap: spacing.md,
    minHeight: 164,
    padding: spacing.md,
    width: '48%',
  },
  choiceCompact: {
    alignItems: 'center',
    flexDirection: 'row',
    minHeight: 108,
    width: '100%',
  },
  choiceCopy: {
    flex: 1,
    gap: spacing.sm,
  },
  choiceTitle: {
    gap: spacing.xs,
  },
  copy: {
    gap: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  paper: {
    color: colors.paper,
  },
  screen: {
    flexGrow: 1,
    minHeight: '100%',
  },
  swatch: {
    flexDirection: 'row',
    gap: spacing.xs,
    height: 70,
  },
  swatchMain: {
    borderRadius: radii.control,
    flex: 2,
  },
  swatchCompact: {
    flexBasis: 104,
    flexGrow: 0,
    height: 76,
    width: 104,
  },
  swatchPart: {
    borderRadius: radii.control,
    flex: 1,
  },
  swatchRail: {
    flex: 1,
    gap: spacing.xs,
  },
});

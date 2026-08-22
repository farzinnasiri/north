import { Pressable, StyleSheet, View } from 'react-native';

import { NorthText } from '@/components/ui/north-text';
import { selectionTick } from '@/platform/haptics';
import { colors, motion, radii, spacing } from '@/theme';

type TallyInstrumentProps = {
  count: number;
  onChange: (count: number) => void;
};

/**
 * Gate of five: four uprights struck through by a diagonal. The previous
 * version printed pipe characters in a wrapping row, which stopped being
 * countable at about eight — the one thing a tally has to be.
 */
function Gate({ strokes }: { strokes: number }) {
  return (
    <View style={styles.gate}>
      {Array.from({ length: Math.min(strokes, 4) }, (_, index) => (
        <View key={index} style={styles.upright} />
      ))}
      {strokes === 5 ? <View style={styles.strike} /> : null}
    </View>
  );
}

export function TallyInstrument({ count, onChange }: TallyInstrumentProps) {
  function change(next: number) {
    void selectionTick();
    onChange(Math.max(0, next));
  }

  const gates = Array.from({ length: Math.ceil(count / 5) }, (_, index) =>
    Math.min(5, count - index * 5),
  );

  return (
    <View style={styles.container}>
      <Pressable
        accessibilityHint="Adds one"
        accessibilityLabel={`${count} instances`}
        accessibilityRole="button"
        onPress={() => change(count + 1)}
        style={({ pressed }) => [styles.field, pressed && styles.pressed]}
      >
        <NorthText accessibilityLiveRegion="polite" style={styles.count} variant="data">
          {count}
        </NorthText>
        <View style={styles.gates}>
          {gates.map((strokes, index) => (
            <Gate key={index} strokes={strokes} />
          ))}
        </View>
        <View style={styles.addAffordance}>
          <View style={styles.plusRing}>
            <NorthText style={styles.plus}>+</NorthText>
          </View>
          <NorthText style={styles.hint} variant="label">
            TAP TO ADD ONE
          </NorthText>
        </View>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        disabled={count === 0}
        onPress={() => change(count - 1)}
        style={[styles.remove, count === 0 && styles.removeDisabled]}
      >
        <NorthText style={styles.removeLabel} variant="label">
          REMOVE ONE
        </NorthText>
      </Pressable>
    </View>
  );
}

type StepperInstrumentProps = TallyInstrumentProps;

export function StepperInstrument({ count, onChange }: StepperInstrumentProps) {
  function change(next: number) {
    if (next >= 0) {
      void selectionTick();
      onChange(next);
    }
  }

  return (
    <View style={styles.stepper}>
      <Pressable
        accessibilityLabel="Decrease"
        accessibilityRole="button"
        disabled={count === 0}
        onPress={() => change(count - 1)}
        style={({ pressed }) => [styles.step, pressed && styles.pressed]}
      >
        <NorthText style={styles.stepLabel}>−</NorthText>
      </Pressable>
      <NorthText accessibilityLiveRegion="polite" style={styles.stepCount} variant="data">
        {count}
      </NorthText>
      <Pressable
        accessibilityLabel="Increase"
        accessibilityRole="button"
        onPress={() => change(count + 1)}
        style={({ pressed }) => [styles.step, pressed && styles.pressed]}
      >
        <NorthText style={styles.stepLabel}>+</NorthText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xl,
  },
  count: {
    color: colors.paper,
    fontSize: 96,
    lineHeight: 102,
  },
  addAffordance: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  field: {
    alignItems: 'center',
    borderColor: colors.line,
    borderCurve: 'continuous',
    borderRadius: radii.card,
    borderWidth: 1,
    gap: spacing.lg,
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
  plus: {
    color: colors.brass,
    fontSize: 15,
    lineHeight: 18,
  },
  plusRing: {
    alignItems: 'center',
    borderColor: colors.brassDim,
    borderRadius: 11,
    borderWidth: 1,
    height: 22,
    justifyContent: 'center',
    width: 22,
  },
  gate: {
    flexDirection: 'row',
    gap: 5,
    height: 26,
    width: 34,
  },
  gates: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    justifyContent: 'center',
    minHeight: 26,
  },
  hint: {
    color: colors.slate,
  },
  pressed: {
    backgroundColor: colors.field,
    opacity: motion.pressOpacity,
  },
  remove: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  removeDisabled: {
    opacity: 0.3,
  },
  removeLabel: {
    color: colors.slate,
  },
  step: {
    alignItems: 'center',
    borderColor: colors.line,
    borderRadius: 999,
    borderWidth: 1,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  stepCount: {
    color: colors.paper,
    fontSize: 72,
    lineHeight: 78,
    minWidth: 120,
    textAlign: 'center',
  },
  stepLabel: {
    color: colors.ash,
    fontSize: 26,
    lineHeight: 30,
  },
  stepper: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.lg,
    justifyContent: 'center',
  },
  strike: {
    backgroundColor: colors.brassDim,
    height: 2,
    left: -3,
    position: 'absolute',
    top: 12,
    transform: [{ rotate: '-20deg' }],
    width: 40,
  },
  upright: {
    backgroundColor: colors.brassDim,
    height: 26,
    width: 2,
  },
});

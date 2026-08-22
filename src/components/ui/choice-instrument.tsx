import { Pressable, StyleSheet, View } from 'react-native';

import { NorthText } from '@/components/ui/north-text';
import { selectionTick } from '@/platform/haptics';
import { colors, motion, spacing } from '@/theme';

type Choice = {
  detail?: string;
  label: string;
  value: string;
};

type ChoiceInstrumentProps = {
  multiple?: boolean;
  onChange: (values: string[]) => void;
  options: readonly Choice[];
  presentation?: 'chips' | 'doors' | 'marks';
  values: readonly string[];
};

/**
 * Every row carries a selector on the right — an open ring that fills brass
 * when chosen. The previous version signalled selection with nothing but a
 * change of text colour, which read as prose rather than a control: people
 * looked at the screen and did not know they were meant to tap it. The ring is
 * the affordance; the hairlines keep it quiet.
 */
function Selector({ multiple, selected }: { multiple: boolean; selected: boolean }) {
  return (
    <View style={[styles.ring, multiple && styles.ringSquare, selected && styles.ringOn]}>
      {selected ? <View style={[styles.pip, multiple && styles.pipSquare]} /> : null}
    </View>
  );
}

function Row({
  choice,
  multiple,
  onPress,
  selected,
}: {
  choice: Choice;
  multiple: boolean;
  onPress: () => void;
  selected: boolean;
}) {
  return (
    <Pressable
      accessibilityRole={multiple ? 'checkbox' : 'radio'}
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={styles.copy}>
        <NorthText style={selected ? styles.chosen : styles.unchosen}>{choice.label}</NorthText>
        {choice.detail ? <NorthText variant="small">{choice.detail}</NorthText> : null}
      </View>
      <Selector multiple={multiple} selected={selected} />
    </Pressable>
  );
}

/**
 * A wrapping field of chips, sized to their own text. Twelve short options as
 * full-width rows needs about eight hundred vertical pixels and a scroll; the
 * same twelve as chips take four rows and fit the fixed content slot, which is
 * what lets a screen stay a screen.
 */
function Chip({
  choice,
  onPress,
  selected,
}: {
  choice: Choice;
  onPress: () => void;
  selected: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={({ pressed }) => [styles.chip, selected && styles.chipOn, pressed && styles.pressed]}
    >
      <NorthText style={selected ? styles.chipTextOn : styles.chipText}>{choice.label}</NorthText>
      {choice.detail ? (
        <NorthText style={styles.chipDetail} variant="label">
          {choice.detail}
        </NorthText>
      ) : null}
    </Pressable>
  );
}

function Door({
  choice,
  onPress,
  selected,
}: {
  choice: Choice;
  onPress: () => void;
  selected: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={({ pressed }) => [styles.door, pressed && styles.doorPressed]}
    >
      <NorthText style={selected ? styles.doorChosen : styles.doorLabel} variant="heading">
        {choice.label}
      </NorthText>
      <View style={[styles.doorRule, selected && styles.doorRuleOn]} />
    </Pressable>
  );
}

export function ChoiceInstrument({
  multiple = false,
  onChange,
  options,
  presentation = 'marks',
  values,
}: ChoiceInstrumentProps) {
  function choose(value: string) {
    void selectionTick();
    if (!multiple) {
      onChange([value]);
      return;
    }
    onChange(values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);
  }

  if (presentation === 'chips') {
    return (
      <View style={styles.chips}>
        {options.map((option) => (
          <Chip
            choice={option}
            key={option.value}
            onPress={() => choose(option.value)}
            selected={values.includes(option.value)}
          />
        ))}
      </View>
    );
  }

  if (presentation === 'doors') {
    return (
      <View style={styles.doors}>
        {options.map((option, index) => (
          <View key={option.value} style={styles.doorCell}>
            {index > 0 ? <View style={styles.seam} /> : null}
            <Door
              choice={option}
              onPress={() => choose(option.value)}
              selected={values.includes(option.value)}
            />
          </View>
        ))}
      </View>
    );
  }

  return (
    <View style={styles.list}>
      {options.map((option) => (
        <Row
          choice={option}
          key={option.value}
          multiple={multiple}
          onPress={() => choose(option.value)}
          selected={values.includes(option.value)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignItems: 'center',
    borderColor: colors.line,
    borderCurve: 'continuous',
    borderRadius: 10,
    borderWidth: 1,
    gap: 1,
    // A chip has no intrinsic width cap by default, so a label longer than the
    // row grows the chip to its natural single-line width instead of wrapping
    // — past both screen edges on a long sentence. This forces a wrap instead.
    maxWidth: '92%',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  chipDetail: {
    color: colors.slate,
  },
  chipOn: {
    backgroundColor: colors.fieldRaised,
    borderColor: colors.brass,
  },
  chipText: {
    color: colors.ash,
  },
  chipTextOn: {
    color: colors.paper,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  chosen: {
    color: colors.paper,
  },
  copy: {
    flex: 1,
    gap: spacing.xs,
  },
  door: {
    alignItems: 'center',
    flex: 1,
    gap: spacing.lg,
    justifyContent: 'center',
    minWidth: 0,
    paddingHorizontal: spacing.md,
  },
  doorCell: {
    flex: 1,
    minWidth: 0,
  },
  doorChosen: {
    color: colors.paper,
    maxWidth: '100%',
    textAlign: 'center',
  },
  doorLabel: {
    color: colors.ash,
    maxWidth: '100%',
    textAlign: 'center',
  },
  doorPressed: {
    backgroundColor: colors.field,
  },
  doorRule: {
    backgroundColor: colors.line,
    height: 2,
    width: 22,
  },
  doorRuleOn: {
    backgroundColor: colors.brass,
    width: 44,
  },
  doors: {
    flexDirection: 'row',
    marginHorizontal: -spacing.screen,
    minHeight: 220,
  },
  list: {
    borderTopColor: colors.lineSoft,
    borderTopWidth: 1,
  },
  pip: {
    backgroundColor: colors.brass,
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  pipSquare: {
    borderRadius: 2,
  },
  pressed: {
    backgroundColor: colors.field,
    opacity: motion.pressOpacity,
  },
  ring: {
    alignItems: 'center',
    borderColor: colors.line,
    borderRadius: 11,
    borderWidth: 1,
    height: 22,
    justifyContent: 'center',
    width: 22,
  },
  ringOn: {
    borderColor: colors.brass,
  },
  ringSquare: {
    borderRadius: 4,
  },
  row: {
    alignItems: 'center',
    borderBottomColor: colors.lineSoft,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: spacing.lg,
    minHeight: 64,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.md,
  },
  seam: {
    backgroundColor: colors.lineSoft,
    bottom: 0,
    left: 0,
    position: 'absolute',
    top: 0,
    width: 1,
  },
  unchosen: {
    color: colors.paper,
  },
});

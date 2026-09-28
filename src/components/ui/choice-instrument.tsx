import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';

import { NorthText } from '@/components/ui/north-text';
import { useSignalTheme } from '@/components/ui/signal-theme';
import { selectionTick } from '@/platform/haptics';
import { colors, motion, radii, spacing } from '@/theme';

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
 * The trailing graduation makes each plate read as part of an instrument. A
 * choice raises the plate and turns that graduation into the Signal, joining
 * the selected answer to the enabled action without generic form chrome.
 */
function Selector({ multiple, selected }: { multiple: boolean; selected: boolean }) {
  const signal = useSignalTheme();

  return (
    <View
      style={[
        styles.mark,
        multiple && styles.markMultiple,
        selected && styles.markOn,
        selected && { backgroundColor: signal.primary, borderColor: signal.primary },
      ]}
    />
  );
}

function Row({
  choice,
  compact,
  multiple,
  onPress,
  selected,
}: {
  choice: Choice;
  compact: boolean;
  multiple: boolean;
  onPress: () => void;
  selected: boolean;
}) {
  return (
    <Pressable
      accessibilityRole={multiple ? 'checkbox' : 'radio'}
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        compact && styles.rowCompact,
        selected && styles.rowOn,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.copy}>
        <NorthText style={selected ? styles.chosen : styles.unchosen}>
          {choice.label}
        </NorthText>
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
      style={({ pressed }) => [
        styles.door,
        selected && styles.doorOn,
        pressed && styles.doorPressed,
      ]}
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
  const { height, width } = useWindowDimensions();
  const compact = width < 360;
  const compactRows = height < 1000;

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
      <View style={[styles.doors, compact && styles.doorsCompact]}>
        {options.map((option, index) => (
          <View key={option.value} style={styles.doorCell}>
            {index > 0 ? (
              <View
                style={[
                  styles.seam,
                  compact ? styles.seamHorizontal : styles.seamVertical,
                ]}
              />
            ) : null}
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
    <View style={[styles.list, compactRows && styles.listCompact]}>
      {options.map((option) => (
        <Row
          choice={option}
          compact={compactRows}
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
    backgroundColor: colors.field,
    borderRadius: radii.control,
    borderWidth: 1,
    gap: 1,
    // A chip has no intrinsic width cap by default, so a label longer than the
    // row grows the chip to its natural single-line width instead of wrapping
    // — past both screen edges on a long sentence. This forces a wrap instead.
    flexShrink: 1,
    maxWidth: '100%',
    minHeight: 44,
    minWidth: 0,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  chipDetail: {
    color: colors.slate,
  },
  chipOn: {
    backgroundColor: colors.brass,
    borderColor: colors.brass,
  },
  chipText: {
    color: colors.ash,
    flexShrink: 1,
    textAlign: 'center',
  },
  chipTextOn: {
    color: colors.brassOn,
    flexShrink: 1,
    textAlign: 'center',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'flex-start',
  },
  chosen: {
    color: colors.paper,
  },
  copy: {
    flex: 1,
    gap: spacing.xs,
    minWidth: 0,
  },
  door: {
    alignItems: 'flex-start',
    backgroundColor: colors.field,
    borderColor: colors.line,
    borderRadius: radii.card,
    borderWidth: 1,
    flex: 1,
    gap: spacing.md,
    justifyContent: 'center',
    minHeight: 88,
    minWidth: 0,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  doorCell: {
    minWidth: 0,
  },
  doorChosen: {
    color: colors.brassOn,
    flexShrink: 1,
    maxWidth: '100%',
    textAlign: 'left',
    width: '100%',
  },
  doorLabel: {
    color: colors.paper,
    flexShrink: 1,
    maxWidth: '100%',
    textAlign: 'left',
    width: '100%',
  },
  doorPressed: {
    opacity: motion.pressOpacity,
  },
  doorOn: {
    backgroundColor: colors.brass,
    borderColor: colors.brass,
  },
  doorRule: {
    backgroundColor: colors.line,
    height: 3,
    width: 28,
  },
  doorRuleOn: {
    backgroundColor: colors.brassOn,
    width: 64,
  },
  doors: {
    gap: spacing.md,
    minHeight: 188,
  },
  doorsCompact: {
    minHeight: 176,
  },
  list: {
    gap: spacing.sm,
    minWidth: 0,
    width: '100%',
  },
  listCompact: {
    gap: 6,
  },
  pressed: {
    opacity: motion.pressOpacity,
  },
  mark: {
    backgroundColor: colors.line,
    height: 2,
    width: 22,
  },
  markMultiple: {
    backgroundColor: 'transparent',
    borderColor: colors.line,
    borderRadius: 3,
    borderWidth: 1,
    height: 18,
    width: 18,
  },
  markOn: {
    height: 3,
    width: 32,
  },
  row: {
    alignItems: 'center',
    backgroundColor: colors.field,
    borderColor: colors.line,
    borderRadius: radii.card,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.lg,
    minHeight: 72,
    minWidth: 0,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  rowCompact: {
    minHeight: 44,
    paddingVertical: spacing.sm,
  },
  rowOn: {
    backgroundColor: colors.fieldRaised,
  },
  seam: {
    backgroundColor: colors.lineSoft,
    position: 'absolute',
  },
  seamHorizontal: {
    height: 1,
    left: 0,
    right: 0,
    top: 0,
  },
  seamVertical: {
    bottom: 0,
    left: 0,
    top: 0,
    width: 1,
  },
  unchosen: {
    color: colors.paper,
  },
});

import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

import { NorthText } from '@/components/ui/north-text';
import { selectionTick } from '@/platform/haptics';
import { colors, spacing } from '@/theme';

type DayBarProps = {
  onChange: (hours: number) => void;
  value: number;
};

const HOURS = 24;

/**
 * A day, drawn as a day. Twenty-four cells with the waking hours marked, filled
 * from the left by dragging — so the answer is read against the whole of a day
 * rather than as a position on an anonymous slider. Seeing the filled portion
 * against the twenty-four is the entire point of the question.
 */
export function DayBar({ onChange, value }: DayBarProps) {
  const [width, setWidth] = useState(320);

  function setFrom(x: number) {
    const cell = Math.round((Math.min(width, Math.max(0, x)) / width) * HOURS);
    const next = Math.min(HOURS, Math.max(0, cell));
    if (next !== value) {
      void selectionTick();
      onChange(next);
    }
  }

  const gesture = Gesture.Pan()
    .runOnJS(true)
    .onBegin((event) => setFrom(event.x))
    .onUpdate((event) => setFrom(event.x));

  return (
    <View style={styles.instrument}>
      <View style={styles.readout}>
        <NorthText style={styles.hours} variant="data">
          {value}
        </NorthText>
        <NorthText style={styles.of} variant="heading">
          {value === 1 ? 'hour of the day' : 'hours of the day'}
        </NorthText>
      </View>

      <GestureDetector gesture={gesture}>
        <View
          accessibilityActions={[{ name: 'decrement' }, { name: 'increment' }]}
          accessibilityLabel="Hours spent watching other people live"
          accessibilityRole="adjustable"
          accessibilityValue={{ max: HOURS, min: 0, now: value }}
          onAccessibilityAction={(event) => {
            if (event.nativeEvent.actionName === 'increment') setFrom(((value + 1) / HOURS) * width);
            if (event.nativeEvent.actionName === 'decrement') setFrom(((value - 1) / HOURS) * width);
          }}
          onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
          style={styles.bar}
        >
          {Array.from({ length: HOURS }, (_, hour) => (
            <View key={hour} style={[styles.cell, hour < value && styles.cellOn]} />
          ))}
        </View>
      </GestureDetector>

      <View style={styles.scale}>
        <NorthText style={styles.mark} variant="label">
          MIDNIGHT
        </NorthText>
        <NorthText style={styles.mark} variant="label">
          NOON
        </NorthText>
        <NorthText style={styles.mark} variant="label">
          MIDNIGHT
        </NorthText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    gap: 2,
    height: 72,
  },
  cell: {
    backgroundColor: colors.field,
    borderColor: colors.lineSoft,
    borderRadius: 2,
    borderWidth: 1,
    flex: 1,
  },
  cellOn: {
    backgroundColor: colors.brass,
    borderColor: colors.brass,
  },
  hours: {
    color: colors.paper,
    fontSize: 72,
    lineHeight: 78,
  },
  instrument: {
    gap: spacing.lg,
  },
  mark: {
    color: colors.slate,
  },
  of: {
    color: colors.ash,
  },
  readout: {
    alignItems: 'baseline',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'center',
  },
  scale: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

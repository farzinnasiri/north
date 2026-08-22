import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

import { NorthText } from '@/components/ui/north-text';
import { selectionTick } from '@/platform/haptics';
import { colors, spacing } from '@/theme';

type NumberTapeProps = {
  accessibilityLabel: string;
  /** Draw a taller, labelled graduation every N steps. */
  major?: number;
  maximum: number;
  minimum: number;
  onChange: (value: number) => void;
  value: number;
};

const TICK = 16;

/**
 * A measuring tape read against a fixed brass index, rather than a dropdown.
 * Picking one number out of forty-five in a system picker means a wheel on iOS
 * and a full-height list on web, neither of which belongs in a flow built from
 * hairlines and marks. Dragging is fast, the arrows are exact, and a screen
 * reader gets increment and decrement.
 */
export function NumberTape({
  accessibilityLabel,
  major = 5,
  maximum,
  minimum,
  onChange,
  value,
}: NumberTapeProps) {
  const [width, setWidth] = useState(320);
  const [anchor, setAnchor] = useState(value);
  const steps = Array.from({ length: maximum - minimum + 1 }, (_, index) => minimum + index);

  function commit(next: number) {
    const clamped = Math.min(maximum, Math.max(minimum, next));
    if (clamped !== value) {
      void selectionTick();
      onChange(clamped);
    }
  }

  const gesture = Gesture.Pan()
    .runOnJS(true)
    .onBegin(() => setAnchor(value))
    .onUpdate((event) => commit(anchor - Math.round(event.translationX / TICK)));

  const offset = width / 2 - (value - minimum) * TICK;

  return (
    <View style={styles.instrument}>
      <NorthText style={styles.readout} variant="data">
        {value}
      </NorthText>

      <GestureDetector gesture={gesture}>
        <View
          accessibilityActions={[{ name: 'decrement' }, { name: 'increment' }]}
          accessibilityLabel={accessibilityLabel}
          accessibilityRole="adjustable"
          accessibilityValue={{ max: maximum, min: minimum, now: value }}
          onAccessibilityAction={(event) => {
            if (event.nativeEvent.actionName === 'increment') commit(value + 1);
            if (event.nativeEvent.actionName === 'decrement') commit(value - 1);
          }}
          onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
          style={styles.tape}
        >
          {steps.map((step, index) => {
            const isMajor = step % major === 0;
            return (
              <View
                key={step}
                style={[
                  styles.tick,
                  isMajor && styles.tickMajor,
                  { left: offset + index * TICK },
                ]}
              />
            );
          })}
          <View style={styles.index} />
        </View>
      </GestureDetector>

      <View style={styles.arrows}>
        <Pressable
          accessibilityLabel="Lower"
          accessibilityRole="button"
          onPress={() => commit(value - 1)}
          style={styles.arrow}
        >
          <NorthText style={styles.arrowLabel} variant="label">
            −
          </NorthText>
        </Pressable>
        <NorthText style={styles.hint} variant="label">
          DRAG TO SET
        </NorthText>
        <Pressable
          accessibilityLabel="Higher"
          accessibilityRole="button"
          onPress={() => commit(value + 1)}
          style={styles.arrow}
        >
          <NorthText style={styles.arrowLabel} variant="label">
            +
          </NorthText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  arrow: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  arrowLabel: {
    color: colors.ash,
    fontSize: 20,
  },
  arrows: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  hint: {
    color: colors.slate,
  },
  index: {
    backgroundColor: colors.brass,
    bottom: 0,
    left: '50%',
    marginLeft: -1,
    position: 'absolute',
    top: 0,
    width: 2,
  },
  instrument: {
    gap: spacing.xl,
  },
  readout: {
    alignSelf: 'center',
    color: colors.paper,
    fontSize: 76,
    lineHeight: 84,
  },
  tape: {
    height: 48,
    justifyContent: 'center',
    marginHorizontal: -spacing.screen,
    overflow: 'hidden',
  },
  tick: {
    backgroundColor: colors.line,
    height: 14,
    position: 'absolute',
    top: 17,
    width: 1,
  },
  tickMajor: {
    backgroundColor: colors.ash,
    height: 28,
    top: 10,
  },
});

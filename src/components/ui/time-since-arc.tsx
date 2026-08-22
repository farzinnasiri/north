import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

import { NorthText } from '@/components/ui/north-text';
import { selectionTick } from '@/platform/haptics';
import { colors, motion, spacing } from '@/theme';

type TimeSinceArcProps = {
  onChange: (index: number) => void;
  options: readonly string[];
  value: number | null;
};

const ROW = 60;

/**
 * A graduated scale, not a decorative curve. Each stop owns a row and draws its
 * own tick, so the marks and their labels cannot drift apart — the previous
 * version sampled a Bezier for the dots while laying the labels out evenly, and
 * the middle stops sat 28px below their own text.
 */
export function TimeSinceArc({ onChange, options, value }: TimeSinceArcProps) {
  const [height, setHeight] = useState(ROW * options.length);

  function choose(index: number) {
    const next = Math.min(options.length - 1, Math.max(0, index));
    if (next !== value) {
      void selectionTick();
      onChange(next);
    }
  }

  const gesture = Gesture.Pan()
    .runOnJS(true)
    .onBegin((event) => choose(Math.floor(event.y / (height / options.length))))
    .onUpdate((event) => choose(Math.floor(event.y / (height / options.length))));

  return (
    <GestureDetector gesture={gesture}>
      <View
        onLayout={(event) => setHeight(event.nativeEvent.layout.height)}
        style={styles.scale}
      >
        <View style={styles.axis} />
        {options.map((option, index) => {
          const selected = index === value;
          return (
            <Pressable
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              key={option}
              onPress={() => choose(index)}
              style={({ pressed }) => [styles.row, pressed && styles.pressed]}
            >
              <View style={[styles.tick, selected && styles.tickMark]} />
              <NorthText style={selected ? styles.chosen : styles.unchosen}>{option}</NorthText>
              <View style={[styles.ring, selected && styles.ringOn]}>
                {selected ? <View style={styles.pip} /> : null}
              </View>
            </Pressable>
          );
        })}
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  axis: {
    backgroundColor: colors.lineSoft,
    bottom: ROW / 2,
    left: 0,
    position: 'absolute',
    top: ROW / 2,
    width: 1,
  },
  chosen: {
    color: colors.paper,
  },
  pressed: {
    opacity: motion.pressOpacity,
  },
  pip: {
    backgroundColor: colors.brass,
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  ring: {
    alignItems: 'center',
    borderColor: colors.line,
    borderRadius: 11,
    borderWidth: 1,
    height: 22,
    justifyContent: 'center',
    marginLeft: 'auto',
    width: 22,
  },
  ringOn: {
    borderColor: colors.brass,
  },
  row: {
    alignItems: 'center',
    borderBottomColor: colors.lineSoft,
    borderBottomWidth: 1,
    flexDirection: 'row',
    height: ROW,
  },
  scale: {
    paddingLeft: 0,
  },
  tick: {
    backgroundColor: colors.line,
    height: 1,
    marginRight: spacing.lg,
    width: 12,
  },
  tickMark: {
    backgroundColor: colors.brass,
    height: 2,
    width: 26,
  },
  unchosen: {
    color: colors.paper,
  },
});

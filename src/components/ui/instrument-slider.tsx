import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useReducedMotion } from 'react-native-reanimated';

import { NorthText } from '@/components/ui/north-text';
import { selectionTick } from '@/platform/haptics';
import { colors, motion, spacing } from '@/theme';

const MARKER_WIDTH = 28;

type InstrumentSliderProps = {
  accessibilityLabel: string;
  leftLabel: string;
  maximum: number;
  minimum?: number;
  onChange: (value: number) => void;
  readout?: string;
  rightLabel: string;
  step?: number;
  value: number;
};

export function InstrumentSlider({
  accessibilityLabel,
  leftLabel,
  maximum,
  minimum = 0,
  onChange,
  readout,
  rightLabel,
  step = 1,
  value,
}: InstrumentSliderProps) {
  const reduceMotion = useReducedMotion();
  const [width, setWidth] = useState(1);

  function setFromX(x: number) {
    const ratio = Math.min(1, Math.max(0, x / width));
    const next = Math.round((minimum + ratio * (maximum - minimum)) / step) * step;
    if (next !== value) {
      void selectionTick();
      onChange(next);
    }
  }

  function adjust(direction: -1 | 1) {
    const next = Math.min(maximum, Math.max(minimum, value + direction * step));
    if (next !== value) {
      void selectionTick();
      onChange(next);
    }
  }

  const gesture = Gesture.Pan()
    .runOnJS(true)
    .onBegin((event) => setFromX(event.x))
    .onUpdate((event) => setFromX(event.x));
  const ratio = (value - minimum) / (maximum - minimum);
  const markerLeft = ratio * Math.max(0, width - MARKER_WIDTH);

  return (
    <View style={styles.instrument}>
      {readout ? (
        <NorthText style={styles.readout} variant="data">
          {readout}
        </NorthText>
      ) : null}
      <GestureDetector gesture={gesture}>
        <View
          accessibilityActions={[{ name: 'decrement' }, { name: 'increment' }]}
          accessibilityLabel={accessibilityLabel}
          accessibilityRole="adjustable"
          accessibilityValue={{ max: maximum, min: minimum, now: value, text: readout }}
          onAccessibilityAction={(event) => {
            if (event.nativeEvent.actionName === 'increment') adjust(1);
            if (event.nativeEvent.actionName === 'decrement') adjust(-1);
          }}
          onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
          style={styles.touchArea}
        >
          <View style={styles.track}>
            <Animated.View
              style={[
                styles.fill,
                {
                  width: `${ratio * 100}%`,
                  transitionDuration: reduceMotion ? 0 : motion.quick,
                  transitionProperty: ['width'],
                  transitionTimingFunction: motion.easingStandard,
                },
              ]}
            />
          </View>
          {/* The grip travels to the graduation rather than teleporting onto
              it. Transform, not `left`: the marker is the one thing on this
              control that moves, and it must not cost a layout pass. */}
          <Animated.View
            testID="slider-grip"
            style={[
              styles.marker,
              {
                transform: [{ translateX: markerLeft }],
                transitionDuration: reduceMotion ? 0 : motion.quick,
                transitionProperty: ['transform'],
                transitionTimingFunction: motion.easingStandard,
              },
            ]}
          > 
            <View style={styles.grip} />
            <View style={styles.grip} />
            <View style={styles.grip} />
          </Animated.View>
        </View>
      </GestureDetector>
      <View style={styles.labels}>
        <NorthText style={styles.endpointLabel} variant="small">
          {leftLabel}
        </NorthText>
        <NorthText style={[styles.endpointLabel, styles.rightLabel]} variant="small">
          {rightLabel}
        </NorthText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    backgroundColor: colors.brassDim,
    height: 1,
  },
  endpointLabel: {
    flex: 1,
    minWidth: 0,
  },
  instrument: {
    gap: spacing.xl,
    paddingTop: spacing.md,
  },
  labels: {
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  marker: {
    alignItems: 'center',
    left: 0,
    backgroundColor: colors.fieldRaised,
    borderColor: colors.brass,
    borderRadius: 4,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 2,
    height: 32,
    justifyContent: 'center',
    position: 'absolute',
    top: 6,
    width: MARKER_WIDTH,
  },
  grip: {
    backgroundColor: colors.brass,
    height: 12,
    width: 1,
  },
  readout: {
    alignSelf: 'center',
    color: colors.paper,
    fontSize: 44,
    lineHeight: 52,
  },
  rightLabel: {
    textAlign: 'right',
  },
  touchArea: {
    height: 44,
    justifyContent: 'center',
  },
  track: {
    backgroundColor: colors.lineSoft,
    height: 1,
    overflow: 'hidden',
  },
});

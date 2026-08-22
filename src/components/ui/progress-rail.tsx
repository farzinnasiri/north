import { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { colors, motion, spacing } from '@/theme';

type ProgressRailProps = {
  /** Index of the movement in progress. */
  current: number;
  /** How far through the current movement, 0-1. */
  fraction: number;
  labels: readonly string[];
};

type ProgressSegmentProps = {
  active: boolean;
  progress: number;
};

function ProgressSegment({ active, progress }: ProgressSegmentProps) {
  const reduceMotion = useReducedMotion();
  const fill = useSharedValue(progress);
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      fill.value = progress;
      return;
    }

    fill.value = withTiming(progress, {
      duration: reduceMotion ? 0 : motion.settle,
      easing: Easing.bezier(0.32, 0.72, 0, 1),
    });
  }, [fill, progress, reduceMotion]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${Math.max(0, Math.min(1, fill.value)) * 100}%`,
  }));

  return (
    <View style={styles.track}>
      <Animated.View style={[styles.fill, active ? styles.active : styles.done, fillStyle]} />
    </View>
  );
}

/**
 * One segment per movement, not per screen. The owning onboarding shell keeps
 * every segment mounted, so progress advances visibly instead of redrawing a
 * new bar after each answer.
 */
export function ProgressRail({ current, fraction, labels }: ProgressRailProps) {
  return (
    <View
      accessibilityLabel={`${labels[current] ?? ''}, part ${current + 1} of ${labels.length}`}
      accessibilityRole="progressbar"
      accessibilityValue={{ max: labels.length, min: 0, now: current + fraction }}
      style={styles.rail}
    >
      {labels.map((label, index) => (
        <View key={label} style={styles.slot}>
          <ProgressSegment
            active={index === current}
            progress={index < current ? 1 : index === current ? Math.min(1, fraction) : 0}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  active: {
    backgroundColor: colors.brass,
  },
  done: {
    backgroundColor: colors.brassDim,
  },
  fill: {
    borderRadius: 2,
    height: 3,
  },
  rail: {
    flexDirection: 'row',
    gap: spacing.xs,
    paddingTop: spacing.sm,
  },
  slot: {
    flex: 1,
  },
  track: {
    backgroundColor: colors.lineSoft,
    borderRadius: 2,
    height: 3,
    overflow: 'hidden',
  },
});

import { StyleSheet } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
} from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';

import { colors } from '@/theme';

type TracingFrameProps = {
  /** 0 to 1. The share of the circuit that has been drawn. */
  progress: SharedValue<number>;
};

/**
 * A hairline that draws itself around the edge of the screen, clockwise from
 * the top left, and closes the loop where it started.
 *
 * It exists for one moment in the product: the Contract. A progress bar would
 * have said "wait"; a circuit closing says "this is being sealed", which is
 * what he is actually doing. It only ever moves under his own hand, and
 * nothing else in North may use it.
 */
export function TracingFrame({ progress }: TracingFrameProps) {
  const reduceMotion = useReducedMotion();

  // Each edge owns a quarter of the circuit and grows from the corner the
  // previous one finished at, so it reads as a single continuous stroke.
  const top = useAnimatedStyle(() => ({
    transform: [{ scaleX: quarter(progress.value, 0) }],
  }));
  const right = useAnimatedStyle(() => ({
    transform: [{ scaleY: quarter(progress.value, 1) }],
  }));
  const bottom = useAnimatedStyle(() => ({
    transform: [{ scaleX: quarter(progress.value, 2) }],
  }));
  const left = useAnimatedStyle(() => ({
    transform: [{ scaleY: quarter(progress.value, 3) }],
  }));

  if (reduceMotion) {
    return null;
  }

  return (
    <>
      <Animated.View style={[styles.edge, styles.horizontal, styles.top, top]} />
      <Animated.View style={[styles.edge, styles.vertical, styles.right, right]} />
      <Animated.View style={[styles.edge, styles.horizontal, styles.bottom, bottom]} />
      <Animated.View style={[styles.edge, styles.vertical, styles.left, left]} />
    </>
  );
}

function quarter(progress: number, index: number): number {
  'worklet';
  return interpolate(progress, [index * 0.25, (index + 1) * 0.25], [0, 1], 'clamp');
}

const styles = StyleSheet.create({
  bottom: {
    bottom: 0,
    transformOrigin: 'right',
  },
  edge: {
    pointerEvents: 'none',
  },
  horizontal: {
    backgroundColor: colors.brass,
    height: 2,
    left: 0,
    position: 'absolute',
    right: 0,
  },
  left: {
    left: 0,
    transformOrigin: 'bottom',
  },
  right: {
    right: 0,
    transformOrigin: 'top',
  },
  top: {
    top: 0,
    transformOrigin: 'left',
  },
  vertical: {
    backgroundColor: colors.brass,
    bottom: 0,
    position: 'absolute',
    top: 0,
    width: 2,
  },
});

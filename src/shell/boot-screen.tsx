import { useEffect, useState } from 'react';
import { Easing, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { NorthMark } from '@/components/ui/north-mark';
import { NorthText } from '@/components/ui/north-text';
import type { MascotScene } from '@/domains/mascot/mascot';
import { Mascot } from '@/domains/mascot/ui/mascot';
import { colors, motion } from '@/theme';

type BootScreenProps = {
  /** Turns false once the app behind it is ready to be looked at. */
  held: boolean;
};

/**
 * The handoff from the system splash to the app. It is the same field as the
 * splash. The static frame is already present; its signal calibrates north
 * once and the whole mark gets out of the way. It is an authored arrival, not
 * a loading indicator, and it never loops.
 */
export function BootScreen({ held }: BootScreenProps) {
  const reduceMotion = useReducedMotion();
  const [stage, setStage] = useState(reduceMotion ? 2 : 0);
  const markOpacity = useSharedValue(reduceMotion ? 0 : 1);
  const markScale = useSharedValue(1);
  const faceOpacity = useSharedValue(reduceMotion ? 1 : 0);
  const faceScale = useSharedValue(reduceMotion ? 1 : 0.94);
  const wordOpacity = useSharedValue(reduceMotion ? 1 : 0);
  const wordY = useSharedValue(reduceMotion ? 0 : 8);

  useEffect(() => {
    if (reduceMotion) return;

    const timing = { duration: motion.settle, easing: Easing.bezier(0.32, 0.72, 0, 1) };
    markOpacity.value = withDelay(motion.instant, withTiming(0, timing));
    markScale.value = withDelay(motion.instant, withTiming(1.06, timing));
    faceOpacity.value = withDelay(motion.instant, withTiming(1, timing));
    faceScale.value = withDelay(motion.instant, withTiming(1, timing));
    wordOpacity.value = withDelay(motion.quick, withTiming(1, timing));
    wordY.value = withDelay(motion.quick, withTiming(0, timing));

    const calibrate = setTimeout(() => setStage(1), motion.quick);
    const settle = setTimeout(() => setStage(2), motion.quick + motion.arrival);
    return () => {
      clearTimeout(calibrate);
      clearTimeout(settle);
    };
  }, [faceOpacity, faceScale, markOpacity, markScale, reduceMotion, wordOpacity, wordY]);

  const markStyle = useAnimatedStyle(() => ({
    opacity: markOpacity.value,
    transform: [{ scale: markScale.value }],
  }));
  const faceStyle = useAnimatedStyle(() => ({
    opacity: faceOpacity.value,
    transform: [{ scale: faceScale.value }],
  }));
  const wordStyle = useAnimatedStyle(() => ({
    opacity: wordOpacity.value,
    transform: [{ translateY: wordY.value }],
  }));

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.screen,
        {
          opacity: held ? 1 : 0,
          transitionDuration: reduceMotion ? 0 : motion.settle,
          transitionProperty: ['opacity'],
          transitionTimingFunction: motion.easingStandard,
        },
      ]}
    >
      <View style={styles.instrument}>
        <Animated.View style={[styles.layer, markStyle]}>
          {/* The opening frame matches the static native splash exactly. */}
          <NorthMark size={168} />
        </Animated.View>
        <Animated.View style={[styles.face, faceStyle]}>
          <Mascot scene={bootFaceScene(stage)} size={204} />
        </Animated.View>
      </View>
      <Animated.View style={[styles.wordmark, wordStyle]}>
        <NorthText style={styles.word} variant="label">
          NORTH
        </NorthText>
      </Animated.View>
    </Animated.View>
  );
}

function bootFaceScene(stage: number): MascotScene {
  if (stage === 0) {
    return {
      expression: 'loading',
      rotations: {
        cardinals: { angle: 18 },
        face: { angle: -6 },
        outer: { angle: -28 },
      },
    };
  }

  if (stage === 1) {
    return {
      direction: 0,
      expression: 'compass',
      rotations: {
        cardinals: { angle: -8, duration: 'settle' },
        face: { angle: 0, duration: 'settle' },
        outer: { angle: 16, duration: 'arrival' },
      },
      transition: { duration: 'settle' },
    };
  }

  return {
    expression: 'focused',
    rotations: {
      cardinals: { angle: 0, duration: 'settle' },
      face: { angle: 0, duration: 'settle' },
      outer: { angle: 0, duration: 'settle' },
    },
    transition: { duration: 'settle' },
  };
}

const styles = StyleSheet.create({
  face: {
    left: -18,
    position: 'absolute',
    top: -18,
  },
  instrument: {
    height: 168,
    position: 'relative',
    width: 168,
  },
  layer: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  screen: {
    alignItems: 'center',
    backgroundColor: colors.fieldDeep,
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    pointerEvents: 'none',
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 10,
  },
  word: {
    color: colors.paper,
    letterSpacing: 4.4,
  },
  wordmark: {
    marginTop: 20,
  },
});

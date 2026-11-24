import type { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeOut,
  useReducedMotion,
} from 'react-native-reanimated';

import { motion } from '@/theme';

export type StepDirection = 'forward' | 'back' | 'chapter';

type OnboardingStepTransitionProps = PropsWithChildren<{
  animate: boolean;
  direction: StepDirection;
  sequence: number;
  step: number;
}>;

/**
 * Keeps the incoming and outgoing pages in the same fixed stage while they
 * exchange places. The onboarding shell lives outside this boundary, so the
 * progress rail and Compass remain continuous objects instead of remounting on
 * every answer.
 */
export function OnboardingStepTransition({
  animate,
  children,
  direction,
  sequence,
  step,
}: OnboardingStepTransitionProps) {
  const reduceMotion = useReducedMotion();
  const curve = Easing.bezier(0.32, 0.72, 0, 1);

  const entering = !animate || reduceMotion
    ? undefined
    : direction === 'chapter'
      ? FadeIn.duration(motion.settle).easing(curve)
      : direction === 'back'
        ? FadeInUp.duration(motion.quick)
            .easing(curve)
            .withInitialValues({ opacity: 0, transform: [{ translateY: -12 }] })
        : FadeInDown.duration(motion.quick)
            .easing(curve)
            .withInitialValues({ opacity: 0, transform: [{ translateY: 12 }] });

  return (
    <View style={styles.stage}>
      <Animated.View
        entering={entering}
        exiting={reduceMotion ? undefined : FadeOut.duration(motion.instant)}
        key={`${step}:${sequence}`}
        style={styles.page}
      >
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    overflow: 'hidden',
  },
  stage: {
    flex: 1,
    minWidth: 0,
    overflow: 'hidden',
  },
});

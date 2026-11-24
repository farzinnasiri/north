import { useLayoutEffect, useRef } from 'react';
import type { ComponentRef, PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';

import { motion } from '@/theme';

export type StepDirection = 'forward' | 'back' | 'chapter';

type OnboardingStepTransitionProps = PropsWithChildren<{
  animate: boolean;
  direction: StepDirection;
  sequence: number;
  step: number;
}>;

type AnimatableView = ComponentRef<typeof View> & {
  animate?: (keyframes: Keyframe[], options: KeyframeAnimationOptions) => Animation;
};

/**
 * Web delegates the page entrance to WAAPI. The animation runs on compositor
 * properties, and cancelling it hands a rapid reversal directly to the next
 * destination without retaining an obsolete React page underneath.
 */
export function OnboardingStepTransition({
  animate,
  children,
  direction,
  sequence,
  step,
}: OnboardingStepTransitionProps) {
  const reduceMotion = useReducedMotion();
  const page = useRef<AnimatableView>(null);
  const running = useRef<Animation | null>(null);

  useLayoutEffect(() => {
    running.current?.cancel();
    if (!animate || reduceMotion || !page.current?.animate) return;

    const travel = direction === 'chapter' ? 0 : direction === 'back' ? -12 : 12;
    running.current = page.current.animate(
      [
        { opacity: 0, transform: `translateY(${travel}px)` },
        { opacity: 1, transform: 'translateY(0px)' },
      ],
      {
        duration: direction === 'chapter' ? motion.settle : motion.quick,
        easing: motion.easingStandard,
        fill: 'both',
      },
    );

    return () => running.current?.cancel();
  }, [animate, direction, reduceMotion, sequence]);

  return (
    <View style={styles.stage}>
      <View key={`${step}:${sequence}`} ref={page} style={styles.page}>
        {children}
      </View>
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

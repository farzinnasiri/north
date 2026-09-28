import { useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';

import { motion } from '@/theme';

type RevealProps = PropsWithChildren<{
  /** Wait before this item follows the previous beat. Use motion tokens. */
  delay?: number;
  /**
   * Off on a cold start. Entering animations belong to changes the person
   * caused, so a screen that simply opened passes `false` and appears.
   */
  enabled?: boolean;
  style?: StyleProp<ViewStyle>;
  /** Distance travelled on the way in. Never a scale from nothing. */
  travel?: number;
}>;

/**
 * The one way content arrives in North: a short rise and fade on the elements
 * that changed because of something the person did.
 *
 * It is a CSS transition rather than a layout animation on purpose. Layout
 * animations do not run on the web preview surface, which is how the rest of
 * this repo ended up with per-platform forks of the same fade; a transition
 * compiles to the same thing on both and leaves one file to reason about.
 */
export function Reveal({
  children,
  delay = 0,
  enabled = true,
  style,
  travel = 10,
}: RevealProps) {
  const reduceMotion = useReducedMotion();
  const [arrived, setArrived] = useState(!enabled);

  useEffect(() => {
    if (arrived) return;
    let frame: number | undefined;
    const arrive = () => {
      // One state flip on the frame after mount, never a value per frame.
      frame = requestAnimationFrame(() => setArrived(true));
    };

    if (reduceMotion || delay === 0) {
      arrive();
      return () => {
        if (frame !== undefined) cancelAnimationFrame(frame);
      };
    }

    const timer = setTimeout(arrive, delay);

    return () => {
      clearTimeout(timer);
      if (frame !== undefined) cancelAnimationFrame(frame);
    };
  }, [arrived, delay, reduceMotion]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: arrived ? 1 : 0,
          // Reduced motion keeps the fade, which carries the meaning, and
          // drops the movement, which is the part that causes harm.
          transform: [{ translateY: arrived || reduceMotion ? 0 : travel }],
          transitionDuration: motion.quick,
          transitionProperty: ['opacity', 'transform'],
          transitionTimingFunction: motion.easingStandard,
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}

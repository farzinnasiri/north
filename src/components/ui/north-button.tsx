import { forwardRef, useState } from 'react';
import type { PressableProps, StyleProp, View, ViewStyle } from 'react-native';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';

import { colors, motion, radii, typography } from '@/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ButtonTone = 'primary' | 'secondary' | 'quiet';

type NorthButtonProps = PressableProps & {
  label: string;
  tone?: ButtonTone;
};

/**
 * The press is a transition, not a style swap: it takes hold over `instant`
 * and lets go over `quick`, so the control gives way under a finger and
 * recovers rather than snapping between two frames.
 */
export const NorthButton = forwardRef<View, NorthButtonProps>(function NorthButton(
  { disabled, label, style, tone = 'primary', ...props },
  ref,
) {
  const reduceMotion = useReducedMotion();
  const [pressed, setPressed] = useState(false);
  const held = pressed && !disabled;

  return (
    <AnimatedPressable
      accessibilityRole="button"
      disabled={disabled}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      ref={ref}
      style={[
        styles.base,
        styles[tone],
        disabled && styles.disabled,
        {
          opacity: held ? motion.pressOpacity : 1,
          // Reduced motion keeps the feedback and drops the movement.
          transform: [{ scale: held && !reduceMotion ? motion.pressScale : 1 }],
          transitionDuration: held ? motion.instant : motion.quick,
          transitionProperty: ['opacity', 'transform'],
          transitionTimingFunction: motion.easingStandard,
        },
        style as StyleProp<ViewStyle>,
      ]}
      {...props}
    >
      <Text style={[styles.label, styles[`${tone}Label`], disabled && styles.disabledLabel]}>
        {label}
      </Text>
    </AnimatedPressable>
  );
});

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    borderCurve: 'continuous',
    borderRadius: radii.control,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: 18,
    width: '100%',
  },
  primary: {
    backgroundColor: colors.brass,
    borderColor: colors.brass,
  },
  secondary: {
    backgroundColor: colors.field,
    borderColor: colors.line,
  },
  quiet: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  label: {
    fontFamily: typography.sansMedium,
    fontSize: 15,
  },
  primaryLabel: {
    color: colors.brassOn,
  },
  secondaryLabel: {
    color: colors.paper,
  },
  quietLabel: {
    color: colors.ash,
  },
  // Dimming brass produces a murky olive that reads as broken rather than
  // unavailable. An unavailable action drops out of the accent entirely.
  disabled: {
    backgroundColor: 'transparent',
    borderColor: colors.lineSoft,
    opacity: 1,
  },
  disabledLabel: {
    color: colors.slate,
  },
});

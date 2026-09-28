import { forwardRef, useState } from 'react';
import type { PressableProps, StyleProp, View, ViewStyle } from 'react-native';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';

import { useSignalTheme } from '@/components/ui/signal-theme';
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
  { accessibilityLabel, disabled, label, style, tone = 'primary', ...props },
  ref,
) {
  const reduceMotion = useReducedMotion();
  const signal = useSignalTheme();
  const [pressed, setPressed] = useState(false);
  const held = pressed && !disabled;

  return (
    <AnimatedPressable
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="button"
      disabled={disabled}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      ref={ref}
      style={[
        styles.base,
        styles[tone],
        tone === 'primary' && { backgroundColor: signal.primary, borderColor: signal.primary },
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
      <Text style={[
        styles.label,
        styles[`${tone}Label`],
        tone === 'primary' && { color: signal.onPrimary },
        disabled && styles.disabledLabel,
      ]}>
        {label}
      </Text>
      {tone === 'quiet' ? null : (
        <Text
          accessibilityElementsHidden
          importantForAccessibility="no"
          style={[
            styles.arrow,
            styles[`${tone}Label`],
            tone === 'primary' && { color: signal.onPrimary },
            disabled && styles.disabledLabel,
          ]}
        >
          →
        </Text>
      )}
    </AnimatedPressable>
  );
});

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    borderCurve: 'continuous',
    borderRadius: radii.control,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 62,
    paddingHorizontal: 20,
    width: '100%',
  },
  primary: {
    backgroundColor: colors.brass,
    borderColor: colors.brass,
  },
  secondary: {
    backgroundColor: colors.fieldRaised,
    borderColor: colors.line,
  },
  quiet: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  label: {
    fontFamily: typography.editorialMedium,
    fontSize: 20,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
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
  arrow: {
    fontFamily: typography.sansMedium,
    fontSize: 26,
    lineHeight: 28,
  },
  // An unavailable action drops out of ink and leaves only its measured
  // boundary, so it remains legible without looking like a second action.
  disabled: {
    backgroundColor: colors.field,
    borderColor: colors.lineSoft,
    opacity: 1,
  },
  disabledLabel: {
    color: colors.slate,
  },
});

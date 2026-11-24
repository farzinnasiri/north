import type { ComponentRef } from 'react';
import { forwardRef, useState } from 'react';
import type { PressableProps, StyleProp, ViewStyle } from 'react-native';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';
import { GlassView } from 'expo-glass-effect';

import { GLASS_AVAILABLE } from '@/components/ui/glass';
import { useSignalTheme } from '@/components/ui/signal-theme';
import { colors, motion, radii, typography } from '@/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);


type ButtonTone = 'primary' | 'secondary' | 'quiet';

type NorthButtonProps = PressableProps & {
  animateAvailability?: boolean;
  label: string;
  tone?: ButtonTone;
};

/**
 * The press is a transition, not a style swap: it takes hold over `instant`
 * and lets go over `quick`, so the control gives way under a finger and
 * recovers rather than snapping between two frames.
 */
export const NorthButton = forwardRef<ComponentRef<typeof Pressable>, NorthButtonProps>(function NorthButton(
  { accessibilityLabel, animateAvailability = false, disabled, label, style, tone = 'primary', ...props },
  ref,
) {
  const reduceMotion = useReducedMotion();
  const signal = useSignalTheme();
  const [pressed, setPressed] = useState(false);
  const held = pressed && !disabled;

  if (GLASS_AVAILABLE && tone !== 'quiet') {
    // Liquid Glass: the system material does the press response, so the
    // capsule only carries the tint and the label.
    return (
      <GlassView
        colorScheme="dark"
        glassEffectStyle="regular"
        isInteractive={!disabled}
        style={[styles.glass, disabled && styles.glassDisabled, style as StyleProp<ViewStyle>]}
        tintColor={tone === 'primary' && !disabled ? signal.primary : undefined}
      >
        <Pressable
          accessibilityLabel={accessibilityLabel ?? label}
          accessibilityRole="button"
          disabled={disabled}
          ref={ref}
          style={styles.glassPress}
          {...props}
        >
          <Text style={[styles.label, styles.glassLabel, disabled && styles.disabledLabel]}>{label}</Text>
        </Pressable>
      </GlassView>
    );
  }

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
          transitionProperty: animateAvailability
            ? ['opacity', 'transform', 'backgroundColor', 'borderColor']
            : ['opacity', 'transform'],
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
    </AnimatedPressable>
  );
});

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    borderCurve: 'continuous',
    borderRadius: radii.full,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    minHeight: 54,
    paddingHorizontal: 24,
    width: '100%',
  },
  glass: {
    borderCurve: 'continuous',
    borderRadius: radii.full,
    minHeight: 54,
    overflow: 'hidden',
    width: '100%',
  },
  glassDisabled: {
    opacity: 0.6,
  },
  glassPress: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    minHeight: 54,
    paddingHorizontal: 24,
  },
  glassLabel: {
    color: colors.paper,
  },
  primary: {
    backgroundColor: colors.brass,
    borderColor: colors.brass,
  },
  secondary: {
    backgroundColor: colors.glassFill,
    borderColor: colors.glassEdge,
  },
  quiet: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  label: {
    flexShrink: 1,
    fontFamily: typography.editorialMedium,
    fontSize: 19,
    letterSpacing: 1.4,
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

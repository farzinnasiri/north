import { GlassContainer, GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import type { PropsWithChildren } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';

import { colors, radii, spacing } from '@/theme';

/**
 * Liquid Glass comes from Expo's `expo-glass-effect`, which draws the real
 * iOS 26 material. Everywhere else (older iOS, Android, the web preview) the
 * same shapes are drawn with a translucent fill and a hairline edge.
 */
export const GLASS_AVAILABLE = isLiquidGlassAvailable();

type GlassSurfaceProps = PropsWithChildren<{
  /** Responds to touch with the system's glass press. For pressable cards. */
  interactive?: boolean;
  padded?: boolean;
  radius?: number;
  style?: StyleProp<ViewStyle>;
  /** Tints the glass, e.g. with the Signal for a chosen card. */
  tint?: string;
}>;

export function GlassSurface({
  children,
  interactive = false,
  padded = true,
  radius = radii.glass,
  style,
  tint,
}: GlassSurfaceProps) {
  const shape = [{ borderCurve: 'continuous' as const, borderRadius: radius }, padded && styles.padded];
  if (GLASS_AVAILABLE) {
    return (
      <GlassView
        colorScheme="dark"
        glassEffectStyle="regular"
        isInteractive={interactive}
        style={[styles.glass, shape, style]}
        tintColor={tint}
      >
        {children}
      </GlassView>
    );
  }
  return (
    <View style={[styles.fallback, shape, tint ? { borderColor: tint } : null, style]}>
      {children}
    </View>
  );
}

/**
 * Glass shapes close together merge and separate like drops of the same
 * material. Used for stacks of buttons that belong to one decision.
 */
export function GlassGroup({ children, style }: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  if (GLASS_AVAILABLE) {
    return <GlassContainer spacing={spacing.md} style={[styles.group, style]}>{children}</GlassContainer>;
  }
  return <View style={[styles.group, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  fallback: {
    backgroundColor: colors.glassFill,
    borderColor: colors.glassEdge,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  glass: {
    overflow: 'hidden',
  },
  group: {
    gap: spacing.sm,
  },
  padded: {
    padding: spacing.lg + 2,
  },
});

import { useState } from 'react';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';

import { NorthText } from '@/components/ui/north-text';
import { colors, motion, spacing } from '@/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type NorthRowProps = {
  /** A control the row owns, such as a switch. Replaces the value text. */
  control?: ReactNode;
  detail?: string;
  label: string;
  onPress?: () => void;
  tone?: 'default' | 'destructive';
  value?: string;
};

/**
 * One line of a settings list. The press target is the whole row and the
 * feedback is the same scale used by every other pressable surface, so a list
 * of these does not feel like a different product from the rest of the app.
 */
export function NorthRow({ control, detail, label, onPress, tone = 'default', value }: NorthRowProps) {
  const reduceMotion = useReducedMotion();
  const [pressed, setPressed] = useState(false);

  const body = (
    <View style={styles.row}>
      <View style={styles.text}>
        <NorthText style={tone === 'destructive' ? styles.destructive : styles.label}>
          {label}
        </NorthText>
        {detail ? <NorthText variant="small">{detail}</NorthText> : null}
      </View>
      {control ?? (value ? <NorthText variant="data">{value}</NorthText> : null)}
    </View>
  );

  if (!onPress) {
    return body;
  }

  return (
    <AnimatedPressable
      accessibilityRole="button"
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={{
        opacity: pressed ? motion.pressOpacity : 1,
        transform: [{ scale: pressed && !reduceMotion ? motion.pressScale : 1 }],
        transitionDuration: pressed ? motion.instant : motion.quick,
        transitionProperty: ['opacity', 'transform'],
        transitionTimingFunction: motion.easingStandard,
      }}
    >
      {body}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  destructive: {
    color: colors.emberText,
  },
  label: {
    color: colors.paper,
  },
  row: {
    alignItems: 'center',
    borderBottomColor: colors.glassEdge,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: spacing.lg,
    minHeight: 56,
    paddingVertical: spacing.md,
  },
  text: {
    flex: 1,
    gap: 2,
  },
});

import type { PropsWithChildren } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';

import { NorthText } from '@/components/ui/north-text';
import { colors, spacing } from '@/theme';

type SectionProps = PropsWithChildren<{
  /** Short mono label. The only thing allowed to be uppercase. */
  label?: string;
  /** A hairline above the label, for stacked sections in one column. */
  ruled?: boolean;
  style?: StyleProp<ViewStyle>;
}>;

/**
 * A labelled group in the single column. It exists so that stacked facts stay
 * one readable column instead of drifting into a card grid, which is the
 * failure mode this product is most likely to fall into.
 */
export function Section({ children, label, ruled = false, style }: SectionProps) {
  return (
    <View style={[styles.section, ruled && styles.ruled, style]}>
      {label ? <NorthText variant="label">{label}</NorthText> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  ruled: {
    borderTopColor: colors.line,
    borderTopWidth: 1,
    paddingTop: spacing.lg,
  },
  section: {
    gap: spacing.sm,
  },
});

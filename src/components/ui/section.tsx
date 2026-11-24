import type { PropsWithChildren } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';

import { GlassSurface } from '@/components/ui/glass';
import { NorthText } from '@/components/ui/north-text';
import { spacing } from '@/theme';

type SectionProps = PropsWithChildren<{
  /** Short mono label above the group. */
  label?: string;
  /** Kept for existing call sites; groups are separated by their glass now. */
  ruled?: boolean;
  style?: StyleProp<ViewStyle>;
}>;

/**
 * A labelled group, drawn as one glass panel like an inset grouped list. The
 * label sits outside the glass so the panel holds only the rows.
 */
export function Section({ children, label, style }: SectionProps) {
  return (
    <View style={[styles.section, style]}>
      {label ? <NorthText style={styles.label} variant="label">{label}</NorthText> : null}
      <GlassSurface style={styles.panel}>{children}</GlassSurface>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    paddingHorizontal: spacing.lg,
  },
  panel: {
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  section: {
    gap: spacing.sm,
  },
});

import { Pressable, StyleSheet, View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';

import { GlassSurface } from '@/components/ui/glass';
import { NorthText } from '@/components/ui/north-text';
import { useSignalTheme } from '@/components/ui/signal-theme';
import type { Line } from '@/domains/content/catalogue';
import { AXIS_COLORS, AXIS_LABELS } from '@/domains/direction/axis-labels';
import { colors, motion, radii, spacing, typography } from '@/theme';

type LineCardProps = {
  line: Line;
  /** Replaces the Line's own action text, when he has reworded it. */
  action?: string;
  onPress?: () => void;
  selected?: boolean;
  /** Clamp the quote on screens that show two cards at once. */
  quoteLines?: number;
};

/**
 * Today's thing, how to do it, and the person whose words it came from. The
 * takeaway leads because that is what he is choosing; the concrete step sits
 * under it, then the quote with its attribution, unedited. A paraphrase says so.
 */
export function LineCard({ action, line, onPress, quoteLines, selected = false }: LineCardProps) {
  const signal = useSignalTheme();
  const reduceMotion = useReducedMotion();
  const body = (
    <>
      <View style={styles.head}>
        <View style={[styles.dot, { backgroundColor: AXIS_COLORS[line.axis] }]} />
        <NorthText variant="label">{AXIS_LABELS[line.axis]}</NorthText>
        {selected ? <NorthText style={[styles.chosen, { color: signal.light }]} variant="label">CHOSEN</NorthText> : null}
      </View>
      <NorthText selectable={!onPress} style={styles.takeaway}>{action ?? line.takeaway}</NorthText>
      <NorthText selectable={!onPress} style={styles.how}>{line.action}</NorthText>
      <View style={styles.quote}>
        <NorthText numberOfLines={quoteLines} selectable={!onPress} style={styles.said}>
          {`“${line.said}”`}
        </NorthText>
        <NorthText numberOfLines={2} variant="label">
          {`${line.person}${line.kind === 'paraphrase' ? ' · PARAPHRASED' : ''} · ${line.source}`}
        </NorthText>
      </View>
    </>
  );

  if (!onPress) return <GlassSurface style={styles.card}>{body}</GlassSurface>;
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => ({
        opacity: pressed ? motion.pressOpacity : 1,
        transform: [{ scale: pressed && !reduceMotion ? 0.985 : 1 }],
      })}
    >
      <GlassSurface interactive style={styles.card} tint={selected ? signal.muted : undefined}>
        {body}
      </GlassSurface>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  how: {
    color: colors.ash,
    fontFamily: typography.sans,
    fontSize: 15,
    lineHeight: 21,
  },
  takeaway: {
    color: colors.paper,
    fontFamily: typography.editorialMedium,
    fontSize: 30,
    letterSpacing: -0.2,
    lineHeight: 31,
    textTransform: 'uppercase',
  },
  card: {
    gap: spacing.md,
  },
  chosen: {
    marginLeft: 'auto',
  },
  dot: {
    borderRadius: radii.full,
    height: 7,
    width: 7,
  },
  head: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  quote: {
    borderLeftColor: colors.line,
    borderLeftWidth: 1,
    gap: spacing.sm,
    paddingLeft: spacing.md,
  },
  said: {
    color: colors.ash,
    fontFamily: typography.sans,
    fontSize: 15,
    lineHeight: 22,
  },
});

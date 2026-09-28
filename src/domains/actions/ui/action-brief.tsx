import { StyleSheet, View } from 'react-native';

import { NorthText } from '@/components/ui/north-text';
import { Surface } from '@/components/ui/surface';
import type { AuthoredAction } from '@/domains/content/catalogue';
import { colors, spacing } from '@/theme';

type ActionBriefProps = {
  action: AuthoredAction;
  /** His own words, once the Action is open. */
  named?: string | null;
};

/**
 * The Action as he reads it: the direction, the clarifier that removes the easy
 * reading of it, and why this one. The lesson carries a two-pixel rule rather
 * than a card, because it explains the moment and must not become a banner.
 */
export function ActionBrief({ action, named }: ActionBriefProps) {
  return (
    <View style={styles.brief}>
      <View style={styles.head}>
        <NorthText variant="title">{action.title}</NorthText>
        <NorthText>{action.body}</NorthText>
      </View>

      <View style={styles.lesson}>
        <NorthText variant="label">WHY THIS ONE</NorthText>
        <NorthText variant="small">{action.lesson}</NorthText>
      </View>

      {named ? (
        <Surface style={styles.named}>
          <NorthText variant="label">YOU NAMED IT</NorthText>
          <NorthText selectable style={styles.namedText}>
            {named}
          </NorthText>
        </Surface>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  brief: {
    gap: spacing.xl,
  },
  head: {
    gap: spacing.sm,
  },
  lesson: {
    borderTopColor: colors.brass,
    borderTopWidth: 2,
    gap: spacing.sm,
    paddingTop: spacing.lg,
  },
  named: {
    gap: spacing.sm,
  },
  namedText: {
    color: colors.paper,
  },
});

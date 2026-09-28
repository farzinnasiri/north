import { StyleSheet, View } from 'react-native';

import { NorthText } from '@/components/ui/north-text';
import { colors, spacing } from '@/theme';

const PRINCIPLES = [
  'Tell yourself the truth, especially when it is inconvenient.',
  'Choose what you will do. Name it clearly. Give it a deadline you can defend.',
  'Keep your word when you can. If you miss, admit it and choose again.',
  'Ask for help when you need it.',
  'Treat other people as people, not measures of your worth.',
  'Leave North when you can hold your direction without it.',
] as const;

/** An optional agreement the person can return to after onboarding. */
export function TheCode() {
  return (
    <View style={styles.code}>
      <View style={styles.intro}>
        <NorthText variant="heading">The Code</NorthText>
        <NorthText>The agreement you made.</NorthText>
      </View>

      {PRINCIPLES.map((principle, index) => (
        <View key={principle} style={styles.principle}>
          <NorthText style={styles.number} variant="label">
            {String(index + 1).padStart(2, '0')}
          </NorthText>
          <NorthText style={styles.copy}>{principle}</NorthText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  code: {
    gap: spacing.xl,
  },
  copy: {
    color: colors.paper,
    flex: 1,
  },
  intro: {
    gap: spacing.sm,
    paddingBottom: spacing.sm,
  },
  number: {
    color: colors.meridianLight,
    paddingTop: 3,
    width: 34,
  },
  principle: {
    borderTopColor: colors.line,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    paddingTop: spacing.lg,
  },
});

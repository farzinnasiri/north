import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacing, typography } from '@/theme';

export function Home() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <Text style={styles.label}>BEARING</Text>
        <Text style={styles.title}>North</Text>
        <Text style={styles.body}>
          One action at a time, until you do not need the compass anymore.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.fieldDeep,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  label: {
    color: colors.brass,
    fontFamily: typography.monoMedium,
    fontSize: 11,
    letterSpacing: 1.1,
    marginBottom: spacing.md,
  },
  title: {
    color: colors.paper,
    fontFamily: typography.sansMedium,
    fontSize: 34,
    letterSpacing: -0.68,
    marginBottom: spacing.md,
  },
  body: {
    color: colors.ash,
    fontFamily: typography.sans,
    fontSize: 15,
    lineHeight: 24,
    maxWidth: 360,
  },
});

import { StyleSheet } from 'react-native';

import { NorthScreen } from '@/components/ui/north-screen';
import { TheCode } from '@/domains/journey/ui/the-code';
import { spacing } from '@/theme';

export function Code() {
  return (
    <NorthScreen contentStyle={styles.screen}>
      <TheCode />
    </NorthScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingBottom: spacing.xxxl,
    paddingTop: spacing.xl,
  },
});

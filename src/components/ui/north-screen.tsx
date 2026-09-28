import type { PropsWithChildren, ReactNode } from 'react';
import type { ScrollViewProps, StyleProp, ViewStyle } from 'react-native';
import { ScrollView, StyleSheet, View } from 'react-native';

import { NorthBackdrop } from '@/components/ui/north-backdrop';
import { colors, spacing } from '@/theme';

type NorthScreenProps = PropsWithChildren<
  ScrollViewProps & {
    backdrop?: ReactNode;
    contentStyle?: StyleProp<ViewStyle>;
  }
>;

export function NorthScreen({ backdrop, children, contentStyle, style, ...props }: NorthScreenProps) {
  return (
    <View style={styles.root}>
      {backdrop ?? <NorthBackdrop />}
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={[
          styles.content,
          contentStyle,
        ]}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
        style={[styles.scroll, style]}
        {...props}
      >
        {children}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.xxl,
    paddingBottom: spacing.xxxl + spacing.lg,
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.xl,
  },
  root: {
    backgroundColor: colors.fieldDeep,
    flex: 1,
  },
  scroll: {
    backgroundColor: 'transparent',
    flex: 1,
  },
});

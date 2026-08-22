import type { PropsWithChildren } from 'react';
import type { ScrollViewProps, StyleProp, ViewStyle } from 'react-native';
import { ScrollView } from 'react-native';

import { colors, spacing } from '@/theme';

type NorthScreenProps = PropsWithChildren<
  ScrollViewProps & {
    contentStyle?: StyleProp<ViewStyle>;
  }
>;

export function NorthScreen({ children, contentStyle, ...props }: NorthScreenProps) {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={[
        {
          gap: spacing.xl,
          paddingBottom: spacing.xxxl,
          paddingHorizontal: spacing.screen,
          paddingTop: spacing.lg,
        },
        contentStyle,
      ]}
      keyboardDismissMode="interactive"
      keyboardShouldPersistTaps="handled"
      style={{ backgroundColor: colors.fieldDeep }}
      {...props}
    >
      {children}
    </ScrollView>
  );
}

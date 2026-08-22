import type { PropsWithChildren } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { View } from 'react-native';

import { colors, radii, spacing } from '@/theme';

type SurfaceProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
}>;

export function Surface({ children, style }: SurfaceProps) {
  return (
    <View
      style={[
        {
          backgroundColor: colors.field,
          borderColor: colors.lineSoft,
          borderCurve: 'continuous',
          borderRadius: radii.card,
          borderWidth: 1,
          gap: spacing.md,
          padding: spacing.lg,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

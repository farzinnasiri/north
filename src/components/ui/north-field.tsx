import type { TextInputProps } from 'react-native';
import { TextInput } from 'react-native';

import { colors, radii, spacing, typography, typeScale } from '@/theme';

export function NorthField({ multiline = true, style, ...props }: TextInputProps) {
  return (
    <TextInput
      multiline={multiline}
      placeholderTextColor={colors.slate}
      selectionColor={colors.brass}
      style={[
        {
          backgroundColor: colors.field,
          borderColor: colors.line,
          borderCurve: 'continuous',
          borderRadius: radii.control,
          borderWidth: 1,
          color: colors.paper,
          fontFamily: typography.sans,
          fontSize: typeScale.body,
          lineHeight: 24,
          minHeight: multiline ? 136 : 52,
          padding: spacing.lg,
          textAlignVertical: multiline ? 'top' : 'center',
        },
        style,
      ]}
      {...props}
    />
  );
}

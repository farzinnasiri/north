import type { TextInputProps } from 'react-native';
import { TextInput } from 'react-native';

import { useSignalTheme } from '@/components/ui/signal-theme';
import { colors, radii, spacing, typography, typeScale } from '@/theme';

export function NorthField({ multiline = true, style, ...props }: TextInputProps) {
  const signal = useSignalTheme();

  return (
    <TextInput
      multiline={multiline}
      placeholderTextColor={colors.slate}
      selectionColor={signal.primary}
      style={[
        {
          backgroundColor: colors.fieldRaised,
          borderColor: colors.line,
          borderCurve: 'continuous',
          borderRadius: radii.control,
          borderWidth: 1,
          color: colors.paper,
          fontFamily: typography.sans,
          fontSize: typeScale.body,
          lineHeight: 24,
          minHeight: multiline ? 136 : 56,
          padding: spacing.lg,
          textAlignVertical: multiline ? 'top' : 'center',
        },
        style,
      ]}
      {...props}
    />
  );
}

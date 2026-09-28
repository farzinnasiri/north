import type { TextProps, TextStyle } from 'react-native';
import { Text } from 'react-native';

import { colors, typeScale, typography } from '@/theme';

type TextVariant = 'display' | 'title' | 'heading' | 'body' | 'small' | 'label' | 'data';

const variants: Record<TextVariant, TextStyle> = {
  display: {
    color: colors.paper,
    fontFamily: typography.editorialMedium,
    fontSize: typeScale.display,
    includeFontPadding: false,
    letterSpacing: -1.2,
    lineHeight: 55,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.paper,
    fontFamily: typography.editorialMedium,
    fontSize: typeScale.title,
    includeFontPadding: false,
    letterSpacing: -0.8,
    lineHeight: 44,
    textTransform: 'uppercase',
  },
  heading: {
    color: colors.paper,
    fontFamily: typography.editorial,
    fontSize: typeScale.heading,
    includeFontPadding: false,
    letterSpacing: -0.2,
    lineHeight: 32,
    textTransform: 'uppercase',
  },
  body: {
    color: colors.ash,
    fontFamily: typography.sans,
    fontSize: typeScale.body,
    lineHeight: 26,
  },
  small: {
    color: colors.slate,
    fontFamily: typography.sans,
    fontSize: typeScale.small,
    lineHeight: 21,
  },
  label: {
    color: colors.slate,
    fontFamily: typography.mono,
    fontSize: typeScale.label,
    letterSpacing: 0.58,
    lineHeight: 14,
    textTransform: 'uppercase',
  },
  data: {
    color: colors.paper,
    fontFamily: typography.monoMedium,
    fontSize: typeScale.data,
    fontVariant: ['tabular-nums'],
    lineHeight: 26,
  },
};

type NorthTextProps = TextProps & {
  variant?: TextVariant;
};

export function NorthText({ variant = 'body', style, ...props }: NorthTextProps) {
  return <Text selectable style={[variants[variant], style]} {...props} />;
}

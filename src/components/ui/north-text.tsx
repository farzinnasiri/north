import type { TextProps, TextStyle } from 'react-native';
import { Text } from 'react-native';

import { colors, typeScale, typography } from '@/theme';

type TextVariant = 'display' | 'title' | 'heading' | 'body' | 'small' | 'label' | 'data';

const variants: Record<TextVariant, TextStyle> = {
  display: {
    color: colors.paper,
    fontFamily: typography.sansMedium,
    fontSize: typeScale.display,
    letterSpacing: -0.68,
    lineHeight: 41,
  },
  title: {
    color: colors.paper,
    fontFamily: typography.sansMedium,
    fontSize: typeScale.title,
    letterSpacing: -0.5,
    lineHeight: 33,
  },
  heading: {
    color: colors.paper,
    fontFamily: typography.sansMedium,
    fontSize: typeScale.heading,
    letterSpacing: -0.2,
    lineHeight: 27,
  },
  body: {
    color: colors.ash,
    fontFamily: typography.sans,
    fontSize: typeScale.body,
    lineHeight: 24,
  },
  small: {
    color: colors.slate,
    fontFamily: typography.sans,
    fontSize: typeScale.small,
    lineHeight: 20,
  },
  label: {
    color: colors.slate,
    fontFamily: typography.mono,
    fontSize: typeScale.label,
    letterSpacing: 1.1,
    lineHeight: 15,
  },
  data: {
    color: colors.paper,
    fontFamily: typography.monoMedium,
    fontSize: typeScale.data,
    fontVariant: ['tabular-nums'],
    lineHeight: 24,
  },
};

type NorthTextProps = TextProps & {
  variant?: TextVariant;
};

export function NorthText({ variant = 'body', style, ...props }: NorthTextProps) {
  return <Text selectable style={[variants[variant], style]} {...props} />;
}

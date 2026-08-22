import { View } from 'react-native';

import { NorthText } from '@/components/ui/north-text';
import { colors, spacing } from '@/theme';

/**
 * Ember and meridian sit at nearly the same contrast on field, so an overdue
 * fact and an earned one carry the same weight rather than one shouting.
 */
const TONES = {
  default: colors.paper,
  earned: colors.meridianLight,
  overdue: colors.emberText,
} as const;

type MetricProps = {
  align?: 'left' | 'right';
  label: string;
  tone?: 'default' | 'earned' | 'overdue';
  value: string;
};

export function Metric({ align = 'left', label, tone = 'default', value }: MetricProps) {
  const textAlign = align === 'right' ? 'right' : 'left';

  return (
    <View style={{ alignItems: align === 'right' ? 'flex-end' : 'flex-start', gap: spacing.xs }}>
      <NorthText variant="label" style={{ textAlign }}>
        {label}
      </NorthText>
      <NorthText
        variant="data"
        style={{ color: TONES[tone], textAlign }}
      >
        {value}
      </NorthText>
    </View>
  );
}

import { View } from 'react-native';

import { NorthText } from '@/components/ui/north-text';
import { useSignalTheme } from '@/components/ui/signal-theme';
import { colors, spacing } from '@/theme';

/**
 * Ember and meridian sit at nearly the same contrast on field, so an overdue
 * fact and an earned one carry the same weight rather than one shouting.
 */
const TONES = {
  default: colors.paper,
  overdue: colors.emberText,
} as const;

type MetricProps = {
  align?: 'left' | 'right';
  inverted?: boolean;
  label: string;
  tone?: 'default' | 'earned' | 'overdue';
  value: string;
};

export function Metric({
  align = 'left',
  inverted = false,
  label,
  tone = 'default',
  value,
}: MetricProps) {
  const signal = useSignalTheme();
  const textAlign = align === 'right' ? 'right' : 'left';
  const valueColor = tone === 'earned'
    ? inverted ? signal.primary : signal.light
    : TONES[tone];

  return (
    <View style={{ alignItems: align === 'right' ? 'flex-end' : 'flex-start', gap: spacing.xs }}>
      <NorthText
        variant="label"
        style={{ color: inverted ? colors.ash : colors.slate, textAlign }}
      >
        {label}
      </NorthText>
      <NorthText
        variant="data"
        style={{ color: valueColor, textAlign }}
      >
        {value}
      </NorthText>
    </View>
  );
}

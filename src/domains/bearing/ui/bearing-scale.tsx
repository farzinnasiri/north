import { StyleSheet, View } from 'react-native';

import { NorthText } from '@/components/ui/north-text';
import { colors, spacing } from '@/theme';

type BearingScaleProps = {
  /** Where he stands now. */
  bearing: number;
  /** Where onboarding put him. The distance between the two is the journey. */
  startingBearing: number;
};

const GRADUATIONS = 7;

/**
 * The whole journey on one line: where he started, where he stands, and north.
 * It is a scale rather than a progress bar because progress bars promise
 * completion, and this one can stall for a month without anything being wrong.
 */
export function BearingScale({ bearing, startingBearing }: BearingScaleProps) {
  const span = Math.max(1, startingBearing);
  const travelled = Math.min(1, Math.max(0, (span - bearing) / span));

  return (
    <View accessibilityLabel={`${bearing} degrees off north, from a start of ${startingBearing}`} style={styles.scale}>
      <View style={styles.track}>
        <View style={[styles.travelled, { width: `${travelled * 100}%` }]} />
        <View style={[styles.marker, { left: `${travelled * 100}%` }]} />
      </View>

      <View style={styles.graduations}>
        {Array.from({ length: GRADUATIONS }, (_, index) => (
          <View key={index} style={styles.tick} />
        ))}
      </View>

      <View style={styles.labels}>
        <NorthText variant="label">START · N {Math.round(startingBearing)}°</NorthText>
        <NorthText variant="label">NORTH · 0°</NorthText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  graduations: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.xs,
  },
  marker: {
    backgroundColor: colors.brass,
    height: 14,
    marginLeft: -1,
    position: 'absolute',
    top: -6,
    width: 2,
  },
  scale: {
    gap: spacing.sm,
  },
  tick: {
    backgroundColor: colors.lineSoft,
    height: 4,
    width: 1,
  },
  track: {
    backgroundColor: colors.line,
    height: 2,
    justifyContent: 'center',
  },
  travelled: {
    backgroundColor: colors.meridian,
    height: 2,
  },
});

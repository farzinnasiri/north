import { useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { NorthScreen } from '@/components/ui/north-screen';
import { NorthText } from '@/components/ui/north-text';
import { DirectionDial } from '@/domains/direction/ui/direction-dial';
import { degreesTravelled, keptCount, northState } from '@/domains/journey/journey';
import { useJourney } from '@/domains/journey/store';
import { spacing } from '@/theme';

/** Direction is one instrument, never a progress dashboard. */
export function Direction() {
  const { height, width } = useWindowDimensions();
  const journey = useJourney((state) => state.journey);
  const [now] = useState(() => Date.now());

  if (!journey) return null;

  const north = northState(journey, now);
  const travelled = degreesTravelled(journey);
  const kept = keptCount(journey);
  const compact = height < 740 || width < 360;
  const dialSize = Math.min(width - spacing.lg * 2, compact ? 320 : 390);
  const status = north.kind === 'holding'
    ? `HOLD NORTH · DAY ${north.daysHeld} / 30`
    : travelled > 0
      ? `${format(travelled)}° MOVED · ${kept} KEPT`
      : 'YOUR FIRST CLOSEOUT MOVES THE NEEDLE';

  return (
    <NorthScreen
      bounces={false}
      contentStyle={[styles.screen, compact && styles.screenCompact]}
    >
      <View style={styles.instrument}>
        <DirectionDial
          direction={journey.direction}
          size={dialSize}
          startingDirection={journey.startingDirection}
        />
        <NorthText style={styles.status} variant="label">{status}</NorthText>
      </View>
    </NorthScreen>
  );
}

function format(value: number): string {
  return Number.isInteger(value) ? `${value}` : value.toFixed(1);
}

const styles = StyleSheet.create({
  instrument: {
    alignItems: 'center',
    gap: spacing.xl,
  },
  screen: {
    flexGrow: 1,
    justifyContent: 'center',
    minHeight: '100%',
    paddingBottom: spacing.xxxl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
  },
  screenCompact: {
    paddingBottom: spacing.xl,
    paddingTop: spacing.lg,
  },
  status: {
    textAlign: 'center',
  },
});

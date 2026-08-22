import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Compass } from '@/components/ui/compass';
import { Metric } from '@/components/ui/metric';
import { NorthScreen } from '@/components/ui/north-screen';
import { NorthText } from '@/components/ui/north-text';
import { Section } from '@/components/ui/section';
import { BearingScale } from '@/domains/bearing/ui/bearing-scale';
import { degreesTravelled, keptCount, northState } from '@/domains/journey/journey';
import { useJourney } from '@/domains/journey/store';
import { colors, spacing } from '@/theme';

/**
 * Where he stands, and how he got here. This is the one screen where the
 * instrument is the subject rather than the state, so the compass is drawn at
 * full size and the record underneath is his own — not a feed, not a streak,
 * and not a comparison with anybody.
 */
export function Bearing() {
  const journey = useJourney((state) => state.journey);
  const [now] = useState(() => Date.now());

  if (!journey) return null;

  const north = northState(journey, now);
  const kept = keptCount(journey);
  const travelled = degreesTravelled(journey);
  const record = [...journey.closed].reverse().slice(0, 6);

  return (
    <NorthScreen contentStyle={styles.screen}>
      <View style={styles.instrument}>
        <Compass bearing={journey.bearing} size={168} />
      </View>

      <View style={styles.metrics}>
        <Metric label="BEARING" value={`N ${format(journey.bearing)}°`} />
        <Metric align="right" label="KEPT" tone="earned" value={`${kept}`} />
      </View>

      <Section>
        <BearingScale bearing={journey.bearing} startingBearing={journey.startingBearing} />
      </Section>

      <NorthText>
        {travelled === 0
          ? 'You have not moved yet. The needle waits for the first action you close.'
          : `You have closed ${format(travelled)}° since you started. It has never moved backwards.`}
      </NorthText>

      {north.kind === 'holding' ? (
        <Section label="HOLD NORTH" ruled>
          <NorthText style={styles.paper}>
            {north.daysHeld} of 30 days held. {north.daysLeft} to go.
          </NorthText>
          <NorthText variant="small">
            Reach north and hold it for thirty days, and North closes for good.
          </NorthText>
        </Section>
      ) : null}

      <Section label="WHAT MOVED IT" ruled>
        {record.length === 0 ? (
          <NorthText variant="small">Nothing yet. The first closed action starts the record.</NorthText>
        ) : (
          record.map((entry) => (
            <View key={`${entry.actionId}-${entry.closedAt}`} style={styles.entry}>
              <View style={styles.entryText}>
                <NorthText selectable style={styles.paper}>
                  {entry.named}
                </NorthText>
                <NorthText variant="small">
                  {entry.kept ? 'Kept' : 'Let go'} · {new Date(entry.closedAt).toLocaleDateString()}
                </NorthText>
              </View>
              <NorthText
                style={entry.kept ? styles.earned : styles.still}
                variant="data"
              >
                {entry.kept ? `−${entry.earned.toFixed(2)}°` : '0°'}
              </NorthText>
            </View>
          ))
        )}
      </Section>

      <View style={styles.close}>
        <NorthText variant="small">
          A compass does not walk for you. It tells you which way is forward, and then you go.
        </NorthText>
      </View>
    </NorthScreen>
  );
}

function format(value: number): string {
  return Number.isInteger(value) ? `${value}` : value.toFixed(1);
}

const styles = StyleSheet.create({
  close: {
    borderLeftColor: colors.meridian,
    borderLeftWidth: 2,
    paddingLeft: spacing.lg,
  },
  earned: {
    color: colors.meridianLight,
  },
  entry: {
    alignItems: 'flex-start',
    borderTopColor: colors.lineSoft,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: spacing.lg,
    paddingVertical: spacing.md,
  },
  entryText: {
    flex: 1,
    gap: 2,
  },
  instrument: {
    alignItems: 'center',
    paddingTop: spacing.sm,
  },
  metrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paper: {
    color: colors.paper,
  },
  screen: {
    gap: spacing.xl,
  },
  still: {
    color: colors.slate,
  },
});

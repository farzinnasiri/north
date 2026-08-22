import { useState } from 'react';
import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { NorthText } from '@/components/ui/north-text';
import { NorthRow } from '@/components/ui/north-row';
import { NorthScreen } from '@/components/ui/north-screen';
import { Section } from '@/components/ui/section';
import { Surface } from '@/components/ui/surface';
import type { Axis } from '@/domains/bearing/initial-bearing';
import { keptCount } from '@/domains/journey/journey';
import { useJourney } from '@/domains/journey/store';
import { NORTH_STAR_OPTIONS } from '@/domains/onboarding/onboarding';
import { NorthStarPortrait } from '@/domains/onboarding/ui/north-star-portrait';
import { colors, radii, spacing } from '@/theme';

const AXIS_LABELS: Record<Axis, string> = {
  agency: 'Agency',
  appetite: 'Appetite',
  connection: 'Connection',
  craft: 'Craft',
  desire: 'Desire',
  frame: 'Frame',
};

/**
 * Who he said he was walking toward, and the picture onboarding drew of where
 * he stood. It is a record, not a scorecard: the readings are shown as they
 * were measured, without a verdict, a grade, or a comparison.
 */
export function You() {
  const journey = useJourney((state) => state.journey);
  const [now] = useState(() => Date.now());

  if (!journey) return null;

  const star = NORTH_STAR_OPTIONS.find((option) => option.value === journey.northStar);
  const committed = new Date(journey.committedAt).toLocaleDateString();

  return (
    <NorthScreen contentStyle={styles.screen}>
      {star ? (
        <View style={styles.star}>
          <NorthStarPortrait contentFit="contain" star={star.value} style={styles.portrait} />
          <View style={styles.starCopy}>
            <NorthText variant="label">YOUR NORTH STAR</NorthText>
            <NorthText variant="title">{star.label}</NorthText>
            <NorthText>{star.description}</NorthText>
          </View>
        </View>
      ) : null}

      {journey.alterEgo ? (
        <Section label="YOU CALL HIM" ruled>
          <NorthText style={styles.paper} variant="heading">
            {journey.alterEgo}
          </NorthText>
          <NorthText variant="small">
            A direction you authored. Not a diagnosis of who you are now.
          </NorthText>
        </Section>
      ) : null}

      <Section label="WHERE YOU STOOD" ruled>
        <NorthText variant="small">
          Measured once, at the start. Degrees off, by axis.
        </NorthText>
        <View style={styles.readings}>
          {journey.readings.map((reading) => (
            <View key={reading.axis} style={styles.reading}>
              <NorthText style={styles.axis}>{AXIS_LABELS[reading.axis]}</NorthText>
              <View style={styles.gauge}>
                <View style={[styles.gaugeFill, { width: `${Math.min(100, reading.off)}%` }]} />
              </View>
              <NorthText style={styles.axisValue} variant="data">
                {Math.round(reading.off)}
              </NorthText>
            </View>
          ))}
        </View>
      </Section>

      <Surface style={styles.contract}>
        <NorthText variant="label">THE CONTRACT</NorthText>
        <NorthText style={styles.paper}>
          Committed by {journey.name} on {committed}.
        </NorthText>
        <NorthText variant="small">
          North will not remind you, verify you, or punish you for returning late. You said you
          would use it until you no longer need it.
        </NorthText>
      </Surface>

      <Section label="RECORD" ruled>
        <NorthRow label="Actions kept" value={`${keptCount(journey)}`} />
        <NorthRow label="Actions closed" value={`${journey.closed.length}`} />
        <NorthRow
          label="Days since you committed"
          value={`${Math.max(0, Math.floor((now - journey.committedAt) / 86400000))}`}
        />
      </Section>

      <Link asChild href="/settings">
        <NorthRow label="Settings" onPress={() => {}} />
      </Link>
    </NorthScreen>
  );
}

const styles = StyleSheet.create({
  axis: {
    color: colors.paper,
    width: 96,
  },
  axisValue: {
    color: colors.meridianLight,
    width: 32,
    textAlign: 'right',
  },
  contract: {
    gap: spacing.sm,
  },
  gauge: {
    backgroundColor: colors.lineSoft,
    flex: 1,
    height: 2,
  },
  gaugeFill: {
    backgroundColor: colors.meridian,
    height: 2,
  },
  paper: {
    color: colors.paper,
  },
  portrait: {
    borderColor: colors.lineSoft,
    borderRadius: radii.card,
    borderWidth: 1,
    height: 108,
    width: 84,
  },
  reading: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    minHeight: 28,
  },
  readings: {
    gap: spacing.xs,
    paddingTop: spacing.sm,
  },
  screen: {
    gap: spacing.xl,
  },
  star: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.lg,
  },
  starCopy: {
    flex: 1,
    gap: spacing.xs,
  },
});

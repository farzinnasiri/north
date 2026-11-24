import { Link } from 'expo-router';
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';

import { GearMark } from '@/components/ui/gear-mark';
import { NorthRow } from '@/components/ui/north-row';
import { NorthScreen } from '@/components/ui/north-screen';
import { NorthText } from '@/components/ui/north-text';
import { Section } from '@/components/ui/section';
import { TAB_TOP_INSET } from '@/components/ui/tab-inset';
import { RealityTrace } from '@/domains/direction/ui/reality-trace';
import { useJourney } from '@/domains/journey/store';
import { NORTH_STAR_OPTIONS } from '@/domains/onboarding/onboarding';
import { NorthStarPortrait } from '@/domains/onboarding/ui/north-star-portrait';
import { colors, spacing } from '@/theme';

/** The identity and agreement the person authored, shown as a portrait before a profile. */
export function You() {
  const { height, width } = useWindowDimensions();
  const journey = useJourney((state) => state.journey);

  if (!journey) return null;

  const star = NORTH_STAR_OPTIONS.find((option) => option.value === journey.northStar);
  const compact = height < 740 || width < 360;
  const wide = width >= 700;
  const identity = star?.label || 'Your North Star';

  return (
    <NorthScreen contentStyle={[styles.screen, wide && styles.screenWide, { paddingTop: TAB_TOP_INSET }]}>
      {star ? (
        <View style={[styles.hero, compact && styles.heroCompact, wide && styles.heroWide]}>
          <View style={styles.portraitFrame}>
            <NorthStarPortrait contentFit="contain" star={star.value} style={styles.portrait} />
          </View>
          <Link asChild href="/settings">
            <Pressable
              accessibilityLabel="Settings"
              accessibilityRole="button"
              hitSlop={8}
              style={styles.settingsButton}
            >
              <GearMark color={colors.ash} size={24} />
            </Pressable>
          </Link>
          <View style={styles.heroCopy}>
            <NorthText variant="label">NORTH STAR</NorthText>
            <NorthText numberOfLines={2} style={styles.identity} variant="title">
              {identity}
            </NorthText>
          </View>
        </View>
      ) : null}

      <View style={[styles.content, wide && styles.contentWide]}>
        <Section label="WHERE YOU STAND" style={wide ? styles.reality : undefined}>
          <View style={[styles.trace, compact && styles.traceCompact]}>
            <RealityTrace readings={journey.readings} />
          </View>
        </Section>

        <Section label="THE CODE" style={wide ? styles.code : undefined}>
          <Link asChild href="/code">
            <NorthRow
              detail="An optional agreement you can return to."
              label="Read the Code"
            />
          </Link>
        </Section>

      </View>
    </NorthScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.xxl,
    paddingBottom: spacing.xxxl,
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.xl,
  },
  contentWide: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.xxl,
    paddingTop: spacing.xxl,
  },
  code: {
    flex: 1,
  },
  hero: {
    backgroundColor: colors.field,
    height: 260,
    overflow: 'hidden',
  },
  heroCompact: {
    height: 224,
  },
  heroCopy: {
    bottom: spacing.xl,
    gap: spacing.xs,
    left: spacing.screen,
    maxWidth: '62%',
    paddingLeft: spacing.md,
    position: 'absolute',
    zIndex: 2,
  },
  heroWide: {
    height: 300,
  },
  identity: {
    fontSize: 40,
    lineHeight: 40,
  },
  portrait: {
    height: '100%',
    width: '100%',
  },
  portraitFrame: {
    bottom: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    width: '68%',
  },
  reality: {
    flex: 1,
  },
  screen: {
    alignSelf: 'center',
    gap: 0,
    maxWidth: 920,
    paddingBottom: 0,
    paddingHorizontal: 0,
    paddingTop: 0,
    width: '100%',
  },
  screenWide: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
  },
  settingsButton: {
    alignItems: 'center',
    height: 48,
    justifyContent: 'center',
    position: 'absolute',
    right: spacing.screen,
    top: spacing.md,
    width: 48,
    zIndex: 4,
  },
  trace: {
    alignSelf: 'center',
    maxWidth: 380,
    width: '100%',
  },
  traceCompact: {
    maxWidth: 320,
  },
});

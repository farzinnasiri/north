import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';

import { ChoiceInstrument } from '@/components/ui/choice-instrument';
import { NorthText } from '@/components/ui/north-text';
import { AVOIDED_OPTIONS } from '@/domains/onboarding/onboarding';
import { OnboardingFrame } from '@/screens/onboarding/onboarding-frame';
import { colors, motion, spacing } from '@/theme';

type HonestThingStepProps = {
  onChange: (value: string) => void;
  onContinue: () => void;
  value: string;
};

export function HonestThingStep({
  onChange,
  onContinue,
  value,
}: HonestThingStepProps) {
  return (
    <OnboardingFrame
      actionLabel="Keep this"
      disabled={value.length === 0}
      onContinue={onContinue}
      title="What have you been stepping around?"
    >
      <ChoiceInstrument
        onChange={(values) => onChange(values[0])}
        options={AVOIDED_OPTIONS.map((option) => ({ label: option.label, value: option.value }))}
        values={value ? [value] : []}
      />
    </OnboardingFrame>
  );
}

type BearingReadingStepProps = {
  name: string;
  bearing: number;
  onContinue: () => void;
};

type BearingLoadingStepProps = {
  duration: number;
  onComplete: () => void;
};

export function BearingLoadingStep({ duration, onComplete }: BearingLoadingStepProps) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const timeout = setTimeout(onComplete, reduceMotion ? 0 : duration);
    return () => clearTimeout(timeout);
  }, [duration, onComplete, reduceMotion]);

  return (
    <OnboardingFrame
      align="centre"
      body="Putting your answers together. Watch the compass."
      presentation="statement"
      title="Finding your bearing."
    />
  );
}

export function BearingReadingStep({
  bearing,
  name,
  onContinue,
}: BearingReadingStepProps) {
  const reduceMotion = useReducedMotion();
  const [displayedBearing, setDisplayedBearing] = useState(reduceMotion ? bearing : 180);
  const [ready, setReady] = useState(reduceMotion);

  useEffect(() => {
    if (reduceMotion) return;

    const startedAt = Date.now();
    let frame = 0;
    const tick = () => {
      const progress = Math.min(1, (Date.now() - startedAt) / motion.arrival);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayedBearing(Math.round(180 + (bearing - 180) * eased));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setReady(true);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [bearing, reduceMotion]);

  return (
    <OnboardingFrame
      actionLabel={ready ? 'Continue' : undefined}
      actionTone="secondary"
      body="It moves when you close something you said you would finish. I never move it backward."
      onContinue={onContinue}
      title={`This is where you begin, ${name}.`}
    >
      {/* North's own eyes are the needle on this screen, so a second dial would
          be the same instrument drawn twice. The number carries it alone. */}
      <View style={styles.reading}>
        <NorthText
          accessibilityLiveRegion={ready ? 'polite' : 'none'}
          style={styles.bearing}
          variant="data"
        >
          N {displayedBearing}°
        </NorthText>
      </View>
    </OnboardingFrame>
  );
}

const styles = StyleSheet.create({
  bearing: {
    color: colors.brass,
    fontSize: 34,
    lineHeight: 42,
  },
  reading: {
    alignItems: 'center',
    gap: spacing.lg,
    paddingVertical: spacing.xl,
  },
  readingCopy: {
    textAlign: 'center',
  },
});

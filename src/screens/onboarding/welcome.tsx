import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';

import { NorthText } from '@/components/ui/north-text';
import { Reveal } from '@/components/ui/reveal';
import { GREETING_COPY_AT, OnboardingFrame } from '@/screens/onboarding/onboarding-frame';
import { motion, spacing } from '@/theme';

type WelcomeProps = {
  name: string;
  onContinue: () => void;
};

export function Welcome({ name, onContinue }: WelcomeProps) {
  const reduceMotion = useReducedMotion();
  const [ready, setReady] = useState(reduceMotion);

  useEffect(() => {
    if (reduceMotion) return;
    const timer = setTimeout(() => setReady(true), GREETING_COPY_AT + motion.settle + motion.arrival + motion.quick + motion.instant);
    return () => clearTimeout(timer);
  }, [reduceMotion]);

  return (
    <OnboardingFrame
      actionLabel="Start onboarding"
      align="centre"
      animateAvailability
      disabled={!ready}
      onContinue={onContinue}
      presentation="statement"
      title={`Hi, ${name}.\nI'm North.`}
      titleRevealDelay={GREETING_COPY_AT}
    >
      <Reveal delay={GREETING_COPY_AT + motion.settle} enabled={!reduceMotion} style={styles.line}>
        <NorthText style={styles.copy}>Before I can help, I need to know you a little.</NorthText>
      </Reveal>
      <Reveal delay={GREETING_COPY_AT + motion.settle + motion.arrival} enabled={!reduceMotion} style={styles.line}>
        <NorthText style={styles.copy}>Onboarding takes about 5 minutes.</NorthText>
      </Reveal>
    </OnboardingFrame>
  );
}

const styles = StyleSheet.create({
  copy: {
    textAlign: 'center',
  },
  line: {
    alignSelf: 'center',
    marginBottom: spacing.md,
    maxWidth: 340,
  },
});

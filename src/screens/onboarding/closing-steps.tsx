import { useCallback, useRef, useState } from 'react';
import { useAudioPlayer } from 'expo-audio';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';

import { HoldButton } from '@/components/ui/hold-button';
import { NorthText } from '@/components/ui/north-text';
import type { Line } from '@/domains/content/catalogue';
import { LineCard } from '@/domains/content/ui/line-card';
import { contractImpact, selectionTick } from '@/platform/haptics';
import { OnboardingFrame } from '@/screens/onboarding/onboarding-frame';
import { colors, motion, spacing } from '@/theme';

const CLAUSES = [
  'I will tell the truth about where I stand.',
  'I will take one action at a time.',
  'When North asks how it went, I will answer honestly.',
  'A miss moves nothing back. I will choose what comes next.',
  'I will use it until I no longer need it.',
] as const;

type ContractStepProps = {
  name: string;
  onCommit: () => void;
  onHold: (holding: boolean) => void;
  onSeal?: (sealed: number) => void;
};

/** The existing Contract ceremony, kept separate from account creation. */
export function ContractStep({
  name,
  onCommit,
  onHold,
  onSeal,
}: ContractStepProps) {
  const reduceMotion = useReducedMotion();
  const contractSound = useAudioPlayer(require('../../../assets/sounds/contract-signed.m4a'));
  const committed = useRef(false);
  const [lit, setLit] = useState(0);

  const seal = useCallback(
    (clause: number) => {
      setLit(clause);
      onSeal?.(clause);
      if (clause < CLAUSES.length) void selectionTick();
    },
    [onSeal],
  );

  const hold = useCallback(
    (holding: boolean) => {
      onHold(holding);
      if (!holding) {
        setLit(0);
        onSeal?.(0);
      }
    },
    [onHold, onSeal],
  );

  function commit() {
    if (committed.current) return;
    committed.current = true;
    if (!reduceMotion) contractSound.play();
    void contractImpact();
    onCommit();
  }

  return (
    <OnboardingFrame
      body="Hold to read each line. Let go to stop."
      title={`${name}, make the agreement.`}
    >
      <View style={styles.commitment}>
        <View style={styles.clauses}>
          {CLAUSES.map((clause, index) => (
            <Clause key={clause} lit={index < lit} text={clause} />
          ))}
        </View>

        <HoldButton
          duration={motion.commitHold}
          holdingLabel="KEEP HOLDING"
          label="HOLD TO AGREE"
          onComplete={commit}
          onHoldChange={hold}
          onStep={seal}
          steps={CLAUSES.length}
        />

        <Pressable accessibilityRole="button" onPress={commit} style={styles.without}>
          <NorthText style={styles.withoutLabel} variant="label">
            AGREE WITHOUT HOLDING
          </NorthText>
        </Pressable>
      </View>
    </OnboardingFrame>
  );
}

function Clause({ lit, text }: { lit: boolean; text: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <Animated.View
      style={[
        styles.clause,
        {
          borderLeftColor: lit ? colors.brass : colors.line,
          opacity: lit ? 1 : 0.45,
          transitionDuration: reduceMotion ? 0 : motion.settle,
          transitionProperty: ['opacity', 'borderLeftColor'],
          transitionTimingFunction: motion.easingStandard,
        },
      ]}
    >
      <NorthText style={lit ? styles.paper : undefined}>{text}</NorthText>
    </Animated.View>
  );
}

type FirstActionStepProps = {
  lines: readonly Line[];
  northStar: string;
  onChoose: (lineId: string) => void;
  onContinue: () => void;
  reflectionLed: boolean;
  value: string | null;
};

/** The first choice between two suggestions, made before the app opens. */
export function FirstActionStep({
  lines,
  northStar,
  onChoose,
  onContinue,
  reflectionLed,
  value,
}: FirstActionStepProps) {
  const chosen = value ?? lines[0]?.id ?? null;
  return (
    <OnboardingFrame
      actionLabel="Start with this one"
      body={reflectionLed
        ? 'The first one starts with what you said is costing you most. Pick one.'
        : 'Two places to start, from where you are furthest off. Pick one.'}
      disabled={!chosen}
      onContinue={() => {
        if (chosen && !value) onChoose(chosen);
        onContinue();
      }}
      title="Your first Action."
    >
      <View style={styles.result}>
        <NorthText variant="label">NORTH STAR · {northStar.toUpperCase()}</NorthText>
        {lines.map((line) => (
          <LineCard
            key={line.id}
            line={line}
            onPress={() => { void selectionTick(); onChoose(line.id); }}
            quoteLines={3}
            selected={line.id === chosen}
          />
        ))}
      </View>
    </OnboardingFrame>
  );
}

type CheckInStepProps = {
  onAllow: () => void;
  onSkip: () => void;
  time: string;
};

/** The one notification, asked for at the moment it makes sense. */
export function CheckInStep({ onAllow, onSkip, time }: CheckInStepProps) {
  return (
    <OnboardingFrame
      actionLabel="Ask me at the check-in"
      body={`At ${time} on the day you chose, North asks one thing: did you do it? Nothing else is ever sent. You can change the time in Settings.`}
      onContinue={onAllow}
      presentation="statement"
      secondaryAction={{ label: 'Not now', onPress: onSkip }}
      title="One question, once."
    />
  );
}

const styles = StyleSheet.create({
  clause: {
    borderLeftWidth: 2,
    paddingLeft: spacing.lg,
    paddingVertical: spacing.xs,
  },
  clauses: {
    gap: spacing.md,
  },
  commitment: {
    gap: spacing.xl,
  },
  paper: {
    color: colors.paper,
  },
  result: {
    gap: spacing.md,
  },
  without: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  withoutLabel: {
    color: colors.slate,
  },
});

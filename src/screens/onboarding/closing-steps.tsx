import { useCallback, useRef, useState } from 'react';
import { useAudioPlayer } from 'expo-audio';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';

import { HoldButton } from '@/components/ui/hold-button';
import { NorthText } from '@/components/ui/north-text';
import type { AuthoredAction } from '@/domains/content/catalogue';
import type { Axis } from '@/domains/direction/initial-direction';
import { ActionBrief } from '@/domains/actions/ui/action-brief';
import { contractImpact, selectionTick } from '@/platform/haptics';
import { OnboardingFrame } from '@/screens/onboarding/onboarding-frame';
import { colors, motion, spacing } from '@/theme';

type LetterStepProps = {
  onContinue: () => void;
};

const AXIS_LABELS: Record<Axis, string> = {
  agency: 'Agency',
  appetite: 'Self-command',
  connection: 'Connection',
  craft: 'Craft',
  desire: 'Desire',
  frame: 'Frame',
};

export function LetterStep({ onContinue }: LetterStepProps) {
  return (
    <OnboardingFrame
      actionLabel="Read the agreement"
      onContinue={onContinue}
      presentation="statement"
      title="Use North until you don't need it."
    >
      <View style={styles.letter}>
        <NorthText style={styles.paper}>
          North will not remind you or ask for proof.
        </NorthText>
        <NorthText>
          If you miss, say so. Nothing moves backward. Choose what to do next.
        </NorthText>
      </View>
    </OnboardingFrame>
  );
}

const CLAUSES = [
  'I will tell the truth about where I stand.',
  'I will name the actions I take, in my own words.',
  'I will keep the deadlines I set, or say plainly that I did not.',
  'North will not remind me, verify me, or punish me for returning late.',
  'I will use it until I no longer need it.',
] as const;

type ContractStepProps = {
  name: string;
  onCommit: () => void;
  onHold: (holding: boolean) => void;
  onSeal: (sealed: number) => void;
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
      onSeal(clause);
      if (clause < CLAUSES.length) void selectionTick();
    },
    [onSeal],
  );

  const hold = useCallback(
    (holding: boolean) => {
      onHold(holding);
      if (!holding) {
        setLit(0);
        onSeal(0);
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
  action: AuthoredAction;
  northStar: string;
  onContinue: () => void;
  reflectionLed: boolean;
};

export function FirstActionStep({
  action,
  northStar,
  onContinue,
  reflectionLed,
}: FirstActionStepProps) {
  return (
    <OnboardingFrame
      actionLabel="Create your account"
      body={reflectionLed
        ? 'This starts with what you said is costing you most.'
        : 'This is the first area to work on.'}
      onContinue={onContinue}
      title="Your first Action."
    >
      <View style={styles.result}>
        <NorthText variant="label">NORTH STAR · {northStar.toUpperCase()}</NorthText>
        <NorthText variant="label">
          START HERE · {AXIS_LABELS[action.axis].toUpperCase()}
        </NorthText>
      </View>
      <ActionBrief action={action} />
    </OnboardingFrame>
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
  letter: {
    gap: spacing.xl,
  },
  paper: {
    color: colors.paper,
  },
  result: {
    gap: spacing.sm,
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

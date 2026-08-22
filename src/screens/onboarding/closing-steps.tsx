import { useCallback, useState } from 'react';
import { useAudioPlayer } from 'expo-audio';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  useReducedMotion,
} from 'react-native-reanimated';

import { HoldButton } from '@/components/ui/hold-button';
import { NorthText } from '@/components/ui/north-text';
import type { OnboardingDraft } from '@/domains/onboarding/onboarding';
import { northStarLabel } from '@/domains/onboarding/onboarding';
import { contractImpact, selectionTick } from '@/platform/haptics';
import { OnboardingFrame } from '@/screens/onboarding/onboarding-frame';
import { colors, motion, spacing } from '@/theme';

const CODE_STANZAS = [
  [
    "We don't cry for sympathy. We don't beg for ease.",
    "Pain is part of the process, and we don't run from it. We carry it, crush it, learn from it.",
  ],
  [
    "We don't whine. We don't complain to gain applause.",
    'We share our scars as lessons, not as excuses. We bleed quietly, rebuild silently, and rise without asking permission.',
  ],
  [
    'We solve problems. We own our mistakes. We act decisively.',
    'When the world presses down, we press back harder. Not with noise, but with resolve.',
  ],
  [
    "Our strength doesn't shout or posture.",
    "It's in patience, purpose, and presence. In quiet acts of bravery, and in the consistency of character when nobody else is watching.",
  ],
] as const;

/**
 * The code opens rather than appears. Each passage arrives once, in the order
 * it is read, because he asked for it on the screen before — an entrance that
 * belongs to his press, not to arrival, and that never plays a second time.
 */
export function TheCode() {
  const reduceMotion = useReducedMotion();

  function opening(index: number) {
    if (reduceMotion) return undefined;
    return FadeInDown.duration(motion.settle)
      .delay(index * 70)
      .easing(Easing.bezier(0.32, 0.72, 0, 1))
      .withInitialValues({ opacity: 0, transform: [{ translateY: 10 }] });
  }

  return (
    <View style={styles.code}>
      <NorthText variant="heading">For any man starting over.</NorthText>
      <NorthText variant="small">
        A call to reclaim strength, courage, and character in an age of noise.
      </NorthText>
      {CODE_STANZAS.map((stanza, index) => (
        <Animated.View entering={opening(index + 1)} key={stanza[0]} style={styles.stanza}>
          <NorthText style={styles.paper}>{stanza[0]}</NorthText>
          <NorthText>{stanza[1]}</NorthText>
        </Animated.View>
      ))}
      <View style={styles.rule} />
      <View style={styles.stanza}>
        <NorthText>
          This is not about ego or perfection, nor about suppressing emotion. It&apos;s about
          honouring ourselves, standing firm when life bends us, and refusing to become victims
          of circumstance.
        </NorthText>
        <NorthText>
          It&apos;s about becoming the kind of man others can lean on — not the kind who always
          needs a shoulder.
        </NorthText>
      </View>
      <View style={styles.stanza}>
        <NorthText style={styles.paper}>
          We choose responsibility over blame, discipline over indulgence, and dignity over
          drama.
        </NorthText>
        <NorthText>
          We are men — not by accident, but by action. Not defined by bravado, but by backbone.
        </NorthText>
      </View>
      <View style={styles.rule} />
      <NorthText style={styles.codeClose} variant="heading">
        Strength. Stillness. Sovereignty.{`\n`}This is the code.
      </NorthText>
    </View>
  );
}

type CodeStepProps = {
  onContinue: () => void;
};

export function CodeIntroStep({ onContinue }: CodeStepProps) {
  return (
    <OnboardingFrame
      actionLabel="Open the code"
      body="The code is what North was built on. Four short passages. Nothing in it is scored, and you are allowed to decide it is not for you."
      onContinue={onContinue}
      presentation="statement"
      title="Put the phone down for a minute."
    />
  );
}

export function CodeStep({ onContinue }: CodeStepProps) {
  return (
    <OnboardingFrame
      actionLabel="Continue"
      body="Read it if it earns your time. I do not need you to agree with every line."
      onContinue={onContinue}
      secondaryAction={{ label: 'Skip the code.', onPress: onContinue }}
      scrollable
      title="I will offer this once."
    >
      <TheCode />
    </OnboardingFrame>
  );
}

type LetterStepProps = {
  age: number;
  name: string;
  onContinue: () => void;
};

export function LetterStep({ age, name, onContinue }: LetterStepProps) {
  const ageCopy = age >= 18 && age <= 25
    ? 'Forty-five percent of men your age have never once walked up to a woman and said something. Not rejected. Never tried.'
    : 'Forty-five percent of men aged eighteen to twenty-five have never once walked up to a woman and said something. Not rejected. Never tried.';

  return (
    <OnboardingFrame
      actionLabel="Read the contract"
      onContinue={onContinue}
      title={`${name}, this is meant to end.`}
    >
      <View style={styles.letter}>
        <NorthText style={styles.paper}>
          North is a compass, not a place to live. Use it until you can hold your own direction,
          then leave it behind.
        </NorthText>
        <NorthText>
          It will not remind you, watch you, or ask for proof. What happens next rests on the word
          you give yourself.
        </NorthText>
        <View style={styles.rule} />
        <NorthText style={styles.paper}>{ageCopy}</NorthText>
        <NorthText style={styles.paper}>
          Most men who start something like this stop before day twelve.
        </NorthText>
      </View>
    </OnboardingFrame>
  );
}

/**
 * The Contract, said one clause at a time. The five lines are short on purpose:
 * each one has to be readable in the two seconds the circuit takes to pass it,
 * and a man should be able to finish the hold knowing exactly what he agreed
 * to rather than having skimmed a paragraph.
 */
const CLAUSES = [
  'I will tell the truth about where I stand.',
  'I will name the actions I take, in my own words.',
  'I will keep the deadlines I set, or say plainly that I did not.',
  'North will not remind me, verify me, or punish me for returning late.',
  'I will use it until I no longer need it.',
] as const;

type ContractStepProps = {
  bearing: number;
  complete: boolean;
  draft: OnboardingDraft;
  name: string;
  /** Leaves onboarding for the app he just committed to. */
  onBegin: () => void;
  onCommit: () => void;
  /** Reports the hand, so the shell can draw the circuit around the screen. */
  onHold: (holding: boolean) => void;
  /** Reports each clause as it lights, so the Mascot can wind with it. */
  onSeal: (sealed: number) => void;
};

export function ContractStep({
  bearing,
  complete,
  draft,
  name,
  onBegin,
  onCommit,
  onHold,
  onSeal,
}: ContractStepProps) {
  const reduceMotion = useReducedMotion();
  const contractSound = useAudioPlayer(require('../../../assets/sounds/contract-signed.m4a'));
  const [lit, setLit] = useState(0);

  const seal = useCallback(
    (clause: number) => {
      setLit(clause);
      onSeal(clause);
      if (clause < CLAUSES.length) {
        void selectionTick();
      }
    },
    [onSeal],
  );

  // Letting go puts the contract back in the dark. Nothing is kept from an
  // abandoned hold, which is the entire reason the hold means anything.
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
    if (!reduceMotion) {
      contractSound.play();
    }
    void contractImpact();
    onCommit();
  }

  if (complete) {
    return (
      <OnboardingFrame
        actionLabel="Take your first action"
        align="centre"
        onContinue={onBegin}
        scrollable
        title="You gave your word."
      >
        <Summary bearing={bearing} draft={draft} />
      </OnboardingFrame>
    );
  }

  return (
    <OnboardingFrame
      body="Hold it down and read what you are agreeing to. Let go at any point and it opens again."
      // Five clauses, a held button and a way out do not fit a small phone at
      // once, and a ceremony with its own button below the fold is worse than
      // one that scrolls.
      scrollable
      title={`Your word is enough for me, ${name}.`}
    >
      <View style={styles.commitment}>
        <View style={styles.clauses}>
          {CLAUSES.map((clause, index) => (
            <Clause key={clause} lit={index < lit} text={clause} />
          ))}
        </View>

        <HoldButton
          duration={motion.commitHold}
          holdingLabel="KEEP YOUR HAND THERE"
          label="HOLD TO COMMIT"
          onComplete={commit}
          onHoldChange={hold}
          onStep={seal}
          steps={CLAUSES.length}
        />

        {/* Onboarding ends here, and a ten-second hold is not available to
            every hand. The way through is offered plainly rather than hidden
            behind an accessibility action nobody can see. */}
        <Pressable accessibilityRole="button" onPress={commit} style={styles.without}>
          <NorthText style={styles.withoutLabel} variant="label">
            COMMIT WITHOUT HOLDING
          </NorthText>
        </Pressable>
      </View>
    </OnboardingFrame>
  );
}

/**
 * A clause is dark until the circuit reaches it. The transition carries the
 * colour and the mark together so a man reading at arm's length sees the line
 * arrive rather than a word quietly changing shade.
 */
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

type SummaryProps = {
  bearing: number;
  draft: OnboardingDraft;
};

export function Summary({ bearing, draft }: SummaryProps) {
  return (
    <View style={styles.summary}>
      <View style={styles.summaryIntro}>
        <NorthText variant="label">YOUR DIRECTION</NorthText>
        <NorthText>
          This is what you named and committed to. Reloading the app clears it.
        </NorthText>
      </View>

      <View style={styles.summarySection}>
        <NorthText variant="label">STARTING BEARING</NorthText>
        <NorthText style={styles.summaryBearing} variant="data">
          N {bearing}°
        </NorthText>
      </View>

      <View style={styles.summarySection}>
        <NorthText variant="label">NORTH STAR</NorthText>
        <NorthText style={styles.paper} variant="heading">
          {northStarLabel(draft.northStar)}
        </NorthText>
      </View>

      <View style={styles.summarySection}>
        <NorthText variant="label">ONE HONEST THING</NorthText>
        <NorthText selectable style={styles.paper}>
          {draft.honestThing}
        </NorthText>
      </View>

      <View style={styles.summarySection}>
        <NorthText variant="label">CONTRACT</NorthText>
        <NorthText style={styles.paper}>Held and given by {draft.profile.name}.</NorthText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  code: {
    backgroundColor: colors.field,
    borderColor: colors.lineSoft,
    borderWidth: 1,
    gap: spacing.xl,
    padding: spacing.xl,
  },
  codeClose: {
    color: colors.meridianLight,
  },
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
  without: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  withoutLabel: {
    color: colors.slate,
  },
  contract: {
    borderLeftColor: colors.meridian,
    borderLeftWidth: 2,
    gap: spacing.lg,
    paddingLeft: spacing.lg,
  },
  letter: {
    gap: spacing.xl,
    paddingVertical: spacing.xl,
  },
  paper: {
    color: colors.paper,
  },
  rule: {
    backgroundColor: colors.line,
    height: 1,
  },
  stanza: {
    gap: spacing.sm,
  },
  summary: {
    flex: 1,
    gap: spacing.xxl,
    paddingBottom: spacing.xxxl,
    paddingTop: spacing.xxxl,
  },
  summaryBearing: {
    color: colors.brass,
    fontSize: 34,
    lineHeight: 42,
  },
  summaryIntro: {
    gap: spacing.md,
  },
  summarySection: {
    borderTopColor: colors.lineSoft,
    borderTopWidth: 1,
    gap: spacing.sm,
    paddingTop: spacing.lg,
  },
});

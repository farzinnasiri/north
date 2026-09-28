import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { router } from 'expo-router';
import {
  Easing,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import type { Answer, OnboardingDraft } from '@/domains/onboarding/onboarding';
import {
  QUESTIONS,
  getAxisReadings,
  getInitialDirection,
  northStarLabel,
} from '@/domains/onboarding/onboarding';
import { axisForHonestThing, nextAction } from '@/domains/content/selection';
import { onboardingMascotScene } from '@/domains/onboarding/mascot-scene';
import { directionWeightsForNorthStar, rankNorthStars } from '@/domains/onboarding/north-star';
import { clearDraft, loadDraft, saveDraft } from '@/domains/onboarding/persistence';
import type { OnboardingStep } from '@/domains/onboarding/sequence';
import { ONBOARDING_STEPS, promptPositionFor } from '@/domains/onboarding/sequence';
import { useJourney } from '@/domains/journey/store';
import { OnboardingShell } from '@/screens/onboarding/onboarding-frame';
import {
  ContractStep,
  FirstActionStep,
  LetterStep,
} from '@/screens/onboarding/closing-steps';
import { OnboardingProgressProvider } from '@/screens/onboarding/onboarding-progress';
import { OnboardingStepTransition } from '@/screens/onboarding/onboarding-step-transition';
import type { StepDirection } from '@/screens/onboarding/onboarding-step-transition';
import { ProfileStep } from '@/screens/onboarding/profile-step';
import { QuestionStep } from '@/screens/onboarding/question-step';
import { RealityReveal } from '@/screens/onboarding/reality-reveal';
import {
  NorthStarIntroStep,
  NorthStarCurationStep,
  StarQuestionStep,
  StarRevealStep,
} from '@/screens/onboarding/north-star-steps';
import { HonestThingStep } from '@/screens/onboarding/reflection-steps';
import { Welcome } from '@/screens/onboarding/welcome';
import { motion } from '@/theme';

/**
 * The rail shows movements rather than screens. Forty segments would barely
 * move and would read as a countdown; eight tell a man which part of the work
 * he is in.
 */
const PHASES = ['You', 'Reality', 'North Star', 'Word'];

function phaseOf(step: OnboardingStep): number {
  switch (step.kind) {
    case 'welcome':
    case 'profile':
      return 0;
    case 'question':
    case 'honest':
    case 'reality-reveal':
      return 1;
    case 'north-star-intro':
    case 'star-question':
    case 'north-star-curation':
    case 'star-reveal':
      return 2;
    default:
      return 3;
  }
}

export function OnboardingFlow() {
  const begin = useJourney((state) => state.begin);
  const restored = useMemo(() => loadDraft(), []);
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState(restored.step);
  const [stepDirection, setStepDirection] = useState<StepDirection>('forward');
  const [transition, setTransition] = useState(0);
  const [draft, setDraft] = useState<OnboardingDraft>(restored.draft);
  const ceremony = useSharedValue(0);
  const [holding, setHolding] = useState(false);
  const [sealed, setSealed] = useState(0);
  const transitionLock = useRef(false);
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Persist on every step so a phone call does not cost fifteen minutes.
  useEffect(() => {
    saveDraft(step, draft);
  }, [draft, step]);

  useEffect(() => () => {
    if (transitionTimer.current) clearTimeout(transitionTimer.current);
  }, []);

  useEffect(() => {
    ceremony.set(withTiming(holding ? 1 : 0, {
      duration: holding ? motion.commitHold : motion.quick,
      easing: holding ? Easing.linear : Easing.bezier(0.23, 1, 0.32, 1),
    }));
  }, [ceremony, holding]);

  const answered = Object.keys(draft.answers).length;
  const readings = useMemo(() => getAxisReadings(draft.answers), [draft.answers]);
  const direction = useMemo(
    () => answered === 0 || !draft.northStar
      ? 180
      : getInitialDirection(
        draft.answers,
        directionWeightsForNorthStar(draft.northStar),
      ),
    [answered, draft.answers, draft.northStar],
  );
  const firstAction = useMemo(
    () => nextAction({
      closed: [],
      honestThing: draft.honestThing,
      northStar: draft.northStar,
      passed: [],
      readings,
    }),
    [draft.honestThing, draft.northStar, readings],
  );

  const current = ONBOARDING_STEPS[Math.min(step, ONBOARDING_STEPS.length - 1)];

  const lockTransition = useCallback(() => {
    if (transitionLock.current) return false;
    transitionLock.current = true;
    transitionTimer.current = setTimeout(() => {
      transitionLock.current = false;
      transitionTimer.current = null;
    }, reduceMotion ? 0 : motion.settle);
    return true;
  }, [reduceMotion]);

  const back = useCallback(() => {
    if (!lockTransition()) return;
    setTransition((value) => value + 1);
    setStepDirection('back');
    setStep((value) => Math.max(0, value - 1));
  }, [lockTransition]);

  const next = useCallback(() => {
    if (!lockTransition()) return;
    setTransition((value) => value + 1);
    setStepDirection('forward');
    setStep((value) => Math.min(ONBOARDING_STEPS.length - 1, value + 1));
  }, [lockTransition]);

  const setAnswer = useCallback(
    (answer: Answer) => {
      setDraft((value) => ({ ...value, answers: { ...value.answers, [answer.id]: answer } }));
      next();
    },
    [next],
  );

  const phase = phaseOf(current);
  const inPhase = ONBOARDING_STEPS.filter((candidate) => phaseOf(candidate) === phase);
  const positionInPhase = inPhase.indexOf(current);

  const progress = {
    answered,
    ceremony,
    mascot: onboardingMascotScene({
      ceremony: sealed,
      direction,
      moment: current.kind,
      phase,
      step: step + 1,
      total: ONBOARDING_STEPS.length,
    }),
    phase,
    phaseFraction: inPhase.length <= 1 ? 1 : (positionInPhase + 1) / inPhase.length,
    phases: PHASES,
    prompt: promptPositionFor(current),
    step: step + 1,
    total: ONBOARDING_STEPS.length,
  };
  const transitionDirection = stepDirection === 'back'
    ? 'back'
    : 'forward';

  return (
    <OnboardingProgressProvider value={progress}>
      <OnboardingShell onBack={step > 0 ? back : undefined}>
        <OnboardingStepTransition
          animate={transition > 0}
          direction={transitionDirection}
          sequence={transition}
          step={step}
        >
          {renderStep()}
        </OnboardingStepTransition>
      </OnboardingShell>
    </OnboardingProgressProvider>
  );

  function renderStep() {
    switch (current.kind) {
      case 'welcome':
        return <Welcome onContinue={next} />;

      case 'profile':
        return (
          <ProfileStep
            onChange={(profile) => setDraft((value) => ({ ...value, profile }))}
            onContinue={next}
            profile={draft.profile}
            step={current.field}
          />
        );

      case 'question': {
        const question = QUESTIONS[current.index];
        return (
          <QuestionStep
            answer={draft.answers[question.id]}
            key={question.id}
            onAnswer={setAnswer}
            profile={draft.profile}
            question={question}
          />
        );
      }

      case 'honest':
        return (
          <HonestThingStep
            onChange={(honestThing) => setDraft((value) => ({ ...value, honestThing }))}
            onContinue={next}
            value={draft.honestThing}
          />
        );

      case 'reality-reveal':
        return (
          <RealityReveal
            onContinue={next}
            readings={readings}
          />
        );

      case 'north-star-intro':
        return <NorthStarIntroStep onContinue={next} />;

      case 'star-question':
        return (
          <StarQuestionStep
            id={current.id}
            key={current.id}
            onChange={(id, answers) => {
              setDraft((value) => ({
                ...value,
                starAnswers: { ...value.starAnswers, [id]: answers },
              }));
            }}
            onContinue={next}
            profile={draft.profile}
            value={draft.starAnswers[current.id] ?? []}
          />
        );

      case 'north-star-curation':
        return <NorthStarCurationStep onContinue={next} />;

      case 'star-reveal': {
        const ranked = rankNorthStars({
          answers: draft.starAnswers,
        });
        return (
          <StarRevealStep
            name={draft.profile.name}
            onChoose={(northStar) => setDraft((value) => ({ ...value, northStar }))}
            onContinue={next}
            ranked={ranked}
            value={draft.northStar}
          />
        );
      }

      case 'letter':
        return <LetterStep onContinue={next} />;

      case 'contract':
        return (
          <ContractStep
            name={draft.profile.name}
            onCommit={() => {
              setHolding(false);
              setDraft((value) => ({ ...value, signedAt: Date.now() }));
              next();
            }}
            onHold={setHolding}
            onSeal={setSealed}
          />
        );

      case 'first-action':
        return (
          <FirstActionStep
            action={firstAction}
            northStar={northStarLabel(draft.northStar)}
            onContinue={() => {
              const at = Date.now();
              begin({
                at,
                direction,
                honestThing: draft.honestThing,
                name: draft.profile.name,
                northStar: draft.northStar,
                readings,
              });
              clearDraft();
              router.replace('/sign-up');
            }}
            reflectionLed={axisForHonestThing(draft.honestThing) !== null}
          />
        );
    }
  }
}

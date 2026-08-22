import { useCallback, useEffect, useMemo, useState } from 'react';
import { router } from 'expo-router';
import { Easing, useSharedValue, withTiming } from 'react-native-reanimated';

import { NorthText } from '@/components/ui/north-text';
import type { Axis } from '@/domains/bearing/initial-bearing';
import { placeholderBearingRule } from '@/domains/bearing/initial-bearing';
import type { Answer, FutureHorizon, OnboardingDraft } from '@/domains/onboarding/onboarding';
import {
  FUTURE_HORIZONS,
  QUESTIONS,
  getAxisReadings,
  getInitialBearing,
} from '@/domains/onboarding/onboarding';
import { onboardingMascotScene } from '@/domains/onboarding/mascot-scene';
import { STAR_QUESTIONS, rankNorthStars } from '@/domains/onboarding/north-star';
import { clearDraft, loadDraft, saveDraft } from '@/domains/onboarding/persistence';
import { useJourney } from '@/domains/journey/store';
import { OnboardingFrame, OnboardingShell } from '@/screens/onboarding/onboarding-frame';
import { colors, motion } from '@/theme';
import { AxisInterstitial } from '@/screens/onboarding/axis-interstitial';
import { FutureSelfStep } from '@/screens/onboarding/future-self-step';
import {
  CodeIntroStep,
  CodeStep,
  ContractStep,
  LetterStep,
} from '@/screens/onboarding/closing-steps';
import { OnboardingProgressProvider } from '@/screens/onboarding/onboarding-progress';
import { OnboardingStepTransition } from '@/screens/onboarding/onboarding-step-transition';
import type { StepDirection } from '@/screens/onboarding/onboarding-step-transition';
import { ProfileStep } from '@/screens/onboarding/profile-step';
import { StatPayoff } from '@/screens/onboarding/stat-payoff';
import { QuestionStep } from '@/screens/onboarding/question-step';
import {
  AlterEgoStep,
  AlterEgoIntroStep,
  AlterEgoLoadingStep,
  RoleModelStep,
  StarQuestionStep,
  StarRevealStep,
} from '@/screens/onboarding/north-star-steps';
import {
  BearingLoadingStep,
  BearingReadingStep,
  HonestThingStep,
} from '@/screens/onboarding/reflection-steps';
import { Welcome, WelcomePromise } from '@/screens/onboarding/welcome';

const AXES: readonly Axis[] = ['agency', 'frame', 'desire', 'connection', 'appetite', 'craft'];
/**
 * Axes no longer hold the same number of questions — Agency carries eight
 * because the future-self trio lives there — so the flow groups by the
 * question's own axis rather than by arithmetic on its index.
 */
function questionsFor(axis: Axis): number[] {
  return QUESTIONS.reduce<number[]>(
    (indices, question, index) => (question.axis === axis ? [...indices, index] : indices),
    [],
  );
}
/** A1 — hours spent watching other people live. Its answer earns a reply. */
const SCREEN_HOURS_INDEX = QUESTIONS.findIndex((question) => question.id === 'A1');
const LIFE_EXPECTANCY = 80;

function sampleThinkingDuration() {
  return Math.round(
    motion.thinkingMin + Math.random() * (motion.thinkingMax - motion.thinkingMin),
  );
}

/**
 * The rail shows movements rather than screens. Forty segments would barely
 * move and would read as a countdown; eight tell a man which part of the work
 * he is in.
 */
const PHASES = [
  'You',
  'Agency',
  'Frame',
  'Desire',
  'Connection',
  'Appetite',
  'Craft',
  'Direction',
  'Word',
];

function phaseOf(step: Step): number {
  switch (step.kind) {
    case 'welcome':
    case 'promise':
    case 'profile':
      return 0;
    case 'interstitial':
      return AXES.indexOf(step.axis) + 1;
    case 'question':
      return AXES.indexOf(QUESTIONS[step.index].axis) + 1;
    case 'payoff':
    case 'payoff-cost':
      return AXES.indexOf('appetite') + 1;
    case 'honest':
    case 'role-models':
    case 'star-question':
    case 'alter-ego-loading':
    case 'alter-ego-intro':
    case 'star-reveal':
    case 'alter-ego':
    case 'future-self':
      return AXES.length + 1;
    default:
      return AXES.length + 2;
  }
}

type Step =
  | { kind: 'welcome' }
  | { kind: 'promise' }
  | { kind: 'profile'; field: 1 | 2 | 3 }
  | { kind: 'interstitial'; axis: Axis }
  | { kind: 'question'; index: number }
  | { kind: 'payoff' }
  | { kind: 'payoff-cost' }
  | { kind: 'honest' }
  | { kind: 'role-models' }
  | { kind: 'star-question'; id: string }
  | { kind: 'alter-ego-loading' }
  | { kind: 'alter-ego-intro' }
  | { kind: 'star-reveal' }
  | { kind: 'alter-ego' }
  | { kind: 'future-self'; horizon: FutureHorizon }
  | { kind: 'bearing-loading' }
  | { kind: 'reading' }
  | { kind: 'code-intro' }
  | { kind: 'code' }
  | { kind: 'letter' }
  | { kind: 'contract' };

/**
 * The flow as data. Previously this was a chain of `if (step === 24)` against
 * hardcoded numbers that each screen also had to know, which is why the counter
 * and the questions disagreed by one. Inserting the chapter breaks here is now
 * a single edit and nothing downstream renumbers.
 */
const STEPS: readonly Step[] = [
  { kind: 'welcome' },
  { kind: 'promise' },
  { kind: 'profile', field: 1 },
  { kind: 'profile', field: 2 },
  { kind: 'profile', field: 3 },
  ...AXES.flatMap((axis): Step[] => [
    { axis, kind: 'interstitial' },
    ...questionsFor(axis).flatMap((index): Step[] =>
      index === SCREEN_HOURS_INDEX
        ? [{ index, kind: 'question' }, { kind: 'payoff' }, { kind: 'payoff-cost' }]
        : [{ index, kind: 'question' }],
    ),
  ]),
  { kind: 'honest' },
  { kind: 'role-models' },
  ...STAR_QUESTIONS.map((question): Step => ({ id: question.id, kind: 'star-question' })),
  ...FUTURE_HORIZONS.map((entry): Step => ({ horizon: entry.horizon, kind: 'future-self' })),
  { kind: 'alter-ego-loading' },
  { kind: 'alter-ego-intro' },
  { kind: 'star-reveal' },
  { kind: 'alter-ego' },
  { kind: 'bearing-loading' },
  { kind: 'reading' },
  { kind: 'code-intro' },
  { kind: 'code' },
  { kind: 'letter' },
  { kind: 'contract' },
];

export function OnboardingFlow() {
  const begin = useJourney((state) => state.begin);
  const restored = useMemo(() => loadDraft(), []);
  const [step, setStep] = useState(restored.step);
  const [direction, setDirection] = useState<StepDirection>('forward');
  const [transition, setTransition] = useState(0);
  const [complete, setComplete] = useState(false);
  const [draft, setDraft] = useState<OnboardingDraft>(restored.draft);
  const [alterEgoLoadingDuration] = useState(sampleThinkingDuration);
  // The Contract's circuit. The value is written here, where it is created,
  // and read by the shell that owns the edge of the screen it is drawn on.
  const ceremony = useSharedValue(0);
  const [holding, setHolding] = useState(false);
  /** Clauses of the Contract lit so far. Winds the Mascot as they light. */
  const [sealed, setSealed] = useState(0);

  useEffect(() => {
    ceremony.value = withTiming(holding ? 1 : 0, {
      duration: holding ? motion.commitHold : motion.quick,
      easing: holding ? Easing.linear : Easing.bezier(0.23, 1, 0.32, 1),
    });
  }, [ceremony, holding]);
  const [bearingLoadingDuration] = useState(sampleThinkingDuration);

  // Persist on every step so a phone call does not cost sixteen minutes.
  useEffect(() => {
    if (!complete) saveDraft(step, draft);
  }, [complete, draft, step]);

  const answered = Object.keys(draft.answers).length;
  const bearing = useMemo(
    () =>
      answered === 0 ? 180 : getInitialBearing(draft.answers, placeholderBearingRule),
    [answered, draft.answers],
  );

  const payoffHours = Number(draft.answers.A1?.raw ?? 0);
  // Straight arithmetic on his own answer, rounded down so the figure is never
  // larger than what he actually said.
  const payoffYears = Math.floor(
    (payoffHours * 365 * Math.max(1, LIFE_EXPECTANCY - draft.profile.age)) / 8760,
  );

  const current = STEPS[Math.min(step, STEPS.length - 1)];
  const loadingDuration = current.kind === 'alter-ego-loading'
    ? alterEgoLoadingDuration
    : current.kind === 'bearing-loading'
      ? bearingLoadingDuration
      : undefined;

  const back = useCallback(() => {
    setTransition((value) => value + 1);
    setDirection('back');
    setStep((value) => Math.max(0, value - 1));
  }, []);

  const next = useCallback(() => {
    setTransition((value) => value + 1);
    setDirection('forward');
    setStep((value) => Math.min(STEPS.length - 1, value + 1));
  }, []);

  const setAnswer = useCallback(
    (answer: Answer) => {
      setDraft((value) => ({ ...value, answers: { ...value.answers, [answer.id]: answer } }));
      next();
    },
    [next],
  );

  const phase = phaseOf(current);
  const inPhase = STEPS.filter((candidate) => phaseOf(candidate) === phase);
  const positionInPhase = inPhase.indexOf(current);

  const progress = {
    answered,
    ceremony,
    mascot: onboardingMascotScene({
      bearing,
      loadingDuration,
      ceremony: sealed,
      moment: complete ? 'complete' : current.kind,
      phase,
      step: step + 1,
      total: STEPS.length,
    }),
    phase,
    phaseFraction: inPhase.length <= 1 ? 1 : (positionInPhase + 1) / inPhase.length,
    phases: PHASES,
    step: step + 1,
    total: STEPS.length,
  };
  const transitionDirection = direction === 'back'
    ? 'back'
    : current.kind === 'interstitial' || current.kind === 'payoff' || current.kind === 'payoff-cost'
      ? 'chapter'
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

      case 'promise':
        return <WelcomePromise onContinue={next} />;
      case 'profile':
        return (
          <ProfileStep
            onChange={(profile) => setDraft((value) => ({ ...value, profile }))}
            onContinue={next}
            profile={draft.profile}
            step={current.field}
          />
        );

      case 'interstitial':
        return (
          <AxisInterstitial axis={current.axis} onContinue={next} />
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

      case 'role-models':
        return (
          <RoleModelStep
            onChange={(roleModels) => setDraft((value) => ({ ...value, roleModels }))}
            onContinue={next}
            value={draft.roleModels}
          />
        );

      case 'star-question':
        return (
          <StarQuestionStep
            id={current.id}
            key={current.id}
            onAnswer={(id, answer) => {
              setDraft((value) => ({
                ...value,
                starAnswers: { ...value.starAnswers, [id]: answer },
              }));
              next();
            }}
            value={draft.starAnswers[current.id]}
          />
        );

      case 'alter-ego-intro':
        return <AlterEgoIntroStep onContinue={next} />;

      case 'alter-ego-loading':
        return <AlterEgoLoadingStep duration={alterEgoLoadingDuration} onContinue={next} />;

      case 'star-reveal': {
        const ranked = rankNorthStars({
          answers: draft.starAnswers,
          roleModels: draft.roleModels,
        });
        return (
          <StarRevealStep
            name={draft.profile.name}
            onChoose={(northStar) => setDraft((value) => ({ ...value, northStar }))}
            onContinue={() => {
              setDraft((value) => ({ ...value, northStar: value.northStar ?? ranked[0] }));
              next();
            }}
            ranked={ranked}
            value={draft.northStar}
          />
        );
      }

      case 'payoff':
        return (
          <StatPayoff
            caption={payoffYears === 1 ? 'year of your life' : 'years of your life'}
            figure={`${payoffYears}`}
            kicker="AT THIS RATE"
            onContinue={next}
            title={`${payoffHours} hours a day, every day, until you are ${LIFE_EXPECTANCY}.`}
          />
        );

      case 'payoff-cost':
        return (
          <OnboardingFrame
            actionLabel="Keep going"
            align="centre"
            onContinue={next}
            presentation="statement"
            title={`You cannot get those back, ${draft.profile.name}.`}
          >
            <NorthText style={{ color: colors.ash, textAlign: 'center' }}>
              You can decide what the next ones are for.
            </NorthText>
          </OnboardingFrame>
        );

      case 'alter-ego': {
        return (
          <AlterEgoStep
            name={draft.profile.name}
            onChange={(alterEgo) => setDraft((value) => ({ ...value, alterEgo }))}
            onContinue={next}
            value={draft.alterEgo}
          />
        );
      }

      case 'future-self':
        return (
          <FutureSelfStep
            horizon={current.horizon}
            onChange={(values) =>
              setDraft((value) => ({
                ...value,
                futureSelf: { ...value.futureSelf, [current.horizon]: values },
              }))
            }
            onContinue={next}
            value={draft.futureSelf[current.horizon] ?? []}
          />
        );

      case 'reading':
        return (
          <BearingReadingStep
            bearing={bearing}
            name={draft.profile.name}
            onContinue={next}
          />
        );

      case 'bearing-loading':
        return <BearingLoadingStep duration={bearingLoadingDuration} onComplete={next} />;

      case 'code-intro':
        return <CodeIntroStep onContinue={next} />;

      case 'code':
        return <CodeStep onContinue={next} />;

      case 'letter':
        return (
          <LetterStep
            age={draft.profile.age}
            name={draft.profile.name}
            onContinue={next}
          />
        );

      case 'contract':
        return (
          <ContractStep
            bearing={bearing}
            complete={complete}
            draft={draft}
            name={draft.profile.name}
            onBegin={() => router.replace('/')}
            onHold={setHolding}
            onSeal={setSealed}
            onCommit={() => {
              const at = Date.now();
              setDraft((value) => ({ ...value, signedAt: at }));
              // The Contract is the moment onboarding hands the person over to
              // the product: everything it measured becomes the journey he is
              // now walking, and the draft it was assembled in is discarded.
              begin({
                alterEgo: draft.alterEgo,
                at,
                bearing,
                honestThing: draft.honestThing,
                name: draft.profile.name,
                northStar: draft.northStar,
                readings: getAxisReadings(draft.answers),
              });
              clearDraft();
              setComplete(true);
            }}
          />
        );
    }
  }
}

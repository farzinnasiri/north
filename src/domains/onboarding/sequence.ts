import type { Axis } from '@/domains/direction/initial-direction';
import { QUESTIONS } from '@/domains/onboarding/onboarding';
import { STAR_QUESTIONS } from '@/domains/onboarding/north-star';

export const ONBOARDING_AXES: readonly Axis[] = [
  'frame',
  'desire',
  'connection',
  'appetite',
  'craft',
  'agency',
];

export type OnboardingStep =
  | { kind: 'welcome' }
  | { kind: 'profile'; field: 1 | 2 }
  | { kind: 'question'; index: number }
  | { kind: 'honest' }
  | { kind: 'reality-reveal' }
  | { kind: 'north-star-intro' }
  | { kind: 'star-question'; id: string }
  | { kind: 'north-star-curation' }
  | { kind: 'star-reveal' }
  | { kind: 'letter' }
  | { kind: 'contract' }
  | { kind: 'first-action' };

function questionsFor(axis: Axis): OnboardingStep[] {
  return QUESTIONS.reduce<OnboardingStep[]>(
    (steps, question, index) =>
      question.axis === axis ? [...steps, { index, kind: 'question' }] : steps,
    [],
  );
}

export const ONBOARDING_STEPS: readonly OnboardingStep[] = [
  { kind: 'welcome' },
  { kind: 'profile', field: 1 },
  { kind: 'profile', field: 2 },
  ...ONBOARDING_AXES.flatMap((axis): OnboardingStep[] => questionsFor(axis)),
  { kind: 'honest' },
  { kind: 'reality-reveal' },
  { kind: 'north-star-intro' },
  ...STAR_QUESTIONS.map((question): OnboardingStep => ({
    id: question.id,
    kind: 'star-question',
  })),
  { kind: 'north-star-curation' },
  { kind: 'star-reveal' },
  { kind: 'letter' },
  { kind: 'contract' },
  { kind: 'first-action' },
];

export const ONBOARDING_PROMPT_COUNT =
  QUESTIONS.length + 1 + STAR_QUESTIONS.length;

export type OnboardingPromptPosition = {
  current: number;
  total: number;
};

export function promptPositionFor(step: OnboardingStep): OnboardingPromptPosition | null {
  if (step.kind === 'question') {
    return { current: step.index + 1, total: ONBOARDING_PROMPT_COUNT };
  }

  if (step.kind === 'honest') {
    return { current: QUESTIONS.length + 1, total: ONBOARDING_PROMPT_COUNT };
  }

  if (step.kind === 'star-question') {
    const index = STAR_QUESTIONS.findIndex((question) => question.id === step.id);
    return index < 0
      ? null
      : { current: QUESTIONS.length + 2 + index, total: ONBOARDING_PROMPT_COUNT };
  }

  return null;
}

import type { MascotExpression, MascotScene } from '@/domains/mascot/mascot';

export type OnboardingMascotMoment =
  | 'welcome'
  | 'profile'
  | 'question'
  | 'payoff'
  | 'payoff-cost'
  | 'reality-reveal'
  | 'honest'
  | 'role-models'
  | 'north-star-intro'
  | 'star-question'
  | 'north-star-curation'
  | 'star-reveal'
  | 'contract'
  | 'first-action'
  | 'future-self'
  | 'letter';

type OnboardingMascotSceneInput = {
  /** Clauses of the Contract lit so far, 0-5. */
  ceremony?: number;
  direction: number;
  moment: OnboardingMascotMoment;
  /** Zero-based phase index. */
  phase: number;
  /** One-based screen position. */
  step: number;
  total: number;
};

function expressionFor(moment: OnboardingMascotMoment): MascotExpression {
  switch (moment) {
    case 'question':
    case 'honest':
    case 'star-question':
    case 'first-action':
    case 'future-self':
      return 'focused';
    case 'north-star-intro':
    case 'star-reveal':
      return 'direction';
    case 'payoff':
    case 'north-star-curation':
      return 'loading';
    case 'payoff-cost':
      return 'concerned';
    case 'letter':
    case 'contract':
    case 'reality-reveal':
      return 'settled';
    default:
      return 'neutral';
  }
}

/**
 * Onboarding policy for the mascot. It reacts to the meaning of a screen, not
 * the moral value of an answer: an honest answer is never rewarded or scolded
 * by a face. Progress and chapter movement remain deterministic.
 */
export function onboardingMascotScene({
  ceremony = 0,
  direction,
  moment,
  phase,
  step,
  total,
}: OnboardingMascotSceneInput): MascotScene {
  const completion = total <= 1 ? 1 : (step - 1) / (total - 1);
  const afterNorthStarDeliberation = [
    'north-star-curation',
    'star-reveal',
    'letter',
    'contract',
    'first-action',
  ].includes(moment);
  const deliberateDuration = moment === 'north-star-curation' ? 'arrival' : undefined;
  const wound = moment === 'contract' ? ceremony * 90 : 0;
  return {
    direction,
    completion,
    expression: expressionFor(moment),
    gesture: moment === 'welcome'
      ? { cue: 'onboarding-arrival', duration: 'arrival', kind: 'arrive' }
      : undefined,
    rotations: {
      // One complete bezel turn gives the long flow a quiet physical record.
      outer: {
        angle: completion * 360
          + (afterNorthStarDeliberation ? 360 : 0)
          + wound,
        duration: deliberateDuration ?? 'settle',
      },
      // Each chapter advances the cardinal instrument by one graduation.
      cardinals: {
        angle: phase * 15
          - (afterNorthStarDeliberation ? 360 : 0)
          - wound,
        duration: deliberateDuration ?? 'quick',
      },
      face: {
        angle: 0,
        duration: deliberateDuration ?? 'quick',
      },
    },
    transition: {
      duration: 'quick',
      expression: 'default',
    },
  };
}

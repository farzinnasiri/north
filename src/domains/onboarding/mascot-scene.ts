import type { MascotExpression, MascotScene } from '@/domains/mascot/mascot';

export type OnboardingMascotMoment =
  | 'welcome'
  | 'promise'
  | 'profile'
  | 'interstitial'
  | 'question'
  | 'payoff'
  | 'payoff-cost'
  | 'honest'
  | 'role-models'
  | 'star-question'
  | 'alter-ego-loading'
  | 'alter-ego-intro'
  | 'star-reveal'
  | 'alter-ego'
  | 'future-self'
  | 'bearing-loading'
  | 'reading'
  | 'code-intro'
  | 'code'
  | 'letter'
  | 'contract'
  | 'complete';

type OnboardingMascotSceneInput = {
  bearing: number;
  /** Clauses of the Contract lit so far, 0-5. Only the contract sends this. */
  ceremony?: number;
  loadingDuration?: number;
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
    case 'alter-ego':
    case 'future-self':
      return 'focused';
    case 'interstitial':
    case 'alter-ego-intro':
    case 'star-reveal':
      return 'direction';
    case 'payoff':
    case 'alter-ego-loading':
    case 'bearing-loading':
      return 'loading';
    case 'payoff-cost':
      return 'concerned';
    case 'reading':
      return 'compass';
    case 'code-intro':
    case 'code':
    case 'letter':
    case 'contract':
      return 'settled';
    case 'complete':
      return 'proud';
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
  bearing,
  ceremony = 0,
  loadingDuration,
  moment,
  phase,
  step,
  total,
}: OnboardingMascotSceneInput): MascotScene {
  const completion = total <= 1 ? 1 : (step - 1) / (total - 1);
  const interstitialTurn = moment === 'interstitial' ? (phase % 2 === 0 ? -3 : 3) : 0;
  const afterBearingReveal = [
    'bearing-loading',
    'reading',
    'code-intro',
    'code',
    'letter',
    'contract',
    'complete',
  ].includes(moment);
  const afterAlterEgoDeliberation = [
    'alter-ego-loading',
    'alter-ego-intro',
    'star-reveal',
    'alter-ego',
    'bearing-loading',
    'reading',
    'code-intro',
    'code',
    'letter',
    'contract',
    'complete',
  ].includes(moment);
  const longDuration = moment === 'alter-ego-loading' || moment === 'bearing-loading'
    ? loadingDuration
    : undefined;
  // The face winds with the contract rather than reacting to it. A quarter
  // turn per clause, opposed between the rotors, so it reads as an instrument
  // being wound and not as a spinner.
  const wound = moment === 'contract' ? ceremony * 90 : 0;

  return {
    bearing,
    completion,
    expression: expressionFor(moment),
    gesture: moment === 'welcome'
      ? { cue: 'onboarding-arrival', duration: 'arrival', kind: 'arrive' }
      : moment === 'complete'
      ? { cue: step, kind: 'acknowledge' }
      : moment === 'interstitial'
        ? { cue: step, kind: phase % 2 === 0 ? 'orient-left' : 'orient-right' }
        : undefined,
    rotations: {
      // One complete bezel turn gives the long flow a quiet physical record.
      outer: {
        angle: completion * 360
          + (afterAlterEgoDeliberation ? 360 : 0)
          + (afterBearingReveal ? 720 : 0)
          + wound,
        duration: longDuration ?? 'settle',
      },
      // Each chapter advances the cardinal instrument by one graduation.
      cardinals: {
        angle: phase * 15
          - (afterAlterEgoDeliberation ? 360 : 0)
          - (afterBearingReveal ? 720 : 0)
          - wound,
        duration: longDuration ?? (moment === 'interstitial' ? 'settle' : 'quick'),
      },
      face: {
        angle: interstitialTurn + (afterBearingReveal ? 360 : 0),
        duration: longDuration ?? 'quick',
      },
    },
    transition: {
      duration: moment === 'reading' || moment === 'complete' ? 'settle' : 'quick',
      expression: moment === 'complete' ? 'acknowledge' : 'default',
    },
  };
}

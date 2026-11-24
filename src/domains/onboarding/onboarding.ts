import { initialDirection } from '@/domains/direction/initial-direction';
import type { Axis, AxisReading, DirectionWeights } from '@/domains/direction/initial-direction';

export type Profile = {
  name: string;
  age: number;
};

export type Answer = {
  id: string;
  axis: Axis;
  /** Context-only answers are kept for recall but excluded from the Axis mean. */
  off: number | null;
  raw: unknown;
};

export type NorthStarType =
  | 'patriarch'
  | 'modern-man'
  | 'rogue'
  | 'laughing-wolf'
  | 'godfather'
  | 'kind-father'
  | 'freethinker'
  | 'playboy';

export type OnboardingDraft = {
  answers: Record<string, Answer>;
  /** The Line he picked for his first Action, from the two offered. */
  firstLine: string | null;
  /** Id of an authored option, never free text. */
  honestThing: string;
  northStar: NorthStarType | null;
  profile: Profile;
  signedAt: number | null;
  starAnswers: Partial<Record<string, string[]>>;
};

/**
 * Onboarding takes no prose. Everything a man tells North here is a choice from
 * an authored set, so it can be scored, replayed and quoted back to him without
 * a language model — and so he is never handed an empty box after eleven
 * minutes of momentum.
 */
export const AVOIDED_OPTIONS: readonly { label: string; value: string }[] = [
  { label: 'An avoided conversation', value: 'conversation' },
  { label: 'Something I keep putting off', value: 'unstarted' },
  { label: 'A habit taking too much', value: 'habit' },
  { label: 'An apology or repair I owe', value: 'apology' },
  { label: 'My body or health', value: 'body' },
  { label: 'Avoiding money matters', value: 'money' },
  { label: 'Something else', value: 'other' },
  { label: 'Not sure yet', value: 'unsure' },
];

export type QuestionId =
  | 'F1' | 'F3' | 'D5' | 'D7' | 'C9' | 'C11'
  | 'A13' | 'A16' | 'K18' | 'K20' | 'G21' | 'G24';

export type OnboardingQuestion = {
  axis: Axis;
  body?: string;
  period?: string;
  emphasis: string;
  id: QuestionId;
  kind: 'choice';
  options: readonly { label: string; off: number | null }[];
  prompt: string;
};

export const QUESTIONS: readonly OnboardingQuestion[] = [
  {
    axis: 'frame',
    emphasis: 'say so',
    id: 'F1',
    period: 'Last 30 days',
    kind: 'choice',
    options: [
      { label: 'No opportunity', off: null },
      { label: 'Never', off: 100 },
      { label: 'Rarely', off: 75 },
      { label: 'Half the time', off: 50 },
      { label: 'Usually', off: 25 },
      { label: 'Always', off: 0 },
    ],
    prompt: 'When you disagreed, how often did you say so?',
  },
  {
    axis: 'frame',
    emphasis: 'say yes',
    id: 'F3',
    period: 'Last 30 days',
    kind: 'choice',
    options: [
      { label: '0', off: 0 },
      { label: '1', off: 20 },
      { label: '2–3', off: 40 },
      { label: '4–6', off: 60 },
      { label: '7–10', off: 80 },
      { label: '11+', off: 100 },
    ],
    prompt: 'How many times did you say yes and regret it?',
  },
  {
    axis: 'desire',
    emphasis: 'start the conversation',
    id: 'D5',
    period: 'Last 30 days',
    kind: 'choice',
    options: [
      { label: 'No opportunity', off: null },
      { label: 'Never', off: 100 },
      { label: 'Rarely', off: 75 },
      { label: 'Half the time', off: 50 },
      { label: 'Usually', off: 25 },
      { label: 'Always', off: 0 },
    ],
    prompt: 'When you wanted to know someone better, how often did you start the conversation?',
  },
  {
    axis: 'desire',
    emphasis: 'before even trying',
    id: 'D7',
    period: 'Last 30 days',
    kind: 'choice',
    options: [
      { label: '0', off: 0 },
      { label: '1', off: 20 },
      { label: '2–3', off: 40 },
      { label: '4–6', off: 60 },
      { label: '7–10', off: 80 },
      { label: '11+', off: 100 },
    ],
    prompt: "How many times did you rule yourself out before even trying?",
  },
  {
    axis: 'connection',
    emphasis: 'in trouble at 2 a.m.',
    id: 'C9',
    kind: 'choice',
    options: [
      { label: '0', off: 100 },
      { label: '1', off: 75 },
      { label: '2', off: 50 },
      { label: '3–4', off: 25 },
      { label: '5+', off: 0 },
      { label: 'Not sure', off: null },
    ],
    prompt: 'If you were in trouble at 2 a.m., how many people could you call?',
  },
  {
    axis: 'connection',
    emphasis: 'personal conversations',
    id: 'C11',
    period: 'Last 7 days',
    kind: 'choice',
    options: [
      { label: '0', off: 100 },
      { label: '1', off: 80 },
      { label: '2–3', off: 60 },
      { label: '4–6', off: 40 },
      { label: '7–10', off: 20 },
      { label: '11+', off: 0 },
    ],
    prompt: 'How many personal conversations did you start with people you know?',
  },
  {
    axis: 'appetite',
    emphasis: 'use your free time as planned',
    id: 'A13',
    period: 'Last 7 days',
    kind: 'choice',
    options: [
      { label: '0', off: 100 },
      { label: '1 day', off: 80 },
      { label: '2–3 days', off: 60 },
      { label: '4–5 days', off: 40 },
      { label: '6 days', off: 20 },
      { label: 'Every day', off: 0 },
      { label: 'No plan', off: null },
    ],
    prompt: 'On how many days did you use your free time as planned?',
  },
  {
    axis: 'appetite',
    emphasis: 'a habit cause a problem',
    id: 'A16',
    body: 'For your sleep, time, work, study, or someone close to you.',
    period: 'Last 30 days',
    kind: 'choice',
    options: [
      { label: '0', off: 0 },
      { label: '1', off: 20 },
      { label: '2–3', off: 40 },
      { label: '4–6', off: 60 },
      { label: '7–10', off: 80 },
      { label: '11+', off: 100 },
    ],
    prompt: 'How many times did a habit cause a problem?',
  },
  {
    axis: 'craft',
    emphasis: 'finish something',
    id: 'K18',
    kind: 'choice',
    options: [
      { label: 'Within 7 days', off: 0 },
      { label: 'Within 30 days', off: 20 },
      { label: 'Within 3 months', off: 40 },
      { label: 'Within 1 year', off: 60 },
      { label: 'Longer ago', off: 80 },
      { label: 'Cannot remember', off: 100 },
      { label: 'Nothing like that lately', off: null },
    ],
    prompt: 'When did you last finish something nobody made you finish?',
  },
  {
    axis: 'craft',
    emphasis: 'move or care for your body',
    id: 'K20',
    period: 'Last 7 days',
    kind: 'choice',
    options: [
      { label: '0', off: 100 },
      { label: '1 day', off: 80 },
      { label: '2 days', off: 60 },
      { label: '3–4 days', off: 40 },
      { label: '5–6 days', off: 20 },
      { label: 'Every day', off: 0 },
    ],
    prompt: 'On how many days did you intentionally move or care for your body?',
  },
  {
    axis: 'agency',
    emphasis: 'a step that mattered to you',
    id: 'G21',
    period: 'Last 7 days',
    kind: 'choice',
    options: [
      { label: '0', off: 100 },
      { label: '1', off: 80 },
      { label: '2–3', off: 60 },
      { label: '4–6', off: 40 },
      { label: 'Every day', off: 20 },
      { label: '2+ times a day', off: 0 },
      { label: 'No opportunity', off: null },
    ],
    prompt: 'How often did you take a step that mattered to you without being asked?',
  },
  {
    axis: 'agency',
    emphasis: 'change what happens next',
    id: 'G24',
    kind: 'choice',
    options: [
      { label: 'Strongly disagree', off: 100 },
      { label: 'Disagree', off: 80 },
      { label: 'Somewhat disagree', off: 60 },
      { label: 'Somewhat agree', off: 40 },
      { label: 'Agree', off: 20 },
      { label: 'Strongly agree', off: 0 },
    ],
    prompt: 'Even when luck or others affect the result, I can usually change what happens next.',
  },
];

export const NORTH_STAR_OPTIONS: readonly {
  description: string;
  figures: readonly string[];
  label: string;
  value: NorthStarType;
}[] = [
  {
    description: 'Builds, commits, and protects what depends on him.',
    figures: ['Aragorn', "T'Challa", 'Marcus Aurelius'],
    label: 'The Patriarch',
    value: 'patriarch',
  },
  {
    description: 'Builds a career and an equal partnership.',
    figures: ['Peter Parker', 'Lewis Hamilton', 'Barack Obama'],
    label: 'The Modern Man',
    value: 'modern-man',
  },
  {
    description: 'Chooses risk, autonomy, and an unattached life.',
    figures: ['James Bond', 'John Wick', 'Billy Butcher'],
    label: 'The Rogue',
    value: 'rogue',
  },
  {
    description: 'Moves through ambition with charm and social ease.',
    figures: ['Tony Stark', 'Han Solo', 'Danny Ocean'],
    label: 'The Laughing Wolf',
    value: 'laughing-wolf',
  },
  {
    description: 'Has built the house and now holds the line around it.',
    figures: ['Tommy Shelby', "Brando's Vito Corleone", 'Logan Roy'],
    label: 'The Godfather',
    value: 'godfather',
  },
  {
    description: 'Protects harmony, steadiness, and the people he loves.',
    figures: ['Uncle Iroh', 'Atticus Finch', 'Bandit Heeler'],
    label: 'The Kind Father',
    value: 'kind-father',
  },
  {
    description: 'Lives by his own rules and answers for the cost.',
    figures: ['Anthony Bourdain', 'Jack Sparrow', 'Diogenes'],
    label: 'The Freethinker',
    value: 'freethinker',
  },
  {
    description: 'Puts pleasure and freedom ahead of permanence.',
    figures: ['Don Draper', 'Jordan Belfort', 'Barney Stinson'],
    label: 'The Playboy',
    value: 'playboy',
  },
];

export const INITIAL_DRAFT: OnboardingDraft = {
  answers: {},
  firstLine: null,
  honestThing: '',
  northStar: null,
  profile: { age: 20, name: '' },
  signedAt: null,
  starAnswers: {},
};

export function answerFor(
  question: OnboardingQuestion,
  raw: unknown,
  off: number | null,
): Answer {
  return {
    axis: question.axis,
    id: question.id,
    off: off === null ? null : Math.min(100, Math.max(0, off)),
    raw,
  };
}

export function scoreQuestion(question: OnboardingQuestion, raw: unknown): number | null {
  if (typeof raw !== 'number') return null;
  return question.options[raw]?.off ?? null;
}

export function getAxisReadings(answers: Record<string, Answer>): AxisReading[] {
  const axes: readonly Axis[] = ['agency', 'frame', 'desire', 'connection', 'appetite', 'craft'];

  return axes.map((axis) => {
    const values = Object.values(answers).filter(
      (answer): answer is Answer & { off: number } => answer.axis === axis && answer.off !== null,
    );
    const off = values.length === 0
      ? 0
      : values.reduce((total, answer) => total + answer.off, 0) / values.length;
    return { axis, off };
  });
}

export function getInitialDirection(
  answers: Record<string, Answer>,
  weights: DirectionWeights,
): number {
  return initialDirection(getAxisReadings(answers), weights);
}

export function northStarLabel(value: NorthStarType | null): string {
  return NORTH_STAR_OPTIONS.find((option) => option.value === value)?.label ?? '';
}

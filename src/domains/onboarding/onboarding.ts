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
  { label: 'A conversation I keep avoiding', value: 'conversation' },
  { label: 'Something I keep saying I will start', value: 'unstarted' },
  { label: 'A habit that keeps taking more than I mean to give', value: 'habit' },
  { label: 'An apology or repair I owe', value: 'apology' },
  { label: 'Taking care of my body or health', value: 'body' },
  { label: 'Money I keep avoiding', value: 'money' },
  { label: 'Something else', value: 'other' },
  { label: 'I am not sure yet', value: 'unsure' },
];

export type QuestionId =
  | 'F1' | 'F2' | 'F3' | 'F4'
  | 'D5' | 'D6' | 'D7' | 'D8'
  | 'C9' | 'C10' | 'C11' | 'C12'
  | 'A13' | 'A14' | 'A15' | 'A16'
  | 'K17' | 'K18' | 'K19' | 'K20'
  | 'G21' | 'G22' | 'G23' | 'G24';

export type OnboardingQuestion = {
  axis: Axis;
  emphasis: string;
  id: QuestionId;
  kind: 'choice';
  options: readonly { label: string; off: number | null }[];
  prompt: string;
};

export const QUESTIONS: readonly OnboardingQuestion[] = [
  {
    axis: 'frame',
    emphasis: 'tell them you disagreed',
    id: 'F1',
    kind: 'choice',
    options: [
      { label: "I didn't have a chance", off: null },
      { label: 'Never', off: 100 },
      { label: 'Rarely', off: 75 },
      { label: 'About half the time', off: 50 },
      { label: 'Most of the time', off: 25 },
      { label: 'Every time', off: 0 },
    ],
    prompt: 'In the past 30 days, when you thought someone was wrong, how often did you tell them you disagreed?',
  },
  {
    axis: 'frame',
    emphasis: 'what did you do?',
    id: 'F2',
    kind: 'choice',
    options: [
      { label: 'I said no', off: 0 },
      { label: 'I offered less than they asked for', off: 10 },
      { label: 'I asked for time to decide', off: 10 },
      { label: 'I said yes and was okay with it', off: 0 },
      { label: "I said yes and wished I hadn't", off: 100 },
      { label: 'No one has asked me lately', off: null },
    ],
    prompt: 'The last time someone asked for more than you could give, what did you do?',
  },
  {
    axis: 'frame',
    emphasis: 'say yes',
    id: 'F3',
    kind: 'choice',
    options: [
      { label: 'None', off: 0 },
      { label: 'Once', off: 20 },
      { label: '2 to 3 times', off: 40 },
      { label: '4 to 6 times', off: 60 },
      { label: '7 to 10 times', off: 80 },
      { label: '11 or more', off: 100 },
    ],
    prompt: 'In the past 30 days, how many times did you say yes and later wish you had said no?',
  },
  {
    axis: 'frame',
    emphasis: 'go along with someone else',
    id: 'F4',
    kind: 'choice',
    options: [
      { label: 'None', off: 0 },
      { label: 'Once', off: 20 },
      { label: '2 to 3 times', off: 40 },
      { label: '4 to 6 times', off: 60 },
      { label: '7 to 10 times', off: 80 },
      { label: '11 or more', off: 100 },
    ],
    prompt: 'In the past 30 days, how many times did you go along with someone else so they would not be upset with you?',
  },
  {
    axis: 'desire',
    emphasis: 'start the conversation',
    id: 'D5',
    kind: 'choice',
    options: [
      { label: "I didn't have a chance", off: null },
      { label: 'Never', off: 100 },
      { label: 'Rarely', off: 75 },
      { label: 'About half the time', off: 50 },
      { label: 'Most of the time', off: 25 },
      { label: 'Every time', off: 0 },
    ],
    prompt: 'In the past 30 days, when you wanted to know someone better, how often did you start the conversation?',
  },
  {
    axis: 'desire',
    emphasis: 'might say no',
    id: 'D6',
    kind: 'choice',
    options: [
      { label: "I didn't have a chance", off: null },
      { label: 'Never', off: 100 },
      { label: 'Rarely', off: 75 },
      { label: 'About half the time', off: 50 },
      { label: 'Most of the time', off: 25 },
      { label: 'Every time', off: 0 },
    ],
    prompt: 'In the past 30 days, how often did you ask for something they might say no to?',
  },
  {
    axis: 'desire',
    emphasis: 'before I try',
    id: 'D7',
    kind: 'choice',
    options: [
      { label: 'Strongly disagree', off: 0 },
      { label: 'Disagree', off: 20 },
      { label: 'Somewhat disagree', off: 40 },
      { label: 'Somewhat agree', off: 60 },
      { label: 'Agree', off: 80 },
      { label: 'Strongly agree', off: 100 },
    ],
    prompt: "I decide I can't do it before I try.",
  },
  {
    axis: 'desire',
    emphasis: 'afraid they would say no',
    id: 'D8',
    kind: 'choice',
    options: [
      { label: 'None', off: 0 },
      { label: 'Once', off: 25 },
      { label: '2 to 3 times', off: 50 },
      { label: '4 to 6 times', off: 75 },
      { label: '7 or more', off: 100 },
      { label: 'Nothing like that came up', off: null },
    ],
    prompt: 'In the past 30 days, how many times did being afraid they would say no stop you from doing something you still wanted to do?',
  },
  {
    axis: 'connection',
    emphasis: 'in trouble at 2 a.m.',
    id: 'C9',
    kind: 'choice',
    options: [
      { label: 'None', off: 100 },
      { label: 'One', off: 75 },
      { label: 'Two', off: 50 },
      { label: '3 to 4', off: 25 },
      { label: '5 or more', off: 0 },
      { label: 'Not sure', off: null },
    ],
    prompt: 'If you were in trouble at 2 a.m., how many people could you call?',
  },
  {
    axis: 'connection',
    emphasis: 'keep listening after your first answer',
    id: 'C10',
    kind: 'choice',
    options: [
      { label: 'None', off: 100 },
      { label: 'Once', off: 80 },
      { label: '2 to 3 times', off: 60 },
      { label: '4 to 6 times', off: 40 },
      { label: '7 to 10 times', off: 20 },
      { label: '11 or more', off: 0 },
    ],
    prompt: 'In the past 30 days, how many times did someone close to you ask how you were and keep listening after your first answer?',
  },
  {
    axis: 'connection',
    emphasis: 'personal conversations',
    id: 'C11',
    kind: 'choice',
    options: [
      { label: 'None', off: 100 },
      { label: 'One', off: 80 },
      { label: '2 to 3', off: 60 },
      { label: '4 to 6', off: 40 },
      { label: '7 to 10', off: 20 },
      { label: '11 or more', off: 0 },
    ],
    prompt: 'In the past 7 days, how many personal conversations did you start with someone you know?',
  },
  {
    axis: 'connection',
    emphasis: 'keep listening after their first answer',
    id: 'C12',
    kind: 'choice',
    options: [
      { label: 'None', off: 100 },
      { label: 'Once', off: 80 },
      { label: '2 to 3 times', off: 60 },
      { label: '4 to 6 times', off: 40 },
      { label: '7 to 10 times', off: 20 },
      { label: '11 or more', off: 0 },
    ],
    prompt: 'In the past 30 days, how many times did you ask someone how they were and keep listening after their first answer?',
  },
  {
    axis: 'appetite',
    emphasis: 'spend your free time the way you planned',
    id: 'A13',
    kind: 'choice',
    options: [
      { label: 'None', off: 100 },
      { label: 'One day', off: 80 },
      { label: '2 to 3 days', off: 60 },
      { label: '4 to 5 days', off: 40 },
      { label: '6 days', off: 20 },
      { label: 'Every day', off: 0 },
      { label: 'I did not make a plan', off: null },
    ],
    prompt: 'In the past 7 days, on how many days did you spend your free time the way you planned?',
  },
  {
    axis: 'appetite',
    emphasis: 'five more minutes',
    id: 'A14',
    kind: 'choice',
    options: [
      { label: 'Under 10 minutes', off: 0 },
      { label: '10 to 29 minutes', off: 25 },
      { label: '30 to 59 minutes', off: 50 },
      { label: '1 to 2 hours', off: 75 },
      { label: 'More than 2 hours', off: 100 },
      { label: 'This has not happened lately', off: null },
      { label: 'I do not use these apps', off: null },
    ],
    prompt: 'Think of the last time you opened TikTok, Instagram, X, YouTube, or a similar app and told yourself "five more minutes." How long did you stay?',
  },
  {
    axis: 'appetite',
    emphasis: 'took more time or energy than you meant',
    id: 'A15',
    kind: 'choice',
    options: [
      { label: 'None', off: 0 },
      { label: 'Once', off: 20 },
      { label: '2 to 3 times', off: 40 },
      { label: '4 to 6 times', off: 60 },
      { label: '7 to 10 times', off: 80 },
      { label: '11 or more', off: 100 },
    ],
    prompt: 'In the past 30 days, how many times did you handle a bad day in a way that took more time or energy than you meant?',
  },
  {
    axis: 'appetite',
    emphasis: 'a habit cause a problem',
    id: 'A16',
    kind: 'choice',
    options: [
      { label: 'None', off: 0 },
      { label: 'Once', off: 20 },
      { label: '2 to 3 times', off: 40 },
      { label: '4 to 6 times', off: 60 },
      { label: '7 to 10 times', off: 80 },
      { label: '11 or more', off: 100 },
    ],
    prompt: 'In the past 30 days, how many times did a habit cause a problem for your sleep, time, work, study, or someone close to you?',
  },
  {
    axis: 'craft',
    emphasis: 'skills did you use',
    id: 'K17',
    kind: 'choice',
    options: [
      { label: 'None', off: 100 },
      { label: 'One', off: 75 },
      { label: 'Two', off: 50 },
      { label: '3 to 4', off: 25 },
      { label: '5 or more', off: 0 },
      { label: 'Not sure', off: null },
    ],
    prompt: 'In the past year, how many skills did you use to make, fix, teach, or solve something for someone else?',
  },
  {
    axis: 'craft',
    emphasis: 'finish something',
    id: 'K18',
    kind: 'choice',
    options: [
      { label: 'In the past 7 days', off: 0 },
      { label: 'In the past 30 days', off: 20 },
      { label: 'In the past 3 months', off: 40 },
      { label: 'In the past year', off: 60 },
      { label: 'Longer ago', off: 80 },
      { label: 'I cannot remember', off: 100 },
      { label: 'I have not had something like that lately', off: null },
    ],
    prompt: 'When did you last finish something nobody made you finish?',
  },
  {
    axis: 'craft',
    emphasis: 'practice a skill',
    id: 'K19',
    kind: 'choice',
    options: [
      { label: 'None', off: 100 },
      { label: 'One day', off: 80 },
      { label: '2 days', off: 60 },
      { label: '3 to 4 days', off: 40 },
      { label: '5 to 6 days', off: 20 },
      { label: 'Every day', off: 0 },
      { label: 'I am not trying to improve a skill right now', off: null },
    ],
    prompt: 'In the past 7 days, on how many days did you practice a skill you want to improve?',
  },
  {
    axis: 'craft',
    emphasis: 'take care of your body',
    id: 'K20',
    kind: 'choice',
    options: [
      { label: 'None', off: 100 },
      { label: 'One day', off: 80 },
      { label: '2 days', off: 60 },
      { label: '3 to 4 days', off: 40 },
      { label: '5 to 6 days', off: 20 },
      { label: 'Every day', off: 0 },
      { label: 'I did not make a plan', off: null },
    ],
    prompt: 'In the past 7 days, on how many days did you exercise or take care of your body as planned?',
  },
  {
    axis: 'agency',
    emphasis: 'a step that mattered to you',
    id: 'G21',
    kind: 'choice',
    options: [
      { label: 'None', off: 100 },
      { label: 'Once', off: 80 },
      { label: '2 to 3 times', off: 60 },
      { label: '4 to 6 times', off: 40 },
      { label: 'Every day', off: 20 },
      { label: 'More than once a day', off: 0 },
      { label: 'Nothing like that came up', off: null },
    ],
    prompt: 'In the past 7 days, how many times did you take a step that mattered to you without anyone asking?',
  },
  {
    axis: 'agency',
    emphasis: 'find a first step',
    id: 'G22',
    kind: 'choice',
    options: [
      { label: 'Strongly disagree', off: 100 },
      { label: 'Disagree', off: 80 },
      { label: 'Somewhat disagree', off: 60 },
      { label: 'Somewhat agree', off: 40 },
      { label: 'Agree', off: 20 },
      { label: 'Strongly agree', off: 0 },
    ],
    prompt: 'When I do not know how to do something, I can usually find a first step.',
  },
  {
    axis: 'agency',
    emphasis: 'What did you do next?',
    id: 'G23',
    kind: 'choice',
    options: [
      { label: 'I tried another way right away', off: 0 },
      { label: 'I asked for help and kept going', off: 0 },
      { label: 'I took a break and came back', off: 15 },
      { label: 'I stopped because the plan did not make sense anymore', off: 0 },
      { label: 'I gave up even though I still wanted it', off: 100 },
      { label: 'No plan has gone wrong lately', off: null },
    ],
    prompt: 'Think of the last plan that went wrong. What did you do next?',
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
    prompt: 'Even when luck or other people shape the result, I can usually change what happens next.',
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

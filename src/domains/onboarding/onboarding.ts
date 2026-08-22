import type { Axis, AxisReading, BearingRule } from '@/domains/bearing/initial-bearing';

export type Situation = 'studying' | 'working' | 'neither';

export type Profile = {
  name: string;
  age: number;
  situation: Situation;
};

export type Answer = {
  id: string;
  axis: Axis;
  off: number;
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
  /** Optional name he gives the man he is walking toward. */
  alterEgo: string;
  answers: Record<string, Answer>;
  /** What he pictures himself doing, at three horizons. Never scored. */
  futureSelf: Partial<Record<FutureHorizon, string[]>>;
  /** Id of an authored option, never free text. */
  honestThing: string;
  northStar: NorthStarType | null;
  profile: Profile;
  roleModels: string[];
  signedAt: number | null;
  starAnswers: Partial<Record<string, 'negative' | 'positive'>>;
};

/**
 * Onboarding takes no prose. Everything a man tells North here is a choice from
 * an authored set, so it can be scored, replayed and quoted back to him without
 * a language model — and so he is never handed an empty box after eleven
 * minutes of momentum.
 */
export const AVOIDED_OPTIONS: readonly { label: string; value: string }[] = [
  { label: 'A conversation I keep not having', value: 'conversation' },
  { label: 'Something I said I would start', value: 'unstarted' },
  { label: 'A habit that is costing me', value: 'habit' },
  { label: 'An apology I owe', value: 'apology' },
  { label: 'My body', value: 'body' },
  { label: 'Money I am not looking at', value: 'money' },
];

/**
 * Which of himself he expects to grow, at three horizons. Deliberately not
 * scored, and deliberately not part of `QUESTIONS`: it asks about the same
 * three domains — intellectual, adventurous, physical — as neutral multi-select
 * with no minimum and no combination privileged. Scoring this would reward one
 * specific silhouette, a man who reads, climbs, and lifts, over a man who
 * pictures something quieter, which is the exact stereotype this question
 * exists to avoid. It exists to shape which authored actions and lessons he is
 * later shown, not to move the Bearing — `getInitialBearing` only ever reads
 * `draft.answers`, so this field cannot reach it even by accident.
 */
export type FutureHorizon = 'near' | 'mid' | 'far';

export const FUTURE_HORIZONS: readonly {
  horizon: FutureHorizon;
  kicker: string;
  title: string;
}[] = [
  {
    horizon: 'near',
    kicker: 'TWO YEARS FROM NOW',
    title: 'A free evening. What does he do with it?',
  },
  {
    horizon: 'mid',
    kicker: 'FIVE YEARS FROM NOW',
    title: 'A free weekend. What does he do with it?',
  },
  {
    horizon: 'far',
    kicker: 'TEN YEARS FROM NOW',
    title: 'Looking back, what did he actually do?',
  },
];

export const FUTURE_DOMAIN_OPTIONS: readonly { label: string; value: string }[] = [
  { label: 'Reads, listens to something, follows an idea', value: 'intellectual' },
  { label: 'Out doing something that scares him a little', value: 'adventurous' },
  { label: 'Trains. Moves his body on purpose', value: 'physical' },
  { label: 'None of this. Something else entirely', value: 'other' },
];

export type QuestionId =
  | 'F1'
  | 'F2'
  | 'F3'
  | 'F4'
  | 'F5'
  | 'F6'
  | 'D1'
  | 'D2'
  | 'D3'
  | 'D4'
  | 'D5'
  | 'C1'
  | 'C2'
  | 'C3'
  | 'C4'
  | 'C5'
  | 'A1'
  | 'A2'
  | 'A3'
  | 'A4'
  | 'A5'
  | 'A6'
  | 'K1'
  | 'K2'
  | 'K3'
  | 'K4'
  | 'K5'
  | 'G1'
  | 'G2'
  | 'G3'
  | 'G4'
  | 'G5'
  | 'G6'
  | 'G7'
  | 'G8';

type BaseQuestion = {
  axis: Axis;
  id: QuestionId;
  prompt: string;
};

export type TimeSinceQuestion = BaseQuestion & {
  kind: 'time-since';
  options: readonly { label: string; off: number }[];
};

export type TwoDoorQuestion = BaseQuestion & {
  kind: 'two-door';
  options: readonly { label: string; off: number; value: string }[];
};

export type TallyQuestion = BaseQuestion & {
  kind: 'tally';
  multiplier: number;
};

export type SpectrumQuestion = BaseQuestion & {
  kind: 'spectrum';
  left: string;
  right: string;
};

export type RecognitionQuestion = BaseQuestion & {
  kind: 'recognition';
  options: readonly { label: string; off: number }[];
};

/** Who he could actually call, chosen from a roster rather than typed. */
export type RosterQuestion = BaseQuestion & {
  exclusive: string;
  kind: 'roster';
  options: readonly { label: string; value: string }[];
};
export type StepperQuestion = BaseQuestion & { kind: 'stepper'; decrement: number };
export type DayBarQuestion = BaseQuestion & { kind: 'day-bar' };
export type MultiSelectQuestion = BaseQuestion & {
  /** Base reading before anything costly is selected. */
  base: number;
  /** Added per costly selection. */
  each: number;
  /** Values that cost nothing. */
  free: readonly string[];
  kind: 'multi-select';
  options: readonly { label: string; value: string }[];
};
export type DurationQuestion = BaseQuestion & {
  kind: 'duration';
  labels: readonly string[];
  mode: 'duration' | 'gap';
};
export type RankQuestion = BaseQuestion & { kind: 'rank' };

export type OnboardingQuestion =
  | TimeSinceQuestion
  | TwoDoorQuestion
  | TallyQuestion
  | SpectrumQuestion
  | RecognitionQuestion
  | RosterQuestion
  | StepperQuestion
  | DayBarQuestion
  | MultiSelectQuestion
  | DurationQuestion
  | RankQuestion;

export const QUESTIONS: readonly OnboardingQuestion[] = [
  {
    axis: 'frame',
    id: 'F1',
    kind: 'time-since',
    prompt: "When did you last say what you actually thought to someone who wouldn't like it?",
    options: [
      { label: 'Today', off: 0 },
      { label: 'This week', off: 20 },
      { label: 'This month', off: 45 },
      { label: 'Months ago', off: 75 },
      { label: "I can't remember", off: 100 },
    ],
  },
  {
    axis: 'frame',
    id: 'F2',
    kind: 'two-door',
    prompt: 'Someone says something you think is wrong. What actually happens?',
    options: [
      { label: 'I say it', off: 10, value: 'say-it' },
      { label: 'I let it go', off: 90, value: 'let-it-go' },
    ],
  },
  {
    axis: 'frame',
    id: 'F3',
    kind: 'tally',
    multiplier: 12,
    prompt: "Last month, how many times did you agree to something you didn't want to do?",
  },
  {
    axis: 'frame',
    id: 'F4',
    kind: 'spectrum',
    left: 'Being liked',
    prompt: 'Which do you actually optimise for?',
    right: 'Being respected',
  },
  {
    axis: 'frame',
    id: 'F5',
    kind: 'recognition',
    options: [
      { label: 'One person I hoped would see it', off: 90 },
      { label: 'People I went to school with', off: 75 },
      { label: 'Whoever happened to be watching', off: 55 },
      { label: 'Nobody. I put it up and left', off: 20 },
      { label: 'I do not post', off: 10 },
    ],
    prompt: 'The last thing you posted. Who was it actually for?',
  },
  {
    axis: 'frame',
    id: 'F6',
    kind: 'time-since',
    options: [
      { label: 'Today', off: 90 },
      { label: 'This week', off: 70 },
      { label: 'This month', off: 45 },
      { label: 'I cannot think of one', off: 15 },
    ],
    prompt: 'When did something small last make you angrier than it deserved?',
  },
  {
    axis: 'desire',
    id: 'D1',
    kind: 'time-since',
    prompt: "When did you last walk up to a woman you didn't know and start a conversation?",
    options: [
      { label: 'This week', off: 0 },
      { label: 'This month', off: 25 },
      { label: 'This year', off: 55 },
      { label: 'Years ago', off: 80 },
      { label: 'Never', off: 100 },
    ],
  },
  {
    axis: 'desire',
    id: 'D2',
    kind: 'tally',
    multiplier: 10,
    prompt: "Last month, how many times did you want to say something to someone and didn't?",
  },
  {
    axis: 'desire',
    id: 'D3',
    kind: 'spectrum',
    left: 'Not really my place',
    prompt: "Do you think you're allowed to want what you want?",
    right: 'Yes, without apology',
  },
  {
    axis: 'desire',
    id: 'D4',
    kind: 'recognition',
    prompt: "And what do you tell yourself about why you didn't?",
    options: [
      { label: "She's probably taken", off: 40 },
      { label: "I'd be bothering her", off: 55 },
      { label: "It wasn't the right moment", off: 60 },
      { label: "I don't look like that", off: 85 },
      { label: "I wasn't really trying", off: 90 },
      { label: "I don't do that sort of thing", off: 75 },
    ],
  },
  {
    axis: 'desire',
    id: 'D5',
    kind: 'tally',
    multiplier: 25,
    prompt: 'How many women are you close to, and have never told how you feel?',
  },
  {
    axis: 'connection',
    exclusive: 'nobody',
    id: 'C1',
    kind: 'roster',
    options: [
      { label: 'A close friend', value: 'friend' },
      { label: 'My brother or sister', value: 'sibling' },
      { label: 'A parent', value: 'parent' },
      { label: 'My partner', value: 'partner' },
      { label: 'Someone I work with', value: 'colleague' },
      { label: 'Honestly, nobody', value: 'nobody' },
    ],
    prompt: 'Who could you call at 2am and it would be fine?',
  },
  {
    axis: 'connection',
    id: 'C2',
    kind: 'time-since',
    prompt: 'When did a friend last ask how you were and wait for the real answer?',
    options: [
      { label: 'This week', off: 0 },
      { label: 'This month', off: 30 },
      { label: 'Months ago', off: 60 },
      { label: "I can't remember", off: 85 },
      { label: 'Nobody does that', off: 100 },
    ],
  },
  {
    axis: 'connection',
    decrement: 14,
    id: 'C3',
    kind: 'stepper',
    prompt: 'In the last week, how many conversations did you start?',
  },
  {
    axis: 'connection',
    id: 'C4',
    kind: 'two-door',
    prompt: 'Something good happens. Who do you tell first?',
    options: [
      { label: 'Someone specific', off: 15, value: 'someone' },
      { label: 'Nobody, really', off: 95, value: 'nobody' },
    ],
  },
  {
    axis: 'connection',
    decrement: 20,
    id: 'C5',
    kind: 'stepper',
    prompt: 'If you went quiet for a week, how many people would notice?',
  },
  {
    axis: 'appetite',
    id: 'A1',
    kind: 'day-bar',
    prompt: "Yesterday. How many hours went to watching other people live?",
  },
  {
    axis: 'appetite',
    base: 20,
    each: 20,
    free: ['gym', 'nothing'],
    id: 'A2',
    kind: 'multi-select',
    options: [
      { label: 'Your phone', value: 'phone' },
      { label: 'Porn', value: 'porn' },
      { label: 'Weed', value: 'weed' },
      { label: 'Food', value: 'food' },
      { label: 'Drink', value: 'drink' },
      { label: 'Games', value: 'games' },
      { label: 'The gym', value: 'gym' },
      { label: 'Nothing', value: 'nothing' },
    ],
    prompt: 'What do you reach for when the day goes badly?',
  },
  {
    axis: 'appetite',
    id: 'A3',
    kind: 'duration',
    labels: ['An hour', 'A day', 'Three days', 'A week', 'Longer'],
    mode: 'duration',
    prompt: "Whatever you reach for most — how long could you go without it before you'd notice?",
  },
  {
    axis: 'appetite',
    id: 'A4',
    kind: 'duration',
    labels: ['5 min', '1 hr', '2 hrs', '3 hrs', '5 hrs'],
    mode: 'gap',
    prompt: 'You told yourself five more minutes. How long was it actually?',
  },
  {
    axis: 'appetite',
    base: 10,
    each: 30,
    free: ['none'],
    id: 'A5',
    kind: 'multi-select',
    options: [
      { label: 'A dating app boost or subscription', value: 'dating' },
      { label: 'OnlyFans or similar', value: 'onlyfans' },
      { label: 'A creator I will never meet', value: 'creator' },
      { label: 'None of these', value: 'none' },
    ],
    prompt: 'Last month, which of these did you pay for?',
  },
  {
    axis: 'appetite',
    id: 'A6',
    kind: 'time-since',
    options: [
      { label: 'Today', off: 100 },
      { label: 'This week', off: 80 },
      { label: 'This month', off: 55 },
      { label: 'Longer than that', off: 25 },
      { label: 'I do not bet', off: 0 },
    ],
    prompt: 'When did you last put money on a game?',
  },
  {
    axis: 'craft',
    decrement: 25,
    id: 'K1',
    kind: 'stepper',
    prompt: 'How many things can you do well enough that someone would pay for them?',
  },
  {
    axis: 'craft',
    id: 'K2',
    kind: 'time-since',
    prompt: 'When did you last finish something nobody made you finish?',
    options: [
      { label: 'This week', off: 0 },
      { label: 'This month', off: 25 },
      { label: 'This year', off: 55 },
      { label: 'Longer', off: 80 },
      { label: "I don't finish things", off: 100 },
    ],
  },
  {
    axis: 'craft',
    id: 'K3',
    kind: 'spectrum',
    left: 'No',
    prompt: 'The body you have now. Is that the body of someone who keeps his word to himself?',
    right: 'Yes',
  },
  {
    axis: 'craft',
    id: 'K4',
    kind: 'rank',
    prompt: "Put these in the order you actually spend time on them. Not the order you'd like.",
  },
  {
    axis: 'craft',
    id: 'K5',
    kind: 'recognition',
    options: [
      { label: 'Who I was a year ago', off: 5 },
      { label: 'People I actually know', off: 45 },
      { label: 'People I went to school with', off: 70 },
      { label: 'Strangers online who are winning', off: 95 },
      { label: 'I try not to', off: 35 },
    ],
    prompt: 'Whose life do you measure yours against?',
  },
  {
    axis: 'agency',
    id: 'G1',
    kind: 'time-since',
    options: [
      { label: 'Today', off: 0 },
      { label: 'This week', off: 25 },
      { label: 'This month', off: 55 },
      { label: 'Longer than that', off: 80 },
      { label: 'I am not sure I ever have', off: 100 },
    ],
    prompt: 'When did you last do something because you decided to, not because it was expected?',
  },
  {
    axis: 'agency',
    id: 'G2',
    kind: 'recognition',
    options: [
      { label: 'Luck is most of it', off: 95 },
      { label: 'Luck, and then what you make of it', off: 55 },
      { label: 'It mostly comes down to what I do', off: 10 },
    ],
    prompt: 'Do you think you are a lucky person?',
  },
  {
    axis: 'agency',
    id: 'G3',
    kind: 'two-door',
    options: [
      { label: 'You have it or you do not', off: 85, value: 'innate' },
      { label: 'It is earned, one thing at a time', off: 10, value: 'earned' },
    ],
    prompt: 'Confidence.',
  },
  {
    axis: 'agency',
    id: 'G4',
    kind: 'time-since',
    options: [
      { label: 'This week', off: 0 },
      { label: 'This month', off: 30 },
      { label: 'This year', off: 60 },
      { label: 'Years ago', off: 85 },
      { label: 'I avoid that', off: 100 },
    ],
    prompt: 'The last real risk you took, where it could have gone badly.',
  },
  {
    axis: 'agency',
    id: 'G5',
    kind: 'two-door',
    options: [
      { label: 'Happy', off: 70, value: 'happy' },
      { label: 'Satisfied', off: 20, value: 'satisfied' },
    ],
    prompt: 'Would you rather be happy or satisfied?',
  },
  {
    axis: 'agency',
    base: 0,
    each: 0,
    free: [],
    id: 'G6',
    kind: 'multi-select',
    options: [
      { label: 'Building something of his own', value: 'building' },
      { label: 'Steady work he does not hate', value: 'steady' },
      { label: 'It does not matter, he is free', value: 'free' },
      { label: 'I cannot picture it', value: 'blank' },
    ],
    prompt: 'Picture him in five years. His days.',
  },
  {
    axis: 'agency',
    base: 0,
    each: 0,
    free: [],
    id: 'G7',
    kind: 'multi-select',
    options: [
      { label: 'One person he would take a bullet for', value: 'one' },
      { label: 'A few he would die for', value: 'few' },
      { label: 'A room that lights up when he walks in', value: 'room' },
      { label: 'I cannot picture it', value: 'blank' },
    ],
    prompt: 'Picture him in five years. His people.',
  },
  {
    axis: 'agency',
    base: 0,
    each: 0,
    free: [],
    id: 'G8',
    kind: 'multi-select',
    options: [
      { label: 'Stronger than mine', value: 'stronger' },
      { label: 'About the same', value: 'same' },
      { label: 'I do not think about it', value: 'unthought' },
      { label: 'I cannot picture it', value: 'blank' },
    ],
    prompt: 'Picture him in five years. His body.',
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
  alterEgo: '',
  answers: {},
  futureSelf: {},
  honestThing: '',
  northStar: null,
  profile: { age: 20, name: '', situation: 'working' },
  roleModels: [],
  signedAt: null,
  starAnswers: {},
};

export function answerFor(
  question: OnboardingQuestion,
  raw: unknown,
  off: number,
): Answer {
  return {
    axis: question.axis,
    id: question.id,
    off: Math.min(100, Math.max(0, off)),
    raw,
  };
}

export function scoreQuestion(question: OnboardingQuestion, raw: unknown): number {
  switch (question.kind) {
    case 'time-since':
      return question.options[raw as number].off;
    case 'two-door': {
      const value = (raw as { choice: string | null }).choice;
      return question.options.find((option) => option.value === value)?.off ?? 0;
    }
    case 'tally':
      return Math.min((raw as number) * question.multiplier, 100);
    case 'spectrum':
      return 100 - (raw as number);
    case 'recognition':
      return question.options[raw as number].off;
    case 'roster': {
      const picked = raw as string[];
      if (picked.includes(question.exclusive)) return 100;
      return Math.max(100 - picked.length * 20, 0);
    }
    case 'stepper':
      return Math.max(100 - (raw as number) * question.decrement, 0);
    case 'day-bar':
      return Math.min(((raw as number) / 8) * 100, 100);
    case 'multi-select': {
      const picked = raw as string[];
      // Future-self questions are scored on continuity: a man who cannot see
      // himself in five years is the furthest off, whichever future he would
      // otherwise have chosen. Hershfield's construct, not a preference.
      if (question.each === 0) {
        return picked.includes('blank') || picked.length === 0 ? 100 : 15;
      }
      const costly = picked.filter((item) => !question.free.includes(item));
      return Math.min(question.base + costly.length * question.each, 100);
    }
    case 'duration': {
      const value = raw as number;
      return question.mode === 'duration'
        ? [100, 75, 50, 25, 0][value]
        : Math.min(((value - 5) / 175) * 100, 100);
    }
    case 'rank': {
      const items = raw as string[];
      const position = items.indexOf(SCREEN_ITEM);
      // A missing item would otherwise score 125 and quietly corrupt the axis.
      if (position === -1) return 0;
      return (items.length - 1 - position) * 25;
    }
  }
}

export function getAxisReadings(answers: Record<string, Answer>): AxisReading[] {
  const axes: readonly Axis[] = ['frame', 'desire', 'connection', 'appetite', 'craft'];

  return axes.map((axis) => {
    const values = Object.values(answers).filter((answer) => answer.axis === axis);
    const off = values.length === 0
      ? 0
      : values.reduce((total, answer) => total + answer.off, 0) / values.length;
    return { axis, off };
  });
}

export function getInitialBearing(
  answers: Record<string, Answer>,
  rule: BearingRule,
): number {
  return rule(getAxisReadings(answers));
}

// Scoring finds this row by identity, so it must not be retyped anywhere.
export const SCREEN_ITEM = 'Your screen';

export function craftRankItems(situation: Situation): string[] {
  const workLabel = situation === 'studying'
    ? 'Your studies'
    : situation === 'working'
      ? 'Your work'
      : 'What you are building';
  return ['Your body', workLabel, 'Your skills', 'Your friends', SCREEN_ITEM];
}

export function northStarLabel(value: NorthStarType | null): string {
  return NORTH_STAR_OPTIONS.find((option) => option.value === value)?.label ?? '';
}

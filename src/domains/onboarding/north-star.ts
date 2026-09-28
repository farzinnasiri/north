import type { Axis, DirectionWeights } from '@/domains/direction/initial-direction';
import type { NorthStarType } from '@/domains/onboarding/onboarding';

/**
 * North Star answers describe priorities, not health or personality. Each
 * answer adds weight to ordinary life priorities; the resulting profile only
 * orders the eight authored candidates. The person still makes the choice.
 */
export type StarPriority =
  | 'building'
  | 'closeness'
  | 'freedom'
  | 'mastery'
  | 'steadiness'
  | 'enjoyment'
  | 'service'
  | 'candor';

export type PriorityWeights = Record<StarPriority, number>;

export type StarOption = {
  label: string;
  value: string;
  weights: Partial<PriorityWeights>;
};

export type StarQuestion = {
  body?: string;
  emphasis: string;
  id: string;
  max: number;
  min: number;
  options: readonly StarOption[];
  prompt: string;
};

const weights = (values: Partial<PriorityWeights> = {}): Partial<PriorityWeights> => values;

export const STAR_QUESTIONS: readonly StarQuestion[] = [
  {
    body: 'Pick two.',
    emphasis: 'which two would matter most to you',
    id: 'year-matters',
    max: 2,
    min: 2,
    prompt: 'At the end of a good year, which two would matter most to you?',
    options: [
      { label: 'I built or improved something that matters', value: 'build', weights: weights({ building: 2 }) },
      { label: 'My closest relationships became stronger', value: 'relationships', weights: weights({ closeness: 2 }) },
      { label: 'I had more freedom over my time', value: 'freedom', weights: weights({ freedom: 2 }) },
      { label: 'I became more skilled and capable', value: 'skill', weights: weights({ mastery: 2 }) },
      { label: 'I made life steadier for myself or other people', value: 'steadiness', weights: weights({ steadiness: 2 }) },
      { label: 'I enjoyed more of my ordinary days', value: 'enjoyment', weights: weights({ enjoyment: 2 }) },
      { label: 'I helped people or a community I care about', value: 'help', weights: weights({ service: 2 }) },
    ],
  },
  {
    body: 'A: Protect more of my time, even if I build less.\n\nB: Build more, even if it takes more of my time.',
    emphasis: 'which way would you go',
    id: 'building-time',
    max: 1,
    min: 1,
    prompt: 'If you had to give something up, which way would you go?',
    options: [
      { label: 'Protect my time, much more', value: 'time-strong', weights: weights({ freedom: 2, enjoyment: 1 }) },
      { label: 'Protect my time, a little more', value: 'time-somewhat', weights: weights({ freedom: 1 }) },
      { label: 'They matter about the same', value: 'equal', weights: weights() },
      { label: 'Build, a little more', value: 'build-somewhat', weights: weights({ building: 1 }) },
      { label: 'Build, much more', value: 'build-strong', weights: weights({ building: 2, mastery: 1 }) },
    ],
  },
  {
    body: 'A: A close life with another person, even if I have less freedom.\n\nB: More freedom, even if I share my life less.',
    emphasis: 'more room in your life',
    id: 'commitment-freedom',
    max: 1,
    min: 1,
    prompt: 'Where do you want more room in your life?',
    options: [
      { label: 'A close life, much more', value: 'commit-strong', weights: weights({ closeness: 2, steadiness: 1 }) },
      { label: 'A close life, a little more', value: 'commit-somewhat', weights: weights({ closeness: 1 }) },
      { label: 'They matter about the same', value: 'equal', weights: weights() },
      { label: 'Freedom, a little more', value: 'freedom-somewhat', weights: weights({ freedom: 1 }) },
      { label: 'Freedom, much more', value: 'freedom-strong', weights: weights({ freedom: 2, enjoyment: 1 }) },
    ],
  },
  {
    body: 'A: Say what matters, even if the other person may not like it.\n\nB: Keep the peace, even if I do not say what matters.',
    emphasis: 'which way would you go',
    id: 'friction-unsaid',
    max: 1,
    min: 1,
    prompt: 'If you had to give something up, which way would you go?',
    options: [
      { label: 'Say what matters, much more', value: 'plain-strong', weights: weights({ candor: 2, freedom: 1 }) },
      { label: 'Say what matters, a little more', value: 'plain-somewhat', weights: weights({ candor: 1 }) },
      { label: 'They matter about the same', value: 'equal', weights: weights() },
      { label: 'Keep the peace, a little more', value: 'peace-somewhat', weights: weights({ closeness: 1 }) },
      { label: 'Keep the peace, much more', value: 'peace-strong', weights: weights({ closeness: 2, steadiness: 1 }) },
    ],
  },
  {
    emphasis: 'ordinary day',
    id: 'ordinary-day',
    max: 2,
    min: 1,
    prompt: '{name}, it is five years from now. You are {age}. Which ordinary day feels closest to the life you want?',
    options: [
      { label: 'I lead or build something, and I own how it turns out', value: 'lead-build', weights: weights({ building: 2, candor: 1 }) },
      { label: 'I do skilled work with people I respect', value: 'skilled-team', weights: weights({ closeness: 1, mastery: 2 }) },
      { label: 'I work on my own and control more of my time', value: 'independent', weights: weights({ freedom: 2, mastery: 1 }) },
      { label: 'I care for people, a home, or a community', value: 'care', weights: weights({ service: 2, steadiness: 1 }) },
      { label: 'I move between projects, places, or new experiences', value: 'projects-places', weights: weights({ enjoyment: 1, freedom: 2 }) },
      { label: 'I have steady work and plenty of life outside it', value: 'steady-life', weights: weights({ enjoyment: 1, steadiness: 2 }) },
      { label: 'Something else fits me better', value: 'other', weights: weights() },
      { label: 'I cannot see it clearly yet', value: 'unclear', weights: weights() },
    ],
  },
];

export type StarChoices = {
  answers: Partial<Record<string, readonly string[]>>;
};

const EMPTY_PRIORITIES: PriorityWeights = {
  building: 0,
  candor: 0,
  closeness: 0,
  enjoyment: 0,
  freedom: 0,
  mastery: 0,
  service: 0,
  steadiness: 0,
};

export function priorityTotals(choices: StarChoices): PriorityWeights {
  const totals = { ...EMPTY_PRIORITIES };

  for (const question of STAR_QUESTIONS) {
    for (const value of choices.answers[question.id] ?? []) {
      const option = question.options.find((candidate) => candidate.value === value);
      if (!option) continue;
      for (const [priority, weight] of Object.entries(option.weights)) {
        totals[priority as StarPriority] += weight ?? 0;
      }
    }
  }

  return totals;
}

type CandidateProfile = {
  direction: Partial<Record<Axis, number>>;
  priorities: Partial<PriorityWeights>;
  type: NorthStarType;
};

/** Distinct authored destination profiles, not diagnoses or personality types. */
const CANDIDATES: readonly CandidateProfile[] = [
  { type: 'patriarch', priorities: { building: 3, mastery: 1, candor: 1 }, direction: { craft: 2, agency: 1.5, frame: 1.25 } },
  { type: 'modern-man', priorities: { closeness: 3, steadiness: 1, service: 1 }, direction: { connection: 2, frame: 1.5, agency: 1.25 } },
  { type: 'rogue', priorities: { freedom: 3, mastery: 1, candor: 1 }, direction: { agency: 2, craft: 1.5, frame: 1.25 } },
  { type: 'laughing-wolf', priorities: { closeness: 2, enjoyment: 2, service: 1 }, direction: { connection: 2, desire: 1.25, frame: 1.25 } },
  { type: 'godfather', priorities: { service: 3, steadiness: 2 }, direction: { connection: 1.5, agency: 1.5, frame: 1.25 } },
  { type: 'kind-father', priorities: { steadiness: 3, enjoyment: 1, closeness: 1 }, direction: { agency: 1.75, connection: 1.5, appetite: 1.25 } },
  { type: 'freethinker', priorities: { mastery: 3, building: 2 }, direction: { craft: 2, agency: 1.5, desire: 1.25 } },
  { type: 'playboy', priorities: { freedom: 2, enjoyment: 2, mastery: 1 }, direction: { desire: 1.75, agency: 1.75, craft: 1.25 } },
];

function candidateScore(totals: PriorityWeights, profile: CandidateProfile): number {
  return Object.entries(profile.priorities).reduce(
    (score, [priority, weight]) => score + totals[priority as StarPriority] * (weight ?? 0),
    0,
  );
}

export function rankNorthStars(choices: StarChoices, count = 8): NorthStarType[] {
  const totals = priorityTotals(choices);

  return CANDIDATES.map((profile, authoredOrder) => ({
    authoredOrder,
    score: candidateScore(totals, profile),
    type: profile.type,
  }))
    .sort((a, b) => b.score - a.score || a.authoredOrder - b.authoredOrder)
    .slice(0, count)
    .map((entry) => entry.type);
}

export function deriveNorthStar(choices: StarChoices): NorthStarType {
  return rankNorthStars(choices, 1)[0] ?? 'modern-man';
}

/** Every Axis remains live; the chosen destination only changes emphasis. */
export function directionWeightsForNorthStar(type: NorthStarType): DirectionWeights {
  const profile = CANDIDATES.find((candidate) => candidate.type === type);
  const baseline: DirectionWeights = {
    agency: 1,
    appetite: 1,
    connection: 1,
    craft: 1,
    desire: 1,
    frame: 1,
  };

  return { ...baseline, ...profile?.direction };
}

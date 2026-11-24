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
  context?: string;
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
    emphasis: 'which two matter most',
    id: 'year-matters',
    max: 2,
    min: 2,
    prompt: 'After a good year, which two matter most?',
    options: [
      { label: 'Built something meaningful', value: 'build', weights: weights({ building: 2 }) },
      { label: 'Stronger close relationships', value: 'relationships', weights: weights({ closeness: 2 }) },
      { label: 'More control of my time', value: 'freedom', weights: weights({ freedom: 2 }) },
      { label: 'Greater skill and capability', value: 'skill', weights: weights({ mastery: 2 }) },
      { label: 'More stability for me or others', value: 'steadiness', weights: weights({ steadiness: 2 }) },
      { label: 'More everyday enjoyment', value: 'enjoyment', weights: weights({ enjoyment: 2 }) },
      { label: 'Helped people or my community', value: 'help', weights: weights({ service: 2 }) },
    ],
  },
  {
    emphasis: 'ordinary day',
    id: 'ordinary-day',
    max: 2,
    min: 1,
    context: 'In 5 years · Age {age}',
    prompt: 'Which ordinary day would you want?',
    options: [
      { label: 'Building something I answer for', value: 'lead-build', weights: weights({ building: 2, candor: 1 }) },
      { label: 'Skilled work with respected people', value: 'skilled-team', weights: weights({ closeness: 1, mastery: 2 }) },
      { label: 'Independent work, my own schedule', value: 'independent', weights: weights({ freedom: 2, mastery: 1 }) },
      { label: 'Caring for people, home, or community', value: 'care', weights: weights({ service: 2, steadiness: 1 }) },
      { label: 'New projects, places, and experiences', value: 'projects-places', weights: weights({ enjoyment: 1, freedom: 2 }) },
      { label: 'Steady work, time for life', value: 'steady-life', weights: weights({ enjoyment: 1, steadiness: 2 }) },
      { label: 'Something else', value: 'other', weights: weights() },
      { label: 'Not clear yet', value: 'unclear', weights: weights() },
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

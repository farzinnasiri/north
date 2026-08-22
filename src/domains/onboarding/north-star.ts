import type { NorthStarType } from '@/domains/onboarding/onboarding';

/**
 * The North Star is suggested from concrete answers, then chosen from all eight.
 *
 * Titles alone flatter, so the app asks small, concrete questions before it
 * orders the destinations. The ranking is evidence for a suggestion, never a
 * diagnosis or a reason to hide the alternatives.
 *
 * Three independent axes, each a binary, give the eight types:
 *   power         ambitious (+) or satisfied (-)
 *   relationships committed (+) or unattached (-)
 *   boundaries    disagreeable (+) or agreeable (-)
 */
export type StarAxis = 'boundaries' | 'power' | 'relationships';

export type AxisWeights = Record<StarAxis, number>;

export type RoleModel = {
  id: string;
  known: string;
  name: string;
  weights: AxisWeights;
};

/** Three picks at ±1 each, so role models inform but never outvote intent. */
export const ROLE_MODELS: readonly RoleModel[] = [
  { id: 'batman', known: '', name: 'Batman', weights: { boundaries: 1, power: 1, relationships: -1 } },
  { id: 'peter-parker', known: '', name: 'Spider-Man', weights: { boundaries: -1, power: 1, relationships: 1 } },
  { id: 'superman', known: '', name: 'Superman', weights: { boundaries: 1, power: 1, relationships: 1 } },
  { id: 'miles-morales', known: '', name: 'Miles Morales', weights: { boundaries: -1, power: 1, relationships: 1 } },
  { id: 'obama', known: '', name: 'Obama', weights: { boundaries: -1, power: 1, relationships: 1 } },
  { id: 'stark', known: '', name: 'Tony Stark', weights: { boundaries: -1, power: 1, relationships: -1 } },
  { id: 'lebron', known: '', name: 'LeBron James', weights: { boundaries: 1, power: 1, relationships: 1 } },
  { id: 'mrbeast', known: '', name: 'MrBeast', weights: { boundaries: -1, power: 1, relationships: 1 } },
  { id: 'shelby', known: '', name: 'Tommy Shelby', weights: { boundaries: 1, power: 1, relationships: 1 } },
  { id: 'kratos', known: '', name: 'Kratos', weights: { boundaries: 1, power: -1, relationships: 1 } },
  { id: 'iroh', known: '', name: 'Uncle Iroh', weights: { boundaries: -1, power: -1, relationships: 1 } },
  { id: 'bourdain', known: '', name: 'Bourdain', weights: { boundaries: 1, power: -1, relationships: -1 } },
  { id: 'wick', known: '', name: 'John Wick', weights: { boundaries: 1, power: 1, relationships: -1 } },
  { id: 'belfort', known: '', name: 'Jordan Belfort', weights: { boundaries: -1, power: -1, relationships: -1 } },
  { id: 'zuko', known: '', name: 'Zuko', weights: { boundaries: 1, power: 1, relationships: 1 } },
  { id: 'luffy', known: '', name: 'Luffy', weights: { boundaries: 1, power: 1, relationships: -1 } },
];

export const ROLE_MODEL_PICKS = 3;

export type StarQuestion = {
  axis: StarAxis;
  id: string;
  /** Answer that pushes the axis positive. */
  positive: string;
  /** Answer that pushes the axis negative. */
  negative: string;
  prompt: string;
};

/** Intent is weighted 2 against each role model's 1. */
export const STAR_WEIGHT = 2;

/**
 * Two questions per crisis rather than one. Each pair is written straight from
 * the poles — the Ambitious man's value is what he builds, the Satisfied man's
 * is that he is already enough; the Committed man is responsible for another
 * person, the Bad Boy is not; the Disagreeable man sets the terms, the
 * Agreeable man keeps the peace. Asking twice from different angles resolves a
 * man who answers the first one aspirationally.
 */
export const STAR_QUESTIONS: readonly StarQuestion[] = [
  {
    axis: 'power',
    id: 'power-regret',
    negative: 'Having built it and missed the years',
    positive: 'Not having built anything',
    prompt: 'Ten years from now, which would bother you more?',
  },
  {
    axis: 'power',
    id: 'power-worth',
    negative: 'I am enough as I am',
    positive: 'I am what I build',
    prompt: 'Closer to the truth',
  },
  {
    axis: 'relationships',
    id: 'relationships-role',
    negative: 'Someone who never ties me down',
    positive: 'Someone I am responsible to',
    prompt: 'The person you end up with is',
  },
  {
    axis: 'relationships',
    id: 'relationships-hard',
    negative: 'I go quiet and let it end',
    positive: 'I stay and deal with it',
    prompt: 'When it gets difficult',
  },
  {
    axis: 'boundaries',
    id: 'boundaries-terms',
    negative: 'I would rather keep the peace',
    positive: 'I say what I will and will not do',
    prompt: 'When people want something from you',
  },
  {
    axis: 'boundaries',
    id: 'boundaries-cost',
    negative: 'It keeps me up',
    positive: 'It is the cost',
    prompt: 'Being disliked for a decision you believe in',
  },
];

const TYPE_BY_POLES: Record<string, NorthStarType> = {
  '---': 'playboy',
  '--+': 'freethinker',
  '-+-': 'kind-father',
  '-++': 'godfather',
  '+--': 'laughing-wolf',
  '+-+': 'rogue',
  '++-': 'modern-man',
  '+++': 'patriarch',
};

export type StarChoices = {
  roleModels: readonly string[];
  /** Keyed by question id, since each axis is now asked twice. */
  answers: Partial<Record<string, 'negative' | 'positive'>>;
};

export function axisTotals(choices: StarChoices): AxisWeights {
  const totals: AxisWeights = { boundaries: 0, power: 0, relationships: 0 };

  for (const id of choices.roleModels) {
    const model = ROLE_MODELS.find((candidate) => candidate.id === id);
    if (!model) continue;
    totals.power += model.weights.power;
    totals.relationships += model.weights.relationships;
    totals.boundaries += model.weights.boundaries;
  }

  for (const question of STAR_QUESTIONS) {
    const answer = choices.answers[question.id];
    if (!answer) continue;
    totals[question.axis] += answer === 'positive' ? STAR_WEIGHT : -STAR_WEIGHT;
  }

  return totals;
}

/**
 * Three role models at ±1 sum to an odd number, and the intent answers add an
 * even amount, so no axis can land on zero and the destination is never
 * ambiguous.
 */
const POLES: readonly { key: string; type: NorthStarType }[] = Object.entries(TYPE_BY_POLES).map(
  ([key, type]) => ({ key, type }),
);

/**
 * Ranked destinations rather than a single verdict. The best-fitting type is
 * rarely the only plausible one — a man whose boundaries reading is nearly even
 * belongs almost as much to the neighbouring type — and handing him one answer
 * asks him to accept a label he had no part in. All eight stay available; their
 * order carries the suggestion without hiding alternatives.
 */
export function rankNorthStars(choices: StarChoices, count = 8): NorthStarType[] {
  const totals = axisTotals(choices);

  return POLES.map(({ key, type }) => {
    const sign = (index: number) => (key[index] === '+' ? 1 : -1);
    const agreement =
      sign(0) * totals.power + sign(1) * totals.relationships + sign(2) * totals.boundaries;
    return { agreement, type };
  })
    .sort((a, b) => b.agreement - a.agreement)
    .slice(0, count)
    .map((entry) => entry.type);
}

export function deriveNorthStar(choices: StarChoices): NorthStarType {
  const totals = axisTotals(choices);
  const key =
    (totals.power >= 0 ? '+' : '-') +
    (totals.relationships >= 0 ? '+' : '-') +
    (totals.boundaries >= 0 ? '+' : '-');
  return TYPE_BY_POLES[key] ?? 'modern-man';
}

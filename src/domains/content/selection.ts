import type { AuthoredAction } from '@/domains/content/catalogue';
import { CATALOGUE } from '@/domains/content/catalogue';
import type { Axis, AxisReading } from '@/domains/direction/initial-direction';
import type { NorthStarType } from '@/domains/onboarding/onboarding';
import { directionWeightsForNorthStar } from '@/domains/onboarding/north-star';

/**
 * Fixed order for ties. Two Axes reading identically must resolve the same way
 * on every device and every run, so the tie-break is a list rather than
 * whatever order the readings arrived in.
 */
const AXIS_ORDER: readonly Axis[] = [
  'frame',
  'desire',
  'connection',
  'appetite',
  'craft',
  'agency',
];

type SelectionInput = {
  /** Authored ids already closed, in the order they were closed. */
  closed: readonly string[];
  /** The unscored issue the person said is costing him most right now. */
  honestThing?: string;
  northStar?: NorthStarType | null;
  /** Authored ids passed over with a Swap. */
  passed: readonly string[];
  readings: readonly AxisReading[];
};

const HONEST_THING_ACTION: Readonly<Partial<Record<string, string>>> = {
  apology: 'connection-true-answer',
  body: 'craft-body',
  conversation: 'frame-say-it',
  habit: 'appetite-put-it-down',
  money: 'agency-choose',
  unstarted: 'craft-finish',
};

export function axisForHonestThing(value: string): Axis | null {
  const action = CATALOGUE.find((candidate) => candidate.id === HONEST_THING_ACTION[value]);
  return action?.axis ?? null;
}

/**
 * The state machine, not a shuffle. It walks his Axes worst-first and offers
 * the first Action in that Axis he has not already seen, so the proposal
 * follows the picture onboarding drew rather than chance. Same inputs, same
 * Action — which is what makes it debuggable and testable.
 *
 * Once everything has been seen the corpus repeats, oldest first. That is a
 * property of a small authored set, not a design goal.
 */
export function nextAction({
  closed,
  honestThing = '',
  northStar = null,
  passed,
  readings,
}: SelectionInput): AuthoredAction {
  const seen = new Set([...closed, ...passed]);
  const reflectedAction = seen.size === 0
    ? CATALOGUE.find((action) => action.id === HONEST_THING_ACTION[honestThing])
    : undefined;
  if (reflectedAction) return reflectedAction;

  const weights = northStar ? directionWeightsForNorthStar(northStar) : null;
  const worstFirst = [...AXIS_ORDER].sort((left, right) => {
    const rightGap = offFor(readings, right) * (weights?.[right] ?? 1);
    const leftGap = offFor(readings, left) * (weights?.[left] ?? 1);
    const difference = rightGap - leftGap;
    return difference !== 0 ? difference : AXIS_ORDER.indexOf(left) - AXIS_ORDER.indexOf(right);
  });
  for (const axis of worstFirst) {
    const unseen = CATALOGUE.find((action) => action.axis === axis && !seen.has(action.id));
    if (unseen) return unseen;
  }

  const oldestFirst = CATALOGUE.filter((action) => closed.includes(action.id)).sort(
    (left, right) => closed.indexOf(left.id) - closed.indexOf(right.id),
  );
  return oldestFirst[0] ?? CATALOGUE[0];
}

function offFor(readings: readonly AxisReading[], axis: Axis): number {
  return readings.find((reading) => reading.axis === axis)?.off ?? 0;
}

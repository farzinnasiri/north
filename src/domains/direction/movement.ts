import { DAY_MS, MAX_DEADLINE_DAYS, MIN_DEADLINE_DAYS } from '@/domains/actions/action';

/** Closing an Action committed to a one-day Deadline. */
export const BASE_DEGREES = 1;
/** Charged per day of Deadline length beyond the first. */
export const DURATION_COST_PER_DAY = 0.05;
export const HOLD_NORTH_DAYS = 30;
/** Close enough that the Exit is worth naming on the home screen. */
export const NEAR_NORTH_DEGREES = 5;

/**
 * Degrees earned by closing an Action, decided entirely by the Deadline he
 * committed to.
 *
 * There is no early-finish bonus, and this is the reason: if a seven-day
 * Deadline closed on day one paid more than an honest one-day commitment, the
 * optimal strategy would be to sandbag every estimate, which is the exact
 * opposite of the character being built. The spec leaves the accuracy bonus
 * open; until it is settled, closing early earns what the estimate was worth.
 *
 * Note for whoever settles it: the spec states both "a one-day Deadline earns
 * 1.0" and "a seven-day Action earns 0.65", which no single linear rule
 * satisfies at −0.05 per day. This implements the two stated rules — base 1.0,
 * −0.05 per additional day — so a seven-day Action earns 0.70.
 */
export function degreesForClose(deadlineDays: number): number {
  const days = Math.min(MAX_DEADLINE_DAYS, Math.max(MIN_DEADLINE_DAYS, deadlineDays));
  const earned = BASE_DEGREES - DURATION_COST_PER_DAY * (days - 1);
  return Math.round(Math.max(0, earned) * 100) / 100;
}

/** The Direction after a kept Deadline. It never passes north. */
export function directionAfterClose(direction: number, deadlineDays: number): number {
  const moved = direction - degreesForClose(deadlineDays);
  return Math.round(Math.max(0, moved) * 100) / 100;
}

/**
 * A missed Deadline. Stated as a function rather than left implicit because
 * "nothing happens" is a product decision people keep trying to reverse.
 */
export function directionAfterMiss(direction: number): number {
  return direction;
}

export function daysHeldAtNorth(reachedNorthAt: number, now: number): number {
  return Math.max(0, Math.floor((now - reachedNorthAt) / DAY_MS));
}

export function hasExited(reachedNorthAt: number, now: number): boolean {
  return daysHeldAtNorth(reachedNorthAt, now) >= HOLD_NORTH_DAYS;
}

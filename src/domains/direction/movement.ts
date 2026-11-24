import type { Outcome } from '@/domains/actions/action';
import { DAY_MS, MAX_DAYS, MIN_DAYS } from '@/domains/actions/action';

/** Doing an Action given one day. */
export const BASE_DEGREES = 1;
/** Charged per day beyond the first. */
export const DURATION_COST_PER_DAY = 0.05;
export const HOLD_NORTH_DAYS = 30;
/** Close enough that the Exit is worth naming on the home screen. */
export const NEAR_NORTH_DEGREES = 5;

/**
 * Degrees a done Action is worth, decided by the days he gave himself. A
 * shorter promise kept is worth more, and there is no bonus for finishing
 * early, so padding the estimate never pays.
 */
export function degreesForClose(days: number): number {
  const clamped = Math.min(MAX_DAYS, Math.max(MIN_DAYS, days));
  const earned = BASE_DEGREES - DURATION_COST_PER_DAY * (clamped - 1);
  return Math.round(Math.max(0, earned) * 100) / 100;
}

/**
 * What a check-in earns. "Partly" earns half: enough to be worth saying
 * honestly, not enough to make it the easy answer. A miss earns nothing and
 * takes nothing away.
 */
export function earnedFor(outcome: Outcome, days: number): number {
  if (outcome === 'done') return degreesForClose(days);
  if (outcome === 'partly') return Math.round((degreesForClose(days) / 2) * 100) / 100;
  return 0;
}

/** The Direction after a check-in. It never passes north and never moves back. */
export function directionAfter(direction: number, earned: number): number {
  return Math.round(Math.max(0, direction - earned) * 100) / 100;
}

export function daysHeldAtNorth(reachedNorthAt: number, now: number): number {
  return Math.max(0, Math.floor((now - reachedNorthAt) / DAY_MS));
}

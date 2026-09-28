import type { Axis } from '@/domains/direction/initial-direction';

export const DAY_MS = 24 * 60 * 60 * 1000;
export const MIN_DEADLINE_DAYS = 1;
export const MAX_DEADLINE_DAYS = 7;

/**
 * The single Action in progress. There is no daily reset and no queue: an Open
 * Action stays open until it is closed or let go, and only one exists at a time.
 */
export type OpenAction = {
  /** The authored Action this came from. */
  actionId: string;
  axis: Axis;
  deadlineDays: number;
  /** His own interpretation. Never proof, never scored. */
  named: string;
  note: string | null;
  openedAt: number;
};

export type ClosedAction = OpenAction & {
  closedAt: number;
  /** Degrees the Direction moved. A missed Deadline moves it by zero. */
  earned: number;
  kept: boolean;
};

export function deadlineAt(action: OpenAction): number {
  return action.openedAt + action.deadlineDays * DAY_MS;
}

export function isOverdue(action: OpenAction, now: number): boolean {
  return now > deadlineAt(action);
}

/**
 * Whole days past the Deadline. The overdue copy quotes this number back to
 * him as a fact, so it rounds down and never flatters.
 */
export function daysOverdue(action: OpenAction, now: number): number {
  return Math.max(0, Math.floor((now - deadlineAt(action)) / DAY_MS));
}

/**
 * A mono readout of the distance to the Deadline, in the direction it is
 * running. Hours are dropped once there is more than a day of either, because
 * a man with four days left does not need to know about the hours.
 */
export function deadlineReadout(action: OpenAction, now: number): string {
  const distance = Math.abs(deadlineAt(action) - now);
  const days = Math.floor(distance / DAY_MS);
  const hours = Math.floor((distance % DAY_MS) / (60 * 60 * 1000));

  if (days >= 2) return `${days}d`;
  if (days >= 1) return `${days}d ${hours}h`;
  if (hours >= 1) return `${hours}h`;
  return '<1h';
}

export function clampDeadline(days: number): number {
  return Math.min(MAX_DEADLINE_DAYS, Math.max(MIN_DEADLINE_DAYS, Math.round(days)));
}

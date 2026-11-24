import type { Axis } from '@/domains/direction/initial-direction';

export const DAY_MS = 24 * 60 * 60 * 1000;
export const MIN_DAYS = 1;
export const MAX_DAYS = 7;
/** 21:00, in minutes after local midnight. */
export const DEFAULT_CHECK_IN_MINUTES = 21 * 60;

/**
 * How it went, in his own words. The honour system in three answers: nothing
 * checks it, and "in between" exists so an honest partial is never rounded up
 * to a lie or down to a failure.
 */
export type Outcome = 'done' | 'partly' | 'missed';

/**
 * The one Action in progress. There is no queue and no daily reset: it stays
 * open until he checks in, and only one exists at a time.
 */
export type OpenAction = {
  /** The text he committed to. Starts as the Line's action; he may reword it. */
  action: string;
  axis: Axis;
  /** When North asks how it went. */
  checkInAt: number;
  /** The days he gave himself, 1 for today. */
  days: number;
  instanceId: string;
  /** The published Line it came from, kept so the Log can show the source. */
  lineId: string;
  note: string | null;
  openedAt: number;
};

export type ClosedAction = OpenAction & {
  closedAt: number;
  /** Degrees the Direction moved. A miss moves it by zero. */
  earned: number;
  outcome: Outcome;
};

export function clampDays(days: number): number {
  return Math.min(MAX_DAYS, Math.max(MIN_DAYS, Math.round(days)));
}

/**
 * The check-in falls at his chosen time on the last of his days. If that
 * moment has already passed (he took today's Action at 22:00 with a 21:00
 * check-in), it moves to the same time tomorrow rather than firing at once.
 */
export function checkInTime(openedAt: number, days: number, minutes: number): number {
  const at = new Date(openedAt);
  at.setHours(0, 0, 0, 0);
  at.setDate(at.getDate() + clampDays(days) - 1);
  at.setMinutes(minutes);
  if (at.getTime() <= openedAt) at.setDate(at.getDate() + 1);
  return at.getTime();
}

export function isDue(action: OpenAction, now: number): boolean {
  return now >= action.checkInAt;
}

/** Local calendar day number. Suggestions rotate on it. */
export function localDay(now: number): number {
  const date = new Date(now);
  return Math.floor((now - date.getTimezoneOffset() * 60 * 1000) / DAY_MS);
}

/** "Today", "Tomorrow" or the weekday of the check-in. */
export function dayLabel(at: number, now: number): string {
  const difference = localDay(at) - localDay(now);
  if (difference <= 0) return 'Today';
  if (difference === 1) return 'Tomorrow';
  return new Date(at).toLocaleDateString('en-GB', { weekday: 'long' });
}

export function clockLabel(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  return `${String(hours).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
}

export function outcomeLabel(outcome: Outcome): string {
  if (outcome === 'done') return 'DONE';
  if (outcome === 'partly') return 'PARTLY';
  return 'MISSED';
}

import type { ClosedAction, OpenAction, Outcome } from '@/domains/actions/action';
import { DEFAULT_CHECK_IN_MINUTES, checkInTime, clampDays, isDue, localDay } from '@/domains/actions/action';
import type { Line } from '@/domains/content/catalogue';
import type { AxisReading } from '@/domains/direction/initial-direction';
import {
  HOLD_NORTH_DAYS,
  NEAR_NORTH_DEGREES,
  daysHeldAtNorth,
  directionAfter,
  earnedFor,
} from '@/domains/direction/movement';
import type { NorthStarType } from '@/domains/onboarding/onboarding';
import type { SignalId } from '@/domains/personalization/signal';

export type Preferences = {
  /** Minutes after local midnight for the check-in. */
  checkInMinutes: number;
  /** Whether North may send the one check-in notification. */
  checkIns: boolean;
  haptics: boolean;
  signal: SignalId;
  sound: boolean;
};

/**
 * Everything North knows about one man. It lives on his phone and nowhere
 * else: there is no account and no server copy.
 */
export type Journey = {
  closed: ClosedAction[];
  committedAt: number;
  direction: number;
  honestThing: string;
  name: string;
  northStar: NorthStarType | null;
  open: OpenAction | null;
  /** Line ids he passed over with "Show two others". */
  passed: string[];
  /** Local day he last asked for two others. Once a day. */
  passedOnDay: number | null;
  preferences: Preferences;
  readings: AxisReading[];
  /** When the Direction first reached north, which starts Hold North. */
  reachedNorthAt: number | null;
  startingDirection: number;
};

type BeginInput = {
  at: number;
  direction: number;
  honestThing: string;
  name: string;
  northStar: NorthStarType | null;
  readings: AxisReading[];
};

export function beginJourney({ at, direction, honestThing, name, northStar, readings }: BeginInput): Journey {
  return {
    closed: [],
    committedAt: at,
    direction,
    honestThing,
    name,
    northStar,
    open: null,
    passed: [],
    passedOnDay: null,
    preferences: {
      checkInMinutes: DEFAULT_CHECK_IN_MINUTES,
      checkIns: false,
      haptics: true,
      signal: 'signal',
      sound: true,
    },
    readings,
    reachedNorthAt: direction === 0 ? at : null,
    startingDirection: direction,
  };
}

type OpenInput = {
  action: string;
  at: number;
  days: number;
  instanceId: string;
  line: Line;
};

/** Taking an Action. Refused while another is open: one at a time is the product. */
export function openAction(journey: Journey, { action, at, days, instanceId, line }: OpenInput): Journey {
  if (journey.open) return journey;
  const text = action.trim() === '' ? line.takeaway : action.trim();
  return {
    ...journey,
    open: {
      action: text,
      axis: line.axis,
      checkInAt: checkInTime(at, days, journey.preferences.checkInMinutes),
      days: clampDays(days),
      instanceId,
      lineId: line.id,
      note: null,
      openedAt: at,
    },
  };
}

export function attachNote(journey: Journey, note: string): Journey {
  if (!journey.open) return journey;
  const trimmed = note.trim();
  return { ...journey, open: { ...journey.open, note: trimmed === '' ? null : trimmed } };
}

type CheckInInput = {
  at: number;
  note?: string | null;
  outcome: Outcome;
};

/**
 * The check-in. What he says is what is recorded: there is no proof to give
 * and no late penalty, because the question is asked at the time he chose.
 */
export function checkIn(journey: Journey, { at, note, outcome }: CheckInInput): Journey {
  const open = journey.open;
  if (!open) return journey;
  const earned = earnedFor(outcome, open.days);
  const direction = directionAfter(journey.direction, earned);
  return {
    ...journey,
    closed: [
      ...journey.closed,
      { ...open, closedAt: at, earned, note: note === undefined ? open.note : note, outcome },
    ],
    direction,
    open: null,
    reachedNorthAt: journey.reachedNorthAt ?? (direction === 0 ? at : null),
  };
}

export function canPass(journey: Journey, now: number): boolean {
  return journey.open === null && journey.passedOnDay !== localDay(now);
}

/** "Show two others": both of today's suggestions are set aside, once a day. */
export function passSuggestions(journey: Journey, ids: readonly string[], now: number): Journey {
  if (!canPass(journey, now)) return journey;
  return {
    ...journey,
    passed: [...journey.passed, ...ids.filter((id) => !journey.passed.includes(id))],
    passedOnDay: localDay(now),
  };
}

/** Lines that should not be suggested again soon. */
export function seenLines(journey: Journey): string[] {
  return [...journey.closed.map((action) => action.lineId), ...journey.passed];
}

export function setPreferences(journey: Journey, change: Partial<Preferences>): Journey {
  const preferences = { ...journey.preferences, ...change };
  const open = journey.open && change.checkInMinutes !== undefined
    ? { ...journey.open, checkInAt: checkInTime(journey.open.openedAt, journey.open.days, preferences.checkInMinutes) }
    : journey.open;
  return { ...journey, open, preferences };
}

export function setJourneyName(journey: Journey, name: string): Journey {
  const trimmed = name.trim();
  return trimmed.length > 0 ? { ...journey, name: trimmed } : journey;
}

export type ActionState =
  | { kind: 'choosing' }
  | { kind: 'running'; action: OpenAction }
  | { kind: 'due'; action: OpenAction };

/**
 * What the Today screen is answering. The Action and the Direction are read
 * separately on purpose: a man can be one day from the Exit with an Action
 * still running.
 */
export function actionState(journey: Journey, now: number): ActionState {
  if (!journey.open) return { kind: 'choosing' };
  return isDue(journey.open, now)
    ? { action: journey.open, kind: 'due' }
    : { action: journey.open, kind: 'running' };
}

export type NorthState =
  | { kind: 'travelling' }
  | { kind: 'near' }
  | { kind: 'holding'; daysHeld: number; daysLeft: number }
  | { kind: 'exit' };

export function northState(journey: Journey, now: number): NorthState {
  if (journey.reachedNorthAt !== null) {
    const daysHeld = daysHeldAtNorth(journey.reachedNorthAt, now);
    if (daysHeld >= HOLD_NORTH_DAYS) return { kind: 'exit' };
    return { daysHeld, daysLeft: HOLD_NORTH_DAYS - daysHeld, kind: 'holding' };
  }
  return journey.direction <= NEAR_NORTH_DEGREES ? { kind: 'near' } : { kind: 'travelling' };
}

export function doneCount(journey: Journey): number {
  return journey.closed.filter((action) => action.outcome === 'done').length;
}

/** Degrees closed since onboarding. The one number that is genuinely earned. */
export function degreesTravelled(journey: Journey): number {
  return Math.round((journey.startingDirection - journey.direction) * 100) / 100;
}

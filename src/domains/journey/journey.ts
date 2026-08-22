import type { ClosedAction, OpenAction } from '@/domains/actions/action';
import { daysOverdue, isOverdue } from '@/domains/actions/action';
import { swapsLeft } from '@/domains/actions/swaps';
import type { AxisReading } from '@/domains/bearing/initial-bearing';
import {
  HOLD_NORTH_DAYS,
  NEAR_NORTH_DEGREES,
  bearingAfterClose,
  bearingAfterMiss,
  daysHeldAtNorth,
  degreesForClose,
} from '@/domains/bearing/movement';
import type { NorthStarType } from '@/domains/onboarding/onboarding';

export type Preferences = {
  haptics: boolean;
  sound: boolean;
};

/**
 * Everything North knows about a person after the Contract is committed. It is
 * one record because the product is one continuous line from the first Open
 * Action to the Exit, and splitting it would only invite two of them to
 * disagree about where he stands.
 */
export type Journey = {
  alterEgo: string;
  bearing: number;
  closed: ClosedAction[];
  committedAt: number;
  honestThing: string;
  name: string;
  northStar: NorthStarType | null;
  open: OpenAction | null;
  /** Authored ids passed over with a Swap. */
  passed: string[];
  preferences: Preferences;
  readings: AxisReading[];
  /** When the Bearing first reached north, which starts Hold North. */
  reachedNorthAt: number | null;
  startingBearing: number;
  swapsUsedAt: number[];
};

type BeginInput = {
  alterEgo: string;
  at: number;
  bearing: number;
  honestThing: string;
  name: string;
  northStar: NorthStarType | null;
  readings: AxisReading[];
};

export function beginJourney({
  alterEgo,
  at,
  bearing,
  honestThing,
  name,
  northStar,
  readings,
}: BeginInput): Journey {
  return {
    alterEgo,
    bearing,
    closed: [],
    committedAt: at,
    honestThing,
    name,
    northStar,
    open: null,
    passed: [],
    preferences: { haptics: true, sound: true },
    readings,
    reachedNorthAt: bearing === 0 ? at : null,
    startingBearing: bearing,
    swapsUsedAt: [],
  };
}

export function openAction(journey: Journey, action: OpenAction): Journey {
  return { ...journey, open: action };
}

export function attachNote(journey: Journey, note: string): Journey {
  if (!journey.open) return journey;
  return { ...journey, open: { ...journey.open, note } };
}

type CloseInput = {
  at: number;
  /** The honour system in one flag. Nothing verifies it and nothing may. */
  kept: boolean;
  note?: string | null;
};

/**
 * Closing the Open Action. A kept Deadline moves the needle by what the
 * Deadline was worth; a missed one moves it by nothing at all. Neither takes
 * anything away, which is why both paths run through here rather than through
 * two screens that could drift apart.
 */
export function closeAction(journey: Journey, { at, kept, note }: CloseInput): Journey {
  const open = journey.open;
  if (!open) return journey;

  const earned = kept ? degreesForClose(open.deadlineDays) : 0;
  const bearing = kept
    ? bearingAfterClose(journey.bearing, open.deadlineDays)
    : bearingAfterMiss(journey.bearing);

  return {
    ...journey,
    bearing,
    closed: [
      ...journey.closed,
      {
        ...open,
        closedAt: at,
        earned,
        kept,
        note: note === undefined ? open.note : note,
      },
    ],
    open: null,
    reachedNorthAt:
      journey.reachedNorthAt ?? (bearing === 0 ? at : null),
  };
}

/** Letting an Action go. It is recorded, it is not punished. */
export function letGo(journey: Journey, at: number): Journey {
  return closeAction(journey, { at, kept: false });
}

export function spendSwap(journey: Journey, actionId: string, at: number): Journey {
  if (swapsLeft(journey.swapsUsedAt, at) === 0) return journey;
  return {
    ...journey,
    passed: journey.passed.includes(actionId)
      ? journey.passed
      : [...journey.passed, actionId],
    swapsUsedAt: [...journey.swapsUsedAt, at],
  };
}

export function setPreferences(journey: Journey, preferences: Preferences): Journey {
  return { ...journey, preferences };
}

export type ActionState =
  | { kind: 'idle'; lastClosedAt: number | null }
  | { kind: 'running'; action: OpenAction }
  | { kind: 'overdue'; action: OpenAction; days: number };

/**
 * What the home screen is answering. The Action and the Bearing are read
 * separately on purpose: a man can be one day from the Exit and still have an
 * Action running, and collapsing the two into a single enum is how a screen
 * ends up lying about one of them.
 */
export function actionState(journey: Journey, now: number): ActionState {
  if (!journey.open) {
    const last = journey.closed.at(-1);
    return { kind: 'idle', lastClosedAt: last ? last.closedAt : null };
  }
  if (isOverdue(journey.open, now)) {
    return { kind: 'overdue', action: journey.open, days: daysOverdue(journey.open, now) };
  }
  return { kind: 'running', action: journey.open };
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
  return journey.bearing <= NEAR_NORTH_DEGREES ? { kind: 'near' } : { kind: 'travelling' };
}

export function keptCount(journey: Journey): number {
  return journey.closed.filter((action) => action.kept).length;
}

/** Degrees closed since onboarding. The one number that is genuinely earned. */
export function degreesTravelled(journey: Journey): number {
  return Math.round((journey.startingBearing - journey.bearing) * 100) / 100;
}

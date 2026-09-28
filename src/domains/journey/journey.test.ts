import { DAY_MS } from '@/domains/actions/action';
import type { AxisReading } from '@/domains/direction/initial-direction';
import type { Journey } from '@/domains/journey/journey';
import {
  actionState,
  attachNote,
  beginJourney,
  closeAction,
  degreesTravelled,
  keptCount,
  letGo,
  northState,
  openAction,
  spendSwap,
} from '@/domains/journey/journey';

const AT = Date.UTC(2026, 2, 1, 9, 0);

const readings: AxisReading[] = [{ axis: 'frame', off: 60 }];

function start(direction = 47): Journey {
  return beginJourney({
    at: AT,
    direction,
    honestThing: 'conversation',
    name: 'Farzin',
    northStar: 'patriarch',
    readings,
  });
}

function withOpen(journey: Journey, deadlineDays = 3): Journey {
  return openAction(journey, {
    actionId: 'frame-say-it',
    axis: 'frame',
    deadlineDays,
    named: 'Speak up in Thursday’s meeting.',
    note: null,
    openedAt: AT,
  });
}

describe('the action loop', () => {
  it('has nothing open until an action is named and opened', () => {
    expect(actionState(start(), AT).kind).toBe('idle');
    expect(actionState(withOpen(start()), AT).kind).toBe('running');
  });

  it('reports an action past its deadline as overdue with the days quoted', () => {
    const state = actionState(withOpen(start()), AT + 11 * DAY_MS);

    expect(state.kind).toBe('overdue');
    expect(state.kind === 'overdue' && state.days).toBe(8);
  });

  it('moves the direction only when he says he kept his word', () => {
    const kept = closeAction(withOpen(start()), { at: AT + DAY_MS, kept: true });
    const missed = closeAction(withOpen(start()), { at: AT + DAY_MS, kept: false });

    expect(kept.direction).toBe(46.1);
    expect(missed.direction).toBe(47);
  });

  it('records a let-go action without moving the direction backwards', () => {
    const journey = letGo(withOpen(start()), AT + 20 * DAY_MS);

    expect(journey.direction).toBe(47);
    expect(journey.open).toBeNull();
    expect(keptCount(journey)).toBe(0);
    expect(journey.closed).toHaveLength(1);
  });

  it('keeps the note he wrote against the action he closed', () => {
    const journey = closeAction(attachNote(withOpen(start()), 'Said it. Room went quiet.'), {
      at: AT + DAY_MS,
      kept: true,
    });

    expect(journey.closed[0].note).toBe('Said it. Room went quiet.');
  });

  it('counts what he has kept and how far he has actually come', () => {
    const first = closeAction(withOpen(start(), 1), { at: AT + DAY_MS, kept: true });
    const second = closeAction(withOpen(first, 1), { at: AT + 2 * DAY_MS, kept: false });

    expect(keptCount(second)).toBe(1);
    expect(degreesTravelled(second)).toBe(1);
  });

  it('spends a swap on an action he passes over, and stops at three a month', () => {
    let journey = spendSwap(start(), 'frame-say-it', AT);
    journey = spendSwap(journey, 'frame-disagree', AT);
    journey = spendSwap(journey, 'desire-speak-first', AT);
    journey = spendSwap(journey, 'desire-name-want', AT);

    expect(journey.passed).toStrictEqual(['frame-say-it', 'frame-disagree', 'desire-speak-first']);
  });
});

describe('reaching north', () => {
  it('starts hold north the day the direction reaches zero', () => {
    const journey = closeAction(withOpen(start(0.5), 1), { at: AT, kept: true });

    expect(journey.direction).toBe(0);
    expect(northState(journey, AT)).toStrictEqual({ daysHeld: 0, daysLeft: 30, kind: 'holding' });
  });

  it('names the exit in sight before he arrives, without starting the count', () => {
    expect(northState(start(4), AT).kind).toBe('near');
    expect(northState(start(47), AT).kind).toBe('travelling');
  });

  it('exits after thirty days held', () => {
    const journey = closeAction(withOpen(start(0.5), 1), { at: AT, kept: true });

    expect(northState(journey, AT + 29 * DAY_MS).kind).toBe('holding');
    expect(northState(journey, AT + 30 * DAY_MS).kind).toBe('exit');
  });
});

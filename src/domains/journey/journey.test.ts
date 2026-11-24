import type { Line } from '@/domains/content/catalogue';
import type { Journey } from '@/domains/journey/journey';
import {
  actionState,
  beginJourney,
  canPass,
  checkIn,
  degreesTravelled,
  northState,
  openAction,
  passSuggestions,
  seenLines,
  setPreferences,
} from '@/domains/journey/journey';

const AT = new Date(2026, 2, 2, 9, 0).getTime();
const HOUR = 60 * 60 * 1000;

const LINE: Line = {
  action: 'Say the thing you have been holding back, in one sentence.',
  axis: 'frame',
  id: 'test-001',
  kind: 'quote',
  person: 'Test Person',
  said: 'Say it plainly.',
  source: 'A talk',
  takeaway: 'Say it today.',
  themes: ['conversation'],
  url: null,
};

function start(direction = 47): Journey {
  return beginJourney({
    at: AT,
    direction,
    honestThing: 'conversation',
    name: 'Farzin',
    northStar: 'patriarch',
    readings: [{ axis: 'frame', off: 60 }],
  });
}

function withOpen(journey = start(), days = 1): Journey {
  return openAction(journey, { action: '', at: AT, days, instanceId: 'one', line: LINE });
}

describe('one action at a time', () => {
  it('opens with the line’s takeaway when he does not reword it', () => {
    expect(withOpen().open?.action).toBe(LINE.takeaway);
  });

  it('refuses a second action while one is open', () => {
    const open = withOpen();
    const second = openAction(open, { action: 'Another', at: AT, days: 1, instanceId: 'two', line: LINE });

    expect(second.open?.instanceId).toBe('one');
  });

  it('asks for the check-in only once its time has come', () => {
    const open = withOpen();

    expect(actionState(open, AT + HOUR).kind).toBe('running');
    expect(actionState(open, AT + 12 * HOUR).kind).toBe('due');
  });
});

describe('the check-in', () => {
  it('moves the needle by what he says happened', () => {
    expect(checkIn(withOpen(), { at: AT, outcome: 'done' }).direction).toBe(46);
    expect(checkIn(withOpen(), { at: AT, outcome: 'partly' }).direction).toBe(46.5);
    expect(checkIn(withOpen(), { at: AT, outcome: 'missed' }).direction).toBe(47);
  });

  it('closes the action and frees the day for the next one', () => {
    const after = checkIn(withOpen(), { at: AT, outcome: 'missed' });

    expect(after.open).toBeNull();
    expect(after.closed.map((action) => action.outcome)).toStrictEqual(['missed']);
    expect(actionState(after, AT).kind).toBe('choosing');
  });

  it('starts Hold North the moment the needle reaches north', () => {
    const after = checkIn(withOpen(start(1)), { at: AT, outcome: 'done' });

    expect(after.reachedNorthAt).toBe(AT);
    expect(northState(after, AT).kind).toBe('holding');
    expect(degreesTravelled(after)).toBe(1);
  });

  it('moves an open check-in when he changes the check-in time', () => {
    const later = setPreferences(withOpen(), { checkInMinutes: 22 * 60 });

    expect(new Date(later.open!.checkInAt).getHours()).toBe(22);
  });
});

describe('showing two others', () => {
  it('sets both suggestions aside, once a day', () => {
    const passed = passSuggestions(start(), ['a', 'b'], AT);

    expect(seenLines(passed)).toStrictEqual(['a', 'b']);
    expect(canPass(passed, AT + HOUR)).toBe(false);
    expect(canPass(passed, AT + 24 * HOUR)).toBe(true);
  });
});

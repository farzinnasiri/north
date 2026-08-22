import { homeMascotScene } from '@/domains/journey/mascot-scene';

const idle = { kind: 'idle', lastClosedAt: null } as const;
const travelling = { kind: 'travelling' } as const;

describe('the mascot at home', () => {
  it('registers an overdue deadline with concern rather than disappointment', () => {
    const scene = homeMascotScene({
      acknowledge: null,
      action: { action: { actionId: 'a', axis: 'frame', deadlineDays: 3, named: 'x', note: null, openedAt: 0 }, days: 8, kind: 'overdue' },
      bearing: 47,
      north: travelling,
      startingBearing: 120,
    });

    expect(scene.expression).toBe('concerned');
    expect(scene.gesture).toBeUndefined();
  });

  it('does not move when the home screen is simply opened', () => {
    const scene = homeMascotScene({
      acknowledge: null,
      action: idle,
      bearing: 47,
      north: travelling,
      startingBearing: 120,
    });

    expect(scene.gesture).toBeUndefined();
  });

  it('acknowledges a closeout once, and replays only for the next one', () => {
    const first = homeMascotScene({ acknowledge: 100, action: idle, bearing: 46, north: travelling, startingBearing: 120 });
    const same = homeMascotScene({ acknowledge: 100, action: idle, bearing: 46, north: travelling, startingBearing: 120 });
    const next = homeMascotScene({ acknowledge: 200, action: idle, bearing: 45, north: travelling, startingBearing: 120 });

    expect(first.gesture?.kind).toBe('acknowledge');
    expect(same.gesture?.cue).toBe(first.gesture?.cue);
    expect(next.gesture?.cue).toBe(200);
  });

  it('is proud only once the exit is reached', () => {
    const holding = homeMascotScene({ acknowledge: null, action: idle, bearing: 0, north: { daysHeld: 4, daysLeft: 26, kind: 'holding' }, startingBearing: 120 });
    const exited = homeMascotScene({ acknowledge: null, action: idle, bearing: 0, north: { kind: 'exit' }, startingBearing: 120 });

    expect(holding.expression).toBe('direction');
    expect(exited.expression).toBe('proud');
  });

  it('inscribes the share of the journey he has actually closed', () => {
    const scene = homeMascotScene({ acknowledge: null, action: idle, bearing: 30, north: travelling, startingBearing: 120 });

    expect(scene.completion).toBe(0.75);
  });
});

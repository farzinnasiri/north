import { onboardingMascotScene } from '@/domains/onboarding/mascot-scene';

describe('onboarding mascot', () => {
  it('records the flow and adds one finite turn for North Star curation', () => {
    const first = onboardingMascotScene({ direction: 180, moment: 'welcome', phase: 0, step: 1, total: 50 });
    const last = onboardingMascotScene({ direction: 47, moment: 'letter', phase: 8, step: 50, total: 50 });

    expect(first.rotations?.outer?.angle).toBe(0);
    expect(last.rotations?.outer?.angle).toBe(720);
    expect(last.completion).toBe(1);
  });

  it('arrives once on the hello without inventing a Direction reveal', () => {
    const hello = onboardingMascotScene({ direction: 180, moment: 'welcome', phase: 0, step: 1, total: 52 });

    expect(hello.gesture?.kind).toBe('arrive');
  });

  it('uses one brief deterministic turn after the final preference answer', () => {
    const loading = onboardingMascotScene({ direction: 86, moment: 'north-star-curation', phase: 2, step: 42, total: 49 });

    expect(loading.expression).toBe('loading');
    expect(loading.rotations?.outer?.duration).toBe('arrival');
    expect(loading.rotations?.outer?.angle).toBeGreaterThan(360);
  });

  it('registers a weighty payoff without judging the answer that produced it', () => {
    const scene = onboardingMascotScene({ direction: 121, moment: 'payoff-cost', phase: 5, step: 29, total: 50 });

    expect(scene.expression).toBe('concerned');
    expect(scene.gesture).toBeUndefined();
  });

  it('settles for the final letter without adding a celebration', () => {
    const scene = onboardingMascotScene({ direction: 47, moment: 'letter', phase: 8, step: 50, total: 50 });

    expect(scene.expression).toBe('settled');
    expect(scene.transition?.expression).toBe('default');
    expect(scene.gesture).toBeUndefined();
  });
});

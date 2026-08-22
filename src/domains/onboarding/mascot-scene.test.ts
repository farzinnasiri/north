import { onboardingMascotScene } from '@/domains/onboarding/mascot-scene';

describe('onboarding mascot', () => {
  it('records the flow and adds two finite turns for the bearing reveal', () => {
    const first = onboardingMascotScene({ bearing: 180, moment: 'welcome', phase: 0, step: 1, total: 50 });
    const last = onboardingMascotScene({ bearing: 47, moment: 'complete', phase: 8, step: 50, total: 50 });

    expect(first.rotations?.outer?.angle).toBe(0);
    expect(last.rotations?.outer?.angle).toBe(1440);
    expect(last.completion).toBe(1);
  });

  it('arrives once on the hello and uses the sampled duration for the reveal', () => {
    const hello = onboardingMascotScene({ bearing: 180, moment: 'welcome', phase: 0, step: 1, total: 52 });
    const loading = onboardingMascotScene({ bearing: 86, loadingDuration: 7300, moment: 'bearing-loading', phase: 8, step: 47, total: 52 });

    expect(hello.gesture?.kind).toBe('arrive');
    expect(loading.expression).toBe('loading');
    expect(loading.rotations?.outer?.duration).toBe(7300);
    expect(loading.rotations?.cardinals?.angle).toBeLessThan(0);
  });

  it('deliberates once after the final answer before introducing the alter ego', () => {
    const loading = onboardingMascotScene({ bearing: 86, loadingDuration: 9100, moment: 'alter-ego-loading', phase: 7, step: 58, total: 69 });

    expect(loading.expression).toBe('loading');
    expect(loading.rotations?.outer?.duration).toBe(9100);
    expect(loading.rotations?.outer?.angle).toBeGreaterThan(360);
  });

  it('registers a weighty payoff without judging the answer that produced it', () => {
    const scene = onboardingMascotScene({ bearing: 121, moment: 'payoff-cost', phase: 5, step: 29, total: 50 });

    expect(scene.expression).toBe('concerned');
    expect(scene.gesture).toBeUndefined();
  });

  it('acknowledges the completed contract with pride', () => {
    const scene = onboardingMascotScene({ bearing: 47, moment: 'complete', phase: 8, step: 50, total: 50 });

    expect(scene.expression).toBe('proud');
    expect(scene.transition?.expression).toBe('acknowledge');
    expect(scene.gesture?.kind).toBe('acknowledge');
  });
});

import {
  STAR_QUESTIONS,
  deriveNorthStar,
  directionWeightsForNorthStar,
  priorityTotals,
  rankNorthStars,
} from '@/domains/onboarding/north-star';

describe('the five North Star preference questions', () => {
  it('keeps all five outside Reality scoring and defines their selection limits', () => {
    expect(STAR_QUESTIONS.map(({ id, min, max }) => ({ id, min, max }))).toStrictEqual([
      { id: 'year-matters', max: 2, min: 2 },
      { id: 'building-time', max: 1, min: 1 },
      { id: 'commitment-freedom', max: 1, min: 1 },
      { id: 'friction-unsaid', max: 1, min: 1 },
      { id: 'ordinary-day', max: 2, min: 1 },
    ]);
  });

  it('uses balanced tradeoffs rather than virtue-versus-flaw binaries', () => {
    expect(STAR_QUESTIONS[1].options.map((option) => option.label)).toStrictEqual([
      'Protect my time, much more',
      'Protect my time, a little more',
      'They matter about the same',
      'Build, a little more',
      'Build, much more',
    ]);
    expect(STAR_QUESTIONS[2].options.map((option) => option.label)).toStrictEqual([
      'A close life, much more',
      'A close life, a little more',
      'They matter about the same',
      'Freedom, a little more',
      'Freedom, much more',
    ]);
    expect(STAR_QUESTIONS[3].options.map((option) => option.label)).toStrictEqual([
      'Say what matters, much more',
      'Say what matters, a little more',
      'They matter about the same',
      'Keep the peace, a little more',
      'Keep the peace, much more',
    ]);
  });

  it('defines one deliberate emphasis phrase inside every preference prompt', () => {
    for (const question of STAR_QUESTIONS) {
      expect(question.prompt).toContain(question.emphasis);
    }
  });

  it('uses the five answers to rank all eight destinations without celebrity weights', () => {
    const choices = {
      answers: {
        'building-time': ['build-strong'],
        'commitment-freedom': ['commit-strong'],
        'friction-unsaid': ['plain-strong'],
        'ordinary-day': ['lead-build'],
        'year-matters': ['build', 'relationships'],
      },
    } as const;
    const ranked = rankNorthStars(choices);

    expect(ranked[0]).toBe(deriveNorthStar(choices));
    expect(ranked).toHaveLength(8);
    expect(new Set(ranked).size).toBe(8);
    expect(priorityTotals(choices)).toStrictEqual({
      building: 6,
      candor: 3,
      closeness: 4,
      enjoyment: 0,
      freedom: 1,
      mastery: 1,
      service: 0,
      steadiness: 1,
    });
  });

  it('lets freedom, ordinary enjoyment, and mobility point to a different valid life', () => {
    expect(
      deriveNorthStar({
        answers: {
          'building-time': ['time-strong'],
          'commitment-freedom': ['freedom-strong'],
          'friction-unsaid': ['peace-strong'],
          'ordinary-day': ['projects-places', 'steady-life'],
          'year-matters': ['freedom', 'enjoyment'],
        },
      }),
    ).toBe('playboy');
  });

  it('keeps every Reality Axis live while changing emphasis by destination', () => {
    const patriarch = directionWeightsForNorthStar('patriarch');
    const modernMan = directionWeightsForNorthStar('modern-man');

    expect(Object.values(patriarch).every((weight) => weight > 0)).toBe(true);
    expect(Object.values(modernMan).every((weight) => weight > 0)).toBe(true);
    expect(patriarch.craft).toBeGreaterThan(modernMan.craft);
    expect(modernMan.connection).toBeGreaterThan(patriarch.connection);
  });
});

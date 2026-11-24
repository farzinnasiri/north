import {
  STAR_QUESTIONS,
  deriveNorthStar,
  directionWeightsForNorthStar,
  priorityTotals,
  rankNorthStars,
} from '@/domains/onboarding/north-star';

describe('the two North Star preference questions', () => {
  it('keeps both outside Reality scoring and defines their selection limits', () => {
    expect(STAR_QUESTIONS.map(({ id, min, max }) => ({ id, min, max }))).toStrictEqual([
      { id: 'year-matters', max: 2, min: 2 },
      { id: 'ordinary-day', max: 2, min: 1 },
    ]);
  });

  it('defines one deliberate emphasis phrase inside every preference prompt', () => {
    for (const question of STAR_QUESTIONS) {
      expect(question.prompt).toContain(question.emphasis);
    }
  });

  it('uses the two answers to rank all eight destinations without celebrity weights', () => {
    const choices = {
      answers: {
        'ordinary-day': ['lead-build'],
        'year-matters': ['build', 'relationships'],
      },
    } as const;
    const ranked = rankNorthStars(choices);

    expect(ranked[0]).toBe(deriveNorthStar(choices));
    expect(ranked).toHaveLength(8);
    expect(new Set(ranked).size).toBe(8);
    expect(priorityTotals(choices)).toStrictEqual({
      building: 4,
      candor: 1,
      closeness: 2,
      enjoyment: 0,
      freedom: 0,
      mastery: 0,
      service: 0,
      steadiness: 0,
    });
  });

  it('lets freedom, ordinary enjoyment, and mobility point to a different valid life', () => {
    expect(
      deriveNorthStar({
        answers: {
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

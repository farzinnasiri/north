import type { DirectionWeights } from '@/domains/direction/initial-direction';
import { directionWeightsForNorthStar } from '@/domains/onboarding/north-star';
import {
  AVOIDED_OPTIONS,
  NORTH_STAR_OPTIONS,
  QUESTIONS,
  answerFor,
  getAxisReadings,
  getInitialDirection,
  scoreQuestion,
} from '@/domains/onboarding/onboarding';

function question(id: string) {
  const match = QUESTIONS.find((item) => item.id === id);
  if (!match) throw new Error(`Unknown question ${id}`);
  return match;
}

describe('the 12-question Reality bank', () => {
  it('asks two distinct questions for each Axis, with at least one scored answer', () => {
    expect(QUESTIONS).toHaveLength(12);

    for (const axis of ['frame', 'desire', 'connection', 'appetite', 'craft', 'agency'] as const) {
      const questions = QUESTIONS.filter((entry) => entry.axis === axis);
      expect(questions).toHaveLength(2);
      expect(questions.some((entry) => entry.options.every((option) => option.off !== null))).toBe(true);
    }
  });

  it('uses the accepted plain-language candidate prompts', () => {
    expect(QUESTIONS.map((entry) => entry.prompt)).toStrictEqual([
      'When you disagreed, how often did you say so?',
      'How many times did you say yes and regret it?',
      'When you wanted to know someone better, how often did you start the conversation?',
      "How many times did you rule yourself out before even trying?",
      'If you were in trouble at 2 a.m., how many people could you call?',
      'How many personal conversations did you start with people you know?',
      'On how many days did you use your free time as planned?',
      'How many times did a habit cause a problem?',
      'When did you last finish something nobody made you finish?',
      'On how many days did you intentionally move or care for your body?',
      'How often did you take a step that mattered to you without being asked?',
      'Even when luck or others affect the result, I can usually change what happens next.',
    ]);
  });

  it('defines one deliberate emphasis phrase inside every prompt', () => {
    for (const entry of QUESTIONS) {
      expect(entry.prompt).toContain(entry.emphasis);
    }
  });

  it('does not bring back the rejected moralised or status-biased items', () => {
    const copy = QUESTIONS.flatMap((entry) => [
      entry.prompt,
      ...('options' in entry ? entry.options.map((option) => option.label) : []),
    ]).join(' ').toLowerCase();

    for (const rejected of [
      'walk up to a woman',
      'lucky person',
      'happy or satisfied',
      'someone would pay',
      'keeps his word',
      'put money on a game',
    ]) {
      expect(copy).not.toContain(rejected);
    }
  });

  it('keeps context answers out of the score instead of treating them as failure', () => {
    expect(scoreQuestion(question('F1'), 0)).toBeNull();
    expect(scoreQuestion(question('C9'), 5)).toBeNull();
    expect(scoreQuestion(question('A13'), 6)).toBeNull();
    expect(scoreQuestion(question('K18'), 6)).toBeNull();
    expect(scoreQuestion(question('G21'), 6)).toBeNull();
  });

  it('scores ordered behavior responses without changing their displayed order', () => {
    expect([1, 2, 3, 4, 5].map((value) => scoreQuestion(question('F1'), value))).toStrictEqual([
      100, 75, 50, 25, 0,
    ]);
    expect([0, 1, 2, 3, 4, 5].map((value) => scoreQuestion(question('D7'), value))).toStrictEqual([0, 20, 40, 60, 80, 100]);
    expect([0, 1, 2, 3, 4].map((value) => scoreQuestion(question('C9'), value))).toStrictEqual([
      100, 75, 50, 25, 0,
    ]);
    expect([0, 1, 2, 3, 4, 5].map((value) => scoreQuestion(question('K20'), value))).toStrictEqual([100, 80, 60, 40, 20, 0]);
  });

  it('ignores unscored context when averaging an Axis', () => {
    const first = answerFor(question('F1'), 0, scoreQuestion(question('F1'), 0));
    const second = answerFor(question('F3'), 5, scoreQuestion(question('F3'), 5));

    expect(getAxisReadings({ F1: first, F3: second })).toContainEqual({
      axis: 'frame',
      off: 100,
    });
  });

  it('uses the chosen North Star to weight the same Reality answers', () => {
    const offByAxis = {
      agency: 50,
      appetite: 50,
      connection: 0,
      craft: 100,
      desire: 50,
      frame: 50,
    } as const;
    const answers = Object.fromEntries(QUESTIONS.map((entry) => {
      const answer = answerFor(entry, 0, offByAxis[entry.axis]);
      return [answer.id, answer];
    }));

    const patriarch = getInitialDirection(answers, directionWeightsForNorthStar('patriarch'));
    const modernMan = getInitialDirection(answers, directionWeightsForNorthStar('modern-man'));

    expect(patriarch).toBeGreaterThan(modernMan);
  });

  it('maps an equal weighted Reality gap onto the compass arc', () => {
    const answers = Object.fromEntries(QUESTIONS.map((entry) => {
      const answer = answerFor(entry, 0, 50);
      return [answer.id, answer];
    }));
    const equalWeights: DirectionWeights = {
      agency: 1,
      appetite: 1,
      connection: 1,
      craft: 1,
      desire: 1,
      frame: 1,
    };

    expect(getInitialDirection(answers, equalWeights)).toBe(90);
  });
});

describe('the North Star archetypes', () => {
  it('keeps the original eight authored archetypes and reference figures', () => {
    expect(NORTH_STAR_OPTIONS.map((option) => option.label)).toStrictEqual([
      'The Patriarch',
      'The Modern Man',
      'The Rogue',
      'The Laughing Wolf',
      'The Godfather',
      'The Kind Father',
      'The Freethinker',
      'The Playboy',
    ]);

    expect(NORTH_STAR_OPTIONS[0].figures).toStrictEqual(['Aragorn', "T'Challa", 'Marcus Aurelius']);
  });
});

describe('the final Reality reflection', () => {
  it('offers the eight accepted unscored answers', () => {
    expect(AVOIDED_OPTIONS.map((option) => option.label)).toStrictEqual([
      'An avoided conversation',
      'Something I keep putting off',
      'A habit taking too much',
      'An apology or repair I owe',
      'My body or health',
      'Avoiding money matters',
      'Something else',
      'Not sure yet',
    ]);
  });
});

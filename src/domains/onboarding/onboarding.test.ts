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

describe('the 24-question Reality bank', () => {
  it('asks four behavior questions for each Axis', () => {
    expect(QUESTIONS).toHaveLength(24);

    for (const axis of ['frame', 'desire', 'connection', 'appetite', 'craft', 'agency'] as const) {
      expect(QUESTIONS.filter((entry) => entry.axis === axis)).toHaveLength(4);
    }
  });

  it('uses the accepted plain-language candidate prompts', () => {
    expect(QUESTIONS.map((entry) => entry.prompt)).toStrictEqual([
      'In the past 30 days, when you thought someone was wrong, how often did you tell them you disagreed?',
      'The last time someone asked for more than you could give, what did you do?',
      'In the past 30 days, how many times did you say yes and later wish you had said no?',
      'In the past 30 days, how many times did you go along with someone else so they would not be upset with you?',
      'In the past 30 days, when you wanted to know someone better, how often did you start the conversation?',
      'In the past 30 days, how often did you ask for something they might say no to?',
      "I decide I can't do it before I try.",
      'In the past 30 days, how many times did being afraid they would say no stop you from doing something you still wanted to do?',
      'If you were in trouble at 2 a.m., how many people could you call?',
      'In the past 30 days, how many times did someone close to you ask how you were and keep listening after your first answer?',
      'In the past 7 days, how many personal conversations did you start with someone you know?',
      'In the past 30 days, how many times did you ask someone how they were and keep listening after their first answer?',
      'In the past 7 days, on how many days did you spend your free time the way you planned?',
      'Think of the last time you opened TikTok, Instagram, X, YouTube, or a similar app and told yourself "five more minutes." How long did you stay?',
      'In the past 30 days, how many times did you handle a bad day in a way that took more time or energy than you meant?',
      'In the past 30 days, how many times did a habit cause a problem for your sleep, time, work, study, or someone close to you?',
      'In the past year, how many skills did you use to make, fix, teach, or solve something for someone else?',
      'When did you last finish something nobody made you finish?',
      'In the past 7 days, on how many days did you practice a skill you want to improve?',
      'In the past 7 days, on how many days did you exercise or take care of your body as planned?',
      'In the past 7 days, how many times did you take a step that mattered to you without anyone asking?',
      'When I do not know how to do something, I can usually find a first step.',
      'Think of the last plan that went wrong. What did you do next?',
      'Even when luck or other people shape the result, I can usually change what happens next.',
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
    expect(scoreQuestion(question('F2'), 5)).toBeNull();
    expect(scoreQuestion(question('D8'), 5)).toBeNull();
    expect(scoreQuestion(question('A14'), 5)).toBeNull();
    expect(scoreQuestion(question('A14'), 6)).toBeNull();
    expect(scoreQuestion(question('G23'), 5)).toBeNull();
  });

  it('scores ordered behavior responses without changing their displayed order', () => {
    expect([1, 2, 3, 4, 5].map((value) => scoreQuestion(question('F1'), value))).toStrictEqual([
      100, 75, 50, 25, 0,
    ]);
    expect([0, 1, 2, 3, 4, 5].map((value) => scoreQuestion(question('D7'), value))).toStrictEqual([
      0, 20, 40, 60, 80, 100,
    ]);
    expect([0, 1, 2, 3, 4].map((value) => scoreQuestion(question('C9'), value))).toStrictEqual([
      100, 75, 50, 25, 0,
    ]);
    expect([0, 1, 2, 3, 4].map((value) => scoreQuestion(question('A14'), value))).toStrictEqual([
      0, 25, 50, 75, 100,
    ]);
    expect([0, 1, 2, 3, 4].map((value) => scoreQuestion(question('G23'), value))).toStrictEqual([
      0, 0, 15, 0, 100,
    ]);
  });

  it('ignores unscored context when averaging an Axis', () => {
    const first = answerFor(question('F1'), 0, scoreQuestion(question('F1'), 0));
    const second = answerFor(question('F2'), 4, scoreQuestion(question('F2'), 4));
    const third = answerFor(question('F3'), 0, scoreQuestion(question('F3'), 0));

    expect(getAxisReadings({ F1: first, F2: second, F3: third })).toContainEqual({
      axis: 'frame',
      off: 50,
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
      'A conversation I keep avoiding',
      'Something I keep saying I will start',
      'A habit that keeps taking more than I mean to give',
      'An apology or repair I owe',
      'Taking care of my body or health',
      'Money I keep avoiding',
      'Something else',
      'I am not sure yet',
    ]);
  });
});

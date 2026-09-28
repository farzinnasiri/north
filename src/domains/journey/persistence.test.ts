import { beginJourney } from '@/domains/journey/journey';
import { clearJourney, loadJourney } from '@/domains/journey/persistence';

jest.mock('expo-sqlite/localStorage/install', () => {
  const values = new Map<string, string>();
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: (key: string) => values.get(key) ?? null,
      removeItem: (key: string) => values.delete(key),
      setItem: (key: string, value: string) => values.set(key, value),
    },
  });
  return {};
});

describe('journey persistence', () => {
  afterEach(() => clearJourney());

  it('restores temporary North Star ids to the original archetypes', () => {
    const journey = beginJourney({
      at: 1,
      direction: 90,
      honestThing: 'conversation',
      name: 'Farzin',
      northStar: 'patriarch',
      readings: [],
    });
    localStorage.setItem('north.journey', JSON.stringify({
      journey: { ...journey, northStar: 'builder' },
      version: 3,
    }));

    expect(loadJourney()?.northStar).toBe('patriarch');
  });
});

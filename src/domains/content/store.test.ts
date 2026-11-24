import { BUNDLED_CATALOGUE } from '@/domains/content/catalogue';
import { useCatalogue } from '@/domains/content/store';
import { fetchCatalogue, fetchPublishedVersion } from '@/platform/content-api';

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

jest.mock('@/platform/content-api', () => ({
  fetchCatalogue: jest.fn(),
  fetchPublishedVersion: jest.fn(),
}));

const HOUR = 60 * 60 * 1000;
const published = jest.mocked(fetchPublishedVersion);
const download = jest.mocked(fetchCatalogue);

describe('keeping the catalogue fresh', () => {
  let now = 1_000_000_000_000;
  beforeEach(() => {
    now += 2 * HOUR;
    published.mockReset();
    download.mockReset();
  });

  it('does not download when the published version is the one it already has', async () => {
    published.mockResolvedValue(BUNDLED_CATALOGUE.version);

    await useCatalogue.getState().refresh(now);

    expect(download).not.toHaveBeenCalled();
    expect(useCatalogue.getState().catalogue.version).toBe(BUNDLED_CATALOGUE.version);
  });

  it('downloads and switches only when a newer version is published', async () => {
    const newer = { ...BUNDLED_CATALOGUE, version: BUNDLED_CATALOGUE.version + 1 };
    published.mockResolvedValue(newer.version);
    download.mockResolvedValue(newer);

    await useCatalogue.getState().refresh(now);

    expect(download).toHaveBeenCalledTimes(1);
    expect(useCatalogue.getState().catalogue.version).toBe(newer.version);
  });

  it('asks at most once an hour however often the app opens', async () => {
    published.mockResolvedValue(0);

    await useCatalogue.getState().refresh(now);
    await useCatalogue.getState().refresh(now + 10 * 60 * 1000);

    expect(published).toHaveBeenCalledTimes(1);
  });
});

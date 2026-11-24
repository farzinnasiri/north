import 'expo-sqlite/localStorage/install';

import { create } from 'zustand';

import type { Catalogue } from '@/domains/content/catalogue';
import { BUNDLED_CATALOGUE, isCatalogue } from '@/domains/content/catalogue';
import { fetchCatalogue, fetchPublishedVersion } from '@/platform/content-api';

const KEY = 'north.catalogue';
/** At most one version check an hour, however often the app is opened. */
const CHECK_EVERY_MS = 60 * 60 * 1000;

type CatalogueStore = {
  catalogue: Catalogue;
  refresh: (now?: number) => Promise<void>;
};

function loadCached(): Catalogue | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const cached: unknown = JSON.parse(raw);
    return isCatalogue(cached) ? cached : null;
  } catch {
    return null;
  }
}

function saveCached(catalogue: Catalogue): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(catalogue));
  } catch {
    // The copy in memory still works; the next newer version tries again.
  }
}

/** The newer of the bundled copy and the last download. */
function initial(): Catalogue {
  const cached = loadCached();
  return cached && cached.version > BUNDLED_CATALOGUE.version ? cached : BUNDLED_CATALOGUE;
}

let lastChecked = 0;
let inFlight: Promise<void> | null = null;

/**
 * Content is the one thing North fetches. It checks the published version and
 * downloads only when there is something newer. A failed check changes
 * nothing: suggestions never wait on the network.
 */
export const useCatalogue = create<CatalogueStore>((set, get) => ({
  catalogue: initial(),
  refresh: (now = Date.now()) => {
    if (inFlight) return inFlight;
    if (now - lastChecked < CHECK_EVERY_MS) return Promise.resolve();
    lastChecked = now;
    inFlight = fetchPublishedVersion()
      .then(async (published) => {
        if (published <= get().catalogue.version) return;
        const catalogue = await fetchCatalogue();
        if (catalogue.version <= get().catalogue.version) return;
        saveCached(catalogue);
        set({ catalogue });
      })
      .catch(() => {
        // Offline or the API is down. The next check tries again.
      })
      .finally(() => {
        inFlight = null;
      });
    return inFlight;
  },
}));

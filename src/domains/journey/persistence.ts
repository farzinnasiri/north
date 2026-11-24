import 'expo-sqlite/localStorage/install';

import type { Journey } from '@/domains/journey/journey';

const KEY = 'north.journey';

/**
 * The Journey is stored on the phone and nowhere else. Version 5 is the first
 * local-only shape; records written by the account-based builds are not
 * migrated, because those builds kept the real record on the server.
 */
const VERSION = 5;

type Stored = {
  journey: Journey;
  version: typeof VERSION;
};

export function loadJourney(): Journey | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const stored = JSON.parse(raw) as Stored;
    if (stored?.version !== VERSION || !stored.journey) return null;
    return stored.journey;
  } catch {
    // A corrupt record must never lock a man out of his own app.
    return null;
  }
}

export function saveJourney(journey: Journey): void {
  try {
    localStorage.setItem(KEY, JSON.stringify({ journey, version: VERSION } satisfies Stored));
  } catch {
    // Losing the write is survivable; crashing mid check-in is not.
  }
}

export function clearJourney(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // Nothing to do: a fresh start overwrites it anyway.
  }
}

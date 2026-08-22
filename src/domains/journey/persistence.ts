import 'expo-sqlite/localStorage/install';

import type { Journey } from '@/domains/journey/journey';

const KEY = 'north.journey';

/**
 * Bumped whenever the stored shape changes. A record written by an older
 * version is discarded rather than migrated, which is honest while this is a
 * local prototype and unacceptable once Convex owns the record.
 */
const VERSION = 1;

type Stored = {
  journey: Journey;
  version: number;
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
    // Losing the write is survivable; crashing mid-closeout is not.
  }
}

export function clearJourney(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // Nothing to do — a fresh start overwrites it anyway.
  }
}

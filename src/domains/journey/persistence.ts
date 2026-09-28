import 'expo-sqlite/localStorage/install';

import type { Journey } from '@/domains/journey/journey';

const KEY = 'north.journey';

/**
 * Bumped whenever the stored shape changes. Local prototype names are migrated
 * below; once Convex owns the record, migrations belong at that durable boundary.
 */
const VERSION = 4;

type Stored = {
  journey: Journey;
  version: typeof VERSION;
};

type TemporaryNorthStar =
  | 'builder'
  | 'partner'
  | 'independent'
  | 'host'
  | 'steward'
  | 'anchor'
  | 'maker'
  | 'explorer';

type Version3Journey = Omit<Journey, 'northStar'> & {
  northStar: TemporaryNorthStar | null;
};

type Version3Stored = {
  journey: Version3Journey;
  version: 3;
};

type Version2Stored = {
  journey: Journey;
  version: 2;
};

type Version1Journey = Omit<Journey, 'direction' | 'startingDirection'> & {
  bearing: number;
  startingBearing: number;
};

type Version1Stored = {
  journey: Version1Journey;
  version: 1;
};

const NORTH_STAR_RESTORATION: Record<TemporaryNorthStar, NonNullable<Journey['northStar']>> = {
  builder: 'patriarch',
  partner: 'modern-man',
  independent: 'rogue',
  host: 'laughing-wolf',
  steward: 'godfather',
  anchor: 'kind-father',
  maker: 'freethinker',
  explorer: 'playboy',
};

function restoreNorthStar(northStar: TemporaryNorthStar | null): Journey['northStar'] {
  return northStar ? NORTH_STAR_RESTORATION[northStar] : null;
}

export function loadJourney(): Journey | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;

    const stored = JSON.parse(raw) as Stored | Version3Stored | Version2Stored | Version1Stored;
    if (!stored?.journey) return null;

    if (stored.version === 1) {
      const { bearing, startingBearing, ...journey } = stored.journey;
      const migrated = {
        ...journey,
        direction: bearing,
        startingDirection: startingBearing,
      } satisfies Journey;
      saveJourney(migrated);
      return migrated;
    }

    if (stored.version === 2) {
      saveJourney(stored.journey);
      return stored.journey;
    }

    if (stored.version === 3) {
      const restored = {
        ...stored.journey,
        northStar: restoreNorthStar(stored.journey.northStar),
      } satisfies Journey;
      saveJourney(restored);
      return restored;
    }

    if (stored.version !== VERSION) return null;

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

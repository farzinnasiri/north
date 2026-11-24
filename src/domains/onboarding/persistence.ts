import 'expo-sqlite/localStorage/install';

import type { OnboardingDraft } from '@/domains/onboarding/onboarding';
import { INITIAL_DRAFT } from '@/domains/onboarding/onboarding';

const KEY = 'north.onboarding.draft';

/**
 * Bumped whenever the stored shape changes. A draft written by an older
 * version is discarded rather than migrated: this is an unfinished flow that
 * has not been signed yet, so restarting it is honest and a half-migrated
 * Reality would be worse than a fresh one.
 */
const VERSION = 15;

type Stored = {
  version: number;
  step: number;
  draft: OnboardingDraft;
};

export type RestoredDraft = {
  step: number;
  draft: OnboardingDraft;
};

function emptyDraft(): OnboardingDraft {
  return {
    ...INITIAL_DRAFT,
    answers: {},
    profile: { ...INITIAL_DRAFT.profile },
  };
}

export function loadDraft(): RestoredDraft {
  const fresh = { draft: emptyDraft(), step: 0 };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return fresh;

    const stored = JSON.parse(raw) as Stored;
    if (stored?.version !== VERSION || !stored.draft) return fresh;

    return {
      draft: { ...emptyDraft(), ...stored.draft },
      step: typeof stored.step === 'number' ? stored.step : 0,
    };
  } catch {
    // A corrupt draft must never block a man from starting.
    return fresh;
  }
}

export function saveDraft(step: number, draft: OnboardingDraft): void {
  try {
    localStorage.setItem(KEY, JSON.stringify({ draft, step, version: VERSION } satisfies Stored));
  } catch {
    // Losing a screen of progress is survivable; crashing mid-question is not.
  }
}

export function clearDraft(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // Nothing to do — the next run overwrites it anyway.
  }
}

import { create } from 'zustand';

import type { Outcome } from '@/domains/actions/action';
import type { Line } from '@/domains/content/catalogue';
import type { Journey, Preferences } from '@/domains/journey/journey';
import {
  attachNote,
  beginJourney,
  checkIn,
  openAction,
  passSuggestions,
  setJourneyName,
  setPreferences,
} from '@/domains/journey/journey';
import { clearJourney, loadJourney, saveJourney } from '@/domains/journey/persistence';
import { cancelCheckIns, scheduleCheckIn } from '@/platform/check-in';
import { setHapticsEnabled } from '@/platform/haptics';

export type PendingMovement = { from: number; to: number };

type JourneyStore = {
  begin: (input: Parameters<typeof beginJourney>[0]) => void;
  /** Bumped on every change, so screens can tell a fresh state from a remount. */
  changedAt: number;
  checkIn: (input: { instanceId: string; note?: string | null; outcome: Outcome }) => PendingMovement | null;
  erase: () => void;
  journey: Journey | null;
  note: (note: string) => void;
  open: (input: { action: string; days: number; line: Line }) => void;
  pass: (ids: readonly string[]) => void;
  pendingMovement: PendingMovement | null;
  preferences: (change: Partial<Preferences>) => void;
  rename: (name: string) => void;
  settleNeedle: () => void;
};

const restored = loadJourney();
if (restored) setHapticsEnabled(restored.preferences.haptics);

function newInstanceId(at: number): string {
  return `${at.toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Keeps the scheduled check-in in step with the open Action and the settings. */
function syncCheckIn(journey: Journey): void {
  const task = journey.open && journey.preferences.checkIns ? scheduleCheckIn(journey.open) : cancelCheckIns();
  void task.catch(() => {
    // A missing notification never blocks the app: Today shows the check-in too.
  });
}

/**
 * The Journey, held on the phone. Every change is written straight to local
 * storage; there is nothing to sync and nothing to wait for.
 */
export const useJourney = create<JourneyStore>((set, get) => {
  function commit(journey: Journey, extra: Partial<JourneyStore> = {}) {
    saveJourney(journey);
    set({ changedAt: Date.now(), journey, ...extra });
  }

  return {
    begin: (input) => {
      const journey = beginJourney(input);
      commit(journey, { pendingMovement: null });
    },
    changedAt: 0,
    checkIn: ({ instanceId, note, outcome }) => {
      const journey = get().journey;
      if (!journey?.open || journey.open.instanceId !== instanceId) return null;
      const next = checkIn(journey, { at: Date.now(), note, outcome });
      const movement = next.direction === journey.direction ? null : { from: journey.direction, to: next.direction };
      commit(next, { pendingMovement: movement });
      syncCheckIn(next);
      return movement;
    },
    erase: () => {
      clearJourney();
      void cancelCheckIns().catch(() => {});
      set({ changedAt: Date.now(), journey: null, pendingMovement: null });
    },
    journey: restored,
    note: (note) => {
      const journey = get().journey;
      if (journey) commit(attachNote(journey, note));
    },
    open: ({ action, days, line }) => {
      const journey = get().journey;
      if (!journey) return;
      const at = Date.now();
      const next = openAction(journey, { action, at, days, instanceId: newInstanceId(at), line });
      commit(next);
      syncCheckIn(next);
    },
    pass: (ids) => {
      const journey = get().journey;
      if (journey) commit(passSuggestions(journey, ids, Date.now()));
    },
    pendingMovement: null,
    preferences: (change) => {
      const journey = get().journey;
      if (!journey) return;
      const next = setPreferences(journey, change);
      if (change.haptics !== undefined) setHapticsEnabled(change.haptics);
      commit(next);
      if (change.checkIns !== undefined || change.checkInMinutes !== undefined) syncCheckIn(next);
    },
    rename: (name) => {
      const journey = get().journey;
      if (journey) commit(setJourneyName(journey, name));
    },
    settleNeedle: () => set({ pendingMovement: null }),
  };
});

import { create } from 'zustand';

import type { OpenAction } from '@/domains/actions/action';
import type { Journey, Preferences } from '@/domains/journey/journey';
import {
  attachNote,
  beginJourney,
  closeAction,
  letGo,
  openAction,
  setJourneyName,
  setPreferences,
  spendSwap,
} from '@/domains/journey/journey';
import { clearJourney, loadJourney, saveJourney } from '@/domains/journey/persistence';
import { setHapticsEnabled } from '@/platform/haptics';

/**
 * The needle moves once per closed Action and the person watches it, so the
 * movement has to survive the trip from the closeout sheet back to the home
 * screen. Home consumes this and clears it; nothing else may read it.
 */
export type PendingMovement = {
  from: number;
  to: number;
};

type JourneyStore = {
  begin: (input: Parameters<typeof beginJourney>[0]) => void;
  /**
   * When the loop last changed under him. A screen compares it with the moment
   * it mounted to know whether a state arrived or simply was, which is the
   * whole difference between an entrance he caused and one he did not.
   */
  changedAt: number;
  close: (input: { at: number; kept: boolean; note?: string | null }) => void;
  erase: () => void;
  journey: Journey | null;
  letGoOfAction: (at: number) => void;
  note: (note: string) => void;
  open: (action: OpenAction) => void;
  pendingMovement: PendingMovement | null;
  preferences: (preferences: Preferences) => void;
  rename: (name: string) => void;
  settleNeedle: () => void;
  swap: (actionId: string, at: number) => void;
};

function persist(journey: Journey): Journey {
  saveJourney(journey);
  setHapticsEnabled(journey.preferences.haptics);
  return journey;
}

const restored = loadJourney();
if (restored) {
  setHapticsEnabled(restored.preferences.haptics);
}

export const useJourney = create<JourneyStore>((set, get) => ({
  begin: (input) => set({ journey: persist(beginJourney(input)), pendingMovement: null }),

  changedAt: 0,

  close: ({ at, kept, note }) => {
    const journey = get().journey;
    if (!journey) return;
    const next = closeAction(journey, { at, kept, note });
    set({
      changedAt: at,
      journey: persist(next),
      pendingMovement:
        next.direction === journey.direction ? null : { from: journey.direction, to: next.direction },
    });
  },

  erase: () => {
    clearJourney();
    set({ journey: null, pendingMovement: null });
  },

  journey: restored,

  letGoOfAction: (at) => {
    const journey = get().journey;
    if (!journey) return;
    set({ changedAt: at, journey: persist(letGo(journey, at)) });
  },

  note: (note) => {
    const journey = get().journey;
    if (!journey) return;
    set({ journey: persist(attachNote(journey, note)) });
  },

  open: (action) => {
    const journey = get().journey;
    if (!journey) return;
    set({ changedAt: action.openedAt, journey: persist(openAction(journey, action)) });
  },

  pendingMovement: null,

  preferences: (preferences) => {
    const journey = get().journey;
    if (!journey) return;
    set({ journey: persist(setPreferences(journey, preferences)) });
  },

  rename: (name) => {
    const journey = get().journey;
    if (!journey) return;
    set({ journey: persist(setJourneyName(journey, name)) });
  },

  settleNeedle: () => set({ pendingMovement: null }),

  swap: (actionId, at) => {
    const journey = get().journey;
    if (!journey) return;
    set({ journey: persist(spendSwap(journey, actionId, at)) });
  },
}));

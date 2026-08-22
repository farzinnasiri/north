import type { PropsWithChildren } from 'react';
import { createContext, use } from 'react';

import type { SharedValue } from 'react-native-reanimated';

import type { MascotScene } from '@/domains/mascot/mascot';

export type OnboardingProgress = {
  /** Questions answered so far, 0-20. Drives the inscribed graduations. */
  answered: number;
  /**
   * 0 to 1, written only by the Contract while his hand is down. It lives here
   * because the circuit it draws belongs to the edge of the screen, which the
   * shell owns, while the hand that drives it is on the step inside.
   */
  ceremony: SharedValue<number>;
  /** Full destination state for the mascot on this screen. */
  mascot: MascotScene;
  /** Index of the movement in progress, for the rail. */
  phase: number;
  /** How far through that movement, 0-1. */
  phaseFraction: number;
  phases: readonly string[];
  /** 1-based position in the whole flow. */
  step: number;
  total: number;
};

const OnboardingProgressContext = createContext<OnboardingProgress | null>(null);

/**
 * Position is provided, never passed. Every screen used to hardcode its own
 * step number, so inserting the five chapter breaks would have meant editing
 * eleven files and silently renumbering the rest.
 */
export function OnboardingProgressProvider({
  children,
  value,
}: PropsWithChildren<{ value: OnboardingProgress }>) {
  return (
    <OnboardingProgressContext value={value}>{children}</OnboardingProgressContext>
  );
}

export function useOnboardingProgress(): OnboardingProgress | null {
  return use(OnboardingProgressContext);
}

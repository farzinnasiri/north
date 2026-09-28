import type { PropsWithChildren } from 'react';
import { createContext, use } from 'react';
import type { SharedValue } from 'react-native-reanimated';

import type { MascotScene } from '@/domains/mascot/mascot';
import type { OnboardingPromptPosition } from '@/domains/onboarding/sequence';

export type OnboardingProgress = {
  /** Scored Reality questions answered so far, 0-24. */
  answered: number;
  /** Contract circuit, written only while the person's hand is down. */
  ceremony: SharedValue<number>;
  /** Full destination state for the mascot on this screen. */
  mascot: MascotScene;
  /** Index of the movement in progress, for the rail. */
  phase: number;
  /** How far through that movement, 0-1. */
  phaseFraction: number;
  phases: readonly string[];
  /** Position among the 30 authored prompts, absent on non-question steps. */
  prompt: OnboardingPromptPosition | null;
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

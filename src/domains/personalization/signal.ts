import type { SignalPalette } from '@/components/ui/signal-theme';
import type { NorthStarType } from '@/domains/onboarding/onboarding';
import { colors } from '@/theme';

export type SignalId = 'signal' | 'gilt' | 'tide' | 'cobalt';

export type SignalIdentity = SignalPalette & {
  id: SignalId;
  label: string;
};

export const SIGNAL_IDENTITIES: readonly SignalIdentity[] = [
  {
    id: 'signal',
    label: 'Direct Red',
    light: colors.meridianLight,
    muted: colors.brassDim,
    onPrimary: colors.brassOn,
    primary: colors.brass,
  },
  {
    id: 'gilt',
    label: 'Quiet Gold',
    light: colors.signalGoldLight,
    muted: colors.signalGoldMuted,
    onPrimary: colors.fieldDeep,
    primary: colors.signalGold,
  },
  {
    id: 'tide',
    label: 'Open Teal',
    light: colors.signalTideLight,
    muted: colors.signalTideMuted,
    onPrimary: colors.fieldDeep,
    primary: colors.signalTide,
  },
  {
    id: 'cobalt',
    label: 'Electric Blue',
    light: colors.signalCobaltLight,
    muted: colors.signalCobaltMuted,
    onPrimary: colors.fieldDeep,
    primary: colors.signalCobalt,
  },
];

const SUGGESTED_SIGNAL: Record<NorthStarType, SignalId> = {
  patriarch: 'gilt',
  'modern-man': 'tide',
  rogue: 'cobalt',
  'laughing-wolf': 'signal',
  godfather: 'gilt',
  'kind-father': 'tide',
  freethinker: 'signal',
  playboy: 'cobalt',
};

export function signalIdentity(id: SignalId): SignalIdentity {
  return SIGNAL_IDENTITIES.find((identity) => identity.id === id) ?? SIGNAL_IDENTITIES[0];
}

/** Authored mapping, not a personality test: the same North Star always suggests the same signal. */
export function suggestedSignal(northStar: NorthStarType | null): SignalId {
  return northStar ? SUGGESTED_SIGNAL[northStar] : 'signal';
}

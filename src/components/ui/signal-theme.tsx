import { createContext, useContext } from 'react';
import type { PropsWithChildren } from 'react';

import { colors } from '@/theme';

export type SignalPalette = {
  light: string;
  muted: string;
  onPrimary: string;
  primary: string;
};

const defaultSignal: SignalPalette = {
  light: colors.meridianLight,
  muted: colors.brassDim,
  onPrimary: colors.brassOn,
  primary: colors.brass,
};

const SignalThemeContext = createContext<SignalPalette>(defaultSignal);

export function SignalThemeProvider({
  children,
  value,
}: PropsWithChildren<{ value: SignalPalette }>) {
  return (
    <SignalThemeContext.Provider value={value}>
      {children}
    </SignalThemeContext.Provider>
  );
}

export function useSignalTheme(): SignalPalette {
  return useContext(SignalThemeContext);
}

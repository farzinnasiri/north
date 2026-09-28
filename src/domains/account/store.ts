import 'expo-sqlite/localStorage/install';

import { create } from 'zustand';

import type { SignalId } from '@/domains/personalization/signal';

const KEY = 'north.local-account';

type LocalAccount = {
  email: string;
  name: string;
  personalized: boolean;
  signalId: SignalId;
  signedIn: boolean;
};

type AccountStore = LocalAccount & {
  createAccount: (email: string, name: string) => void;
  logOut: () => void;
  setName: (name: string) => void;
  setSignal: (signalId: SignalId) => void;
  signIn: (email: string, name: string) => void;
};

const EMPTY: LocalAccount = {
  email: '',
  name: '',
  personalized: false,
  signalId: 'signal',
  signedIn: false,
};

function load(): LocalAccount {
  try {
    const value = JSON.parse(localStorage.getItem(KEY) ?? '') as Partial<LocalAccount>;
    return {
      email: typeof value.email === 'string' ? value.email : '',
      name: typeof value.name === 'string' ? value.name : '',
      personalized: value.personalized === true,
      signalId: isSignalId(value.signalId) ? value.signalId : 'signal',
      signedIn: value.signedIn === true,
    };
  } catch {
    return EMPTY;
  }
}

function persist(account: LocalAccount): LocalAccount {
  try {
    localStorage.setItem(KEY, JSON.stringify(account));
  } catch {
    // The prototype can continue in memory when local persistence is unavailable.
  }
  return account;
}

const restored = load();

export const useAccount = create<AccountStore>((set, get) => ({
  ...restored,
  createAccount: (email, name) => set(persist({
    ...get(),
    email: email.trim(),
    name,
    personalized: false,
    signedIn: true,
  })),
  logOut: () => set(persist({ ...get(), signedIn: false })),
  setName: (name) => set(persist({ ...get(), name })),
  setSignal: (signalId) => set(persist({ ...get(), personalized: true, signalId })),
  signIn: (email, name) => set(persist({ ...get(), email: email.trim(), name, signedIn: true })),
}));

function isSignalId(value: unknown): value is SignalId {
  return value === 'signal' || value === 'gilt' || value === 'tide' || value === 'cobalt';
}

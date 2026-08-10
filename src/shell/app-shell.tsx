import {
  Inter_400Regular,
  Inter_500Medium,
  useFonts as useInterFonts,
} from '@expo-google-fonts/inter';
import {
  JetBrainsMono_400Regular,
  JetBrainsMono_500Medium,
  useFonts as useMonoFonts,
} from '@expo-google-fonts/jetbrains-mono';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import type { PropsWithChildren } from 'react';

const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL;

if (!convexUrl) {
  throw new Error('EXPO_PUBLIC_CONVEX_URL is required. Run the app through the Makefile.');
}

const convex = new ConvexReactClient(convexUrl);

export function AppShell({ children }: PropsWithChildren) {
  const [interLoaded] = useInterFonts({ Inter_400Regular, Inter_500Medium });
  const [monoLoaded] = useMonoFonts({ JetBrainsMono_400Regular, JetBrainsMono_500Medium });

  if (!interLoaded || !monoLoaded) {
    return null;
  }

  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}

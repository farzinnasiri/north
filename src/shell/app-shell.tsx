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
import * as SplashScreen from 'expo-splash-screen';
import type { PropsWithChildren } from 'react';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ReduceMotion, ReducedMotionConfig } from 'react-native-reanimated';

import { BootScreen } from '@/shell/boot-screen';
import { motion } from '@/theme';

void SplashScreen.preventAutoHideAsync();

export function AppShell({ children }: PropsWithChildren) {
  // The expo-font config plugin embeds all four faces at build time, so in a
  // native build these resolve on the first render and the splash never waits.
  // Expo Go does not run config plugins, so the hooks still do real loading
  // there and this stays the one code path that works in both.
  const [interLoaded] = useInterFonts({ Inter_400Regular, Inter_500Medium });
  const [monoLoaded] = useMonoFonts({ JetBrainsMono_400Regular, JetBrainsMono_500Medium });
  const fontsLoaded = interLoaded && monoLoaded;

  // The mark is held for one arrival whether or not the app needed the time.
  // A boot that flickers for eighty milliseconds reads as a glitch; a beat
  // that is always the same length reads as the product opening.
  const [beatPassed, setBeatPassed] = useState(false);

  useEffect(() => {
    void SplashScreen.hideAsync();
    const beat = setTimeout(() => setBeatPassed(true), motion.arrival);
    return () => clearTimeout(beat);
  }, []);

  const booted = fontsLoaded && beatPassed;

  // The overlay stays mounted through its own fade, so the app is revealed
  // rather than uncovered in a single frame.
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    if (!booted) return;
    const fade = setTimeout(() => setCleared(true), motion.settle);
    return () => clearTimeout(fade);
  }, [booted]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* Removes nonessential animation under the system setting. The compass
          opts out and cross-fades instead; see DESIGN.md, Motion. */}
      <ReducedMotionConfig mode={ReduceMotion.System} />
      {fontsLoaded ? children : null}
      {cleared ? null : <BootScreen held={!booted} />}
    </GestureHandlerRootView>
  );
}

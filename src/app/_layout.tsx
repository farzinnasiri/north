import { StatusBar } from 'expo-status-bar';
import Stack from 'expo-router/stack';
import { Platform } from 'react-native';

import { GLASS_AVAILABLE } from '@/components/ui/glass';

import { AppEffects } from '@/shell/app-effects';
import { AppShell } from '@/shell/app-shell';
import { colors, typography } from '@/theme';

export { ErrorBoundary } from '@/shell/route-error';

/**
 * Sheets and headers are the system's own Liquid Glass on iOS 26. A sheet gets
 * a transparent content background so the glass shows; elsewhere it is black.
 */
const SHEET = {
  contentStyle: { backgroundColor: GLASS_AVAILABLE ? 'transparent' : colors.fieldDeep },
  presentation: 'formSheet',
  sheetGrabberVisible: true,
} as const;

const GLASS_HEADER = Platform.OS === 'ios';

export default function RootLayout() {
  return (
    <AppShell>
      <AppEffects />
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: colors.fieldDeep },
          headerBackButtonDisplayMode: 'minimal',
          headerShadowVisible: false,
          headerStyle: GLASS_HEADER ? undefined : { backgroundColor: colors.fieldDeep },
          headerTintColor: colors.paper,
          headerTransparent: GLASS_HEADER,
          headerTitleStyle: { fontFamily: typography.editorialMedium, fontSize: 22 },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ animation: 'fade', headerShown: false }} />
        <Stack.Screen name="action" options={{ ...SHEET, sheetAllowedDetents: [0.86], title: 'Take it' }} />
        <Stack.Screen name="closeout" options={{ ...SHEET, sheetAllowedDetents: [0.72, 1], title: 'Check in' }} />
        <Stack.Screen name="note" options={{ ...SHEET, sheetAllowedDetents: [0.58, 1], title: 'Note' }} />
        <Stack.Screen name="settings" options={{ title: 'Settings' }} />
        <Stack.Screen name="code" options={{ title: 'The Code' }} />
      </Stack>
      <StatusBar style="light" />
    </AppShell>
  );
}

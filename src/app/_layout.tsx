import { StatusBar } from 'expo-status-bar';
import Stack from 'expo-router/stack';

import { AppShell } from '@/shell/app-shell';
import { colors, typography } from '@/theme';

export default function RootLayout() {
  return (
    <AppShell>
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: colors.fieldDeep },
          headerBackButtonDisplayMode: 'minimal',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: colors.fieldDeep },
          headerTintColor: colors.paper,
          headerTitleStyle: { fontFamily: typography.editorialMedium, fontSize: 22 },
        }}
      >
        <Stack.Screen name="(auth)" options={{ animation: 'fade', headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="onboarding"
          options={{ animation: 'fade', headerShown: false }}
        />
        <Stack.Screen
          name="action"
          options={{
            contentStyle: { backgroundColor: colors.fieldDeep },
            presentation: 'formSheet',
            sheetAllowedDetents: [0.86, 1],
            sheetGrabberVisible: true,
            title: 'The next action',
          }}
        />
        <Stack.Screen
          name="closeout"
          options={{
            contentStyle: { backgroundColor: colors.fieldDeep },
            presentation: 'formSheet',
            sheetAllowedDetents: [0.72, 1],
            sheetGrabberVisible: true,
            title: 'Closeout',
          }}
        />
        <Stack.Screen
          name="note"
          options={{
            contentStyle: { backgroundColor: colors.fieldDeep },
            presentation: 'formSheet',
            sheetAllowedDetents: [0.58, 1],
            sheetGrabberVisible: true,
            title: 'Note',
          }}
        />
      </Stack>
      <StatusBar style="light" />
    </AppShell>
  );
}

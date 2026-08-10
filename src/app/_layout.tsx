import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { AppShell } from '@/shell/app-shell';

export default function RootLayout() {
  return (
    <AppShell>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style="light" />
    </AppShell>
  );
}

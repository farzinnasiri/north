import type { PropsWithChildren } from 'react';
import Stack from 'expo-router/stack';

import { colors, typography } from '@/theme';

type NorthStackProps = PropsWithChildren<{
  headerShown?: boolean;
  title: string;
  routeName: string;
}>;

export function NorthStack({ children, headerShown = true, routeName, title }: NorthStackProps) {
  return (
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
      <Stack.Screen name={routeName} options={{ headerShown, title }} />
      {children}
    </Stack>
  );
}

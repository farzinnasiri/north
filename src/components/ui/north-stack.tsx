import type { PropsWithChildren } from 'react';
import Stack from 'expo-router/stack';

import { colors, typography } from '@/theme';

type NorthStackProps = PropsWithChildren<{
  title: string;
  routeName: string;
}>;

export function NorthStack({ children, routeName, title }: NorthStackProps) {
  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: colors.fieldDeep },
        headerBackButtonDisplayMode: 'minimal',
        headerShadowVisible: false,
        headerStyle: { backgroundColor: colors.fieldDeep },
        headerTintColor: colors.paper,
        headerTitleStyle: { fontFamily: typography.sansMedium, fontSize: 17 },
      }}
    >
      <Stack.Screen name={routeName} options={{ title }} />
      {children}
    </Stack>
  );
}

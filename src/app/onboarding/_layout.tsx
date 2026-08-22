import Stack from 'expo-router/stack';

import { colors } from '@/theme';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: colors.fieldDeep },
        headerShown: false,
      }}
    />
  );
}

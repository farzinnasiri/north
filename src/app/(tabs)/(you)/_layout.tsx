import Stack from 'expo-router/stack';

import { NorthStack } from '@/components/ui/north-stack';

export default function YouLayout() {
  return (
    <NorthStack routeName="you" title="You">
      <Stack.Screen name="settings" options={{ title: 'Settings' }} />
    </NorthStack>
  );
}

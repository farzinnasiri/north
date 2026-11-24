import { useEffect } from 'react';
import type { ErrorBoundaryProps } from 'expo-router';

import { NorthButton } from '@/components/ui/north-button';
import { NorthScreen } from '@/components/ui/north-screen';
import { NorthText } from '@/components/ui/north-text';

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  useEffect(() => { console.warn('North route failed', error); }, [error]);
  return (
    <NorthScreen>
      <NorthText>Something went wrong. Your Journey is saved on this phone.</NorthText>
      <NorthButton label="Try again" onPress={() => { void retry(); }} />
    </NorthScreen>
  );
}

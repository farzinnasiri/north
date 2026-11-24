import { router } from 'expo-router';
import { useEffect } from 'react';
import { AppState } from 'react-native';

import { useCatalogue } from '@/domains/content/store';
import { useJourney } from '@/domains/journey/store';
import { configureCheckIns, listenForCheckIns } from '@/platform/check-in';

/**
 * The two things North does in the background: it keeps the content
 * catalogue fresh, and it answers taps on the check-in notification.
 */
export function AppEffects() {
  useEffect(() => {
    const refresh = useCatalogue.getState().refresh;
    void refresh();
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') void refresh();
    });
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    configureCheckIns();
    return listenForCheckIns((response) => {
      const open = useJourney.getState().journey?.open;
      if (!open || open.instanceId !== response.instanceId) return;
      if (response.kind === 'answered') {
        useJourney.getState().checkIn({ instanceId: response.instanceId, outcome: response.outcome });
        router.navigate('/');
      } else {
        router.navigate('/closeout');
      }
    });
  }, []);

  return null;
}

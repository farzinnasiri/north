import { Redirect } from 'expo-router';
import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { useSignalTheme } from '@/components/ui/signal-theme';
import { useJourney } from '@/domains/journey/store';
import { colors } from '@/theme';

/**
 * Three tabs in the system tab bar, which is Liquid Glass on iOS 26. It gets
 * no background colour on purpose: any solid colour turns the glass off.
 * Before onboarding there is nothing to show, so the tabs send him there.
 */
export default function TabsLayout() {
  const hasJourney = useJourney((state) => state.journey !== null);
  const signal = useSignalTheme();
  if (!hasJourney) return <Redirect href="/onboarding" />;

  return (
    <NativeTabs
      iconColor={{ default: colors.slate, selected: signal.primary }}
      labelStyle={{ default: { color: colors.slate }, selected: { color: colors.paper } }}
      minimizeBehavior="never"
      tintColor={signal.primary}
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Today</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon md="explore" sf={{ default: 'safari', selected: 'safari.fill' }} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="log">
        <NativeTabs.Trigger.Label>Log</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon md="list" sf="list.bullet" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="you">
        <NativeTabs.Trigger.Label>You</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon md="person" sf={{ default: 'person', selected: 'person.fill' }} />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

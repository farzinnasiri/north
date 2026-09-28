import { Redirect } from 'expo-router';
import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { useSignalTheme } from '@/components/ui/signal-theme';
import { redirectFromTabs } from '@/domains/account/access';
import { useAccount } from '@/domains/account/store';
import { useJourney } from '@/domains/journey/store';
import { colors } from '@/theme';

export default function TabLayout() {
  const signal = useSignalTheme();
  const journey = useJourney((state) => state.journey);
  const personalized = useAccount((state) => state.personalized);
  const signedIn = useAccount((state) => state.signedIn);
  const redirect = redirectFromTabs({
    hasJourney: journey !== null,
    personalized,
    signedIn,
  });

  if (redirect) return <Redirect href={redirect} />;

  return (
    <NativeTabs
      backgroundColor={colors.fieldDeep}
      blurEffect="none"
      disableTransparentOnScrollEdge
      iconColor={{ default: colors.slate, selected: signal.primary }}
      indicatorColor={colors.fieldDeep}
      minimizeBehavior="onScrollDown"
      rippleColor={signal.muted}
    >
      <NativeTabs.Trigger accessibilityLabel="Home" name="(home)">
        <NativeTabs.Trigger.Icon sf={{ default: 'house', selected: 'house.fill' }} md="home" />
        <NativeTabs.Trigger.Label hidden>Home</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger accessibilityLabel="Direction" name="(direction)">
        <NativeTabs.Trigger.Icon sf={{ default: 'safari', selected: 'safari.fill' }} md="explore" />
        <NativeTabs.Trigger.Label hidden>Direction</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger accessibilityLabel="You" name="(you)">
        <NativeTabs.Trigger.Icon sf={{ default: 'person', selected: 'person.fill' }} md="person" />
        <NativeTabs.Trigger.Label hidden>You</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

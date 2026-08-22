import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { colors, typography } from '@/theme';

export default function TabLayout() {
  return (
    <NativeTabs
      backgroundColor={colors.field}
      blurEffect="none"
      disableIndicator
      disableTransparentOnScrollEdge
      iconColor={{ default: colors.slate, selected: colors.paper }}
      labelStyle={{
        default: { color: colors.slate, fontFamily: typography.sans, fontSize: 11 },
        selected: { color: colors.paper, fontFamily: typography.sansMedium, fontSize: 11 },
      }}
      minimizeBehavior="onScrollDown"
      shadowColor={colors.line}
    >
      <NativeTabs.Trigger name="(home)">
        <NativeTabs.Trigger.Icon sf={{ default: 'location', selected: 'location.fill' }} md="explore" />
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(bearing)">
        <NativeTabs.Trigger.Icon sf={{ default: 'map', selected: 'map.fill' }} md="route" />
        <NativeTabs.Trigger.Label>Bearing</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(you)">
        <NativeTabs.Trigger.Icon sf={{ default: 'person', selected: 'person.fill' }} md="person" />
        <NativeTabs.Trigger.Label>You</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

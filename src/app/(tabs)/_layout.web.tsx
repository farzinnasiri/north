import { useState } from 'react';
import { Link, Redirect, Slot, usePathname } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';

import { useSignalTheme } from '@/components/ui/signal-theme';
import { redirectFromTabs } from '@/domains/account/access';
import { useAccount } from '@/domains/account/store';
import { useJourney } from '@/domains/journey/store';
import { colors, motion, radii, spacing } from '@/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const TABS = [
  { href: '/', icon: 'now', label: 'Home', match: (path: string) => path === '/' },
  { href: '/direction', icon: 'direction', label: 'Direction', match: (path: string) => path.startsWith('/direction') },
  { href: '/you', icon: 'you', label: 'You', match: (path: string) => path.startsWith('/you') || path.startsWith('/settings') },
] as const;

/**
 * NativeTabs is authoritative on the shipping platforms. Web only needs a
 * faithful review surface: the same three stable destinations in an opaque
 * instrument dock, with no attempt to imitate system glass or tab physics.
 */
export default function WebTabLayout() {
  const path = usePathname();
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
    <View style={styles.shell}>
      <View style={styles.body}>
        <Slot />
      </View>
      <View style={styles.dock}>
        {TABS.map((tab) => (
          <TabLink active={tab.match(path)} href={tab.href} icon={tab.icon} key={tab.href} label={tab.label} />
        ))}
      </View>
    </View>
  );
}

type TabLinkProps = {
  active: boolean;
  href: '/' | '/direction' | '/you';
  icon: 'now' | 'direction' | 'you';
  label: string;
};

function TabLink({ active, href, icon, label }: TabLinkProps) {
  const reduceMotion = useReducedMotion();
  const signal = useSignalTheme();
  const [pressed, setPressed] = useState(false);
  const direction = icon === 'direction';
  const foreground = active
    ? direction ? signal.onPrimary : colors.paper
    : colors.slate;

  return (
    <Link asChild href={href}>
      <AnimatedPressable
        accessibilityLabel={active ? `${label}, current` : label}
        accessibilityRole="tab"
        accessibilityState={{ selected: active }}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        style={StyleSheet.flatten([
          styles.tab,
          direction ? styles.directionTab : styles.sideTab,
          direction
            ? active
              ? { backgroundColor: signal.primary, borderColor: signal.primary }
              : styles.directionInactive
            : active
              ? styles.sideActive
              : undefined,
          {
            opacity: pressed ? motion.pressOpacity : 1,
            transform: [{ scale: pressed && !reduceMotion ? motion.pressScale : 1 }],
            transitionDuration: pressed ? motion.instant : motion.quick,
            transitionProperty: ['backgroundColor', 'opacity', 'transform'],
            transitionTimingFunction: motion.easingStandard,
          },
        ])}
      >
        <TabMark color={foreground} kind={icon} />
      </AnimatedPressable>
    </Link>
  );
}

function TabMark({ color, kind }: { color: string; kind: TabLinkProps['icon'] }) {
  if (kind === 'now') {
    return (
      <Svg height={24} viewBox="0 0 24 24" width={24}>
        <Path
          d="M4.5 10.6L12 4.5L19.5 10.6V19.5H14.5V14.3H9.5V19.5H4.5Z"
          fill="none"
          stroke={color}
          strokeLinejoin="round"
          strokeWidth="1.65"
        />
      </Svg>
    );
  }

  if (kind === 'direction') {
    return (
      <Svg height={38} viewBox="0 0 24 24" width={38}>
        <Circle cx="12" cy="12" fill="none" r="9" stroke={color} strokeWidth="1.25" />
        <Path
          d="M16.25 7.75L13.8 13.8L7.75 16.25L10.2 10.2Z"
          fill="none"
          stroke={color}
          strokeLinejoin="round"
          strokeWidth="1.45"
        />
        <Circle cx="12" cy="12" fill={color} r="1.25" />
      </Svg>
    );
  }

  return (
    <Svg height={22} viewBox="0 0 24 24" width={22}>
      <Circle cx="12" cy="8" fill="none" r="3.2" stroke={color} strokeWidth="1.6" />
      <Path d="M5.5 19C6.2 15.5 8.4 13.8 12 13.8C15.6 13.8 17.8 15.5 18.5 19" fill="none" stroke={color} strokeLinecap="round" strokeWidth="1.6" />
    </Svg>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  dock: {
    alignItems: 'center',
    backgroundColor: colors.field,
    borderColor: colors.line,
    borderCurve: 'continuous',
    borderRadius: radii.full,
    borderWidth: 1,
    bottom: spacing.lg,
    flexDirection: 'row',
    height: 72,
    justifyContent: 'center',
    left: '50%',
    marginLeft: -126,
    paddingHorizontal: 9,
    position: 'absolute',
    width: 252,
  },
  shell: {
    backgroundColor: colors.fieldDeep,
    flex: 1,
  },
  tab: {
    alignItems: 'center',
    borderCurve: 'continuous',
    justifyContent: 'center',
  },
  directionInactive: {
    backgroundColor: colors.fieldRaised,
    borderColor: colors.line,
  },
  directionTab: {
    borderRadius: radii.full,
    borderWidth: 1,
    height: 88,
    marginHorizontal: spacing.xs,
    width: 88,
  },
  sideActive: {
    backgroundColor: colors.fieldRaised,
  },
  sideTab: {
    borderRadius: radii.full,
    height: 54,
    width: 64,
  },
});

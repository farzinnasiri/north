import { Link, Slot, usePathname } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { NorthText } from '@/components/ui/north-text';
import { colors, spacing } from '@/theme';

const TABS = [
  { href: '/', label: 'HOME', match: (path: string) => path === '/' },
  { href: '/bearing', label: 'BEARING', match: (path: string) => path.startsWith('/bearing') },
  { href: '/you', label: 'YOU', match: (path: string) => path.startsWith('/you') || path.startsWith('/settings') },
] as const;

/**
 * Web is a development preview, so it does not rebuild North's native tab bar
 * in JavaScript — but a preview you cannot navigate is not a preview. This is
 * a plain strip of links to the same three destinations, and it is the only
 * piece of chrome in the product that exists for developers rather than for
 * the person using it.
 */
export default function WebTabLayout() {
  const path = usePathname();

  return (
    <View style={styles.shell}>
      <View style={styles.body}>
        <Slot />
      </View>
      <View style={styles.bar}>
        {TABS.map((tab) => {
          const active = tab.match(path);
          return (
            <Link href={tab.href} key={tab.href} style={styles.tab}>
              <NorthText style={active ? styles.active : styles.inactive} variant="label">
                {tab.label}
              </NorthText>
            </Link>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  active: {
    color: colors.paper,
  },
  bar: {
    backgroundColor: colors.field,
    borderTopColor: colors.line,
    borderTopWidth: 1,
    flexDirection: 'row',
    paddingBottom: spacing.lg,
    paddingTop: spacing.md,
  },
  body: {
    flex: 1,
  },
  inactive: {
    color: colors.slate,
  },
  shell: {
    backgroundColor: colors.fieldDeep,
    flex: 1,
  },
  tab: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: spacing.sm,
    textAlign: 'center',
  },
});

import { FlatList, Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { NorthBackdrop } from '@/components/ui/north-backdrop';
import { NorthText } from '@/components/ui/north-text';
import { TAB_TOP_INSET } from '@/components/ui/tab-inset';
import { useSignalTheme } from '@/components/ui/signal-theme';
import type { ClosedAction } from '@/domains/actions/action';
import { outcomeLabel } from '@/domains/actions/action';
import { lineById } from '@/domains/content/catalogue';
import { useCatalogue } from '@/domains/content/store';
import { degreesTravelled, doneCount } from '@/domains/journey/journey';
import { useJourney } from '@/domains/journey/store';
import { colors, spacing, typography } from '@/theme';

/** Everything he has checked in, newest first, with the words each one came from. */
export function Log() {
  const journey = useJourney((state) => state.journey);
  const insets = useSafeAreaInsets();
  if (!journey) return null;

  const closed = [...journey.closed].sort((a, b) => b.closedAt - a.closedAt);
  const partly = journey.closed.filter((action) => action.outcome === 'partly').length;

  return (
    <View style={styles.screen}>
    <NorthBackdrop />
    <FlatList
      contentContainerStyle={[styles.listContent, { paddingTop: (Platform.OS === 'ios' ? 0 : insets.top) + TAB_TOP_INSET + spacing.lg }]}
      contentInsetAdjustmentBehavior="automatic"
      data={closed}
      keyExtractor={(action) => action.instanceId}
      ListEmptyComponent={<NorthText variant="small">Nothing checked in yet. Your first answer starts the log.</NorthText>}
      ListHeaderComponent={(
        <View style={styles.header}>
          <NorthText variant="label">LOG</NorthText>
          <View style={styles.stats}>
            <Stat label="MOVED" value={`${degreesTravelled(journey).toFixed(1)}°`} />
            <Stat label="DONE" value={`${doneCount(journey)}`} />
            <Stat label="PARTLY" value={`${partly}`} />
            <Stat label="NOW" value={`${journey.direction.toFixed(1)}°`} />
          </View>
        </View>
      )}
      renderItem={({ item }) => <LogRow action={item} />}
      style={styles.list}
    />
    </View>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <NorthText style={styles.statValue}>{value}</NorthText>
      <NorthText variant="label">{label}</NorthText>
    </View>
  );
}

function LogRow({ action }: { action: ClosedAction }) {
  const signal = useSignalTheme();
  const catalogue = useCatalogue((state) => state.catalogue);
  const line = lineById(catalogue, action.lineId);
  const date = new Date(action.closedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  const tint = action.outcome === 'done' ? signal.primary : action.outcome === 'partly' ? signal.light : colors.slate;
  return (
    <View style={styles.row}>
      <View style={styles.rowHead}>
        <View style={[styles.mark, { backgroundColor: tint }]} />
        <NorthText variant="label">{`${date} · ${outcomeLabel(action.outcome)} · ${action.earned > 0 ? '−' : ''}${action.earned.toFixed(2)}°`}</NorthText>
      </View>
      <NorthText selectable style={styles.action}>{action.action}</NorthText>
      {line ? <NorthText variant="label">{`${line.person} · ${line.source}`}</NorthText> : null}
      {action.note ? <NorthText selectable style={styles.note} variant="small">{action.note}</NorthText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  action: {
    color: colors.paper,
    fontFamily: typography.editorial,
    fontSize: 22,
    lineHeight: 24,
  },
  header: {
    gap: spacing.lg,
    paddingBottom: spacing.xl,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: spacing.xxxl,
    paddingHorizontal: spacing.screen,
  },
  mark: {
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  note: {
    borderLeftColor: colors.line,
    borderLeftWidth: 2,
    paddingLeft: spacing.md,
  },
  row: {
    borderTopColor: colors.lineSoft,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: spacing.sm,
    paddingVertical: spacing.lg,
  },
  rowHead: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  screen: {
    backgroundColor: colors.fieldDeep,
    flex: 1,
  },
  stat: {
    gap: spacing.xs,
  },
  statValue: {
    color: colors.paper,
    fontFamily: typography.monoMedium,
    fontSize: 22,
    fontVariant: ['tabular-nums'],
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

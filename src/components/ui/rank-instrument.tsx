import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { NorthText } from '@/components/ui/north-text';
import { selectionTick } from '@/platform/haptics';
import { colors, motion, spacing } from '@/theme';

const ROW_HEIGHT = 68;

type RankInstrumentProps = {
  items: readonly string[];
  onChange: (items: string[]) => void;
};

type RankRowProps = {
  index: number;
  item: string;
  move: (from: number, places: number) => void;
};

function RankRow({ index, item, move }: RankRowProps) {
  const offset = useSharedValue(0);
  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      offset.value = event.translationY;
    })
    .onEnd((event) => {
      const places = Math.round(event.translationY / ROW_HEIGHT);
      offset.value = withTiming(0, { duration: motion.quick });
      if (places !== 0) {
        move(index, places);
      }
    })
    .runOnJS(true);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ translateY: offset.value }] }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        accessibilityActions={[{ name: 'decrement', label: 'Move up' }, { name: 'increment', label: 'Move down' }]}
        accessibilityHint="Drag vertically to change its position."
        accessibilityLabel={`${index + 1}. ${item}`}
        accessibilityRole="adjustable"
        onAccessibilityAction={(event) => {
          if (event.nativeEvent.actionName === 'decrement') move(index, -1);
          if (event.nativeEvent.actionName === 'increment') move(index, 1);
        }}
        style={[styles.row, animatedStyle]}
      >
        <NorthText style={styles.number} variant="data">
          {index + 1}
        </NorthText>
        <NorthText style={styles.item}>{item}</NorthText>
        <View style={styles.handle}>
          <View style={styles.handleBar} />
          <View style={styles.handleBar} />
          <View style={styles.handleBar} />
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

export function RankInstrument({ items, onChange }: RankInstrumentProps) {
  function move(from: number, places: number) {
    const to = Math.min(items.length - 1, Math.max(0, from + places));
    if (from === to) return;
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    void selectionTick();
    onChange(next);
  }

  return (
    <View style={styles.list}>
      {items.map((item, index) => (
        <RankRow index={index} item={item} key={item} move={move} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  handle: {
    gap: 3,
    paddingLeft: spacing.md,
  },
  handleBar: {
    backgroundColor: colors.line,
    height: 1,
    width: 16,
  },
  item: {
    color: colors.paper,
    flex: 1,
    minWidth: 0,
  },
  list: {
    borderTopColor: colors.lineSoft,
    borderTopWidth: 1,
    minWidth: 0,
    width: '100%',
  },
  number: {
    color: colors.brass,
    width: 32,
  },
  row: {
    alignItems: 'center',
    borderBottomColor: colors.lineSoft,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    minHeight: 64,
  },
});

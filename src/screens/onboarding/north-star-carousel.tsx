import { useMemo, useRef, useState } from 'react';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';

import { NorthText } from '@/components/ui/north-text';
import { NorthStarPortrait } from '@/domains/onboarding/ui/north-star-portrait';
import { NORTH_STAR_OPTIONS } from '@/domains/onboarding/onboarding';
import type { NorthStarType } from '@/domains/onboarding/onboarding';
import { selectionTick } from '@/platform/haptics';
import { colors, radii, spacing } from '@/theme';

const CARD_WIDTH = 252;
const CARD_GAP = spacing.md;
const SNAP = CARD_WIDTH + CARD_GAP;

type NorthStarOption = (typeof NORTH_STAR_OPTIONS)[number];

type ArchetypeCardProps = {
  index: number;
  item: NorthStarOption;
  onPress: () => void;
  rank: number;
  scrollX: SharedValue<number>;
  selected: boolean;
};

function ArchetypeCard({
  index,
  item,
  onPress,
  rank,
  scrollX,
  selected,
}: ArchetypeCardProps) {
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollX.value,
      [(index - 1) * SNAP, index * SNAP, (index + 1) * SNAP],
      [0.56, 1, 0.56],
      Extrapolation.CLAMP,
    ),
    transform: [{
      scale: interpolate(
        scrollX.value,
        [(index - 1) * SNAP, index * SNAP, (index + 1) * SNAP],
        [0.86, 1, 0.86],
        Extrapolation.CLAMP,
      ),
    }],
  }));

  return (
    <Animated.View style={[styles.cardSlot, animatedStyle]}>
      {rank <= 3 ? (
        <View
          style={[
            styles.recommendation,
            rank === 1
              ? styles.recommendationOne
              : rank === 2
                ? styles.recommendationTwo
                : styles.recommendationThree,
          ]}
        >
          <NorthText
            style={[styles.recommendationText, rank === 3 && styles.recommendationTextDark]}
            variant="label"
          >
            SUGGESTION {rank}
          </NorthText>
        </View>
      ) : (
        <View style={styles.recommendationSpacer} />
      )}
      <Pressable
        accessibilityLabel={`${item.label}. ${rank <= 3 ? `Suggestion ${rank}.` : 'Available option.'} ${item.description}`}
        accessibilityRole="radio"
        accessibilityState={{ checked: selected }}
        onPress={onPress}
        style={({ pressed }) => [
          styles.card,
          selected && styles.cardSelected,
          pressed && styles.cardPressed,
        ]}
      >
        <NorthStarPortrait contentFit="contain" star={item.value} style={styles.portrait} />
        <View style={styles.cardCopy}>
          <NorthText style={styles.cardTitle} variant="heading">
            {item.label}
          </NorthText>
          <NorthText style={styles.cardDescription} variant="small">
            {item.description}
          </NorthText>
        </View>
      </Pressable>
    </Animated.View>
  );
}

type NorthStarCarouselProps = {
  onChoose: (star: NorthStarType) => void;
  ranked: readonly NorthStarType[];
  value: NorthStarType;
};

/**
 * The top suggestion starts first, followed by suggestions two and three. The
 * remaining five are choices, but are deliberately not marked as recommended.
 */
export function NorthStarCarousel({ onChoose, ranked, value }: NorthStarCarouselProps) {
  const list = useRef<FlatList<NorthStarOption>>(null);
  const [width, setWidth] = useState(360);
  const scrollX = useSharedValue(0);
  const displayOrder = useMemo(() => {
    return ranked.map((type) => NORTH_STAR_OPTIONS.find((option) => option.value === type)!);
  }, [ranked]);
  const selectedIndex = Math.max(0, displayOrder.findIndex((option) => option.value === value));
  const sidePadding = Math.max(0, (width - CARD_WIDTH) / 2);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  function chooseAtOffset(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const index = Math.max(
      0,
      Math.min(displayOrder.length - 1, Math.round(event.nativeEvent.contentOffset.x / SNAP)),
    );
    const next = displayOrder[index]?.value;
    if (next && next !== value) {
      void selectionTick();
      onChoose(next);
    }
  }

  function choose(index: number, type: NorthStarType) {
    void selectionTick();
    onChoose(type);
    list.current?.scrollToOffset({ animated: true, offset: index * SNAP });
  }

  return (
    <View
      onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
      style={styles.carousel}
    >
      <Animated.FlatList
        contentContainerStyle={{ paddingHorizontal: sidePadding }}
        data={displayOrder}
        decelerationRate="fast"
        disableIntervalMomentum
        getItemLayout={(_, index) => ({ index, length: SNAP, offset: SNAP * index })}
        horizontal
        initialScrollIndex={selectedIndex}
        keyExtractor={(item) => item.value}
        onMomentumScrollEnd={chooseAtOffset}
        onScroll={onScroll}
        onScrollEndDrag={chooseAtOffset}
        ref={list}
        renderItem={({ index, item }) => (
          <ArchetypeCard
            index={index}
            item={item}
            onPress={() => choose(index, item.value)}
            rank={ranked.indexOf(item.value) + 1}
            scrollX={scrollX}
            selected={item.value === value}
          />
        )}
        showsHorizontalScrollIndicator={false}
        snapToInterval={SNAP}
      />
      <NorthText style={styles.hint} variant="small">
        Swipe to compare. Stop on the one that feels right.
      </NorthText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.field,
    borderColor: colors.lineSoft,
    borderCurve: 'continuous',
    borderRadius: radii.card,
    borderWidth: 1,
    flex: 1,
    overflow: 'hidden',
  },
  cardCopy: {
    gap: spacing.xs,
    minHeight: 94,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  cardDescription: {
    color: colors.ash,
  },
  cardPressed: {
    opacity: 0.9,
  },
  cardSelected: {
    backgroundColor: colors.fieldRaised,
    borderColor: colors.line,
  },
  cardSlot: {
    height: 346,
    marginRight: CARD_GAP,
    width: CARD_WIDTH,
  },
  cardTitle: {
    color: colors.paper,
  },
  carousel: {
    marginHorizontal: -spacing.screen,
  },
  hint: {
    color: colors.slate,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  portrait: {
    alignSelf: 'center',
    height: 216,
    width: 236,
  },
  recommendation: {
    alignItems: 'center',
    borderCurve: 'continuous',
    borderRadius: radii.control,
    height: 24,
    justifyContent: 'center',
    marginBottom: spacing.sm,
    marginHorizontal: spacing.lg,
  },
  recommendationOne: {
    backgroundColor: colors.brassDim,
  },
  recommendationSpacer: {
    height: 32,
  },
  recommendationText: {
    color: colors.paper,
  },
  recommendationTextDark: {
    color: colors.fieldDeep,
  },
  recommendationThree: {
    backgroundColor: colors.slate,
  },
  recommendationTwo: {
    backgroundColor: colors.meridian,
  },
});

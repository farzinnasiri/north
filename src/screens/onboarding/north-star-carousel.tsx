import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { cancelAnimation, Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { NorthText } from '@/components/ui/north-text';
import { NorthStarPortrait } from '@/domains/onboarding/ui/north-star-portrait';
import { NORTH_STAR_OPTIONS } from '@/domains/onboarding/onboarding';
import type { NorthStarType } from '@/domains/onboarding/onboarding';
import { selectionTick } from '@/platform/haptics';
import { colors, motion, radii, spacing } from '@/theme';

function DeckCard({ star, index, active, position, width, reduced }: {
  star: NorthStarType;
  index: number;
  active: boolean;
  position: SharedValue<number>;
  width: number;
  reduced: boolean;
}) {
  const item = NORTH_STAR_OPTIONS.find((option) => option.value === star)!;
  const animatedStyle = useAnimatedStyle(() => {
    const distance = index - position.get();
    const depth = Math.abs(distance);
    return {
      opacity: reduced ? (active ? 1 : 0) : Math.max(0, 1 - Math.max(0, depth - 1)),
      zIndex: 100 - Math.round(depth * 10),
      transform: reduced ? [] : [
        { translateX: distance * 28 },
        { translateY: Math.min(depth, 2) * 10 },
        { rotate: `${distance * 5}deg` },
        { scale: Math.max(0.9, 1 - depth * 0.05) },
      ],
    };
  });

  return (
    <Animated.View accessibilityElementsHidden={!active}
      importantForAccessibility={active ? 'auto' : 'no-hide-descendants'}
      pointerEvents="none" style={[styles.card, { width }, animatedStyle]}>
      <NorthStarPortrait contentFit="contain" star={star} style={styles.portrait} />
      <View style={styles.copy}>
        <NorthText variant="heading">{item.label}</NorthText>
        <NorthText style={styles.description} variant="small">{item.description}</NorthText>
      </View>
    </Animated.View>
  );
}

export function NorthStarCarousel({ onView, ranked, value }: {
  onView: (star: NorthStarType) => void;
  ranked: readonly NorthStarType[];
  value: NorthStarType;
}) {
  const [width, setWidth] = useState(360);
  const reduced = useReducedMotion();
  const index = Math.max(0, ranked.indexOf(value));
  const position = useSharedValue(index);
  const start = useSharedValue(index);
  const cardWidth = Math.min(300, width - 88);

  useEffect(() => {
    position.set(withTiming(index, { duration: reduced ? 0 : motion.settle, easing: Easing.bezier(0.23, 1, 0.32, 1) }));
  }, [index, position, reduced]);

  function browse(next: number) {
    const star = ranked[next];
    if (!star || star === value) return;
    void selectionTick();
    onView(star);
  }

  const pan = Gesture.Pan()
    .activeOffsetX([-12, 12])
    .failOffsetY([-16, 16])
    .onStart(() => {
      cancelAnimation(position);
      start.set(position.get());
    })
    .onUpdate((event) => {
      const next = start.get() - event.translationX / cardWidth;
      const bounded = Math.max(0, Math.min(ranked.length - 1, next));
      position.set(reduced ? index : bounded + (next - bounded) * 0.15);
    })
    .onEnd((event) => {
      const direction = event.translationX < 0 ? 1 : -1;
      const flick = Math.abs(event.velocityX) > 450;
      const moved = Math.abs(event.translationX) > cardWidth * 0.2;
      const next = Math.max(0, Math.min(ranked.length - 1,
        index + (flick ? (event.velocityX < 0 ? 1 : -1) : moved ? direction : 0)));
      position.set(withTiming(next, { duration: reduced ? 0 : motion.settle, easing: Easing.bezier(0.23, 1, 0.32, 1) }));
      scheduleOnRN(browse, next);
    })
    .onFinalize((_event, success) => {
      if (!success) position.set(withTiming(index, { duration: reduced ? 0 : motion.settle }));
    });

  return (
    <View onLayout={(event) => setWidth(event.nativeEvent.layout.width)} style={styles.carousel}>
      <GestureDetector gesture={pan}>
        <View style={styles.deck}>
          {ranked.map((star, cardIndex) => (
            <DeckCard key={star} star={star} index={cardIndex} active={index === cardIndex}
              position={position} width={cardWidth} reduced={reduced} />
          ))}
        </View>
      </GestureDetector>
      <View style={[styles.navigation, { width: cardWidth }]}>
        <Pressable accessibilityRole="button" accessibilityLabel="Previous" disabled={index === 0}
          onPress={() => browse(index - 1)} style={({ pressed }) => [styles.arrow, index === 0 && styles.disabled, pressed && styles.pressed]}>
          <NorthText>←</NorthText>
        </Pressable>
        <NorthText accessibilityLiveRegion="polite" style={styles.position} variant="label">{index + 1} / {ranked.length}</NorthText>
        <Pressable accessibilityRole="button" accessibilityLabel="Next" disabled={index === ranked.length - 1}
          onPress={() => browse(index + 1)} style={({ pressed }) => [styles.arrow, index === ranked.length - 1 && styles.disabled, pressed && styles.pressed]}>
          <NorthText>→</NorthText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  carousel: { alignItems: 'center', marginHorizontal: -spacing.screen },
  deck: { alignItems: 'center', height: 358, width: '100%', marginTop: spacing.md },
  card: { position: 'absolute', backgroundColor: colors.field, borderColor: colors.lineSoft, borderWidth: 1, borderRadius: radii.card, overflow: 'hidden' },
  portrait: { height: 216, width: '100%' },
  copy: { gap: spacing.xs, padding: spacing.md, minHeight: 114 },
  description: { color: colors.ash },
  navigation: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  arrow: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: radii.control, borderWidth: 1, borderColor: colors.lineSoft },
  disabled: { opacity: 0.25 },
  pressed: { opacity: motion.pressOpacity },
  position: { color: colors.ash },
});

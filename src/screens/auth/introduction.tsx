import { Link } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { NorthButton } from '@/components/ui/north-button';
import { NorthScreen } from '@/components/ui/north-screen';
import { NorthText } from '@/components/ui/north-text';
import { Reveal } from '@/components/ui/reveal';
import { useSignalTheme } from '@/components/ui/signal-theme';
import type { MascotScene } from '@/domains/mascot/mascot';
import { Mascot } from '@/domains/mascot/ui/mascot';
import { colors, motion, radii, spacing, typography } from '@/theme';

const INTRODUCTION_FRAMES = [
  {
    id: 'rejection',
    label: 'Recognize this?',
  },
  {
    id: 'manual',
    label: 'Everyone has an opinion about the man you should be.',
  },
  {
    id: 'choice',
    label: 'You still decide who you become.',
  },
  {
    id: 'action',
    label: 'North gives you one Action. You decide what it means for you.',
  },
  {
    id: 'report',
    label: "Close it when it's done, then take the next one.",
  },
  {
    id: 'change',
    label: 'After 30 Actions, look at what changed.',
  },
] as const;

const LAST_FRAME_INDEX = INTRODUCTION_FRAMES.length - 1;

const BACKDROP_FRAMES = [
  { rotate: '-8deg', scale: 1.08, x: 0.46, y: -0.14 },
  { rotate: '10deg', scale: 0.8, x: -0.52, y: 0.04 },
  { rotate: '-5deg', scale: 0.64, x: 0.38, y: 0.1 },
  { rotate: '9deg', scale: 0.92, x: -0.44, y: 0.3 },
  { rotate: '-7deg', scale: 0.72, x: 0.48, y: 0.38 },
  { rotate: '0deg', scale: 0.52, x: 0.06, y: -0.04 },
] as const;

const ACTION_SCENE: MascotScene = {
  expression: 'focused',
  rotations: {
    cardinals: { angle: 0 },
    face: { angle: 0 },
    outer: { angle: 0 },
  },
};

const AFTER_SCENE: MascotScene = {
  completion: 1,
  expression: 'settled',
  rotations: {
    cardinals: { angle: 0 },
    face: { angle: 0 },
    outer: { angle: 0 },
  },
};

const AFTER_POINTER_SCENE: MascotScene = {
  ...AFTER_SCENE,
  expression: 'pointer',
  transition: { duration: 'settle', expression: 'morph' },
};

const AFTER_TURNED_SCENE: MascotScene = {
  ...AFTER_POINTER_SCENE,
  rotations: {
    ...AFTER_POINTER_SCENE.rotations,
    face: { angle: 16, duration: 'settle' },
  },
};

export function Introduction() {
  const { height, width } = useWindowDimensions();
  const reduceMotion = useReducedMotion();
  const compact = height < 740 || width < 360;
  const [activeIndex, setActiveIndex] = useState(0);
  const dragX = useSharedValue(0);
  const activeFrame = INTRODUCTION_FRAMES[activeIndex];

  const moveFrame = useCallback((difference: number) => {
    setActiveIndex((index) => Math.max(
      0,
      Math.min(index + difference, LAST_FRAME_INDEX),
    ));
  }, []);

  const swipe = Gesture.Pan()
    .activeOffsetX([-14, 14])
    .failOffsetY([-12, 12])
    .onUpdate((event) => {
      const againstFirstEdge = activeIndex === 0 && event.translationX > 0;
      const againstLastEdge = activeIndex === LAST_FRAME_INDEX && event.translationX < 0;
      const resistance = againstFirstEdge || againstLastEdge ? 0.16 : 0.72;
      dragX.set(reduceMotion ? 0 : event.translationX * resistance);
    })
    .onEnd((event) => {
      const difference = event.translationX < 0 ? 1 : -1;
      const canMove = activeIndex + difference >= 0 && activeIndex + difference <= LAST_FRAME_INDEX;
      const committed = Math.abs(event.translationX) >= 48 || Math.abs(event.velocityX) >= 520;

      if (committed && canMove) scheduleOnRN(moveFrame, difference);
      dragX.set(withTiming(0, { duration: reduceMotion ? 0 : motion.quick }));
    });

  const dragStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: dragX.get() }],
  }));

  return (
    <NorthScreen
      backdrop={(
        <IntroductionBackdrop
          activeIndex={activeIndex}
          height={height}
          reduceMotion={reduceMotion}
          width={width}
        />
      )}
      bounces={false}
      contentInsetAdjustmentBehavior="always"
      contentStyle={[styles.screen, compact && styles.screenCompact]}
    >
      <GestureDetector gesture={swipe}>
        <Animated.View
          accessibilityActions={[
            { label: 'Previous step', name: 'decrement' },
            { label: 'Next step', name: 'increment' },
          ]}
          accessibilityHint="Swipe left or right to move through the introduction."
          accessibilityLabel={activeFrame.label}
          accessibilityRole="adjustable"
          onAccessibilityAction={(event) => {
            const difference = event.nativeEvent.actionName === 'increment' ? 1 : -1;
            moveFrame(difference);
          }}
          style={[styles.carousel, dragStyle]}
        >
          <View key={activeFrame.id} style={[styles.story, compact && styles.storyCompact]}>
            <View
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
              style={[styles.illustration, compact && styles.illustrationCompact]}
            >
              <FeatureStory compact={compact} index={activeIndex} />
            </View>

            <Reveal delay={motion.instant} travel={8}>
              <StoryCopy index={activeIndex} />
            </Reveal>
          </View>
        </Animated.View>
      </GestureDetector>

      <View style={styles.controls}>
        <View style={styles.pager}>
          <PagerArrow
            disabled={activeIndex === 0}
            direction="previous"
            onPress={() => moveFrame(-1)}
          />

          <View style={styles.pageStatus}>
            <View
              accessibilityLabel={`Step ${activeIndex + 1} of ${INTRODUCTION_FRAMES.length}`}
              style={styles.progress}
            >
              {INTRODUCTION_FRAMES.map((frame, index) => (
                <View
                  key={frame.id}
                  style={[
                    styles.progressMark,
                    activeIndex === index
                      ? styles.progressMarkActive
                      : styles.progressMarkInactive,
                  ]}
                />
              ))}
            </View>
            <NorthText
              accessibilityLabel={`Step ${activeIndex + 1} of ${INTRODUCTION_FRAMES.length}`}
              style={styles.count}
              variant="label"
            >
              {String(activeIndex + 1).padStart(2, '0')} / {String(INTRODUCTION_FRAMES.length).padStart(2, '0')}
            </NorthText>
          </View>

          <PagerArrow
            disabled={activeIndex === LAST_FRAME_INDEX}
            direction="next"
            onPress={() => moveFrame(1)}
          />
        </View>

        <Reveal
          enabled={activeIndex === LAST_FRAME_INDEX}
          key={activeIndex === LAST_FRAME_INDEX ? 'final-action' : 'resting-action'}
          travel={12}
        >
          <Link asChild href="/onboarding">
            <NorthButton label="Start" style={styles.primaryAction} />
          </Link>
        </Reveal>
        <Link asChild href="/welcome">
          <NorthButton label="Back" style={styles.backAction} tone="quiet" />
        </Link>
      </View>
    </NorthScreen>
  );
}

function IntroductionBackdrop({
  activeIndex,
  height,
  reduceMotion,
  width,
}: {
  activeIndex: number;
  height: number;
  reduceMotion: boolean;
  width: number;
}) {
  const signal = useSignalTheme();
  const frame = BACKDROP_FRAMES[activeIndex];

  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.backdrop]}>
      <Animated.View
        style={[
          styles.backdropShape,
          {
            backgroundColor: signal.muted,
            height: width * 0.92,
            left: -width * 0.16,
            top: height * 0.05,
            transform: [
              { translateX: width * frame.x },
              { translateY: height * frame.y },
              { rotate: frame.rotate },
              { scale: frame.scale },
            ],
            transitionDuration: reduceMotion ? 0 : motion.settle,
          },
        ]}
      />
    </View>
  );
}

function PagerArrow({
  direction,
  disabled,
  onPress,
}: {
  direction: 'next' | 'previous';
  disabled: boolean;
  onPress: () => void;
}) {
  const label = direction === 'previous'
    ? 'Show previous introduction step'
    : 'Show next introduction step';

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.pagerArrow,
        disabled && styles.pagerArrowDisabled,
        pressed && !disabled && styles.pagerArrowPressed,
      ]}
    >
      <NorthText style={styles.pagerArrowText} variant="data">
        {direction === 'previous' ? '←' : '→'}
      </NorthText>
    </Pressable>
  );
}

function StoryCopy({ index }: { index: number }) {
  if (index === 0) {
    return (
      <NorthText accessibilityLabel="Recognize this?" style={styles.storySentence}>
        Recognize <Text style={styles.emphasis}>this?</Text>
      </NorthText>
    );
  }

  if (index === 1) {
    return (
      <NorthText
        accessibilityLabel="Everyone has an opinion about the man you should be."
        style={styles.storySentence}
      >
        Everyone has an opinion about{' '}
        <Text style={styles.emphasis}>the man you should be.</Text>
      </NorthText>
    );
  }

  if (index === 2) {
    return (
      <NorthText
        accessibilityLabel="You still decide who you become."
        style={styles.storySentence}
      >
        You still decide <Text style={styles.emphasis}>who you become.</Text>
      </NorthText>
    );
  }

  if (index === 4) {
    return (
      <NorthText
        accessibilityLabel="Close it when it's done, then take the next one."
        style={styles.storySentence}
      >
        {"Close it when it's done, then "}<Text style={styles.emphasis}>take the next one.</Text>
      </NorthText>
    );
  }

  if (index === 5) {
    return (
      <NorthText
        accessibilityLabel="After 30 Actions, look at what changed."
        style={styles.storySentence}
      >
        After 30 Actions, <Text style={styles.emphasis}>look at what changed.</Text>
      </NorthText>
    );
  }

  return (
    <NorthText
      accessibilityLabel="North gives you one Action. You decide what it means for you."
      style={styles.storySentence}
    >
      North gives you one Action.{' '}
      <Text style={styles.emphasis}>You decide what it means for you.</Text>
    </NorthText>
  );
}

function FeatureStory({ compact, index }: { compact: boolean; index: number }) {
  if (index === 0) return <RejectionStory />;
  if (index === 1) return <ManualStory />;
  if (index === 2) return <OpenManualStory />;
  if (index === 4) return <ActionLoopStory />;
  if (index === 5) return <ChangedStory compact={compact} />;
  return <PersonalActionStory compact={compact} />;
}

const REJECTION_LINES = [
  "You're such a good friend.",
  "I just don't see you that way.",
] as const;

function RejectionStory() {
  return (
    <View style={styles.messageStory}>
      <Reveal style={[styles.messageBubble, styles.messageBubbleBoy]} travel={6}>
        <NorthText style={styles.messageText}>I like you.</NorthText>
      </Reveal>
      <View style={styles.replyThread}>
        <Reveal delay={motion.instant} style={styles.girlAvatar} travel={6}>
          <Text style={styles.girlEmoji}>👩</Text>
        </Reveal>
        <View style={styles.replyStack}>
          {REJECTION_LINES.map((line, index) => (
            <Reveal
              delay={(index + 1) * motion.instant}
              key={line}
              style={styles.messageBubble}
              travel={6}
            >
              <NorthText style={styles.messageText}>{line}</NorthText>
            </Reveal>
          ))}
        </View>
      </View>
    </View>
  );
}

function ManualStory() {
  return (
    <Reveal style={styles.manual} travel={8}>
      <View style={styles.manualSpine} />
      <NorthText style={styles.manualTitle} variant="data">THE MANUAL</NorthText>
      <View style={styles.manualRule} />
      <View style={[styles.manualRule, styles.manualRuleShort]} />
      <NorthText style={styles.manualMissing} variant="label">NOT INCLUDED</NorthText>
    </Reveal>
  );
}

function OpenManualStory() {
  return (
    <View style={styles.openManual}>
      <Reveal style={[styles.manualPage, styles.manualPageLeft]} travel={8}>
        <View style={styles.openManualRules}>
          <View style={styles.openManualRule} />
          <View style={[styles.openManualRule, styles.openManualRuleShort]} />
          <View style={styles.openManualRule} />
        </View>
      </Reveal>
      <Reveal delay={motion.instant} style={[styles.manualPage, styles.manualPageRight]} travel={8}>
        <NorthText style={styles.openManualTitle} variant="data">YOURS TO WRITE</NorthText>
        <View style={styles.openManualSignal} />
        <View style={styles.openManualRules}>
          <View style={styles.openManualRule} />
          <View style={[styles.openManualRule, styles.openManualRuleShort]} />
        </View>
      </Reveal>
    </View>
  );
}

function PersonalActionStory({ compact }: { compact: boolean }) {
  return (
    <View style={styles.personalActionStory}>
      <Reveal travel={8}>
        <Mascot scene={ACTION_SCENE} size={compact ? 118 : 150} />
      </Reveal>
      <Reveal delay={motion.instant} style={styles.actionCard} travel={8}>
        <View style={styles.cardMeta}>
          <NorthText variant="label">PICKED FOR YOU</NorthText>
          <NorthText variant="label">01</NorthText>
        </View>
        <NorthText style={styles.actionExample} variant="data">
          RECONNECT WITH SOMEONE
        </NorthText>
      </Reveal>
    </View>
  );
}

function ActionLoopStory() {
  return (
    <View style={styles.actionLoopStory}>
      <Reveal style={[styles.loopCard, styles.loopCardDone]} travel={8}>
        <NorthText variant="label">ACTION 01</NorthText>
        <NorthText style={styles.doneStatus} variant="data">DONE</NorthText>
      </Reveal>
      <Reveal delay={motion.instant} style={styles.loopConnector} travel={6} />
      <Reveal delay={motion.instant * 2} style={styles.loopCard} travel={8}>
        <NorthText variant="label">ACTION 02</NorthText>
        <NorthText style={styles.readyStatus} variant="data">READY</NorthText>
      </Reveal>
    </View>
  );
}

function ChangedStory({ compact }: { compact: boolean }) {
  const reduceMotion = useReducedMotion();
  const [mascotPhase, setMascotPhase] = useState<'eyes' | 'pointer' | 'turned'>('eyes');

  useEffect(() => {
    if (reduceMotion) return;

    let timer: ReturnType<typeof setTimeout>;
    const play = () => {
      timer = setTimeout(() => {
        setMascotPhase('pointer');
        timer = setTimeout(() => {
          setMascotPhase('turned');
          timer = setTimeout(() => {
            setMascotPhase('eyes');
            timer = setTimeout(play, 1000);
          }, motion.arrival);
        }, motion.settle + motion.instant);
      }, motion.arrival);
    };

    play();
    return () => clearTimeout(timer);
  }, [reduceMotion]);

  const mascotScene = reduceMotion
    ? AFTER_SCENE
    : mascotPhase === 'pointer'
    ? AFTER_POINTER_SCENE
    : mascotPhase === 'turned'
      ? AFTER_TURNED_SCENE
      : AFTER_SCENE;

  return (
    <View style={styles.changedStory}>
      <Reveal travel={8}>
        <Mascot scene={mascotScene} size={compact ? 132 : 168} />
      </Reveal>
      <View style={styles.completedStack}>
        <Reveal delay={motion.instant} style={[styles.completedCard, styles.completedCardBack]} travel={6} />
        <Reveal delay={motion.instant * 2} style={[styles.completedCard, styles.completedCardMiddle]} travel={6} />
        <Reveal delay={motion.instant * 3} style={[styles.completedCard, styles.completedCardFront]} travel={6}>
          <NorthText variant="label">ACTION 30</NorthText>
          <NorthText style={styles.completedStatus} variant="data">DONE</NorthText>
        </Reveal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actionCard: {
    backgroundColor: colors.fieldRaised,
    borderColor: colors.line,
    borderCurve: 'continuous',
    borderRadius: radii.card,
    borderWidth: 1,
    gap: spacing.lg,
    maxWidth: 294,
    padding: spacing.xl,
    width: '100%',
  },
  actionExample: {
    color: colors.paper,
  },
  actionLoopStory: {
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 294,
    width: '100%',
  },
  backAction: {
    minHeight: 44,
  },
  backdrop: {
    backgroundColor: colors.fieldDeep,
  },
  backdropShape: {
    borderCurve: 'continuous',
    borderRadius: radii.device * 3,
    position: 'absolute',
    transitionProperty: 'transform',
    transitionTimingFunction: motion.easingStandard,
    width: '120%',
  },
  cardMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  carousel: {
    flex: 1,
    minHeight: 330,
  },
  changedStory: {
    alignItems: 'center',
    gap: spacing.xl,
    justifyContent: 'center',
    maxWidth: 294,
    width: '100%',
  },
  completedCard: {
    backgroundColor: colors.fieldRaised,
    borderColor: colors.line,
    borderCurve: 'continuous',
    borderRadius: radii.control,
    borderWidth: 1,
    height: 72,
    left: 0,
    position: 'absolute',
    right: 0,
  },
  completedCardBack: {
    opacity: 0.32,
    top: 0,
    transform: [{ scaleX: 0.88 }],
  },
  completedCardFront: {
    alignItems: 'center',
    borderColor: colors.paper,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    top: spacing.lg,
  },
  completedCardMiddle: {
    opacity: 0.62,
    top: spacing.sm,
    transform: [{ scaleX: 0.94 }],
  },
  completedStack: {
    height: 88,
    position: 'relative',
    width: '100%',
  },
  completedStatus: {
    color: colors.paper,
  },
  controls: {
    gap: spacing.xs,
  },
  count: {
    color: colors.paper,
    textAlign: 'center',
  },
  doneStatus: {
    color: colors.slate,
    textDecorationLine: 'line-through',
  },
  emphasis: {
    color: colors.paper,
    fontFamily: typography.sansMedium,
  },
  girlAvatar: {
    alignItems: 'center',
    backgroundColor: colors.fieldRaised,
    borderColor: colors.line,
    borderRadius: radii.full,
    borderWidth: 1,
    height: 38,
    justifyContent: 'center',
    marginTop: spacing.xs,
    width: 38,
  },
  girlEmoji: {
    fontSize: 22,
    lineHeight: 27,
  },
  illustration: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    maxHeight: 460,
    minHeight: 250,
    width: '100%',
  },
  illustrationCompact: {
    minHeight: 210,
  },
  loopCard: {
    alignItems: 'center',
    backgroundColor: colors.fieldRaised,
    borderColor: colors.paper,
    borderCurve: 'continuous',
    borderRadius: radii.control,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 82,
    paddingHorizontal: spacing.xl,
    width: '100%',
  },
  loopCardDone: {
    borderColor: colors.lineSoft,
    opacity: 0.58,
  },
  loopConnector: {
    backgroundColor: colors.line,
    height: spacing.xxl,
    width: 1,
  },
  manual: {
    backgroundColor: colors.fieldRaised,
    borderColor: colors.line,
    borderCurve: 'continuous',
    borderRadius: radii.control,
    borderWidth: 1,
    gap: spacing.lg,
    minHeight: 220,
    overflow: 'hidden',
    padding: spacing.xxl,
    position: 'relative',
    width: 210,
  },
  manualMissing: {
    color: colors.ash,
    marginTop: 'auto',
  },
  manualRule: {
    backgroundColor: colors.lineSoft,
    height: 2,
    width: '100%',
  },
  manualRuleShort: {
    width: '62%',
  },
  manualSpine: {
    backgroundColor: colors.brass,
    bottom: 0,
    left: 0,
    position: 'absolute',
    top: 0,
    width: 4,
  },
  manualTitle: {
    color: colors.paper,
    fontSize: 22,
  },
  messageBubble: {
    backgroundColor: colors.fieldRaised,
    borderColor: colors.line,
    borderCurve: 'continuous',
    borderRadius: radii.control,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  messageBubbleBoy: {
    alignSelf: 'flex-end',
    borderColor: colors.paper,
    maxWidth: '72%',
  },
  messageStory: {
    gap: spacing.lg,
    maxWidth: 330,
    width: '100%',
  },
  messageText: {
    color: colors.paper,
    fontSize: 17,
    lineHeight: 24,
  },
  replyStack: {
    flex: 1,
    gap: spacing.sm,
  },
  replyThread: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.sm,
    width: '100%',
  },
  manualPage: {
    backgroundColor: colors.fieldRaised,
    borderColor: colors.line,
    borderWidth: 1,
    flex: 1,
    gap: spacing.xl,
    minHeight: 210,
    padding: spacing.lg,
  },
  manualPageLeft: {
    borderBottomLeftRadius: radii.control,
    borderTopLeftRadius: radii.control,
  },
  manualPageRight: {
    borderBottomRightRadius: radii.control,
    borderColor: colors.paper,
    borderTopRightRadius: radii.control,
  },
  openManual: {
    flexDirection: 'row',
    gap: spacing.xs,
    maxWidth: 330,
    width: '100%',
  },
  openManualRule: {
    backgroundColor: colors.lineSoft,
    height: 3,
    width: '100%',
  },
  openManualRules: {
    gap: spacing.md,
  },
  openManualRuleShort: {
    width: '62%',
  },
  openManualSignal: {
    backgroundColor: colors.brass,
    height: 2,
    width: '72%',
  },
  openManualTitle: {
    color: colors.paper,
    fontSize: 18,
  },
  pageStatus: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  pager: {
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
    minHeight: 52,
    width: '72%',
  },
  pagerArrow: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  pagerArrowDisabled: {
    opacity: 0.24,
  },
  pagerArrowPressed: {
    backgroundColor: colors.fieldRaised,
    transform: [{ scale: motion.pressScale }],
  },
  pagerArrowText: {
    color: colors.paper,
    fontFamily: typography.sansMedium,
    fontSize: 25,
    lineHeight: 28,
  },
  personalActionStory: {
    alignItems: 'center',
    gap: spacing.xl,
    justifyContent: 'center',
    maxWidth: 320,
    width: '100%',
  },
  primaryAction: {
    minHeight: 56,
  },
  progress: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  progressMark: {
    height: 2,
    width: 10,
  },
  progressMarkActive: {
    backgroundColor: colors.paper,
  },
  progressMarkInactive: {
    backgroundColor: colors.line,
  },
  readyStatus: {
    color: colors.paper,
  },
  screen: {
    flexGrow: 1,
    gap: spacing.md,
    minHeight: '100%',
    paddingBottom: spacing.lg,
    paddingTop: spacing.lg,
  },
  screenCompact: {
    gap: spacing.sm,
    paddingBottom: spacing.sm,
    paddingTop: spacing.sm,
  },
  story: {
    alignItems: 'center',
    flex: 1,
    gap: spacing.xl,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xl,
  },
  storyCompact: {
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  storySentence: {
    color: colors.ash,
    fontFamily: typography.sans,
    fontSize: 30,
    lineHeight: 38,
    maxWidth: 340,
    minHeight: 76,
    textAlign: 'center',
  },
});

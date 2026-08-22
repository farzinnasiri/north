import { useEffect, useRef } from 'react';
import type { PropsWithChildren } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { NorthButton } from '@/components/ui/north-button';
import { TracingFrame } from '@/components/ui/tracing-frame';
import { NorthText } from '@/components/ui/north-text';
import { ProgressRail } from '@/components/ui/progress-rail';
import { Mascot } from '@/domains/mascot/ui/mascot';
import { commitImpact } from '@/platform/haptics';
import { useOnboardingProgress } from '@/screens/onboarding/onboarding-progress';
import { colors, motion, spacing } from '@/theme';

type OnboardingFrameProps = PropsWithChildren<{
  actionLabel?: string;
  actionTone?: 'primary' | 'secondary';
  align?: 'centre' | 'left';
  body?: string;
  disabled?: boolean;
  haptic?: 'commit' | 'none';
  /** Small mono line above the title, e.g. an axis name. */
  kicker?: string;
  onContinue?: () => void;
  /** Centres a copy-only beat in the usable space between North and the action. */
  presentation?: 'question' | 'statement';
  /** Only the manifesto is long enough to earn a scroll. */
  scrollable?: boolean;
  secondaryAction?: { label: string; onPress: () => void };
  title: string;
}>;

type OnboardingShellProps = PropsWithChildren<{
  onBack?: () => void;
}>;

/**
 * The persistent part of onboarding. Keeping this mounted lets the progress
 * rail, Back affordance, and Mascot move between destination states instead of
 * being reconstructed for every page.
 */
export function OnboardingShell({ children, onBack }: OnboardingShellProps) {
  const progress = useOnboardingProgress();
  const insets = useSafeAreaInsets();
  const reduceMotion = useReducedMotion();
  const backVisibility = useSharedValue(onBack ? 1 : 0);
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      backVisibility.value = onBack ? 1 : 0;
      return;
    }

    backVisibility.value = withTiming(onBack ? 1 : 0, {
      duration: reduceMotion ? 0 : motion.quick,
      easing: Easing.bezier(0.32, 0.72, 0, 1),
    });
  }, [backVisibility, onBack, reduceMotion]);

  const backStyle = useAnimatedStyle(() => ({ opacity: backVisibility.value }));

  return (
    <View style={styles.screen}>
      {/* Outside the padding on purpose: the contract's circuit is drawn on
          the edge of the screen itself, not on the edge of the content. */}
      {progress ? <TracingFrame progress={progress.ceremony} /> : null}

      <View
        style={[
          styles.padded,
          { paddingBottom: insets.bottom + spacing.lg, paddingTop: insets.top + spacing.sm },
        ]}
      >
      {progress ? (
        <ProgressRail
          current={progress.phase}
          fraction={progress.phaseFraction}
          labels={progress.phases}
        />
      ) : null}

      <View style={styles.chrome}>
        <Animated.View
          accessibilityElementsHidden={!onBack}
          importantForAccessibility={onBack ? 'auto' : 'no-hide-descendants'}
          style={[backStyle, { pointerEvents: onBack ? 'auto' : 'none' }]}
        >
          <Pressable
            accessibilityRole="button"
            disabled={!onBack}
            onPress={onBack}
            style={styles.back}
          >
            <NorthText style={styles.backLabel} variant="label">
              BACK
            </NorthText>
          </Pressable>
        </Animated.View>
      </View>

      <View style={styles.presence}>
        {progress ? <Mascot scene={progress.mascot} size={168} /> : null}
      </View>

      {children}
      </View>
    </View>
  );
}

/**
 * The changing page inside the persistent shell. Slots stay fixed so the
 * question and action do not jump vertically as their contents change.
 */
export function OnboardingFrame({
  actionLabel,
  actionTone = 'primary',
  align = 'left',
  body,
  children,
  disabled,
  haptic = 'commit',
  kicker,
  onContinue,
  presentation = 'question',
  scrollable = false,
  secondaryAction,
  title,
}: OnboardingFrameProps) {
  const centred = align === 'centre';
  const statement = presentation === 'statement';

  function continueFlow() {
    if (haptic === 'commit') {
      void commitImpact();
    }
    onContinue?.();
  }

  const content = (
    <View style={[styles.stage, statement ? styles.statementStage : styles.questionStage]}>
      <View
        style={[styles.head, !statement && styles.questionHead, centred && styles.headCentred]}
      >
        {statement ? (
          kicker ? (
            <NorthText style={styles.kicker} variant="label">
              {kicker}
            </NorthText>
          ) : null
        ) : (
          <View style={styles.kickerSlot}>
            {kicker ? (
              <NorthText style={styles.kicker} variant="label">
                {kicker}
              </NorthText>
            ) : null}
          </View>
        )}
        <NorthText style={[styles.title, centred && styles.centre]} variant="title">
          {title}
        </NorthText>
        {body ? <NorthText style={[styles.body, centred && styles.centre]}>{body}</NorthText> : null}
      </View>

      <View
        style={[
          styles.content,
          statement ? styles.statementContent : styles.questionContent,
        ]}
      >
        {children}
      </View>
    </View>
  );

  return (
    <View style={styles.page}>
      {scrollable ? (
        <ScrollView contentContainerStyle={styles.scroll}>{content}</ScrollView>
      ) : (
        content
      )}

      {actionLabel || secondaryAction ? (
        <View style={styles.actions}>
          {actionLabel && onContinue ? (
            <NorthButton
              disabled={disabled}
              label={actionLabel}
              onPress={continueFlow}
              tone={actionTone}
            />
          ) : null}
          {secondaryAction ? (
            <NorthButton
              label={secondaryAction.label}
              onPress={secondaryAction.onPress}
              tone="quiet"
            />
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: spacing.xs,
    paddingTop: spacing.lg,
  },
  back: {
    height: 44,
    justifyContent: 'center',
    width: 60,
  },
  backLabel: {
    color: colors.slate,
  },
  body: {
    maxWidth: 340,
  },
  centre: {
    textAlign: 'center',
  },
  chrome: {
    flexDirection: 'row',
    height: 44,
  },
  content: {
    minWidth: 0,
    // A slot that cannot grow must clip rather than draw over its neighbours.
    overflow: 'hidden',
  },
  head: {
    gap: spacing.sm,
    justifyContent: 'flex-start',
    minWidth: 0,
  },
  headCentred: {
    alignItems: 'center',
  },
  kicker: {
    color: colors.brass,
  },
  kickerSlot: {
    height: 15,
  },
  page: {
    flex: 1,
    minWidth: 0,
  },
  presence: {
    alignItems: 'center',
    height: 212,
    justifyContent: 'center',
  },
  padded: {
    flex: 1,
    // Full-bleed instruments use negative margins; clipping here is what stops
    // them opening a horizontal scroll.
    overflow: 'hidden',
    paddingHorizontal: spacing.screen,
  },
  screen: {
    backgroundColor: colors.fieldDeep,
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
  },
  stage: {
    flex: 1,
    minWidth: 0,
  },
  statementStage: {
    gap: spacing.lg,
    justifyContent: 'center',
  },
  statementContent: {
    flex: 0,
  },
  questionContent: {
    flex: 1,
    justifyContent: 'center',
  },
  questionHead: {
    minHeight: 128,
  },
  questionStage: {
    paddingTop: spacing.xxxl,
  },
  title: {
    maxWidth: 340,
    width: '100%',
  },
});

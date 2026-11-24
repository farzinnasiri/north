import { createContext, use, useEffect, useRef, useState } from 'react';
import type { PropsWithChildren } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useReducedMotion } from 'react-native-reanimated';

import { NorthButton } from '@/components/ui/north-button';
import { NorthBackdrop } from '@/components/ui/north-backdrop';
import { NorthText } from '@/components/ui/north-text';
import { ProgressRail } from '@/components/ui/progress-rail';
import { Reveal } from '@/components/ui/reveal';
import { TracingFrame } from '@/components/ui/tracing-frame';
import { DirectionCompass } from '@/domains/direction/ui/direction-compass';
import { commitImpact } from '@/platform/haptics';
import { useOnboardingProgress } from '@/screens/onboarding/onboarding-progress';
import { colors, motion, spacing, typography } from '@/theme';

const RAIL_HEIGHT = spacing.lg;

type OnboardingFrameProps = PropsWithChildren<{
  animateAvailability?: boolean;
  actionLabel?: string;
  actionTone?: 'primary' | 'secondary';
  align?: 'centre' | 'left';
  body?: string;
  disabled?: boolean;
  /** One authored phrase that carries the question's real point. */
  emphasis?: string;
  haptic?: 'commit' | 'none';
  /** Stacks content directly below its title instead of balancing it vertically. */
  layout?: 'balanced' | 'stacked';
  /** Small mono line above the title, e.g. an axis name. */
  kicker?: string;
  onContinue?: () => void;
  /** Centres a copy-only beat in the usable space between North and the action. */
  presentation?: 'question' | 'statement';
  secondaryAction?: { label: string; onPress: () => void };
  title: string;
  titleRevealDelay?: number;
}>;

type OnboardingShellProps = PropsWithChildren<{
  hideInstrument?: boolean;
  introducing?: boolean;
  onBack?: () => void;
}>;

/** When the welcome copy starts, after the compass has found north. */
export const GREETING_CALIBRATE_AT = motion.arrival;
export const GREETING_COPY_AT = GREETING_CALIBRATE_AT + motion.arrival;

const OnboardingBackContext = createContext<(() => void) | undefined>(undefined);

function questionTitle(title: string, emphasis?: string) {
  if (!emphasis) return title;
  const start = title.indexOf(emphasis);
  if (start < 0) return title;

  return (
    <>
      {title.slice(0, start)}
      <Text style={styles.questionEmphasis}>{emphasis}</Text>
      {title.slice(start + emphasis.length)}
    </>
  );
}

/**
 * The persistent part of onboarding. Keeping this mounted lets the progress
 * rail, Back affordance, and Compass move between destination states instead of
 * being reconstructed for every page.
 */
export function OnboardingShell({ children, hideInstrument = false, introducing = false, onBack }: OnboardingShellProps) {
  const progress = useOnboardingProgress();
  const insets = useSafeAreaInsets();
  const { height, width } = useWindowDimensions();
  const reduceMotion = useReducedMotion();
  const [calibrated, setCalibrated] = useState(false);
  const compact = height < 740 || width < 360;
  const presenceHeight = compact ? 124 : 148;
  const greetingSize = Math.min(width * 0.64, height * 0.3, 280);
  const stageHeight = hideInstrument ? 0 : introducing ? greetingSize + spacing.lg : presenceHeight;
  const inkFieldHeight = insets.top + spacing.sm + RAIL_HEIGHT + stageHeight;

  // On the welcome beat the needle starts off and finds north once.
  useEffect(() => {
    if (!introducing) return;
    if (reduceMotion) {
      const now = setTimeout(() => setCalibrated(true), 0);
      return () => clearTimeout(now);
    }
    const timer = setTimeout(() => setCalibrated(true), GREETING_CALIBRATE_AT);
    return () => clearTimeout(timer);
  }, [introducing, reduceMotion]);

  const direction = introducing ? (calibrated ? 0 : 38) : progress?.direction ?? 90;
  const instrumentSize = introducing ? greetingSize : presenceHeight;

  return (
    <View style={styles.screen}>
      {progress ? <TracingFrame progress={progress.ceremony} /> : null}
      <NorthBackdrop />
      <View style={[styles.inkField, { height: inkFieldHeight }]} />
      <View
        style={[
          styles.padded,
          { paddingBottom: insets.bottom + spacing.lg, paddingTop: insets.top + spacing.sm },
        ]}
      >
        {progress ? (
          <View
            style={styles.progressLane}
            testID="onboarding-progress-lane"
          >
            <ProgressRail
              current={progress.phase}
              fraction={progress.phaseFraction}
              labels={progress.phases}
            />
            <View style={styles.questionCountSlot}>
              {progress.prompt ? (
                <NorthText style={styles.questionCount} variant="label">
                  {`QUESTION ${progress.prompt.current} OF ${progress.prompt.total}`}
                </NorthText>
              ) : null}
            </View>
          </View>
        ) : null}

        <View style={[styles.presence, { height: stageHeight }]}>
          {!hideInstrument ? (
            <Animated.View
              pointerEvents="none"
              style={introducing ? styles.instrumentCentre : styles.instrumentCorner}
            >
              <DirectionCompass direction={direction} field={introducing} size={instrumentSize} />
            </Animated.View>
          ) : null}
        </View>

        <OnboardingBackContext value={onBack}>
          {children}
        </OnboardingBackContext>
      </View>
    </View>
  );
}

/**
 * The changing page inside the persistent shell. The prompt starts in a
 * stable lane, while the full prompt and instrument can scroll beneath a
 * fixed action instead of being clipped on shorter phones.
 */
export function OnboardingFrame({
  animateAvailability = false,
  actionLabel,
  actionTone = 'primary',
  align = 'left',
  body,
  children,
  disabled,
  emphasis,
  haptic = 'commit',
  kicker,
  layout = 'balanced',
  onContinue,
  presentation = 'question',
  secondaryAction,
  title,
  titleRevealDelay,
}: OnboardingFrameProps) {
  const { height, width } = useWindowDimensions();
  const reduceMotion = useReducedMotion();
  const centred = align === 'centre';
  const stacked = layout === 'stacked';
  const statement = presentation === 'statement';
  const compact = height < 740 || width < 360;
  const compactQuestion = height < 1000;
  const onBack = use(OnboardingBackContext);
  const continuingRef = useRef(false);
  const [continuing, setContinuing] = useState(false);

  function continueFlow() {
    if (continuingRef.current || disabled) return;
    continuingRef.current = true;
    setContinuing(true);
    if (haptic === 'commit') {
      void commitImpact();
    }
    onContinue?.();
  }

  function continueSecondary() {
    if (continuingRef.current) return;
    continuingRef.current = true;
    setContinuing(true);
    secondaryAction?.onPress();
  }

  const titleNode = (
    <NorthText
      style={[
        styles.title,
        statement
          ? compact
            ? styles.titleCompact
            : styles.titleRegular
          : compactQuestion
            ? styles.questionTitleCompact
            : styles.questionTitleRegular,
        !statement && styles.questionTitle,
        centred && styles.centre,
      ]}
      variant="title"
    >
      {statement ? title : questionTitle(title, emphasis)}
    </NorthText>
  );

  const content = (
    <View
      style={[
        styles.stage,
        statement ? styles.statementStage : styles.questionStage,
        !statement && compactQuestion && styles.questionStageCompact,
      ]}
      testID={statement ? 'onboarding-statement-stage' : undefined}
    >
      <View
        style={[
          styles.head,
          !statement && styles.questionHead,
          !statement && compactQuestion && styles.questionHeadCompact,
          !statement && stacked && styles.stackedHead,
          centred && styles.headCentred,
        ]}
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
        {titleRevealDelay === undefined
          ? titleNode
          : <Reveal delay={titleRevealDelay} enabled={!reduceMotion}>{titleNode}</Reveal>}
        {body ? <NorthText style={[styles.body, centred && styles.centre]}>{body}</NorthText> : null}
      </View>

      {children ? (
        <View
          style={[
            styles.content,
            statement ? styles.statementContent : styles.questionContent,
            !statement && compactQuestion && styles.questionContentCompact,
            !statement && stacked && styles.stackedContent,
          ]}
          testID="onboarding-frame-content"
        >
          {children}
        </View>
      ) : null}
    </View>
  );

  return (
    <View style={styles.page}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        contentInsetAdjustmentBehavior="never"
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={styles.scroller}
      >
        {content}
      </ScrollView>

      {actionLabel || secondaryAction || onBack ? (
        <View
          style={[styles.actions, !statement && compactQuestion && styles.actionsCompact]}
          testID="onboarding-actions"
        >
          {actionLabel && onContinue ? (
            <NorthButton
              animateAvailability={animateAvailability}
              disabled={disabled || continuing}
              label={actionLabel}
              onPress={continueFlow}
              tone={actionTone}
            />
          ) : null}
          {secondaryAction ? (
            <NorthButton
              disabled={continuing}
              label={secondaryAction.label}
              onPress={continueSecondary}
              tone="quiet"
            />
          ) : null}
          {onBack ? (
            <NorthButton
              disabled={continuing}
              label="Back"
              onPress={onBack}
              style={styles.backAction}
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
  actionsCompact: {
    paddingTop: spacing.sm,
  },
  backAction: {
    minHeight: 44,
  },
  body: {
    maxWidth: 340,
    color: colors.ash,
  },
  centre: {
    textAlign: 'center',
  },
  content: {
    minWidth: 0,
    width: '100%',
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
    color: colors.meridian,
  },
  kickerSlot: {
    height: 15,
  },
  page: {
    backgroundColor: colors.fieldDeep,
    flex: 1,
    minWidth: 0,
    width: '100%',
  },
  presence: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginHorizontal: -spacing.screen,
    overflow: 'visible',
    zIndex: 2,
  },
  progressLane: {
    alignItems: 'flex-start',
    flexDirection: 'column',
    gap: spacing.xs,
    minHeight: RAIL_HEIGHT,
    width: '100%',
    zIndex: 3,
  },
  questionCount: {
    color: colors.ash,
    fontVariant: ['tabular-nums'],
    textAlign: 'left',
  },
  questionCountSlot: {
    flexShrink: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  instrumentCentre: {
    alignItems: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  instrumentCorner: {
    position: 'absolute',
    right: 0,
    top: 0,
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
  inkField: {
    backgroundColor: 'rgba(9, 11, 12, 0.38)',
    left: 0,
    pointerEvents: 'none',
    position: 'absolute',
    right: 0,
    top: 0,
  },
  scroll: {
    flexGrow: 1,
    minWidth: 0,
  },
  stage: {
    flexGrow: 1,
    minWidth: 0,
    width: '100%',
  },
  statementStage: {
    gap: spacing.xl,
    justifyContent: 'center',
    paddingBottom: 0,
  },
  statementContent: {
    flexGrow: 0,
    flexShrink: 0,
  },
  stackedContent: {
    flexGrow: 0,
    justifyContent: 'flex-start',
    paddingBottom: spacing.lg,
    paddingTop: spacing.lg,
  },
  stackedHead: {
    minHeight: 0,
  },
  questionContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: spacing.lg,
    paddingTop: spacing.xl,
  },
  questionContentCompact: {
    paddingBottom: spacing.xs,
    paddingTop: spacing.sm,
  },
  questionHead: {
    minHeight: 150,
  },
  questionHeadCompact: {
    minHeight: 128,
  },
  questionEmphasis: {
    fontFamily: typography.sansMedium,
    fontWeight: '500',
  },
  questionStage: {
    paddingTop: spacing.xl,
  },
  questionStageCompact: {
    paddingTop: spacing.xl,
  },
  questionTitle: {
    fontFamily: typography.sans,
    textTransform: 'none',
  },
  questionTitleCompact: {
    fontSize: 28,
    letterSpacing: -0.4,
    lineHeight: 34,
  },
  questionTitleRegular: {
    fontSize: 30,
    letterSpacing: -0.5,
    lineHeight: 37,
  },
  scroller: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    flexShrink: 1,
    maxWidth: 360,
    width: '100%',
  },
  titleCompact: {
    fontSize: 38,
    letterSpacing: -0.5,
    lineHeight: 40,
  },
  titleRegular: {
    fontSize: 44,
    letterSpacing: -0.6,
    lineHeight: 46,
  },
});

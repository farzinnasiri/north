import { useEffect, useState } from 'react';
import { Link } from 'expo-router';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';

import { Metric } from '@/components/ui/metric';
import { NorthButton } from '@/components/ui/north-button';
import { NorthScreen } from '@/components/ui/north-screen';
import { NorthText } from '@/components/ui/north-text';
import { Reveal } from '@/components/ui/reveal';
import { deadlineReadout } from '@/domains/actions/action';
import { authoredAction } from '@/domains/content/catalogue';
import type { ActionState, NorthState } from '@/domains/journey/journey';
import { actionState, northState } from '@/domains/journey/journey';
import { homeMascotScene } from '@/domains/journey/mascot-scene';
import { useJourney } from '@/domains/journey/store';
import type { MascotScene } from '@/domains/mascot/mascot';
import { Mascot } from '@/domains/mascot/ui/mascot';
import { playSoundCue } from '@/platform/sound';
import { colors, motion, spacing, typography } from '@/theme';

const HOME_BLINK_DELAYS = [4600, 7200, 5600] as const;

/**
 * One screen, four states, one question each: is anything open, is it still
 * running, has the deadline passed, and is the exit in sight. The state owns
 * the whole page rather than toggling a banner on a dashboard — a man opening
 * this app should be able to answer "what now" in one glance.
 */
export function Home() {
  const { height, width } = useWindowDimensions();
  const journey = useJourney((state) => state.journey);
  const pending = useJourney((state) => state.pendingMovement);
  const changedAt = useJourney((state) => state.changedAt);
  const settleNeedle = useJourney((state) => state.settleNeedle);
  const reduceMotion = useReducedMotion();
  const blinking = useHomeBlink(reduceMotion);
  // Read once, on the way in. Everything this screen shows is measured in
  // days, so a clock that drifts by the length of a session cannot be seen —
  // but a closeout that happens while it is mounted lands in its future, which
  // is why every reading off it is clamped rather than trusted.
  const [now] = useState(() => Date.now());
  const compact = height < 740 || width < 360;
  const short = height < 620;
  const instrumentSize = short ? 280 : compact ? 330 : 420;

  /**
   * The one celebration in the product. He arrives here with the direction he
   * had, the instrument travels to the one he earned, and the number lands
   * with it — a readout that changed before the needle did would give the
   * movement away and make the instrument look like decoration.
   */
  const [travelling, setTravelling] = useState(pending !== null);
  const [settled, setSettled] = useState(pending === null);

  useEffect(() => {
    if (pending === null) return;
    if (pending.to !== 0) playSoundCue('direction-move', journey?.preferences.sound ?? false);
    // One frame at the old direction, so the mascot has something to travel from.
    const frame = requestAnimationFrame(() => setTravelling(false));
    const landed = setTimeout(() => {
      if (pending.to === 0) playSoundCue('reach-north', journey?.preferences.sound ?? false);
      setSettled(true);
      settleNeedle();
    }, motion.settle);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(landed);
    };
  }, [journey?.preferences.sound, pending, settleNeedle]);

  if (!journey) return null;

  const action = actionState(journey, now);
  // The state he caused while watching animates in; the state that was already
  // here when he opened the app does not.
  const changed = changedAt > now;
  const north = northState(journey, now);
  const readout = pending && !settled ? pending.from : journey.direction;
  const scene = homeMascotScene({
    acknowledge: pending ? pending.to : null,
    action,
    direction: pending && travelling ? pending.from : journey.direction,
    north,
    startingDirection: journey.startingDirection,
  });
  const livingScene = blinking
    ? { ...scene, expression: 'blink', transition: { duration: 'quick', expression: 'morph' } } satisfies MascotScene
    : scene;

  return (
    <NorthScreen contentStyle={styles.screen}>
      <View style={[
        styles.instrumentField,
        compact && styles.instrumentFieldCompact,
        short && styles.instrumentFieldShort,
      ]}>
        <View style={styles.header}>
          <Metric inverted label="DIRECTION" value={`N ${formatDegrees(readout)}°`} />
          <RightMetric
            action={action}
            inverted
            north={north}
            now={now}
          />
        </View>

        <Mascot
          scene={livingScene}
          size={instrumentSize}
          style={[styles.mascot, compact && styles.mascotCompact, short && styles.mascotShort]}
        />
      </View>

      <Reveal
        enabled={changed}
        key={action.kind}
        style={[
          styles.stage,
          compact && styles.stageCompact,
          action.kind === 'idle' && styles.stageCentred,
        ]}
      >
        {action.kind === 'idle' ? (
          <Idle north={north} />
        ) : action.kind === 'running' ? (
          <Running action={action} />
        ) : (
          <Overdue action={action} />
        )}
      </Reveal>
    </NorthScreen>
  );
}

type RightMetricProps = {
  action: ActionState;
  inverted?: boolean;
  north: NorthState;
  now: number;
};

function RightMetric({ action, inverted = false, north, now }: RightMetricProps) {
  if (action.kind === 'running') {
    return (
      <Metric
        align="right"
        inverted={inverted}
        label="DUE"
        value={deadlineReadout(action.action, now)}
      />
    );
  }
  if (action.kind === 'overdue') {
    return (
      <Metric
        align="right"
        inverted={inverted}
        label="OVERDUE"
        tone="overdue"
        value={deadlineReadout(action.action, now)}
      />
    );
  }
  if (north.kind === 'holding') {
    return (
      <Metric
        align="right"
        inverted={inverted}
        label="HELD"
        tone="earned"
        value={`${north.daysHeld}d`}
      />
    );
  }
  return null;
}

type IdleProps = {
  north: NorthState;
};

function Idle({ north }: IdleProps) {
  if (north.kind === 'exit') {
    return (
      <View style={styles.body}>
        <NorthText variant="title">You are done here.</NorthText>
        <NorthText>Thirty days at North.</NorthText>
      </View>
    );
  }

  if (north.kind === 'holding') {
    return (
      <View style={styles.body}>
        <NorthText variant="title">
          {north.daysLeft === 1 ? 'One day left.' : `${north.daysLeft} days left.`}
        </NorthText>
        <Link asChild href="/action">
          <NorthButton label="See the next action" />
        </Link>
      </View>
    );
  }

  return (
    <View style={styles.body}>
      <NorthText variant="title">Choose the next move.</NorthText>
      <Link asChild href="/action">
        <NorthButton label="See the next action" />
      </Link>
    </View>
  );
}

function Running({ action }: { action: Extract<ActionState, { kind: 'running' }> }) {
  const authored = authoredAction(action.action.actionId);
  if (!authored) return null;

  return (
    <View style={styles.body}>
      <View style={styles.actionSummary}>
        <NorthText variant="label">OPEN ACTION</NorthText>
        <NorthText variant="title">{action.action.named || authored.title}</NorthText>
        {action.action.named ? <NorthText variant="small">{authored.title}</NorthText> : null}
      </View>
      <View style={styles.actions}>
        <Link asChild href="/closeout">
          <NorthButton label="Close it out" />
        </Link>
        <Link href="/note" style={styles.secondaryLink}>
          {action.action.note ? 'Edit note' : 'Add a note'}
        </Link>
      </View>
    </View>
  );
}

function Overdue({ action }: { action: Extract<ActionState, { kind: 'overdue' }> }) {
  const authored = authoredAction(action.action.actionId);
  const days = action.action.deadlineDays;
  const title = action.action.named || authored?.title || 'Open action';

  return (
    <View style={styles.body}>
      <View style={styles.actionSummary}>
        <NorthText variant="label">OPEN ACTION</NorthText>
        <NorthText variant="title">{title}</NorthText>
        <NorthText variant="small">
          You gave it {days === 1 ? 'one day' : `${days} days`}. It remains open.
        </NorthText>
      </View>

      <View style={styles.actions}>
        <Link asChild href="/closeout">
          <NorthButton label="Close it out now" />
        </Link>
        <Link href="/action" style={styles.secondaryLink}>
          Let it go
        </Link>
      </View>
    </View>
  );
}

function useHomeBlink(reduceMotion: boolean): boolean {
  const [blinkCue, setBlinkCue] = useState(0);
  const [blinking, setBlinking] = useState(false);

  useEffect(() => {
    if (reduceMotion) return;

    const delay = blinking ? motion.settle : HOME_BLINK_DELAYS[blinkCue % HOME_BLINK_DELAYS.length];
    const timer = setTimeout(() => {
      if (blinking) {
        setBlinking(false);
        setBlinkCue((cue) => cue + 1);
      } else {
        setBlinking(true);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [blinkCue, blinking, reduceMotion]);

  return blinking;
}

function formatDegrees(direction: number): string {
  return Number.isInteger(direction) ? `${direction}` : direction.toFixed(1);
}

const styles = StyleSheet.create({
  actions: {
    gap: spacing.sm,
    paddingTop: spacing.sm,
  },
  body: {
    gap: spacing.lg,
    maxWidth: 360,
  },
  actionSummary: {
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.xl,
    zIndex: 2,
  },
  instrumentField: {
    backgroundColor: 'rgba(9, 11, 12, 0.22)',
    borderBottomColor: colors.lineSoft,
    borderBottomWidth: 1,
    height: 408,
    zIndex: 2,
  },
  instrumentFieldCompact: {
    height: 320,
  },
  instrumentFieldShort: {
    height: 260,
  },
  mascot: {
    bottom: -96,
    position: 'absolute',
    right: -104,
  },
  mascotCompact: {
    bottom: -62,
    right: -76,
  },
  mascotShort: {
    bottom: -44,
    right: -60,
  },
  screen: {
    flexGrow: 1,
    gap: 0,
    paddingBottom: 0,
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  stage: {
    backgroundColor: 'transparent',
    gap: spacing.xl,
    paddingBottom: process.env.EXPO_OS === 'web' ? 136 : spacing.xxxl + spacing.lg,
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.xxxl + spacing.xxl,
    zIndex: 1,
  },
  stageCompact: {
    paddingTop: spacing.xxl,
  },
  // The instrument field and the action share one continuous black field.
  stageCentred: {
    flex: 1,
    justifyContent: 'space-between',
  },
  secondaryLink: {
    alignSelf: 'center',
    color: colors.ash,
    fontFamily: typography.sansMedium,
    fontSize: 14,
    lineHeight: 21,
    padding: spacing.sm,
  },
});

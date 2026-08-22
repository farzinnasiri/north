import { useEffect, useState } from 'react';
import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Metric } from '@/components/ui/metric';
import { NorthButton } from '@/components/ui/north-button';
import { NorthScreen } from '@/components/ui/north-screen';
import { NorthText } from '@/components/ui/north-text';
import { Reveal } from '@/components/ui/reveal';
import { DAY_MS, deadlineReadout } from '@/domains/actions/action';
import { swapsLeft } from '@/domains/actions/swaps';
import { ActionBrief } from '@/domains/actions/ui/action-brief';
import { authoredAction } from '@/domains/content/catalogue';
import type { ActionState, Journey, NorthState } from '@/domains/journey/journey';
import { actionState, keptCount, northState } from '@/domains/journey/journey';
import { homeMascotScene } from '@/domains/journey/mascot-scene';
import { northStarLabel } from '@/domains/onboarding/onboarding';
import { useJourney } from '@/domains/journey/store';
import { Mascot } from '@/domains/mascot/ui/mascot';
import { colors, motion, spacing } from '@/theme';

/**
 * One screen, four states, one question each: is anything open, is it still
 * running, has the deadline passed, and is the exit in sight. The state owns
 * the whole page rather than toggling a banner on a dashboard — a man opening
 * this app should be able to answer "what now" in one glance.
 */
export function Home() {
  const journey = useJourney((state) => state.journey);
  const pending = useJourney((state) => state.pendingMovement);
  const changedAt = useJourney((state) => state.changedAt);
  const settleNeedle = useJourney((state) => state.settleNeedle);
  // Read once, on the way in. Everything this screen shows is measured in
  // days, so a clock that drifts by the length of a session cannot be seen —
  // but a closeout that happens while it is mounted lands in its future, which
  // is why every reading off it is clamped rather than trusted.
  const [now] = useState(() => Date.now());

  /**
   * The one celebration in the product. He arrives here with the bearing he
   * had, the instrument travels to the one he earned, and the number lands
   * with it — a readout that changed before the needle did would give the
   * movement away and make the instrument look like decoration.
   */
  const [travelling, setTravelling] = useState(pending !== null);
  const [settled, setSettled] = useState(pending === null);

  useEffect(() => {
    if (pending === null) return;
    // One frame at the old bearing, so the mascot has something to travel from.
    const frame = requestAnimationFrame(() => setTravelling(false));
    const landed = setTimeout(() => {
      setSettled(true);
      settleNeedle();
    }, motion.settle);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(landed);
    };
  }, [pending, settleNeedle]);

  if (!journey) return null;

  const action = actionState(journey, now);
  // The state he caused while watching animates in; the state that was already
  // here when he opened the app does not.
  const changed = changedAt > now;
  const north = northState(journey, now);
  const readout = pending && !settled ? pending.from : journey.bearing;
  const scene = homeMascotScene({
    acknowledge: pending ? pending.to : null,
    action,
    bearing: pending && travelling ? pending.from : journey.bearing,
    north,
    startingBearing: journey.startingBearing,
  });

  return (
    <NorthScreen contentStyle={styles.screen}>
      <View style={styles.header}>
        <Metric label="BEARING" value={`N ${formatDegrees(readout)}°`} />
        <RightMetric action={action} north={north} now={now} kept={keptCount(journey)} />
      </View>

      <Reveal
        enabled={changed}
        key={action.kind}
        style={[styles.stage, action.kind === 'idle' && styles.stageCentred]}
      >
        {action.kind === 'idle' ? (
          <View style={styles.instrument}>
            <Mascot scene={scene} size={188} />
          </View>
        ) : null}

        {action.kind === 'idle' ? (
          <Idle journey={journey} lastClosedAt={action.lastClosedAt} north={north} now={now} />
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
  kept: number;
  north: NorthState;
  now: number;
};

function RightMetric({ action, kept, north, now }: RightMetricProps) {
  if (action.kind === 'running') {
    return <Metric align="right" label="DUE" value={deadlineReadout(action.action, now)} />;
  }
  if (action.kind === 'overdue') {
    return (
      <Metric
        align="right"
        label="OVERDUE"
        tone="overdue"
        value={deadlineReadout(action.action, now)}
      />
    );
  }
  if (north.kind === 'holding') {
    return <Metric align="right" label="HELD" tone="earned" value={`${north.daysHeld}d`} />;
  }
  return <Metric align="right" label="KEPT" tone="earned" value={`${kept}`} />;
}

type IdleProps = {
  journey: Journey;
  lastClosedAt: number | null;
  north: NorthState;
  now: number;
};

function Idle({ journey, lastClosedAt, north, now }: IdleProps) {
  const swaps = swapsLeft(journey.swapsUsedAt, now);
  const star = northStarLabel(journey.northStar);

  if (north.kind === 'exit') {
    return (
      <View style={styles.body}>
        <NorthText variant="title">You do not need this any more.</NorthText>
        <NorthText>
          You reached north and held it for thirty days. That was the whole agreement, and it
          is finished.
        </NorthText>
        <NorthText variant="small">
          Nothing here will ask you to stay. Close the app and keep the direction.
        </NorthText>
      </View>
    );
  }

  if (north.kind === 'holding') {
    return (
      <View style={styles.body}>
        <NorthText variant="title">
          {north.daysLeft === 1 ? 'One day left.' : `${north.daysLeft} days left.`}
        </NorthText>
        <NorthText>
          Hold north for thirty days and North closes. You have held for {north.daysHeld}.
        </NorthText>
        <NorthText variant="small">
          A compass does not walk for you. It tells you which way is forward, and then you go.
        </NorthText>
        <Link asChild href="/action">
          <NorthButton label="See the next action" />
        </Link>
      </View>
    );
  }

  return (
    <View style={styles.body}>
      {/* What he is walking toward, on the screen he opens most. It is the one
          thing that makes an empty state his rather than the app's. */}
      {star ? (
        <NorthText style={styles.toward} variant="label">
          WALKING TOWARD · {journey.alterEgo.trim() === '' ? star.toUpperCase() : journey.alterEgo.toUpperCase()}
        </NorthText>
      ) : null}
      <NorthText variant="title">Nothing is open.</NorthText>
      <NorthText>{sinceCopy(lastClosedAt, now)}</NorthText>
      <Link asChild href="/action">
        <NorthButton label="See the next action" />
      </Link>
      <NorthText style={styles.footnote} variant="label">
        SWAPS LEFT THIS MONTH · {swaps}
      </NorthText>
    </View>
  );
}

function sinceCopy(lastClosedAt: number | null, now: number): string {
  if (lastClosedAt === null) {
    return 'You have not opened one yet. The needle does not move until you close something you said you would close.';
  }
  const days = Math.max(0, Math.floor((now - lastClosedAt) / DAY_MS));
  const when = days === 0 ? 'today' : days === 1 ? 'yesterday' : `${days} days ago`;
  return `You closed the last one ${when}. The needle does not move while you wait.`;
}

function Running({ action }: { action: Extract<ActionState, { kind: 'running' }> }) {
  const authored = authoredAction(action.action.actionId);
  if (!authored) return null;

  return (
    <View style={styles.body}>
      <ActionBrief action={authored} named={action.action.named} />
      <View style={styles.actions}>
        <Link asChild href="/closeout">
          <NorthButton label="Close it out" />
        </Link>
        <Link asChild href="/note">
          <NorthButton label={action.action.note ? 'Edit your note' : 'Add a note'} tone="secondary" />
        </Link>
      </View>
    </View>
  );
}

function Overdue({ action }: { action: Extract<ActionState, { kind: 'overdue' }> }) {
  const authored = authoredAction(action.action.actionId);
  const days = action.action.deadlineDays;

  return (
    <View style={styles.body}>
      <View style={styles.head}>
        <NorthText variant="title">
          You said {days === 1 ? 'one day' : `${days} days`}.
        </NorthText>
        <NorthText>
          That was {action.days === 1 ? 'a day' : `${action.days} days`} ago. The action is still
          open — nothing was taken from you, and nothing was added.
        </NorthText>
        <NorthText variant="small">
          The needle only moves when you finish something you said you would finish. It has been
          still since then.
        </NorthText>
      </View>

      {authored ? (
        <ActionBrief action={authored} named={action.action.named} />
      ) : null}

      <View style={styles.actions}>
        <Link asChild href="/closeout">
          <NorthButton label="Close it out now" />
        </Link>
        <Link asChild href="/action">
          <NorthButton label="Let it go, take the next one" tone="quiet" />
        </Link>
      </View>
    </View>
  );
}

function formatDegrees(bearing: number): string {
  return Number.isInteger(bearing) ? `${bearing}` : bearing.toFixed(1);
}

const styles = StyleSheet.create({
  actions: {
    gap: spacing.sm,
    paddingTop: spacing.sm,
  },
  body: {
    gap: spacing.lg,
  },
  footnote: {
    color: colors.slate,
    textAlign: 'center',
  },
  toward: {
    color: colors.brassDim,
  },
  head: {
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  instrument: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  screen: {
    flexGrow: 1,
    gap: spacing.xl,
  },
  stage: {
    gap: spacing.xl,
  },
  // Idle is a held breath: nothing is open, so the instrument sits in the
  // middle of the screen rather than hanging from the top of it. The running
  // states have enough to say to fill the page and stay where they are.
  stageCentred: {
    flex: 1,
    justifyContent: 'center',
  },
});

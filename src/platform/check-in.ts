import * as Notifications from 'expo-notifications';

import type { OpenAction, Outcome } from '@/domains/actions/action';

/**
 * The one notification North sends: at the time he chose, on the day he
 * chose, it asks whether he did the thing. Nothing else is ever scheduled.
 */
const CATEGORY = 'north.check-in';

const OUTCOME_ACTIONS: readonly { identifier: Outcome; title: string }[] = [
  { identifier: 'done', title: 'I did it' },
  { identifier: 'partly', title: 'Partly' },
  { identifier: 'missed', title: 'I didn’t' },
];

export type CheckInResponse =
  | { instanceId: string; kind: 'answered'; outcome: Outcome }
  | { instanceId: string; kind: 'opened' };

let configured = false;

export function configureCheckIns(): void {
  if (configured) return;
  configured = true;
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
  void Notifications.setNotificationCategoryAsync(
    CATEGORY,
    OUTCOME_ACTIONS.map(({ identifier, title }) => ({
      buttonTitle: title,
      identifier,
      options: { opensAppToForeground: true },
    })),
  ).catch(() => {
    // Without the buttons, tapping the notification still opens the check-in.
  });
}

/** Asks once, when he turns check-ins on. Returns whether they are allowed. */
export async function allowCheckIns(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  if (!current.canAskAgain) return false;
  const asked = await Notifications.requestPermissionsAsync({
    ios: { allowAlert: true, allowBadge: false, allowSound: false },
  });
  return asked.granted;
}

/** Replaces whatever was scheduled with the check-in for this Action. */
export async function scheduleCheckIn(action: OpenAction): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
  if (action.checkInAt <= Date.now()) return;
  await Notifications.scheduleNotificationAsync({
    content: {
      body: action.action,
      categoryIdentifier: CATEGORY,
      data: { instanceId: action.instanceId },
      title: 'Did you do it?',
    },
    trigger: { date: new Date(action.checkInAt), type: Notifications.SchedulableTriggerInputTypes.DATE },
  });
}

export async function cancelCheckIns(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

function toResponse(response: Notifications.NotificationResponse): CheckInResponse | null {
  const data = response.notification.request.content.data as { instanceId?: unknown } | undefined;
  const instanceId = typeof data?.instanceId === 'string' ? data.instanceId : null;
  if (!instanceId) return null;
  const outcome = OUTCOME_ACTIONS.find((action) => action.identifier === response.actionIdentifier);
  return outcome
    ? { instanceId, kind: 'answered', outcome: outcome.identifier }
    : { instanceId, kind: 'opened' };
}

/**
 * Hands every tap on a check-in to the app, including the one that launched
 * it. Each response is handled once, then cleared.
 */
export function listenForCheckIns(handle: (response: CheckInResponse) => void): () => void {
  const deliver = (raw: Notifications.NotificationResponse | null) => {
    if (!raw) return;
    const response = toResponse(raw);
    Notifications.clearLastNotificationResponse();
    if (response) handle(response);
  };
  deliver(Notifications.getLastNotificationResponse());
  const subscription = Notifications.addNotificationResponseReceivedListener(deliver);
  return () => subscription.remove();
}

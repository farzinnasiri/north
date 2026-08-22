import * as Haptics from 'expo-haptics';

/**
 * The person's haptics preference, held here rather than passed through every
 * call site. A UI primitive cannot know whose journey it is being rendered in,
 * and a preference that only some of the app honours is worse than no
 * preference at all.
 */
let enabled = true;

export function setHapticsEnabled(next: boolean): void {
  enabled = next;
}

export async function selectionTick(): Promise<void> {
  if (!enabled) return;
  if (process.env.EXPO_OS === 'android') {
    await Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Segment_Tick);
    return;
  }
  await Haptics.selectionAsync();
}

export async function commitImpact(): Promise<void> {
  if (!enabled) return;
  if (process.env.EXPO_OS === 'android') {
    await Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Confirm);
    return;
  }
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

export async function contractImpact(): Promise<void> {
  if (!enabled) return;
  if (process.env.EXPO_OS === 'android') {
    await Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Confirm);
    return;
  }
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
}

/**
 * One success notification when an Action is closed out. It is the only
 * notification-class haptic in the product; a missed Deadline stays unbuzzed.
 */
export async function closeoutNotification(): Promise<void> {
  if (!enabled) return;
  if (process.env.EXPO_OS === 'android') {
    await Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Confirm);
    return;
  }
  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}

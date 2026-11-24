// Reanimated's Jest helpers. Registers the animated-style matchers and the
// fake clock the needle tests will need, and keeps animated components from
// throwing when they are rendered in a test.
import { setUpTests } from 'react-native-reanimated';

setUpTests();

// Native-only modules. The tests exercise the fallbacks: solid buttons where
// Liquid Glass is unavailable, and no scheduled notifications.
jest.mock('expo-glass-effect', () => ({
  GlassView: 'GlassView',
  isLiquidGlassAvailable: () => false,
}));

jest.mock('expo-image', () => ({ Image: 'Image' }));

jest.mock('expo-haptics', () => ({
  ImpactFeedbackStyle: { Heavy: 'heavy', Light: 'light', Medium: 'medium', Rigid: 'rigid', Soft: 'soft' },
  NotificationFeedbackType: { Error: 'error', Success: 'success', Warning: 'warning' },
  impactAsync: async () => {},
  notificationAsync: async () => {},
  selectionAsync: async () => {},
}));

jest.mock('expo-notifications', () => ({
  SchedulableTriggerInputTypes: { DATE: 'date' },
  addNotificationResponseReceivedListener: () => ({ remove: () => {} }),
  cancelAllScheduledNotificationsAsync: async () => {},
  clearLastNotificationResponse: () => {},
  getLastNotificationResponse: () => null,
  getPermissionsAsync: async () => ({ canAskAgain: true, granted: false }),
  requestPermissionsAsync: async () => ({ granted: false }),
  scheduleNotificationAsync: async () => 'id',
  setNotificationCategoryAsync: async () => null,
  setNotificationHandler: () => {},
}));

// React warnings are defects, not noise. A test that renders a broken tree
// should fail here rather than pass with a warning nobody reads.
const failOnConsole = (method: 'error' | 'warn') => {
  const original = console[method];
  beforeEach(() => {
    console[method] = (...args: unknown[]) => {
      original(...args);
      throw new Error(`console.${method} during test: ${String(args[0])}`);
    };
  });
  afterEach(() => {
    console[method] = original;
  });
};

failOnConsole('error');

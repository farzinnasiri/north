import { Platform } from 'react-native';

/**
 * Space above a tab screen's content. On iOS and Android the system tab bar
 * sits at the bottom and the scroll view handles insets. The web preview draws
 * its tab switcher over the top of the page, so content starts below it.
 */
export const TAB_TOP_INSET = Platform.OS === 'web' ? 64 : 0;

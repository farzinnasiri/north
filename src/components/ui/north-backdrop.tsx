import type { StyleProp, ViewStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';

import { colors } from '@/theme';

type NorthBackdropProps = {
  style?: StyleProp<ViewStyle>;
};

/** North's background is deliberately absolute black. */
export function NorthBackdrop({ style }: NorthBackdropProps) {
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.field, style]} />
  );
}

const styles = StyleSheet.create({
  field: {
    backgroundColor: colors.fieldDeep,
  },
});

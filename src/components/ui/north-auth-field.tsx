import { forwardRef, useState } from 'react';
import type { TextInput, TextInputProps } from 'react-native';
import { Pressable, StyleSheet, TextInput as NativeTextInput, View } from 'react-native';

import { NorthText } from '@/components/ui/north-text';
import { colors, radii, spacing, typography, typeScale } from '@/theme';

type NorthAuthFieldProps = TextInputProps & {
  error?: string;
  label: string;
  onToggleSecure?: () => void;
  secureVisible?: boolean;
};

/**
 * A labelled single-line field for identity surfaces. Clerk can own the value
 * and errors later; the field only owns focus and North's visual treatment.
 */
export const NorthAuthField = forwardRef<TextInput, NorthAuthFieldProps>(
  function NorthAuthField(
    { error, label, onBlur, onFocus, onToggleSecure, secureVisible, style, ...props },
    ref,
  ) {
    const [focused, setFocused] = useState(false);

    return (
      <View style={styles.group}>
        <NorthText style={styles.label} variant="label">
          {label}
        </NorthText>
        <View style={[styles.frame, focused && styles.focused, error ? styles.invalid : null]}>
          <NativeTextInput
            accessibilityLabel={label}
            autoCorrect={false}
            onBlur={(event) => {
              setFocused(false);
              onBlur?.(event);
            }}
            onFocus={(event) => {
              setFocused(true);
              onFocus?.(event);
            }}
            placeholderTextColor={colors.slate}
            ref={ref}
            selectionColor={colors.brass}
            style={[styles.input, style]}
            {...props}
          />
          {onToggleSecure ? (
            <Pressable
              accessibilityLabel={secureVisible ? 'Hide password' : 'Show password'}
              accessibilityRole="button"
              hitSlop={12}
              onPress={onToggleSecure}
              style={({ pressed }) => [styles.toggle, pressed && styles.togglePressed]}
            >
              <NorthText style={styles.toggleLabel} variant="label">
                {secureVisible ? 'Hide' : 'Show'}
              </NorthText>
            </Pressable>
          ) : null}
        </View>
        {error ? (
          <NorthText accessibilityLiveRegion="polite" style={styles.error} variant="small">
            {error}
          </NorthText>
        ) : null}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  error: {
    color: colors.emberText,
  },
  focused: {
    borderColor: colors.brass,
  },
  frame: {
    alignItems: 'center',
    backgroundColor: colors.fieldRaised,
    borderColor: colors.line,
    borderCurve: 'continuous',
    borderRadius: radii.control,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 62,
    paddingHorizontal: spacing.lg,
  },
  group: {
    gap: spacing.sm,
  },
  input: {
    color: colors.paper,
    flex: 1,
    fontFamily: typography.sans,
    fontSize: typeScale.body,
    minHeight: 60,
    paddingVertical: spacing.md,
  },
  invalid: {
    borderColor: colors.emberText,
  },
  label: {
    color: colors.ash,
  },
  toggle: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    minWidth: 52,
  },
  toggleLabel: {
    color: colors.brass,
  },
  togglePressed: {
    opacity: 0.65,
  },
});

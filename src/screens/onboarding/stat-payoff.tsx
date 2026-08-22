import { StyleSheet, View } from 'react-native';

import { NorthText } from '@/components/ui/north-text';
import { OnboardingFrame } from '@/screens/onboarding/onboarding-frame';
import { colors, spacing } from '@/theme';

type StatPayoffProps = {
  /** Line under the figure, e.g. "years of your life". */
  caption: string;
  figure: string;
  kicker: string;
  onContinue: () => void;
  title: string;
};

/**
 * The flow gives something back before it asks for more. Twenty questions with
 * no reply is an interrogation; one screen that turns his own answer into a
 * number about his own life is the moment the app stops feeling generic.
 *
 * The figure gets this screen alone. What it means goes on the next one — a
 * number and its verdict on the same screen is two things to read at once, and
 * the number lands harder when nothing is arguing beside it.
 */
export function StatPayoff({
  caption,
  figure,
  kicker,
  onContinue,
  title,
}: StatPayoffProps) {
  return (
    <OnboardingFrame
      actionLabel="Keep going"
      align="centre"
      kicker={kicker}
      onContinue={onContinue}
      title={title}
    >
      <View style={styles.figureBlock}>
        <NorthText
          accessibilityLabel={`${figure} ${caption}`}
          style={styles.figure}
          variant="data"
        >
          {figure}
        </NorthText>
        <NorthText style={styles.caption} variant="heading">
          {caption}
        </NorthText>
      </View>
    </OnboardingFrame>
  );
}

const styles = StyleSheet.create({
  caption: {
    color: colors.paper,
    textAlign: 'center',
  },
  figure: {
    color: colors.brass,
    fontSize: 116,
    lineHeight: 124,
    textAlign: 'center',
  },
  figureBlock: {
    alignItems: 'center',
    gap: spacing.sm,
  },
});

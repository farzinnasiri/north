import { router } from 'expo-router';
import Stack from 'expo-router/stack';
import { Pressable, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { NorthStack } from '@/components/ui/north-stack';
import { colors } from '@/theme';

export default function YouLayout() {
  return (
    <NorthStack headerShown={false} routeName="you" title="You">
      <Stack.Screen
        name="code"
        options={{
          headerLeft: () => <YouBackButton label="Back to You" />,
          title: 'The Code',
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          headerLeft: () => <YouBackButton label="Back to You" />,
          title: 'Settings',
        }}
      />
    </NorthStack>
  );
}

function YouBackButton({ label }: { label: string }) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      hitSlop={12}
      onPress={() => {
        if (router.canGoBack()) router.back();
        else router.replace('/you');
      }}
      style={styles.back}
    >
      <Svg height={24} viewBox="0 0 24 24" width={24}>
        <Path
          d="M15 4L7 12L15 20"
          fill="none"
          stroke={colors.paper}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </Svg>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  back: {
    alignItems: 'flex-start',
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
});

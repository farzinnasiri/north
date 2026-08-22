import { Image } from 'expo-image';
import type { ImageStyle, StyleProp } from 'react-native';

import type { NorthStarType } from '@/domains/onboarding/onboarding';

/**
 * The one place the archetype portraits are wired to their North Star. Both the
 * carousel that chooses one and the profile that remembers it read from here,
 * so a renamed file breaks in a single module.
 */
const PORTRAITS: Record<NorthStarType, number> = {
  'patriarch': require('../../../../assets/archetypes/patriarch.png'),
  'modern-man': require('../../../../assets/archetypes/modern-man.png'),
  'rogue': require('../../../../assets/archetypes/rogue.png'),
  'laughing-wolf': require('../../../../assets/archetypes/laughing-wolf.png'),
  'godfather': require('../../../../assets/archetypes/godfather.png'),
  'kind-father': require('../../../../assets/archetypes/kind-father.png'),
  'freethinker': require('../../../../assets/archetypes/freethinker.png'),
  'playboy': require('../../../../assets/archetypes/playboy.png'),
};

type NorthStarPortraitProps = {
  contentFit?: 'cover' | 'contain';
  star: NorthStarType;
  style?: StyleProp<ImageStyle>;
  transition?: number;
};

export function NorthStarPortrait({
  contentFit = 'cover',
  star,
  style,
  transition = 0,
}: NorthStarPortraitProps) {
  return (
    <Image
      accessibilityIgnoresInvertColors
      contentFit={contentFit}
      source={PORTRAITS[star]}
      style={style}
      transition={transition}
    />
  );
}

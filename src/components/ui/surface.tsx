import type { PropsWithChildren } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import { GlassSurface } from '@/components/ui/glass';
import { spacing } from '@/theme';

type SurfaceProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
}>;

/** A glass plate for one block of content. */
export function Surface({ children, style }: SurfaceProps) {
  return <GlassSurface style={[{ gap: spacing.md }, style]}>{children}</GlassSurface>;
}

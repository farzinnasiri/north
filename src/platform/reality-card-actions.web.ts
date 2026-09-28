import type { RefObject } from 'react';
import type { View } from 'react-native';
import { captureRef } from 'react-native-view-shot';

export type RealityCardActionResult = 'done' | 'permission-denied';

async function captureRealityCard(ref: RefObject<View | null>) {
  return captureRef(ref, {
    format: 'png',
    quality: 1,
    result: 'data-uri',
  });
}

export async function saveRealityCard(
  ref: RefObject<View | null>,
): Promise<RealityCardActionResult> {
  const uri = await captureRealityCard(ref);
  const link = document.createElement('a');
  link.download = 'north-starting-point.png';
  link.href = uri;
  link.click();
  return 'done';
}

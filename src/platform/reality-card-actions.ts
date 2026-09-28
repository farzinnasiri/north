import type { RefObject } from 'react';
import type { View } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { captureRef, releaseCapture } from 'react-native-view-shot';

export type RealityCardActionResult = 'done' | 'permission-denied';

async function captureRealityCard(ref: RefObject<View | null>) {
  return captureRef(ref, {
    fileName: 'north-starting-point',
    format: 'png',
    quality: 1,
    result: 'tmpfile',
  });
}

export async function saveRealityCard(
  ref: RefObject<View | null>,
): Promise<RealityCardActionResult> {
  const permission = await MediaLibrary.requestPermissionsAsync(true, ['photo']);
  if (!permission.granted) return 'permission-denied';

  const uri = await captureRealityCard(ref);
  try {
    await MediaLibrary.Asset.create(uri);
    return 'done';
  } finally {
    releaseCapture(uri);
  }
}

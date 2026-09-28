import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';

const SOURCES = {
  'close-out': require('../../assets/sounds/close-out.m4a'),
  'direction-move': require('../../assets/sounds/direction-move.m4a'),
  'reach-north': require('../../assets/sounds/reach-north.m4a'),
} as const;

export type SoundCue = keyof typeof SOURCES;

const players = {
  'close-out': createAudioPlayer(SOURCES['close-out'], { downloadFirst: true }),
  'direction-move': createAudioPlayer(SOURCES['direction-move'], { downloadFirst: true }),
  'reach-north': createAudioPlayer(SOURCES['reach-north'], { downloadFirst: true }),
};

void setAudioModeAsync({
  interruptionMode: 'mixWithOthers',
  playsInSilentMode: false,
});

/**
 * These three small players live for the app process, so leaving Closeout
 * cannot cut its knock short. Rewinding makes repeated cues deterministic,
 * while the explicit audio mode keeps the device silent switch authoritative.
 */
export function playSoundCue(cue: SoundCue, enabled: boolean): void {
  if (!enabled) return;
  const player = players[cue];
  void player.seekTo(0).then(() => player.play());
}

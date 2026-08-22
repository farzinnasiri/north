// Generated from DESIGN.md by scripts/tokens.mts. Do not edit by hand.
// Change DESIGN.md and run `make tokens`.

export const colors = {
  fieldDeep: '#0F1319',
  field: '#12161C',
  fieldRaised: '#1A1F27',
  line: '#2A3038',
  lineSoft: '#20262E',
  brass: '#C9A227',
  brassHover: '#D9B02E',
  brassDim: '#8F7318',
  brassOn: '#2E2405',
  meridian: '#1F4E8C',
  meridianLight: '#5C8FD6',
  ember: '#A32D2D',
  emberLight: '#C4494A',
  emberText: '#D96B6B',
  paper: '#F2F0EB',
  ash: '#9BA3AD',
  slate: '#7E8288',
} as const;

export const typography = {
  sans: 'Inter_400Regular',
  sansMedium: 'Inter_500Medium',
  mono: 'JetBrainsMono_400Regular',
  monoMedium: 'JetBrainsMono_500Medium',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  screen: 22,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radii = {
  control: 8,
  card: 12,
  device: 26,
  full: 9999,
} as const;

export const typeScale = {
  display: 34,
  title: 25,
  heading: 20,
  body: 15,
  small: 13,
  data: 19,
  label: 11,
} as const;

// Durations in milliseconds; needle values feed a Reanimated spring.
export const motion = {
  instant: 90,
  quick: 150,
  settle: 240,
  arrival: 520,
  commitHold: 10000,
  thinkingMin: 5000,
  thinkingMax: 10000,
  easingStandard: 'cubic-bezier(0.32, 0.72, 0, 1)',
  easingExit: 'cubic-bezier(0.4, 0, 1, 1)',
  needleDamping: 18,
  needleStiffness: 90,
  needleMass: 1.1,
  pressScale: 0.97,
  pressOpacity: 0.9,
} as const;

// Maximum duration in milliseconds for each of the four cues.
export const sound = {
  closeOut: 180,
  bearingMove: 400,
  contractSigned: 500,
  reachNorth: 600,
} as const;

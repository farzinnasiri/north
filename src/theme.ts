// Generated from DESIGN.md by scripts/tokens.mts. Do not edit by hand.
// Change DESIGN.md and run `make tokens`.

export const colors = {
  fieldDeep: '#000000',
  field: '#111416',
  fieldRaised: '#1B1F21',
  line: '#484D50',
  lineSoft: '#292E31',
  brass: '#F03B32',
  brassHover: '#FF554D',
  brassDim: '#7D2B27',
  brassOn: '#090B0C',
  meridian: '#D9DBDA',
  meridianLight: '#FF8B84',
  ember: '#8D1F1B',
  emberLight: '#C94C45',
  emberText: '#FF9A94',
  paper: '#F4F4F0',
  ash: '#B7BAB9',
  slate: '#7F8485',
  signalGold: '#D2A64A',
  signalGoldLight: '#F2D58B',
  signalGoldMuted: '#6F5524',
  signalTide: '#2BB7A8',
  signalTideLight: '#80E0D2',
  signalTideMuted: '#155E59',
  signalCobalt: '#5F7CFF',
  signalCobaltLight: '#A9B6FF',
  signalCobaltMuted: '#2C3D80',
  axisAgency: '#F03B32',
  axisFrame: '#D2A64A',
  axisDesire: '#D96FA7',
  axisConnection: '#2BB7A8',
  axisAppetite: '#8B72E8',
  axisCraft: '#5F7CFF',
  glassFill: '#1B1F21B8',
  glassEdge: '#FFFFFF1F',
  glassHighlight: '#FFFFFF38',
} as const;

export const typography = {
  editorial: 'BarlowCondensed_600SemiBold',
  editorialMedium: 'BarlowCondensed_700Bold',
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
  screen: 24,
  xl: 24,
  xxl: 36,
  xxxl: 56,
} as const;

export const radii = {
  control: 10,
  card: 16,
  glass: 26,
  device: 32,
  full: 9999,
} as const;

export const typeScale = {
  display: 60,
  title: 46,
  heading: 32,
  body: 17,
  small: 14,
  data: 24,
  label: 11,
} as const;

// Durations in milliseconds; needle values feed a Reanimated spring.
export const motion = {
  instant: 90,
  quick: 150,
  settle: 240,
  arrival: 520,
  bootHold: 1200,
  commitHold: 10000,
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
  directionMove: 400,
  reachNorth: 600,
} as const;

import type { Axis } from '@/domains/direction/initial-direction';
import { colors } from '@/theme';

export const AXIS_LABELS: Record<Axis, string> = {
  agency: 'AGENCY',
  appetite: 'SELF-COMMAND',
  connection: 'CONNECTION',
  craft: 'CRAFT',
  desire: 'DESIRE',
  frame: 'FRAME',
};

export const AXIS_COLORS: Record<Axis, string> = {
  agency: colors.axisAgency,
  appetite: colors.axisAppetite,
  connection: colors.axisConnection,
  craft: colors.axisCraft,
  desire: colors.axisDesire,
  frame: colors.axisFrame,
};

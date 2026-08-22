import type { MascotExpression } from '@/domains/mascot/mascot';

const CENTRE = 130;

function roundedRect(cx: number, cy: number, width: number, height: number): number[] {
  const left = cx - width / 2;
  const right = cx + width / 2;
  const top = cy - height / 2;
  const bottom = cy + height / 2;
  return [left, top, cx, top, right, top, right, cy, right, bottom, cx, bottom, left, bottom, left, cy];
}

function rightTriangle(cx: number, cy: number, width: number, height: number): number[] {
  const left = cx - width / 2;
  const right = cx + width / 2;
  const top = cy - height / 2;
  const bottom = cy + height / 2;
  return [left, top, left, top, right, cy, right, cy, left, bottom, left, bottom, left, cy, left, cy];
}

function proudEye(cx: number, cy: number, width: number, height: number): number[] {
  const left = cx - width / 2;
  const right = cx + width / 2;
  const top = cy - height / 2;
  const bottom = cy + height / 2;
  return [left, top, cx, top, right, top, right, cy, right, bottom - 1, cx, bottom - 4, left, bottom - 1, left, cy];
}

function rotatePoints(points: number[], angle: number, cx = CENTRE, cy = CENTRE): number[] {
  const radians = (angle * Math.PI) / 180;
  const cosine = Math.cos(radians);
  const sine = Math.sin(radians);
  const rotated: number[] = [];
  for (let index = 0; index < points.length; index += 2) {
    const x = points[index] - cx;
    const y = points[index + 1] - cy;
    rotated.push(cx + x * cosine - y * sine, cy + x * sine + y * cosine);
  }
  return rotated;
}

const NORTH_NEEDLE = [130, 78, 134, 99, 136, 122, 133, 128, 130, 132, 127, 128, 124, 122, 126, 99];
const SOUTH_NEEDLE = [130, 128, 134, 134, 136, 138, 134, 158, 130, 182, 126, 158, 124, 138, 126, 134];

export const ACKNOWLEDGEMENT_LEFT = roundedRect(100, 113, 31, 5);
export const ACKNOWLEDGEMENT_RIGHT = roundedRect(160, 113, 31, 5);

export type EyeTarget = { curve: number; left: number[]; right: number[] };

export function eyeTargetFor(expression: MascotExpression, bearing: number): EyeTarget {
  const straight = { curve: 0 };
  switch (expression) {
    case 'focused':
      return { ...straight, left: roundedRect(100, 113, 29, 21), right: roundedRect(160, 113, 29, 21) };
    case 'loading':
      return { ...straight, left: roundedRect(100, 113, 30, 10), right: roundedRect(160, 113, 30, 10) };
    case 'proud':
      return { curve: 1, left: proudEye(100, 111, 31, 21), right: proudEye(160, 111, 31, 21) };
    case 'sad':
      return {
        ...straight,
        left: rotatePoints(roundedRect(100, 115, 25, 21), -8, 100, 115),
        right: rotatePoints(roundedRect(160, 115, 25, 21), 8, 160, 115),
      };
    case 'concerned':
      return { ...straight, left: roundedRect(100, 109, 23, 23), right: roundedRect(160, 115, 28, 28) };
    case 'tired':
      return { ...straight, left: roundedRect(100, 116, 29, 7), right: roundedRect(160, 116, 29, 7) };
    case 'direction':
      return { ...straight, left: rightTriangle(100, 112, 30, 29), right: rightTriangle(160, 112, 30, 29) };
    case 'compass':
      return {
        ...straight,
        left: rotatePoints(NORTH_NEEDLE, bearing),
        right: rotatePoints(SOUTH_NEEDLE, bearing),
      };
    case 'settled':
      return { ...straight, left: roundedRect(100, 113, 22, 22), right: roundedRect(160, 113, 22, 22) };
    default:
      return { ...straight, left: roundedRect(100, 112, 27, 27), right: roundedRect(160, 112, 27, 27) };
  }
}

export function eyePath(points: number[], curve: number): string {
  'worklet';
  let path = `M ${points[0]} ${points[1]}`;
  for (let index = 2; index <= 8; index += 2) {
    path += ` L ${points[index]} ${points[index + 1]}`;
  }
  const firstControlX = (points[8] + points[10]) / 2;
  const firstControlY = (points[9] + points[11]) / 2;
  const secondControlX = (points[10] + points[12]) / 2;
  const secondControlY = (points[11] + points[13]) / 2;
  const curvedFirstY = firstControlY + (points[11] - firstControlY) * curve;
  const curvedSecondY = secondControlY + (points[11] - secondControlY) * curve;
  return `${path} Q ${firstControlX} ${curvedFirstY} ${points[10]} ${points[11]} Q ${secondControlX} ${curvedSecondY} ${points[12]} ${points[13]} L ${points[14]} ${points[15]} Z`;
}

function interpolate(from: number[], to: number[], progress: number): number[] {
  'worklet';
  return from.map((value, index) => value + (to[index] - value) * progress);
}

export function morphPoints(
  from: number[],
  via: number[],
  to: number[],
  progress: number,
  throughVia: number,
): number[] {
  'worklet';
  if (throughVia === 0) return interpolate(from, to, progress);
  const viaStop = 0.45;
  return progress < viaStop
    ? interpolate(from, via, progress / viaStop)
    : interpolate(via, to, (progress - viaStop) / (1 - viaStop));
}

export function morphValue(
  from: number,
  via: number,
  to: number,
  progress: number,
  throughVia: number,
): number {
  'worklet';
  if (throughVia === 0) return from + (to - from) * progress;
  const viaStop = 0.45;
  return progress < viaStop
    ? from + (via - from) * (progress / viaStop)
    : via + (to - via) * ((progress - viaStop) / (1 - viaStop));
}


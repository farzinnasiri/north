import Svg, { Circle, G, Path } from 'react-native-svg';

export function GearMark({ color, size = 26 }: { color: string; size?: number }) {
  return (
    <Svg height={size} viewBox="0 0 24 24" width={size}>
      <G transform="translate(0 -1)">
        <Path
          d="M10.2 2.5H13.8L14.35 5A7.4 7.4 0 0 1 16 5.68L18.15 4.3L20.7 6.85L19.32 9A7.4 7.4 0 0 1 20 10.65L22.5 11.2V14.8L20 15.35A7.4 7.4 0 0 1 19.32 17L20.7 19.15L18.15 21.7L16 20.32A7.4 7.4 0 0 1 14.35 21L13.8 23.5H10.2L9.65 21A7.4 7.4 0 0 1 8 20.32L5.85 21.7L3.3 19.15L4.68 17A7.4 7.4 0 0 1 4 15.35L1.5 14.8V11.2L4 10.65A7.4 7.4 0 0 1 4.68 9L3.3 6.85L5.85 4.3L8 5.68A7.4 7.4 0 0 1 9.65 5Z"
          fill="none"
          stroke={color}
          strokeLinejoin="round"
          strokeWidth="1.45"
        />
        <Circle cx="12" cy="13" fill="none" r="3.35" stroke={color} strokeWidth="1.45" />
      </G>
    </Svg>
  );
}

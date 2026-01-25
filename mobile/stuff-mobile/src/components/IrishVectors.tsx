import React from 'react';
import Svg, { Path, Ellipse, G, Circle, Line, Rect } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
  style?: any;
}

// Shamrock (Trevo Irlandês)
export const ShamrockIcon = ({ size = 24, color = '#059669', style }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 100 100" style={style}>
    <Path
      d="M50 85c0 0-3-12-3-18c0-4 2-7 3-8c1 1 3 4 3 8c0 6-3 18-3 18z"
      fill={color}
    />
    <Ellipse cx="35" cy="45" rx="18" ry="20" fill={color} transform="rotate(-30 35 45)" />
    <Ellipse cx="65" cy="45" rx="18" ry="20" fill={color} transform="rotate(30 65 45)" />
    <Ellipse cx="50" cy="30" rx="18" ry="20" fill={color} />
  </Svg>
);

// Four Leaf Clover (Trevo de 4 Folhas)
export const FourLeafClover = ({ size = 24, color = '#059669', style }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 100 100" style={style}>
    <Path
      d="M50 90c0 0-2-15-2-20c0-3 1-5 2-6c1 1 2 3 2 6c0 5-2 20-2 20z"
      fill={color}
    />
    <Ellipse cx="35" cy="50" rx="16" ry="18" fill={color} transform="rotate(-45 35 50)" />
    <Ellipse cx="65" cy="50" rx="16" ry="18" fill={color} transform="rotate(45 65 50)" />
    <Ellipse cx="50" cy="35" rx="16" ry="18" fill={color} />
    <Ellipse cx="50" cy="65" rx="16" ry="18" fill={color} />
  </Svg>
);

// Irish Harp (Harpa Irlandesa)
export const HarpIcon = ({ size = 24, color = '#f59e0b', style }: IconProps) => (
  <Svg width={size} height={size * 1.33} viewBox="0 0 60 80" style={style}>
    <Path
      d="M30 5C15 5 5 25 5 45C5 55 10 65 20 70L20 75L40 75L40 70C50 65 55 55 55 45C55 25 45 5 30 5ZM30 15C35 15 40 30 40 45C40 50 38 55 35 58L35 65L25 65L25 58C22 55 20 50 20 45C20 30 25 15 30 15Z"
      fill={color}
    />
    <Line x1="25" y1="25" x2="25" y2="60" stroke={color} strokeWidth="1" />
    <Line x1="30" y1="20" x2="30" y2="62" stroke={color} strokeWidth="1" />
    <Line x1="35" y1="25" x2="35" y2="60" stroke={color} strokeWidth="1" />
  </Svg>
);

// Dublin Skyline
export const DublinSkyline = ({ size = 200, color = '#064e3b', style }: IconProps) => (
  <Svg width={size} height={size / 4} viewBox="0 0 400 100" style={style}>
    {/* Spire */}
    <Path d="M200 0L202 80H198L200 0Z" fill={color} />
    {/* Buildings */}
    <Rect x="20" y="50" width="30" height="50" fill={color} />
    <Rect x="55" y="40" width="25" height="60" fill={color} />
    <Rect x="85" y="55" width="20" height="45" fill={color} />
    <Rect x="110" y="35" width="35" height="65" fill={color} />
    <Rect x="150" y="45" width="25" height="55" fill={color} />
    {/* Ha'penny Bridge */}
    <Path d="M230 80 Q260 60 290 80" fill="none" stroke={color} strokeWidth="3" />
    {/* More buildings */}
    <Rect x="300" y="40" width="30" height="60" fill={color} />
    <Rect x="335" y="50" width="25" height="50" fill={color} />
    <Rect x="365" y="35" width="35" height="65" fill={color} />
  </Svg>
);

// Ha'penny Bridge
export const HapennyBridge = ({ size = 100, color = '#059669', style }: IconProps) => (
  <Svg width={size} height={size * 0.6} viewBox="0 0 100 60" style={style}>
    <Path d="M10 50 Q50 10 90 50" fill="none" stroke={color} strokeWidth="3" />
    <Line x1="10" y1="50" x2="10" y2="60" stroke={color} strokeWidth="3" />
    <Line x1="90" y1="50" x2="90" y2="60" stroke={color} strokeWidth="3" />
    <Line x1="30" y1="32" x2="30" y2="50" stroke={color} strokeWidth="2" />
    <Line x1="50" y1="20" x2="50" y2="50" stroke={color} strokeWidth="2" />
    <Line x1="70" y1="32" x2="70" y2="50" stroke={color} strokeWidth="2" />
  </Svg>
);

// Irish Flag Bar
export const IrishFlagBar = ({ width = 100, height = 8, style }: { width?: number; height?: number; style?: any }) => (
  <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={style}>
    <Rect x="0" y="0" width={width / 3} height={height} fill="#059669" />
    <Rect x={width / 3} y="0" width={width / 3} height={height} fill="#ffffff" />
    <Rect x={(width / 3) * 2} y="0" width={width / 3} height={height} fill="#f59e0b" />
  </Svg>
);

export default {
  ShamrockIcon,
  FourLeafClover,
  HarpIcon,
  DublinSkyline,
  HapennyBridge,
  IrishFlagBar,
};

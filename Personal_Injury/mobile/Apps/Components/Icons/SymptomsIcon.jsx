import React from 'react';
import Svg, { Path, G, Rect } from 'react-native-svg';

export const SymptomsIcon = ({ isActive = false }) => {
  const color = isActive ? '#00B8DF' : '#939598';
  return (
    <Svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <G>
        <Path d="M22 4H10C8.9 4 8 4.9 8 6V26C8 27.1 8.9 28 10 28H22C23.1 28 24 27.1 24 26V6C24 4.9 23.1 4 22 4Z" fill="#FFFFFF" />
        <Rect x="10" y="8" width="12" height="2" fill="#4CAF50" />
        <Rect x="10" y="12" width="12" height="2" fill="#00B8DF" />
        <Rect x="10" y="16" width="12" height="2" fill="#673AB7" />
        <Rect x="10" y="20" width="8" height="2" fill="#F44336" />
        <Path d="M6 8H4V10H6V8Z" fill="#4CAF50" />
        <Path d="M6 12H4V14H6V12Z" fill="#00B8DF" />
        <Path d="M6 16H4V18H6V16Z" fill="#673AB7" />
        <Path d="M6 20H4V22H6V20Z" fill="#F44336" />
      </G>
    </Svg>
  );
};
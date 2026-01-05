import React from 'react';
import Svg, { Path, G } from 'react-native-svg';

export const SleepIcon = ({ isActive = false }) => {
  const color = isActive ? '#00B8DF' : '#939598';
  return (
    <Svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <G>
        <Path d="M16 6C10.48 6 6 10.48 6 16C6 21.52 10.48 26 16 26C21.52 26 26 21.52 26 16C26 10.48 21.52 6 16 6ZM9 18H12L9 22H12" stroke="#00B8DF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M14 14H19L14 20H19" stroke="#00B8DF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </G>
    </Svg>
  );
};
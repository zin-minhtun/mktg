import React from 'react';
import Svg, { Path, G } from 'react-native-svg';

export const WeightIcon = ({ isActive = false }) => {
  const color = isActive ? '#00B8DF' : '#939598';
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <G>
        <Path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3Z" fill="#E0E0E0" />
        <Path d="M12 7C10.9 7 10 7.9 10 9C10 10.1 10.9 11 12 11C13.1 11 14 10.1 14 9C14 7.9 13.1 7 12 7Z" fill="#9E9E9E" />
        <Path d="M12 12C9.33 12 4 13.34 4 16V19H20V16C20 13.34 14.67 12 12 12Z" fill="#9E9E9E" />
      </G>
    </Svg>
  );
};
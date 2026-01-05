import React from 'react';
import Svg, { Path, G } from 'react-native-svg';

export const MedicationIcon = ({ isActive = false }) => {
  const color = isActive ? '#00B8DF' : '#939598';
  return (
    <Svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <G>
        <Path d="M24 4H8C6.9 4 6 4.9 6 6V26C6 27.1 6.9 28 8 28H24C25.1 28 26 27.1 26 26V6C26 4.9 25.1 4 24 4Z" fill="#4CAF50" />
        <Path d="M21 14H17V10H15V14H11V16H15V20H17V16H21V14Z" fill="#FFFFFF" />
      </G>
    </Svg>
  );
};
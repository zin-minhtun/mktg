import React from 'react';
import Svg, { Path, Circle, G } from 'react-native-svg';

export const LifestyleIcon = ({ isActive = false }) => {
  const color = isActive ? '#00B8DF' : '#939598';
  return (
    <Svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <G>
        <Path d="M8 20H5V28H8V20Z" fill="#FFD700" />
        <Path d="M16 16H13V28H16V16Z" fill="#FFD700" />
        <Path d="M24 12H21V28H24V12Z" fill="#FFD700" />
        <Path d="M22 4C19.79 4 18 5.79 18 8C18 10.21 19.79 12 22 12C24.21 12 26 10.21 26 8C26 5.79 24.21 4 22 4ZM22 10C20.9 10 20 9.1 20 8C20 6.9 20.9 6 22 6C23.1 6 24 6.9 24 8C24 9.1 23.1 10 22 10Z" fill="#FFD700" />
        <Path d="M15 8C15 5.79 13.21 4 11 4C8.79 4 7 5.79 7 8C7 10.21 8.79 12 11 12C13.21 12 15 10.21 15 8ZM11 10C9.9 10 9 9.1 9 8C9 6.9 9.9 6 11 6C12.1 6 13 6.9 13 8C13 9.1 12.1 10 11 10Z" fill="#FFD700" />
        <Path d="M21 15C18.79 15 17 16.79 17 19C17 21.21 18.79 23 21 23C23.21 23 25 21.21 25 19C25 16.79 23.21 15 21 15Z" fill="#4CAF50" />
      </G>
    </Svg>
  );
};
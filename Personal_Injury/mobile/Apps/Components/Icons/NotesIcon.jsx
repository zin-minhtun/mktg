import React from 'react';
import Svg, { Path, G } from 'react-native-svg';

export const NotesIcon = ({ isActive = false }) => {
  const color = isActive ? '#00B8DF' : '#939598';
  return (
    <Svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <G>
        <Path d="M24 4H8C6.9 4 6 4.9 6 6V26C6 27.1 6.9 28 8 28H24C25.1 28 26 27.1 26 26V6C26 4.9 25.1 4 24 4Z" fill="#00B8DF" />
        <Path d="M21 8H11V10H21V8Z" fill="#FFFFFF" />
        <Path d="M21 12H11V14H21V12Z" fill="#FFFFFF" />
        <Path d="M21 16H11V18H21V16Z" fill="#FFFFFF" />
        <Path d="M17 20H11V22H17V20Z" fill="#FFFFFF" />
        <Path d="M24 22L21 19V22H24Z" fill="#00A0C6" />
      </G>
    </Svg>
  );
};
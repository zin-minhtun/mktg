import React from 'react';
import Svg, { Path, G, Circle } from 'react-native-svg';

export const MoodIcon = ({ isActive = false }) => {
  const color = isActive ? '#00B8DF' : '#939598';
  return (
    <Svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <G>
        <Circle cx="11" cy="15" r="9" fill="#FFD700" />
        <Path d="M11 20C13.21 20 15 18.21 15 16H7C7 18.21 8.79 20 11 20Z" fill="#783400" />
        <Circle cx="8" cy="13" r="1.5" fill="#783400" />
        <Circle cx="14" cy="13" r="1.5" fill="#783400" />
        <Circle cx="23" cy="13" r="9" fill="#00B8DF" />
        <Path d="M23 18C20.79 18 19 16.21 19 14H27C27 16.21 25.21 18 23 18Z" transform="rotate(180 23 16)" fill="#003361" />
        <Circle cx="20" cy="11" r="1.5" fill="#003361" />
        <Circle cx="26" cy="11" r="1.5" fill="#003361" />
      </G>
    </Svg>
  );
};
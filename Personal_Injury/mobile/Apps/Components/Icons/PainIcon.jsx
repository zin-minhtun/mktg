import React from 'react';
import Svg, { Path, G } from 'react-native-svg';

export const PainIcon = ({ isActive = false }) => {
  const color = isActive ? '#00B8DF' : '#939598';
  return (
    <Svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <G>
        <Path d="M16 6C10.48 6 6 10.48 6 16C6 21.52 10.48 26 16 26C21.52 26 26 21.52 26 16C26 10.48 21.52 6 16 6ZM16 24C11.58 24 8 20.42 8 16C8 11.58 11.58 8 16 8C20.42 8 24 11.58 24 16C24 20.42 20.42 24 16 24Z" fill="#FFCC80" />
        <Path d="M16 16C17.1 16 18 15.1 18 14C18 12.9 17.1 12 16 12C14.9 12 14 12.9 14 14C14 15.1 14.9 16 16 16Z" fill="#FF5722" />
        <Path d="M19.5 19.5L16 16L12.5 19.5" stroke="#FF5722" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M16 16V22" stroke="#FF5722" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M13 8L11.5 6" stroke="#FFCC80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M19 8L20.5 6" stroke="#FFCC80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </G>
    </Svg>
  );
};
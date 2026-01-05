import React from 'react';
import Svg, { Path } from 'react-native-svg';

const MoonIcon = ({ color = '#003361', width = 24, height = 24 }) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M21.5287 15.9294C20.7486 16.2945 19.9023 16.5 19.0178 16.5C15.5172 16.5 12.6816 13.6645 12.6816 10.1639C12.6816 7.90493 13.8683 5.91576 15.6641 4.78931C15.2599 4.71923 14.8435 4.68293 14.418 4.68293C10.4033 4.68293 7.14062 7.94565 7.14062 11.9603C7.14062 15.975 10.4033 19.2377 14.418 19.2377C17.6332 19.2377 20.3461 17.9757 21.5287 15.9294Z"
        fill={color}
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default MoonIcon;
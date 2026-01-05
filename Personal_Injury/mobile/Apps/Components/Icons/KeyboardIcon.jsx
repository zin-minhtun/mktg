import React from "react";
import Svg, { Path, Rect } from "react-native-svg";

const KeyboardIcon = ({ color = "white" }) => {
  return (
    <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <Rect 
        x="2" 
        y="6" 
        width="20" 
        height="12" 
        rx="2" 
        stroke={color} 
        strokeWidth="2" 
        fill="none" 
      />
      <Path
        d="M6 10H6.01"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Path
        d="M10 10H10.01"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Path
        d="M14 10H14.01"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Path
        d="M18 10H18.01"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Path
        d="M6 14H6.01"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Path
        d="M10 14H10.01"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Path
        d="M14 14H14.01"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Path
        d="M18 14H18.01"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Path
        d="M7 18H17"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default KeyboardIcon;
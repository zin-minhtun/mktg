import React from 'react';
import Svg, { Path, G } from 'react-native-svg';

export const FluidIntakeIcon = ({ isActive = false }) => {
  const color = isActive ? '#00B8DF' : '#939598';
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <G>
        <Path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="#00B8DF" />
        <Path d="M15 7H9V17H15V7Z" fill="#00B8DF" opacity="0.5" />
        <Path d="M15 12H9V17H15V12Z" fill="#00B8DF" />
      </G>
    </Svg>
  );
};

export default {
  LifestyleIcon,
  MedicationIcon,
  MoodIcon,
  NotesIcon,
  PainIcon,
  SleepIcon,
  SymptomsIcon,
  WeightIcon,
  FluidIntakeIcon
};
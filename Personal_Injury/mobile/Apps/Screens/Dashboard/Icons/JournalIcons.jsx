import React from 'react';
import { Image } from 'react-native';

// PNG based icon components
export const LifestyleIcon = ({ size = 30 }) => (
  <Image 
    source={require('../../NavigatorTabs/icons/lifestyle.png')} 
    style={{ width: size, height: size }}
    resizeMode="contain"
  />
);

export const MedicationsIcon = ({ size = 30 }) => (
  <Image 
    source={require('../../NavigatorTabs/icons/medications.png')} 
    style={{ width: size, height: size }}
    resizeMode="contain"
  />
);

export const MoodIcon = ({ size = 30 }) => (
  <Image 
    source={require('../../NavigatorTabs/icons/mood.png')} 
    style={{ width: size, height: size }}
    resizeMode="contain"
  />
);

export const NotesIcon = ({ size = 30 }) => (
  <Image 
    source={require('../../NavigatorTabs/icons/notes.png')} 
    style={{ width: size, height: size }}
    resizeMode="contain"
  />
);

export const PainIcon = ({ size = 30 }) => (
  <Image 
    source={require('../../NavigatorTabs/icons/Headache.png')} 
    style={{ width: size, height: size }}
    resizeMode="contain"
  />
);

export const SleepIcon = ({ size = 30 }) => (
  <Image 
    source={require('../../NavigatorTabs/icons/sleep.png')} 
    style={{ width: size, height: size }}
    resizeMode="contain"
  />
);

export const SymptomsIcon = ({ size = 30 }) => (
  <Image 
    source={require('../../NavigatorTabs/icons/Symptomps.png')} 
    style={{ width: size, height: size }}
    resizeMode="contain"
  />
);
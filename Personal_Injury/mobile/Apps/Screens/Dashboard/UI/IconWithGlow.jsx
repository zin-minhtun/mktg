import React from 'react';
import { View, StyleSheet } from 'react-native';

const IconWithGlow = ({ icon, isDarkMode }) => {
  return (
    <View style={styles.container}>
      {/* Outer glow effect - larger in dark mode to match design */}
      <View style={[
        styles.outerGlow, 
        { 
          backgroundColor: isDarkMode ? 'rgba(0, 184, 223, 0.15)' : '#E6F7FB',
          width: isDarkMode ? 120 : 100,
          height: isDarkMode ? 120 : 100,
        }
      ]} />
      
      {/* Middle blue ring */}
      <View style={[
        styles.middleRing,
        {
          backgroundColor: isDarkMode ? 'rgba(0, 184, 223, 0.3)' : 'rgba(0, 184, 223, 0.1)',
          borderColor: isDarkMode ? 'rgba(0, 184, 223, 0.2)' : 'rgba(0, 184, 223, 0.2)',
        }
      ]} />
      
      {/* White circle */}
      <View style={[
        styles.whiteCircle, 
        { 
          backgroundColor: isDarkMode ? '#001527' : 'white',
          borderColor: isDarkMode ? 'rgba(0, 184, 223, 0.4)' : '#E6F7FB',
        }
      ]}>
        {/* Inner blue ring - subtle in dark mode */}
        <View style={[
          styles.innerBlueRing, 
          { 
            borderColor: isDarkMode ? 'rgba(0, 184, 223, 0.4)' : '#E6F7FB',
            opacity: isDarkMode ? 0.6 : 0.5,
          }
        ]} />
        
        {/* Icon container - darker in dark mode to match design */}
        <View style={[
          styles.iconContainer,
          { 
            backgroundColor: isDarkMode ? '#00192F' : 'white',
            borderWidth: isDarkMode ? 1 : 0,
            borderColor: isDarkMode ? 'rgba(0, 184, 223, 0.4)' : 'transparent',
          }
        ]}>
          {icon}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center'
  },
  outerGlow: {
    position: 'absolute',
    borderRadius: 60,
    opacity: 0.9,
    shadowColor: '#00B8DF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8
  },
  middleRing: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
  },
  whiteCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 2
  },
  innerBlueRing: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1
  }
});

export default IconWithGlow;
import React from 'react';
import { View, Text, TouchableOpacity, Switch } from 'react-native';
import { useTheme } from '../../../Contexts/ThemeContext';
import BackIcon from '../../Icons/BackIcon';
import NotificationIcon from '../../Icons/NotificationIcon';

const MealHeader = ({ title = 'Meal', navigation }) => {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme.background === '#00192F';
  
  const handleBackPress = () => {
    if (navigation && navigation.canGoBack()) {
      navigation.goBack();
    } else if (navigation) {
      navigation.navigate('JournalHome');
    }
  };
  
  const handleNotificationPress = () => {
    // Handle notification press
    console.log('Notification pressed');
  };
  
  return (
    <View className="flex-row justify-between items-center px-5 pt-3 pb-1">
      {/* Back button */}
      <TouchableOpacity onPress={handleBackPress}>
        <BackIcon isActive={false} color={isDarkMode ? theme.primaryLighBlue : undefined} />
      </TouchableOpacity>
      
      {/* Title */}
      <Text 
        className="text-xl font-bold text-primaryDarkBlue"
        style={{ color: theme.textColor }}
      >
        {title}
      </Text>
      
      {/* Right side: Notification icon and Dark Mode toggle */}
      <View className="flex-row items-center">
        {/* Dark mode toggle */}
        <View className="flex-row items-center mr-3">
          <Text 
            className="mr-1 text-xs text-gray-500"
            style={{ color: theme.darkGrey }}
          >
            Dark
          </Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={"#f4f3f4"} 
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleTheme}
            value={isDarkMode}
            style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }} // Make switch slightly smaller
          />
        </View>
        
        {/* Notification icon */}
        <TouchableOpacity onPress={handleNotificationPress}>
          <NotificationIcon isActive={isDarkMode} iconColor={isDarkMode ? theme.primaryLighBlue : undefined} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MealHeader;
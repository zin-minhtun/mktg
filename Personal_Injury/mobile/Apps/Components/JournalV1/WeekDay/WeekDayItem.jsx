import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import dayjs from 'dayjs';
import { useTheme } from '../../../Contexts/ThemeContext';

export const WeekDayItem = ({ item, selectedDate, setSelectedDate }) => {
  const { theme } = useTheme();
  const isSelected = item === selectedDate;
  const dayName = dayjs(item).format("ddd");
  const dayNumber = dayjs(item).format("DD");
  
  const isDarkMode = theme.background === '#00192F';
  
  return (
    <TouchableOpacity
      onPress={() => setSelectedDate(item)}
      className="rounded-lg overflow-hidden"
      style={{
        width: 55,
        height: 70,
        backgroundColor: isSelected ? '#E6F4FF' : '#FFFFFF',
        borderWidth: 1,
        borderColor: isSelected ? '#00AEEF' : '#E6E6E6',
      }}
    >
      <View className="flex-1 justify-center items-center">
        <Text 
          className="font-raleway"
          style={{ 
            color: isSelected ? '#00AEEF' : '#666666'
          }}
        >
          {dayName}
        </Text>
        <Text
          className="text-center font-ralewayBold text-2xl"
          style={{ 
            color: isSelected ? '#00AEEF' : '#1F2937'
          }}
        >
          {dayNumber}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default WeekDayItem;

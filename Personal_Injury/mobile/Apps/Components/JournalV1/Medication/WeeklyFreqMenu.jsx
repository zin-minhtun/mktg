import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "../../../Contexts/ThemeContext";

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const WeeklyFreqMenu = ({ days: selectedDays = [], onToggleDay }) => {
  const { theme } = useTheme();
  return (
    <View className="px-4 py-2" style={{ backgroundColor: theme.textFieldBG }}>
      <View className="flex-row flex-wrap">
        {days.map((d) => {
          const selected = selectedDays.includes(d);
          return (
            <TouchableOpacity
              key={d}
              onPress={() => onToggleDay(d)}
              className={`border rounded-lg px-3 mr-3 mb-3`}
              style={{
                backgroundColor: selected ? theme.primaryLighBlue : theme.textFieldBG,
                borderColor: selected ? theme.primaryLighBlue : theme.borderColor
              }}
            >
              <Text
                className={`font-raleway py-2 text-[16px]`}
                style={{ color: selected ? '#FFFFFF' : theme.darkGrey }}
              >
                {d}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default WeeklyFreqMenu;

import React from "react";
import { View, Text } from "react-native";
import { useTheme } from "../../../Contexts/ThemeContext";

const DailyFreqMenu = () => {
  const { theme } = useTheme();
  return (
    <View className="px-4 py-2" style={{ backgroundColor: theme.textFieldBG }}>
      <Text className="font-raleway text-[16px]" style={{ color: theme.darkGrey }}>Every day</Text>
    </View>
  );
};

export default DailyFreqMenu;

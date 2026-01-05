import React from "react";
import { View, Text, TextInput } from "react-native";
import { useTheme } from "../../../Contexts/ThemeContext";

const MonthlyFreqMenu = ({ dayOfMonth, onChange }) => {
  const { theme } = useTheme();
  return (
    <View className="px-4 py-2" style={{ backgroundColor: theme.textFieldBG }}>
      <Text className="mb-2 font-raleway" style={{ color: theme.textColor }}>Day of month (1-31)</Text>
      <TextInput
        className="font-raleway text-[16px] border rounded-lg p-2 px-5 py-3"
        style={{
          backgroundColor: theme.textFieldBG,
          borderColor: theme.borderColor,
          color: theme.textColor
        }}
        placeholder="1"
        placeholderTextColor={theme.darkGrey}
        keyboardType="numeric"
        inputMode="numeric"
        value={dayOfMonth ? String(dayOfMonth) : ''}
        onChangeText={onChange}
        maxLength={2}
      />
    </View>
  );
};

export default MonthlyFreqMenu;

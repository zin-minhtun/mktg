import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import ArrowDown from "../../Components/Icons/ArrowDown";
import ArrowUp from "../../Components/Icons/ArrowUp";
import { useTheme } from "../../Contexts/ThemeContext";

const PickerButton = ({ isMenuVisible, onPress, children }) => {
  const { theme } = useTheme();

  const pressHandler = () => {
    onPress();
  }

  return (
    <TouchableOpacity
      onPress={pressHandler}
      className={`border rounded-lg px-3 flex-[1]`}
      style={{
        backgroundColor: theme.textFieldBG,
        borderColor: theme.borderColor
      }}
    >
      <View className="flex flex-row justify-between">
        <Text
          className="font-raleway py-3 text-[16px]"
          style={{ color: children ? theme.textColor : theme.darkGrey }}
        >
          {children}
        </Text>
        <View className="pl-6 py-3">
          {isMenuVisible ? <ArrowUp color={theme.textColor} /> : <ArrowDown color={theme.darkGrey} />}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default PickerButton;
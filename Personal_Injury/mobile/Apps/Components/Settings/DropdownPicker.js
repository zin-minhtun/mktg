// DropdownPicker.js
import React from "react";
import { View, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";
import RNPickerSelect from 'react-native-picker-select';
import { AntDesign } from '@expo/vector-icons'; // For custom dropdown icon
import { useTheme } from "../../Contexts/ThemeContext";

export default function DropdownPicker({
  selectedValue,
  onValueChange,
  items,
  label,
}) {
  const { theme, toggleTheme } = useTheme();

  return (
    <View className="flex-1">
      {label && (
        <Text style={{ color: theme.textColor }} className="text-base mb-2">
          {label}
        </Text>
      )}
      <View
        style={{
          borderColor: theme.borderColor,
        }}
        className="border rounded-lg"
      >
        <RNPickerSelect
          onValueChange={onValueChange}
          items={items}
          value={selectedValue}
          style={{
            inputIOS: {
              color: theme.textColor, // Text color for iOS
              backgroundColor: theme.textFieldBG, // Background for iOS
            },
            inputAndroid: {
              color: theme.textColor, // Text color for Android
              backgroundColor: theme.textFieldBG, // Background for Android
            },
            placeholder: {
              color: theme.textColor, // Placeholder color
            },
            iconContainer: {
              top: 15, // Adjust to vertically center the icon
              right: 5, // Set margin-right of 5px
            },
          }}
          Icon={() => (
            <AntDesign name="down" size={24} color={theme.textColor} 
            style={{
              position: 'absolute', // Make the icon position absolute
              right: 5, // Adjust margin-right here
              alignSelf: 'center', // Vertically center the icon
            }}
            />
          )} // Custom dropdown icon
        />
        {/* <Picker
          selectedValue={selectedValue}
          onValueChange={onValueChange}
        >
          {items.map((item) => (
            <Picker.Item key={item.value} label={item.label} value={item.value} color={theme.textColor}/>
          ))}
        </Picker> */}
      </View>
    </View>
  );
}

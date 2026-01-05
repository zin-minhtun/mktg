import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "../../Contexts/ThemeContext";

import PickerButton from "./PickerButton";

function OneSelectDropDownPicker({ placeHolder, optionList, onChange }) {
  const { theme } = useTheme();
  const [showPicker, setShowPicker] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionSelect = (option) => {
    setSelectedOption(option); // Set the selected option
    setShowPicker(false); // Close dropdown
    if (onChange) onChange(option.value); // Optional callback for external handling
  };

  const onPressHandler = () => {
    setShowPicker(!showPicker);
  }

  return (
    <>
      <PickerButton isMenuVisible={showPicker} onPress={onPressHandler} >
        {selectedOption ? selectedOption.label : placeHolder}
      </PickerButton>

      {showPicker && (
        <>
          <View
            className="flex-1 p-4 space-y-3 mt-1 rounded-lg"
            style={{ backgroundColor: theme.textFieldBG }}
          >
            {optionList.map((option, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleOptionSelect(option)}
              >
                <Text
                  className="ml-2 font-raleway text-[16px]"
                  style={{ color: theme.textColor }}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}
    </>
  );
}

export default OneSelectDropDownPicker;

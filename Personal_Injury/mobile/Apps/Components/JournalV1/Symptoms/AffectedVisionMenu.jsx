import { View, Text, TouchableOpacity, TextInput } from "react-native";
import React, { useState, useEffect } from "react";
import { styled } from "nativewind";
import { useTheme } from "../../../Contexts/ThemeContext"; // Path to your theme context

// Components
import ArrowRight from "../../Icons/ArrowRight";
import ArrowDown from "../../Icons/ArrowDown";
import AudioInputIcon from "../../Icons/AudioInputIcon";
import CheckIcon from "../../Icons/CheckIcon";
import CrossIcon from "../../Icons/CrossIcon";

const StyledTextInput = styled(TextInput);

// Reusable RadioButton updated for Dark Mode
const RadioButton = ({ value, status, onPress, theme }) => (
  <TouchableOpacity onPress={onPress} style={{ flexDirection: "row", alignItems: "center" }}>
    <View
      style={{
        width: 23,
        height: 23,
        borderRadius: 13,
        borderWidth: 2,
        borderColor: "#00b8df", // Keeping primary blue for the ring
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {status === "checked" && (
        <View
          style={{
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: "#00b8df",
          }}
        />
      )}
    </View>
    <Text style={{ marginLeft: 8, color: theme.textColor }}>{value}</Text>
  </TouchableOpacity>
);

const AffectedVisionMenu = ({ onUpdate, initialData }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [types, setTypes] = useState(initialData?.types || []);
  const [duration, setDuration] = useState(initialData?.duration || null);
  const [contexts, setContexts] = useState(initialData?.contexts || []);
  const [notes, setNotes] = useState(initialData?.notes || "");
  
  const { theme } = useTheme(); // Pull the theme object

  useEffect(() => {
    if (onUpdate) {
      onUpdate({
        types,
        duration,
        contexts,
        notes,
      });
    }
  }, [types, duration, contexts, notes]);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const toggleSelection = (array, setArray, option) => {
    if (array.includes(option)) {
      setArray(array.filter((item) => item !== option));
    } else {
      setArray([...array, option]);
    }
  };

  return (
    <>
      {/* Collapsible Header */}
      <View 
        className="border rounded-lg px-3" 
        style={{ 
            backgroundColor: isExpanded ? (theme.primaryLightBlue || theme.textFieldBG) : theme.textFieldBG,
            borderColor: isExpanded ? theme.primaryBlue : theme.borderColor
        }}
      >
        <View className="flex flex-row justify-between">
          <Text className="font-ralewaySemiBold py-3 text-[16px]" style={{ color: theme.textColor }}>
            Affected Vision
          </Text>
          <TouchableOpacity onPress={toggleExpand}>
            <View className="pl-6 py-3">
              {isExpanded ? 
                <ArrowDown stroke={theme.textColor} /> : 
                <ArrowRight stroke={theme.textColor} />
              }
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Expanded Content */}
      {isExpanded && (
        <View className="p-5 mt-4 rounded-lg" style={{ backgroundColor: theme.textFieldBG }}>
          {/* Type of Vision Issue */}
          <View className="mt-3">
            <Text className="font-ralewaySemiBold mb-3 text-[16px]" style={{ color: theme.textColor }}>
              What kind of vision issue are you experiencing?
            </Text>
            <View className="flex flex-row flex-wrap">
              {["Blurry vision", "Double vision", "Loss of focus", "Light flashes", "Temporary blindness", "Other"].map((option) => (
                <View key={option} className="mr-3 flex flex-row mb-4">
                  <RadioButton
                    value={option}
                    status={types.includes(option) ? "checked" : "unchecked"}
                    onPress={() => toggleSelection(types, setTypes, option)}
                    theme={theme}
                  />
                </View>
              ))}
            </View>
          </View>

          {/* Duration */}
          <View className="mt-3">
            <Text className="font-ralewaySemiBold mb-3 text-[16px]" style={{ color: theme.textColor }}>
              How long does it last when it happens?
            </Text>
            <View className="flex flex-row flex-wrap">
              {["A few seconds", "A few minutes", "More than 10 minutes", "Constant", "Unsure"].map((option) => (
                <View key={option} className="mr-3 flex flex-row mb-4">
                  <RadioButton
                    value={option}
                    status={duration === option ? "checked" : "unchecked"}
                    onPress={() => setDuration(option)}
                    theme={theme}
                  />
                </View>
              ))}
            </View>
          </View>

          {/* Context */}
          <View className="mt-3">
            <Text className="font-ralewaySemiBold mb-3 text-[16px]" style={{ color: theme.textColor }}>
              When does this usually occur?
            </Text>
            <View className="flex flex-row flex-wrap">
              {["After sudden movement", "When tired", "In bright light", "Randomly", "Unsure"].map((option) => (
                <View key={option} className="mr-3 flex flex-row mb-4">
                  <RadioButton
                    value={option}
                    status={contexts.includes(option) ? "checked" : "unchecked"}
                    onPress={() => toggleSelection(contexts, setContexts, option)}
                    theme={theme}
                  />
                </View>
              ))}
            </View>
          </View>

          {/* Notes */}
          <View className="mt-3">
            <Text className="font-ralewaySemiBold mb-3 text-[16px]" style={{ color: theme.textColor }}>
              Add any notes about this symptom
            </Text>
            <StyledTextInput
              multiline
              value={notes}
              onChangeText={setNotes}
              placeholder="Type your notes here"
              placeholderTextColor={theme.darkGrey}
              className="font-raleway text-[16px] h-[84px] p-3 border rounded-lg mb-4"
              style={{ 
                textAlignVertical: "top",
                backgroundColor: theme.background, // Nested background
                borderColor: theme.borderColor,
                color: theme.textColor
              }}
            />

            {/* Action Buttons */}
            <View className="flex-row justify-end">
              <View className="justify-center items-center mr-6 bg-primaryBlue rounded-full w-10 h-10">
                <AudioInputIcon />
              </View>
              <View 
                className="justify-center items-center mr-3 rounded-full w-10 h-10"
                style={{ backgroundColor: notes.length > 0 ? "#FDA29B80" : theme.borderColor }}
              >
                <CrossIcon isActive={notes.length > 0} />
              </View>
              <TouchableOpacity
                onPress={() => null}
                disabled={notes.length === 0}
                className="justify-center items-center rounded-full w-10 h-10"
                style={{ backgroundColor: notes.length > 0 ? "#00b8df" : theme.borderColor }}
              >
                <CheckIcon isActive={notes.length > 0} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </>
  );
};

export default AffectedVisionMenu;
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import React, { useState, useEffect } from "react";
import { styled } from "nativewind";
import { useTheme } from "../../../Contexts/ThemeContext"; // Adjust path as needed

// Components
import ArrowRight from "../../Icons/ArrowRight";
import ArrowDown from "../../Icons/ArrowDown";
import AudioInputIcon from "../../Icons/AudioInputIcon";
import CheckIcon from "../../Icons/CheckIcon";
import CrossIcon from "../../Icons/CrossIcon";

// Styled TextInput
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
        borderColor: "#00b8df",
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

const LightSensitivityMenu = ({ onUpdate, initialData }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState(initialData?.timeOfDay || null);
  const [trigger, setTrigger] = useState(initialData?.triggers || []);
  const [reaction, setReaction] = useState(initialData?.reactions || []);
  const [notes, setNotes] = useState(initialData?.notes || "");

  const { theme } = useTheme();

  // Sync state with parent whenever values change
  useEffect(() => {
    if (onUpdate) {
      onUpdate({
        timeOfDay,
        triggers: trigger,
        reactions: reaction,
        notes,
      });
    }
  }, [timeOfDay, trigger, reaction, notes]);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  // Multi-select toggles
  const toggleTrigger = (option) => {
    if (trigger.includes(option)) {
      setTrigger(trigger.filter((item) => item !== option));
    } else {
      setTrigger([...trigger, option]);
    }
  };

  const toggleReaction = (option) => {
    if (reaction.includes(option)) {
      setReaction(reaction.filter((item) => item !== option));
    } else {
      setReaction([...reaction, option]);
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
            Light Sensitivity
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
          
          {/* Time of Day */}
          <View className="flex flex-row flex-wrap mb-5">
            {["Morning", "Afternoon", "Evening", "Night", "Throughout the day"].map((option) => (
              <View key={option} className="mr-3 flex flex-row mb-4">
                <RadioButton
                  value={option}
                  status={timeOfDay === option ? "checked" : "unchecked"}
                  onPress={() => setTimeOfDay(option)}
                  theme={theme}
                />
              </View>
            ))}
          </View>

          {/* Trigger (multi-select) */}
          <View className="mt-3">
            <Text className="font-ralewaySemiBold mb-3 text-[16px]" style={{ color: theme.textColor }}>
              Which type of light bothers you the most?
            </Text>
            <View className="flex flex-row flex-wrap">
              {["Bright sunlight", "Fluorescent lighting", "Screens (phone/computer)", "Car headlights", "Other"].map((option) => (
                <View key={option} className="mr-3 flex flex-row mb-4">
                  <RadioButton
                    value={option}
                    status={trigger.includes(option) ? "checked" : "unchecked"}
                    onPress={() => toggleTrigger(option)}
                    theme={theme}
                  />
                </View>
              ))}
            </View>
          </View>

          {/* Reaction (multi-select) */}
          <View className="mt-3">
            <Text className="font-ralewaySemiBold mb-3 text-[16px]" style={{ color: theme.textColor }}>
              How do you usually react to light exposure?
            </Text>
            <View className="flex flex-row flex-wrap">
              {[
                "I squint or close my eyes",
                "It causes headache",
                "I avoid looking at light sources",
                "I feel dizzy or nauseous",
                "Other",
              ].map((option) => (
                <View key={option} className="mr-3 flex flex-row mb-4">
                  <RadioButton
                    value={option}
                    status={reaction.includes(option) ? "checked" : "unchecked"}
                    onPress={() => toggleReaction(option)}
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
                backgroundColor: theme.background,
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

export default LightSensitivityMenu;
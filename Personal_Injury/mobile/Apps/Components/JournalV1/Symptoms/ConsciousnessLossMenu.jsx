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

const ConsciousnessLossMenu = ({ onUpdate, initialData }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [duration, setDuration] = useState(initialData?.duration || null);
  const [circumstance, setCircumstance] = useState(initialData?.circumstance || null);
  const [afterEffects, setAfterEffects] = useState(initialData?.afterEffects || []);
  const [notes, setNotes] = useState(initialData?.notes || "");

  const { theme } = useTheme();

  useEffect(() => {
    if (onUpdate) {
      onUpdate({
        duration,
        circumstance,
        afterEffects,
        notes,
      });
    }
  }, [duration, circumstance, afterEffects, notes]);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const toggleAfterEffect = (option) => {
    if (afterEffects.includes(option)) {
      setAfterEffects(afterEffects.filter((item) => item !== option));
    } else {
      setAfterEffects([...afterEffects, option]);
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
            Loss of Consciousness
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
          
          {/* Duration */}
          <View className="mt-3">
            <Text className="font-ralewaySemiBold mb-3 text-[16px]" style={{ color: theme.textColor }}>
              How long did you lose consciousness?
            </Text>
            <View className="flex flex-row flex-wrap">
              {["A few seconds", "Less than a minute", "1–5 minutes", "More than 5 minutes", "Unsure"].map((option) => (
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

          {/* Circumstance */}
          <View className="mt-3">
            <Text className="font-ralewaySemiBold mb-3 text-[16px]" style={{ color: theme.textColor }}>
              What were you doing when it happened?
            </Text>
            <View className="flex flex-row flex-wrap">
              {["Standing or walking", "After an impact or fall", "While resting or sitting", "During physical activity", "Unsure"].map((option) => (
                <View key={option} className="mr-3 flex flex-row mb-4">
                  <RadioButton
                    value={option}
                    status={circumstance === option ? "checked" : "unchecked"}
                    onPress={() => setCircumstance(option)}
                    theme={theme}
                  />
                </View>
              ))}
            </View>
          </View>

          {/* After Effects */}
          <View className="mt-3">
            <Text className="font-ralewaySemiBold mb-3 text-[16px]" style={{ color: theme.textColor }}>
              Did you experience any symptoms after regaining consciousness?
            </Text>
            <View className="flex flex-row flex-wrap">
              {["Headache", "Nausea or vomiting", "Dizziness", "Confusion or memory loss", "Weakness", "None of the above"].map((option) => (
                <View key={option} className="mr-3 flex flex-row mb-4">
                  <RadioButton
                    value={option}
                    status={afterEffects.includes(option) ? "checked" : "unchecked"}
                    onPress={() => toggleAfterEffect(option)}
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

export default ConsciousnessLossMenu;
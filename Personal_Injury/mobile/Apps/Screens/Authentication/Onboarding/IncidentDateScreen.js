import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import OnboardingBaseLayout from "./OnboardingBaseLayout";
import { useOnboarding } from "../../../Contexts/OnboardingContext";
import { OptionRow } from "./OnboardingComponents";

const PRIMARY_BLUE = "#00AEEF";
const INPUT_BORDER_GRAY = "#D3D3D3";
const TEXT_GRAY = "#6E6E6E";
const WHITE = "#FFFFFF";

const OPTIONS = [
  "Within the last 2 weeks",
  "2–6 weeks ago",
  "More than 6 weeks ago",
  "Not sure",
];

export default function IncidentDateScreen({ navigation }) {
  const { state, updateField, updateNotSureDetail } = useOnboarding();
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleSelect = (value) => {
    updateField("incidentDateRange", value);
    if (value !== "Not sure") {
      updateNotSureDetail("incidentDateRange", "");
    }
  };

  const handleNext = () => {
    navigation.navigate("AbilityToWork");
  };

  const isNotSure = state.incidentDateRange === "Not sure";

  return (
    <OnboardingBaseLayout
      navigation={navigation}
      title="When Did This Happen?"
      step={5}
      totalSteps={13}
      footer={
        <TouchableOpacity
          onPress={handleNext}
          style={{
            backgroundColor: PRIMARY_BLUE,
            borderRadius: 999,
            height: 48,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: WHITE,
              fontFamily: "Raleway",
              fontSize: 18,
            }}
          >
            Next
          </Text>
        </TouchableOpacity>
      }
    >
      {OPTIONS.map((option) => (
        <OptionRow
          key={option}
          label={option}
          selected={state.incidentDateRange === option}
          onPress={() => handleSelect(option)}
          variant="radio"
        />
      ))}

      {isNotSure && (
        <View style={{ marginTop: 16 }}>
          <Text style={{ fontFamily: "Raleway", fontSize: 14, marginBottom: 8, color: "#6E6E6E" }}>
            Kindly provide us with the necessary details.
          </Text>
          <TextInput
            style={{
              marginTop: 0,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: '#E0E0E0',
              minHeight: 120,
              paddingHorizontal: 12,
              paddingVertical: 10,
              textAlignVertical: 'top',
              backgroundColor: WHITE,
              color: "#000000",
              fontFamily: "Raleway",
            }}
            placeholder="Type..."
            placeholderTextColor={TEXT_GRAY}
            multiline
            value={state.notSureDetails?.incidentDateRange || ""}
            onChangeText={(text) =>
              updateNotSureDetail("incidentDateRange", text)
            }
          />
        </View>
      )}
    </OnboardingBaseLayout>
  );
}


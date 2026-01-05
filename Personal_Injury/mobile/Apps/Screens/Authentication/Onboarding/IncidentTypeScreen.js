import React from "react";
import { ScrollView, StyleSheet, View, Text, TextInput } from "react-native";
import OnboardingBaseLayout from "./OnboardingBaseLayout";
import { useOnboarding } from "../../../Contexts/OnboardingContext";
import {
  OptionRow,
  PrimaryButton,
} from "./OnboardingComponents";
import { COLORS } from "./OnboardingTheme";

const INCIDENT_OPTIONS = [
  "Motor Vehicle Accident (Car Accident)",
  "Motorcycle Accident",
  "Pedestrian Accident",
  "Bicycle Accident",
  "Watercraft / Boating Accident",
  "Concussion / Head Injury",
  "Spinal Injury (Neck or Back)",
  "Slip & Fall",
  "Assault / Physical Attack",
  "Medical Malpractice",
  "Dog Bite / Animal Attack",
  "Product or Equipment Failure",
  "Other",
];

export default function IncidentTypeScreen({ navigation }) {
  const { state, updateField, updateNotSureDetail } = useOnboarding();

  const toggleOption = (value) => {
    const current = state.incidentTypes || [];
    if (current.includes(value)) {
      updateField(
        "incidentTypes",
        current.filter((v) => v !== value)
      );
      if (value === "Other") {
        updateNotSureDetail("incidentType", "");
      }
    } else {
      updateField("incidentTypes", [...current, value]);
    }
  };

  const handleNext = () => {
    navigation.navigate("IncidentDescription");
  };

  const isDisabled = !state.incidentTypes || state.incidentTypes.length === 0;
  const isOtherSelected = state.incidentTypes?.includes("Other");

  return (
    <OnboardingBaseLayout
      navigation={navigation}
      title="What Kind Of Incident Were You Involved In?"
      step={3}
      totalSteps={13}
      footer={
        <PrimaryButton
          label="Next"
          onPress={handleNext}
          disabled={isDisabled}
        />
      }
    >
      {INCIDENT_OPTIONS.map((option) => (
        <OptionRow
          key={option}
          label={option}
          selected={state.incidentTypes?.includes(option)}
          onPress={() => toggleOption(option)}
        />
      ))}

      {isOtherSelected && (
        <View style={styles.otherContainer}>
          <Text style={styles.otherLabel}>
            Kindly provide us with the necessary details.
          </Text>
          <TextInput
            style={styles.otherInput}
            placeholder="Type..."
            placeholderTextColor="#6E6E6E"
            multiline
            value={state.notSureDetails?.incidentType || ""}
            onChangeText={(text) =>
              updateNotSureDetail("incidentType", text)
            }
          />
        </View>
      )}
    </OnboardingBaseLayout>
  );
}

const styles = StyleSheet.create({
  otherContainer: {
    marginTop: 16,
  },
  otherLabel: {
    fontFamily: "Raleway",
    fontSize: 14,
    marginBottom: 8,
    color: "#6E6E6E",
  },
  otherInput: {
    marginTop: 0,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    minHeight: 120,
    paddingHorizontal: 12,
    paddingVertical: 10,
    textAlignVertical: 'top',
    backgroundColor: '#FFFFFF',
    color: "#000000",
    fontFamily: "Raleway",
  },
});

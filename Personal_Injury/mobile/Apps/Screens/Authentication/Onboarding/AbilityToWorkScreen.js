import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import OnboardingBaseLayout from "./OnboardingBaseLayout";
import { useOnboarding } from "../../../Contexts/OnboardingContext";
import {
  OptionRow,
  PrimaryButton,
  HelperText,
} from "./OnboardingComponents";
import { COLORS } from "./OnboardingTheme";

const OPTIONS = [
  "I haven't been able to return to work",
  "I've returned, but I'm still struggling",
  "I'm working, but not at full capacity",
  "I'm working normally",
  "Not sure",
];

export default function AbilityToWorkScreen({ navigation }) {
  const { state, updateField, updateNotSureDetail } = useOnboarding();

  const handleSelect = (value) => {
    const current = Array.isArray(state.abilityToWork) ? state.abilityToWork : [];

    if (current.includes(value)) {
      // Remove if already selected
      updateField("abilityToWork", current.filter((v) => v !== value));

      // If removing "Not sure", clear details
      if (value === "Not sure") {
        updateNotSureDetail("abilityToWork", "");
      }
    } else {
      // Add if not selected
      updateField("abilityToWork", [...current, value]);
    }
  };

  const isNotSureSelected = (state.abilityToWork || []).includes("Not sure");

  const handleNext = () => {
    navigation.navigate("DailyActivities");
  };

  const isDisabled = !state.abilityToWork || state.abilityToWork.length === 0;

  return (
    <OnboardingBaseLayout
      navigation={navigation}
      title="Is Your Injury Affecting Your Ability To Work?"
      step={6}
      totalSteps={13}
      footer={
        <PrimaryButton
          label="Next"
          onPress={handleNext}
          disabled={isDisabled}
        />
      }
    >
      {OPTIONS.map((option) => (
        <OptionRow
          key={option}
          label={option}
          selected={(state.abilityToWork || []).includes(option)}
          onPress={() => handleSelect(option)}
        />
      ))}

      {isNotSureSelected && (
        <View style={styles.notSureContainer}>
          <HelperText>
            Kindly provide us with the necessary details.
          </HelperText>
          <TextInput
            style={styles.notSureInput}
            placeholder="Type..."
            placeholderTextColor={COLORS.textGray}
            multiline
            value={state.notSureDetails?.abilityToWork || ""}
            onChangeText={(text) =>
              updateNotSureDetail("abilityToWork", text)
            }
          />
        </View>
      )}
    </OnboardingBaseLayout>
  );
}

const styles = StyleSheet.create({
  notSureContainer: {
    marginTop: 16,
  },
  notSureInput: {
    marginTop: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    minHeight: 120,
    paddingHorizontal: 12,
    paddingVertical: 10,
    textAlignVertical: "top",
    backgroundColor: "#FFFFFF",
    color: "#000000",
    fontFamily: "Raleway",
  },
});

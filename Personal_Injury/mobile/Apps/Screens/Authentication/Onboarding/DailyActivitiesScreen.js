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
  "Dressing is difficult",
  "Bathing or showering is difficult",
  "Cooking / meal prep is difficult",
  "Cleaning / housekeeping is difficult",
  "Getting in/out of bed is difficult",
  "Toileting / hygiene tasks are difficult",
  "I need help with tasks I used to do independently",
  "I'm managing daily tasks without difficulty",
  "Not sure",
];

export default function DailyActivitiesScreen({ navigation }) {
  const { state, updateField, updateNotSureDetail } = useOnboarding();

  const toggleOption = (value) => {
    const current = state.dailyActivities || [];
    if (current.includes(value)) {
      updateField(
        "dailyActivities",
        current.filter((v) => v !== value)
      );
      if (value === "Not sure") {
        updateNotSureDetail("dailyActivities", "");
      }
    } else {
      updateField("dailyActivities", [...current, value]);
    }
  };

  const isNotSureSelected = (state.dailyActivities || []).includes("Not sure");

  const handleNext = () => {
    navigation.navigate("Lawyer");
  };

  const isDisabled =
    !state.dailyActivities || state.dailyActivities.length === 0;

  return (
    <OnboardingBaseLayout
      navigation={navigation}
      title="How are Your Daily Activities Affected?"
      subtitle="These help us understand how your injury impacts your quality of life."
      step={7}
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
          selected={state.dailyActivities?.includes(option)}
          onPress={() => toggleOption(option)}
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
            value={state.notSureDetails?.dailyActivities || ""}
            onChangeText={(text) =>
              updateNotSureDetail("dailyActivities", text)
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

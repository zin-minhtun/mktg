import React from "react";
import { View, StyleSheet } from "react-native";
import OnboardingBaseLayout from "./OnboardingBaseLayout";
import { useOnboarding } from "../../../Contexts/OnboardingContext";
import { OptionRow, PrimaryButton } from "./OnboardingComponents";

const OPTIONS = ["Yes", "No"];

export default function TherapyScreen({ navigation }) {
  const { state, updateField } = useOnboarding();

  const handleSelect = (value) => {
    updateField("inTherapy", value);
  };

  const handleNext = () => {
    navigation.navigate("Gender");
  };

  const isDisabled = state.inTherapy === null;

  return (
    <OnboardingBaseLayout
      navigation={navigation}
      title="Are You in Therapy?"
      step={11}
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
          selected={state.inTherapy === option}
          onPress={() => handleSelect(option)}
          variant="radio"
        />
      ))}
    </OnboardingBaseLayout>
  );
}

const styles = StyleSheet.create({});

import React from "react";
import { View, StyleSheet } from "react-native";
import OnboardingBaseLayout from "./OnboardingBaseLayout";
import { useOnboarding } from "../../../Contexts/OnboardingContext";
import {
  OptionRow,
  PrimaryButton,
  FooterHelperText,
} from "./OnboardingComponents";

const OPTIONS = [
  "I'm confused and need guidance right away",
  "I think I'm managing but could use advice",
  "I want to learn more about my recovery options",
  "I'm just exploring",
];

export default function FeelingsNextScreen({ navigation }) {
  const { state, updateField } = useOnboarding();

  const toggleOption = (value) => {
    const current = state.feelingsNext || [];
    if (current.includes(value)) {
      updateField(
        "feelingsNext",
        current.filter((v) => v !== value)
      );
    } else {
      updateField("feelingsNext", [...current, value]);
    }
  };

  const handleNext = () => {
    navigation.navigate("EmotionalSymptoms");
  };

  const isDisabled = !state.feelingsNext || state.feelingsNext.length === 0;

  return (
    <OnboardingBaseLayout
      navigation={navigation}
      title="How Are You Feeling About What's Next?"
      step={9}
      totalSteps={13}
      footer={
        <View style={styles.footerContainer}>
          <PrimaryButton
            label="Next"
            onPress={handleNext}
            disabled={isDisabled}
          />
          <FooterHelperText>
            You Don&apos;t Have To Have All The Answers — We&apos;ll Guide You.
          </FooterHelperText>
        </View>
      }
    >
      {OPTIONS.map((option) => (
        <OptionRow
          key={option}
          label={option}
          selected={state.feelingsNext?.includes(option)}
          onPress={() => toggleOption(option)}
        />
      ))}
    </OnboardingBaseLayout>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    paddingBottom: 8,
  },
});

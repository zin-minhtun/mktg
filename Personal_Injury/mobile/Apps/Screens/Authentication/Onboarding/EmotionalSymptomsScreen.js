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
  "Anxiety or fear of driving",
  "Trouble sleeping",
  "Feeling down, disconnected, or overwhelmed",
  "My relationships or home life are being affected",
  "None of the above",
];

export default function EmotionalSymptomsScreen({ navigation }) {
  const { state, updateField } = useOnboarding();

  const toggleOption = (value) => {
    const current = state.emotionalSymptoms || [];
    if (current.includes(value)) {
      updateField(
        "emotionalSymptoms",
        current.filter((v) => v !== value)
      );
    } else {
      updateField("emotionalSymptoms", [...current, value]);
    }
  };

  const handleNext = () => {
    navigation.navigate("Therapy");
  };

  const isDisabled =
    !state.emotionalSymptoms || state.emotionalSymptoms.length === 0;

  return (
    <OnboardingBaseLayout
      navigation={navigation}
      title="Have You Experienced Emotional or Psychological Symptoms?"
      step={10}
      totalSteps={13}
      footer={
        <View style={styles.footerContainer}>
          <PrimaryButton
            label="Next"
            onPress={handleNext}
            disabled={isDisabled}
          />
          <FooterHelperText>
            These Feelings Are Very Common After An Accident. We Can Include
            Emotional Support In Your Recovery Plan.
          </FooterHelperText>
        </View>
      }
    >
      {OPTIONS.map((option) => (
        <OptionRow
          key={option}
          label={option}
          selected={state.emotionalSymptoms?.includes(option)}
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

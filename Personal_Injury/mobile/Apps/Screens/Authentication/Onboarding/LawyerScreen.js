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

const OPTIONS = ["Yes", "No", "Not sure"];

export default function LawyerScreen({ navigation }) {
  const { state, updateField, updateNotSureDetail } = useOnboarding();

  const handleSelect = (value) => {
    updateField("hasLawyer", value);
    if (value !== "Not sure") {
      updateNotSureDetail("hasLawyer", "");
    }
  };

  const handleNext = () => {
    navigation.navigate("FeelingsNext");
  };

  const isNotSure = state.hasLawyer === "Not sure";

  const isDisabled = !state.hasLawyer;

  return (
    <OnboardingBaseLayout
      navigation={navigation}
      title="Do You Currently Have A Lawyer Helping You?"
      step={8}
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
          selected={state.hasLawyer === option}
          onPress={() => handleSelect(option)}
          variant="radio"
        />
      ))}

      {isNotSure && (
        <View style={styles.notSureContainer}>
          <HelperText>
            Kindly provide us with the necessary details.
          </HelperText>
          <TextInput
            style={styles.input}
            placeholder="Type..."
            placeholderTextColor={COLORS.textGray}
            multiline
            value={state.notSureDetails?.hasLawyer || ""}
            onChangeText={(text) => updateNotSureDetail("hasLawyer", text)}
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
  input: {
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

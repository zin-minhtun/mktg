import React from "react";
import { View, TextInput, StyleSheet, Platform, KeyboardAvoidingView } from "react-native";
import OnboardingBaseLayout from "./OnboardingBaseLayout";
import { useOnboarding } from "../../../Contexts/OnboardingContext";
import { PrimaryButton, FooterHelperText } from "./OnboardingComponents";
import { COLORS } from "./OnboardingTheme";

export default function IncidentDescriptionScreen({ navigation }) {
  const { state, updateField } = useOnboarding();

  const handleNext = () => {
    navigation.navigate("IncidentDate");
  };

  const isDisabled = !state.incidentDescription?.trim();

  return (
    <OnboardingBaseLayout
      navigation={navigation}
      title="Can You Briefly Describe What Happened?"
      subtitle="You can write as much or as little as you like. This helps us understand your situation and guide you properly."
      step={4}
      totalSteps={13}
      footer={
        <View style={styles.footerContainer}>
          <PrimaryButton
            label="Next"
            onPress={handleNext}
            disabled={isDisabled}
          />
          <FooterHelperText>
            All information you provide is private and confidential.
          </FooterHelperText>
        </View>
      }
    >
      <TextInput
        style={styles.input}
        placeholder="Type..."
        placeholderTextColor={COLORS.textGray}
        multiline
        value={state.incidentDescription}
        onChangeText={(text) => updateField("incidentDescription", text)}
      />
    </OnboardingBaseLayout>
  );
}

const styles = StyleSheet.create({
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
  footerContainer: {
    paddingBottom: 8,
  },
});

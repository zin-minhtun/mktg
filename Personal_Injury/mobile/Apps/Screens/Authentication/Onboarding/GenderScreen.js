import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import OnboardingBaseLayout from "./OnboardingBaseLayout";
import { useOnboarding } from "../../../Contexts/OnboardingContext";
import { COLORS } from "./OnboardingTheme";

const OPTIONS = ["Female", "Male", "Prefer not to say"];

export default function GenderScreen({ navigation }) {
  const { state, updateField } = useOnboarding();

  const handleSelect = (value) => {
    updateField("gender", value);
  };

  const handleNext = () => {
    navigation.navigate("NotificationPreferences");
  };

  const isDisabled = !state.gender;

  return (
    <OnboardingBaseLayout
      navigation={navigation}
      title="Select Your Gender"
      step={12}
      totalSteps={13}
      footer={
        <TouchableOpacity
          onPress={handleNext}
          disabled={isDisabled}
          style={[
            styles.primaryButton,
            { opacity: isDisabled ? 0.5 : 1 },
          ]}
        >
          <Text style={styles.primaryButtonLabel}>Next</Text>
        </TouchableOpacity>
      }
    >
      <View style={styles.iconWrapper}>
        <View style={styles.iconCircle}>
          <Ionicons name="male" size={28} color={COLORS.primary} />
          <Ionicons
            name="female"
            size={24}
            color="#FF6384"
            style={styles.iconFemale}
          />
        </View>
      </View>

      {OPTIONS.map((option) => {
        const selected = state.gender === option;
        return (
          <TouchableOpacity
            key={option}
            onPress={() => handleSelect(option)}
            style={[
              styles.optionButton,
              {
                backgroundColor: selected ? COLORS.primary : COLORS.background,
                borderColor: COLORS.primary,
              },
            ]}
          >
            <Text
              style={[
                styles.optionLabel,
                { color: selected ? "#FFFFFF" : COLORS.primary },
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        );
      })}
    </OnboardingBaseLayout>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    alignItems: "center",
    marginTop: 24,
    marginBottom: 32,
  },
  iconCircle: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: "#F5F9FC",
    justifyContent: "center",
    alignItems: "center",
  },
  iconFemale: {
    position: "absolute",
    bottom: 30,
    right: 24,
  },
  optionButton: {
    height: 50,
    borderRadius: 28,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  optionLabel: {
    fontFamily: "Raleway",
    fontSize: 16,
  },
  primaryButton: {
    height: 48,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  primaryButtonLabel: {
    fontFamily: "Raleway",
    fontSize: 18,
    color: "#FFFFFF",
  },
});

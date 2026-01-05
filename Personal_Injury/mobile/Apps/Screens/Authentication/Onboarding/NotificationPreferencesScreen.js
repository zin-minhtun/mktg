import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import OnboardingBaseLayout from "./OnboardingBaseLayout";
import { useOnboarding } from "../../../Contexts/OnboardingContext";
import { LabeledSwitchRow, PrimaryButton } from "./OnboardingComponents";
import { COLORS } from "./OnboardingTheme";
import BaseText from "../../../designSystem/components/BaseText";

export default function NotificationPreferencesScreen({ navigation }) {
  const { state, updateNotificationPreference, completeOnboarding } = useOnboarding();

  const handleToggle = (key) => {
    const current = state.notifications?.[key];
    updateNotificationPreference(key, !current);
  };

  const handleNext = async () => {
    // 1. Triage the user
    console.log("Completing onboarding and calculating triage...");
    const result = await completeOnboarding();
    console.log("Triage Result:", result);

    // 2. Navigate to Signup (User will see result after login)
    navigation.navigate("Sign Up Email");
  };

  const { reminders, webinars, promotions } = state.notifications;
  const isNextDisabled = !reminders && !webinars && !promotions;

  return (
    <OnboardingBaseLayout
      navigation={navigation}
      title="Stay Informed And Never Miss An Update!"
      step={13}
      totalSteps={13}
      footer={
        <PrimaryButton
          label="Next"
          onPress={handleNext}
          disabled={isNextDisabled}
        />
      }
    >
      <View style={styles.heroWrapper}>
        <View style={styles.bubble}>
          <Ionicons name="notifications" size={40} color="#FFFFFF" />
          <View style={styles.bubbleTail} />
        </View>
      </View>

      <LabeledSwitchRow
        icon={
          <Ionicons
            name="notifications-outline"
            size={22}
            color={COLORS.primary}
          />
        }
        label="Allow reminders and notification"
        value={reminders}
        onValueChange={() => handleToggle("reminders")}
      />

      <LabeledSwitchRow
        icon={
          <MaterialIcons
            name="mail-outline"
            size={22}
            color={COLORS.primary}
          />
        }
        label="Allow invitation to educational webinars"
        value={webinars}
        onValueChange={() => handleToggle("webinars")}
      />

      <LabeledSwitchRow
        icon={
          <Ionicons
            name="pricetag-outline"
            size={22}
            color={COLORS.primary}
          />
        }
        label="Allow email promotional and discounted materials"
        value={promotions}
        onValueChange={() => handleToggle("promotions")}
      />
    </OnboardingBaseLayout>
  );
}

const styles = StyleSheet.create({
  heroWrapper: {
    alignItems: "center",
    marginTop: 24,
    marginBottom: 24,
  },
  bubble: {
    width: 180,
    height: 112,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  bubbleTail: {
    position: "absolute",
    right: 24,
    bottom: -10,
    width: 24,
    height: 24,
    backgroundColor: COLORS.primary,
    transform: [{ rotate: "45deg" }],
  },
});


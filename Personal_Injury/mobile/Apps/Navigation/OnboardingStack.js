import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { OnboardingProvider } from "../Contexts/OnboardingContext";
import OnboardingClientScreen from "../Screens/Authentication/Onboarding/OnboardingClientScreen";
import PersonalInjuryOntarioScreen from "../Screens/Authentication/Onboarding/PersonalInjuryOntarioScreen";
import IncidentTypeScreen from "../Screens/Authentication/Onboarding/IncidentTypeScreen";
import IncidentDescriptionScreen from "../Screens/Authentication/Onboarding/IncidentDescriptionScreen";
import IncidentDateScreen from "../Screens/Authentication/Onboarding/IncidentDateScreen";
import AbilityToWorkScreen from "../Screens/Authentication/Onboarding/AbilityToWorkScreen";
import DailyActivitiesScreen from "../Screens/Authentication/Onboarding/DailyActivitiesScreen";
import LawyerScreen from "../Screens/Authentication/Onboarding/LawyerScreen";
import FeelingsNextScreen from "../Screens/Authentication/Onboarding/FeelingsNextScreen";
import EmotionalSymptomsScreen from "../Screens/Authentication/Onboarding/EmotionalSymptomsScreen";
import TherapyScreen from "../Screens/Authentication/Onboarding/TherapyScreen";
import GenderScreen from "../Screens/Authentication/Onboarding/GenderScreen";
import NotificationPreferencesScreen from "../Screens/Authentication/Onboarding/NotificationPreferencesScreen";
import HaveAccountScreen from "../Screens/Authentication/Onboarding/HaveAccountScreen";

const Stack = createNativeStackNavigator();

const OnboardingStack = () => {
  return (
    <OnboardingProvider>
      <Stack.Navigator
        initialRouteName="OnboardingClient"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen
          name="OnboardingClient"
          component={OnboardingClientScreen}
        />
        <Stack.Screen
          name="PersonalInjuryOntario"
          component={PersonalInjuryOntarioScreen}
        />
        <Stack.Screen name="IncidentType" component={IncidentTypeScreen} />
        <Stack.Screen
          name="IncidentDescription"
          component={IncidentDescriptionScreen}
        />
        <Stack.Screen name="IncidentDate" component={IncidentDateScreen} />
        <Stack.Screen
          name="AbilityToWork"
          component={AbilityToWorkScreen}
        />
        <Stack.Screen
          name="DailyActivities"
          component={DailyActivitiesScreen}
        />
        <Stack.Screen name="Lawyer" component={LawyerScreen} />
        <Stack.Screen name="FeelingsNext" component={FeelingsNextScreen} />
        <Stack.Screen
          name="EmotionalSymptoms"
          component={EmotionalSymptomsScreen}
        />
        <Stack.Screen name="Therapy" component={TherapyScreen} />
        <Stack.Screen name="Gender" component={GenderScreen} />
        <Stack.Screen
          name="NotificationPreferences"
          component={NotificationPreferencesScreen}
        />
        <Stack.Screen
          name="HaveAccount"
          component={HaveAccountScreen}
        />
      </Stack.Navigator>
    </OnboardingProvider>
  );
};

export default OnboardingStack;


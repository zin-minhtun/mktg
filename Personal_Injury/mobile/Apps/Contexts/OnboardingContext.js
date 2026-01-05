import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  startOnboarding,
  updateOnboarding,
  verifyOnboardingExists,
  clearOnboardingData,
  completeOnboarding
} from "../Services/onboardingService";

const OnboardingContext = createContext();

export const OnboardingProvider = ({ children }) => {
  // Initial State matching the Schema
  const initialState = {
    hadPersonalInjuryOntario: null,
    incidentTypes: [],
    incidentDescription: "",
    incidentDateRange: "",
    abilityToWork: [],
    abilityToWorkDetails: "",
    dailyActivitiesAffected: [],
    dailyActivitiesDetails: "",
    hasLawyer: "",
    lawyerDetails: "",
    feelingsNext: [],
    emotionalSymptoms: [],
    inTherapy: "",
    gender: "",
    notifications: {
      reminders: false,
      webinars: false,
      promotions: false,
    },
    notSureDetails: {}, // Helper for UI "Not Sure" text inputs
  };

  const [state, setState] = useState(initialState);
  const [onboardingId, setOnboardingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [triageResult, setTriageResult] = useState(null); // Store result

  // 1. Initialize on Mount
  useEffect(() => {
    initializeOnboarding();
  }, []);

  const initializeOnboarding = async () => {
    setIsLoading(true);
    try {
      // Try to recover ID from storage
      const storedId = await AsyncStorage.getItem("onboardingId");

      if (storedId) {
        // Verify it still exists on backend
        const exists = await verifyOnboardingExists(storedId);
        if (exists) {
          console.log(`[OnboardingContext] Resumed session: ${storedId}`);
          setOnboardingId(storedId);
          // Ideally, we would also fetch current answers here to sync state
          // But for now, we assume local state might be empty or we just continue
        } else {
          console.warn(`[OnboardingContext] Stale ID found: ${storedId}. Starting new.`);
          await startNewSession();
        }
      } else {
        console.log("[OnboardingContext] No session found. Starting new.");
        await startNewSession();
      }
    } catch (error) {
      console.error("[OnboardingContext] Init failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const startNewSession = async () => {
    try {
      await clearOnboardingData();
      const newId = await startOnboarding();
      setOnboardingId(newId);
      setState(initialState); // Reset UI state
      setTriageResult(null);
    } catch (error) {
      console.error("[OnboardingContext] Failed to start new session:", error);
    }
  };

  // 2. Update Field Logic
  const updateField = async (key, value) => {
    // Optimistic UI update
    setState((prev) => ({ ...prev, [key]: value }));

    try {
      let currentId = onboardingId;

      // Safety: Ensure we have an ID
      if (!currentId) {
        console.warn("[OnboardingContext] No ID during update. Creating one...");
        currentId = await startOnboarding();
        setOnboardingId(currentId);
      }

      // Call API
      await updateOnboarding(currentId, { [key]: value });

    } catch (error) {
      console.error(`[OnboardingContext] Update failed for ${key}:`, error);

      // Recovery: If 404, regenerate ID and retry ONCE
      if (error.code === 'ONBOARDING_NOT_FOUND') {
        console.log("[OnboardingContext] Recovering from 404...");
        await startNewSession();
        // We don't retry the update automatically to avoid loops, 
        // but the user's next action will use the new ID.
      }
    }
  };

  // Helper for "Not Sure" text details
  const updateNotSureDetail = (category, text) => {
    setState((prev) => ({
      ...prev,
      notSureDetails: { ...prev.notSureDetails, [category]: text },
    }));

    // Map specific categories to schema fields if needed
    if (category === 'abilityToWork') {
      updateField('abilityToWorkDetails', text);
    } else if (category === 'dailyActivities') {
      updateField('dailyActivitiesDetails', text);
    } else if (category === 'hasLawyer') {
      updateField('lawyerDetails', text);
    }
  };

  // Update Notification Preferences
  const updateNotificationPreference = async (key, value) => {
    const newNotifications = { ...state.notifications, [key]: value };
    setState((prev) => ({ ...prev, notifications: newNotifications }));

    try {
      if (onboardingId) {
        await updateOnboarding(onboardingId, { notifications: newNotifications });
      }
    } catch (error) {
      console.error("[OnboardingContext] Notification update failed:", error);
    }
  };

  // Complete Onboarding Logic
  const handleCompleteOnboarding = async () => {
    if (!onboardingId) return null;
    try {
      const result = await completeOnboarding(onboardingId);
      setTriageResult(result);
      return result;
    } catch (error) {
      console.error("[OnboardingContext] Completion failed:", error);
      return null;
    }
  };

  // Reset (after signup)
  const resetOnboarding = async () => {
    console.log("[OnboardingContext] Resetting state and clearing storage.");
    await clearOnboardingData();
    setState(initialState);
    setOnboardingId(null);
    setTriageResult(null);
  };

  return (
    <OnboardingContext.Provider
      value={{
        state,
        onboardingId,
        isLoading,
        triageResult, // Exposed
        updateField,
        updateNotSureDetail,
        updateNotificationPreference,
        completeOnboarding: handleCompleteOnboarding, // Exposed
        resetOnboarding,
        initializeOnboarding // Exposed for manual retry if needed
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => useContext(OnboardingContext);

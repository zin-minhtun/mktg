import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image, Alert } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { format } from "date-fns";
import { useUserData } from "../../Contexts/UserContext";
import { useTheme } from "../../Contexts/ThemeContext";
import Quotes from "../../Components/Quotes/Quotes";
import FbGroup from "../../Components/FbGroup/FbGroup";
import DIY from "../../Components/DiyStretches/DIY";
import PositiveAffirmation from "../../Components/PositiveAffirmation/PositiveAffirmation";
import DailyStreak from "../../Components/Streak/DailyStreak";
import Log from "../../Components/Log/Log";
import JournalCards from "./JournalCards";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Affirmation from "../../Components/Streak/Affirmation";

import axios from "axios";
import { API_URL } from "@env";
import { useFocusEffect } from "@react-navigation/native";
import { User as UserIcon, Bell } from 'lucide-react-native';
import { getTriageResult, sendTriageAction } from "../../Services/onboardingService";

// TRIAGE MODALS
import TriageHighModal from "../../Components/Triage/TriageHighModal";
import TriageMediumModal from "../../Components/Triage/TriageMediumModal";
import TriageLowModal from "../../Components/Triage/TriageLowModal";
import TriageCourtesyModal from "../../Components/Triage/TriageCourtesyModal";
import TriageMessageModal from "../../Components/Triage/TriageMessageModal";
import BaseText from "../../designSystem/components/BaseText";

export default function HomeScreen({ navigation }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [streak, setStreak] = useState(0);
  const [todayMood, setTodayMood] = useState(null);
  const { theme } = useTheme();

  // Triage State
  const [activeTriageModal, setActiveTriageModal] = useState(null); // 'HIGH', 'MEDIUM', 'LOW', 'COURTESY', 'MESSAGE'
  const [triageReason, setTriageReason] = useState("");


  const { gUser } = useUserData();

  // Correctly handle both possible ID formats (_id or id)
  const userId = gUser ? (gUser._id || gUser.id) : null;

  // Verify id of the current User
  useEffect(() => {
    if (gUser) {
      const storedUserData = {
        userId_fromUserContext: userId,
      };
      console.log("HomeScreen - Stored User Data:", storedUserData);
      checkTriageStatus();
    }
  }, [gUser, userId]);

  const checkTriageStatus = async () => {
    if (!userId) return;
    try {
      // Check if we already showed it (use AsyncStorage to show ONLY ONCE)
      const hasSeenTriage = await AsyncStorage.getItem(`triage_seen_${userId}`);
      if (hasSeenTriage === "true") {
        console.log("[HomeScreen] Triage already seen for this user.");
        return;
      }

      const triage = await getTriageResult(userId);
      console.log("[HomeScreen] Triage Result:", triage);

      // Determine proper modal to show from triage.ui_to_display
      if (triage) {
        if (triage.reason) setTriageReason(triage.reason);

        if (triage.ui_to_display === "UI_HIGH_PRIORITY_MODAL") setActiveTriageModal("HIGH");
        else if (triage.ui_to_display === "UI_MEDIUM_PRIORITY_MODAL") setActiveTriageModal("MEDIUM");
        else if (triage.ui_to_display === "UI_LOW_PRIORITY_MODAL") setActiveTriageModal("LOW");
        else if (triage.ui_to_display === "UI_COURTESY_MODAL") setActiveTriageModal("COURTESY");
        else if (triage.ui_to_display === "UI_MESSAGE_MODAL") setActiveTriageModal("MESSAGE");
      }

    } catch (error) {
      console.error("[HomeScreen] Triage check failed:", error);
    }
  };

  const handleTriageComplete = async () => {
    // Mark as seen so it doesn't pop up again
    await AsyncStorage.setItem(`triage_seen_${userId}`, "true");
    setActiveTriageModal(null);
  };

  // --- NAVIGATION FLOWS ---

  const handlePrimaryAction = async () => {
    // User booked / accepted
    if (userId) await sendTriageAction(userId, "BOOKED");
    handleTriageComplete();

    try {
      navigation.navigate("TermsAndConditions");
    } catch (err) {
      console.warn("Navigation to TermsAndConditions failed.");
    }
  };

  const handleSecondaryAction = async () => {
    // User skipped
    if (userId) await sendTriageAction(userId, "SKIPPED");
    handleTriageComplete();

    try {
      navigation.navigate("TermsAndConditions");
    } catch (err) {
      console.warn("Navigation to TermsAndConditions failed.");
    }
  };

  const handleSimpleContinue = async () => {
    // For message/courtesy
    if (userId) await sendTriageAction(userId, "SKIPPED"); // Or keep as PENDING/VIEWED if strict booking tracking needed. "SKIPPED" implies standard flow.
    handleTriageComplete();

    try {
      navigation.navigate("TermsAndConditions");
    } catch (err) {
      console.warn("Navigation to TermsAndConditions failed.");
    }
  };


  // Fetch today's mood
  const fetchTodayMood = async () => {
    if (!userId) return;
    try {
      const today = new Date().toISOString().split('T')[0];
      const res = await axios.get(`${API_URL}/api/moods/check-today`, {
        params: { userId, date: today }
      });
      if (res.data.logged) {
        setTodayMood(res.data.mood);
      } else {
        setTodayMood(null);
      }
    } catch (e) {
      console.error("Error fetching mood:", e);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchTodayMood();
    }, [userId])
  );

  // count how many days in a row the user connected to the app
  useEffect(() => {
    const updateStreak = async () => {
      try {
        const lastVisit = await AsyncStorage.getItem("lastVisit");
        const storedStreak = await AsyncStorage.getItem("streak");

        const today = new Date().toDateString();

        if (lastVisit === today) {
          if (storedStreak) setStreak(parseInt(storedStreak));
          return;
        }

        let newStreak = 1;
        if (lastVisit) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          if (new Date(lastVisit).toDateString() === yesterday.toDateString()) {
            newStreak = (parseInt(storedStreak) || 0) + 1;
          }
        }

        await AsyncStorage.setItem("lastVisit", today);
        await AsyncStorage.setItem("streak", newStreak.toString());
        setStreak(newStreak);
      } catch (error) {
        console.error("Error updating streak:", error);
      }
    };

    updateStreak();
  }, []);


  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top', 'bottom']}>

      {/* TRIAGE MODALS */}
      <TriageHighModal
        visible={activeTriageModal === "HIGH"}
        onPrimaryPress={handlePrimaryAction}
        onSecondaryPress={handleSecondaryAction}
        reason={triageReason}
      />
      <TriageMediumModal
        visible={activeTriageModal === "MEDIUM"}
        onPrimaryPress={handlePrimaryAction}
        onSecondaryPress={handleSecondaryAction}
        reason={triageReason}
      />
      <TriageLowModal
        visible={activeTriageModal === "LOW"}
        onPrimaryPress={handlePrimaryAction}
        onSecondaryPress={handleSecondaryAction}
        reason={triageReason}
      />
      <TriageCourtesyModal
        visible={activeTriageModal === "COURTESY"}
        onPrimaryPress={handleSimpleContinue}
        reason={triageReason}
      />
      <TriageMessageModal
        visible={activeTriageModal === "MESSAGE"}
        onPrimaryPress={handleSimpleContinue}
        reason={triageReason}
      />

      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{
          paddingBottom: Math.max(insets.bottom + 16, 32),
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Avatar and Notification Bell */}
        <View className="flex-row items-center justify-between my-5">
          {/* Left: Avatar and Name */}
          <View className="flex-row items-center">
            <View
              style={{
                width: 58,
                height: 58,
                borderRadius: 29,
                overflow: 'hidden',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#E5E7EB',
                borderWidth: 2,
                borderColor: '#3B82F6',
              }}
            >
              {gUser?.profilePicture ? (
                <Image
                  source={{ uri: gUser.profilePicture }}
                  style={{ width: 54, height: 54, borderRadius: 27 }}
                  resizeMode="cover"
                />
              ) : (
                <UserIcon size={32} color="#9CA3AF" />
              )}
            </View>
            <View className="ml-4">
              <BaseText className="text-lg" style={{ color: theme.textColor }}>
                Hello,
              </BaseText>
              <BaseText className="text-2xl font-bold" style={{ color: theme.textColor }}>
                {gUser ? `${gUser.firstName}` : "Loading..."}
              </BaseText>
            </View>
          </View>

          {/* Right: Notification Bell */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Agenda')}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: '#F3F4F6',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Bell size={24} color="#374151" />
          </TouchableOpacity>
        </View>


        {/* Quote Section */}
        <Quotes />

        {/* Trackers Section */}
        {/*<Log />*/}

        {/* 4 Cards Section */}
        <JournalCards navigation={navigation} />

        {/* Daily Streak Section */}
        <DailyStreak streak={streak} />

        <Affirmation streak={streak} />

        {/* Positive Affirmation */}
        <PositiveAffirmation />

        {/* DIY Stretches Link */}
        <DIY navigation={navigation} />

        {/* FB Group Link */}
        <FbGroup />

        {/* Navigator */}
      </ScrollView>
    </SafeAreaView>
  );
}

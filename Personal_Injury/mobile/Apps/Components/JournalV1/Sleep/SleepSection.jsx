import React, { useState, useCallback } from "react";
import axios from "axios";
import {
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import DecoratedAddBtn from "../DecoratedAddBtn";
import Sleep from "./svg/Sleep";
import { useUserData } from "../../../Contexts/UserContext";
import { API_URL } from "@env";
const SLEEP_API_URL = `${API_URL}/api/dailyLog/sleep`;

const SleepSection = ({ navigation, selectedDate }) => {
  const { gUser } = useUserData();

  const [dailyLogId, setDailyLogId] = useState();
  const [dailySleepLogs, setDailySleepLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedSleepLog, setSelectedSleepLog] = useState(null);

  const fetchSleepLogs = useCallback(async () => {
    if (!gUser?._id) return;
    setLoading(true);

    try {
      const response = await axios.get(SLEEP_API_URL, {
        params: { userId: gUser._id, date: selectedDate },
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        const { id, sleep } = response.data;
        setDailySleepLogs(sleep || []);
        setDailyLogId(id);
      }
    } catch (error) {
      console.error("Error fetching sleep logs:", error);
      setDailySleepLogs([]);
    }

    // Wait 2 seconds before hiding loading, mirroring PainSection
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [gUser, selectedDate]);

  useFocusEffect(
    useCallback(() => {
      fetchSleepLogs();
    }, [fetchSleepLogs])
  );

  const handleDelete = async (sleepLogId) => {
    if (!sleepLogId || !dailyLogId) return;

    try {
      await axios.delete(
        `${SLEEP_API_URL}/${dailyLogId}/${sleepLogId}`,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      Alert.alert("Success", "Sleep record deleted successfully");
      fetchSleepLogs();
    } catch (error) {
      console.error("Error deleting sleep log:", error);
      Alert.alert("Error", "Failed to delete sleep record");
    }
  };

  const handleRecordPress = (sleepLog) => {
    setSelectedSleepLog(sleepLog);
    Alert.alert(
      "Manage Sleep Record",
      `What would you like to do with this sleep record?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => handleDelete(sleepLog._id)
        },
        {
          text: "Edit",
          onPress: () => navigation.navigate("JournalNavigator", {
            screen: "SleepDuration",
            params: {
              sleepLog: sleepLog,
              selectedDate,
              dailyLogId,
            }
          })
        }
      ]
    );
  };

  return (
    <View className="flex-1 relative pb-29">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} className="px-4 pt-4">
        {loading ? (
          <ActivityIndicator size="large" color="#1E40AF" />
        ) : dailySleepLogs.length > 0 ? (
          dailySleepLogs.map((sleepLog, index) => (
            <TouchableOpacity
              key={sleepLog._id || index}
              onPress={() => handleRecordPress(sleepLog)}
              className="bg-white p-4 rounded-xl mb-3 border border-[#EDECF4] flex-row justify-between items-center shadow-sm min-h-[88px]"
            >
              <View className="flex-1">
                <Text className="font-ralewayBold text-primaryDarkBlue text-[16px]">
                  {sleepLog.sleepHours} Hours
                </Text>
                <Text className="font-raleway text-gray-500 text-[14px] mt-1">
                  {sleepLog.sleepQuality ? `${sleepLog.sleepQuality.charAt(0).toUpperCase() + sleepLog.sleepQuality.slice(1)} Sleep` : ''}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View className="items-center mt-10">
            <Sleep />
            <View className="items-center mt-6">
              <Text className="text-[20px] font-ralewaySemiBold text-primaryDarkBlue">
                You don't have any records.
              </Text>
              <Text className="text-[16px] pt-1.5 font-raleway text-[#939598]">
                Click the plus button to add a Sleep Log
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Always show Add Button, like other sections */}
      <DecoratedAddBtn
        navigation={navigation}
        screen={"SleepDuration"}
        selectedDate={selectedDate}
        dailyLogId={dailyLogId}
      />

      {/* Show Weekly Log link when there are entries */}
      {dailySleepLogs.length > 0 && (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("JournalNavigator", {
              screen: "WeeklySleepLog",
              params: { userId: gUser._id },
            })
          }
          className="absolute bottom-20 right-0 left-0 items-center"
        >
          <Text
            className="text-[16px] underline text-center text-[#4A90E2] font-ralewaySemiBold"
          >
            View Weekly Sleep Log
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SleepSection;
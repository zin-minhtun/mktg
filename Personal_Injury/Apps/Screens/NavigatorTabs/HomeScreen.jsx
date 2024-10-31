// HomeScreen.js
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { format } from "date-fns";
import { useUserData } from "../../Contexts/UserContext";
import Quotes from "../../Components/Quotes/Quotes";
import FbGroup from "../../Components/FbGroup/FbGroup";
import DIY from "../../Components/DiyStretches/DIY";
import PositiveAffirmation from "../../Components/PositiveAffirmation/PositiveAffirmation";
import DailyStreak from "../../Components/Streak/DailyStreak";
import Log from "../../Components/Log/Log";

export default function HomeScreen({ navigation }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { gUser } = useUserData();
  const userId = gUser ? gUser._id : null;

  // Verify id of the current User
  useEffect(() => {
    if (gUser) {
      const storedUserData = {
        userId_fromUserContext: gUser._id,
      };
      console.log("HomeScreen - Stored User Data :", storedUserData);
    }
  }, [gUser]);

  return (
    <ScrollView className="flex-1 bg-white px-4">
      {/* Header */}
      <View className="flex-row justify-between items-center py-4">
        <Text className="text-2xl ml-4">
          {gUser ? `Hello ${gUser.firstName}` : "Loading..."}
        </Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("SettingsNavigator", { screen: "EditProfile" })
          }
        >
          <Image
            source={require("../../../assets/images/avatar.jpg")}
            style={{ width: 40, height: 40, borderRadius: 20 }}
          />
        </TouchableOpacity>
      </View>

      <Text>Today is {format(currentDate, "EEEE, MMMM do, yyyy")}</Text>
      {/* Quote Section */}
      <Quotes />
      {/* Todays Entry */}
      <View className="my-4">
        <TouchableOpacity>
          <Text className="p-3 bg-blue-300 rounded-lg text-center text-white">
            Today's Entry
          </Text>
        </TouchableOpacity>
      </View>
      {/* Trackers Section */}
      <Log />

      {/* Daily Streak Section */}
      <DailyStreak />
      {/* Positive Affirmation */}
      <PositiveAffirmation />
      {/* DIY Stretches Link */}
      <DIY />
      {/* FB Group Link */}
      <FbGroup />
      {/* Navigator */}
    </ScrollView>
  );
}

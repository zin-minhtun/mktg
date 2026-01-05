import { View, Image, TouchableOpacity } from "react-native";
import BaseText from "../../designSystem/components/BaseText";
import React from "react";
import { Card } from "react-native-paper";
import * as Progress from 'react-native-progress';
import { useNavigation } from "@react-navigation/native";

export default function DailyStreak({ streak }) {
  const navigation = useNavigation();

  // STATE 1: Not Started
  // Figma Image 2 style: "Start >"
  return (
    <Card className="my-4 bg-white p-5 shadow-sm">
      {/* Top Section */}
      <View className="flex-row items-start mb-4">
        <Image
          source={require("../../../assets/images/Streak.png")}
          className="w-[50px] h-[50px] mr-3"
          resizeMode="contain"
        />

        <View className="flex-1">
          <BaseText className="font-ralewayBold text-[18px] text-[#003361] mb-1">
            Daily Streak
          </BaseText>
          <BaseText className="font-raleway text-[13px] text-gray-600 leading-5">
            Wow! You are good at keeping track!!!
          </BaseText>
          <BaseText className="font-raleway text-[13px] text-gray-600 leading-5">
            You visited the app <BaseText className="font-bold">{streak} days</BaseText> in a row.
          </BaseText>
        </View>
      </View>

      <View className="h-[1px] bg-gray-100 w-full mb-4" />

      {/* Bottom Section */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1 pr-2">
          <Progress.Circle
            size={50}
            progress={0}
            showsText={true}
            formatText={() => "0%"}
            textStyle={{ fontSize: 12, fontWeight: 'bold', color: '#000' }}
            color="#00B8DF"
            thickness={4}
            unfilledColor="#F0F0F0"
            borderWidth={0}
          />
          <BaseText className="font-raleway text-[12px] text-gray-500 ml-3 flex-1 flex-wrap">
            Take a moment to reflect on your journey.
          </BaseText>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate("Journal", { screen: "JournalMain", params: { section: "mood" } })}
          className="bg-[#00B8DF] px-6 py-3 rounded-full flex-row items-center shadow-md"
        >
          <BaseText className="text-white font-ralewayBold text-[14px] mr-1">Start</BaseText>
          <BaseText className="text-white font-bold text-[14px]">{">"}</BaseText>
        </TouchableOpacity>
      </View>
    </Card>
  );
}

import { View, Text } from "react-native";
import React from "react";
import ChartCard from "./ChartCard";

export default function Charts() {
  return (
    <View className=" bg-white mt-4">
      <View className="flex flex-row justify-between bg-white w-full px-2">
        <Text className="text-2xl">Charts</Text>
      </View>
      <ChartCard />
    </View>
  );
}

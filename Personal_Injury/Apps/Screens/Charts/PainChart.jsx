import { View, Text } from "react-native";
import React from "react";
import ChartFilter from "../../Components/Chart/ChartFilter";
import ChartCard from "../../Components/Chart/ChartCard";

export default function PainChart() {
  return (
    <View className="flex-1 bg-white">
      <ChartFilter />
      <ChartCard />
    </View>
  );
}

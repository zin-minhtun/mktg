import { View, Text } from "react-native";
import React from "react";
import { Card } from "react-native-paper";

// TODO: To Be Determined

export default function DailyStreak() {
  return (
    <Card className=" my-4 bg-white p-3">
      <Text className="text-2xl">DailyStreak</Text>
      <Text className="text-lg">WOW! you are good at keeping track!</Text>
      <Text className="text-lg">You visited the APP 7 days in a row</Text>
    </Card>
  );
}

import { View, Text, ImageBackground } from "react-native";
import React from "react";
import { Card } from "react-native-paper";

export default function PositiveAffirmationCard() {
  return (
    <Card
      className="h-[375px] mt-2 items-center justify-center px-7 py-12 mt-4 mb-10"
      style={{
        backgroundColor: "#003361E5",
        borderTopRightRadius: 40,
        borderBottomLeftRadius: 40,
      }}
    >
      <View className="w-[65%] items-center justify-center">
        <Text className="text-white font-medium text-[50px] text-center" style={{ fontFamily: "IntrudingCat"}}>
          I am healing with every breath I take.
        </Text>
      </View>
    </Card>

  );
}

import { View, Text, ImageBackground } from "react-native";
import React from "react";
import { Card } from "react-native-paper";

export default function PositiveAffirmationCard() {
  return (
    <Card className="mt-2 bg-white">
      {/* TODO: Change it to video */}
      <ImageBackground
        source={require("../../../assets/images/StickyNote.png")}
        resizeMode="cover"
        className=" h-[380px] w-full justify-center items-center rounded-xl bg-white"
      >
        {/* TODO: Get Presets Motivational Quotes */}
        <View className=" w-[60%] items-center justify-center ">
          <Text className="font-semibold  text-[18px] ">
            "I am healing with each breath I take"
          </Text>
        </View>
      </ImageBackground>
    </Card>
  );
}

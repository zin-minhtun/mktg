import { View, Text, ImageBackground, TouchableOpacity } from "react-native";
import React from "react";
import { Card } from "react-native-paper";
import { EvilIcons } from "@expo/vector-icons";

export default function FbGroup() {
  return (
    <Card className="my-4 bg-white">
      <ImageBackground
        source={require("../../../assets/images/Community.jpg")}
        resizeMode="cover"
        className=" w-full h-[250px] rounded-xl"
      >
        <TouchableOpacity className=" absolute bottom-0 right-0 left-0 p-3 flex-row justify-between bg-slate-50">
          <Text className="text-[16px]">Join Our Community</Text>
          <EvilIcons name="external-link" size={24} color="black" />
        </TouchableOpacity>
      </ImageBackground>
    </Card>
  );
}

import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { Card } from "react-native-paper";
import { EvilIcons } from "@expo/vector-icons";

export default function DIY({navigation}) {
  return (
    <Card className="mb-4 mt-12 h-[250px] rounded-[35px] p-5" style={{ backgroundColor: "#CCE7FF" }}>

          <Image 
            source={require("../../../assets/images/DIYman.png")} 
            className="absolute top-[-150px] right-[45px] w-[218px] h-[270px]" 
            resizeMode="contain"
          />

          <Image 
            source={require("../../../assets/images/DIYwoman.png")} 
            className="absolute top-[100px] right-[-30px] w-[240px] h-[168px]" 
            resizeMode="contain"
          />

          <View className="my-5 w-[129px] h-[64px]">
            <Text className="text-[24px] font-bold">DIY Stretch Exercises</Text>
          </View>

          <TouchableOpacity 
            className="flex-row items-center justify-center bg-[#00B8DF] rounded-[33px] w-[129px] h-[48px]"
            onPress={() => navigation.navigate("JournalNavigator", { screen: "Exercise" })}
          >
            <Text className="text-white font-raleway text-[16px] font-semibold">Start</Text>
            <EvilIcons name="external-link" size={24} color="white" />
          </TouchableOpacity>

    </Card>
  );
}

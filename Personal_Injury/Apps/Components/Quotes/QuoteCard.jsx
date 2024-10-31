import { View, Text, ImageBackground } from "react-native";
import React, { useRef, useState } from "react";
import { Card } from "react-native-paper";
import { Video, ResizeMode } from "expo-av";

export default function QuoteCard() {
  const videoRef = useRef(null);
  const [status, setStatus] = useState({});
  return (
    <Card className="mt-2">
      {/* TODO: Change it to video */}
      {/* <ImageBackground
        source={require("../../../assets/images/Nature.jpg")}
        resizeMode="cover"
        className=" h-[250px] w-full justify-center items-center rounded-xl"
        imageStyle={{ borderRadius: 12 }}
      > */}
      <Video
        ref={videoRef}
        className=" h-[250px] w-full justify-center items-center rounded-xl"
        source={require("../../../assets/videos/QuoteVideo1.mp4")}
        resizeMode={ResizeMode.COVER}
        isLooping
        shouldPlay
        onPlaybackStatusUpdate={(status) => setStatus(() => status)}
      />
      {/* TODO: Get Presets Motivational Quotes */}
      <View className=" absolute top-[100px] p-2 ">
        <Text className=" text-white text-[18px] font-bold">
          "The best way to predict the future is to create it."
        </Text>
        <Text className=" text-white text-right">- Peter Drucker</Text>
      </View>
      {/* </Video> */}
      {/* </ImageBackground> */}
    </Card>
  );
}

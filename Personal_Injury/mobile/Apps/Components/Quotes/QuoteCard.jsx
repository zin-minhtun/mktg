import { View, Text, ImageBackground } from "react-native";
import BaseText from "../../designSystem/components/BaseText";
import React, { useRef, useEffect, useState } from "react";
import { Card } from "react-native-paper";
//import { Video, ResizeMode } from "expo-av";
import { API_URL } from "@env";
import axios from "axios";


const QUOTE_API_URL = `${API_URL}/api/quotes/random`;

export default function QuoteCard() {
  //const videoRef = useRef(null);
  //const [status, setStatus] = useState({});
  const [quote, setQuote] = useState(null);

  useEffect(() => {
    const fetchRandomQuote = async () => {
      try {
        const response = await axios.get(QUOTE_API_URL, {
          headers: { "Content-Type": "application/json" },
        });

        if (response.status === 200) {
          setQuote(response.data);
        }
      } catch (error) {
        console.error("Error fetching quote:", error);
      }
    };

    fetchRandomQuote();
  }, []);

  return (
    <Card className="my-5">
      {/* TODO: Change it to video */}
      <ImageBackground
        source={require("../../../assets/images/Quote.png")}
        resizeMode="cover"
        className=" h-[310px] w-full justify-center items-center"
        imageStyle={{ borderRadius: 12 }}
      >
        <View style={{ flex: 1, justifyContent: 'center', padding: 30 }}>
          {quote && (
            <View>
              <BaseText className=" text-white text-[20px]" style={{ fontFamily: 'InknutAntiqua' }}>"{quote.text}"</BaseText>
              <BaseText className=" text-white text-[20px] text-left" style={{ fontFamily: 'InknutAntiqua' }}>— {quote.author}</BaseText>
            </View>
          )}
        </View>
      </ImageBackground>

      {/*
      <Video
        ref={videoRef}
        className=" h-[310px] w-full justify-center items-center rounded-xl"
        source={require("../../../assets/videos/QuoteVideo1.mp4")}
        resizeMode={ResizeMode.COVER}
        isLooping
        shouldPlay
        onPlaybackStatusUpdate={(status) => setStatus(() => status)}
      />
      */}
      {/* </Video> */}
    </Card>
  );
}

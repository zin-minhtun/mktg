import React, { useState, useRef } from "react";
import {
  View,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
  Platform,
  StatusBar
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const GetStartedScreen = ({ navigation }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slideRef = useRef(null);

  const slides = [
    {
      id: 1,
      image: require("../../../assets/illustrations/onboarding/daily_health_log.png"),
      title: "Daily Health Log",
      text: "Journal your daily health with Interact Health PRO",
    },
    {
      id: 2,
      image: require("../../../assets/illustrations/onboarding/share_journey.png"),
      title: "Share Your Journey",
      text: "Share your journey with doctors, lawyers, or other professionals",
    },
    {
      id: 3,
      image: require("../../../assets/illustrations/onboarding/join_community.png"),
      title: "Join Community",
      text: "Connect, share, and grow with like-minded individuals",
    }
  ];

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const scrollToNext = () => {
    if (currentSlide < slides.length - 1) {
      slideRef.current.scrollTo({ x: (currentSlide + 1) * width, animated: true });
    } else {
      navigation.navigate("OnboardingStack");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <ScrollView
        ref={slideRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(event) => {
          const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentSlide(slideIndex);
        }}
        contentContainerStyle={{ alignItems: 'center' }}
      >
        {slides.map((slide, index) => (
          <View key={index} style={{ width }} className="items-center justify-center px-6">
            <View className="items-center w-full">
              {/* Illustration */}
              <View className="h-[240px] w-full items-center justify-center mb-8">
                <Image
                  source={slide.image}
                  style={{ width: 280, height: 240 }}
                  resizeMode="contain"
                />
              </View>

              {/* Text Content */}
              <Text
                className="text-[#003361] text-[26px] font-bold text-center mb-3 font-ralewayBold"
                allowFontScaling={false}
                style={{ lineHeight: 32 }}
              >
                {slide.title}
              </Text>
              <Text
                className="text-[#939598] text-[16px] text-center px-4 font-raleway"
                allowFontScaling={false}
                style={{ lineHeight: 24 }}
              >
                {slide.text}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Container */}
      <View className="w-full px-6 mb-4">

        {/* Pagination Dots */}
        <View className="flex-row justify-center mb-8">
          {slides.map((_, index) => (
            <View
              key={index}
              className={`w-2 h-2 rounded-full mx-1 ${currentSlide === index ? "bg-[#003361]" : "bg-gray-300"}`}
            />
          ))}
        </View>

        {/* Navigation Button Area */}
        <View className="h-[60px] justify-center mb-2">
          {currentSlide === slides.length - 1 ? (
            <TouchableOpacity
              className="bg-[#00B8DF] w-full py-4 rounded-full shadow-sm items-center"
              onPress={scrollToNext}
            >
              <Text
                className="text-white text-lg font-bold font-ralewayBold"
                allowFontScaling={false}
              >
                Get Started
              </Text>
            </TouchableOpacity>
          ) : (
            <View className="items-end w-full">
              <TouchableOpacity
                onPress={scrollToNext}
                className="bg-[#00B8DF] rounded-full p-4 w-[60px] h-[60px] items-center justify-center"
              >
                <Feather name="arrow-right" size={32} color="white" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Login Link */}
        <View className="items-center h-[30px] justify-center">
          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            className="flex-row justify-center items-center"
          >
            <Text
              className="text-gray-400 text-[14px] font-raleway mr-1"
              allowFontScaling={false}
            >
              Already have an account?
            </Text>
            <Text
              className="text-[#00B8DF] text-[14px] font-bold font-ralewayBold"
              allowFontScaling={false}
            >
              Log in here
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
};

export default GetStartedScreen;

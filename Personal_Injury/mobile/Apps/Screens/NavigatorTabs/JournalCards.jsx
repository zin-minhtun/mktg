import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

const Card = ({ title, bgColor, imageSource, targetScreen }) => {
  return (
    <View className={`w-[180px] h-[180px] rounded-[25px] m-2 flex items-center justify-center`} style={{ backgroundColor: bgColor }}>
      <View className="w-[76px] h-[103px] px-[10px] flex items-center gap-[10px]">
        <Image source={imageSource} className="w-[50px] h-[50px]" />
      </View>
      <Text className="font-raleway font-semibold text-[20px] text-[#003361] leading-[26px] tracking-[-0.5px] mb-[5px]">
        {title}
      </Text>
    </View>
  );
};

const JournalCards = ({ navigation }) => {
  return (
    <View className="flex flex-row flex-wrap justify-center my-5">
      <View className="flex flex-row">
        <TouchableOpacity onPress={() => navigation.navigate("Journal", { screen: "JournalMain", params: { section: "pain" } })}>
          <Card title="Pain" bgColor="#DFF7FD" imageSource={require("../../../assets/images/Pain.png")} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Journal", { screen: "JournalMain", params: { section: "medication" } })}>
          <Card title="Medication" bgColor="#CADEEF" imageSource={require("../../../assets/images/Medication.png")} />
        </TouchableOpacity>
      </View>
      <View className="flex flex-row">
        <TouchableOpacity onPress={() => navigation.navigate("Journal", { screen: "JournalMain", params: { section: "symptoms" } })}>
          <Card title="Symptoms" bgColor="#FFC6C6" imageSource={require("../../../assets/images/Symptoms.png")} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Journal", { screen: "JournalMain", params: { section: "mood" } })}>
          <Card title="Mood" bgColor="#F5EED1" imageSource={require("../../../assets/images/Mood.png")} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default JournalCards;

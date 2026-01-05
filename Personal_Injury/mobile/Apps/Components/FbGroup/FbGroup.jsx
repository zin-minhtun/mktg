import { View, Text, Image, TouchableOpacity, Linking } from "react-native";
import React from "react";
import { Card } from "react-native-paper";
import { EvilIcons } from "@expo/vector-icons";

export default function FbGroup() {
  const handleJoinPress = () => {
    Linking.openURL("https://www.facebook.com/groups/230392641374560/?rdid=MhFFE57DlcWuniaI&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2Fg%2F1C4mRvLRz5%2F#");
  };

  return (
    <Card className="mb-5 mt-12 h-[250px] rounded-[35px] p-5" style={{ backgroundColor: "#FFC6C6" }}>

      <Image
        source={require("../../../assets/images/Community.png")}
        className="absolute top-[-50px] left-[-10px] w-[212px] h-[278px]"
        resizeMode="contain"
      />

      <View className="absolute bottom-[-200px] right-[-5px]">
        <Text className="text-[24px] font-bold my-5 text-[#003361]">Community</Text>
        <TouchableOpacity
          className="flex-row items-center justify-center bg-[#00B8DF] rounded-[33px] w-[129px] h-[48px]"
          onPress={handleJoinPress}
        >
          <Text className="text-white font-raleway text-[16px] font-semibold">Join</Text>
          <EvilIcons name="external-link" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </Card>
  );
}

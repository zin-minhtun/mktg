import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect } from "react";
import { useUserData } from "../../Contexts/UserContext";

export default function LandingScreen({ navigation }) {
  const { gUser, isLoading } = useUserData();

  useEffect(() => {
    if (gUser) {
      navigation.reset({
        index: 0,
        routes: [{ name: "TabNavigator", params: { screen: "Home" } }],
      });
    }
  }, [gUser, navigation]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Image
        source={require("../../../assets/images/IHP_Logo.png")}
        className="w-[250px] h-[250px] object-cover rounded-full mt-10 flex-1"
        resizeMode="contain"
      />
      <View className=" width-100 px-8 py-24 bg-white rounded-t-3xl flex-2" style={{backgroundColor:"#003361"}}>
        <Text className="text-center color-white font-medium text-2xl mb-4 ">
          Are you an Interact Health PRO client?
        </Text>
        <View className="flex-row justify-between ">
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("AuthenticationNavigator", {
              screen: "Sign Up Email",
            })
          }
          className=" w-40 p-3 mt-8 bg-white rounded-3xl"
        >
          <Text  className="text-white text-center color-cyan-400 text-xl">No</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("AuthenticationNavigator", { screen: "Login" })
          }
          className="w-40 p-3 bg-cyan-400 rounded-3xl mt-8"
        >
          <Text className="text-white text-center text-xl">Yes</Text>
        </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

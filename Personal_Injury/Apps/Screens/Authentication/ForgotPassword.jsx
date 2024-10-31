import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

export default function ForgotPassword({ navigation }) {
  const [email, setEmail] = useState("");

  const handleNext = () => {
    navigation.navigate("Forgot Password", { email });
  };
  return (
    <View className="flex-1 bg-white p-4">
      <Text className="font-raleway text-left text-3xl mb-2 font-medium mt-8 text-blue-900">
        Forgot Password
      </Text>
      <Text className=" font-raleway text-gray-400 mt-2 mb-8  text-base">
        Don't worry; it happens to the best of us. 
      </Text>
      <Text className="font-raleway font-medium text-base mb-2 text-blue-900 ">Email</Text>
      <TextInput
        className="font-raleway  w-full p-3 pl-5  border border-gray-300 rounded-xl mb-4 text-base"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <TouchableOpacity
        className="w-full p-3 bg-cyan-500 rounded-3xl"
        onPress={handleNext}
      >
        <Text className="text-white text-center text-lg rounded-xl">Forget Password</Text>
      </TouchableOpacity>
    </View>
  );
}

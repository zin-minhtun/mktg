import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUserData } from "../../Contexts/UserContext";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { setNavigation } = useUserData();

  useEffect(() => {
    // Set the navigation object in UserContext to handle navigation after login
    setNavigation(navigation);
  }, [navigation, setNavigation]);

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      navigation.navigate("TabNavigator", { screen: "Home" });
    } catch (error) {
      console.error(`Error [${error.code}]: ${error.message}`);
      alert("Invalid email or password");
    }
  };

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="font-raleway text-left text-3xl mb-2 font-medium mt-8 text-blue-900">
        Log In
      </Text>
      <Text className="font-raleway font-medium text-base mb-2 text-blue-950">
        Email:
      </Text>
      <TextInput
        className="font-raleway  w-full p-3 pl-5  border border-gray-300 rounded-xl mb-4 text-base"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <Text className="font-raleway font-medium text-base mb-2 text-blue-950">
        Password:
      </Text>
      <View>
        <TextInput
          className="font-raleway  w-full p-3 pl-5  border border-gray-300 rounded-xl mb-4 text-base"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={{ position: "absolute", right: 10, top: 20 }}
        >
          <Entypo
            name={showPassword ? "eye-with-line" : "eye"}
            size={24}
            color="black"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        className="w-full p-3 bg-cyan-500 rounded-3xl mt-20"
        onPress={handleLogin}
      >
        <Text className="text-white text-center text-lg rounded-xl">
          Log In
        </Text>
      </TouchableOpacity>

      <View className=" w-full flex-row justify-center my-4 ">
        <TouchableOpacity
          onPress={() => navigation.navigate("Forgot Password")}
        >
          <Text className="text-base items-right text-cyan-500 underline">
            Forgot Password
          </Text>
        </TouchableOpacity>
      </View>

      <View className=" mt-36 items-center ">
        <Text className="text-base text-gray-500">
          Don't have an account?{" "}
          <TouchableOpacity
            onPress={() => navigation.navigate("Sign Up Email")}
          >
            <Text className=" text-base text-cyan-500 underline p-0.5 ">
              Sign Up
            </Text>
          </TouchableOpacity>
        </Text>
      </View>
    </View>
  );
}

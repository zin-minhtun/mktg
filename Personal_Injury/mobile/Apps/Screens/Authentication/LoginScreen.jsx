import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { useUserData } from "../../Contexts/UserContext";
import ScreenLayout from "../../Components/Layout/ScreenLayout";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);

  // get login function from UserContext
  const { login, googleLogin, setNavigation } = useUserData();

  useEffect(() => {
    // Set the navigation prop in UserContext
    setNavigation(navigation);
  }, [navigation, setNavigation]);

  const handleLogin = async () => {
    try {
      // Validate inputs
      if (!email.trim() || !password.trim()) {
        Alert.alert("Error", "Please enter both email and password");
        return;
      }
      // show full-screen spinner to avoid any UI flash
      setLoggingIn(true);

      // Use the login function from UserContext
      const result = await login(email, password);

      if (result.success) {
        // Reset to AuthLoading so we show a spinner while the auth listener fetches backend data
        navigation.reset({ index: 0, routes: [{ name: "AuthLoading" }] });
      } else {
        setLoggingIn(false);
        Alert.alert("Login Error", result.error || "Invalid email or password");
      }
    } catch (error) {
      console.error(`Error [${error.code}]: ${error.message}`);
      setLoggingIn(false);
      Alert.alert("Login Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <ScreenLayout scroll={true}>
      <View className="flex-1 p-4">
        <Text className="font-raleway text-left text-3xl mb-2 font-medium mt-8 text-blue-900" allowFontScaling={false}>
          Log In
        </Text>
        <Text className="font-raleway font-medium text-base mb-2 text-blue-950" allowFontScaling={false}>
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
          allowFontScaling={false}
        />
        <Text className="font-raleway font-medium text-base mb-2 text-blue-950" allowFontScaling={false}>
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
            allowFontScaling={false}
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
          disabled={loggingIn}
        >
          {loggingIn ? (
            <Text className="text-white text-center text-lg rounded-xl" allowFontScaling={false}>
              Signing in…
            </Text>
          ) : (
            <Text className="text-white text-center text-lg rounded-xl" allowFontScaling={false}>
              Log In
            </Text>
          )}
        </TouchableOpacity>

        <View className=" w-full flex-row justify-center my-4 ">
          <TouchableOpacity
            onPress={() => navigation.navigate("Forgot Password")}
          >
            <Text className="text-base items-right text-cyan-500 underline" allowFontScaling={false}>
              Forgot Password
            </Text>
          </TouchableOpacity>
        </View>

        {/* Social auth divider */}
        <View className="flex-row items-center my-6">
          <View className="flex-1 h-px bg-gray-300" />
          <Text className="mx-2 font-raleway text-gray-500" allowFontScaling={false}>OR</Text>
          <View className="flex-1 h-px bg-gray-300" />
        </View>

        {/* Social auth buttons */}
        <View className="flex-row justify-center mb-6">
          <TouchableOpacity
            className="mx-4"
            onPress={() =>
              Alert.alert(
                "Social login",
                "Apple login is not configured yet."
              )
            }
          >
            <Ionicons name="logo-apple" size={32} color="#000000" />
          </TouchableOpacity>

          <TouchableOpacity
            className="mx-4"
            onPress={async () => {
              try {
                setLoggingIn(true);
                await googleLogin();
                // Navigation handled by onAuthStateChanged in UserContext
                // Manually triggering reset to ensure we catch the state change
                navigation.reset({ index: 0, routes: [{ name: "AuthLoading" }] });
              } catch (error) {
                setLoggingIn(false);
                if (error.code === '4001' || error.message.includes('Canceled')) {
                  console.log('Google sign in canceled');
                } else {
                  Alert.alert("Google Login Error", error.message);
                }
              }
            }}
          >
            <Ionicons name="logo-google" size={32} color="#DB4437" />
          </TouchableOpacity>

          <TouchableOpacity
            className="mx-4"
            onPress={() =>
              Alert.alert(
                "Social login",
                "Facebook login is not configured yet."
              )
            }
          >
            <Ionicons name="logo-facebook" size={32} color="#1877F2" />
          </TouchableOpacity>
        </View>

        <View className="items-center mt-4">
          <Text className="text-base text-gray-500" allowFontScaling={false}>
            Don't have an account?{" "}
            <TouchableOpacity
              onPress={() => navigation.navigate("Sign Up Email")}
            >
              <Text className=" text-base text-cyan-500 underline p-0.5 " allowFontScaling={false}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </Text>
        </View>
        {loggingIn && (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(255,255,255,0.9)",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
          >
            <ActivityIndicator size="large" color="#00B8DF" />
          </View>
        )}
      </View>
    </ScreenLayout>
  );
}

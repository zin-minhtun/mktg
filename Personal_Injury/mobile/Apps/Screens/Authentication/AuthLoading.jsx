import React, { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useUserData } from "../../Contexts/UserContext";
import { auth } from "../../../firebase";

export default function AuthLoading({ navigation }) {
  const { isLoading, gUser } = useUserData();

  useEffect(() => {
    let t = null;
    if (!isLoading) {
      t = setTimeout(async () => {
        try {
          const firebaseUser = auth.currentUser;
          if (firebaseUser) {
            navigation.reset({
              index: 0,
              routes: [{ name: "TabNavigator", params: { screen: "Home" } }],
            });
          } else {
            navigation.reset({ index: 0, routes: [{ name: "Login" }] });
          }
        } catch (e) {
          console.warn("AuthLoading navigation decision error", e);
          navigation.reset({ index: 0, routes: [{ name: "Login" }] });
        }
      }, 0);
    }
    return () => clearTimeout(t);
  }, [isLoading, gUser, navigation]);

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <ActivityIndicator size="large" color="#00B8DF" />
      <Text className="mt-4 text-base text-gray-700">Signing you in…</Text>
    </View>
  );
}

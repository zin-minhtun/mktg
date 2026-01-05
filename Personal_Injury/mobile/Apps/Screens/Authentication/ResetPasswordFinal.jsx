import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import ScreenLayout from "../../Components/Layout/ScreenLayout";

async function updatePassword(email, newPassword) {
  console.log("update:", email, newPassword);
}

export default function ResetPasswordFinalScreen({ navigation, route }) {
  const email = route?.params?.email || "";
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdatePassword = async () => {
    const trimmedNew = newPassword.trim();
    const trimmedConfirm = confirmPassword.trim();

    if (!trimmedNew || !trimmedConfirm) {
      Alert.alert("Missing fields", "Please enter and confirm your new password.");
      return;
    }

    if (trimmedNew !== trimmedConfirm) {
      Alert.alert("Passwords do not match", "Please make sure both passwords match.");
      return;
    }

    try {
      setIsSubmitting(true);
      await updatePassword(email, trimmedNew);
      Alert.alert(
        "Password updated!",
        "Your password has been changed. Click continue to log in.",
        [
          {
            text: "Log In",
            onPress: () => navigation.navigate("Login"),
          },
        ]
      );
    } catch (error) {
      console.error("Error updating password:", error);
      Alert.alert("Error", "Unable to update password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenLayout scroll={true} contentContainerStyle={{ flexGrow: 1 }}>
      <View className="flex-1 pt-8 px-4">
        <Text className="font-raleway text-left text-3xl mb-2 font-medium text-blue-900" allowFontScaling={false}>
          Set a new password
        </Text>
        <Text className="font-raleway text-gray-400 mt-2 mb-8 text-base" allowFontScaling={false}>
          Your new password must be different from previously used passwords.
        </Text>

        <Text className="font-raleway font-medium text-base mb-2 text-blue-900" allowFontScaling={false}>
          Password
        </Text>
        <TextInput
          className="font-raleway w-full p-3 pl-5 border border-gray-300 rounded-xl mb-4 text-base bg-white"
          placeholder="Enter new password here"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          allowFontScaling={false}
        />

        <Text className="font-raleway font-medium text-base mb-2 text-blue-900" allowFontScaling={false}>
          Confirm Password
        </Text>
        <TextInput
          className="font-raleway w-full p-3 pl-5 border border-gray-300 rounded-xl mb-6 text-base bg-white"
          placeholder="Re-enter password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          allowFontScaling={false}
        />

        <TouchableOpacity
          className="w-full p-3 bg-cyan-500 rounded-3xl mt-2"
          onPress={handleUpdatePassword}
          disabled={isSubmitting}
        >
          <Text className="text-white text-center text-lg rounded-xl" allowFontScaling={false}>
            {isSubmitting ? "Updating..." : "Update Password"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenLayout>
  );
}


import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../firebase";
import ScreenLayout from "../../Components/Layout/ScreenLayout";

export default function ForgotPassword({ navigation }) {
  const [email, setEmail] = useState("");

  const handleReset = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        "Success",
        "Password reset email sent. Please check your inbox."
      );
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <ScreenLayout scroll={true}>
      <View style={{ flex: 1, padding: 20 }}>
        <Text style={{ fontSize: 26, fontWeight: "bold", marginBottom: 10 }} allowFontScaling={false}>
          Forgot Password
        </Text>

        <Text style={{ marginBottom: 20 }} allowFontScaling={false}>
          Enter your email and we will send you a password reset link.
        </Text>

        <TextInput
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          style={{
            borderWidth: 1,
            borderRadius: 10,
            padding: 12,
            marginBottom: 20,
            borderColor: "#ccc",
          }}
          value={email}
          onChangeText={setEmail}
          allowFontScaling={false}
        />

        <TouchableOpacity
          onPress={handleReset}
          style={{
            backgroundColor: "#00bcd4",
            padding: 15,
            borderRadius: 12,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontSize: 16 }} allowFontScaling={false}>Reset Password</Text>
        </TouchableOpacity>
      </View>
    </ScreenLayout>
  );
}

import React, { useRef, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import ScreenLayout from "../../Components/Layout/ScreenLayout";

async function sendResetCode(email) {
  console.log("send code to:", email);
}

async function verifyCode(email, code) {
  console.log("verify:", email, code);
  return true;
}

function maskEmail(email) {
  if (!email) return "";
  const [local, domain] = email.split("@");
  if (!domain) return email;
  const visibleStart = local.slice(0, 3);
  const visibleEnd = local.slice(-2);
  const maskedMiddle = local.length > 5 ? "*****" : "***";
  return `${visibleStart}${maskedMiddle}${visibleEnd}@${domain}`;
}

export default function VerificationCodeScreen({ navigation, route }) {
  const email = route?.params?.email || "";
  const [digits, setDigits] = useState(["", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const refs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  const handleChangeDigit = (index, value) => {
    const clean = value.replace(/[^0-9]/g, "").slice(-1);
    const next = [...digits];
    next[index] = clean;
    setDigits(next);

    if (clean && index < refs.length - 1) {
      refs[index + 1].current?.focus();
    }
    if (!clean && index > 0) {
      refs[index - 1].current?.focus();
    }
  };

  const handleVerify = async () => {
    const code = digits.join("");
    if (code.length !== 4) {
      Alert.alert("Invalid code", "Please enter the 4-digit code.");
      return;
    }

    try {
      setIsSubmitting(true);
      const ok = await verifyCode(email, code);
      if (ok) {
        navigation.navigate("ResetPasswordFinal", { email });
      } else {
        Alert.alert("Error", "The verification code is incorrect.");
      }
    } catch (error) {
      console.error("Error verifying code:", error);
      Alert.alert("Error", "Unable to verify the code. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    try {
      await sendResetCode(email);
      Alert.alert("Code resent", "We have resent the verification code to your email.");
    } catch (error) {
      console.error("Error resending code:", error);
      Alert.alert("Error", "Unable to resend code. Please try again.");
    }
  };

  return (
    <ScreenLayout scroll={true} contentContainerStyle={{ flexGrow: 1 }}>
      <View className="flex-1 pt-8 px-4">
        <Text className="font-raleway text-left text-3xl mb-2 font-medium text-blue-900" allowFontScaling={false}>
          Enter Verification Code
        </Text>
        <Text className="font-raleway text-gray-400 mt-2 mb-8 text-base" allowFontScaling={false}>
          We've sent the code to reset your password to {maskEmail(email)}.
        </Text>

        <View className="flex-row justify-between mb-8">
          {digits.map((digit, index) => (
            <TextInput
              key={index}
              ref={refs[index]}
              className="w-14 h-14 border border-gray-300 rounded-lg text-center text-xl bg-white"
              keyboardType="numeric"
              maxLength={1}
              value={digit}
              onChangeText={(value) => handleChangeDigit(index, value)}
              allowFontScaling={false}
            />
          ))}
        </View>

        <TouchableOpacity
          className="w-full p-3 bg-cyan-500 rounded-3xl mt-2"
          onPress={handleVerify}
          disabled={isSubmitting}
        >
          <Text className="text-white text-center text-lg rounded-xl" allowFontScaling={false}>
            {isSubmitting ? "Verifying..." : "Verify Code"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleResend} className="mt-4">
          <Text className="text-center text-cyan-500 underline text-base" allowFontScaling={false}>
            Resend Code
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenLayout>
  );
}


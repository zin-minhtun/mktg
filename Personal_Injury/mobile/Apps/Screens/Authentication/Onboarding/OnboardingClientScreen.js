import React from "react";
import { View, Image, TouchableOpacity } from "react-native";
import BaseText from "../../../designSystem/components/BaseText";
import { useOnboarding } from "../../../Contexts/OnboardingContext";

export default function OnboardingClientScreen({ navigation }) {
  const { updateField } = useOnboarding();

  const handleSelect = (isClient) => {
    // Don't reset here - onboardingId must persist until after signup
    updateField("isClient", isClient);
    if (isClient) {
      navigation.navigate("HaveAccount");
    } else {
      navigation.navigate("PersonalInjuryOntario");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Top Section */}
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Image
          source={require("../../../../assets/images/IHP_Logo.png")}
          style={{ width: 200, height: 200, resizeMode: "contain" }}
        />
      </View>

      {/* Bottom Sheet */}
      <View
        style={{
          flex: 1,
          backgroundColor: "#003A5D",
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          paddingHorizontal: 24,
          paddingVertical: 32,
          justifyContent: "center",
        }}
      >
        <BaseText
          style={{
            fontSize: 22,
            color: "white",
            textAlign: "center",
            marginBottom: 24,
            fontWeight: "600",
          }}
        >
          Are you an Interact Health PRO client?
        </BaseText>
        <View style={{ flexDirection: "row", gap: 16 }}>
          <TouchableOpacity
            onPress={() => handleSelect(false)}
            style={{
              flex: 1,
              paddingVertical: 14,
              backgroundColor: "white",
              borderRadius: 30,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BaseText style={{ color: "#06b6d4", fontSize: 18 }}>No</BaseText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleSelect(true)}
            style={{
              flex: 1,
              paddingVertical: 14,
              backgroundColor: "#06b6d4",
              borderRadius: 30,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BaseText style={{ color: "white", fontSize: 18 }}>Yes</BaseText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

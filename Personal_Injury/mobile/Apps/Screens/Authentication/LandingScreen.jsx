import { View, Image, TouchableOpacity } from "react-native";
import React from "react";
import BaseText from "../../designSystem/components/BaseText";
import { colors } from "../../designSystem/theme";
import ScreenLayout from "../../Components/Layout/ScreenLayout";

export default function LandingScreen({ navigation }) {
  return (
    <ScreenLayout scroll={false} backgroundColor="#fff">
      {/* TOP SECTION */}
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Image
          source={require("../../../assets/images/IHP_Logo.png")}
          style={{ width: 200, height: 200, resizeMode: "contain" }}
        />
      </View>

      {/* BOTTOM SECTION */}
      <View
        style={{
          flex: 1,
          backgroundColor: colors.secondary,
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

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          {/* NO BUTTON */}
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("AuthenticationNavigator", {
                screen: "Sign Up Email",
              })
            }
            style={{
              flex: 1,
              paddingVertical: 14,
              backgroundColor: "white",
              borderRadius: 30,
              borderWidth: 1,
              borderColor: colors.primary,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BaseText style={{ color: colors.primary, fontSize: 16 }}>No</BaseText>
          </TouchableOpacity>

          {/* YES BUTTON */}
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("AuthenticationNavigator", {
                screen: "Login",
              })
            }
            style={{
              flex: 1,
              paddingVertical: 14,
              backgroundColor: colors.primary,
              borderRadius: 30,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BaseText style={{ color: "white", fontSize: 16 }}>Yes</BaseText>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenLayout>
  );
}

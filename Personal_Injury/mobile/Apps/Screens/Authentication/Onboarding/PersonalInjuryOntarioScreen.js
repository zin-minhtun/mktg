import React from "react";
import { View, TouchableOpacity } from "react-native";
import BaseText from "../../../designSystem/components/BaseText";
import { useOnboarding } from "../../../Contexts/OnboardingContext";
import { colors } from "../../../designSystem/theme";

export default function PersonalInjuryOntarioScreen({ navigation }) {
  const { updateField } = useOnboarding();

  const handleSelect = (value) => {
    updateField("hadPersonalInjuryOntario", value);
    navigation.navigate("IncidentType");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* TOP SECTION */}
      <View style={{ flex: 1, justifyContent: "flex-end", paddingHorizontal: 24, paddingBottom: 24 }}>
        <BaseText
          style={{
            fontSize: 22,
            fontWeight: "700",
            color: colors.secondary,
            textAlign: "center",
          }}
        >
          Have you had a Personal Injury accident in Ontario?
        </BaseText>
      </View>

      {/* BOTTOM SECTION */}
      <View
        style={{
          flex: 1,
          backgroundColor: colors.secondary,
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          paddingHorizontal: 24,
          paddingTop: 40,
          justifyContent: "flex-start",
        }}
      >
        <View style={{ flexDirection: "row", gap: 16 }}>
          {/* NO BUTTON */}
          <TouchableOpacity
            onPress={() => handleSelect(false)}
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
            <BaseText style={{ color: colors.primary, fontSize: 16 }}>
              No
            </BaseText>
          </TouchableOpacity>

          {/* YES BUTTON */}
          <TouchableOpacity
            onPress={() => handleSelect(true)}
            style={{
              flex: 1,
              paddingVertical: 14,
              backgroundColor: colors.primary,
              borderRadius: 30,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BaseText style={{ color: "white", fontSize: 16 }}>
              Yes
            </BaseText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

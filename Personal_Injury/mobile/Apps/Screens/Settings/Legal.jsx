import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../Contexts/ThemeContext";

const HEADER_SPACE = 132; // content starts this far below the header

export default function Legal({ navigation }) {
  const { theme } = useTheme();

  const Card = ({ label, icon = "shield-outline", onPress, isLast }) => (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: theme.textFieldBG,
        borderRadius: 10,
        paddingHorizontal: 16,
        height: 58,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: isLast ? 0 : 16,
        borderWidth: 1,
        borderColor: theme.borderColor,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Ionicons name={icon} size={18} color={theme.textColor} />
        <Text style={{ color: theme.textColor, fontSize: 16, marginLeft: 8 }}>
          {label}
        </Text>
      </View>
      <Text style={{ color: theme.darkGrey, fontSize: 20 }}>›</Text>
    </Pressable>
  );

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={{ paddingTop: HEADER_SPACE, paddingHorizontal: 16, paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
    >
      <Card icon="document-text-outline" label="Terms and Policies" onPress={() => navigation?.navigate?.("TermsAndPolicies")} />
      <Card icon="shield-outline" label="Disclaimers" onPress={() => navigation?.navigate?.("Disclaimers")} isLast />
    </ScrollView>
  );
}

import React from "react";
import { View, Text } from "react-native";
import { useTheme } from "../../Contexts/ThemeContext";

const MyHealthRecord = () => {
  const { theme } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: theme.background, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ color: theme.textColor, fontSize: 18 }}>
        My Health Record (placeholder)
      </Text>
    </View>
  );
};

export default MyHealthRecord;

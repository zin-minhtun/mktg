import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../Contexts/ThemeContext";

const HEADER_SPACE = 88; // height of your sticky header area

export default function Feedback() {
  const { theme } = useTheme();
  const [text, setText] = useState("");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 120 : 0}
      >
        <View style={{ flex: 1, paddingHorizontal: 16, paddingBottom: 16, paddingTop: HEADER_SPACE }}>
          {/* Input box */}
          <View
            style={{
              borderWidth: 1,
              borderColor: theme.borderColor,
              borderRadius: 12,
              backgroundColor: theme.textFieldBG,
              padding: 12,
              minHeight: 110,
              position: "relative",
              marginBottom: 16,
            }}
          >
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Write something"
              placeholderTextColor={theme.darkGrey}
              multiline
              style={{ color: theme.textColor, minHeight: 86, textAlignVertical: "top" }}
            />

            {/* Mic button (small, right-aligned) */}
            <Pressable
              onPress={() => {}}
              hitSlop={10}
              style={{
                position: "absolute",
                right: 10,
                bottom: 10,
                width: 36,
                height: 36,
                borderRadius: 18,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: theme.background,
                borderWidth: 1,
                borderColor: theme.borderColor,
              }}
            >
              <Ionicons name="mic-outline" size={18} color={theme.textColor} />
            </Pressable>
          </View>

          {/* Send button */}
          <Pressable
            onPress={() => {}}
            accessibilityRole="button"
            style={{
              alignSelf: "stretch",
              paddingVertical: 14,
              borderRadius: 24,
              backgroundColor: "#00B8DF",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontSize: 16 }}>Send Suggestions</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import { COLORS, SPACING, TYPOGRAPHY } from "./OnboardingTheme";
import BaseText from "../../../designSystem/components/BaseText";

export default function OnboardingBaseLayout({
  navigation,
  title,
  subtitle,
  step,
  totalSteps,
  children,
  hideBack,
  footer,
}) {
  const insets = useSafeAreaInsets();
  const progress = totalSteps ? step / totalSteps : 0;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.headerRow}>
        {!hideBack && (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <AntDesign name="left" size={22} color="black" />
          </TouchableOpacity>
        )}
        <View style={styles.headerTitle} />
        {!hideBack && <View style={styles.backSpacer} />}
      </View>

      {/* Progress Bar */}
      <View style={styles.progressTrack}>
        <View
          style={[styles.progressBar, { width: `${progress * 100}%` }]}
        />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: SPACING.horizontal,
            paddingTop: 0, // Title has its own margin
            paddingBottom: 24,
          }}
          keyboardShouldPersistTaps="handled"
        >
          {!!title && <BaseText style={styles.title}>{title}</BaseText>}
          {subtitle ? <BaseText style={styles.subtitle}>{subtitle}</BaseText> : null}

          {children}
        </ScrollView>

        <View
          style={{
            paddingHorizontal: SPACING.horizontal,
            paddingTop: 16,
            paddingBottom: Math.max(insets.bottom, 16),
            backgroundColor: '#FFFFFF',
          }}
        >
          {footer}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: SPACING.horizontal,
    paddingTop: 16,
  },
  backButton: {
    paddingRight: 12,
    paddingVertical: 4,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    ...TYPOGRAPHY.headerTitle,
  },
  backSpacer: {
    width: 22,
  },
  progressTrack: {
    width: "100%",
    height: 2,
    backgroundColor: COLORS.progressTrack,
    marginBottom: 24,
  },
  progressBar: {
    height: 2,
    backgroundColor: COLORS.primary,
  },
  title: {
    ...TYPOGRAPHY.title,
    marginBottom: 8,
    maxWidth: "90%",
  },
  subtitle: {
    ...TYPOGRAPHY.helper,
    marginBottom: 16,
    maxWidth: "90%",
  },
});

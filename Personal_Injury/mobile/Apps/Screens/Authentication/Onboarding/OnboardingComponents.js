import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
} from "react-native";
import { COLORS, SPACING, TYPOGRAPHY } from "./OnboardingTheme";

export const QuestionTitle = ({ children }) => (
  <Text style={[styles.title, TYPOGRAPHY.title]}>{children}</Text>
);

export const HelperText = ({ children }) => (
  <Text style={[styles.helper, TYPOGRAPHY.helper]}>{children}</Text>
);

export const FooterHelperText = ({ children }) => (
  <Text style={[styles.footerHelper, TYPOGRAPHY.footerHelper]}>{children}</Text>
);

export const PrimaryButton = ({ label, onPress, disabled }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.8}
    disabled={disabled}
    style={[
      styles.primaryButton,
      { backgroundColor: disabled ? "#C9C9C9" : COLORS.primary },
    ]}
  >
    <Text style={styles.primaryButtonLabel}>{label}</Text>
  </TouchableOpacity>
);

export const OptionRow = ({
  label,
  selected,
  onPress,
  variant = "checkbox",
}) => {
  const isRadio = variant === "radio";

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.optionRow}
    >
      <View
        style={[
          styles.optionIcon,
          isRadio && styles.optionIconRadio,
          selected && styles.optionIconSelected,
        ]}
      >
        {selected && !isRadio && <View style={styles.optionInnerSquare} />}
        {selected && isRadio && <View style={styles.optionInnerDot} />}
      </View>
      <View style={styles.optionLabelContainer}>
        <Text style={styles.optionLabel}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
};

export const LabeledSwitchRow = ({
  icon,
  label,
  value,
  onValueChange,
}: {
  icon: React.ReactNode;
  label: string;
  value: boolean;
  onValueChange: (val: boolean) => void;
}) => (
  <View style={styles.switchRow}>
    <View style={styles.switchIconContainer}>{icon}</View>
    <View style={styles.switchLabelContainer}>
      <Text style={styles.switchLabel}>{label}</Text>
    </View>
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: "#D3D3D3", true: COLORS.primary }}
      thumbColor="#FFFFFF"
    />
  </View>
);

const styles = StyleSheet.create({
  title: {
    marginBottom: SPACING.betweenProgressAndTitle - 8,
    maxWidth: "90%",
  },
  helper: {
    marginBottom: SPACING.verticalBetweenTitleAndOptions - 4,
    maxWidth: "90%",
  },
  footerHelper: {
    marginTop: 12,
  },
  primaryButton: {
    height: 48,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  primaryButtonLabel: {
    fontFamily: "Raleway",
    fontSize: 18,
    color: "#FFFFFF",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: SPACING.betweenOptions,
    paddingVertical: 4,
  },
  optionIcon: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginRight: 12,
  },
  optionIconRadio: {
    borderRadius: 12,
  },
  optionIconSelected: {
    backgroundColor: COLORS.primary,
  },
  optionInnerSquare: {
    width: 12,
    height: 12,
    backgroundColor: "#FFFFFF",
  },
  optionInnerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
  },
  optionLabelContainer: {
    flex: 1,
  },
  optionLabel: {
    ...TYPOGRAPHY.option,
    flexWrap: "wrap",
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  switchIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#E6F7FD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  switchLabelContainer: {
    flex: 1,
  },
  switchLabel: {
    ...TYPOGRAPHY.helper,
  },
});


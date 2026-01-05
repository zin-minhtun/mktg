import React from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SettingsSection from "../../Components/Settings/SettingsSection";
import SettingsItem from "../../Components/Settings/SettingsItem";
import { useTheme } from "../../Contexts/ThemeContext";

export default function DataShare() {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false} showsVerticalScrollIndicator={false}>
        <View style={styles.contentWrap}>
          <View style={[styles.cardShadow, styles.topGap, { borderRadius: 8 }]}>
            <SettingsSection title="">
              <View style={styles.rowPad}>
                <SettingsItem iconName="mail" itemText="Share Data via E-mail" screen="" />
              </View>
              <View style={styles.rowPad}>
                <SettingsItem iconName="download" itemText="Download" screen="" />
              </View>
              <View style={styles.rowPad}>
                <SettingsItem iconName="print" itemText="Print" screen="" />
              </View>
            </SettingsSection>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 32, paddingBottom: 24 },
  contentWrap: { width: "100%", maxWidth: 420, alignSelf: "center" },
  topGap: { marginTop: 32 },
  rowPad: { paddingVertical: 2 },
  cardShadow: {
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
});

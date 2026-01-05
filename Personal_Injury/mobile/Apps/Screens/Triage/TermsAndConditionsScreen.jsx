import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../Authentication/Onboarding/OnboardingTheme";

export default function TermsAndConditionsScreen({ navigation }) {
    const [accepted, setAccepted] = useState(false);

    const handleContinue = () => {
        // Navigate to Intro Video
        navigation.navigate("IntroVideo");
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Terms & Conditions</Text>

            <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
                <Text style={styles.text}>
                    Please review the terms and conditions for your personalized recovery plan.
                    {"\n\n"}
                    1. Confidentiality: Your data is secure...
                    {"\n\n"}
                    2. Medical Advice: This app provides support tools, not medical diagnosis...
                    {"\n\n"}
                    3. Legal Disclaimer: Discovery sessions are for information purposes...
                    {"\n\n"}
                    (Placeholder Text)
                </Text>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleContinue}
                >
                    <Text style={styles.buttonText}>Agree & Continue</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    title: {
        fontFamily: "Raleway",
        fontSize: 24,
        fontWeight: "700",
        color: COLORS.navy,
        textAlign: "center",
        marginVertical: 20,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
    },
    contentContainer: {
        paddingBottom: 20,
    },
    text: {
        fontFamily: "Raleway",
        fontSize: 14,
        color: "#4A4A4A",
        lineHeight: 22,
    },
    footer: {
        padding: 24,
        borderTopWidth: 1,
        borderTopColor: "#E0E0E0",
    },
    button: {
        backgroundColor: COLORS.primary,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: "center",
    },
    buttonText: {
        fontFamily: "Raleway",
        fontSize: 16,
        fontWeight: "700",
        color: "#FFFFFF",
    }
});

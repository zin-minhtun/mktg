import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../Authentication/Onboarding/OnboardingTheme";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function IntroVideoScreen({ navigation }) {

    const handleContinue = () => {
        // Navigate Back to Home (Resetting stack might be cleaner, but simple navigate works if Home is in history or we replace)
        // Since we are in a stack above TabNavigator, navigating to TabNavigator -> Home should work.
        navigation.navigate("TabNavigator", { screen: "Home" });
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Welcome Guide</Text>

            <View style={styles.videoContainer}>
                <View style={styles.videoPlaceholder}>
                    <MaterialCommunityIcons name="play-circle-outline" size={80} color="#FFFFFF" />
                    <Text style={styles.videoText}>Intro Video Placeholder</Text>
                </View>
            </View>

            <View style={styles.infoContainer}>
                <Text style={styles.infoText}>
                    Watch this short video to understand how we can help you with your recovery journey.
                </Text>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleContinue}
                >
                    <Text style={styles.buttonText}>Go to Home</Text>
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
    videoContainer: {
        height: 250,
        backgroundColor: "#000000",
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 24,
        borderRadius: 16,
        marginBottom: 32,
    },
    videoPlaceholder: {
        alignItems: "center",
    },
    videoText: {
        color: "#FFFFFF",
        marginTop: 10,
        fontFamily: "Raleway",
    },
    infoContainer: {
        paddingHorizontal: 32,
    },
    infoText: {
        fontFamily: "Raleway",
        fontSize: 16,
        color: "#4A4A4A",
        textAlign: "center",
        lineHeight: 24,
    },
    footer: {
        padding: 24,
        marginTop: "auto",
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

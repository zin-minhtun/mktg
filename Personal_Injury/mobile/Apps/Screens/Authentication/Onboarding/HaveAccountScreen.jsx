import React from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { useOnboarding } from "../../../Contexts/OnboardingContext";
import AsyncStorage from '@react-native-async-storage/async-storage';
import BaseText from "../../../designSystem/components/BaseText";
import { colors } from "../../../designSystem/theme";

export default function HaveAccountScreen({ navigation }) {
    const { updateField } = useOnboarding();

    const handleSelect = async (hasAccount) => {
        // If they have an account -> Go to Login
        if (hasAccount) {
            navigation.navigate("Login");
        } else {
            // If they do NOT have an account -> Skip onboarding -> Go to Signup
            // Set onboardingCompleted to true so they don't see this flow again if they stay logged out
            try {
                await AsyncStorage.setItem('onboardingCompleted', 'true');
            } catch (e) {
                console.log("Error saving onboarding status", e);
            }
            navigation.navigate("Sign Up Email");
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            {/* TOP SECTION */}
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Image
                    source={require("../../../../assets/images/IHP_Logo.png")}
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
                    Do you already have an account?
                </BaseText>

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

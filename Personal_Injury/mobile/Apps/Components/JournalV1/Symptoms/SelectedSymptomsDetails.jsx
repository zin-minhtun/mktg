import { View, Text, ScrollView, TouchableOpacity, Alert, SafeAreaView } from "react-native";
import React, { useState } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import axios from "axios";
import { API_URL } from "@env";
import { useTheme } from "../../../Contexts/ThemeContext";
import { useUserData } from "../../../Contexts/UserContext"; // Path to your context

// Symptom Menus
import ConfusionMenu from "./ConfusionMenu";
import NauseaMenu from "./NauseaMenu";
import BalanceLossMenu from "./BalanceLossMenu";
import FeelingDazedMenu from "./FeelingDazedMenu";
import TinnitusMenu from "./TinnitusMenu";
import NoiseSensitivityMenu from "./NoiseSensitivityMenu";
import LightSensitivityMenu from "./LightSensitivityMenu";
import ConsciousnessLossMenu from "./ConsciousnessLossMenu";
import AffectedVisionMenu from "./AffectedVisionMenu";

const SYMPTOM_MAP = {
    confusion: ConfusionMenu,
    balanceLoss: BalanceLossMenu,
    feelingDazed: FeelingDazedMenu,
    tinnitus: TinnitusMenu,
    noiseSensitivity: NoiseSensitivityMenu,
    lightSensitivity: LightSensitivityMenu,
    nausea: NauseaMenu,
    consciousnessLoss: ConsciousnessLossMenu,
    affectedVision: AffectedVisionMenu,
};

const SelectedSymptomsDetails = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { selectedSymptoms = [], otherSymptomNote = "" } = route.params || {};
    const { theme } = useTheme();

    // Get the ID from your context
    const { userId } = useUserData();

    const [allSymptomData, setAllSymptomData] = useState({});

    // Check if any symptom detail has been filled out
    const hasData = Object.values(allSymptomData).some(detail =>
        detail && Object.keys(detail).length > 0
    );

    const handleUpdate = (id, data) => {
        setAllSymptomData((prev) => ({
            ...prev,
            [id]: data,
        }));
    };

    const handleSave = async () => {
        if (!userId) {
            Alert.alert("Error", "User session not found. Please log in again.");
            return;
        }

        try {
            const payload = {
                userId: userId,
                symptoms: allSymptomData,
                notes: otherSymptomNote,
                date: new Date()
            };

            const response = await axios.post(`${API_URL}/api/symptoms/add`, payload);

            if (response.data.success || response.status === 200) {
                // Navigate to Journal tab (Tab Navigator level) to keep tab bar visible
                // This matches how Pain and other sections work
                navigation.navigate("Journal", {
                    screen: "JournalMain",
                    params: { section: 'symptoms' },
                });
                Alert.alert("Success", "Your symptoms have been logged.");
            }
        } catch (error) {
            console.error("Save Error:", error);
            Alert.alert("Error", "Could not save symptoms. Check your connection.");
        }
    };

    return (
        <SafeAreaView className="flex-1" style={{ backgroundColor: theme.background }}>
            <View className="flex-1 px-4" style={{ backgroundColor: theme.background }}>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: 120, paddingTop: 60 }}
                    showsVerticalScrollIndicator={false}
                >
                    <View className="mt-4">
                        <Text className="mb-10 font-ralewaySemiBold text-[24px] leading-8" style={{ color: theme.textColor }}>
                            What can you tell us about the symptoms?
                        </Text>

                        {selectedSymptoms.map((symptomId) => {
                            const MenuComponent = SYMPTOM_MAP[symptomId];
                            if (!MenuComponent) return null;
                            return (
                                <View key={symptomId} className="mb-4">
                                    <MenuComponent onUpdate={(data) => handleUpdate(symptomId, data)} />
                                </View>
                            );
                        })}
                    </View>

                    <View className="py-6">
                        <TouchableOpacity
                            // Blue if data exists, Gray if empty
                            className={`w-full py-4 rounded-full ${hasData ? "bg-primaryBlue" : "bg-gray-300"}`}
                            onPress={handleSave}
                            disabled={!hasData}
                            style={hasData && theme.mode !== 'dark' ? {
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.2,
                                shadowRadius: 4,
                                elevation: 5,
                            } : null}
                        >
                            <Text className="text-center text-white font-ralewaySemiBold text-[16px]">
                                Save to Journal
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

export default SelectedSymptomsDetails;
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import axios from "axios";
import { API_URL } from "@env";
import { useTheme } from "../../../Contexts/ThemeContext"; // Adjust path as needed

// Import all symptom menus
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

const EditSymptomDetails = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { symptomData } = route.params;
    const { theme } = useTheme();

    const [allSymptomData, setAllSymptomData] = useState(symptomData.symptoms);
    const hasChanges = JSON.stringify(allSymptomData) !== JSON.stringify(symptomData.symptoms);

    const handleUpdate = (id, data) => {
        setAllSymptomData((prev) => ({
            ...prev,
            [id]: data,
        }));
    };

    const handleSave = async () => {
        try {
            const payload = {
                symptoms: allSymptomData,
                notes: symptomData.notes,
                date: symptomData.date
            };

            const response = await axios.put(
                `${API_URL}/api/symptoms/${symptomData._id}`, 
                payload
            );

            if (response.data.success || response.status === 200) {
                Alert.alert("Success", "Symptom log updated");
                navigation.navigate("JournalMain", { section: "symptoms" })
            }
        } catch (error) {
            console.error("Update Error:", error);
            Alert.alert("Error", "Could not update symptoms");
        }
    };

    // Get symptom IDs that have data
    const activeSymptoms = Object.keys(symptomData.symptoms).filter(
        key => symptomData.symptoms[key] && Object.keys(symptomData.symptoms[key]).length > 0
    );

    return (
        <View 
            className="flex-1 px-4" 
            style={{ backgroundColor: theme.background }}
        >
            <ScrollView
                // Increased paddingBottom to 180 and paddingTop to 80
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 180, paddingTop: 80 }}
                showsVerticalScrollIndicator={false}
                keyboardDismissMode="on-drag"
            >
                <View>
                    <Text 
                        className="mb-10 font-ralewaySemiBold text-[24px] leading-8"
                        style={{ color: theme.textColor }}
                    >
                        Edit Symptom Details
                    </Text>

                    {activeSymptoms.map((symptomId) => {
                        const MenuComponent = SYMPTOM_MAP[symptomId];
                        if (!MenuComponent) return null;

                        return (
                            <View key={symptomId} className="mb-4">
                                <MenuComponent 
                                    onUpdate={(data) => handleUpdate(symptomId, data)}
                                    initialData={symptomData.symptoms[symptomId]}
                                />
                            </View>
                        );
                    })}
                </View>

                {/* Footer Action */}
                <View className="py-6">
                    <TouchableOpacity
                        // Conditional background color: Blue if changed, Gray if not
                        className={`w-full py-4 rounded-full ${hasChanges ? "bg-primaryBlue" : "bg-gray-300"}`}
                        style={hasChanges && theme.mode !== 'dark' ? {
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.2,
                            shadowRadius: 4,
                            elevation: 5,
                        } : null}
                        onPress={handleSave}
                        disabled={!hasChanges} // Disable button if no changes
                        activeOpacity={0.8}
                    >
                        <Text className="text-center text-white font-ralewaySemiBold text-[16px]">
                            Save Changes
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

export default EditSymptomDetails;
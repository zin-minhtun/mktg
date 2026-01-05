import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { API_URL } from "@env";
import { useTheme } from "../../../Contexts/ThemeContext";
import ArrowRight from "../../Icons/ArrowRight";
import ArrowDown from "../../Icons/ArrowDown";

// Import your SVGs (ensure paths match your project structure)
import Confusion from "./svg/Confusion";
import BalanceLoss from "./svg/BalanceLoss";
import Dazed from "./svg/Dazed";
import Tinnitus from "./svg/Tinnitus";
import NoiseSensitivity from "./svg/NoiseSensitivity";
import LightSensitivity from "./svg/LightSensitivity";
import Nausea from "./svg/Nausea";
import ConsciousnessLoss from "./svg/ConsciousnessLoss";
import AffectedVision from "./svg/AffectedVision";

// Map IDs to Icons and Colors
const iconMap = {
    confusion: { icon: <Confusion />, color: "#D9E6FF" },
    balanceLoss: { icon: <BalanceLoss />, color: "#FFE1D4" },
    feelingDazed: { icon: <Dazed />, color: "#FFAEC6" },
    tinnitus: { icon: <Tinnitus />, color: "#DDFFD8" },
    noiseSensitivity: { icon: <NoiseSensitivity />, color: "#D8CAFF" },
    lightSensitivity: { icon: <LightSensitivity />, color: "#FFF6C7" },
    nausea: { icon: <Nausea />, color: "#D5FCFF" },
    consciousnessLoss: { icon: <ConsciousnessLoss />, color: "#FFD8F7" },
    affectedVision: { icon: <AffectedVision />, color: "#CCFFED" },
};

const SymptomCard = ({ symptom, onDelete }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const navigation = useNavigation();
    const { theme } = useTheme();

    // Find the first symptom that is "true" to use as the card's main icon
    const mainSymptomKey = Object.keys(symptom.symptoms).find(
        (key) => symptom.symptoms[key] && Object.keys(symptom.symptoms[key]).length > 0
    );
    const mainIconData = iconMap[mainSymptomKey] || { icon: null, color: "#F3F4F6" };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleDelete = async () => {
        Alert.alert(
            "Delete Symptom Log",
            "Are you sure you want to delete this entry?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await axios.delete(`${API_URL}/api/symptoms/${symptom._id}`);
                            Alert.alert("Success", "Symptom log deleted");
                            onDelete(symptom._id);
                        } catch (error) {
                            console.error("Delete error:", error);
                            Alert.alert("Error", "Could not delete symptom log");
                        }
                    }
                }
            ]
        );
    };

    const handleEdit = () => {
        navigation.navigate("EditSymptomDetails", { symptomData: symptom });
    };

    const getSymptomNames = () => {
        const names = [];
        const symptomLabels = {
            confusion: "Confusion",
            affectedVision: "Affected Vision",
            balanceLoss: "Loss of Balance",
            consciousnessLoss: "Loss of Consciousness",
            feelingDazed: "Feeling Dazed",
            noiseSensitivity: "Noise Sensitivity",
            lightSensitivity: "Light Sensitivity",
            tinnitus: "Tinnitus",
            nausea: "Nausea"
        };

        Object.keys(symptom.symptoms).forEach(key => {
            if (symptom.symptoms[key] && Object.keys(symptom.symptoms[key]).length > 0) {
                names.push(symptomLabels[key] || key);
            }
        });
        return names.join(", ");
    };

    const renderSymptomDetails = (key, data) => {
        if (!data || Object.keys(data).length === 0) return null;
        const symptomLabels = { /* ... labels ... */ };

        return (
            <View key={key} className="mb-4 p-3 rounded-lg flex-row items-start" style={{ backgroundColor: theme.background }}>
                <View className="w-8 h-8 rounded-full items-center justify-center mr-3" style={{ backgroundColor: iconMap[key]?.color || '#eee' }}>
                    <View style={{ transform: [{ scale: 0.5 }] }}>{iconMap[key]?.icon}</View>
                </View>
                <View className="flex-1">
                    <Text className="font-ralewaySemiBold text-[16px] mb-1" style={{ color: theme.textColor }}>
                        {symptomLabels[key]}
                    </Text>
                    {Object.entries(data).map(([field, value]) => {
                        if (!value || (Array.isArray(value) && value.length === 0)) return null;
                        return (
                            <Text key={field} className="font-raleway text-[14px]" style={{ color: theme.darkGrey }}>
                                <Text className="font-ralewaySemiBold capitalize">{field.replace(/([A-Z])/g, ' $1').trim()}:</Text>
                                {" "}{Array.isArray(value) ? value.join(", ") : value}
                            </Text>
                        );
                    })}
                </View>
            </View>
        );
    };

    return (
        <View className="mb-4">
            <TouchableOpacity 
                onPress={() => setIsExpanded(!isExpanded)}
                activeOpacity={0.7}
                className="border rounded-xl px-4 py-3 flex-row justify-between items-center"
                style={{ 
                    backgroundColor: isExpanded ? (theme.primaryLightBlue || theme.textFieldBG) : theme.textFieldBG,
                    borderColor: isExpanded ? theme.primaryBlue : theme.borderColor
                }}
            >
                <View className="flex-row items-center flex-1">
                    <View className="w-12 h-12 rounded-full justify-center items-center mr-3" style={{ backgroundColor: mainIconData.color }}>
                        {mainIconData.icon}
                    </View>
                    <View className="flex-1">
                        <Text className="font-ralewaySemiBold text-[16px]" style={{ color: theme.textColor }}>
                            {formatDate(symptom.date)}
                        </Text>
                        <Text className="font-raleway text-[14px] mt-1" style={{ color: theme.darkGrey }} numberOfLines={1}>
                            {getSymptomNames()}
                        </Text>
                    </View>
                </View>
                <View className="pl-4">
                    {isExpanded ? <ArrowDown stroke={theme.textColor} /> : <ArrowRight stroke={theme.textColor} />}
                </View>
            </TouchableOpacity>

            {isExpanded && (
                <View className="p-4 mt-2 rounded-xl border" style={{ backgroundColor: theme.textFieldBG, borderColor: theme.borderColor }}>
                    {Object.entries(symptom.symptoms).map(([key, data]) => renderSymptomDetails(key, data))}
                    
                    {symptom.notes && (
                        <View className="mb-4 p-3 rounded-lg" style={{ backgroundColor: theme.background }}>
                            <Text className="font-ralewaySemiBold text-[16px] mb-2" style={{ color: theme.textColor }}>Additional Notes</Text>
                            <Text className="font-raleway text-[14px]" style={{ color: theme.darkGrey }}>{symptom.notes}</Text>
                        </View>
                    )}

                    <View className="flex-row justify-end mt-2">
                        <TouchableOpacity onPress={handleEdit} className="bg-primaryBlue px-6 py-3 rounded-full mr-3">
                            <Text className="text-white font-ralewaySemiBold text-[14px]">Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleDelete} className="bg-red-500 px-6 py-3 rounded-full">
                            <Text className="text-white font-ralewaySemiBold text-[14px]">Delete</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
};

export default SymptomCard;
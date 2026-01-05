import React, { useState, useCallback } from "react";
import { View, ScrollView, ActivityIndicator, RefreshControl, Text } from "react-native";
import axios from "axios";
import { API_URL } from "@env";
import { useUserData } from "../../../Contexts/UserContext";
import { useTheme } from "../../../Contexts/ThemeContext"; // Added theme back
import { useFocusEffect } from "@react-navigation/native";
import SymptomCard from "./SymptomCard";
import SymptomsIcon from "../../Icons/Symptoms"; // Import your icon
import DecoratedAddBtn from "../DecoratedAddBtn"; // Import your add button

const SymptomsSection = ({ navigation }) => {
    const [symptoms, setSymptoms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const { userId } = useUserData();
    const { theme } = useTheme(); // Use theme for colors

    const fetchSymptoms = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/symptoms/user/${userId}`);
            if (response.data.success) {
                setSymptoms(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching symptoms:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            if (userId) fetchSymptoms();
        }, [userId])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchSymptoms();
    };

    const handleDelete = (deletedId) => {
        setSymptoms(symptoms.filter(s => s._id !== deletedId));
    };

   if (loading) {
        return (
            <View className="flex-1 justify-center items-center" style={{ backgroundColor: theme.background }}>
                <ActivityIndicator size="large" color="#00b8df" />
            </View>
        );
    }

    if (symptoms.length === 0) {
        return (
            <View className="flex-1 items-center relative" style={{ backgroundColor: theme.background }}>
                <SymptomsIcon />
                <View className="absolute bottom-36 items-center">
                    <Text className="text-[20px] font-ralewaySemiBold" style={{ color: theme.textColor }}>
                        You don't have any records.
                    </Text>
                    <Text className="text-[16px] pt-1.5 font-raleway" style={{ color: theme.darkGrey }}>
                        Click the plus button to add symptoms.
                    </Text>
                </View>
                <DecoratedAddBtn navigation={navigation} screen={"AddSymptomsDetails"} />
            </View>
        );
    }

    return (
        <View className="flex-1" style={{ backgroundColor: theme.background }}>
            <ScrollView
                className="flex-1 px-4"
                style={{ backgroundColor: theme.background }} // Added dynamic BG
                contentContainerStyle={{ paddingTop: 20, paddingBottom: 120 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.textColor} />
                }
            >
                {symptoms.map((symptom) => (
                    <SymptomCard 
                        key={symptom._id} 
                        symptom={symptom} 
                        onDelete={handleDelete}
                    />
                ))}
            </ScrollView>
            <DecoratedAddBtn navigation={navigation} screen={"AddSymptomsDetails"} />
        </View>
    );
};

export default SymptomsSection;
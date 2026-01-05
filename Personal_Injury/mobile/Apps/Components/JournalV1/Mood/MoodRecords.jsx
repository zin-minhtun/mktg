import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "@env";
import { useUserData } from "../../../Contexts/UserContext";
import { useTheme } from "../../../Contexts/ThemeContext";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as Progress from 'react-native-progress';
import dayjs from "dayjs";

const MoodRecords = ({ navigation }) => {
    const { gUser } = useUserData();
    const { theme } = useTheme();
    const [moods, setMoods] = useState([]);

    useFocusEffect(
        React.useCallback(() => {
            fetchMoods();
        }, [])
    );

    const fetchMoods = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/moods/user/${gUser._id}`);
            setMoods(res.data);
        } catch (e) {
            console.log("Error fetching moods:", e);
        }
    };

    const handleDelete = async (id) => {
        Alert.alert(
            "Delete Mood",
            "Are you sure you want to delete this mood record?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await axios.delete(`${API_URL}/api/moods/${id}`);
                            fetchMoods(); // Refresh list
                        } catch (e) {
                            console.error("Error deleting mood:", e);
                            Alert.alert("Error", "Failed to delete mood.");
                        }
                    }
                }
            ]
        );
    };

    const renderMoodItem = (item) => {
        const percentage = (item.moodScale / 5) * 100;
        let color = "#00B8DF";
        if (percentage < 30) color = "#FF6B6B";

        return (
            <TouchableOpacity
                key={item._id}
                onPress={() => navigation.navigate("MoodDetail", { moodRecord: item })}
                className="p-4 rounded-xl mb-4 shadow-sm flex-row items-center justify-between"
                style={{ backgroundColor: theme.textFieldBG }}
            >
                <View className="flex-row items-center flex-1">
                    <View className="mr-4">
                        <Progress.Circle
                            size={50}
                            progress={percentage / 100}
                            showsText={true}
                            formatText={() => `${percentage}%`}
                            textStyle={{ fontSize: 12, fontWeight: 'bold', color: theme.textColor }}
                            color={color}
                            thickness={4}
                            borderWidth={0}
                            unfilledColor={theme.mode === 'dark' ? '#333' : '#F0F0F0'}
                        />
                    </View>
                    <View>
                        <Text className="font-ralewayBold text-lg" style={{ color: theme.textColor }}>{item.mood}</Text>
                        <Text className="font-raleway text-xs" style={{ color: theme.darkGrey }}>{dayjs(item.date).format("MMM DD, YYYY")}</Text>
                        {item.timeOfDay && <Text className="font-raleway text-xs uppercase" style={{ color: theme.darkGrey }}>{item.timeOfDay}</Text>}
                    </View>
                </View>

                <View className="flex-row items-center gap-3">
                    <TouchableOpacity onPress={() => handleDelete(item._id)}>
                        <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View className="flex-1 px-4 pt-6" style={{ backgroundColor: theme.background }}>
            <View className="flex-row justify-between items-center mb-6">
                <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
                    <Ionicons name="arrow-back" size={24} color={theme.textColor} />
                </TouchableOpacity>
                <Text className="font-ralewayBold text-[24px]" style={{ color: theme.textColor }}>Mood History</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {moods.length === 0 ? (
                    <Text className="text-center mt-10 font-raleway" style={{ color: theme.darkGrey }}>No mood records found.</Text>
                ) : (
                    moods.map(renderMoodItem)
                )}
            </ScrollView>

            <View className="absolute bottom-8 left-0 right-0 px-4 items-center">
                <TouchableOpacity
                    onPress={() => navigation.goBack()} // Assuming MoodSection is the previous screen or accessible
                    className="bg-primaryBlue w-full py-4 rounded-full items-center shadow-lg"
                >
                    <Text className="text-white font-ralewayBold text-lg">+ Add New Mood</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default MoodRecords;

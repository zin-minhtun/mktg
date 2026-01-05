import React, { useState, useEffect, useCallback } from "react";
import {
    SafeAreaView,
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Alert
} from "react-native";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import axios from "axios";
import { API_URL } from "@env";
import { useFocusEffect } from "@react-navigation/native";
import { useUserData } from "../../../Contexts/UserContext";
import { useTheme } from "../../../Contexts/ThemeContext";

// Component
import DecoratedAddBtn from "../DecoratedAddBtn";
import LowStimulationImg from "./svg/LowStimulationImg";
import MidStimulationImg from "./svg/MidStimulationImg";
import HighStimulationImg from "./svg/HighStimulationImg";
import { Trash2 } from "lucide-react-native";

dayjs.extend(isoWeek);

const SocialActivity = ({ navigation }) => {
    const { gUser } = useUserData();
    const { theme } = useTheme();
    const [selectedDate, setSelectedDate] = useState(
        dayjs().format("YYYY-MM-DD")
    );
    const [weekDates, setWeekDates] = useState([]);
    const [socialActivities, setSocialActivities] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getCurrentWeek = () => {
            const startOfWeek = dayjs().startOf("isoWeek");
            const dates = [];
            for (let i = 0; i < 7; i++) {
                dates.push(startOfWeek.add(i, "day").format("YYYY-MM-DD"));
            }
            setWeekDates(dates);
        };
        getCurrentWeek();
    }, []);

    const fetchSocialActivities = useCallback(async () => {
        if (!gUser?._id) return;
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/api/v1/social-activities`, {
                params: {
                    userId: gUser._id,
                    date: selectedDate
                }
            });
            setSocialActivities(response.data || []);
        } catch (e) {
            console.error("Failed to fetch social activities", e);
        } finally {
            setLoading(false);
        }
    }, [gUser?._id, selectedDate]);

    useFocusEffect(
        useCallback(() => {
            fetchSocialActivities();
        }, [fetchSocialActivities])
    );

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_URL}/api/v1/social-activities/delete/${id}`);
            fetchSocialActivities();
        } catch (e) {
            Alert.alert("Error", "Failed to delete item");
        }
    };

    const confirmDelete = (id) => {
        Alert.alert("Delete", "Are you sure?", [
            { text: "Cancel", style: "cancel" },
            { text: "Delete", style: "destructive", onPress: () => handleDelete(id) }
        ]);
    };

    const renderWeekDay = ({ item }) => {
        const isSelected = item === selectedDate;
        return (
            <TouchableOpacity
                onPress={() => setSelectedDate(item)}
                className="mt-6 rounded-lg w-[55px] h-[70px]"
                style={{
                    backgroundColor: isSelected ? '#E6F4FF' : theme.textFieldBG,
                    borderWidth: 1,
                    borderColor: isSelected ? '#00AEEF' : theme.borderColor,
                }}
            >
                <View className="flex-1 justify-center items-center">
                    <Text className="font-raleway" style={{ color: isSelected ? '#00AEEF' : theme.darkGrey }}>{dayjs(item).format("ddd")}</Text>
                    <Text className="text-center font-ralewayBold text-2xl" style={{ color: isSelected ? '#00AEEF' : theme.textColor }}>
                        {dayjs(item).format("DD")}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    // Helper function to render correct stimulation icon
    const getStimulationIcon = (stimulation, size = 24) => {
        const normalizedStimulation = (stimulation || '').toLowerCase().trim();

        if (normalizedStimulation.includes('low')) {
            return <LowStimulationImg width={size} height={size} />;
        } else if (normalizedStimulation.includes('mid') || normalizedStimulation.includes('medium')) {
            return <MidStimulationImg width={size} height={size} />;
        } else if (normalizedStimulation.includes('high')) {
            return <HighStimulationImg width={size} height={size} />;
        }

        // Default fallback
        return <LowStimulationImg width={size} height={size} />;
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => navigation.navigate("AddSocialActivity", {
                editMode: true,
                prefill: item,
                selectedDate: selectedDate
            })}
            className="p-4 rounded-xl mb-3 flex-row items-center border"
            style={{ backgroundColor: theme.textFieldBG, borderColor: theme.borderColor }}
        >
            <View className="bg-[#E6F4FF] p-3 rounded-full mr-3">
                {getStimulationIcon(item.stimulation)}
            </View>
            <View className="flex-1">
                <Text className="font-ralewaySemiBold text-[16px] text-primaryDarkBlue">
                    {item.stimulation} Stimulation: {item.activities && item.activities.length > 0 ? item.activities.join(", ") : "Activity"}
                </Text>
                {item.notes ? (
                    <Text className="font-raleway text-[14px] text-gray-500" numberOfLines={1}>{item.notes}</Text>
                ) : null}
            </View>
            <TouchableOpacity onPress={() => confirmDelete(item._id)} className="p-2">
                <Trash2 size={20} color="#FF6B6B" />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1" style={{ backgroundColor: theme.background }}>
            <View className="flex-1 px-5 pt-16">
                {/* calendar section */}
                <View>
                    <View>
                        <Text className="font-raleway text-[14px] h-6" style={{ color: theme.darkGrey }}>
                            {dayjs(selectedDate).format("MMM DD, YYYY")}
                        </Text>
                        <Text className="font-ralewayBold text-[24px]" style={{ color: theme.textColor }}>Today</Text>
                    </View>

                    {/* Horizontal scrollable week day section */}
                    <View className="mt-4">
                        <FlatList
                            data={weekDates}
                            horizontal
                            renderItem={renderWeekDay}
                            keyExtractor={(item) => item}
                            showsHorizontalScrollIndicator={false}
                            ItemSeparatorComponent={() => <View className="w-3" />}
                        />
                    </View>
                </View>

                {loading ? (
                    <View className="flex-1 justify-center items-center mt-10">
                        <ActivityIndicator size="large" color="#00C2FF" />
                    </View>
                ) : socialActivities.length === 0 ? (
                    <View className="items-center mt-10 flex-1">
                        <MidStimulationImg width={100} height={100} />
                        <View className="items-center mt-6">
                            <Text className="text-[20px] font-ralewaySemiBold" style={{ color: theme.textColor }}>
                                You don't have any records.
                            </Text>
                            <Text className="text-[16px] pt-1.5 font-raleway" style={{ color: theme.darkGrey }}>
                                Click the plus button to add
                            </Text>
                        </View>
                        <View className="absolute bottom-10 right-0 left-0 items-center">
                            <DecoratedAddBtn
                                navigation={navigation}
                                screen={"AddSocialActivity"}
                                selectedDate={selectedDate}
                                params={{ selectedDate }}
                            />
                        </View>
                    </View>
                ) : (
                    <View className="flex-1 mt-6">
                        <FlatList
                            data={socialActivities}
                            renderItem={renderItem}
                            keyExtractor={(item) => item._id}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 100 }}
                        />
                        <View className="absolute bottom-5 right-0 left-0 items-center">
                            <DecoratedAddBtn
                                navigation={navigation}
                                screen={"AddSocialActivity"}
                                selectedDate={selectedDate}
                                params={{ selectedDate }}
                            />
                        </View>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

export default SocialActivity;

import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Pencil } from "lucide-react-native";
import { useTheme } from "../../../Contexts/ThemeContext";
import axios from "axios";
import { API_URL } from "@env";

const SLEEP_API_URL = `${API_URL}/api/dailyLog/weeklySleep`;

const WeeklySleepLog = ({ navigation, route }) => {

    const { theme } = useTheme();

    const { userId } = route.params || {};
    const [weeklySleepLogs, setWeeklySleepLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const TODAY_DATE_STRING = new Date().toISOString().split("T")[0];

    useEffect(() => {
        const fetchWeeklySleepLogs = async () => {
            if (!userId) {
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(SLEEP_API_URL, {
                    params: { userId: userId },
                });
                setWeeklySleepLogs(response.data);
            } catch (error) {
                console.error("Error fetching sleep logs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchWeeklySleepLogs();
    }, [userId]);

    // Generate last 7 days - from today going backwards (most recent first)
    const getLastSevenDays = () => {
        const today = new Date();
        return Array.from({ length: 7 }, (_, i) => {
            const dateObj = new Date();
            dateObj.setDate(today.getDate() - i);
            return {
                day: dateObj.toLocaleDateString("en-US", { weekday: "short" }),
                date: dateObj.getDate().toString().padStart(2, "0"),
                fullDate: dateObj.toISOString().split("T")[0], // YYYY-MM-DD format to match logs
                month: dateObj.toLocaleDateString("en-US", { month: "short" }), // Get month name (e.g., "Feb")
            };
        });
    };

    const lastSevenDays = getLastSevenDays();

    return (
        <View className="p-4" style={{ backgroundColor: theme.background }}>
            <SafeAreaView>
                <View className="mt-6">
                    <ScrollView
                        contentContainerStyle={{ paddingBottom: 10 }}
                        showsVerticalScrollIndicator={false}
                    >
                        <View className="mt-8 w-[100%]" style={{ color: theme.textColor }}>
                            {loading ? (
                                <ActivityIndicator size="large" color="#00B8DF" />
                            ) : (
                                lastSevenDays.map(({ day, date, fullDate, month }, index) => {
                                    const log = weeklySleepLogs.find(log => log.date === fullDate);
                                    let sleepData = log?.sleep?.[0];

                                    // --- Check if the current day is today ---
                                    const isToday = fullDate === TODAY_DATE_STRING;

                                    // Check if the month has changed to display it
                                    const showMonthHeader = index === 0 || lastSevenDays[index - 1].month !== month;

                                    return (
                                        <View key={index}>
                                            {showMonthHeader && (
                                                <Text className="text-[14px] mt-2 mb-2 ml-1" style={{ color: theme.textColor }}>{month}</Text>
                                            )}

                                            <View className="mb-4 flex-row items-stretch">
                                                {/* Left side: Date Display in bordered box */}
                                                <View
                                                    className="p-3 border rounded-lg items-center justify-center mr-3"
                                                    style={{ backgroundColor: isToday ? "#EBFCFF" : theme.textFieldBG, borderColor: isToday ? theme.accentColor : theme.borderColor }}
                                                >
                                                    <Text className="text-[13px] font-ralewaySemiBold" style={{ color: theme.textColor }}>
                                                        {day}
                                                    </Text>
                                                    {/* --- Conditional color applied here based on isToday --- */}
                                                    <Text
                                                        className="text-[22px] font-ralewayBold"
                                                        style={{
                                                            color: isToday ? theme.textAccent : theme.textColor
                                                        }}
                                                    >
                                                        {date}
                                                    </Text>
                                                </View>

                                                {/* Right side: Sleep Log Details Card */}
                                                <View
                                                    className="flex-1 p-4 border rounded-lg flex-row justify-between items-center"
                                                    style={{ backgroundColor: isToday ? "#EBFCFF" : theme.textFieldBG, borderColor: isToday ? theme.accentColor : theme.borderColor }}
                                                >
                                                    {/* Sleep data */}
                                                    <View className="flex-1">
                                                        <Text className="text-[17px] font-ralewaySemiBold" style={{ color: theme.textColor }}>
                                                            {sleepData ? `${sleepData.sleepHours} hours` : "No data"}
                                                        </Text>
                                                        {sleepData && (
                                                            <Text className="text-[14px] mt-1 font-ralewayMedium" style={{ color: "#939598", opacity: 0.7 }}>
                                                                {sleepData.sleepQuality.charAt(0).toUpperCase() + sleepData.sleepQuality.slice(1)} sleep
                                                            </Text>
                                                        )}
                                                    </View>

                                                    {/* Edit Icon */}
                                                    <TouchableOpacity
                                                        onPress={() =>
                                                            navigation.navigate("JournalNavigator", {
                                                                screen: "SleepDuration",
                                                                params: {
                                                                    sleepLog: sleepData,
                                                                    selectedDate: fullDate,
                                                                    dailyLogId: log?.id,
                                                                    returnScreen: "WeeklySleepLog"
                                                                },
                                                            })
                                                        }
                                                        disabled={!sleepData}
                                                    >
                                                        {sleepData && <Pencil size={22} color={theme.primaryLighBlue} />}
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                    );
                                })
                            )}
                        </View>
                    </ScrollView>
                </View>
            </SafeAreaView>
        </View>
    );
};

export default WeeklySleepLog;
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import * as Progress from 'react-native-progress';
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import { symptomsData } from "./MoodSection";
import { useTheme } from "../../../Contexts/ThemeContext";

const MoodDetail = ({ route, navigation }) => {
    const { theme } = useTheme();
    const { moodRecord } = route.params;

    // Find the icon and score from symptomsData. 
    // Usually moodRecord.mood has the name "Happy", "Angry" etc.
    const moodObj = symptomsData.find(s => s.name === moodRecord.mood) || { icon: <View />, score: moodRecord.moodScale, name: moodRecord.mood };

    // Calculate percentage based on 5-point scale
    // 5 = 100%, 1 = 20%
    const percentage = (moodRecord.moodScale / 5) * 100;

    let message = "";
    let btnColor = "";
    let progressColor = "";
    let moodCardColor = "";

    // Thresholds based on design
    if (percentage >= 91) {
        message = "Today's goal achieved.\nKeep up the amazing work!";
        btnColor = "#005479";
        progressColor = "#00B8DF";
        moodCardColor = "#E6FFFA"; // Light Greenish
    } else if (percentage >= 61) {
        message = "You're doing great. Just a few more steps to complete your journey!";
        btnColor = "#005479";
        progressColor = "#00B8DF"; // Cyan
        moodCardColor = "#E0E7E9"; // Greyish Cyan to match "Confident" background in image
    } else if (percentage >= 31) {
        message = "Keep pushing, you're getting closer every day!";
        btnColor = "#005479";
        progressColor = "#00B8DF"; // Or maybe lighter?
        moodCardColor = "#E3E8F0"; // Light Blue/Purple for Impatient
    } else {
        message = "The first steps are tough, but you've started strong!";
        btnColor = "#005479";
        progressColor = "#FF6B6B"; // Red
        moodCardColor = "#FFE4E4"; // Light Red for Exhausted
    }

    // In dark mode, mood card colors might need adjustment to be readable or look good
    // Since these colors are specific to mood feedback (green/red ranges), we might keep them or slightly darken them.
    // For now I'll keep them as they convey semantic meaning (success/exhaustion), but ensure text inside is readable.
    // However, user specifically asked for dark mode.
    // If we keep these light backgrounds, the text inside will be dark (default).
    // Let's modify moodCardColor for dark mode if requested, but semantic colors are usually persistent. 
    // Let's assume the user wants the PAGE background dark, which we did. 
    // The "box" colors are part of the design language for the result.

    // BUT, let's make sure the text contrast is good.
    // The text inside the mood card is "moodObj.name Mood" with text-gray-700. On light bg it's fine.

    return (
        <View className="flex-1 px-4 pt-6" style={{ backgroundColor: theme.background }}>
            <View className="flex-row justify-between items-center mb-6">
                <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
                    <Ionicons name="chevron-back" size={24} color={theme.textColor} />
                </TouchableOpacity>
                <Text className="font-raleway text-[16px]" style={{ color: theme.darkGrey }}>{dayjs(moodRecord.date).format("MMM DD, YYYY")}</Text>
                <Ionicons name="notifications-outline" size={24} color={theme.textColor} />
            </View>

            <Text className="font-ralewayBold text-[24px] mb-6" style={{ color: theme.textColor }}>Today</Text>

            {/* Progress Card */}
            <View
                className="p-6 rounded-2xl shadow-sm w-full items-center mb-6"
                style={{ backgroundColor: theme.textFieldBG }}
            >
                <View className="relative justify-center items-center mb-4">
                    <Progress.Circle
                        size={100}
                        progress={percentage / 100}
                        showsText={true}
                        formatText={() => `${percentage}%`}
                        textStyle={{ fontSize: 24, fontWeight: 'bold', color: theme.textColor }}
                        color={progressColor}
                        thickness={8}
                        borderWidth={0}
                        unfilledColor={theme.mode === 'dark' ? '#003361' : "#F0F0F0"}
                        strokeCap="round"
                    />
                </View>

                <View className="flex-row items-center justify-between w-full mt-2">
                    <Text className="font-raleway text-left flex-1 mr-4 text-[14px] leading-5" style={{ color: theme.textColor }}>
                        {message}
                    </Text>
                    <View style={{ backgroundColor: btnColor }} className="px-5 py-3 rounded-full">
                        <Text className="text-white font-bold text-sm">
                            {percentage >= 60 ? "Success!" : "Keep up"}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Mood Card */}
            <View
                className={`w-full py-10 rounded-2xl items-center justify-center shadow-sm`}
                style={{ backgroundColor: moodCardColor, minHeight: 200 }}
            >
                <View className="items-center justify-center transform scale-150 mb-3">
                    {/* Transforming scale to make icon bigger as per design */}
                    <View style={{ transform: [{ scale: 2 }] }}>
                        {moodObj.icon}
                    </View>
                </View>
                <Text className="font-ralewayBold text-gray-700 text-lg mt-6 capitalize">{moodObj.name} Mood</Text>
            </View>

        </View>
    );
};

export default MoodDetail;

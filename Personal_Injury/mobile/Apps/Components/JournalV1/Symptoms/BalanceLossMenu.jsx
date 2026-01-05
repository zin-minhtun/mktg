import { View, Text, TouchableOpacity, TextInput } from "react-native";
import React, { useState, useEffect } from "react";
import { styled } from "nativewind";
import { useTheme } from "../../../Contexts/ThemeContext"; // Ensure this path is correct

// Components
import ArrowRight from "../../Icons/ArrowRight";
import ArrowDown from "../../Icons/ArrowDown";
import AudioInputIcon from "../../Icons/AudioInputIcon";
import CheckIcon from "../../Icons/CheckIcon";
import CrossIcon from "../../Icons/CrossIcon";

const StyledTextInput = styled(TextInput);

// Custom RadioButton component updated for Dark Mode
const RadioButton = ({ value, status, onPress, theme }) => (
    <TouchableOpacity
        onPress={onPress}
        style={{ flexDirection: "row", alignItems: "center" }}
    >
        <View
            style={{
                width: 23,
                height: 23,
                borderRadius: 13,
                borderWidth: 2,
                borderColor: "#00b8df",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            {status === "checked" && (
                <View
                    style={{
                        width: 12,
                        height: 12,
                        borderRadius: 6,
                        backgroundColor: "#00b8df",
                    }}
                />
            )}
        </View>
        {value && <Text style={{ marginLeft: 8, color: theme.textColor }}>{value}</Text>}
    </TouchableOpacity>
);

const BalanceLossMenu = ({ onUpdate, initialData }) => {
    const [isHeadPainMenuVisible, setIsHeadPainMenuVisible] = useState(false);
    const [selectedTimeOfDay, setSelectedTimeOfDay] = useState(initialData?.timeOfDay || null);
    const [selectedDuration, setSelectedDuration] = useState(initialData?.duration || null);
    const [impactOnMobility, setImpactOnMobility] = useState(initialData?.impactOnMobility || ""); 
    const [additionalNotes, setAdditionalNotes] = useState(initialData?.additionalNotes || "");

    const { theme } = useTheme();

    useEffect(() => {
        if (onUpdate) {
            onUpdate({
                timeOfDay: selectedTimeOfDay,
                duration: selectedDuration,
                impactOnMobility,
                additionalNotes,
            });
        }
    }, [selectedTimeOfDay, selectedDuration, impactOnMobility, additionalNotes]);

    const toggleHeadPainMenu = () => {
        setIsHeadPainMenuVisible(!isHeadPainMenuVisible);
    };

    return (
        <>
            {/* Header */}
            <View
                className="border rounded-lg px-3"
                style={{
                    backgroundColor: isHeadPainMenuVisible ? (theme.primaryLightBlue || theme.textFieldBG) : theme.textFieldBG,
                    borderColor: isHeadPainMenuVisible ? theme.primaryBlue : theme.borderColor
                }}
            >
                <View className="flex flex-row justify-between">
                    <Text className="font-ralewaySemiBold py-3 text-[16px]" style={{ color: theme.textColor }}>
                        Loss of Balance
                    </Text>
                    <TouchableOpacity onPress={toggleHeadPainMenu}>
                        <View className="pl-6 py-3">
                            {isHeadPainMenuVisible ? 
                                <ArrowDown stroke={theme.textColor} /> : 
                                <ArrowRight stroke={theme.textColor} />
                            }
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Content */}
            {isHeadPainMenuVisible && (
                <View className="p-5 mt-4 rounded-lg" style={{ backgroundColor: theme.textFieldBG }}>
                    {/* Time of day */}
                    <Text className="font-ralewaySemiBold mb-3 text-[16px]" style={{ color: theme.textColor }}>
                        Time of day
                    </Text>
                    <View className="flex flex-row flex-wrap">
                        {["morning", "afternoon", "evening", "night", "throughoutDay"].map(
                            (time) => (
                                <View className="mr-3 flex flex-row mb-4" key={time}>
                                    <RadioButton
                                        status={selectedTimeOfDay === time ? "checked" : "unchecked"}
                                        onPress={() => setSelectedTimeOfDay(time)}
                                        theme={theme}
                                    />
                                    <Text className="font-raleway text-[16px] ml-2" style={{ color: theme.darkGrey }}>
                                        {time === "throughoutDay"
                                            ? "Throughout the day"
                                            : time.charAt(0).toUpperCase() + time.slice(1)}
                                    </Text>
                                </View>
                            )
                        )}
                    </View>

                    {/* Duration */}
                    <View className="mt-3">
                        <Text className="font-ralewaySemiBold mb-3 text-[16px]" style={{ color: theme.textColor }}>
                            How long did the imbalance last?
                        </Text>
                        <View className="flex flex-row flex-wrap">
                            {["A few seconds", "A few minutes", "Over 10 minutes", "Constant"].map(
                                (opt) => (
                                    <View className="mr-3 flex flex-row mb-4" key={opt}>
                                        <RadioButton
                                            status={selectedDuration === opt ? "checked" : "unchecked"}
                                            onPress={() => setSelectedDuration(opt)}
                                            theme={theme}
                                        />
                                        <Text className="font-raleway text-[16px] ml-2" style={{ color: theme.darkGrey }}>
                                            {opt}
                                        </Text>
                                    </View>
                                )
                            )}
                        </View>
                    </View>

                    {/* Impact on mobility */}
                    <View className="mt-3">
                        <Text className="font-ralewaySemiBold mb-3 text-[16px]" style={{ color: theme.textColor }}>
                            Did it affect your ability to stand or walk?
                        </Text>
                        <StyledTextInput
                            multiline
                            value={impactOnMobility}
                            onChangeText={setImpactOnMobility}
                            placeholder="Describe how it impacted your movement"
                            placeholderTextColor={theme.darkGrey}
                            className="font-raleway text-[16px] h-[84px] p-3 border rounded-lg"
                            style={{ 
                                textAlignVertical: "top",
                                backgroundColor: theme.background,
                                borderColor: theme.borderColor,
                                color: theme.textColor
                            }}
                        />

                        <View className="flex-row justify-end mt-3">
                            <View className="justify-center items-center mr-6 bg-primaryBlue rounded-full w-10 h-10">
                                <AudioInputIcon />
                            </View>
                            <View
                                className="justify-center items-center mr-3 rounded-full w-10 h-10"
                                style={{ backgroundColor: impactOnMobility.length > 0 ? "#FDA29B80" : theme.borderColor }}
                            >
                                <CrossIcon isActive={impactOnMobility.length > 0} />
                            </View>
                            <TouchableOpacity
                                onPress={() => null}
                                disabled={impactOnMobility.length === 0}
                                className="justify-center items-center rounded-full w-10 h-10"
                                style={{ backgroundColor: impactOnMobility.length > 0 ? "#00b8df" : theme.borderColor }}
                            >
                                <CheckIcon isActive={impactOnMobility.length > 0} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Additional notes */}
                    <View className="mt-8">
                        <Text className="font-ralewaySemiBold mb-3 text-[16px]" style={{ color: theme.textColor }}>
                            Additional notes
                        </Text>
                        <StyledTextInput
                            multiline
                            value={additionalNotes}
                            onChangeText={setAdditionalNotes}
                            placeholder="Add notes"
                            placeholderTextColor={theme.darkGrey}
                            className="font-raleway text-[16px] h-[84px] p-3 border rounded-lg"
                            style={{ 
                                textAlignVertical: "top",
                                backgroundColor: theme.background,
                                borderColor: theme.borderColor,
                                color: theme.textColor
                            }}
                        />

                        <View className="flex-row justify-end mt-3">
                            <View className="justify-center items-center mr-6 bg-primaryBlue rounded-full w-10 h-10">
                                <AudioInputIcon />
                            </View>
                            <View
                                className="justify-center items-center mr-3 rounded-full w-10 h-10"
                                style={{ backgroundColor: additionalNotes.length > 0 ? "#FDA29B80" : theme.borderColor }}
                            >
                                <CrossIcon isActive={additionalNotes.length > 0} />
                            </View>
                            <TouchableOpacity
                                onPress={() => null}
                                disabled={additionalNotes.length === 0}
                                className="justify-center items-center rounded-full w-10 h-10"
                                style={{ backgroundColor: additionalNotes.length > 0 ? "#00b8df" : theme.borderColor }}
                            >
                                <CheckIcon isActive={additionalNotes.length > 0} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
        </>
    );
};

export default BalanceLossMenu;
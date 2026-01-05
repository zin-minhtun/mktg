import { View, Text, TouchableOpacity, TextInput } from "react-native";
import React, { useState, useEffect } from "react";
import { styled } from "nativewind";
import { useTheme } from "../../../Contexts/ThemeContext"; // Ensure path is correct

// Components
import ArrowRight from "../../Icons/ArrowRight";
import ArrowDown from "../../Icons/ArrowDown";
import AudioInputIcon from "../../Icons/AudioInputIcon";
import CheckIcon from "../../Icons/CheckIcon";
import CrossIcon from "../../Icons/CrossIcon";

const StyledTextInput = styled(TextInput);

// Custom RadioButton component updated for Dark Mode
const RadioButton = ({ status, onPress, theme }) => (
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
    </TouchableOpacity>
);

const ConfusionMenu = ({ onUpdate, initialData }) => {
    const [isHeadPainMenuVisible, setIsHeadPainMenuVisible] = useState(false);
    const [selectedConfusionTime, setSelectedConfusionTime] = useState(initialData?.timeOfDay || null);
    const [confusionNote, setConfusionNote] = useState(initialData?.notes || "");
    
    const { theme } = useTheme();

    // Sync state with parent whenever values change
    useEffect(() => {
        if (onUpdate) {
            onUpdate({
                timeOfDay: selectedConfusionTime,
                notes: confusionNote
            });
        }
    }, [selectedConfusionTime, confusionNote]);

    const toggleHeadPainMenu = () => {
        setIsHeadPainMenuVisible(!isHeadPainMenuVisible);
    };

    return (
        <>
            {/* Collapsible Header */}
            <View 
                className="border rounded-lg px-3"
                style={{
                    backgroundColor: isHeadPainMenuVisible ? (theme.primaryLightBlue || theme.textFieldBG) : theme.textFieldBG,
                    borderColor: isHeadPainMenuVisible ? theme.primaryBlue : theme.borderColor
                }}
            >
                <View className="flex flex-row justify-between">
                    <Text className="font-ralewaySemiBold py-3 text-[16px]" style={{ color: theme.textColor }}>
                        Confusion
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

            {/* Expanded Content */}
            {isHeadPainMenuVisible && (
                <View className="p-5 mt-4 rounded-lg" style={{ backgroundColor: theme.textFieldBG }}>
                    <View className="flex flex-row flex-wrap">
                        {["morning", "afternoon", "evening", "night", "throughoutDay"].map((time) => (
                            <View key={time} className="mr-3 flex flex-row mb-4">
                                <RadioButton
                                    status={selectedConfusionTime === time ? "checked" : "unchecked"}
                                    onPress={() => setSelectedConfusionTime(time)}
                                    theme={theme}
                                />
                                <Text className="font-raleway text-[16px] ml-2" style={{ color: theme.darkGrey }}>
                                    {time === "throughoutDay" 
                                        ? "Throughout the day" 
                                        : time.charAt(0).toUpperCase() + time.slice(1)}
                                </Text>
                            </View>
                        ))}
                    </View>

                    <View className="mt-3">
                        <Text className="font-ralewaySemiBold mb-3 text-[16px]" style={{ color: theme.textColor }}>
                            Tell us more about it
                        </Text>

                        <StyledTextInput
                            multiline
                            value={confusionNote}
                            onChangeText={setConfusionNote}
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

                        {/* Action Buttons */}
                        <View className="flex-row justify-end mt-3">
                            <View className="justify-center items-center mr-6 bg-primaryBlue rounded-full w-10 h-10">
                                <AudioInputIcon />
                            </View>
                            <View
                                className="justify-center items-center mr-3 rounded-full w-10 h-10"
                                style={{ backgroundColor: confusionNote.length > 0 ? "#FDA29B80" : theme.borderColor }}
                            >
                                <CrossIcon isActive={confusionNote.length > 0} />
                            </View>
                            <TouchableOpacity
                                onPress={() => null}
                                disabled={confusionNote.length === 0}
                                className="justify-center items-center rounded-full w-10 h-10"
                                style={{ backgroundColor: confusionNote.length > 0 ? "#00b8df" : theme.borderColor }}
                            >
                                <CheckIcon isActive={confusionNote.length > 0} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
        </>
    );
};

export default ConfusionMenu;
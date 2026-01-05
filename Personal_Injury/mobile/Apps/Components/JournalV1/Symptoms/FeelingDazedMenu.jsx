import { View, Text, TouchableOpacity, TextInput } from "react-native";
import React, { useState, useEffect } from "react";
import { styled } from "nativewind";
import { useTheme } from "../../../Contexts/ThemeContext"; // Adjust path as needed

// Components
import ArrowRight from "../../Icons/ArrowRight";
import ArrowDown from "../../Icons/ArrowDown";
import AudioInputIcon from "../../Icons/AudioInputIcon";
import CheckIcon from "../../Icons/CheckIcon";
import CrossIcon from "../../Icons/CrossIcon";

const StyledTextInput = styled(TextInput);

// Reusable RadioButton updated for Dark Mode
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

const FeelingDazedMenu = ({ onUpdate, initialData }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [selectedTimeOfDay, setSelectedTimeOfDay] = useState(initialData?.timeOfDay || null);
    const [selectedFrequency, setSelectedFrequency] = useState(initialData?.frequency || null);
    const [triggerDescription, setTriggerDescription] = useState(initialData?.triggers || "");
    const [notes, setNotes] = useState(initialData?.notes || "");

    const { theme } = useTheme();

    const toggleMenu = () => setIsVisible(!isVisible);

    // Sync state with parent whenever values change
    useEffect(() => {
        if (onUpdate) {
            onUpdate({
                timeOfDay: selectedTimeOfDay,
                frequency: selectedFrequency,
                triggers: triggerDescription,
                notes: notes
            });
        }
    }, [selectedTimeOfDay, selectedFrequency, triggerDescription, notes]);

    return (
        <>
            {/* Collapsible Header */}
            <View
                className="border rounded-lg px-3"
                style={{ 
                    backgroundColor: isVisible ? (theme.primaryLightBlue || theme.textFieldBG) : theme.textFieldBG,
                    borderColor: isVisible ? theme.primaryBlue : theme.borderColor
                }}
            >
                <View className="flex flex-row justify-between">
                    <Text className="font-ralewaySemiBold py-3 text-[16px]" style={{ color: theme.textColor }}>
                        Feeling Dazed or Disoriented
                    </Text>
                    <TouchableOpacity onPress={toggleMenu}>
                        <View className="pl-6 py-3">
                            {isVisible ? 
                                <ArrowDown stroke={theme.textColor} /> : 
                                <ArrowRight stroke={theme.textColor} />
                            }
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Expanded Content */}
            {isVisible && (
                <View className="p-5 mt-4 rounded-lg" style={{ backgroundColor: theme.textFieldBG }}>
                    
                    {/* Time of day */}
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

                    {/* Frequency */}
                    <View className="mt-3">
                        <Text className="font-ralewaySemiBold mb-3 text-[16px]" style={{ color: theme.textColor }}>
                            How often do you feel dazed or disoriented?
                        </Text>
                        <View className="flex flex-row flex-wrap">
                            {["Rarely", "Sometimes", "Frequently", "Constantly"].map((opt) => (
                                <View className="mr-3 flex flex-row mb-4" key={opt}>
                                    <RadioButton
                                        status={selectedFrequency === opt ? "checked" : "unchecked"}
                                        onPress={() => setSelectedFrequency(opt)}
                                        theme={theme}
                                    />
                                    <Text className="font-raleway text-[16px] ml-2" style={{ color: theme.darkGrey }}>
                                        {opt}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Triggers */}
                    <View className="mt-3">
                        <Text className="font-ralewaySemiBold mb-3 text-[16px]" style={{ color: theme.textColor }}>
                            Do you notice any situations that trigger this feeling?
                        </Text>

                        <StyledTextInput
                            multiline
                            value={triggerDescription}
                            onChangeText={setTriggerDescription}
                            placeholder="Describe when or why it happens"
                            placeholderTextColor={theme.darkGrey}
                            className="font-raleway text-[16px] h-[84px] p-3 border rounded-lg"
                            style={{ 
                                textAlignVertical: "top",
                                backgroundColor: theme.background,
                                borderColor: theme.borderColor,
                                color: theme.textColor
                            }}
                        />

                        {/* Action Buttons for Triggers */}
                        <View className="flex-row justify-end mt-3">
                            <View className="justify-center items-center mr-6 bg-primaryBlue rounded-full w-10 h-10">
                                <AudioInputIcon />
                            </View>
                            <View
                                className="justify-center items-center mr-3 rounded-full w-10 h-10"
                                style={{ backgroundColor: triggerDescription.length > 0 ? "#FDA29B80" : theme.borderColor }}
                            >
                                <CrossIcon isActive={triggerDescription.length > 0} />
                            </View>
                            <TouchableOpacity
                                onPress={() => null}
                                disabled={triggerDescription.length === 0}
                                className="justify-center items-center rounded-full w-10 h-10"
                                style={{ backgroundColor: triggerDescription.length > 0 ? "#00b8df" : theme.borderColor }}
                            >
                                <CheckIcon isActive={triggerDescription.length > 0} />
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
                            value={notes}
                            onChangeText={setNotes}
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

                        {/* Action Buttons for Notes */}
                        <View className="flex-row justify-end mt-3">
                            <View className="justify-center items-center mr-6 bg-primaryBlue rounded-full w-10 h-10">
                                <AudioInputIcon />
                            </View>
                            <View
                                className="justify-center items-center mr-3 rounded-full w-10 h-10"
                                style={{ backgroundColor: notes.length > 0 ? "#FDA29B80" : theme.borderColor }}
                            >
                                <CrossIcon isActive={notes.length > 0} />
                            </View>
                            <TouchableOpacity
                                onPress={() => null}
                                disabled={notes.length === 0}
                                className="justify-center items-center rounded-full w-10 h-10"
                                style={{ backgroundColor: notes.length > 0 ? "#00b8df" : theme.borderColor }}
                            >
                                <CheckIcon isActive={notes.length > 0} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
        </>
    );
};

export default FeelingDazedMenu;
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

const TinnitusMenu = ({ onUpdate, initialData }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [selectedEar, setSelectedEar] = useState(initialData?.affectedEar || null);
    const [selectedFrequency, setSelectedFrequency] = useState(initialData?.frequency || null);
    const [selectedSoundType, setSelectedSoundType] = useState(initialData?.soundType || null);
    const [notes, setNotes] = useState(initialData?.notes || "");

    const { theme } = useTheme();

    const toggleMenu = () => setIsVisible(!isVisible);

    // Sync state with parent whenever values change
    useEffect(() => {
        if (onUpdate) {
            onUpdate({
                affectedEar: selectedEar,
                frequency: selectedFrequency,
                soundType: selectedSoundType,
                notes: notes,
            });
        }
    }, [selectedEar, selectedFrequency, selectedSoundType, notes]);

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
                        Tinnitus (Ringing in Ears)
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
                    
                    {/* Affected ear */}
                    <View className="mt-1">
                        <Text className="font-ralewaySemiBold mb-3 text-[16px]" style={{ color: theme.textColor }}>
                            Which ear is affected?
                        </Text>
                        <View className="flex flex-row flex-wrap">
                            {["Left", "Right", "Both"].map((opt) => (
                                <View className="mr-3 flex flex-row mb-4" key={opt}>
                                    <RadioButton
                                        status={selectedEar === opt ? "checked" : "unchecked"}
                                        onPress={() => setSelectedEar(opt)}
                                        theme={theme}
                                    />
                                    <Text className="font-raleway text-[16px] ml-2" style={{ color: theme.darkGrey }}>
                                        {opt}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Frequency of ringing */}
                    <View className="mt-3">
                        <Text className="font-ralewaySemiBold mb-3 text-[16px]" style={{ color: theme.textColor }}>
                            How often do you experience ringing?
                        </Text>
                        <View className="flex flex-row flex-wrap">
                            {["Occasionally", "Several times a day", "Constantly"].map((opt) => (
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

                    {/* Sound type */}
                    <View className="mt-3">
                        <Text className="font-ralewaySemiBold mb-3 text-[16px]" style={{ color: theme.textColor }}>
                            What does the sound resemble?
                        </Text>
                        <View className="flex flex-row flex-wrap">
                            {["Ringing", "Buzzing", "Hissing", "Pulsing"].map((opt) => (
                                <View className="mr-3 flex flex-row mb-4" key={opt}>
                                    <RadioButton
                                        status={selectedSoundType === opt ? "checked" : "unchecked"}
                                        onPress={() => setSelectedSoundType(opt)}
                                        theme={theme}
                                    />
                                    <Text className="font-raleway text-[16px] ml-2" style={{ color: theme.darkGrey }}>
                                        {opt}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Additional notes */}
                    <View className="mt-6">
                        <Text className="font-ralewaySemiBold mb-3 text-[16px]" style={{ color: theme.textColor }}>
                            Any triggers or notes?
                        </Text>

                        <StyledTextInput
                            multiline
                            value={notes}
                            onChangeText={setNotes}
                            placeholder="Add notes, e.g. after loud noise, stress, etc."
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

export default TinnitusMenu;
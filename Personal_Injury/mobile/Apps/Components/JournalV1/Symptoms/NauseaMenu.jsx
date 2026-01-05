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

// Updated RadioButton for Dark Mode
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

const NauseaMenu = ({ onUpdate, initialData }) => {
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [selectedConfusionTime, setSelectedConfusionTime] = useState(initialData?.timeOfDay || null);
    const [didThrowUp, setDidThrowUp] = useState(initialData?.threwUp || null); 
    const [nauseaTrigger, setNauseaTrigger] = useState(initialData?.triggers || ""); 
    const [feelBetterNote, setFeelBetterNote] = useState(initialData?.reliefNotes || ""); 
    const [additionalNotes, setAdditionalNotes] = useState(initialData?.additionalNotes || "");

    const { theme } = useTheme();

    // Sync state with parent
    useEffect(() => {
        if (onUpdate) {
            onUpdate({
                timeOfDay: selectedConfusionTime,
                threwUp: didThrowUp,
                triggers: nauseaTrigger,
                reliefNotes: feelBetterNote,
                additionalNotes: additionalNotes
            });
        }
    }, [selectedConfusionTime, didThrowUp, nauseaTrigger, feelBetterNote, additionalNotes]);

    const toggleMenu = () => setIsMenuVisible(!isMenuVisible);

    return (
        <>
            {/* Collapsible Header */}
            <View 
                className="border rounded-lg px-3"
                style={{ 
                    backgroundColor: isMenuVisible ? (theme.primaryLightBlue || theme.textFieldBG) : theme.textFieldBG,
                    borderColor: isMenuVisible ? theme.primaryBlue : theme.borderColor
                }}
            >
                <View className="flex flex-row justify-between">
                    <Text className="font-ralewaySemiBold py-3 text-[16px]" style={{ color: theme.textColor }}>
                        Nausea
                    </Text>
                    <TouchableOpacity onPress={toggleMenu}>
                        <View className="pl-6 py-3">
                            {isMenuVisible ? 
                                <ArrowDown stroke={theme.textColor} /> : 
                                <ArrowRight stroke={theme.textColor} />
                            }
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Expanded Content */}
            {isMenuVisible && (
                <View className="p-5 mt-4 rounded-lg" style={{ backgroundColor: theme.textFieldBG }}>
                    
                    {/* Time of Day */}
                    <View className="flex flex-row flex-wrap">
                        {["morning", "afternoon", "evening", "night", "throughoutDay"].map(
                            (time) => (
                                <View className="mr-3 flex flex-row mb-4" key={time}>
                                    <RadioButton
                                        status={selectedConfusionTime === time ? "checked" : "unchecked"}
                                        onPress={() => setSelectedConfusionTime(time)}
                                        theme={theme}
                                    />
                                    <Text className="font-raleway text-[16px] ml-2" style={{ color: theme.darkGrey }}>
                                        {time === "throughoutDay" ? "Throughout day" : time.charAt(0).toUpperCase() + time.slice(1)}
                                    </Text>
                                </View>
                            )
                        )}
                    </View>

                    {/* Throw up status */}
                    <View className="mt-3">
                        <Text className="font-ralewaySemiBold mb-3 text-[16px]" style={{ color: theme.textColor }}>
                            Did you throw up?
                        </Text>
                        <View className="flex flex-row flex-wrap">
                            <View className="mr-6 flex flex-row mb-4">
                                <RadioButton
                                    status={didThrowUp === "yes" ? "checked" : "unchecked"}
                                    onPress={() => setDidThrowUp("yes")}
                                    theme={theme}
                                />
                                <Text className="font-raleway text-[16px] ml-2" style={{ color: theme.darkGrey }}>Yes</Text>
                            </View>
                            <View className="mr-3 flex flex-row mb-4">
                                <RadioButton
                                    status={didThrowUp === "no" ? "checked" : "unchecked"}
                                    onPress={() => setDidThrowUp("no")}
                                    theme={theme}
                                />
                                <Text className="font-raleway text-[16px] ml-2" style={{ color: theme.darkGrey }}>No</Text>
                            </View>
                        </View>
                    </View>

                    {/* Inputs Section */}
                    {[
                        { label: "What triggered the nausea?", value: nauseaTrigger, setter: setNauseaTrigger },
                        { label: "What made you feel better?", value: feelBetterNote, setter: setFeelBetterNote },
                        { label: "Tell us more about it", value: additionalNotes, setter: setAdditionalNotes }
                    ].map((item, index) => (
                        <View className="mt-5" key={index}>
                            <Text className="font-ralewaySemiBold mb-3 text-[16px]" style={{ color: theme.textColor }}>
                                {item.label}
                            </Text>

                            <StyledTextInput
                                multiline
                                value={item.value}
                                onChangeText={item.setter}
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
                                    style={{ backgroundColor: item.value.length > 0 ? "#FDA29B80" : theme.borderColor }}
                                >
                                    <CrossIcon isActive={item.value.length > 0} />
                                </View>
                                <TouchableOpacity
                                    onPress={() => null}
                                    disabled={item.value.length === 0}
                                    className="justify-center items-center rounded-full w-10 h-10"
                                    style={{ backgroundColor: item.value.length > 0 ? "#00b8df" : theme.borderColor }}
                                >
                                    <CheckIcon isActive={item.value.length > 0} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>
            )}
        </>
    );
};

export default NauseaMenu;
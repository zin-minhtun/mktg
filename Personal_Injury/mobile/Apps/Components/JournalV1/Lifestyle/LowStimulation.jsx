import { View, Text, TouchableOpacity, TextInput, Alert, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { styled } from "nativewind";
import AudioInputIcon from "../../Icons/AudioInputIcon";
import CheckIcon from "../../Icons/CheckIcon";
import CrossIcon from "../../Icons/CrossIcon";
import dayjs from "dayjs";
import AudioHandler from "../MealForm/AudioHandler";
import axios from "axios";
import { API_URL } from "@env";
import { useUserData } from "../../../Contexts/UserContext";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../../Contexts/ThemeContext";

const StyledTextInput = styled(TextInput);

const LowStimulation = ({ prefill, editMode, selectedDate }) => {
    const { theme } = useTheme();
    const { gUser } = useUserData();
    const navigation = useNavigation();
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [lowStimulationNote, setLowStimulationNote] = useState("");
    const [noteHeight, setNoteHeight] = useState(84);
    const [loading, setLoading] = useState(false);
    const noteRef = useRef(null);

    const options = [
        { id: "quietGathering", label: "Quiet Gathering" },
        { id: "bookClub", label: "Book Club" },
        { id: "art&Craft", label: "Art & Craft" },
        { id: "boardGames", label: "Board Games" },
    ];

    const getLabel = (id) => options.find(o => o.id === id)?.label || id;
    const getIdByLabel = (label) => options.find(o => o.label === label)?.id || label;

    useEffect(() => {
        if (prefill) {
            setLowStimulationNote(prefill.notes || "");
            if (prefill.activities) {
                const ids = prefill.activities.map(label => getIdByLabel(label));
                setSelectedOptions(ids);
            }
        }
    }, [prefill]);

    const toggleOption = (optionId) => {
        setSelectedOptions((prevSelected) =>
            prevSelected.includes(optionId)
                ? prevSelected.filter((id) => id !== optionId)
                : [...prevSelected, optionId]
        );
    };

    const handleTalk = () => {
        AudioHandler.focusInputWithVoiceHint(noteRef, null, true);
    };
    const handleCancel = () => { setLowStimulationNote(""); Keyboard.dismiss(); };

    const handleAccept = async () => {
        if (!lowStimulationNote && selectedOptions.length === 0) {
            Alert.alert("Nothing to save", "Select an option or add a note.");
            return;
        }

        setLoading(true);
        try {
            const activities = selectedOptions.map(id => getLabel(id));

            const payload = {
                userId: gUser._id,
                stimulation: 'Low',
                activities: activities,
                date: prefill ? prefill.date : (selectedDate || dayjs().format("YYYY-MM-DD")),
                notes: lowStimulationNote
            };

            if (editMode && prefill?._id) {
                await axios.put(`${API_URL}/api/v1/social-activities/update/${prefill._id}`, payload);
                Alert.alert("Updated", "Social activity updated.");
            } else {
                await axios.post(`${API_URL}/api/v1/social-activities`, payload);
                Alert.alert("Saved", "Social activity saved.");
                setLowStimulationNote("");
                setSelectedOptions([]);
            }
            Keyboard.dismiss();
            navigation.goBack();
        } catch (e) {
            console.error("Error saving social activity", e);
            Alert.alert("Error", "Could not save your activity.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1 px-5 pt-8 pb-28">
                <View className="mt-5">
                    <View className="flex flex-row flex-wrap">
                        {options.map((option) => (
                            <TouchableOpacity
                                key={option.id}
                                onPress={() => toggleOption(option.id)}
                                className={`border rounded-lg px-4 mr-3 mb-3`}
                                style={{
                                    backgroundColor: selectedOptions.includes(option.id) ? theme.primaryLighBlue : theme.textFieldBG,
                                    borderColor: selectedOptions.includes(option.id) ? theme.primaryLighBlue : theme.borderColor
                                }}
                            >
                                <Text
                                    className={`font-raleway py-2.5 text-[16px]`}
                                    style={{
                                        color: selectedOptions.includes(option.id) ? '#FFFFFF' : theme.textColor
                                    }}
                                >
                                    {option.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View className="mt-8">
                    <Text className="font-ralewaySemiBold mb-3 text-[16px]" style={{ color: theme.textColor }}>
                        Others
                    </Text>

                    {/* Textarea for notes */}
                    <StyledTextInput
                        multiline
                        ref={noteRef}
                        value={lowStimulationNote}
                        onChangeText={setLowStimulationNote}
                        onBlur={Keyboard.dismiss}
                        placeholder="Add notes"
                        placeholderTextColor={theme.darkGrey}
                        className="font-raleway text-[16px] p-3 border rounded-lg"
                        style={{
                            textAlignVertical: "top",
                            backgroundColor: theme.textFieldBG,
                            borderColor: theme.borderColor,
                            color: theme.textColor,
                            minHeight: 84,
                            height: noteHeight
                        }}
                        onContentSizeChange={(e) => setNoteHeight(Math.max(84, e.nativeEvent.contentSize.height + 8))}
                    />

                    <View className="flex-row justify-end mt-3">
                        <TouchableOpacity
                            onPress={handleTalk}
                            className="justify-center items-center mr-6 rounded-full w-10 h-10"
                            style={{ backgroundColor: '#00AEEF' }}
                        >
                            <AudioInputIcon />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleCancel}
                            disabled={lowStimulationNote.length === 0}
                            className={`justify-center items-center mr-3 rounded-full w-10 h-10`}
                            style={{ backgroundColor: lowStimulationNote.length > 0 ? "#FDA29B80" : (theme.mode === 'dark' ? '#003361' : '#E0E0E0') }}
                        >
                            <CrossIcon isActive={lowStimulationNote.length > 0} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleAccept}
                            disabled={loading}
                            className={`justify-center items-center rounded-full w-10 h-10`}
                            style={{ backgroundColor: (lowStimulationNote.length > 0 || selectedOptions.length > 0) && !loading ? "#22C55E" : (theme.mode === 'dark' ? '#003361' : '#E0E0E0') }}
                        >
                            {loading ? <ActivityIndicator size="small" color="#FFF" /> : <CheckIcon isActive={lowStimulationNote.length > 0 || selectedOptions.length > 0} />}
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="mt-6 mb-8">
                    <TouchableOpacity
                        className="w-full py-4 rounded-full"
                        style={{ backgroundColor: loading ? '#A0E0F0' : theme.primaryLighBlue, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 6, shadowOffset: { width: 0, height: 3 }, elevation: 2 }}
                        onPress={handleAccept}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-center text-white font-ralewaySemiBold text-[16px]">{editMode ? "Update" : "Save"}</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
};

export default LowStimulation;

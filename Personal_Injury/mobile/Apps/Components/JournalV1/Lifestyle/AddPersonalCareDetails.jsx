import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Alert,
    Keyboard,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ActivityIndicator,
} from "react-native";
import React, { useRef, useState, useEffect } from "react";
import { styled } from "nativewind";
import axios from "axios";
import { API_URL } from "@env";
import { useUserData } from "../../../Contexts/UserContext";
import { useTheme } from "../../../Contexts/ThemeContext";

// Import icons...
import AudioInputIcon from "../../Icons/AudioInputIcon";
import CrossIcon from "../../Icons/CrossIcon";
import CheckIcon from "../../Icons/CheckIcon";
import ShowerIcon from "./svg/ShowerIcon";
import ShaveIcon from "./svg/ShaveIcon";
import HairIcon from "./svg/HairIcon";
import TeethIcon from "./svg/TeethIcon";
import NailIcon from "./svg/NailIcon";
import DressedIcon from "./svg/DressedIcon";
import CookedIcon from "./svg/CookedIcon";
import TrashIcon from "./svg/TrashIcon";
import SweptIcon from "./svg/SweptIcon";
import VacuumIcon from "./svg/VacuumIcon";
import CleaningIcon from "./svg/CleaningIcon";
import MoppedIcon from "./svg/MoppedIcon";
import DishesIcon from "./svg/DishesIcon";
import FoldedLaundryIcon from "./svg/FoldedLaundryIcon";
import DidLaundryIcon from "./svg/DidLaundryIcon";
import PressedLaundryIcon from "./svg/PressedLaundryIcon";
import dayjs from "dayjs";
import AudioHandler from "../MealForm/AudioHandler";

const StyledTextInput = styled(TextInput);

const AddPersonalCareDetails = ({ navigation, route }) => {
    const { gUser } = useUserData();
    const { theme } = useTheme();
    const [selectedHygieneGroomingOptions, setSelectedHygieneGroomingOptions] = useState([]);
    const [selectedDailyLivingOptions, setSelectedDailyLivingOptions] = useState([]);
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);
    const noteRef = useRef(null);
    const selectedDate = route?.params?.selectedDate || dayjs().format("YYYY-MM-DD");

    const hygieneGroomingOptions = [
        { id: "tookShower", label: "Took a shower", icon: <ShowerIcon /> },
        { id: "hadShave", label: "Had a shave", icon: <ShaveIcon /> },
        { id: "hairCare", label: "Hair care", icon: <HairIcon /> },
        { id: "cleanedTeeth", label: "Cleaned teeth", icon: <TeethIcon /> },
        { id: "nailCare", label: "Nail care", icon: <NailIcon /> },
        { id: "gotDressed", label: "Got dressed", icon: <DressedIcon /> },
    ];

    const dailyLivingOptions = [
        { id: "cooked", label: "Cooked", icon: <CookedIcon /> },
        { id: "tookOutTrash", label: "Took out trash", icon: <TrashIcon /> },
        { id: "swept", label: "Swept", icon: <SweptIcon /> },
        { id: "usedTheVacuum", label: "Used the vacuum", icon: <VacuumIcon /> },
        { id: "generalCleaning", label: "General cleaning", icon: <CleaningIcon /> },
        { id: "mopped", label: "Mopped", icon: <MoppedIcon /> },
        { id: "didDishes", label: "Did dishes", icon: <DishesIcon /> },
        { id: "foldedLaundry", label: "Folded laundry", icon: <FoldedLaundryIcon /> },
        { id: "didLaundry", label: "Did laundry", icon: <DidLaundryIcon /> },
        { id: "pressedLaundry", label: "Pressed laundry", icon: <PressedLaundryIcon /> },
    ];

    // Helper: Get label by ID
    const getLabel = (id, options) => options.find(o => o.id === id)?.label || id;

    const toggleHygieneGroomingOption = (id) => {
        setSelectedHygieneGroomingOptions((prev) =>
            prev.includes(id) ? prev.filter((o) => o !== id) : [...prev, id]
        );
    };

    const toggleDailyLivingOption = (id) => {
        setSelectedDailyLivingOptions((prev) =>
            prev.includes(id) ? prev.filter((o) => o !== id) : [...prev, id]
        );
    };

    // Load existing data if in edit mode
    useEffect(() => {
        if (route.params?.prefill) {
            const { prefill } = route.params;
            setNotes(prefill.notes || "");

            // Map labels back to IDs? 
            // This is tricky because we store labels but use IDs for toggle.
            // Simplified: we'll try to match labels back to IDs.
            const hygieneIds = hygieneGroomingOptions.filter(o => prefill.itemLabels.includes(o.label)).map(o => o.id);
            const dailyIds = dailyLivingOptions.filter(o => prefill.itemLabels.includes(o.label)).map(o => o.id);

            setSelectedHygieneGroomingOptions(hygieneIds);
            setSelectedDailyLivingOptions(dailyIds);
        }
    }, [route.params?.prefill]);

    const handleTalk = () => {
        AudioHandler.focusInputWithVoiceHint(noteRef, null, true);
    };
    const handleCancel = () => setNotes("");

    const handleAccept = async () => {
        if (!notes && selectedDailyLivingOptions.length === 0 && selectedHygieneGroomingOptions.length === 0) {
            Alert.alert("Nothing to save", "Select at least one option or add a note.");
            return;
        }

        setLoading(true);
        try {
            // Prepare Item Labels
            const hygieneLabels = selectedHygieneGroomingOptions.map(id => getLabel(id, hygieneGroomingOptions));
            const dailyLabels = selectedDailyLivingOptions.map(id => getLabel(id, dailyLivingOptions));
            const allLabels = [...hygieneLabels, ...dailyLabels];

            // Prepare Categories
            const categories = [];
            if (selectedHygieneGroomingOptions.length > 0) categories.push("Personal Hygiene");
            if (selectedDailyLivingOptions.length > 0) categories.push("Daily Living");

            const payload = {
                userId: gUser._id,
                date: selectedDate,
                categories: categories,
                itemLabels: allLabels,
                notes: notes
            };

            if (route.params?.editMode && route.params?.adlId) {
                await axios.put(`${API_URL}/api/adls/update/${route.params.adlId}`, payload);
                Alert.alert("Updated", "Personal care updated successfully.");
            } else {
                await axios.post(`${API_URL}/api/adls/add`, payload);
                Alert.alert("Saved", "Personal care saved successfully.");
            }

            navigation.goBack();
        } catch (e) {
            console.error("Error saving ADL:", e);
            Alert.alert("Error", "Could not save. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1" style={{ backgroundColor: theme.background }}>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: 150, paddingHorizontal: 20, paddingTop: 64 }}
                    showsVerticalScrollIndicator={false}
                >
                    <View>
                        <View className="mt-6">
                            <Text className="mb-3 font-ralewaySemiBold text-[16px]" style={{ color: theme.textColor }}>
                                Personal Hygiene and Grooming
                            </Text>
                            <View className="flex flex-row flex-wrap">
                                {hygieneGroomingOptions.map((option) => (
                                    <TouchableOpacity
                                        key={option.id}
                                        onPress={() => toggleHygieneGroomingOption(option.id)}
                                        className={`border rounded-lg px-2 mr-3 mb-3`}
                                        style={{
                                            backgroundColor: selectedHygieneGroomingOptions.includes(option.id) ? theme.primaryLighBlue : theme.textFieldBG,
                                            borderColor: selectedHygieneGroomingOptions.includes(option.id) ? theme.primaryLighBlue : theme.borderColor
                                        }}
                                    >
                                        <View className="flex flex-row justify-start">
                                            <View className="py-2 mr-2">{option.icon}</View>
                                            <Text className="font-raleway py-2 text-[16px]" style={{ color: selectedHygieneGroomingOptions.includes(option.id) ? '#FFFFFF' : theme.darkGrey }}>
                                                {option.label}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <View className="mt-3">
                            <Text className="mb-3 font-ralewaySemiBold text-[16px]" style={{ color: theme.textColor }}>
                                Cleaning and Daily Living
                            </Text>
                            <View className="flex flex-row flex-wrap">
                                {dailyLivingOptions.map((option) => (
                                    <TouchableOpacity
                                        key={option.id}
                                        onPress={() => toggleDailyLivingOption(option.id)}
                                        className={`border rounded-lg px-2 mr-3 mb-3`}
                                        style={{
                                            backgroundColor: selectedDailyLivingOptions.includes(option.id) ? theme.primaryLighBlue : theme.textFieldBG,
                                            borderColor: selectedDailyLivingOptions.includes(option.id) ? theme.primaryLighBlue : theme.borderColor
                                        }}
                                    >
                                        <View className="flex flex-row justify-start">
                                            <View className="py-2 mr-1">{option.icon}</View>
                                            <Text className="font-raleway py-2 text-[16px]" style={{ color: selectedDailyLivingOptions.includes(option.id) ? '#FFFFFF' : theme.darkGrey }}>
                                                {option.label}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <View className="mt-3">
                            <Text className="font-ralewaySemiBold mb-3 text-[16px]" style={{ color: theme.textColor }}>
                                Others
                            </Text>

                            <StyledTextInput
                                multiline
                                ref={noteRef}
                                value={notes}
                                onChangeText={setNotes}
                                placeholder="Add notes"
                                placeholderTextColor={theme.darkGrey}
                                className="font-raleway text-[16px] h-28 p-3 border rounded-lg focus:border-primaryBlue"
                                style={{ textAlignVertical: "top", backgroundColor: theme.textFieldBG, borderColor: theme.borderColor, color: theme.textColor }}
                            />

                            <View className="flex-row justify-end mt-3">
                                <TouchableOpacity className="justify-center items-center mr-6 rounded-full w-10 h-10" onPress={handleTalk} style={{ backgroundColor: theme.primaryLighBlue }}>
                                    <AudioInputIcon />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={handleCancel}
                                    className={`first-letter:justify-center items-center mr-3 rounded-full w-10 h-10`}
                                    style={{ backgroundColor: notes.length > 0 ? "#FDA29B80" : (theme.mode === 'dark' ? '#003361' : '#E0E0E0') }}
                                >
                                    <CrossIcon isActive={notes.length > 0} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={handleAccept}
                                    disabled={loading}
                                    className={`justify-center items-center rounded-full w-10 h-10`}
                                    style={{ backgroundColor: (notes.length > 0 || selectedDailyLivingOptions.length > 0 || selectedHygieneGroomingOptions.length > 0) && !loading ? theme.primaryLighBlue : (theme.mode === 'dark' ? '#003361' : '#E0E0E0') }}
                                >
                                    {loading ? <ActivityIndicator size="small" color="#FFF" /> : <CheckIcon isActive={notes.length > 0 || selectedDailyLivingOptions.length > 0 || selectedHygieneGroomingOptions.length > 0} />}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <View className="mt-6 mb-8 px-3">
                        <TouchableOpacity
                            className="w-full py-4 rounded-full"
                            style={{ backgroundColor: loading ? '#A0E0F0' : '#00C2FF', shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 6, shadowOffset: { width: 0, height: 3 }, elevation: 2 }}
                            onPress={handleAccept}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text className="text-center text-white font-ralewaySemiBold text-[16px]">Save</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
};

export default AddPersonalCareDetails;

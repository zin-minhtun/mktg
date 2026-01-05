import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Switch,
    Alert,
    Keyboard,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import React, { useState, useEffect, useMemo } from "react";
import { styled } from "nativewind";
import Checkbox from "expo-checkbox";
import axios from "axios";
import { API_URL } from "@env";
import { useUserData } from "../../../Contexts/UserContext";
import { useTheme } from "../../../Contexts/ThemeContext";

// Components
import AudioInputIcon from "../../Icons/AudioInputIcon";
import CheckIcon from "../../Icons/CheckIcon";
import CrossIcon from "../../Icons/CrossIcon";
import ArrowRight from "../../Icons/ArrowRight";
import ArrowDown from "../../Icons/ArrowDown";
import WaterGlass from "../Medication/svg/WaterGlass";
import Milk from "../Medication/svg/Milk";
import Salad from "../Medication/svg/Salad";
import Stomach from "../Medication/svg/Stomach";
import Vitamin from "./svg/Vitamin";
import Multivitamin from "./svg/Multivitamin";
import Mineral from "./svg/Mineral";
import Multimineral from "./svg/Multimineral";
import OneSelectDropDownPicker from "../../sharedComponents/OneSelectDropDownPicker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import dayjs from "dayjs";

const StyledTextInput = styled(TextInput);
const supplementsData = [
    {
        id: "vitamin",
        name: "Vitamin",
        icon: <Vitamin />,
        color: "#C5F4FD",
    },
    {
        id: "multiVitamin",
        name: "Multivitamin",
        icon: <Multivitamin />,
        color: "#FFDB94",
    },
    {
        id: "mineral",
        name: "Mineral",
        icon: <Mineral />,
        color: "#FDF2C5",
    },
    {
        id: "multiMineral",
        name: "Multi Mineral",
        icon: <Multimineral />,
        color: "#F9D9D9",
    },
];

const AddSupplementDetails = ({ navigation, route }) => {
    const { gUser } = useUserData();
    const { theme } = useTheme();
    const [selectedSymptom, setSelectedSymptom] = useState(
        supplementsData[0]?.id
    );

    const [selectedOption, setSelectedOption] = useState("water");
    const [isReminderEnabled, setIsReminderEnabled] = useState(false);
    const [supplementName, setSupplementName] = useState("");
    const [supplementDosage, setSupplementDosage] = useState("");
    const [frequency, setFrequency] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [datePickerVisible, setDatePickerVisible] = useState(false);
    const [activeDateField, setActiveDateField] = useState(null); // 'start' | 'end' | null
    const [pickerMode, setPickerMode] = useState('date');
    const [reminderTime, setReminderTime] = useState("");
    const selectedDate = route?.params?.selectedDate || dayjs().format("YYYY-MM-DD");

    const options = [
        { id: "water", label: "With water", icon: <WaterGlass /> },
        { id: "milk", label: "With milk", icon: <Milk /> },
        { id: "food", label: "With food", icon: <Salad /> },
        { id: "empty_stomach", label: "Empty stomach", icon: <Stomach /> },
    ];

    useEffect(() => {
        console.log(selectedSymptom);
    }, [selectedSymptom]);

    const handleSymptomSelect = (id) => {
        setSelectedSymptom(id);
    };

    const toggleSwitch = () => {
        setIsReminderEnabled((previousState) => !previousState);
    };

    const frequencyOptions = useMemo(
        () => [
            { label: "Once daily", value: "once-daily" },
            { label: "Twice daily", value: "twice-daily" },
            { label: "Weekly", value: "weekly" },
            { label: "Custom", value: "custom" },
        ],
        []
    );

    const showDatePicker = (field) => {
        setPickerMode('date');
        setActiveDateField(field);
        setDatePickerVisible(true);
    };

    const onConfirmDate = (d) => {
        const iso = d.toISOString().slice(0, 10);
        if (activeDateField === "start") {
            setStartDate(iso);
            if (endDate && endDate < iso) setEndDate(iso);
        } else if (activeDateField === "end") {
            setEndDate(iso);
        }
        setActiveDateField(null);
        setDatePickerVisible(false);
    };
    const onCancelDate = () => {
        setActiveDateField(null);
        setDatePickerVisible(false);
    };

    // Edit support: prefill from route params if provided
    useEffect(() => {
        const params = route?.params || {};
        if (params.prefill) {
            const e = params.prefill;
            setSelectedSymptom(e.type || supplementsData[0]?.id);
            setSupplementName(e.name || "");
            setSupplementDosage(e.dosage || "");
            setFrequency(e.frequency || "");
            setStartDate(e.startDate ? dayjs(e.startDate).format("YYYY-MM-DD") : "");
            setEndDate(e.endDate ? dayjs(e.endDate).format("YYYY-MM-DD") : "");
            setSelectedOption(e.howToTake || "water");
            setIsReminderEnabled(!!e.reminderEnabled);
            setReminderTime(e.reminderTime || "");
        }
    }, [route?.params]);

    const handleSave = async () => {
        if (!supplementName.trim()) {
            Alert.alert("Missing info", "Please enter a supplement name.");
            return;
        }

        const payload = {
            userId: gUser._id,
            type: selectedSymptom,
            name: supplementName.trim(),
            dosage: supplementDosage.trim(),
            frequency,
            howToTake: selectedOption,
            startDate: startDate,
            endDate: endDate,
            reminderEnabled: isReminderEnabled,
            reminderTime: reminderTime,
            date: selectedDate,
        };

        try {
            if (route?.params?.editMode && route?.params?.supplementId) {
                await axios.put(`${API_URL}/api/supplements/update/${route.params.supplementId}`, payload);
                Alert.alert("Updated", "Supplement updated successfully.");
            } else {
                await axios.post(`${API_URL}/api/supplements/add`, payload);
                Alert.alert("Saved", "Supplement saved successfully.");
            }

            if (isReminderEnabled) {
                console.log("Reminder requested for supplement; defer to system settings");
            }

            Keyboard.dismiss();
            navigation.goBack();
        } catch (e) {
            console.error("Failed to save supplement", e);
            Alert.alert("Error", "Could not save supplement.");
        }
    };

    return (
        <View className="flex-1" style={{ backgroundColor: theme.background }}>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 150, paddingHorizontal: 20, paddingTop: 48 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Horizontal Scrollable Symptom Icons */}
                <View className="mt-5">
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View className="flex-row mx-2">
                            {supplementsData.map((symptom) => (
                                <View className="items-center w-28 mb-4" key={symptom.id}>
                                    <TouchableOpacity
                                        onPress={() => handleSymptomSelect(symptom.id)}
                                        className={`rounded-full w-20 h-20 justify-center items-center ${selectedSymptom === symptom.id
                                            ? "border-2 border-primaryBlue"
                                            : ""
                                            }`}
                                        style={{ backgroundColor: symptom.color }}
                                    >
                                        {symptom.icon}
                                    </TouchableOpacity>
                                    <Text
                                        className={`font-raleway font-semibold text-[14px] pt-2 text-center ${selectedSymptom === symptom.id
                                            ? ""
                                            : "text-gray-400"
                                            }`}
                                        style={{ color: selectedSymptom === symptom.id ? theme.textColor : theme.darkGrey }}
                                    >
                                        {symptom.name}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </ScrollView>
                </View>

                <View>
                    <View className="mt-5">
                        <Text className="mb-3 font-ralewaySemiBold text-[16px]" style={{ color: theme.textColor }}>
                            Supplement Name
                        </Text>
                        <TextInput
                            className="font-raleway h-[46px] border rounded-lg p-2 px-5"
                            placeholder="Vitamin A"
                            value={supplementName}
                            onChangeText={setSupplementName}
                            style={{
                                backgroundColor: theme.textFieldBG,
                                borderColor: theme.borderColor,
                                color: theme.textColor
                            }}
                            placeholderTextColor={theme.darkGrey}
                        />
                    </View>

                    <View className="mt-6">
                        <Text className="mb-3 font-ralewaySemiBold text-[16px]" style={{ color: theme.textColor }}>
                            Supplement Dosage
                        </Text>
                        <TextInput
                            className="font-raleway h-[46px] border rounded-lg p-2 px-5"
                            placeholder="200 mg"
                            value={supplementDosage}
                            onChangeText={setSupplementDosage}
                            style={{
                                backgroundColor: theme.textFieldBG,
                                borderColor: theme.borderColor,
                                color: theme.textColor
                            }}
                            placeholderTextColor={theme.darkGrey}
                        />
                    </View>

                    <View className="mt-6">
                        <Text className="mb-3 font-ralewaySemiBold text-[16px]" style={{ color: theme.textColor }}>Supplement Frequency</Text>
                        <OneSelectDropDownPicker
                            placeHolder="Select frequency"
                            optionList={frequencyOptions}
                            onChange={(val) => setFrequency(val)}
                        />
                    </View>

                    <View className="mt-6">
                        <Text className="mb-3 font-ralewaySemiBold text-[16px]" style={{ color: theme.textColor }}>Supplement Duration</Text>
                        <View className="flex flex-row justify-between space-x-2">
                            <View className="flex-[1]">
                                <Text className="mb-3 font-raleway text-[16px]" style={{ color: theme.textColor }}>From</Text>
                                <TouchableOpacity className={`border rounded-lg px-3`} onPress={() => showDatePicker('start')}
                                    style={{ backgroundColor: theme.textFieldBG, borderColor: theme.borderColor }}
                                >
                                    <View className="flex flex-row justify-between">
                                        <Text className="font-raleway py-3 text-[16px]" style={{ color: theme.darkGrey }}>
                                            {startDate ? dayjs(startDate).format('MMM D') : 'Select start'}
                                        </Text>
                                        <View className="pl-6 py-3">
                                            <ArrowDown />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View className="flex-[1]">
                                <Text className="mb-3 font-raleway text-[16px]" style={{ color: theme.textColor }}>To</Text>
                                <TouchableOpacity className={`border rounded-lg px-3`} onPress={() => showDatePicker('end')}
                                    style={{ backgroundColor: theme.textFieldBG, borderColor: theme.borderColor }}
                                >
                                    <View className="flex flex-row justify-between">
                                        <Text className="font-raleway py-3 text-[16px]" style={{ color: theme.darkGrey }}>
                                            {endDate ? dayjs(endDate).format('MMM D') : 'Select end'}
                                        </Text>
                                        <View className="pl-6 py-3">
                                            <ArrowDown />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <View className="mt-6">
                        <Text className="mb-3 font-ralewaySemiBold text-[16px]" style={{ color: theme.textColor }}>
                            How to take it
                        </Text>
                        <View className="flex flex-row flex-wrap">
                            {options.map((option) => (
                                <TouchableOpacity
                                    key={option.id}
                                    onPress={() => setSelectedOption(option.id)}
                                    className={`border rounded-lg px-3 mr-3 mb-3`}
                                    style={{
                                        backgroundColor: selectedOption === option.id ? theme.primaryLighBlue : theme.textFieldBG,
                                        borderColor: selectedOption === option.id ? theme.primaryLighBlue : theme.borderColor
                                    }}
                                >
                                    <View className="flex flex-row justify-start">
                                        <View className="py-2 mr-2">{option.icon}</View>
                                        <Text className="font-raleway py-2 text-[16px]"
                                            style={{ color: selectedOption === option.id ? '#FFFFFF' : theme.darkGrey }}
                                        >
                                            {option.label}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View className="mt-6 flex-row justify-between items-center">
                        <Text className="mb-3 font-ralewaySemiBold text-[16px]" style={{ color: theme.textColor }}>
                            Set Reminder
                        </Text>
                        <Switch
                            value={isReminderEnabled}
                            onValueChange={toggleSwitch}
                            trackColor={{ false: "#767577", true: "#00b8df" }} // Tailwind blue
                            thumbColor={isReminderEnabled ? "#ffffff" : "#f4f3f4"} // White for the thumb
                        />
                    </View>
                    {isReminderEnabled && (
                        <View className="mt-2">
                            <TouchableOpacity
                                className={`border rounded-lg px-3`}
                                onPress={() => { setPickerMode('time'); setActiveDateField(null); setDatePickerVisible(true); }}
                                style={{ backgroundColor: theme.textFieldBG, borderColor: theme.borderColor }}
                            >
                                <View className="flex flex-row justify-between">
                                    <Text className="font-raleway py-3 text-[16px]" style={{ color: theme.darkGrey }}>{reminderTime || 'Select time'}</Text>
                                    <View className="pl-6 py-3"><ArrowDown /></View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                <View className="absolute bottom-10 px-3 left-0 right-0">
                    <TouchableOpacity
                        className="w-full bg-primaryBlue py-4 rounded-full"
                        onPress={handleSave}
                    >
                        <Text className="text-center text-white font-ralewaySemiBold text-[16px]">
                            Save
                        </Text>
                    </TouchableOpacity>
                </View>
                <DateTimePickerModal
                    isVisible={datePickerVisible}
                    mode={pickerMode}
                    onConfirm={(d) => {
                        if (pickerMode === 'time') {
                            const hours = d.getHours();
                            const minutes = d.getMinutes();
                            const ampm = hours >= 12 ? 'PM' : 'AM';
                            const hr12 = ((hours + 11) % 12 + 1);
                            const mm = String(minutes).padStart(2, '0');
                            setReminderTime(`${hr12}:${mm} ${ampm}`);
                            setDatePickerVisible(false);
                            return;
                        }
                        onConfirmDate(d);
                    }}
                    onCancel={() => { setDatePickerVisible(false); setActiveDateField(null); }}
                />
            </ScrollView>
        </View>
    );
};

export default AddSupplementDetails;

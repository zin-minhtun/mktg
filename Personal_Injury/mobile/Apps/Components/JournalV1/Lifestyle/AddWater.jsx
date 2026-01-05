import React, { useState, useEffect } from "react";
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    TextInput,
    FlatList,
} from "react-native";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import axios from "axios";
import { API_URL } from "@env";
import { useUserData } from "../../../Contexts/UserContext";
import { useTheme } from "../../../Contexts/ThemeContext";

// Component
import EditIcon from "./svg/EditIcon";
import CrossIcon from "../../Icons/CrossIcon";
import CheckIcon from "../../Icons/CheckIcon";
import SmGlass from "./svg/SmGlass";
import MdGlass from "./svg/MdGlass";
import LgGlass from "./svg/LgGlass";
import WaterWave from "./svg/WaterWave";
import WaterWaveCircle from "./svg/WaterWaveCircle";

dayjs.extend(isoWeek);

const { width } = Dimensions.get("window");

const AddWater = () => {
    const { gUser } = useUserData();
    const { theme } = useTheme();
    const [selectedDate, setSelectedDate] = useState(
        dayjs().format("YYYY-MM-DD")
    );
    const [weekDates, setWeekDates] = useState([]);
    const [activeSlide, setActiveSlide] = useState(0);
    const [instructions, setInstructions] = useState([
        "Swipe right to manually enter",
        "Swipe left to auto-fill",
    ]);
    const [isGlassSelected, setIsGlassSelected] = useState(false);
    const [selectedUnit, setSelectedUnit] = useState("oz");
    const [goalMl, setGoalMl] = useState(2000);
    const [consumedMl, setConsumedMl] = useState(0);
    const [manualValue, setManualValue] = useState("");
    const [editingGoal, setEditingGoal] = useState(false);
    const [goalInput, setGoalInput] = useState("");

    const handleUnitSelect = (unit) => {
        setSelectedUnit(unit);
    };

    const loadForDate = async (date) => {
        if (!gUser?._id) return;
        try {
            const response = await axios.get(`${API_URL}/api/dailyLog/water`, {
                params: { userId: gUser._id, date }
            });
            const data = response.data;
            if (data) {
                setGoalMl(data.goalMl ?? 2000);
                setConsumedMl(data.consumedMl ?? 0);
                setSelectedUnit(data.unit || "oz");
                setIsGlassSelected((data.consumedMl || 0) > 0);
            }
        } catch (e) {
            console.warn("Failed to load water progress", e);
        }
    };

    const persistForDate = async (date, next) => {
        if (!gUser?._id) return;
        try {
            const payload = {
                userId: gUser._id,
                date: date,
                water: {
                    goalMl: next.goalMl ?? goalMl,
                    consumedMl: next.consumedMl ?? consumedMl,
                    unit: selectedUnit
                }
            };
            await axios.post(`${API_URL}/api/dailyLog/water/update`, payload);
        } catch (e) {
            console.warn("Failed to save water progress", e);
        }
    };

    const startEditGoal = () => {
        setGoalInput(String(goalMl));
        setEditingGoal(true);
    };

    const cancelEditGoal = () => {
        setEditingGoal(false);
        setGoalInput("");
    };

    const saveEditGoal = () => {
        const parsed = parseInt(goalInput, 10);
        if (!isNaN(parsed) && parsed > 0) {
            setGoalMl(parsed);
            persistForDate(selectedDate, { goalMl: parsed });
        }
        setEditingGoal(false);
    };

    // Get current week days
    useEffect(() => {
        const getCurrentWeek = () => {
            const startOfWeek = dayjs().startOf("isoWeek");
            const dates = [];

            for (let i = 0; i < 7; i++) {
                dates.push(startOfWeek.add(i, "day").format("YYYY-MM-DD"));
            }

            setWeekDates(dates);
        };

        getCurrentWeek();
        loadForDate(dayjs().format("YYYY-MM-DD"));
    }, []);

    useEffect(() => {
        loadForDate(selectedDate);
    }, [selectedDate]);

    const renderWeekDay = ({ item }) => {
        const isSelected = item === selectedDate;
        return (
            <TouchableOpacity
                onPress={() => setSelectedDate(item)}
                className="mt-6 rounded-lg w-[55px] h-[70px]"
                style={{
                    backgroundColor: theme.mode === 'dark'
                        ? (isSelected ? '#003B5C' : theme.textFieldBG)
                        : (isSelected ? "#DFF7FD" : "#fff"),
                    borderColor: theme.mode === 'dark'
                        ? (isSelected ? '#00AEEF' : theme.borderColor) // Fixed border color logic
                        : (isSelected ? '#00AEEF' : '#E6E6E6'),
                    borderWidth: 1,
                }}
            >
                <View className="flex-1 justify-center items-center">
                    <Text className="font-raleway" style={{ color: theme.textColor }}>{dayjs(item).format("ddd")}</Text>
                    <Text className="text-center font-ralewayBold text-2xl"
                        style={{ color: isSelected ? (theme.mode === 'dark' ? '#FFFFFF' : '#00AEEF') : theme.textColor }}>
                        {dayjs(item).format("DD")}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    const addWaterMl = (ml) => {
        const next = Math.max(0, consumedMl + ml);
        setConsumedMl(next);
        setIsGlassSelected(next > 0);
        persistForDate(selectedDate, { consumedMl: next });
    };

    const handleSmallGlass = () => addWaterMl(225);
    const handleMediumGlass = () => addWaterMl(500);
    const handleLargeGlass = () => addWaterMl(1000);

    const parseManualAndAdd = () => {
        const val = Number(manualValue);
        if (isNaN(val) || val <= 0) return;
        const mlToAdd = selectedUnit === "ml" ? val : Math.round(val * 29.5735);
        addWaterMl(mlToAdd);
        setManualValue("");
        try { require('react-native').Keyboard.dismiss(); } catch (_) { }
    };

    const onScroll = (event) => {
        const slide = Math.round(event.nativeEvent.contentOffset.x / width);
        setActiveSlide(slide);
    };

    const percent = Math.min(100, Math.round((consumedMl / (goalMl || 1)) * 100));
    const formatGoal = () => `${goalMl}ml`;
    const ozFromMl = (ml) => Math.round((ml / 29.5735) * 10) / 10;

    return (
        <View className="flex-1" style={{ backgroundColor: theme.background }}>
            {/* Calendar section */}
            <View className="pt-16 px-5" style={{ backgroundColor: theme.background }}>
                <View className="ml-4">
                    <Text className="font-raleway text-[14px] h-6" style={{ color: theme.darkGrey }}>
                        {dayjs(selectedDate).format("MMM DD, YYYY")}
                    </Text>
                    <Text className="font-ralewayBold text-[24px]" style={{ color: theme.textColor }}>Today</Text>
                </View>

                <View className="mt-4">
                    <FlatList
                        data={weekDates}
                        horizontal
                        renderItem={renderWeekDay}
                        keyExtractor={(item) => item}
                        showsHorizontalScrollIndicator={false}
                        ItemSeparatorComponent={() => <View className="w-3" />}
                    />
                </View>
            </View>

            <View className="flex-1">
                <View className="h-[15%] px-5 pt-8 pb-4" style={{ backgroundColor: theme.background }}>
                    <Text className="font-ralewaySemiBold text-[16px]" style={{ color: theme.textColor }}>
                        Current goal
                    </Text>
                    {editingGoal ? (
                        <View className="flex-row items-center mt-3">
                            <TextInput
                                value={goalInput}
                                onChangeText={setGoalInput}
                                keyboardType="numeric"
                                className="font-raleway text-[16px] rounded-lg px-3 py-2 mr-3"
                                style={{ width: 110, borderWidth: 1, borderColor: theme.borderColor, backgroundColor: theme.textFieldBG, color: theme.textColor }}
                                placeholder="ml"
                                placeholderTextColor={theme.darkGrey}
                                returnKeyType="done"
                                onSubmitEditing={saveEditGoal}
                            />
                            <TouchableOpacity onPress={cancelEditGoal} className="justify-center items-center mr-3 rounded-full w-10 h-10 bg-[#E0E0E0]">
                                <CrossIcon />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={saveEditGoal} className="justify-center items-center rounded-full w-10 h-10 bg-[#E0E0E0]">
                                <CheckIcon />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View className="flex-row items-center mt-2">
                            <Text className="font-raleway text-[16px] mr-3" style={{ color: theme.textColor }}>
                                {formatGoal()}
                            </Text>
                            <TouchableOpacity onPress={startEditGoal}>
                                <EditIcon />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                <View className="flex-1 relative justify-center items-center" style={{ borderTopWidth: 1, borderTopColor: '#ADE5FC' }}>
                    {isGlassSelected ? (
                        <View className="absolute -top-16">
                            <WaterWaveCircle />
                            <Text className="font-ralewaySemiBold text-[18px] text-center absolute w-full" style={{ top: 44, color: '#000' }}>
                                {percent}%
                            </Text>
                        </View>
                    ) : (
                        <View className="absolute -top-16 w-[117px] h-[117px] border-[6px] border-[#ADE5FC] rounded-full justify-end"
                            style={{ backgroundColor: theme.mode === 'dark' ? theme.textFieldBG : '#fff' }}>
                            <Text className="font-ralewaySemiBold text-[18px] text-center bottom-5" style={{ color: theme.textColor }}>
                                {percent}%
                            </Text>
                        </View>
                    )}

                    <View className="flex-[5]">
                        {/* Conditionally render WaterWave */}
                        {isGlassSelected && (
                            <View className="absolute justify-end h-full">
                                <WaterWave />
                            </View>
                        )}

                        <ScrollView
                            horizontal
                            pagingEnabled
                            onScroll={onScroll}
                            scrollEventThrottle={16}
                            showsHorizontalScrollIndicator={false}
                        >
                            {/* Slide 1 */}
                            <View
                                style={{ width }}
                                className="relative flex flex-row justify-evenly items-end pb-10"
                            >
                                <View className="flex-1 justify-center items-center">
                                    <TouchableOpacity onPress={handleSmallGlass}>
                                        <SmGlass />
                                    </TouchableOpacity>
                                    <Text
                                        className={`font-ralewaySemiBold text-[16px] mt-2 ${isGlassSelected ? "text-gray-100" : ""
                                            }`}
                                        style={{ color: isGlassSelected ? '#f5f5f5' : theme.textColor }}
                                    >
                                        +225ml
                                    </Text>
                                </View>
                                <View className="flex-1 justify-center items-center">
                                    <TouchableOpacity onPress={handleMediumGlass}>
                                        <MdGlass />
                                    </TouchableOpacity>
                                    <Text
                                        className={`font-ralewaySemiBold text-[16px] mt-2 ${isGlassSelected ? "text-gray-100" : ""
                                            }`}
                                        style={{ color: isGlassSelected ? '#f5f5f5' : theme.textColor }}
                                    >
                                        +500ml
                                    </Text>
                                </View>
                                <View className="flex-1 justify-center items-center">
                                    <TouchableOpacity onPress={handleLargeGlass}>
                                        <LgGlass />
                                    </TouchableOpacity>
                                    <Text
                                        className={`font-ralewaySemiBold text-[16px] mt-2 ${isGlassSelected ? "text-gray-100" : ""
                                            }`}
                                        style={{ color: isGlassSelected ? '#f5f5f5' : theme.textColor }}
                                    >
                                        +1l
                                    </Text>
                                </View>
                            </View>

                            {/* Slide 2 */}
                            <View
                                style={{ width }}
                                className="relative flex flex-row justify-evenly items-end pb-10"
                            >
                                <View style={{ position: "relative", flex: 1 }}>
                                    <TextInput
                                        style={{
                                            fontFamily: "raleway",
                                            color: theme.textColor,
                                            fontSize: 16,
                                            borderWidth: 1,
                                            borderColor: theme.borderColor,
                                            borderRadius: 12,
                                            padding: 15,
                                            backgroundColor: theme.textFieldBG,
                                        }}
                                        placeholder={`Add water (${selectedUnit})`}
                                        keyboardType="numeric"
                                        placeholderTextColor={theme.darkGrey}
                                        className="mx-3"
                                        value={manualValue}
                                        onChangeText={setManualValue}
                                        onSubmitEditing={parseManualAndAdd}
                                    />
                                    <View style={{ position: "absolute", right: 16, top: 5 }}>
                                        <View className="flex flex-row">
                                            <TouchableOpacity
                                                onPress={() => handleUnitSelect("ml")}
                                                className={`p-3 border border-primaryBlue rounded-l-lg`}
                                                style={{ backgroundColor: selectedUnit === "ml" ? theme.primaryLighBlue : theme.background }}
                                            >
                                                <Text
                                                    className={`font-raleway text-[12px]`}
                                                    style={{ color: selectedUnit === "ml" ? '#fff' : theme.textColor }}
                                                >
                                                    ml
                                                </Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                onPress={() => handleUnitSelect("oz")}
                                                className={`p-3 border border-primaryBlue rounded-r-lg`}
                                                style={{ backgroundColor: selectedUnit === "oz" ? theme.primaryLighBlue : theme.background }}
                                            >
                                                <Text
                                                    className={`font-raleway text-[12px]`}
                                                    style={{ color: selectedUnit === "oz" ? '#fff' : theme.textColor }}
                                                >
                                                    oz
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                    </View>

                    <View
                        className={`flex-[1.5] w-full ${isGlassSelected && "bg-[#4975d1]"}`}
                    >
                        <View className="flex flex-row space-x-2 justify-center items-center">
                            <View
                                className={`h-2 w-2 rounded-full ${activeSlide === 0 ? "bg-primaryBlue" : "bg-gray-300"
                                    }`}
                            />
                            <View
                                className={`h-2 w-2 rounded-full ${activeSlide === 1 ? "bg-primaryBlue" : "bg-gray-300"
                                    }`}
                            />
                        </View>

                        <View className="items-center pt-3">
                            <Text
                                className={`font-raleway text-[14px] ${isGlassSelected && "text-gray-100"
                                    }`}
                                style={{ color: isGlassSelected ? '#f5f5f5' : theme.textColor }}
                            >
                                {instructions[activeSlide]}
                            </Text>
                            <Text className={`font-raleway text-[12px] mt-1 ${isGlassSelected ? "text-gray-100" : ""}`}
                                style={{ color: isGlassSelected ? '#f5f5f5' : theme.textColor }}
                            >
                                {`${consumedMl} ml (${ozFromMl(consumedMl)} oz) / ${goalMl} ml`}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default AddWater;

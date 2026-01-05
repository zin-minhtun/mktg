import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";
import { styled } from "nativewind";
import axios from "axios";
import { Slider } from "@miblanchard/react-native-slider";

import Sleep from "./svg/Sleep";
import SleepyEmoji from "./svg/SleepyEmoji";
import HappyEmoji from "./svg/HappyEmoji";
import DistruptedSleepMenu from "./DistruptedSleepMenu";
import UnDistruptedSleepMenu from "./UnDistruptedSleepMenu";
import AudioInputIcon from "../../Icons/AudioInputIcon";
import CheckIcon from "../../Icons/CheckIcon";
import CrossIcon from "../../Icons/CrossIcon";

import { useUserData } from "../../../Contexts/UserContext";
import { useTheme } from "../../../Contexts/ThemeContext";
import { API_URL } from "@env";

const StyledTextInput = styled(TextInput);
const SLEEP_API_URL = `${API_URL}/api/dailyLog/sleep`;


const RadioButton = ({ value, status, onPress, textColor }) => (
    <TouchableOpacity
        onPress={onPress}
        style={{ flexDirection: "row", alignItems: "center" }}
    >
        <View
            style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: status === "checked" ? "#00b8df" : "#D1D5DB",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            {status === "checked" && (
                <View
                    style={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: "#00b8df",
                    }}
                />
            )}
        </View>

        <Text className="ml-2 font-raleway text-[14px]" style={{ color: textColor }}>
            {value}
        </Text>
    </TouchableOpacity>
);


const SleepDuration = ({ navigation }) => {

    const [hours, setHours] = useState(0);
    const [sleepType, setSleepType] = useState("less");
    const [sleepHours, setSleepHours] = useState("0");
    const [sleepQuality, setSleepQuality] = useState("");
    const [sleepNotes, setSleepNotes] = useState("");
    const [disruptedFactors, setDisruptedFactors] = useState([]);
    const [undisruptedFactors, setUndisruptedFactors] = useState([]);

    const { gUser } = useUserData();
    const { theme } = useTheme();
    const route = useRoute();

    const returnScreen = route.params?.returnScreen;

    const { sleepLog, selectedDate, dailyLogId } = route.params;
    const paddingBottomValue = sleepLog ? 40 : 150;
    const THUMB_OFFSET = 9;


    useEffect(() => {
        if (!sleepLog) return;

        if (sleepLog.sleepType) {
            setSleepType(sleepLog.sleepType);
        }

        if (sleepLog.sleepHours !== undefined && sleepLog.sleepHours !== null) {
            const hoursValue = Number(sleepLog.sleepHours);
            setSleepHours(sleepLog.sleepHours);
            setHours(hoursValue);
        }

        if (sleepLog.sleepQuality) {
            setSleepQuality(sleepLog.sleepQuality);
        }

        if (sleepLog.sleepQuality === "disrupted") {
            const factors = sleepLog.factors ?? [];
            setDisruptedFactors(factors.length === 0 ? ["none"] : factors);
        } else if (sleepLog.sleepQuality === "undisrupted") {
            const factors = sleepLog.factors ?? [];
            setUndisruptedFactors(factors.length === 0 ? ["none"] : factors);
        }

        if (sleepLog.sleepNotes) {
            setSleepNotes(sleepLog.sleepNotes);
        }
    }, [sleepLog]);


    const handleSelectSleepType = (option) => setSleepType(option);

    const handleDisruptedItems = (items) => setDisruptedFactors(items);
    const handleUndisruptedItems = (items) => setUndisruptedFactors(items);

    const handleSelectHours = (value) => {
        setHours(value[0]);
        setSleepHours(value[0].toString());
    };

    const handleSelectSleepQuality = (option) => {
        const newQuality = sleepQuality === option ? null : option;
        setSleepQuality(newQuality);
        
        if (newQuality === "disrupted") {
            setUndisruptedFactors([]);
        } else if (newQuality === "undisrupted") {
            setDisruptedFactors([]);
        }
    };


    const addOrUpdateSleepLog = async (isUpdate = false) => {
        let updatedFactors = [];

        if (sleepQuality === "disrupted") {
            updatedFactors = disruptedFactors.filter(factor => factor.toLowerCase() !== "none");
        } else if (sleepQuality === "undisrupted") {
            updatedFactors = undisruptedFactors.filter(factor => factor.toLowerCase() !== "none");
        }
        
        try {
            const sleepData = {
                userId: gUser._id,
                date: selectedDate,
                sleep: {
                    sleepHours,
                    sleepType,
                    sleepQuality,
                    factors: updatedFactors,
                    sleepNotes,
                },
            };

            const url = isUpdate
                ? `${SLEEP_API_URL}/update/${dailyLogId}/${sleepLog._id}`
                : `${SLEEP_API_URL}/add`;

            const response = await axios({
                method: isUpdate ? "put" : "post",
                url,
                data: sleepData,
                headers: { "Content-Type": "application/json" },
            });

            if (response.status === 200 || response.status === 201) {
                navigation.navigate("Journal", {
                    screen: "JournalV1",
                    params: { activeNavItem: "sleep" },
                });
            }
        } catch (err) {
            console.error("Error sending sleep entry:", err.message);
        }
    };

    const handleCreate = () => addOrUpdateSleepLog(false);
    const handleUpdate = () => addOrUpdateSleepLog(true);

    return (
        <View className="flex-1 mt-6 px-4" style={{ backgroundColor: theme.background }}>
            <SafeAreaView>
                <View className="mt-6">
                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1, paddingBottom: paddingBottomValue }}
                        showsVerticalScrollIndicator={false}
                    >

                        <View className="mt-8 mb-10 items-center">
                            <Sleep />
                        </View>

                        <Text className="text-[24px] font-ralewayBold" style={{ color: theme.textColor }}>
                            How did you sleep?
                        </Text>

                        <View className="flex flex-row justify-between space-x-3.5 mt-4">
                            <TouchableOpacity
                                style={{
                                    backgroundColor: sleepType === "less" ? "#EBFCFF" : theme.textFieldBG,
                                    borderColor: theme.borderColor,
                                }}
                                className="flex flex-row flex-1 items-center border rounded-lg p-3"
                                onPress={() => handleSelectSleepType("less")}
                            >
                                <SleepyEmoji />
                                <Text
                                    className={`text-[16px] pl-3 ${sleepType === "less"
                                            ? "font-ralewayBold"
                                            : "font-raleway"
                                        }`}
                                    style={{
                                        color: sleepType === "less"
                                            ? theme.primaryLighBlue
                                            : theme.textColor,
                                    }}
                                >
                                    Slept less{"\n"}than usual
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{
                                    backgroundColor: sleepType === "more" ? "#EBFCFF" : theme.textFieldBG,
                                    borderColor: theme.borderColor,
                                }}
                                className="flex flex-row flex-1 items-center border rounded-lg p-3"
                                onPress={() => handleSelectSleepType("more")}
                            >
                                <HappyEmoji />
                                <Text
                                    className={`text-[16px] pl-3 ${sleepType === "more"
                                            ? "font-ralewayBold"
                                            : "font-raleway"
                                        }`}
                                    style={{
                                        color: sleepType === "more"
                                            ? theme.primaryLighBlue
                                            : theme.textColor,
                                    }}
                                >
                                    Slept more{"\n"}than usual
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View className="mt-8">
                            <Text
                                className="mb-3 font-ralewaySemiBold text-[16px]"
                                style={{ color: theme.textColor }}
                            >
                                Hours of sleep
                            </Text>
                        </View>

                        <View className="mt-2">
                            <View
                                className="flex flex-row justify-between w-full pb-0"
                                style={{ paddingHorizontal: THUMB_OFFSET }}
                            >
                                {[0, 1, 2, 3, 4, 5, 6, 7].map((level) => (
                                    <Text
                                        key={level}
                                        className={`text-[14px] ${hours === level
                                                ? "font-ralewaySemiBold text-primaryDarkBlue"
                                                : "text-[#939598]"
                                            }`}
                                    >
                                        {level}
                                    </Text>
                                ))}
                            </View>

                            <Slider
                                value={hours}
                                onValueChange={handleSelectHours}
                                minimumValue={0}
                                maximumValue={7}
                                step={1}
                                minimumTrackTintColor="#00b8df"
                                maximumTrackTintColor="#E5E7EB"
                                thumbStyle={{
                                    height: 26,
                                    width: 26,
                                    borderRadius: 10,
                                    backgroundColor: "#009FC0",
                                }}
                                trackStyle={{
                                    height: 10,
                                    borderRadius: 5,
                                    marginHorizontal: THUMB_OFFSET,
                                }}
                            />
                        </View>

                        <View className="mt-8">
                            <Text
                                className="mb-4 font-ralewaySemiBold text-[16px]"
                                style={{ color: theme.textColor }}
                            >
                                Sleep Quality
                            </Text>

                            <View className="flex flex-row items-center">
                                <RadioButton
                                    value="Disrupted Sleep"
                                    textColor={theme.textColor}
                                    status={sleepQuality === "disrupted" ? "checked" : "unchecked"}
                                    onPress={() => handleSelectSleepQuality("disrupted")}
                                />

                                <View className="ml-11">
                                    <RadioButton
                                        value="Undisrupted Sleep"
                                        textColor={theme.textColor}
                                        status={sleepQuality === "undisrupted" ? "checked" : "unchecked"}
                                        onPress={() => handleSelectSleepQuality("undisrupted")}
                                    />
                                </View>
                            </View>

                            {sleepQuality === "disrupted" && (
                                <DistruptedSleepMenu
                                    sleepFactors={disruptedFactors}
                                    onCheckedChange={handleDisruptedItems}
                                />
                            )}

                            {sleepQuality === "undisrupted" && (
                                <UnDistruptedSleepMenu
                                    sleepFactors={undisruptedFactors}
                                    onCheckedChange={handleUndisruptedItems}
                                />
                            )}
                        </View>

                        <View className="mt-10">
                            <Text
                                className="font-ralewaySemiBold mb-3 text-[16px]"
                                style={{ color: theme.textColor }}
                            >
                                Others
                            </Text>

                            <StyledTextInput
                                multiline
                                value={sleepNotes}
                                onChangeText={setSleepNotes}
                                placeholder="Add notes"
                                placeholderTextColor={theme.borderColor}
                                className="font-raleway text-[16px] h-[84px] p-3 border rounded-lg"
                                style={{
                                    backgroundColor: theme.textFieldBG,
                                    color: theme.textColor,
                                    borderColor: theme.borderColor,
                                    textAlignVertical: "top",
                                }}
                            />
                        </View>

                        <View className="flex-row justify-end mt-3">
                            <View className="justify-center items-center mr-6 bg-primaryBlue rounded-full w-10 h-10">
                                <AudioInputIcon />
                            </View>

                            <TouchableOpacity
                                onPress={() => setSleepNotes("")}
                                disabled={sleepNotes.length === 0}
                                className={`justify-center items-center mr-3 rounded-full w-10 h-10 ${
                                    sleepNotes.length > 0 ? "bg-[#FDA29B80]" : "bg-[#E0E0E0]"
                                }`}
                            >
                                <CrossIcon isActive={sleepNotes.length > 0} />
                            </TouchableOpacity>

                            <View
                                className={`justify-center items-center rounded-full w-10 h-10 ${
                                    sleepNotes.length > 0 ? "bg-primaryBlue" : "bg-[#E0E0E0]"
                                }`}
                            >
                                <CheckIcon isActive={sleepNotes.length > 0} />
                            </View>
                        </View>

                        {sleepLog ? (
                            <View className="mt-8 flex flex-row justify-between">
                                <TouchableOpacity
                                    onPress={() => navigation.goBack()}
                                    style={{ borderColor: theme.primaryLighBlue }}
                                    className="w-[45%] h-[50px] rounded-[33px] border-[1.5px] justify-center"
                                >
                                    <Text
                                        className="text-center font-ralewaySemiBold text-[16px]"
                                        style={{ color: theme.primaryLighBlue }}
                                    >
                                        Cancel
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={handleUpdate}
                                    style={{ backgroundColor: theme.primaryLighBlue }}
                                    className="w-[45%] h-[50px] rounded-[33px] justify-center"
                                >
                                    <Text
                                        className="text-center font-ralewaySemiBold text-[16px]"
                                        style={{ color: "#FFFFFF" }}
                                    >
                                        Update
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View className="mt-8">
                                <TouchableOpacity
                                    style={{ backgroundColor: theme.primaryLighBlue }}
                                    className="w-full py-4 rounded-full"
                                    onPress={handleCreate}
                                >
                                    <Text
                                        className="text-center font-ralewaySemiBold text-[16px]"
                                        style={{ color: "#FFFFFF" }}
                                    >
                                        Save
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}

                    </ScrollView>
                </View>
            </SafeAreaView>
        </View>
    );
};

export default SleepDuration;
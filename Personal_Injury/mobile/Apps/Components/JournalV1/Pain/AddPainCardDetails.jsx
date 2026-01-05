import {
    ScrollView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import HeadMenuItems from "./HeadMenuItems";
import UpperBodyMenuItems from "./UpperBodyMenuItems";
import LowerBodyMenuItems from "./LowerBodyMenuItems";
import PainTypeMenuItems from "./PainTypeMenuItems";
import { Slider } from "@miblanchard/react-native-slider";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../Contexts/ThemeContext";

const AddPainCardDetails = ({ navigation, route }) => {
    const { theme } = useTheme();
    const { painRecord, selectedDate } = route.params || {};
    const isEditing = !!painRecord;

    const [painName, setPainName] = useState("");
    const [painLocation, setPainLocation] = useState([]);
    const [painType, setPainType] = useState([]);
    const [intensity, setIntensity] = useState(0);

    useEffect(() => {
        if (painRecord) {
            setPainName(painRecord.painName || "");
            setPainLocation(Array.isArray(painRecord.painLocation) ? painRecord.painLocation : []);
            setPainType(Array.isArray(painRecord.painType) ? painRecord.painType : []);
            setIntensity(painRecord.intensity || 0);
        }
    }, [painRecord]);

    const THUMB_OFFSET = 9;

    const handlePress = () => {
        if (!isFormValid) return;

        navigation.push("JournalNavigator", {
            screen: "AddAdditionalInfo",
            params: {
                painData: {
                    painName: painName.trim(),
                    painLocation,
                    painType,
                    intensity,
                },
                painRecord: isEditing ? painRecord : null,
                selectedDate,
            }
        });
    };

    const isFormValid =
        painName.trim().length > 0 &&
        painLocation.length > 0 &&
        painType.length > 0 &&
        intensity > 0;

    return (
        <View className="flex-1 mt-6" style={{ backgroundColor: theme.background }}>
            <SafeAreaView edges={['top', 'left', 'right', 'bottom']}>

                <ScrollView
                    contentContainerStyle={{ paddingBottom: 10 }}
                    showsVerticalScrollIndicator={false}
                    className="px-5"
                >
                    <View className="mt-8">
                        <Text className="mb-3 font-ralewaySemiBold text-[16px]" style={{ color: theme.primaryDarkBlue || '#003B5C' }}>
                            Pain Name
                        </Text>
                        <TextInput
                            className="font-raleway text-[#939598] h-[50px] border rounded-lg p-2 px-5"
                            placeholder="Pain Name"
                            placeholderTextColor={theme.darkGrey}
                            value={painName}
                            onChangeText={setPainName}
                            style={{
                                backgroundColor: theme.textFieldBG,
                                borderColor: theme.borderColor,
                                color: theme.textColor
                            }}
                        />
                    </View>

                    <View className="mt-8">
                        <Text className="mb-3 font-ralewaySemiBold text-[16px]" style={{ color: theme.primaryDarkBlue || '#003B5C' }}>
                            Select Pain Location
                        </Text>
                        <View className="px-5 border rounded-lg" style={{ backgroundColor: theme.textFieldBG, borderColor: theme.borderColor }}>
                            <HeadMenuItems
                                painLocation={painLocation}
                                setPainLocation={setPainLocation}
                            />
                            <UpperBodyMenuItems
                                painLocation={painLocation}
                                setPainLocation={setPainLocation}
                            />
                            <LowerBodyMenuItems
                                painLocation={painLocation}
                                setPainLocation={setPainLocation}
                            />
                        </View>
                    </View>

                    <View className="mt-8">
                        <Text className="mb-3 font-ralewaySemiBold text-[16px]" style={{ color: theme.primaryDarkBlue || '#003B5C' }}>
                            Select Pain Type
                        </Text>
                        <PainTypeMenuItems
                            painType={painType}
                            setPainType={setPainType}
                        />
                    </View>

                    <View className="mt-8">
                        <Text className="mb-5 font-ralewaySemiBold text-[16px]" style={{ color: theme.primaryDarkBlue || '#003B5C' }}>
                            Select Intensity (Level 0 - 5)
                        </Text>

                            <View
                                className="flex flex-row justify-between w-full pb-0"
                                style={{ paddingHorizontal: THUMB_OFFSET }}
                            >
                                {[0, 1, 2, 3, 4, 5].map((level) => (
                                    <Text
                                        key={level}
                                        className={`text-[14px] ${intensity === level
                                                ? "font-ralewaySemiBold text-primaryDarkBlue"
                                                : "text-[#939598]"
                                            }`}
                                    >
                                        {level}
                                    </Text>
                                ))}
                            </View>

                        <Slider
                            value={intensity}
                            onValueChange={(value) => setIntensity(value[0])}
                            minimumValue={0}
                            maximumValue={5}
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
                </ScrollView>

                <View className="px-5 pb-6 pt-4" style={{ backgroundColor: theme.background }}>
                    <TouchableOpacity
                        className={`w-full py-4 rounded-full ${isFormValid ? "bg-primaryBlue" : "bg-gray-300"}`}
                        onPress={handlePress}
                        disabled={!isFormValid}
                    >
                        <Text className="text-center text-white font-ralewaySemiBold text-[16px]">
                            Next
                        </Text>
                    </TouchableOpacity>
                </View>

            </SafeAreaView>
        </View>
    );
};

export default AddPainCardDetails;
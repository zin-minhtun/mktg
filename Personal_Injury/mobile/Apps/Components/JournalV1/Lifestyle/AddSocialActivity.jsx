import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import { useTheme } from "../../../Contexts/ThemeContext";
import LowStimulationImg from "./svg/LowStimulationImg";
import MidStimulationImg from "./svg/MidStimulationImg";
import HighStimulationImg from "./svg/HighStimulationImg";
import LowStimulation from "./LowStimulation";
import MidStimulation from "./MidStimulation";
import HighStimulation from "./HighStimulation";

const TypeOfSocialActivities = [
    {
        id: "lowStimulation",
        name: "Low Stimulation",
        image: <LowStimulationImg />,
        color: "#BBCCED",
        content: <LowStimulation />,
    },
    {
        id: "midStimulation",
        name: "Mid Stimulation",
        image: <MidStimulationImg />,
        color: "#AAA8FF",
        content: <MidStimulation />,
    },
    {
        id: "highStimulation",
        name: "High Stimulation",
        image: <HighStimulationImg />,
        color: "#FFDB94",
        content: <HighStimulation />,
    },
];

const AddSocialActivity = ({ route, navigation }) => {
    const { theme } = useTheme();
    const [selectedSocialActivity, setSelectedSocialActivity] = useState(
        TypeOfSocialActivities[0]?.id
    );
    const { editMode, prefill, selectedDate } = route.params || {};

    useEffect(() => {
        if (editMode && prefill && prefill.stimulation) {
            const map = {
                "Low": "lowStimulation",
                "Mid": "midStimulation",
                "High": "highStimulation"
            };
            const mappedId = map[prefill.stimulation] || "lowStimulation";
            setSelectedSocialActivity(mappedId);
        }
    }, [editMode, prefill]);

    const handleExerciseSelect = (id) => {
        setSelectedSocialActivity(id);
    };

    // Get the currently selected social activity object
    const currentSocialActivity = TypeOfSocialActivities.find(
        (socialActivity) => socialActivity.id === selectedSocialActivity
    );

    const renderContent = () => {
        if (!currentSocialActivity) return null;

        // Pass prefill only if matching tab
        let props = {};
        if (editMode && prefill) {
            const map = {
                "Low": "lowStimulation",
                "Mid": "midStimulation",
                "High": "highStimulation"
            };
            if (map[prefill.stimulation] === selectedSocialActivity) {
                props = { editMode, prefill };
            }
        }
        props.selectedDate = selectedDate;
        return React.cloneElement(currentSocialActivity.content, props);
    };

    return (
        <SafeAreaView className="flex-1" style={{ backgroundColor: theme.background }}>
            <ScrollView
                contentContainerStyle={{ paddingBottom: 120, paddingHorizontal: 20, paddingTop: 32 }}
                showsVerticalScrollIndicator={false}
            >
                <View>
                    <View className="flex flex-row items-center justify-between mt-5">
                        {TypeOfSocialActivities.map((socialActivity) => {
                            const isSelected = selectedSocialActivity === socialActivity.id;
                            return (
                                <View className="items-center w-28 mb-2" key={socialActivity.id}>
                                    <TouchableOpacity
                                        onPress={() => handleExerciseSelect(socialActivity.id)}
                                        className={`rounded-full w-24 h-24 justify-center items-center border-2 ${isSelected ? "border-primaryDarkBlue" : "border-transparent"
                                            }`}
                                        style={{ backgroundColor: socialActivity.color }}
                                        activeOpacity={0.8}
                                    >
                                        <View className="flex justify-center items-center h-full">
                                            {socialActivity.image}
                                        </View>
                                    </TouchableOpacity>
                                    <Text
                                        className={`font-raleway font-semibold text-[14px] pt-3 text-center`}
                                        style={{ color: isSelected ? theme.primaryDarkBlue : theme.darkGrey }}
                                    >
                                        {socialActivity.name}
                                    </Text>
                                </View>
                            );
                        })}
                    </View>
                    {/* Dynamically render content based on the selected social activity */}
                    <View className="mt-6">
                        {renderContent()}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default AddSocialActivity;

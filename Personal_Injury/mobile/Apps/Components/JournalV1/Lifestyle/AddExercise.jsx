import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import { useTheme } from "../../../Contexts/ThemeContext";
import LowIntensityImg from "./svg/LowIntensityImg";
import MidIntensityImg from "./svg/MidIntensityImg";
import HighIntensityImg from "./svg/HighIntensityImg";
import LowIntensity from "./LowIntensity";
import MidIntensity from "./MidIntensity";
import HighIntensity from "./HighIntensity";

const TypeOfExercises = [
    {
        id: "lowIntensity",
        name: "Low intensity",
        image: <LowIntensityImg />,
        color: "#BBCCED",
        content: <LowIntensity />,
    },
    {
        id: "midIntensity",
        name: "Mid intensity",
        image: <MidIntensityImg />,
        color: "#AAA8FF",
        content: <MidIntensity />,
    },
    {
        id: "highIntensity",
        name: "High intensity",
        image: <HighIntensityImg />,
        color: "#FFDB94",
        content: <HighIntensity />,
    },
];

const AddExercise = ({ route, navigation }) => {
    const { theme } = useTheme();
    const [selectedExercise, setSelectedExercise] = useState(
        TypeOfExercises[0]?.id
    );
    const { editMode, prefill, selectedDate } = route.params || {};

    useEffect(() => {
        if (editMode && prefill && prefill.intensity) {
            // Map backend intensity string to ID
            const map = {
                "Low": "lowIntensity",
                "Mid": "midIntensity",
                "High": "highIntensity"
            };
            const mappedId = map[prefill.intensity] || "lowIntensity";
            setSelectedExercise(mappedId);
        }
    }, [editMode, prefill]);

    const handleExerciseSelect = (id) => {
        setSelectedExercise(id);
    };

    // Get the currently selected exercise object
    const currentExercise = TypeOfExercises.find(
        (exercise) => exercise.id === selectedExercise
    );

    // Pass editMode and prefill to child component if it matches the intensity
    const renderContent = () => {
        if (!currentExercise) return null;

        // Only pass prefill if the selected tab matches the prefilled intensity
        let props = {};
        if (editMode && prefill) {
            const map = {
                "Low": "lowIntensity",
                "Mid": "midIntensity",
                "High": "highIntensity"
            };
            if (map[prefill.intensity] === selectedExercise) {
                props = { editMode, prefill };
            }
        }

        // Always pass selectedDate
        props.selectedDate = selectedDate;

        // We need to clone the element to pass props
        return React.cloneElement(currentExercise.content, props);
    };

    return (
        <SafeAreaView className="flex-1" style={{ backgroundColor: theme.background }}>
            <ScrollView
                contentContainerStyle={{ paddingBottom: 120, paddingHorizontal: 20, paddingTop: 32 }}
                showsVerticalScrollIndicator={false}
            >
                <View>
                    <View className="flex flex-row justify-between mt-5">
                        {TypeOfExercises.map((exercise) => {
                            const isSelected = selectedExercise === exercise.id;
                            return (
                                <View className="items-center w-28 mb-2" key={exercise.id}>
                                    <TouchableOpacity
                                        onPress={() => handleExerciseSelect(exercise.id)}
                                        className={`rounded-full w-24 h-24 justify-center items-center border-2 ${isSelected ? "border-primaryDarkBlue" : "border-transparent"
                                            }`}
                                        style={{ backgroundColor: exercise.color }}
                                        activeOpacity={0.8}
                                    >
                                        <View className="flex justify-center items-center h-full">
                                            {exercise.image}
                                        </View>
                                    </TouchableOpacity>
                                    <Text
                                        className={`font-raleway font-semibold text-[14px] pt-3 text-center`}
                                        style={{ color: isSelected ? theme.primaryDarkBlue : theme.darkGrey }}
                                    >
                                        {exercise.name}
                                    </Text>
                                </View>
                            );
                        })}
                    </View>

                    {/* Dynamically render content */}
                    <View className="mt-6">
                        {renderContent()}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default AddExercise;

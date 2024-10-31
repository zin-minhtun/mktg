import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
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

const Exercise = () => {
	const [selectedExercise, setSelectedExercise] = useState(
		TypeOfExercises[0]?.id
	);

	const handleExerciseSelect = (id) => {
		setSelectedExercise(id); // Always set the selected exercise
	};

	// Get the currently selected exercise object
	const currentExercise = TypeOfExercises.find(
		(exercise) => exercise.id === selectedExercise
	);

	return (
		<View className="flex-1 bg-[#FAFBFC] mt-6">
			<View className="pt-8 flex flex-row justify-center mt-3">
				{TypeOfExercises.map((exercise) => (
					<View className="items-center w-28 mb-4 mx-2" key={exercise.id}>
						<TouchableOpacity
							onPress={() => handleExerciseSelect(exercise.id)}
							className="rounded-full w-24 h-24 justify-center items-center"
							style={{ backgroundColor: exercise.color }}
						>
							<View className="flex justify-center items-center h-full">
								{exercise.image}
							</View>
						</TouchableOpacity>
						<Text
							className={`font-raleway font-semibold text-[14px] pt-3 text-center ${
								selectedExercise === exercise.id
									? "text-primaryDarkBlue"
									: "text-gray-400"
							}`}
						>
							{exercise.name}
						</Text>
					</View>
				))}
			</View>

			{/* Dynamically render content based on the selected exercise */}
			{currentExercise && (
				<View className="flex-1 mt-6 px-4">{currentExercise.content}</View>
			)}
		</View>
	);
};

export default Exercise;

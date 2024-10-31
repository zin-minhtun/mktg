import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import LowIntensityImg from "./svg/LowIntensityImg";
import MidIntensityImg from "./svg/MidIntensityImg";
import HighIntensityImg from "./svg/HighIntensityImg";
import LowStimulation from "./LowStimulation";
import MidStimulation from "./MidStimulation";
import HighStimulation from "./HighStimulation";
import LowStimulationImg from "./svg/LowStimulationImg";
import MidStimulationImg from "./svg/MidStimulationImg";
import HighStimulationImg from "./svg/HighStimulationImg";

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

const SocialActivity = () => {
	const [selectedSocialActivity, setSelectedSocialActivity] = useState(
		TypeOfSocialActivities[0]?.id
	);

	const handleExerciseSelect = (id) => {
		setSelectedSocialActivity(id); // Always set the selected social activity
	};

	// Get the currently selected social activity object
	const currentSocialActivity = TypeOfSocialActivities.find(
		(socialActivity) => socialActivity.id === selectedSocialActivity
	);

	return (
		<View className="flex-1 bg-[#FAFBFC] mt-6">
			<View className="pt-8 flex flex-row justify-center mt-3">
				{TypeOfSocialActivities.map((socialActivity) => (
					<View className="items-center w-28 mb-4 mx-2" key={socialActivity.id}>
						<TouchableOpacity
							onPress={() => handleExerciseSelect(socialActivity.id)}
							className="rounded-full w-24 h-24 justify-center items-center"
							style={{ backgroundColor: socialActivity.color }}
						>
							<View className="flex justify-center items-center h-full">
								{socialActivity.image}
							</View>
						</TouchableOpacity>
						<Text
							className={`font-raleway font-semibold text-[14px] pt-3 text-center ${
								selectedSocialActivity === socialActivity.id
									? "text-primaryDarkBlue"
									: "text-gray-400"
							}`}
						>
							{socialActivity.name}
						</Text>
					</View>
				))}
			</View>

			{/* Dynamically render content based on the selected social activity */}
			{currentSocialActivity && (
				<View className="flex-1 mt-6 px-4">{currentSocialActivity.content}</View>
			)}
		</View>
	);
};

export default SocialActivity;

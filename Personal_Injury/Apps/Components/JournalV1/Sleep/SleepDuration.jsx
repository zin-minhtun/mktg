import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useState } from "react";
import { styled } from "nativewind";
import Sleep from "./svg/Sleep";
import SleepyEmoji from "./svg/SleepyEmoji";
import HappyEmoji from "./svg/HappyEmoji";
import DistruptedSleepMenu from "./DistruptedSleepMenu";
import UnDistruptedSleepMenu from "./UnDistruptedSleepMenu";

// Custom RadioButton component
const RadioButton = ({ value, status, onPress }) => (
	<TouchableOpacity
		onPress={onPress}
		style={{ flexDirection: "row", alignItems: "center" }}
	>
		<View
			style={{
				width: 23,
				height: 23,
				borderRadius: 13,
				borderWidth: 2,
				borderColor: "#00b8df",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			{status === "checked" && (
				<View
					style={{
						width: 12,
						height: 12,
						borderRadius: 6,
						backgroundColor: "#00b8df",
					}}
				/>
			)}
		</View>
		<Text style={{ marginLeft: 8 }}>{value}</Text>
	</TouchableOpacity>
);

const SleepDuration = ({ navigation }) => {
	// State to track the selected option, defaulting to "less"
	const [selectedOption, setSelectedOption] = useState("less");
	const [selectedLevel, setSelectedLevel] = useState(7); // State to track hours of sleep
	const levels = [0, 1, 2, 3, 4, 5, 6, 7, 8, ">"]; // Hours of sleep
	const [selectedSleepType, setSelectedSleepType] = useState(null);

	// Function to handle selection
	const handleSelect = (level) => {
		setSelectedLevel(level);
	};

	// Function to handle selecting an option
	const handleSelectOption = (option) => {
		setSelectedOption(option); // Set the selected option
	};

	return (
		<View className="flex-1 bg-[#FAFBFC] mt-6 px-4">
			<ScrollView
				contentContainerStyle={{ flexGrow: 1, paddingBottom: 150 }}
				showsVerticalScrollIndicator={false}
			>
				<View className="mt-8 mb-10 items-center">
					<Sleep />
				</View>
				<Text className="text-[24px] font-ralewayBold text-primaryDarkBlue">
					How did you sleep last night?
				</Text>
				<View className="flex flex-row justify-between space-x-3.5 mt-4">
					{/* Option 1: Slept less than usual */}
					<TouchableOpacity
						className={`flex flex-row flex-[1] items-center border ${
							selectedOption === "less"
								? "border-primaryBlue bg-[#E5F6FB]"
								: "border-[#EDECF4] bg-white"
						} rounded-lg p-3`}
						onPress={() => handleSelectOption("less")}
					>
						<SleepyEmoji />
						<Text className="text-[16px] pl-3 font-raleway text-gray-500">
							Slept less{"\n"}than usual
						</Text>
					</TouchableOpacity>

					{/* Option 2: Slept more than usual */}
					<TouchableOpacity
						className={`flex flex-row flex-[1] items-center border ${
							selectedOption === "more"
								? "border-primaryBlue bg-[#E5F6FB]"
								: "border-[#EDECF4] bg-white"
						} rounded-lg p-3`}
						onPress={() => handleSelectOption("more")}
					>
						<HappyEmoji />
						<Text className="text-[16px] pl-3 font-raleway text-gray-500">
							Slept more{"\n"}than usual
						</Text>
					</TouchableOpacity>
				</View>

				<View className="mt-8">
					<Text className="mb-3 font-ralewaySemiBold text-primaryDarkBlue text-[16px]">
						Hours of sleep
					</Text>
					<View className="flex flex-row justify-between mt-3">
						{/* Loop through levels 0-5 to render Touchable elements for numbers */}
						{levels.map((level) => (
							<TouchableOpacity key={level} onPress={() => handleSelect(level)}>
								{/* <View className="bg-red-200 px-3 pb-3"></View> */}
								<Text
									className={`font-raleway pb-2 text-[14px] text-[#939598] ${
										selectedLevel === level ? "font-bold" : ""
									}`}
								>
									{level}
								</Text>
							</TouchableOpacity>
						))}
					</View>

					{/* Touchable progress bar */}
					<View className="relative h-[12px] bg-gray-200 rounded-full">
						<View
							className="absolute top-0 left-0 h-full bg-[#00b8df] rounded-full"
							style={{ width: `${(selectedLevel / 9) * 100}%` }}
						/>
					</View>
				</View>

				<View className="mt-8">
					<Text className="mb-3 font-ralewaySemiBold text-primaryDarkBlue text-[16px]">
						Sleep Quality
					</Text>
					<View className="flex flex-row mt-2">
						<View className="mr-3 flex flex-row mb-4">
							<RadioButton
								status={
									selectedSleepType === "disrupted" ? "checked" : "unchecked"
								}
								onPress={() => setSelectedSleepType("disrupted")}
							/>
							<Text className="font-raleway text-gray-500 text-[16px]">
								Disrupted Sleep
							</Text>
						</View>
						<View className="mr-3 flex flex-row mb-4">
							<RadioButton
								status={
									selectedSleepType === "undisrupted" ? "checked" : "unchecked"
								}
								onPress={() => setSelectedSleepType("undisrupted")}
							/>
							<Text className="font-raleway text-gray-500 text-[16px]">
								Undisrupted Sleep
							</Text>
						</View>
					</View>
					{/* Conditionally render the box (sleep type) with title */}
					{selectedSleepType === "disrupted" && <DistruptedSleepMenu />}
					{selectedSleepType === "undisrupted" && <UnDistruptedSleepMenu />}
				</View>

				<View className="absolute bottom-10 left-0 right-0">
					<TouchableOpacity
						className="w-full bg-primaryBlue py-4 rounded-full"
						onPress={() => {
							console.log("Selected Option: ", selectedOption);
							// Proceed to the next screen or logic
						}}
					>
						<Text className="text-center text-white font-ralewaySemiBold text-[16px]">
							Next
						</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</View>
	);
};

export default SleepDuration;

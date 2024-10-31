import React, { useState } from "react";
import { View, Text } from "react-native";
import Checkbox from "expo-checkbox";

const DailyFreqMenu = () => {
	const [checkedItems, setCheckedItems] = useState({});

	// Options array with labels containing spaces
	const options = [
		{ value: "evening", label: "Evening" },
		{ value: "morning", label: "Morning" },
		{ value: "beforeBreakfast", label: "Before breakfast" },
		{ value: "1hr30minsBeforeLunch", label: "1 hour/30 mins before lunch" },
		{ value: "beforeLunch", label: "Before lunch" },
		{ value: "afterLunch", label: "After lunch" },
		{ value: "beforeDinner", label: "Before dinner" },
		{ value: "afterDinner", label: "After dinner" },
		{ value: "1hr30minsBeforeBedTime", label: "1 hour/30 mins before bed time" },
		{ value: "bedTime", label: "bed time" },
		{ value: "after4hrs", label: "After 4 hrs" },
		{ value: "after6hrs", label: "After 6 hrs" },
		{ value: "after12hrs", label: "After 12 hrs" },
		{ value: "after24hrs", label: "After 24 hrs" },
	];

	const handleCheckboxChange = (option) => {
		setCheckedItems((prev) => ({
			...prev,
			[option]: !prev[option], // Toggle the current option
		}));
	};

	return (
		<View className="p-4 bg-white space-y-3">
			{options.map((option, index) => (
				<View
					key={index}
					className="flex-row justify-between items-center mb-2"
				>
					<Text className="ml-2 font-raleway text-gray-500 text-[16px]">
						{option.label}
					</Text>
					<Checkbox
						className="border-2 border-primaryBlue"
						value={checkedItems[option.value]}
						onValueChange={() => handleCheckboxChange(option.value)} // Use value from the object
						color={checkedItems[option.value] ? "#00b8df" : undefined} // Tailwind blue
					/>
				</View>
			))}
		</View>
	);
};

export default DailyFreqMenu;

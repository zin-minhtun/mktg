import React, { useState } from "react";
import { View, Text } from "react-native";
import Checkbox from "expo-checkbox";

const WeeklyFreqMenu = () => {
	const [checkedItems, setCheckedItems] = useState({});

	// Options array with labels containing spaces
	const options = [
		{ value: "weeklyOnce", label: "Weekly Once" },
		{ value: "weeklyTwice", label: "Weekly Twice" },
		{ value: "weeklyThrice", label: "Weekly Thrice" },
		{ value: "everyAlternateDay", label: "Every alternate day" },
		{ value: "afterEvery4Days", label: "After Every 4 days" },
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

export default WeeklyFreqMenu;

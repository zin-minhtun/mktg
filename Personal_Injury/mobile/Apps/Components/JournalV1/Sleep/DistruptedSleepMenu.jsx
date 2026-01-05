import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { useTheme } from "../../../Contexts/ThemeContext";
import Checkbox from "expo-checkbox";

const DistruptedSleepMenu = ({ onCheckedChange, sleepFactors = [] }) => {
	const { theme } = useTheme();

	const [checkedItems, setCheckedItems] = useState({});

	const options = [
		{ value: "usedSleepingAids", label: "I used sleeping aids" },
		{ value: "wokeUpInPain", label: "I woke up in pain" },
		{ value: "hardTimeFallingAsleep", label: "I had a hard time falling asleep" },
		{ value: "wokeUpInMiddleOfNight", label: "I woke up in the middle of the night" },
		{ value: "tossedAndTurnedDuringNight", label: "I tossed and turned during the night" },
		{ value: "wokeUpScared", label: "I woke up scared" },
		{ value: "hadNightmares", label: "I had nightmares" },
		{ value: "hadToUseWashroom", label: "I had to use the washroom" },
	];

	useEffect(() => {
		if (sleepFactors.length > 0) {
			const initialState = {};
			sleepFactors.forEach(factor => {
				initialState[factor] = true;
			});
			setCheckedItems(initialState);
		}
	}, [sleepFactors]);

	const handleCheckboxChange = (option) => {
		const newState = {
			...checkedItems,
			[option]: !checkedItems[option],
		};

		setCheckedItems(newState);

		const updatedItems = Object.keys(newState).filter(
			(key) => newState[key]
		);

		onCheckedChange(updatedItems);
	};

	return (
		<View className="pt-8 space-y-3">
			{options.map((option, index) => (
				<View
					key={index}
					className="flex-row justify-between items-center mb-2"
				>
					<Text
						className="ml-2 font-raleway text-[16px]"
						style={{ color: theme.textColor }}
					>
						{option.label}
					</Text>
					<Checkbox
						className="border-2 border-primaryBlue"
						value={checkedItems[option.value] || false}
						onValueChange={() => handleCheckboxChange(option.value)}
						color={checkedItems[option.value] ? "#00b8df" : undefined}
					/>
				</View>
			))}
		</View>
	);
};

export default DistruptedSleepMenu;

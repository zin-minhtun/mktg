import React, { useState, useEffect } from "react";
import { View, Text, TextInput } from "react-native";
import { useTheme } from "../../../Contexts/ThemeContext";
import Checkbox from "expo-checkbox";

const UnDistruptedSleepMenu = ({ onCheckedChange, sleepFactors }) => {

	const { theme } = useTheme();

	const [checkedItems, setCheckedItems] = useState({});

	const options = [
		{ value: "usedSleepingAids", label: "I used sleeping aids" },
		{ value: "none", label: "None" }
	];
	useEffect(() => {
		if (sleepFactors && sleepFactors.length > 0) {
			const initialState = {};
			sleepFactors.forEach(factor => {
				initialState[factor] = true;
			});
			setCheckedItems(initialState);
		}
	}, [sleepFactors]);

	const handleCheckboxChange = (option) => {
		let newState = {};
		if (option === "none") {
			newState = { none: !checkedItems.none };
		} else {
			newState = {
				...checkedItems,
				[option]: !checkedItems[option],
				none: false
			};
		}

		setCheckedItems(newState);

		if (onCheckedChange) {
			const updatedItems = Object.keys(newState).filter(k => newState[k]);
			onCheckedChange(updatedItems);
		}
	};


	return (
		<>
			<View className="pt-8 space-y-3">
				{options.map((option, index) => (
					<View
						key={index}
						className="flex-row justify-between items-center mb-2"
					>
						<Text className="ml-2 font-raleway text-[16px]" style={{ color: theme.textColor }}>
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
		</>
	);
};

export default UnDistruptedSleepMenu;
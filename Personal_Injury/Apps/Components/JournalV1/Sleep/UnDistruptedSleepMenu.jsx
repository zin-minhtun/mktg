import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import Checkbox from "expo-checkbox";
import { styled } from "nativewind";

const StyledTextInput = styled(TextInput);

const UnDistruptedSleepMenu = () => {
	const [checkedItems, setCheckedItems] = useState({});
	const [distruptedSleepNote, setDistruptedSleepNote] = useState(null);

	// Options array with labels containing spaces
	const options = [
		{ value: "usedSleepingAids", label: "I used sleeping aids" },
		{ value: "none", label: "None" },
	];

	const handleCheckboxChange = (option) => {
		setCheckedItems((prev) => ({
			...prev,
			[option]: !prev[option], // Toggle the current option
		}));
	};

	return (
		<>
			<View className="pt-4 space-y-3">
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

			<View className="mt-10">
				<Text className="font-ralewaySemiBold mb-3 text-primaryDarkBlue text-[16px]">
					Others
				</Text>

				{/* Textarea for notes */}
				<StyledTextInput
					multiline
					value={distruptedSleepNote}
					onChangeText={setDistruptedSleepNote}
					placeholder="Add notes"
					placeholderTextColor="#C8C8C8"
					className="font-raleway text-[16px] h-[84px] p-3 border rounded-lg border-[#EDECF4] bg-white focus:border-primaryBlue"
					style={{ textAlignVertical: "top" }}
				/>
			</View>
		</>
	);
};

export default UnDistruptedSleepMenu;

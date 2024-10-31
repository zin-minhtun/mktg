import { View, Text, TouchableOpacity, TextInput } from "react-native";
import React, { useState } from "react";
import { styled } from "nativewind";
import AudioInputIcon from "../../Icons/AudioInputIcon";
import CheckIcon from "../../Icons/CheckIcon";
import CrossIcon from "../../Icons/CrossIcon";

const StyledTextInput = styled(TextInput);

const MidStimulation = () => {
	const [selectedOptions, setSelectedOptions] = useState([]);
	const [midStimulationNote, setMidStimulationNote] = useState("");

	const options = [
		{ id: "diningOut", label: "Dining Out" },
		{ id: "moviesAtHome", label: "Movies at Home" },
		{ id: "volunteerWork", label: "Volunteer Work" },
		{ id: "socialClubs", label: "Social Clubs" },
	];

	const toggleOption = (optionId) => {
		setSelectedOptions((prevSelected) =>
			prevSelected.includes(optionId)
				? prevSelected.filter((id) => id !== optionId)
				: [...prevSelected, optionId]
		);
	};

	return (
		<>
			<View className="mt-3">
				<View className="flex flex-row flex-wrap">
					{options.map((option) => (
						<TouchableOpacity
							key={option.id}
							onPress={() => toggleOption(option.id)}
							className={`border rounded-lg px-3 mr-3 mb-3 bg-white border-[#EDECF4] ${
								selectedOptions.includes(option.id)
									? "bg-primaryLightBlue border-primaryBlue"
									: ""
							}`}
						>
							<Text className="font-raleway py-3 text-gray-500 text-[16px]">
								{option.label}
							</Text>
						</TouchableOpacity>
					))}
				</View>
			</View>

			<View className="mt-8">
				<Text className="font-ralewaySemiBold mb-3 text-primaryDarkBlue text-[16px]">
					Others
				</Text>

				{/* Textarea for notes */}
				<StyledTextInput
					multiline
					value={midStimulationNote}
					onChangeText={setMidStimulationNote}
					placeholder="Add notes"
					placeholderTextColor="#C8C8C8"
					className="font-raleway text-[16px] h-[84px] p-3 border rounded-lg border-[#EDECF4] bg-white focus:border-primaryBlue"
					style={{ textAlignVertical: "top" }}
				/>

				<View className="flex-row justify-end mt-3">
					<View className="justify-center items-center mr-6 bg-primaryBlue rounded-full w-10 h-10">
						<AudioInputIcon />
					</View>
					<View
						className={`justify-center items-center mr-3 rounded-full w-10 h-10 ${
							midStimulationNote.length > 0 ? "bg-[#FDA29B80]" : "bg-[#E0E0E0]"
						}`}
					>
						<CrossIcon isActive={midStimulationNote.length > 0} />
					</View>
					<TouchableOpacity
						onPress={() => null}
						disabled={midStimulationNote.length === 0}
						className={`justify-center items-center rounded-full w-10 h-10 ${
							midStimulationNote.length > 0 ? "bg-primaryBlue" : "bg-[#E0E0E0]"
						}`}
					>
						<CheckIcon isActive={midStimulationNote.length > 0} />
					</TouchableOpacity>
				</View>
			</View>

			<View className="absolute bottom-5 left-0 right-0 py-4 px-4">
				<TouchableOpacity
					className="w-full bg-primaryBlue py-4 rounded-full"
					onPress={() => null}
				>
					<Text className="text-center text-white font-ralewaySemiBold text-[16px]">
						Save
					</Text>
				</TouchableOpacity>
			</View>
		</>
	);
};

export default MidStimulation;

import {
	View,
	Text,
	TouchableOpacity,
	TextInput,
	ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { styled } from "nativewind";

// Components
import AudioInputIcon from "../../Icons/AudioInputIcon";
import CheckIcon from "../../Icons/CheckIcon";
import CrossIcon from "../../Icons/CrossIcon";
import Confusion from "./svg/Confusion";
import BalanceLoss from "./svg/BalanceLoss";
import Dazed from "./svg/Dazed";
import Tinnitus from "./svg/Tinnitus";
import NoiseSensitivity from "./svg/NoiseSensitivity";
import LightSensitivity from "./svg/LightSensitivity";
import Nausea from "./svg/Nausea";
import ConsciousnessLoss from "./svg/ConsciousnessLoss";
import AffectedVision from "./svg/AffectedVision";

const StyledTextInput = styled(TextInput);
const symptomsData = [
	{ id: "confusion", name: "Confusion", icon: <Confusion />, color: "#D9E6FF" },
	{
		id: "balanceLoss",
		name: "Loss of Balance",
		icon: <BalanceLoss />,
		color: "#FFE1D4",
	},
	{
		id: "feelingDazed",
		name: "Feeling Dazed",
		icon: <Dazed />,
		color: "#FFAEC6",
	},
	{
		id: "tinnitus",
		name: "Tinnitus\n(Ringing in ears)",
		icon: <Tinnitus />,
		color: "#DDFFD8",
	},
	{
		id: "noiseSensitivity",
		name: "Noise Sensitivity",
		icon: <NoiseSensitivity />,
		color: "#D8CAFF",
	},
	{
		id: "lightSensitivity",
		name: "Light Sensitivity",
		icon: <LightSensitivity />,
		color: "#FFF6C7",
	},
	{ id: "nausea", name: "Nausea", icon: <Nausea />, color: "#D5FCFF" },
	{
		id: "consciousnessLoss",
		name: "Loss of Consciousness",
		icon: <ConsciousnessLoss />,
		color: "#FFD8F7",
	},
	{
		id: "affectedVision",
		name: "Affected Vision",
		icon: <AffectedVision />,
		color: "#CCFFED",
	},
];

const AddSymptomsDetails = ({ navigation }) => {
	const [otherSymptomNote, setOtherSymptomNote] = useState(""); // State for other symptom note
	const [selectedSymptoms, setSelectedSymptoms] = useState([]);

	useEffect(() => {
		console.log(selectedSymptoms);
	}, [selectedSymptoms]);

	const handleSymptomSelect = (id) => {
		if (selectedSymptoms.includes(id)) {
			setSelectedSymptoms(
				selectedSymptoms.filter((symptomId) => symptomId !== id)
			);
		} else {
			setSelectedSymptoms([...selectedSymptoms, id]);
		}
	};

	const handlePress = () => {
		navigation.push("JournalNavigator", {
			screen: "SelectedSymptomsDetails",
			params: { selectedSymptoms }, // Pass selected symptoms here
		});
	};

	return (
		<View className="flex-1 bg-[#FAFBFC] px-4 mt-6">
			<ScrollView
				contentContainerStyle={{ flexGrow: 1 }}
				showsVerticalScrollIndicator={false}
				keyboardDismissMode="on-drag" // Dismiss the keyboard when scrolling
			>
				<View className="mt-8">
					<Text className="mb-3 font-ralewaySemiBold text-primaryDarkBlue text-[24px] leading-8">
						What symptoms are you experiencing today?
					</Text>
				</View>

				<View className="flex flex-wrap flex-row justify-between pt-5">
					{symptomsData.map((symptom) => (
						<View className="items-center w-28 mb-4" key={symptom.id}>
							<TouchableOpacity
								onPress={() => handleSymptomSelect(symptom.id)}
								className={`rounded-full w-20 h-20 justify-center items-center ${
									selectedSymptoms.includes(symptom.id)
										? "border-2 border-primaryBlue"
										: ""
								}`}
								style={{ backgroundColor: symptom.color }}
							>
								{symptom.icon}
							</TouchableOpacity>
							<Text className="font-raleway font-semibold text-[14px] text-gray-400 pt-2 text-center">
								{symptom.name}
							</Text>
						</View>
					))}
				</View>

				<View className="mt-3">
					<Text className="font-ralewaySemiBold mb-3 text-primaryDarkBlue text-[16px]">
						Add any other Symptom
					</Text>

					{/* Textarea for notes */}
					<StyledTextInput
						multiline
						value={otherSymptomNote}
						onChangeText={setOtherSymptomNote}
						placeholder="Add symptom"
						placeholderTextColor="#C8C8C8"
						className="font-raleway text-[16px] h-[84px] p-3 border rounded-lg border-[#EDECF4] bg-white focus:border-primaryBlue"
						style={{ textAlignVertical: "top" }}
					/>

					<View className="flex-row justify-end mt-3">
						<View className="justify-center items-center mr-6 bg-primaryBlue rounded-full w-10 h-10">
							<AudioInputIcon />
						</View>
						<View
							className={`first-letter:justify-center items-center mr-3 rounded-full w-10 h-10 ${
								otherSymptomNote.length > 0 ? "bg-[#FDA29B80]" : "bg-[#E0E0E0]"
							}`}
						>
							<CrossIcon isActive={otherSymptomNote.length > 0} />
						</View>
						<TouchableOpacity
							onPress={() => null}
							disabled={otherSymptomNote.length === 0}
							className={`justify-center items-center rounded-full w-10 h-10 ${
								otherSymptomNote.length > 0 ? "bg-primaryBlue" : "bg-[#E0E0E0]"
							}`}
						>
							<CheckIcon isActive={otherSymptomNote.length > 0} />
						</TouchableOpacity>
					</View>
				</View>

				<View className="absolute bottom-5 left-0 right-0 py-4">
					<TouchableOpacity
						className="w-full bg-primaryBlue py-4 rounded-full"
						onPress={handlePress}
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

export default AddSymptomsDetails;

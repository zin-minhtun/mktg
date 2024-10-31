import {
	View,
	Text,
	TouchableOpacity,
	TextInput,
	ScrollView,
	Switch,
} from "react-native";
import React, { useState, useEffect } from "react";
import { styled } from "nativewind";
import Checkbox from "expo-checkbox";

// Components
import AudioInputIcon from "../../Icons/AudioInputIcon";
import CheckIcon from "../../Icons/CheckIcon";
import CrossIcon from "../../Icons/CrossIcon";
import ArrowRight from "../../Icons/ArrowRight";
import ArrowDown from "../../Icons/ArrowDown";
import WaterGlass from "../Medication/svg/WaterGlass";
import Milk from "../Medication/svg/Milk";
import Salad from "../Medication/svg/Salad";
import Stomach from "../Medication/svg/Stomach";
import Vitamin from "./svg/Vitamin";
import Multivitamin from "./svg/Multivitamin";
import Mineral from "./svg/Mineral";
import Multimineral from "./svg/Multimineral";

const StyledTextInput = styled(TextInput);
const supplementsData = [
	{
		id: "vitamin",
		name: "Vitamin",
		icon: <Vitamin />,
		color: "#C5F4FD",
	},
	{
		id: "multiVitamin",
		name: "Multivitamin",
		icon: <Multivitamin />,
		color: "#FFDB94",
	},
	{
		id: "mineral",
		name: "Mineral",
		icon: <Mineral />,
		color: "#FDF2C5",
	},
	{
		id: "multiMineral",
		name: "Multi Mineral",
		icon: <Multimineral />,
		color: "#F9D9D9",
	},
	// ... other symptoms
];

const AddSupplementDetails = ({ navigation }) => {
	const [selectedSymptom, setSelectedSymptom] = useState(
		supplementsData[0]?.id
	);

	const [selectedOption, setSelectedOption] = useState("water");
	const [isReminderEnabled, setIsReminderEnabled] = useState(false);

	const options = [
		{ id: "water", label: "With water", icon: <WaterGlass /> },
		{ id: "milk", label: "With milk", icon: <Milk /> },
		{ id: "food", label: "With food", icon: <Salad /> },
		{ id: "empty_stomach", label: "Empty stomach", icon: <Stomach /> },
	];

	useEffect(() => {
		console.log(selectedSymptom);
	}, [selectedSymptom]);

	const handleSymptomSelect = (id) => {
		// Set the selected symptom to the clicked one, and it won't toggle off.
		setSelectedSymptom(id);
	};

	const toggleSwitch = () => {
		setIsReminderEnabled((previousState) => !previousState);
	};

	return (
		<View className="flex-1 bg-[#FAFBFC] mt-6">
			<ScrollView
				contentContainerStyle={{ flexGrow: 1, paddingBottom: 150 }}
				showsVerticalScrollIndicator={false}
			>
				{/* Horizontal Scrollable Symptom Icons */}
				<View className="pt-8">
					<ScrollView horizontal showsHorizontalScrollIndicator={false}>
						<View className="flex-row mx-2">
							{supplementsData.map((symptom) => (
								<View className="items-center w-28 mb-4" key={symptom.id}>
									<TouchableOpacity
										onPress={() => handleSymptomSelect(symptom.id)}
										className={`rounded-full w-20 h-20 justify-center items-center ${
											selectedSymptom === symptom.id
												? "border-2 border-primaryBlue"
												: ""
										}`}
										style={{ backgroundColor: symptom.color }}
									>
										{symptom.icon}
									</TouchableOpacity>
									<Text
										className={`font-raleway font-semibold text-[14px] pt-2 text-center ${
											selectedSymptom === symptom.id
												? "text-primaryDarkBlue"
												: "text-gray-400"
										}`}
									>
										{symptom.name}
									</Text>
								</View>
							))}
						</View>
					</ScrollView>
				</View>

				<View className="mx-3">
					<View className="mt-5">
						<Text className="mb-3 font-ralewaySemiBold text-primaryDarkBlue text-[16px]">
							Supplement Name
						</Text>
						<TextInput
							className="font-raleway text-[#939598] h-[46px] border border-[#EDECF4] rounded-lg p-2 px-5 bg-white"
							placeholder="Omega 3"
						/>
					</View>

					<View className="mt-6">
						<Text className="mb-3 font-ralewaySemiBold text-primaryDarkBlue text-[16px]">
							Supplement Dosage
						</Text>
						<TextInput
							className="font-raleway text-[#939598] h-[46px] border border-[#EDECF4] rounded-lg p-2 px-5 bg-white"
							placeholder="200 mg"
						/>
					</View>

					<View className="mt-6">
						<Text className="mb-3 font-ralewaySemiBold text-primaryDarkBlue text-[16px]">
							Supplement Duration
						</Text>
						<TouchableOpacity
							className={`border rounded-lg px-3 bg-white border-[#EDECF4]`}
						>
							<View className="flex flex-row justify-between">
								<Text className="font-raleway py-3 text-gray-500 text-[16px]">
									Once Daily
								</Text>
								<View className="pl-6 py-3">
									<ArrowDown />
								</View>
							</View>
						</TouchableOpacity>
					</View>

					<View className="mt-6">
						<Text className="mb-3 font-ralewaySemiBold text-primaryDarkBlue text-[16px]">
							Supplement Duration
						</Text>
						<View className="flex flex-row justify-between space-x-2">
							<View className="flex-[1]">
								<Text className="mb-3 font-raleway text-primaryDarkBlue text-[16px]">
									From
								</Text>
								<TouchableOpacity
									className={`border rounded-lg px-3 bg-white border-[#EDECF4]`}
								>
									<View className="flex flex-row justify-between">
										<Text className="font-raleway py-3 text-gray-500 text-[16px]">
											Jun 1
										</Text>
										<View className="pl-6 py-3">
											<ArrowDown />
										</View>
									</View>
								</TouchableOpacity>
							</View>
							<View className="flex-[1]">
								<Text className="mb-3 font-raleway text-primaryDarkBlue text-[16px]">
									From
								</Text>
								<TouchableOpacity
									className={`border rounded-lg px-3 bg-white border-[#EDECF4]`}
								>
									<View className="flex flex-row justify-between">
										<Text className="font-raleway py-3 text-gray-500 text-[16px]">
											Jun 25
										</Text>
										<View className="pl-6 py-3">
											<ArrowDown />
										</View>
									</View>
								</TouchableOpacity>
							</View>
						</View>
					</View>

					<View className="mt-6">
						<Text className="mb-3 font-ralewaySemiBold text-primaryDarkBlue text-[16px]">
							How to take it
						</Text>
						<View className="flex flex-row flex-wrap">
							{options.map((option) => (
								<TouchableOpacity
									key={option.id}
									onPress={() => setSelectedOption(option.id)}
									className={`border rounded-lg px-3 mr-3 mb-3 bg-white border-[#EDECF4] ${
										selectedOption === option.id
											? "bg-primaryLightBlue border-primaryBlue"
											: ""
									}`}
								>
									<View className="flex flex-row justify-start">
										<View className="py-2 mr-2">{option.icon}</View>
										<Text className="font-raleway py-2 text-gray-500 text-[16px]">
											{option.label}
										</Text>
									</View>
								</TouchableOpacity>
							))}
						</View>
					</View>

					<View className="mt-6 flex-row justify-between items-center">
						<Text className="mb-3 font-ralewaySemiBold text-primaryDarkBlue text-[16px]">
							Set Reminder
						</Text>
						<Switch
							value={isReminderEnabled}
							onValueChange={toggleSwitch}
							trackColor={{ false: "#767577", true: "#00b8df" }} // Tailwind blue
							thumbColor={isReminderEnabled ? "#ffffff" : "#f4f3f4"} // White for the thumb
						/>
					</View>
				</View>

				<View className="absolute bottom-10 px-3 left-0 right-0">
					<TouchableOpacity
						className="w-full bg-primaryBlue py-4 rounded-full"
						onPress={() => null}
					>
						<Text className="text-center text-white font-ralewaySemiBold text-[16px]">
							Save
						</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</View>
	);
};

export default AddSupplementDetails;

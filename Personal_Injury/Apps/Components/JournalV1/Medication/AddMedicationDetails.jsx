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
import Nausea from "../Symptoms/svg/Nausea";
import DailyFreqMenu from "./DailyFreqMenu";
import WeeklyFreqMenu from "./WeeklyFreqMenu";
import MonthlyFreqMenu from "./MonthlyFreqMenu";
import ArrowRight from "../../Icons/ArrowRight";
import ArrowDown from "../../Icons/ArrowDown";
import PainRelief from "./svg/PainRelief";
import SleepAids from "./svg/SleepAids";
import Seizure from "./svg/Seizure";
import WaterGlass from "./svg/WaterGlass";
import Milk from "./svg/Milk";
import Salad from "./svg/Salad";
import Stomach from "./svg/Stomach";

const StyledTextInput = styled(TextInput);
const symptomsData = [
	{
		id: "nauseaControl",
		name: "Nausea Control",
		icon: <Nausea />,
		color: "#BBCCED",
	},
	{
		id: "painRelief",
		name: "Pain Relief",
		icon: <PainRelief />,
		color: "#AAA8FF",
	},
	{
		id: "sleepAids",
		name: "Sleep Aids",
		icon: <SleepAids />,
		color: "#FFDB94",
	},
	{
		id: "antiSeizure",
		name: "Anti-seizure",
		icon: <Seizure />,
		color: "#CADEEF",
	},
	// ... other symptoms
];

const AddMedicationDetails = ({ navigation }) => {
	const [otherSymptomNote, setOtherSymptomNote] = useState("");
	const [selectedSymptom, setSelectedSymptom] = useState(symptomsData[0]?.id);

	const [isDailyVisible, setIsDailyVisible] = useState(false);
	const [isWeeklyVisible, setIsWeeklyVisible] = useState(false);
	const [isMonthlyVisible, setIsMonthlyVisible] = useState(false);
	const [selectedOption, setSelectedOption] = useState("water");
	const [isReminderEnabled, setIsReminderEnabled] = useState(false);

	const options = [
		{ id: "water", label: "With water", icon: <WaterGlass /> },
		{ id: "milk", label: "With milk", icon: <Milk /> },
		{ id: "food", label: "With food", icon: <Salad /> },
		{ id: "empty_stomach", label: "Empty stomach", icon: <Stomach /> },
	];

	const toggleDailyMenu = () => {
		setIsDailyVisible(!isDailyVisible);
		setIsWeeklyVisible(false);
		setIsMonthlyVisible(false);
	};

	const toggleWeeklyMenu = () => {
		setIsWeeklyVisible(!isWeeklyVisible);
		setIsDailyVisible(false);
		setIsMonthlyVisible(false);
	};

	const toggleMonthlyMenu = () => {
		setIsMonthlyVisible(!isMonthlyVisible);
		setIsDailyVisible(false);
		setIsWeeklyVisible(false);
	};

	useEffect(() => {
		console.log(selectedSymptom);
	}, [selectedSymptom]);

	const handleSymptomSelect = (id) => {
		if (selectedSymptom === id) {
			setSelectedSymptom(null);
		} else {
			setSelectedSymptom(id);
		}
	};

	const handlePress = () => {
		navigation.push("JournalNavigator", {
			screen: "SelectedSymptomsDetails",
			params: { selectedSymptom },
		});
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
							{symptomsData.map((symptom) => (
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
							Medication Name
						</Text>
						<TextInput
							className="font-raleway text-[#939598] h-[46px] border border-[#EDECF4] rounded-lg p-2 px-5 bg-white"
							placeholder="Omeprazol"
						/>
					</View>

					<View className="mt-6">
						<Text className="mb-3 font-ralewaySemiBold text-primaryDarkBlue text-[16px]">
							Medication Dosage
						</Text>
						<TextInput
							className="font-raleway text-[#939598] h-[46px] border border-[#EDECF4] rounded-lg p-2 px-5 bg-white"
							placeholder="2"
						/>
					</View>

					<View className="mt-6">
						<Text className="mb-3 font-ralewaySemiBold text-primaryDarkBlue text-[16px]">
							Medication Frequency
						</Text>
						<View className="flex flex-row justify-between">
							<TouchableOpacity
								onPress={toggleDailyMenu}
								className={`border rounded-lg px-3 ${
									isDailyVisible
										? "bg-primaryLightBlue border-primaryBlue"
										: "bg-white border-[#EDECF4]"
								}`}
							>
								<View className="flex flex-row justify-between">
									<Text className="font-raleway py-3 text-gray-500 text-[16px]">
										Daily
									</Text>
									<View className="pl-6 py-3">
										{isDailyVisible ? <ArrowDown /> : <ArrowRight />}
									</View>
								</View>
							</TouchableOpacity>

							<TouchableOpacity
								onPress={toggleWeeklyMenu}
								className={`border rounded-lg px-3 ${
									isWeeklyVisible
										? "bg-primaryLightBlue border-primaryBlue"
										: "bg-white border-[#EDECF4]"
								}`}
							>
								<View className="flex flex-row justify-between">
									<Text className="font-raleway py-3 text-gray-500 text-[16px]">
										Weekly
									</Text>
									<View className="pl-6 py-3">
										{isWeeklyVisible ? <ArrowDown /> : <ArrowRight />}
									</View>
								</View>
							</TouchableOpacity>

							<TouchableOpacity
								onPress={toggleMonthlyMenu}
								className={`border rounded-lg px-3 ${
									isMonthlyVisible
										? "bg-primaryLightBlue border-primaryBlue"
										: "bg-white border-[#EDECF4]"
								}`}
							>
								<View className="flex flex-row justify-between">
									<Text className="font-raleway py-3 text-gray-500 text-[16px]">
										Monthly
									</Text>
									<View className="pl-6 py-3">
										{isMonthlyVisible ? <ArrowDown /> : <ArrowRight />}
									</View>
								</View>
							</TouchableOpacity>
						</View>

						{/* Conditionally render the Medication Frequency based on the selected menu */}
						{isDailyVisible && (
							<View className="pt-6 gap-y-2">
								<DailyFreqMenu />
							</View>
						)}
						{isWeeklyVisible && (
							<View className="pt-6 gap-y-2">
								<WeeklyFreqMenu />
							</View>
						)}
						{isMonthlyVisible && (
							<View className="pt-6 gap-y-2">
								<MonthlyFreqMenu />
							</View>
						)}

						<TextInput
							className="font-raleway text-[#939598] h-[46px] mt-6 border border-[#EDECF4] rounded-lg p-2 px-5 bg-white"
							placeholder="Other*"
						/>
					</View>

					<View className="mt-6">
						<Text className="mb-3 font-ralewaySemiBold text-primaryDarkBlue text-[16px]">
							Medication Duration
						</Text>
						<View className="flex flex-row justify-between space-x-2">
							<TouchableOpacity
								className={`border rounded-lg px-3 bg-white border-[#EDECF4] flex-[1]`}
							>
								<View className="flex flex-row justify-between">
									<Text className="font-raleway py-3 text-gray-500 text-[16px]">
										From
									</Text>
									<View className="pl-6 py-3">
										<ArrowRight />
									</View>
								</View>
							</TouchableOpacity>

							<TouchableOpacity
								className={`border rounded-lg px-3 bg-white border-[#EDECF4] flex-[1]`}
							>
								<View className="flex flex-row justify-between">
									<Text className="font-raleway py-3 text-gray-500 text-[16px]">
										To
									</Text>
									<View className="pl-6 py-3">
										<ArrowRight />
									</View>
								</View>
							</TouchableOpacity>
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
							Next
						</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</View>
	);
};

export default AddMedicationDetails;

import {
	View,
	Text,
	TouchableOpacity,
	TextInput,
	ScrollView,
} from "react-native";
import React, { useState } from "react";
import { styled } from "nativewind";
// Import icons...
import AudioInputIcon from "../../Icons/AudioInputIcon";
import CrossIcon from "../../Icons/CrossIcon";
import CheckIcon from "../../Icons/CheckIcon";
import ShowerIcon from "./svg/ShowerIcon";
import ShaveIcon from "./svg/ShaveIcon";
import HairIcon from "./svg/HairIcon";
import TeethIcon from "./svg/TeethIcon";
import NailIcon from "./svg/NailIcon";
import DressedIcon from "./svg/DressedIcon";
import CookedIcon from "./svg/CookedIcon";
import TrashIcon from "./svg/TrashIcon";
import SweptIcon from "./svg/SweptIcon";
import VacuumIcon from "./svg/VacuumIcon";
import CleaningIcon from "./svg/CleaningIcon";
import MoppedIcon from "./svg/MoppedIcon";
import DishesIcon from "./svg/DishesIcon";
import FoldedLaundryIcon from "./svg/FoldedLaundryIcon";
import DidLaundryIcon from "./svg/DidLaundryIcon";
import PressedLaundryIcon from "./svg/PressedLaundryIcon";

const StyledTextInput = styled(TextInput);

const AddPersonalCareDetails = ({ navigation }) => {
	// Update state to hold multiple selected options
	const [selectedHygieneGroomingOptions, setSelectedHygieneGroomingOptions] =
		useState([]);
	const [selectedDailyLivingOptions, setSelectedDailyLivingOptions] = useState(
		[]
	);

	const hygieneGroomingOptions = [
		{ id: "tookShower", label: "Took a shower", icon: <ShowerIcon /> },
		{ id: "hadShave", label: "Had a shave", icon: <ShaveIcon /> },
		{ id: "hairCare", label: "Hair care", icon: <HairIcon /> },
		{ id: "cleanedTeeth", label: "Cleaned teeth", icon: <TeethIcon /> },
		{ id: "nailCare", label: "Nail care", icon: <NailIcon /> },
		{ id: "gotDressed", label: "Got dressed", icon: <DressedIcon /> },
	];

	const dailyLivingOptions = [
		{ id: "cooked", label: "Cooked", icon: <CookedIcon /> },
		{ id: "tookOutTrash", label: "Took out trash", icon: <TrashIcon /> },
		{ id: "swept", label: "Swept", icon: <SweptIcon /> },
		{ id: "usedTheVacuum", label: "Used the vacuum", icon: <VacuumIcon /> },
		{
			id: "generalCleaning",
			label: "General cleaning",
			icon: <CleaningIcon />,
		},
		{ id: "mopped", label: "Mopped", icon: <MoppedIcon /> },
		{ id: "didDishes", label: "Did dishes", icon: <DishesIcon /> },
		{
			id: "foldedLaundry",
			label: "Folded laundry",
			icon: <FoldedLaundryIcon />,
		},
		{ id: "didLaundry", label: "Did laundry", icon: <DidLaundryIcon /> },
		{
			id: "pressedLaundry",
			label: "Pressed laundry",
			icon: <PressedLaundryIcon />,
		},
	];

	// Function to toggle option selection
	const toggleHygieneGroomingOption = (id) => {
		setSelectedHygieneGroomingOptions(
			(prevSelected) =>
				prevSelected.includes(id)
					? prevSelected.filter((option) => option !== id) // Remove if already selected
					: [...prevSelected, id] // Add if not selected
		);
	};

	const toggleDailyLivingOption = (id) => {
		setSelectedDailyLivingOptions((prevSelected) =>
			prevSelected.includes(id)
				? prevSelected.filter((option) => option !== id)
				: [...prevSelected, id]
		);
	};

	return (
		<View className="flex-1 bg-[#FAFBFC] mt-6">
			<ScrollView
				contentContainerStyle={{ flexGrow: 1, paddingBottom: 150 }}
				showsVerticalScrollIndicator={false}
			>
				<View className="mx-3">
					<View className="mt-6">
						<Text className="mb-3 font-ralewaySemiBold text-primaryDarkBlue text-[16px]">
							Personal Hygiene and Grooming
						</Text>
						<View className="flex flex-row flex-wrap">
							{hygieneGroomingOptions.map((option) => (
								<TouchableOpacity
									key={option.id}
									onPress={() => toggleHygieneGroomingOption(option.id)}
									className={`border rounded-lg px-2 mr-3 mb-3 bg-white border-[#EDECF4] ${
										selectedHygieneGroomingOptions.includes(option.id)
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

					<View className="mt-3">
						<Text className="mb-3 font-ralewaySemiBold text-primaryDarkBlue text-[16px]">
							Cleaning and Daily Living
						</Text>
						<View className="flex flex-row flex-wrap">
							{dailyLivingOptions.map((option) => (
								<TouchableOpacity
									key={option.id}
									onPress={() => toggleDailyLivingOption(option.id)}
									className={`border rounded-lg px-2 mr-3 mb-3 bg-white border-[#EDECF4] ${
										selectedDailyLivingOptions.includes(option.id)
											? "bg-primaryLightBlue border-primaryBlue"
											: ""
									}`}
								>
									<View className="flex flex-row justify-start">
										<View className="py-2 mr-1">{option.icon}</View>
										<Text className="font-raleway py-2 text-gray-500 text-[16px]">
											{option.label}
										</Text>
									</View>
								</TouchableOpacity>
							))}
						</View>
					</View>

					<View className="mt-3">
						<Text className="font-ralewaySemiBold mb-3 text-primaryDarkBlue text-[16px]">
							Others
						</Text>

						{/* Textarea for notes */}
						<StyledTextInput
							multiline
							placeholder="Add notes"
							placeholderTextColor="#C8C8C8"
							className="font-raleway text-[16px] h-28 p-3 border rounded-lg border-[#EDECF4] bg-white focus:border-primaryBlue"
							style={{ textAlignVertical: "top" }}
						/>

						<View className="flex-row justify-end mt-3">
							<View className="justify-center items-center mr-6 bg-primaryBlue rounded-full w-10 h-10">
								<AudioInputIcon />
							</View>
							<View
								className={`first-letter:justify-center items-center mr-3 rounded-full w-10 h-10 bg-[#E0E0E0]`}
							>
								<CrossIcon />
							</View>
							<TouchableOpacity
								onPress={() => null}
								className={`justify-center items-center rounded-full w-10 h-10 bg-[#E0E0E0]`}
							>
								<CheckIcon />
							</TouchableOpacity>
						</View>
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

export default AddPersonalCareDetails;

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
import WaterGlass from "../Medication/svg/WaterGlass";
import Milk from "../Medication/svg/Milk";
import AudioInputIcon from "../../Icons/AudioInputIcon";
import CrossIcon from "../../Icons/CrossIcon";
import CheckIcon from "../../Icons/CheckIcon";

const StyledTextInput = styled(TextInput);

const AddMobilityDetails = ({ navigation }) => {
	// Update state to hold multiple selected options
	const [selectedTransferOptions, setSelectedTransferOptions] = useState([]);
	const [selectedOtherOptions, setSelectedOtherOptions] = useState([]);
	const [selectedTransportOptions, setSelectedTransportOptions] = useState([]);

	const transferOptions = [
		{ id: "withAssistance", label: "With Assistance", icon: <WaterGlass /> },
		{ id: "moviesAtHome", label: "Movies at Home", icon: <Milk /> },
	];

	const otherOptions = [
		{ id: "fromBedToChair", label: "From bed to chair", icon: <WaterGlass /> },
		{ id: "fromChairToBed", label: "From chair to bed", icon: <Milk /> },
	];

	const transportOptions = [
		{ id: "driving", label: "Driving", icon: <WaterGlass /> },
		{ id: "usingPublicTransit", label: "Using public transit", icon: <Milk /> },
	];

	// Function to toggle option selection
	const toggleTransferOption = (id) => {
		setSelectedTransferOptions(
			(prevSelected) =>
				prevSelected.includes(id)
					? prevSelected.filter((option) => option !== id) // Remove if already selected
					: [...prevSelected, id] // Add if not selected
		);
	};

	const toggleOtherOption = (id) => {
		setSelectedOtherOptions((prevSelected) =>
			prevSelected.includes(id)
				? prevSelected.filter((option) => option !== id)
				: [...prevSelected, id]
		);
	};

	const toggleTransportOption = (id) => {
		setSelectedTransportOptions((prevSelected) =>
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
							Transferring
						</Text>
						<View className="flex flex-row flex-wrap">
							{transferOptions.map((option) => (
								<TouchableOpacity
									key={option.id}
									onPress={() => toggleTransferOption(option.id)}
									className={`border rounded-lg px-2 mr-3 mb-3 bg-white border-[#EDECF4] ${
										selectedTransferOptions.includes(option.id)
											? "bg-primaryLightBlue border-primaryBlue"
											: ""
									}`}
								>
									<View className="flex flex-row justify-start">
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
							Others
						</Text>
						<View className="flex flex-row flex-wrap">
							{otherOptions.map((option) => (
								<TouchableOpacity
									key={option.id}
									onPress={() => toggleOtherOption(option.id)}
									className={`border rounded-lg px-2 mr-3 mb-3 bg-white border-[#EDECF4] ${
										selectedOtherOptions.includes(option.id)
											? "bg-primaryLightBlue border-primaryBlue"
											: ""
									}`}
								>
									<View className="flex flex-row justify-start">
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
							Using transport
						</Text>
						<View className="flex flex-row flex-wrap">
							{transportOptions.map((option) => (
								<TouchableOpacity
									key={option.id}
									onPress={() => toggleTransportOption(option.id)}
									className={`border rounded-lg px-2 mr-3 mb-3 bg-white border-[#EDECF4] ${
										selectedTransportOptions.includes(option.id)
											? "bg-primaryLightBlue border-primaryBlue"
											: ""
									}`}
								>
									<View className="flex flex-row justify-start">
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
							Additional Information
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

export default AddMobilityDetails;

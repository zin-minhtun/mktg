import {
	ScrollView,
	View,
	Text,
	TextInput,
	TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import Checkbox from "expo-checkbox";
import ArrowRight from "../../Icons/ArrowRight";
import ArrowDown from "../../Icons/ArrowDown";
import HeadMenuItems from "./HeadMenuItems";
import UpperBodyMenuItems from "./UpperBodyMenuItems";
import LowerBodyMenuItems from "./LowerBodyMenuItems";

const AddPainCardDetails = ({ navigation }) => {
	const [selectedLevel, setSelectedLevel] = useState(3); // State to track selected intensity level
	const levels = [0, 1, 2, 3, 4, 5]; // Intensity levels

	// Function to handle selection
	const handleSelect = (level) => {
		setSelectedLevel(level);
	};

	const handlePress = () => {
		navigation.push("JournalNavigator", {
			screen: "AddAdditionalInfo",
		});
	};

	return (
		<View className="flex-1 bg-[#FAFBFC] px-4 mt-6">
			<ScrollView
				contentContainerStyle={{ paddingBottom: 250 }}
				showsVerticalScrollIndicator={false}
			>
				<View className="mt-8">
					<Text className="mb-3 font-ralewaySemiBold text-primaryDarkBlue text-[16px]">
						Pain Name
					</Text>
					<TextInput
						className="font-raleway text-[#939598] h-[46px] border border-[#EDECF4] rounded-lg p-2 px-5 bg-white"
						placeholder="Pain Name"
					/>
				</View>

				<View className="mt-8">
					<Text className="mb-3 font-ralewaySemiBold text-primaryDarkBlue text-[16px]">
						Select Pain Location
					</Text>
					<View className="px-5 border border-[#EDECF4] rounded-lg bg-white">
						<HeadMenuItems /> 
						<UpperBodyMenuItems />
						<LowerBodyMenuItems />
					</View>
				</View>

				<View className="mt-8">
					<Text className="mb-3 font-ralewaySemiBold text-primaryDarkBlue text-[16px]">
						Select Pain Type
					</Text>
					<View className="px-5 py-3 border border-[#EDECF4] rounded-lg bg-white">
						<View className="flex flex-row justify-between">
							<Text className="font-raleway text-primaryDarkBlue text-[16px]">
								Select
							</Text>
							<ArrowRight />
						</View>
					</View>
				</View>

				<View className="mt-8">
					<Text className="mb-3 font-ralewaySemiBold text-primaryDarkBlue text-[16px]">
						Select Intensity (Level 0-5)
					</Text>
					<View className="flex flex-row justify-between pb-3">
						{/* Loop through levels 0-5 to render Touchable elements for numbers */}
						{levels.map((level) => (
							<TouchableOpacity key={level} onPress={() => handleSelect(level)}>
								<Text
									className={`font-raleway text-[14px] text-[#939598] ${
										selectedLevel === level ? "font-bold" : ""
									}`}
								>
									{level}
								</Text>
							</TouchableOpacity>
						))}
					</View>

					{/* Touchable progress bar */}
					<View className="relative h-[12px] bg-gray-200 rounded-full">
						<View
							className="absolute top-0 left-0 h-full bg-[#00b8df] rounded-full"
							style={{ width: `${(selectedLevel / 5) * 100}%` }}
						/>
					</View>
				</View>

				<View className="absolute bottom-5 left-0 right-0 py-4 bg-[#FAFBFC]">
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

export default AddPainCardDetails;

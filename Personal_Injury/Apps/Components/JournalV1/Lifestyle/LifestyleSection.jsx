import {
	ScrollView,
	View,
	Text,
	TextInput,
	TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import ArrowRight from "../../Icons/ArrowRight";
import ArrowDown from "../../Icons/ArrowDown";

const LifestyleSection = ({ navigation }) => {
	const [selectedUnit, setSelectedUnit] = useState("kg"); // State to store selected unit

	const handleUnitSelect = (unit) => {
		setSelectedUnit(unit);
	};

	const handlePress = (screen) => {
		navigation.push("JournalNavigator", {
			screen,
		});
	};

	return (
		<View className="flex-1 bg-[#FAFBFC] px-4 mt-3">
			<ScrollView
				contentContainerStyle={{ paddingBottom: 20 }}
				showsVerticalScrollIndicator={false}
			>
				<View className="flex flex-row mt-5 space-x-3">
					<TextInput
						className="font-raleway flex-1 text-[#939598] text-[16px] h-[46px] border border-[#EDECF4] rounded-lg p-2 px-5 bg-white"
						placeholder="Weight"
						keyboardType="numeric"
					/>
					<View className="flex flex-row">
						<TouchableOpacity
							onPress={() => handleUnitSelect("kg")}
							className={`p-3 bg-white border border-primaryBlue ${
								selectedUnit === "kg" ? "bg-primaryBlue" : ""
							} rounded-l-lg`}
						>
							<Text
								className={`font-ralewaySemiBold text-[14px] ${
									selectedUnit === "kg" ? "text-white" : "text-primaryDarkBlue"
								}`}
							>
								kg
							</Text>
						</TouchableOpacity>

						<TouchableOpacity
							onPress={() => handleUnitSelect("lbs")}
							className={`p-3 bg-white border border-primaryBlue ${
								selectedUnit === "lbs" ? "bg-primaryBlue" : ""
							} rounded-r-lg`}
						>
							<Text
								className={`font-ralewaySemiBold text-[14px] ${
									selectedUnit === "lbs" ? "text-white" : "text-primaryDarkBlue"
								}`}
							>
								lbs
							</Text>
						</TouchableOpacity>
					</View>
				</View>

				<View className="mt-5">
					<View className="px-5 border border-[#EDECF4] rounded-lg bg-white">
						<View className="border-b border-b-[#EDECF4]">
							<TouchableOpacity onPress={() => handlePress("Exercise")}>
								<View className="flex flex-row justify-between">
									<Text className="font-ralewaySemiBold py-3 text-primaryDarkBlue text-[16px]">
										Exercise
									</Text>
									<View className="pl-6 py-3">
										<ArrowRight />
									</View>
								</View>
							</TouchableOpacity>
						</View>
						<View>
							<TouchableOpacity onPress={() => handlePress("SocialActivity")}>
								<View className="flex flex-row justify-between">
									<Text className="font-ralewaySemiBold py-3 text-primaryDarkBlue text-[16px]">
										Social Activity
									</Text>
									<View className="pl-6 py-3">
										<ArrowRight />
									</View>
								</View>
							</TouchableOpacity>
						</View>
					</View>
				</View>

				<View className="mt-6">
					<Text className="mb-3 font-ralewaySemiBold text-primaryDarkBlue text-[16px]">
						Nutrition
					</Text>
					<View className="px-5 border border-[#EDECF4] rounded-lg bg-white">
						<View className="border-b border-b-[#EDECF4]">
							<TouchableOpacity onPress={() => handlePress("AddWater")}>
								<View className="flex flex-row justify-between">
									<Text className="font-ralewaySemiBold py-3 text-primaryDarkBlue text-[16px]">
										Water
									</Text>
									<View className="pl-6 py-3">
										<ArrowRight />
									</View>
								</View>
							</TouchableOpacity>
						</View>
						<View className="border-b border-b-[#EDECF4]">
							<TouchableOpacity onPress={() => handlePress("Meal")}>
								<View className="flex flex-row justify-between">
									<Text className="font-ralewaySemiBold py-3 text-primaryDarkBlue text-[16px]">
										Meals
									</Text>
									<View className="pl-6 py-3">
										<ArrowRight />
									</View>
								</View>
							</TouchableOpacity>
						</View>
						<View>
							<TouchableOpacity onPress={() => handlePress("AddSupplement")}>
								<View className="flex flex-row justify-between">
									<Text className="font-ralewaySemiBold py-3 text-primaryDarkBlue text-[16px]">
										Supplement
									</Text>
									<View className="pl-6 py-3">
										<ArrowRight />
									</View>
								</View>
							</TouchableOpacity>
						</View>
					</View>
				</View>

				<View className="mt-6">
					<Text className="mb-3 font-ralewaySemiBold text-primaryDarkBlue text-[16px]">
						Everyday Activities
					</Text>
					<View className="px-5 border border-[#EDECF4] rounded-lg bg-white">
						<View className="border-b border-b-[#EDECF4]">
							<TouchableOpacity onPress={() => handlePress("AddPersonalCare")}>
								<View className="flex flex-row justify-between">
									<Text className="font-ralewaySemiBold py-3 text-primaryDarkBlue text-[16px]">
										Household/Personal Care
									</Text>
									<View className="pl-6 py-3">
										<ArrowRight />
									</View>
								</View>
							</TouchableOpacity>
						</View>
						<View>
							<TouchableOpacity onPress={() => handlePress("AddMobility")}>
								<View className="flex flex-row justify-between">
									<Text className="font-ralewaySemiBold py-3 text-primaryDarkBlue text-[16px]">
										Mobality
									</Text>
									<View className="pl-6 py-3">
										<ArrowRight />
									</View>
								</View>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</ScrollView>
		</View>
	);
};

export default LifestyleSection;

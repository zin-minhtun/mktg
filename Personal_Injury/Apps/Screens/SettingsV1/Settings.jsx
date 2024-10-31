import {
	SafeAreaView,
	ScrollView,
	View,
	Text,
	TextInput,
	TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import ArrowRight from "../../Components/Icons/ArrowRight";
import ArrowDown from "../../Components/Icons/ArrowDown";
import UserIcon from "./svg/UserIcon";
import LockIcon from "./svg/LockIcon";
import FileAddIcon from "./svg/FileAddIcon";
import AlarmClockIcon from "./svg/AlarmClockIcon";
import ExportIcon from "./svg/ExportIcon";
import ExportOutIcon from "./svg/ExportOutIcon";
import FavoriteFillIcon from "./svg/FavoriteFillIcon";
import HappyIcon from "./svg/HappyIcon";
import PaperFill from "./svg/PaperFill";
import StarFillIcon from "./svg/StartFillIcon";
import SendFillIcon from "./svg/SendFillIcon";
import ChatFillIcon from "./svg/ChatFillIcon";

const Settings = ({ navigation }) => {

	const handlePress = (screen) => {
		navigation.push("SettingsNavigatorV1", {
			screen,
		});
	};

	return (
		<SafeAreaView className="flex-1 bg-[#FAFBFC]">
			<ScrollView
				contentContainerStyle={{ paddingBottom: 20 }}
				showsVerticalScrollIndicator={false}
			>
				<View className="mx-4">
					<View className="pt-8 pb-5">
						<Text className="font-ralewayBold text-[32px] text-primaryDarkBlue">
							Settings
						</Text>
					</View>

					<View className="">
						<Text className="mb-3 font-ralewaySemiBold text-primaryDarkBlue text-[16px]">
							Account
						</Text>
						<View className="px-5 border border-[#EDECF4] rounded-lg bg-white">
							<View className="border-b border-b-[#EDECF4]">
								<TouchableOpacity onPress={() => handlePress("Profile")}>
									<View className="flex flex-row justify-between items-center py-4">
										<View className="flex flex-row items-center">
											<UserIcon />
											<Text className="font-ralewaySemiBold text-primaryDarkBlue text-[16px] ml-2">
												Emma Stone
											</Text>
										</View>

										<ArrowRight className="ml-auto" />
									</View>
								</TouchableOpacity>
							</View>
							<View className="">
								<TouchableOpacity onPress={() => handlePress("Meal")}>
									<View className="flex flex-row justify-between items-center py-4">
										<View className="flex flex-row items-center">
											<LockIcon />
											<Text className="font-ralewaySemiBold text-primaryDarkBlue text-[16px] ml-2">
												Security
											</Text>
										</View>

										<ArrowRight className="ml-auto" />
									</View>
								</TouchableOpacity>
							</View>
						</View>
					</View>

					<View className="mt-6">
						<Text className="mb-3 font-ralewaySemiBold text-primaryDarkBlue text-[16px]">
							Health Record
						</Text>
						<View className="px-5 border border-[#EDECF4] rounded-lg bg-white">
							<View className="">
								<TouchableOpacity onPress={() => handlePress("Meal")}>
									<View className="flex flex-row justify-between items-center py-4">
										<View className="flex flex-row items-center">
											<FileAddIcon />
											<Text className="font-ralewaySemiBold text-primaryDarkBlue text-[16px] ml-2">
												My Health Record
											</Text>
										</View>

										<ArrowRight className="ml-auto" />
									</View>
								</TouchableOpacity>
							</View>
						</View>
					</View>

					<View className="mt-6">
						<Text className="mb-3 font-ralewaySemiBold text-primaryDarkBlue text-[16px]">
							App Preferences
						</Text>
						<View className="px-5 border border-[#EDECF4] rounded-lg bg-white">
							<View className="border-b border-b-[#EDECF4]">
								<TouchableOpacity onPress={() => handlePress("AddWater")}>
									<View className="flex flex-row justify-between items-center py-4">
										<View className="flex flex-row items-center">
											<AlarmClockIcon />
											<Text className="font-ralewaySemiBold text-primaryDarkBlue text-[16px] ml-2">
												Reminders
											</Text>
										</View>

										<ArrowRight className="ml-auto" />
									</View>
								</TouchableOpacity>
							</View>
							<View className="">
								<TouchableOpacity onPress={() => handlePress("Meal")}>
									<View className="flex flex-row justify-between items-center py-4">
										<View className="flex flex-row items-center">
											<ExportIcon />
											<Text className="font-ralewaySemiBold text-primaryDarkBlue text-[16px] ml-2">
												Data Share
											</Text>
										</View>

										<ArrowRight className="ml-auto" />
									</View>
								</TouchableOpacity>
							</View>
						</View>
					</View>

					<View className="mt-6">
						<Text className="mb-3 font-ralewaySemiBold text-primaryDarkBlue text-[16px]">
							Resources
						</Text>
						<View className="px-5 border border-[#EDECF4] rounded-lg bg-white">
							<View className="border-b border-b-[#EDECF4]">
								<TouchableOpacity onPress={() => handlePress("AddWater")}>
									<View className="flex flex-row justify-between items-center py-4">
										<View className="flex flex-row items-center">
											<FavoriteFillIcon />
											<Text className="font-ralewaySemiBold text-primaryDarkBlue text-[16px] ml-2">
												Join the Community
											</Text>
										</View>

										<ExportOutIcon className="ml-auto" />
									</View>
								</TouchableOpacity>
							</View>
							<View className="border-b border-b-[#EDECF4]">
								<TouchableOpacity onPress={() => handlePress("Meal")}>
									<View className="flex flex-row justify-between items-center py-4">
										<View className="flex flex-row items-center">
											<HappyIcon />
											<Text className="font-ralewaySemiBold text-primaryDarkBlue text-[16px] ml-2">
												DIY Stretch Exercises
											</Text>
										</View>

										<ExportOutIcon className="ml-auto" />
									</View>
								</TouchableOpacity>
							</View>
							<View className="">
								<TouchableOpacity onPress={() => handlePress("Meal")}>
									<View className="flex flex-row justify-between items-center py-4">
										<View className="flex flex-row items-center">
											<PaperFill />
											<Text className="font-ralewaySemiBold text-primaryDarkBlue text-[16px] ml-2">
												Legal
											</Text>
										</View>

										<ArrowRight className="ml-auto" />
									</View>
								</TouchableOpacity>
							</View>
						</View>
					</View>

					<View className="mt-6">
						<Text className="mb-3 font-ralewaySemiBold text-primaryDarkBlue text-[16px]">
							Support the App
						</Text>
						<View className="px-5 border border-[#EDECF4] rounded-lg bg-white">
							<View className="border-b border-b-[#EDECF4]">
								<TouchableOpacity onPress={() => handlePress("AddWater")}>
									<View className="flex flex-row justify-between items-center py-4">
										<View className="flex flex-row items-center">
											<StarFillIcon />
											<Text className="font-ralewaySemiBold text-primaryDarkBlue text-[16px] ml-2">
												Rate the App
											</Text>
										</View>

										<ExportOutIcon className="ml-auto" />
									</View>
								</TouchableOpacity>
							</View>
							<View className="border-b border-b-[#EDECF4]">
								<TouchableOpacity onPress={() => handlePress("Meal")}>
									<View className="flex flex-row justify-between items-center py-4">
										<View className="flex flex-row items-center">
											<SendFillIcon />
											<Text className="font-ralewaySemiBold text-primaryDarkBlue text-[16px] ml-2">
												Share the App
											</Text>
										</View>

										<ExportOutIcon className="ml-auto" />
									</View>
								</TouchableOpacity>
							</View>
							<View className="">
								<TouchableOpacity onPress={() => handlePress("Meal")}>
									<View className="flex flex-row justify-between items-center py-4">
										<View className="flex flex-row items-center">
											<ChatFillIcon />
											<Text className="font-ralewaySemiBold text-primaryDarkBlue text-[16px] ml-2">
												Make a Suggestion
											</Text>
										</View>

										<ArrowRight className="ml-auto" />
									</View>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default Settings;

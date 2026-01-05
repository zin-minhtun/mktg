import {
	ScrollView,
	View,
	Text,
	TextInput,
	TouchableOpacity,
	Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import ArrowRight from "../../Icons/ArrowRight";
import ArrowDown from "../../Icons/ArrowDown";
import axios from "axios";
import { API_URL } from "@env";
import { useUserData } from "../../../Contexts/UserContext";
import { useTheme } from "../../../Contexts/ThemeContext";
import dayjs from "dayjs";
import { useFocusEffect } from "@react-navigation/native";

const LifestyleSection = ({ navigation, selectedDate }) => {
	const { gUser } = useUserData();
	const { theme } = useTheme();
	const [selectedUnit, setSelectedUnit] = useState("kg"); // State to store selected unit
	const [weight, setWeight] = useState("");
	const [lastSavedWeight, setLastSavedWeight] = useState("");

	const handleUnitSelect = (unit) => {
		setSelectedUnit(unit);
	};

	const handlePress = (screen) => {
		navigation.push("JournalNavigator", {
			screen,
			params: { selectedDate }
		});
	};

	const fetchLatestWeight = async () => {
		if (!gUser?._id) return;
		try {
			const response = await axios.get(`${API_URL}/api/v1/body-compositions`, {
				params: { userId: gUser._id }
			});
			const data = response.data;
			if (data && data.length > 0) {
				const latest = data[0]; // sorted by date desc in controller
				setWeight(String(latest.weight));
				setLastSavedWeight(String(latest.weight));
				if (latest.unit) setSelectedUnit(latest.unit);
			}
		} catch (e) {
			console.log("Failed to fetch weight", e);
		}
	};

	useFocusEffect(
		React.useCallback(() => {
			fetchLatestWeight();
		}, [gUser?._id])
	);

	const saveWeight = async () => {
		if (!weight || weight === lastSavedWeight) return;
		if (!gUser?._id) return;

		try {
			const payload = {
				userId: gUser._id,
				weight: Number(weight),
				unit: selectedUnit,
				date: selectedDate || dayjs().toISOString(),
			};
			await axios.post(`${API_URL}/api/v1/body-compositions`, payload);
			setLastSavedWeight(weight);
			// Optional: Feedback? Maybe too intrusive.
		} catch (e) {
			console.error("Failed to save weight", e);
			Alert.alert("Error", "Failed to save weight.");
		}
	};

	return (
		<View className="flex-1 px-4 mt-3" style={{ backgroundColor: theme.background }}>
			<ScrollView
				contentContainerStyle={{ paddingBottom: 20 }}
				showsVerticalScrollIndicator={false}
			>
				<View className="flex flex-row mt-5 space-x-3">
					<TextInput
						className="font-raleway flex-1 text-[16px] h-[46px] border rounded-lg p-2 px-5"
						style={{ backgroundColor: theme.textFieldBG, borderColor: theme.borderColor, color: theme.textColor }}
						placeholder="Weight"
						placeholderTextColor={theme.darkGrey}
						keyboardType="numeric"
						value={weight}
						onChangeText={setWeight}
						onEndEditing={saveWeight}
						returnKeyType="done"
					/>
					<View className="flex flex-row">
						<TouchableOpacity
							onPress={() => handleUnitSelect("kg")}
							className={`p-3 border rounded-l-lg`}
							style={{
								backgroundColor: selectedUnit === "kg" ? theme.primaryLighBlue : theme.textFieldBG,
								borderColor: theme.primaryLighBlue // using primaryLighBlue as distinct color
							}}
						>
							<Text
								className="font-ralewaySemiBold text-[14px]"
								style={{ color: selectedUnit === "kg" ? "#FFFFFF" : theme.textColor }}
							>
								kg
							</Text>
						</TouchableOpacity>

						<TouchableOpacity
							onPress={() => handleUnitSelect("lbs")}
							className={`p-3 border rounded-r-lg`}
							style={{
								backgroundColor: selectedUnit === "lbs" ? theme.primaryLighBlue : theme.textFieldBG,
								borderColor: theme.primaryLighBlue
							}}
						>
							<Text
								className="font-ralewaySemiBold text-[14px]"
								style={{ color: selectedUnit === "lbs" ? "#FFFFFF" : theme.textColor }}
							>
								lbs
							</Text>
						</TouchableOpacity>
					</View>
				</View>

				<View className="mt-5">
					<View className="px-5 border rounded-lg" style={{ backgroundColor: theme.textFieldBG, borderColor: theme.borderColor }}>
						<View className="border-b" style={{ borderBottomColor: theme.borderColor }}>
							<TouchableOpacity onPress={() => handlePress("Exercise")}>
								<View className="flex flex-row justify-between">
									<Text className="font-ralewaySemiBold py-3 text-[16px]" style={{ color: theme.textColor }}>
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
									<Text className="font-ralewaySemiBold py-3 text-[16px]" style={{ color: theme.textColor }}>
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
					<Text className="mb-3 font-ralewaySemiBold text-[16px]" style={{ color: theme.textColor }}>
						Nutrition
					</Text>
					<View className="px-5 border rounded-lg" style={{ backgroundColor: theme.textFieldBG, borderColor: theme.borderColor }}>
						<View className="border-b" style={{ borderBottomColor: theme.borderColor }}>
							<TouchableOpacity onPress={() => handlePress("AddWater")}>
								<View className="flex flex-row justify-between">
									<Text className="font-ralewaySemiBold py-3 text-[16px]" style={{ color: theme.textColor }}>
										Water
									</Text>
									<View className="pl-6 py-3">
										<ArrowRight />
									</View>
								</View>
							</TouchableOpacity>
						</View>
						<View className="border-b" style={{ borderBottomColor: theme.borderColor }}>
							<TouchableOpacity onPress={() => handlePress("Meal")}>
								<View className="flex flex-row justify-between">
									<Text className="font-ralewaySemiBold py-3 text-[16px]" style={{ color: theme.textColor }}>
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
									<Text className="font-ralewaySemiBold py-3 text-[16px]" style={{ color: theme.textColor }}>
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
					<Text className="mb-3 font-ralewaySemiBold text-[16px]" style={{ color: theme.textColor }}>
						Everyday Activities
					</Text>
					<View className="px-5 border rounded-lg" style={{ backgroundColor: theme.textFieldBG, borderColor: theme.borderColor }}>
						<View className="border-b" style={{ borderBottomColor: theme.borderColor }}>
							<TouchableOpacity onPress={() => handlePress("AddPersonalCare")}>
								<View className="flex flex-row justify-between">
									<Text className="font-ralewaySemiBold py-3 text-[16px]" style={{ color: theme.textColor }}>
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
									<Text className="font-ralewaySemiBold py-3 text-[16px]" style={{ color: theme.textColor }}>
										Mobility
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

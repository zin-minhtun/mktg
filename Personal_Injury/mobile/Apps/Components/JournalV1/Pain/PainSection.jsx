import React, { useState, useCallback } from "react";
import { Text, View, ActivityIndicator, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { API_URL } from "@env";
import { useUserData } from "../../../Contexts/UserContext";
import { useTheme } from "../../../Contexts/ThemeContext";
import DecoratedAddBtn from "../DecoratedAddBtn";
import Pain from "../../Icons/Pain";

const PainSection = ({ navigation, selectedDate }) => {
	const { gUser } = useUserData();
	const { theme } = useTheme();
	const [painRecords, setPainRecords] = useState([]);
	const [loading, setLoading] = useState(false);

	const fetchPainRecords = useCallback(async () => {
		if (!gUser?._id) return;
		setLoading(true);

		try {
			const response = await axios.get(
				`${API_URL}/api/pains/user/${gUser._id}`,
				{
					params: {
						date: selectedDate,
					},
				}
			);
			setPainRecords(response.data.data || []);
		} catch (error) {
			console.error("Error fetching pain records:", error);
		}

		// Wait 2 seconds before hiding loading
		setTimeout(() => {
			setLoading(false);
		}, 2000);
	}, [gUser, selectedDate]);

	useFocusEffect(
		useCallback(() => {
			fetchPainRecords();
		}, [fetchPainRecords])
	);

	const handleDelete = async (painId) => {
		try {
			await axios.delete(`${API_URL}/api/pains/${painId}`);
			Alert.alert("Success", "Pain record deleted successfully");
			fetchPainRecords();
		} catch (e) {
			console.error("Delete error:", e);
			Alert.alert("Error", "Failed to delete pain record");
		}
	};

	return (
		<View className="flex-1 relative pb-29">
			<ScrollView contentContainerStyle={{ paddingBottom: 100 }} className="px-4 pt-4">
				{loading ? (
					<ActivityIndicator size="large" color="#1E40AF" />
				) : painRecords.length > 0 ? (
					painRecords.map((pain, index) => (
						<TouchableOpacity
							key={pain._id || index}
							onPress={() => {
								Alert.alert(
									"Manage Pain Record",
									`What would you like to do with this pain record?`,
									[
										{ text: "Cancel", style: "cancel" },
										{
											text: "Delete",
											style: "destructive",
											onPress: () => handleDelete(pain._id)
										},
										{
											text: "Edit",
											onPress: () => navigation.navigate("JournalNavigator", {
												screen: "AddPainCardDetails",
												params: { painRecord: pain }
											})
										}
									]
								);
							}}
							className="p-4 rounded-xl mb-3 border flex-row justify-between items-center shadow-sm min-h-[88px]"
							style={{ backgroundColor: theme.textFieldBG, borderColor: theme.borderColor }}
						>
							<View className="flex-1">
								<Text className="font-ralewayBold text-[16px]" style={{ color: theme.textColor }}>
									{pain.painName || pain.painLocation || "Pain Record"}
								</Text>
								<Text className="font-raleway text-[14px] mt-1" style={{ color: theme.darkGrey }}>
									Intensity: {pain.intensity}/10{pain.painType && pain.painType.length > 0 ? ` • ${Array.isArray(pain.painType) ? pain.painType.join(', ').replace(/_/g, ' ') : pain.painType.replace(/_/g, ' ')}` : ''}
								</Text>
							</View>
						</TouchableOpacity>
					))
				) : (
					<View className="items-center mt-10">
						<Pain />
						<View className="items-center mt-6">
							<Text className="text-[20px] font-ralewaySemiBold" style={{ color: theme.textColor }}>
								You don't have any records.
							</Text>
							<Text className="text-[16px] pt-1.5 font-raleway" style={{ color: theme.darkGrey }}>
								Click the plus button to add a Pain Card
							</Text>
						</View>
					</View>
				)}
			</ScrollView>

			<DecoratedAddBtn navigation={navigation} screen={"AddPainCardDetails"} selectedDate={selectedDate} />
		</View>
	);
};

export default PainSection;
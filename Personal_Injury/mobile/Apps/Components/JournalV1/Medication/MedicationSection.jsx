import React, { useState, useEffect, useCallback } from "react";
import { Text, View, ActivityIndicator, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { API_URL } from "@env";
import { useUserData } from "../../../Contexts/UserContext";
import { useTheme } from "../../../Contexts/ThemeContext";
import DecoratedAddBtn from "../DecoratedAddBtn";
import Pain from "../../Icons/Pain";

const MedicationSection = ({ navigation, selectedDate }) => {
	const { gUser } = useUserData();
	const { theme } = useTheme();
	const [medications, setMedications] = useState([]);
	const [loading, setLoading] = useState(false);

	const fetchMedications = useCallback(async () => {
		if (!gUser?._id) return;
		setLoading(true);
		try {
			const response = await axios.get(
				`${API_URL}/api/meds/records/${gUser._id}`,
				{
					params: {
						date: selectedDate,
					},
				}
			);
			setMedications(response.data.data || []);
		} catch (error) {
			console.error("Error fetching medications:", error);
		} finally {
			setLoading(false);
		}
	}, [gUser, selectedDate]);

	useFocusEffect(
		useCallback(() => {
			fetchMedications();
		}, [fetchMedications])
	);

	const handleDelete = async (medId) => {
		try {
			await axios.delete(`${API_URL}/api/meds/delete/${medId}`);
			fetchMedications();
		} catch (e) {
			Alert.alert("Error", "Failed to delete medication");
		}
	};

	return (
		<View className="flex-1 relative pb-24">
			<ScrollView contentContainerStyle={{ paddingBottom: 100 }} className="px-4 pt-4">
				{loading ? (
					<ActivityIndicator size="small" color="#00B8DF" />
				) : medications.length > 0 ? (
					medications.map((med, index) => (
						<TouchableOpacity
							key={med._id || index}
							onPress={() => {
								Alert.alert(
									"Manage Medication",
									`What would you like to do with ${med.medicationName}?`,
									[
										{ text: "Cancel", style: "cancel" },
										{
											text: "Delete",
											style: "destructive",
											onPress: () => handleDelete(med._id)
										},
										{
											text: "Edit",
											onPress: () => navigation.navigate("JournalNavigator", {
												screen: "AddMedicationDetails",
												params: { medication: med }
											})
										}
									]
								);
							}}
							className="p-4 rounded-xl mb-3 border flex-row justify-between items-center shadow-sm"
							style={{ backgroundColor: theme.textFieldBG, borderColor: theme.borderColor }}
						>
							<View>
								<Text className="font-ralewayBold text-[16px]" style={{ color: theme.textColor }}>{med.medicationName}</Text>
								<Text className="font-raleway text-[14px] mt-1" style={{ color: theme.darkGrey }}>
									{med.dosage} {med.unit ? med.unit.replace(/_/g, ' ') : ''} • {med.frequency ? med.frequency.replace(/_/g, ' ') : ''}
								</Text>
								{med.reminderTime && (
									<Text className="font-raleway text-[#00B8DF] text-[12px] mt-1">
										Reminder: {med.reminderTime}
									</Text>
								)}
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
								Click the plus button to add
							</Text>
						</View>
					</View>
				)}
			</ScrollView>

			<DecoratedAddBtn navigation={navigation} screen={"AddMedicationDetails"} />
		</View >
	);
};

export default MedicationSection;

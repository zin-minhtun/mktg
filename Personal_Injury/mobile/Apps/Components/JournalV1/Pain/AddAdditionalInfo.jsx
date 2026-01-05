import {
	ScrollView,
	View,
	Text,
	TextInput,
	TouchableOpacity,
	Alert,
	ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { styled } from "nativewind";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from "@env";
import { useTheme } from "../../../Contexts/ThemeContext";

// Components
import AudioInputIcon from "../../Icons/AudioInputIcon";
import CheckIcon from "../../Icons/CheckIcon";
import CrossIcon from "../../Icons/CrossIcon";
import { SafeAreaView } from "react-native-safe-area-context";

const StyledTextInput = styled(TextInput);

const InputField = ({ label, value, onChangeText, onClear, theme }) => (
	<View className="mt-6">
		<Text className="font-ralewaySemiBold mb-3 text-[15px]" style={{ color: theme.textColor }}>
			{label}
		</Text>

		<StyledTextInput
			multiline
			value={value}
			onChangeText={onChangeText}
			placeholder="Add notes"
			placeholderTextColor={theme.darkGrey}
			className="font-raleway text-[16px] h-[84px] p-3 border rounded-lg focus:border-primaryBlue"
			style={{
				textAlignVertical: "top",
				backgroundColor: theme.textFieldBG,
				borderColor: theme.borderColor,
				color: theme.textColor
			}}
		/>

		<View className="flex-row justify-end mt-3">
			<View className="justify-center items-center mr-6 rounded-full w-10 h-10" style={{ backgroundColor: theme.primaryLighBlue }}>
				<AudioInputIcon />
			</View>
			<TouchableOpacity
				onPress={onClear}
				disabled={value.length === 0}
				className={`justify-center items-center mr-3 rounded-full w-10 h-10`}
				style={{ backgroundColor: value.length > 0 ? "#FDA29B80" : (theme.mode === 'dark' ? '#003361' : '#E0E0E0') }}
			>
				<CrossIcon isActive={value.length > 0} />
			</TouchableOpacity>
			<View
				className={`justify-center items-center rounded-full w-10 h-10`}
				style={{ backgroundColor: value.length > 0 ? theme.primaryLighBlue : (theme.mode === 'dark' ? '#003361' : '#E0E0E0') }}
			>
				<CheckIcon isActive={value.length > 0} />
			</View>
		</View>
	</View>
);

const AddAdditionalInfo = ({ route, navigation }) => {
	const { theme } = useTheme();
	// Get pain data from previous screen
	const { painData, painRecord, selectedDate } = route.params || {};
	const isEditing = !!painRecord;

	// Separate state for each question
	const [reliefFactors, setReliefFactors] = useState("");
	const [triggers, setTriggers] = useState("");
	const [limitations, setLimitations] = useState("");
	const [worseningActivities, setWorseningActivities] = useState("");
	const [improvingActivities, setImprovingActivities] = useState("");
	const [painDistribution, setPainDistribution] = useState("");
	const [painPattern, setPainPattern] = useState("");
	const [additionalNotes, setAdditionalNotes] = useState("");

	const [isLoading, setIsLoading] = useState(false);

	// Populate form with existing data if editing
	useEffect(() => {
		if (painRecord) {
			setReliefFactors(painRecord.reliefFactors || "");
			setTriggers(painRecord.triggers || "");
			setLimitations(painRecord.limitations || "");
			setWorseningActivities(painRecord.worseningActivities || "");
			setImprovingActivities(painRecord.improvingActivities || "");
			setPainDistribution(painRecord.painDistribution || "");
			setPainPattern(painRecord.painPattern || "");
			setAdditionalNotes(painRecord.additionalNotes || "");
		}
	}, [painRecord]);

	// Clear individual field
	const clearField = (setter) => {
		setter("");
	};

	// Form validation - all fields must be filled
	const isFormValid =
		reliefFactors.trim().length > 0 &&
		triggers.trim().length > 0 &&
		limitations.trim().length > 0 &&
		worseningActivities.trim().length > 0 &&
		improvingActivities.trim().length > 0 &&
		painDistribution.trim().length > 0 &&
		painPattern.trim().length > 0 &&
		additionalNotes.trim().length > 0;

	// Submit all data to backend
	const handleSubmit = async () => {
		// Validate form before submitting
		if (!isFormValid) {
			Alert.alert('Validation Error', 'Please fill in all fields');
			return;
		}

		try {
			setIsLoading(true);

			// Get userId from AsyncStorage or your auth context
			const userId = await AsyncStorage.getItem('userId');

			if (!userId) {
				Alert.alert('Error', 'User not authenticated');
				setIsLoading(false);
				return;
			}

			// Prepare complete pain log data
			const painLogData = {
				...painData,
				userId,
				reliefFactors: reliefFactors.trim() || undefined,
				triggers: triggers.trim() || undefined,
				limitations: limitations.trim() || undefined,
				worseningActivities: worseningActivities.trim() || undefined,
				improvingActivities: improvingActivities.trim() || undefined,
				painDistribution: painDistribution.trim() || undefined,
				painPattern: painPattern.trim() || undefined,
				additionalNotes: additionalNotes.trim() || undefined,
				date: selectedDate || undefined,
			};

			if (isEditing) {
				// Update existing pain record
				// Get JWT token
				const token = await AsyncStorage.getItem('userToken');

				const response = await fetch(`${API_URL}/api/pains/${painRecord._id}`, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': token ? `Bearer ${token}` : '',
					},
					body: JSON.stringify(painLogData),
				});

				const data = await response.json();

				if (response.ok) {
					navigation.navigate("Journal", {
						screen: "JournalV1",
						params: { activeNavItem: "pain" },
					});
					Alert.alert('Success', 'Pain log updated successfully');
				} else {
					Alert.alert('Error', data.message || 'Failed to update pain log');
				}
			} else {
				// Create new pain record
				// Get JWT token
				const token = await AsyncStorage.getItem('userToken');

				const response = await fetch(`${API_URL}/api/pains/add`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': token ? `Bearer ${token}` : '',
					},
					body: JSON.stringify(painLogData),
				});

				const data = await response.json();

				if (response.ok) {
					// Track pain log submission for smart notification suppression
					await AsyncStorage.setItem('last_pain_log_date', new Date().toDateString());
					console.log('[PainLog] Marked today as pain logged - will suppress daily check-in');

					navigation.navigate("Journal", {
						screen: "JournalV1",
						params: { activeNavItem: "pain" },
					});
					Alert.alert('Success', 'Pain log added successfully');
				} else {
					Alert.alert('Error', data.message || 'Failed to add pain log');
				}
			}
		} catch (error) {
			console.error('Error submitting pain log:', error);
			Alert.alert('Error', 'An error occurred. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<View className="flex-1 mt-6" style={{ backgroundColor: theme.background }}>
			<SafeAreaView>
				<View className="mt-6 px-4">
					<ScrollView
						contentContainerStyle={{ paddingBottom: 250 }}
						showsVerticalScrollIndicator={false}
					>
						<InputField
							label="What made the pain go away or feel better"
							value={reliefFactors}
							onChangeText={setReliefFactors}
							onClear={() => clearField(setReliefFactors)}
							theme={theme}
						/>

						<InputField
							label="What triggered the pain"
							value={triggers}
							onChangeText={setTriggers}
							onClear={() => clearField(setTriggers)}
							theme={theme}
						/>

						<InputField
							label="How does the pain limit what you can do"
							value={limitations}
							onChangeText={setLimitations}
							onClear={() => clearField(setLimitations)}
							theme={theme}
						/>

						<InputField
							label="What activity worsened the pain"
							value={worseningActivities}
							onChangeText={setWorseningActivities}
							onClear={() => clearField(setWorseningActivities)}
							theme={theme}
						/>

						<InputField
							label="What activity improved the pain"
							value={improvingActivities}
							onChangeText={setImprovingActivities}
							onClear={() => clearField(setImprovingActivities)}
							theme={theme}
						/>

						<InputField
							label="Is your pain in one spot or spread out"
							value={painDistribution}
							onChangeText={setPainDistribution}
							onClear={() => clearField(setPainDistribution)}
							theme={theme}
						/>

						<InputField
							label="Is the pain constant or it comes and goes"
							value={painPattern}
							onChangeText={setPainPattern}
							onClear={() => clearField(setPainPattern)}
							theme={theme}
						/>

						<InputField
							label="Tell us more about your pain"
							value={additionalNotes}
							onChangeText={setAdditionalNotes}
							onClear={() => clearField(setAdditionalNotes)}
							theme={theme}
						/>

						<View className="absolute bottom-10 left-0 right-0">
							<TouchableOpacity
								className={`w-full py-4 rounded-full ${isFormValid ? "bg-primaryBlue" : "bg-gray-300"}`}
								onPress={handleSubmit}
								disabled={!isFormValid || isLoading}
							>
								<Text className="text-center text-white font-ralewaySemiBold text-[16px]">
									{isEditing ? 'Update' : 'Continue'}
								</Text>
							</TouchableOpacity>
						</View>
					</ScrollView>
				</View>
			</SafeAreaView>
		</View>
	);
};

export default AddAdditionalInfo;
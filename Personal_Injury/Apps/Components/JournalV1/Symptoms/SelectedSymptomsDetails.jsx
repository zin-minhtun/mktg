import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { useRoute } from "@react-navigation/native";

// Components
import ConfusionMenu from "./ConfusionMenu"; // Consider renaming to SymptomMenu if applicable
import NauseaMenu from "./NauseaMenu";

const SYMPTOM_COMPONENTS = {
	confusion: <ConfusionMenu />,
	balanceLoss: <Text>Balance Loss Details...</Text>, // Placeholder for actual component
	feelingDazed: <Text>Feeling Dazed Details...</Text>, // Placeholder
	tinnitus: <Text>Tinnitus Details...</Text>, // Placeholder
	noiseSensitivity: <Text>Noise Sensitivity Details...</Text>, // Placeholder
	lightSensitivity: <Text>Light Sensitivity Details...</Text>, // Placeholder
	nausea: <NauseaMenu />,
	consciousnessLoss: <Text>Loss of Consciousness Details...</Text>, // Placeholder
	affectedVision: <Text>Affected Vision Details...</Text>, // Placeholder
};

const SelectedSymptomsDetails = () => {
	const route = useRoute(); // Access the route object
	const { selectedSymptoms } = route.params; // Fetch the selected symptoms from params

	return (
		<View className="flex-1 bg-[#FAFBFC] px-4 mt-6">
			<ScrollView
				contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
				showsVerticalScrollIndicator={false}
				keyboardDismissMode="on-drag" // Dismiss the keyboard when scrolling
			>
				<View className="mt-8">
					<Text className="mb-10 font-ralewaySemiBold text-primaryDarkBlue text-[24px] leading-8">
						What can you tell us about the symptoms?
					</Text>

					{/* Render symptoms based on the selected symptoms */}
					{selectedSymptoms.map((symptomId) => (
						<View key={symptomId} className="mb-4">
							{SYMPTOM_COMPONENTS[symptomId] || (
								<Text>No details available for {symptomId}</Text>
							)}
						</View>
					))}
				</View>

				<View className="absolute bottom-5 left-0 right-0 py-4">
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

export default SelectedSymptomsDetails;

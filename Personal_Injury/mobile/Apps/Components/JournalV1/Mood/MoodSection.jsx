import {
	View,
	Text,
	TouchableOpacity,
	TextInput,
	ScrollView,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { styled } from "nativewind";
import Icon from "react-native-vector-icons/FontAwesome6";
import axios from "axios";
import { API_URL } from "@env";
import { useUserData } from "../../../Contexts/UserContext";
import { useTheme } from "../../../Contexts/ThemeContext";
import * as Progress from 'react-native-progress';
import { useFocusEffect } from "@react-navigation/native";

// Components
import HappyEmoji from "./svg/HappyEmoji";
import EnergisedEmoji from "./svg/EnergisedEmoji";
import ConfidentEmoji from "./svg/ConfidentEmoji";
import CalmEmoji from "./svg/CalmEmoji";
import RefreshedEmoji from "./svg/RefreshedEmoji";
import AngryEmoji from "./svg/AngryEmoji";
import AnxiousEmoji from "./svg/AnxiousEmoji";
import ConfusedEmoji from "./svg/ConfusedEmoji";
import DepressedEmoji from "./svg/DepressedEmoji";
import FatiguedEmoji from "./svg/FatiguedEmoji";
import GloomyEmoji from "./svg/GloomyEmoji";
import MeanEmoji from "./svg/MeanEmoji";
import IrritableEmoji from "./svg/IrritableEmoji";
import RestlessEmoji from "./svg/RestlessEmoji";
import HungryEmoji from "./svg/HungryEmoji";
import ScaredEmoji from "./svg/ScaredEmoji";
import SadEmoji from "./svg/SadEmoji";
import ImpatientEmoji from "./svg/ImpatientEmoji";
import SensitiveEmoji from "./svg/SensitiveEmoji";
import SickEmoji from "./svg/SickEmoji";
import SleepyEmoji from "./svg/SleepyEmoji";
import SpaceyEmoji from "./svg/SpaceyEmoji";
import StressedEmoji from "./svg/StressedEmoji";
import UnbalancedEmoji from "./svg/UnbalancedEmoji";

export const symptomsData = [
	{ id: "happy", name: "Happy", icon: <HappyEmoji />, score: 5 },
	{ id: "energised", name: "Energised", icon: <EnergisedEmoji />, score: 5 },
	{ id: "confident", name: "Confident", icon: <ConfidentEmoji />, score: 4 },
	{ id: "calm", name: "Calm", icon: <CalmEmoji />, score: 5 },
	{ id: "refreshed", name: "Refreshed", icon: <RefreshedEmoji />, score: 5 },
	{ id: "angry", name: "Angry", icon: <AngryEmoji />, score: 1 },
	{ id: "anxious", name: "Anxious", icon: <AnxiousEmoji />, score: 2 },
	{ id: "confused", name: "Confused", icon: <ConfusedEmoji />, score: 2 },
	{ id: "depressed", name: "Depressed", icon: <DepressedEmoji />, score: 1 },
	{ id: "fatigued", name: "Fatigued", icon: <FatiguedEmoji />, score: 1 },
	{ id: "gloomy", name: "Gloomy", icon: <GloomyEmoji />, score: 1 },
	{ id: "mean", name: "Mean", icon: <MeanEmoji />, score: 1 },
	{ id: "irritable", name: "Irritable", icon: <IrritableEmoji />, score: 2 },
	{ id: "restless", name: "Restless", icon: <RestlessEmoji />, score: 2 },
	{ id: "hungry", name: "Hungry", icon: <HungryEmoji />, score: 3 },
	{ id: "impatient", name: "Impatient", icon: <ImpatientEmoji />, score: 2 },
	{ id: "sad", name: "Sad", icon: <SadEmoji />, score: 1 },
	{ id: "scared", name: "Scared", icon: <ScaredEmoji />, score: 1 },
	{ id: "sensitive", name: "Sensitive", icon: <SensitiveEmoji />, score: 3 },
	{ id: "sick", name: "Sick", icon: <SickEmoji />, score: 1 },
	{ id: "sleepy", name: "Sleepy", icon: <SleepyEmoji />, score: 3 },
	{ id: "spacey", name: "Spacey", icon: <SpaceyEmoji />, score: 3 },
	{ id: "stressed", name: "Stressed", icon: <StressedEmoji />, score: 1 },
	{ id: "unbalanced", name: "Unbalanced", icon: <UnbalancedEmoji />, score: 2 },
];

const MoodSection = ({ navigation, selectedDate }) => {
	const [selectedSymptoms, setSelectedSymptoms] = useState([]);
	const [showScrollToTop, setShowScrollToTop] = useState(false);
	const { gUser } = useUserData();
	const { theme } = useTheme();
	const scrollViewRef = useRef();

	const handleSymptomSelect = (id) => {
		// Single select enforcement for better scoring logic
		if (selectedSymptoms.includes(id)) {
			setSelectedSymptoms([]);
		} else {
			setSelectedSymptoms([id]);
		}
	};

	const handleSave = async () => {
		if (selectedSymptoms.length === 0) {
			alert("Please select your mood.");
			return;
		}

		try {
			const today = new Date().toISOString().split('T')[0];
			const symptomObj = symptomsData.find(s => s.id === selectedSymptoms[0]);
			const primaryMood = symptomObj?.name || "Unknown";
			const score = symptomObj?.score || 3;

			const payload = {
				userId: gUser._id,
				date: selectedDate || today,
				mood: primaryMood,
				moodScale: score,
				timeOfDay: "am",
				notes: selectedSymptoms.join(", "),
			};

			await axios.post(`${API_URL}/api/moods/add`, payload);
			// alert("Mood saved successfully!");
			setSelectedSymptoms([]);
			navigation.navigate("MoodRecords");
		} catch (error) {
			console.error("Error saving mood:", error);
			alert("Failed to save mood.");
		}
	};

	const handleScroll = (event) => {
		const offsetY = event.nativeEvent.contentOffset.y;
		setShowScrollToTop(offsetY > 100);
	};

	const scrollToTop = () => {
		scrollViewRef.current.scrollTo({ y: 0, animated: true });
	};

	// --- Render Selection View ---
	return (
		<View className="flex-1 px-4 mt-6 relative" style={{ backgroundColor: theme.background }}>
			<ScrollView
				ref={scrollViewRef}
				contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
				showsVerticalScrollIndicator={false}
				onScroll={handleScroll}
				scrollEventThrottle={16}
			>
				<Text className="mb-3 font-ralewayBold text-[24px] text-center leading-8" style={{ color: theme.textColor }}>
					Tell us how you're feeling today
				</Text>

				<View className="flex flex-wrap flex-row justify-between pt-5 px-3 gap-y-4">
					{symptomsData.map((symptom) => (
						<View className="items-center w-28 mb-4" key={symptom.id}>
							<TouchableOpacity
								onPress={() => handleSymptomSelect(symptom.id)}
								className={`rounded-lg w-24 h-24 justify-center items-center border ${selectedSymptoms.includes(symptom.id)
									? "border-2 border-primaryBlue bg-[#E5F6FB]"
									: ""
									}`}
								style={!selectedSymptoms.includes(symptom.id) ? { backgroundColor: theme.textFieldBG, borderColor: theme.borderColor } : undefined}
							>
								<View
									style={{
										overflow: "hidden",
										shadowColor: "#000",
										shadowOffset: { width: 0, height: 0 },
										shadowOpacity: 0.4,
										shadowRadius: 5,
										alignItems: "center",
										justifyContent: "center",
									}}
								>
									{symptom.icon}
								</View>

								<Text className="font-raleway text-[14px] pb-2 text-center" style={{ color: theme.darkGrey }}>
									{symptom.name}
								</Text>
							</TouchableOpacity>
						</View>
					))}
				</View>
			</ScrollView>

			<View className="absolute bottom-5 left-0 right-0 px-4">
				<TouchableOpacity
					onPress={handleSave}
					className="w-full bg-primaryBlue py-4 rounded-full items-center shadow-md"
				>
					<Text className="text-white font-ralewayBold text-lg">Save Mood</Text>
				</TouchableOpacity>
			</View>

			{/* Scroll to Top Button */}
			{showScrollToTop && (
				<TouchableOpacity
					onPress={scrollToTop}
					className="absolute bottom-24 right-4 bg-primaryBlue rounded-full w-[44px] h-[44px] items-center justify-center shadow-lg"
					style={{ elevation: 5 }}
				>
					<Icon name="angle-up" size={24} color="white" />
				</TouchableOpacity>
			)}
		</View>
	);
};

export default MoodSection;

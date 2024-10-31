import {
	View,
	Text,
	TouchableOpacity,
	TextInput,
	ScrollView,
	Animated,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { styled } from "nativewind";
import Icon from "react-native-vector-icons/FontAwesome6";

// Components
import AudioInputIcon from "../../Icons/AudioInputIcon";
import CheckIcon from "../../Icons/CheckIcon";
import CrossIcon from "../../Icons/CrossIcon";
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

const StyledTextInput = styled(TextInput);
const symptomsData = [
	{ id: "happy", name: "Happy", icon: <HappyEmoji /> },
	{ id: "energised", name: "Energised", icon: <EnergisedEmoji /> },
	{ id: "confident", name: "Confident", icon: <ConfidentEmoji /> },
	{ id: "calm", name: "Calm", icon: <CalmEmoji /> },
	{ id: "refreshed", name: "Refreshed", icon: <RefreshedEmoji /> },
	{ id: "angry", name: "Angry", icon: <AngryEmoji /> },
	{ id: "anxious", name: "Anxious", icon: <AnxiousEmoji /> },
	{ id: "confused", name: "Confused", icon: <ConfusedEmoji /> },
	{ id: "depressed", name: "Depressed", icon: <DepressedEmoji /> },
	{ id: "fatigued", name: "Fatigued", icon: <FatiguedEmoji /> },
	{ id: "gloomy", name: "Gloomy", icon: <GloomyEmoji /> },
	{ id: "mean", name: "Mean", icon: <MeanEmoji /> },
	{ id: "irritable", name: "Irritable", icon: <IrritableEmoji /> },
	{ id: "restless", name: "Restless", icon: <RestlessEmoji /> },
	{ id: "hungry", name: "Hungry", icon: <HungryEmoji /> },
	{ id: "impatient", name: "Impatient", icon: <ImpatientEmoji /> },
	{ id: "sad", name: "Sad", icon: <SadEmoji /> },
	{ id: "scared", name: "Scared", icon: <ScaredEmoji /> },
	{ id: "sensitive", name: "Sensitive", icon: <SensitiveEmoji /> },
	{ id: "sick", name: "Sick", icon: <SickEmoji /> },
	{ id: "sleepy", name: "Sleepy", icon: <SleepyEmoji /> },
	{ id: "spacey", name: "Spacey", icon: <SpaceyEmoji /> },
	{ id: "stressed", name: "Stressed", icon: <StressedEmoji /> },
	{ id: "unbalanced", name: "Unbalanced", icon: <UnbalancedEmoji /> },
];

const MoodSection = ({ navigation }) => {
	const [otherSymptomNote, setOtherSymptomNote] = useState(""); // State for other symptom note
	const [selectedSymptoms, setSelectedSymptoms] = useState([]);
	const [showScrollToTop, setShowScrollToTop] = useState(false);

	const scrollViewRef = useRef();

	useEffect(() => {
		console.log(selectedSymptoms);
	}, [selectedSymptoms]);

	const handleSymptomSelect = (id) => {
		if (selectedSymptoms.includes(id)) {
			setSelectedSymptoms(
				selectedSymptoms.filter((symptomId) => symptomId !== id)
			);
		} else {
			setSelectedSymptoms([...selectedSymptoms, id]);
		}
	};

	const handleScroll = (event) => {
		const offsetY = event.nativeEvent.contentOffset.y;
		setShowScrollToTop(offsetY > 100); // Show button when scrolled down more than 100px
	};

	const scrollToTop = () => {
		scrollViewRef.current.scrollTo({ y: 0, animated: true });
	};

	return (
		<View className="flex-1 bg-[#FAFBFC] px-4 mt-6">
			<ScrollView
				ref={scrollViewRef}
				contentContainerStyle={{ flexGrow: 1 }}
				showsVerticalScrollIndicator={false}
				onScroll={handleScroll}
				scrollEventThrottle={16} // For better performance
			>
				<Text className="mb-3 font-ralewayBold text-primaryDarkBlue text-[24px] text-center leading-8">
					Tell us how you’re feeling today
				</Text>

				<View className="flex flex-wrap flex-row justify-between pt-5 px-3 gap-y-4">
					{symptomsData.map((symptom) => (
						<View className="items-center w-28 mb-4" key={symptom.id}>
							<TouchableOpacity
								onPress={() => handleSymptomSelect(symptom.id)}
								className={`rounded-lg w-24 h-24 justify-center items-center border border-[#EDECF4] bg-white ${
									selectedSymptoms.includes(symptom.id)
										? "border-2 border-primaryBlue bg-[#E5F6FB]"
										: ""
								}`}
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

								<Text className="font-raleway text-[14px] text-gray-400 pb-2 text-center">
									{symptom.name}
								</Text>
							</TouchableOpacity>
						</View>
					))}
				</View>
			</ScrollView>

			{/* Scroll to Top Button */}
			{showScrollToTop && (
				<TouchableOpacity
					onPress={scrollToTop}
					className="absolute bottom-8 right-4 bg-primaryBlue rounded-full w-[44px] h-[44px] items-center justify-center shadow-lg"
					style={{ elevation: 5 }} // For Android shadow
				>
					<Icon name="angle-up" size={24} color="white" />
				</TouchableOpacity>
			)}
		</View>
	);
};

export default MoodSection;

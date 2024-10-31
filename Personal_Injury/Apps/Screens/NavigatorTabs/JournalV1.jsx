import React, { useState, useEffect } from "react";
import {
	SafeAreaView,
	View,
	Text,
	StyleSheet,
	StatusBar,
	FlatList,
	TouchableOpacity,
} from "react-native";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";

// Component
import JournalNav from "../../Components/JournalV1/JournalNav";
import NoteSection from "../../Components/JournalV1/Note/NoteSection";
import PainSection from "../../Components/JournalV1/Pain/PainSection";
import SymptomsSection from "../../Components/JournalV1/Symptoms/SymptomsSection";
import MedicationSection from "../../Components/JournalV1/Medication/MedicationSection";
import SleepSection from "../../Components/JournalV1/Sleep/SleepSection";
import MoodSection from "../../Components/JournalV1/Mood/MoodSection";
import LifestyleSection from "../../Components/JournalV1/Lifestyle/LifestyleSection";

dayjs.extend(isoWeek);

const JournalV1 = ({ navigation }) => {
	const [selectedDate, setSelectedDate] = useState(
		dayjs().format("YYYY-MM-DD")
	); // Selected date state
	const [weekDates, setWeekDates] = useState([]);
	const [activeNavItem, setActiveNavItem] = useState("notes"); // Active nav item state

	// Navigation items
	const navItems = [
		"notes",
		"pain",
		"symptoms",
		"medication",
		"sleep",
		"mood",
		"lifestyle",
	];

	// Get current week days
	useEffect(() => {
		const getCurrentWeek = () => {
			const startOfWeek = dayjs().startOf("isoWeek"); // Start of the week (Sunday)
			const dates = [];

			for (let i = 0; i < 7; i++) {
				dates.push(startOfWeek.add(i, "day").format("YYYY-MM-DD")); // Push each day in the week
			}

			setWeekDates(dates);
		};

		getCurrentWeek();
	}, []);

	// Handle navigation item selection
	const onSelectNavItem = (item) => {
		setActiveNavItem(item);
	};

	const renderWeekDay = ({ item }) => {
		const isSelected = item === selectedDate;
		return (
			<TouchableOpacity
				onPress={() => setSelectedDate(item)}
				className={`mt-6 rounded-lg w-[55px] h-[70px] ${
					isSelected ? "border border-primaryBlue" : "border border-gray-200"
				}`}
				style={{ backgroundColor: isSelected ? "#DFF7FD" : "#fff" }}
			>
				<View className="flex-1 justify-center items-center">
					<Text className="font-raleway">{dayjs(item).format("ddd")}</Text>
					<Text
						className={`text-center font-ralewayBold text-2xl ${
							isSelected ? "text-red-800" : "text-gray-900"
						}`}
					>
						{dayjs(item).format("DD")}
					</Text>
				</View>
			</TouchableOpacity>
		);
	};

	// Render content based on active nav item
	const renderJournalNavSection = () => {
		switch (activeNavItem) {
			case "notes":
				return <NoteSection />;
			case "pain":
				return <PainSection navigation={navigation} />;
			case "symptoms":
				return <SymptomsSection navigation={navigation} />;
			case "medication":
				return <MedicationSection navigation={navigation} />;
			case "sleep":
				return <SleepSection navigation={navigation} />;
			case "mood":
				return <MoodSection />;
			case "lifestyle":
				return <LifestyleSection navigation={navigation} />;
			default:
				return <Text>Select a tab to view content</Text>;
		}
	};

	return (
		<SafeAreaView className="flex-1 bg-[#FAFBFC]">
			<View className="flex-1 mt-5">
				{/* calendar section */}
				<View className="h-1/4">
					<View className="mx-5">
						<Text className="font-raleway text-gray-600 text-[14px] h-6">
							{dayjs(selectedDate).format("MMM DD, YYYY")}
						</Text>
						<Text className="font-ralewayBold text-[24px]">Today</Text>
					</View>

					{/* Horizontal scrollable week day section */}
					<View className="mx-3">
						<FlatList
							data={weekDates}
							horizontal
							renderItem={renderWeekDay}
							keyExtractor={(item) => item}
							showsHorizontalScrollIndicator={false}
							ItemSeparatorComponent={() => <View className="w-3" />} // Adds space between items
						/>
					</View>
				</View>

				{/* Sympton tracking section */}
				<View className="h-3/4">
					<JournalNav
						activeNavItem={activeNavItem}
						onSelectNavItem={onSelectNavItem}
						navItems={navItems}
					/>

					{/* Render content based on active navigation item */}
					<View className="flex-1">{renderJournalNavSection()}</View>
				</View>
			</View>
		</SafeAreaView>
	);
};

export default JournalV1;

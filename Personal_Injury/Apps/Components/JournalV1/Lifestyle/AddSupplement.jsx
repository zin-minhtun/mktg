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
import JournalNav from "../../../Components/JournalV1/JournalNav";
import NoteSection from "../../../Components/JournalV1/Note/NoteSection";
import PainSection from "../../../Components/JournalV1/Pain/PainSection";
import SymptomsSection from "../../../Components/JournalV1/Symptoms/SymptomsSection";
import MedicationSection from "../../../Components/JournalV1/Medication/MedicationSection";
import SleepSection from "../../../Components/JournalV1/Sleep/SleepSection";
import MoodSection from "../../../Components/JournalV1/Mood/MoodSection";
import LifestyleSection from "../../../Components/JournalV1/Lifestyle/LifestyleSection";
import Pain from "../../Icons/Pain";
import DecoratedAddBtn from "../DecoratedAddBtn";

dayjs.extend(isoWeek);

const AddSupplement = ({ navigation }) => {
	const [selectedDate, setSelectedDate] = useState(
		dayjs().format("YYYY-MM-DD")
	); // Selected date state
	const [weekDates, setWeekDates] = useState([]);

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

	return (
		<SafeAreaView className="flex-1 bg-[#FAFBFC]">
			<View className="flex-1">
				{/* calendar section */}
				<View className="pt-8">
					<View className="mx-7">
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

				<View className="items-center">
					<Pain />
					<View className="absolute bottom-36 items-center">
						<Text className="text-[20px] font-ralewaySemiBold text-primaryDarkBlue">
							You don’t have any records.
						</Text>
						<Text className="text-[16px] pt-1.5 font-raleway text-[#939598]">
							Click the plus button to add
						</Text>
					</View>
					<DecoratedAddBtn
						navigation={navigation}
						screen={"AddSupplementDetails"}
					/>
				</View>
			</View>
		</SafeAreaView>
	);
};

export default AddSupplement;

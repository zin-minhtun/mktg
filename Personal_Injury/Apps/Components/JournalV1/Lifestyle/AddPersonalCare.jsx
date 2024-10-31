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
import JournalNav from "../JournalNav";
import NoteSection from "../Note/NoteSection";
import PainSection from "../Pain/PainSection";
import SymptomsSection from "../Symptoms/SymptomsSection";
import MedicationSection from "../Medication/MedicationSection";
import SleepSection from "../Sleep/SleepSection";
import MoodSection from "../Mood/MoodSection";
import LifestyleSection from "./LifestyleSection";
import Pain from "../../Icons/Pain";
import DecoratedAddBtn from "../DecoratedAddBtn";
import PersonalCareImg from "./svg/PersonalCareImg";

dayjs.extend(isoWeek);

const AddPersonalCare = ({ navigation }) => {
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
					<PersonalCareImg />
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
						screen={"AddPersonalCareDetails"}
					/>
				</View>
			</View>
		</SafeAreaView>
	);
};

export default AddPersonalCare;

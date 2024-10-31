import React, { useState, useEffect } from "react";
import {
	SafeAreaView,
	View,
	Text,
	FlatList,
	TouchableOpacity,
	TextInput,
	ScrollView,
} from "react-native";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import AudioInputIcon from "../../Icons/AudioInputIcon";
import CrossIcon from "../../Icons/CrossIcon";
import CheckIcon from "../../Icons/CheckIcon";

dayjs.extend(isoWeek);

const Meal = () => {
	const [selectedDate, setSelectedDate] = useState(
		dayjs().format("YYYY-MM-DD")
	); // Selected date state
	const [weekDates, setWeekDates] = useState([]);

	// State to control form visibility for each meal type
	const [isBreakfastFormVisible, setBreakfastFormVisible] = useState(false);
	const [isLunchFormVisible, setLunchFormVisible] = useState(false);
	const [isDinnerFormVisible, setDinnerFormVisible] = useState(false);
	const [isSnacksFormVisible, setSnacksFormVisible] = useState(false);
	const [isOthersFormVisible, setOthersFormVisible] = useState(false);

	// Toggle visibility functions for each form
	const toggleBreakfastFormVisibility = () => {
		setBreakfastFormVisible(!isBreakfastFormVisible);
	};
	const toggleLunchFormVisibility = () => {
		setLunchFormVisible(!isLunchFormVisible);
	};
	const toggleDinnerFormVisibility = () => {
		setDinnerFormVisible(!isDinnerFormVisible);
	};
	const toggleSnacksFormVisibility = () => {
		setSnacksFormVisible(!isSnacksFormVisible);
	};
	const toggleOthersFormVisibility = () => {
		setOthersFormVisible(!isOthersFormVisible);
	};

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

	// Reusable Form component
	const MealForm = ({ mealType, isVisible, toggleVisibility }) => (
		<>
			{/* List row for the meal, only visible when form is hidden */}
			{!isVisible && (
				<TouchableOpacity onPress={toggleVisibility}>
					<View className="flex-row items-center mb-2 p-2.5 border shadow-sm shadow-gray-200/60 border-[#EDECF4] bg-white h-[80px] rounded-md space-x-4">
						<View className="flex-1 justify-center">
							<Text
								className="font-ralewaySemiBold leading-5 text-[16px] text-primaryDarkBlue flex-1"
								numberOfLines={0}
							>
								{mealType}
							</Text>
							<Text
								className="font-raleway leading-5 text-[16px] text-[#939598] flex-1"
								numberOfLines={0}
							>
								Click to Add Content
							</Text>
						</View>
						<View className="pt-3 pb-5 px-5 bg-primaryLightBlue rounded-lg justify-center items-center">
							<Text className="text-primaryBlue font-bold text-2xl">+</Text>
						</View>
					</View>
				</TouchableOpacity>
			)}

			{/* Meal form, visible when list row is hidden */}
			{isVisible && (
				<View className="my-3">
					<TouchableOpacity onPress={toggleVisibility}>
						<Text className="font-ralewaySemiBold text-[16px] text-primaryDarkBlue w-full pb-3">
							{mealType}
						</Text>
					</TouchableOpacity>
					<View className="border border-[#EDECF4] bg-white h-auto rounded-md px-2 py-4 space-y-4">
						<TextInput
							placeholder={`Food Name (e.g. ${
								mealType === "Breakfast" ? "Chicken" : mealType
							})`}
							placeholderTextColor="#939598"
							className="font-raleway text-[16px] border-b border-b-gray-300 rounded-none px-3 pb-5 pt-1 text-primaryDarkBlue"
						/>
						<TextInput
							placeholder="Fast food or Home-made"
							placeholderTextColor="#939598"
							className="font-raleway text-[16px] border-b border-b-gray-300 rounded-none px-3 pb-5 pt-1 text-primaryDarkBlue"
						/>
						<TextInput
							placeholder="Serving Details (e.g. 12 medium thighs)"
							placeholderTextColor="#939598"
							className="font-raleway text-[16px] border-b border-b-gray-300 rounded-none px-3 pb-5 pt-1 text-primaryDarkBlue"
						/>
						<View className="flex-row justify-end mt-3">
							<View className="justify-center items-center mr-6 bg-primaryBlue rounded-full w-10 h-10">
								<AudioInputIcon />
							</View>
							<View className="first-letter:justify-center items-center mr-3 rounded-full w-10 h-10 bg-[#E0E0E0]">
								<CrossIcon />
							</View>
							<TouchableOpacity
								onPress={() => null}
								className="justify-center items-center rounded-full w-10 h-10 bg-[#E0E0E0]"
							>
								<CheckIcon />
							</TouchableOpacity>
						</View>
					</View>
				</View>
			)}
		</>
	);

	return (
		<SafeAreaView className="flex-1 bg-[#FAFBFC]">
			<View className="flex-1">
				{/* Calendar section */}
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

				<View className="pt-8 mx-3">
					<ScrollView
						contentContainerStyle={{ flexGrow: 1, paddingBottom: 150 }}
						showsVerticalScrollIndicator={false}
					>
						{/* Breakfast form */}
						<MealForm
							mealType="Breakfast"
							isVisible={isBreakfastFormVisible}
							toggleVisibility={toggleBreakfastFormVisibility}
						/>

						{/* Lunch form */}
						<MealForm
							mealType="Lunch"
							isVisible={isLunchFormVisible}
							toggleVisibility={toggleLunchFormVisibility}
						/>

						{/* Dinner form */}
						<MealForm
							mealType="Dinner"
							isVisible={isDinnerFormVisible}
							toggleVisibility={toggleDinnerFormVisibility}
						/>

						{/* Snacks form */}
						<MealForm
							mealType="Snacks"
							isVisible={isSnacksFormVisible}
							toggleVisibility={toggleSnacksFormVisibility}
						/>

						{/* Others form */}
						<MealForm
							mealType="Others"
							isVisible={isOthersFormVisible}
							toggleVisibility={toggleOthersFormVisibility}
						/>
					</ScrollView>
				</View>
			</View>
		</SafeAreaView>
	);
};

export default Meal;

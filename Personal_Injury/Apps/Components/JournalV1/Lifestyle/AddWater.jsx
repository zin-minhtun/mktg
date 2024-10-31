import React, { useState, useEffect } from "react";
import {
	SafeAreaView,
	View,
	Text,
	StyleSheet,
	StatusBar,
	FlatList,
	TouchableOpacity,
	Dimensions,
	ScrollView,
	TextInput,
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
import EditIcon from "./svg/EditIcon";
import SmGlass from "./svg/SmGlass";
import MdGlass from "./svg/MdGlass";
import LgGlass from "./svg/LgGlass";
import WaterWave from "./svg/WaterWave";
import WaterWaveCircle from "./svg/WaterWaveCircle";

dayjs.extend(isoWeek);

const { width } = Dimensions.get("window");

const AddWater = ({ navigation }) => {
	const [selectedDate, setSelectedDate] = useState(
		dayjs().format("YYYY-MM-DD")
	);
	const [weekDates, setWeekDates] = useState([]);
	const [activeSlide, setActiveSlide] = useState(0);
	const [instructions, setInstructions] = useState([
		"Swipe right to manually enter",
		"Swipe left to auto-fill",
	]);
	const [isGlassSelected, setIsGlassSelected] = useState(false); // New state variable
	const [selectedUnit, setSelectedUnit] = useState("oz"); // State to store selected unit

	const handleUnitSelect = (unit) => {
		setSelectedUnit(unit);
	};

	// Get current week days
	useEffect(() => {
		const getCurrentWeek = () => {
			const startOfWeek = dayjs().startOf("isoWeek");
			const dates = [];

			for (let i = 0; i < 7; i++) {
				dates.push(startOfWeek.add(i, "day").format("YYYY-MM-DD"));
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

	const handleGlassClick = () => {
		setIsGlassSelected(true); // Update state when a glass is clicked
	};

	const onScroll = (event) => {
		const slide = Math.round(event.nativeEvent.contentOffset.x / width);
		setActiveSlide(slide);
	};

	return (
		<View className="flex-1 bg-primaryLightBlue">
			{/* Calendar section */}
			<View className="bg-[#FAFBFC] pt-8">
				<View className="mx-7">
					<Text className="font-raleway text-gray-600 text-[14px] h-6">
						{dayjs(selectedDate).format("MMM DD, YYYY")}
					</Text>
					<Text className="font-ralewayBold text-[24px]">Today</Text>
				</View>

				<View className="mx-3">
					<FlatList
						data={weekDates}
						horizontal
						renderItem={renderWeekDay}
						keyExtractor={(item) => item}
						showsHorizontalScrollIndicator={false}
						ItemSeparatorComponent={() => <View className="w-3" />}
					/>
				</View>
			</View>

			<View className="flex-1">
				<View className="h-[15%] bg-[#FAFBFC] p-7">
					<Text className="font-ralewaySemiBold text-primaryDarkBlue text-[16px] w-24">
						Current goal
					</Text>
					<View className="flex flex-row mt-2 w-24 justify-between">
						<Text className="font-raleway text-primaryDarkBlue text-[16px] mr-3">
							2000ml
						</Text>
						<EditIcon />
					</View>
				</View>

				<View className="flex-1 border-t border-t-[#ADE5FC] relative justify-center items-center">
					{isGlassSelected ? (
						<View className="absolute -top-16">
							<WaterWaveCircle />
						</View>
					) : (
						<View className="absolute -top-16 w-[117px] h-[117px] bg-white border-[6px] border-[#ADE5FC] rounded-full justify-end">
							<Text className="font-ralewaySemiBold text-[18px] text-center bottom-5">
								0%
							</Text>
						</View>
					)}

					<View className="flex-[5]">
						{/* Conditionally render WaterWave */}
						{isGlassSelected && (
							<View className="absolute justify-end h-full">
								<WaterWave />
							</View>
						)}

						<ScrollView
							horizontal
							pagingEnabled
							onScroll={onScroll}
							scrollEventThrottle={16}
							showsHorizontalScrollIndicator={false}
						>
							{/* Slide 1 */}
							<View
								style={{ width }}
								className="relative flex flex-row justify-evenly items-end pb-10"
							>
								<View className="flex-1 justify-center items-center">
									<TouchableOpacity onPress={handleGlassClick}>
										<SmGlass />
									</TouchableOpacity>
									<Text
										className={`font-ralewaySemiBold text-[16px] text-primaryDarkBlue mt-2 ${
											isGlassSelected && "text-gray-100"
										}`}
									>
										+225ml
									</Text>
								</View>
								<View className="flex-1 justify-center items-center">
									<TouchableOpacity onPress={handleGlassClick}>
										<MdGlass />
									</TouchableOpacity>
									<Text
										className={`font-ralewaySemiBold text-[16px] text-primaryDarkBlue mt-2 ${
											isGlassSelected && "text-gray-100"
										}`}
									>
										+500ml
									</Text>
								</View>
								<View className="flex-1 justify-center items-center">
									<TouchableOpacity onPress={handleGlassClick}>
										<LgGlass />
									</TouchableOpacity>
									<Text
										className={`font-ralewaySemiBold text-[16px] text-primaryDarkBlue mt-2 ${
											isGlassSelected && "text-gray-100"
										}`}
									>
										+1l
									</Text>
								</View>
							</View>

							{/* Slide 2 */}
							<View
								style={{ width }}
								className="relative flex flex-row justify-evenly items-end pb-10"
							>
								<View style={{ position: "relative", flex: 1 }}>
									<TextInput
										style={{
											fontFamily: "raleway",
											color: "#939598",
											fontSize: 16,
											borderWidth: 1,
											borderColor: "#EDECF4",
											borderRadius: 12,
											padding: 15,
											backgroundColor: "#fff",
										}}
										placeholder="Add water"
										keyboardType="numeric"
										placeholderTextColor="#003361" // This sets the placeholder color
										className="mx-3"
									/>
									<View style={{ position: "absolute", right: 16, top: 5 }}>
										<View className="flex flex-row">
											<TouchableOpacity
												onPress={() => handleUnitSelect("ml")}
												className={`p-3 bg-white border border-primaryBlue ${
													selectedUnit === "ml" ? "bg-primaryBlue" : ""
												} rounded-l-lg`}
											>
												<Text
													className={`font-raleway text-[12px] ${
														selectedUnit === "ml"
															? "text-white"
															: "text-primaryDarkBlue"
													}`}
												>
													ml
												</Text>
											</TouchableOpacity>

											<TouchableOpacity
												onPress={() => handleUnitSelect("oz")}
												className={`p-3 bg-white border border-primaryBlue ${
													selectedUnit === "oz" ? "bg-primaryBlue" : ""
												} rounded-r-lg`}
											>
												<Text
													className={`font-raleway text-[12px] ${
														selectedUnit === "oz"
															? "text-white"
															: "text-primaryDarkBlue"
													}`}
												>
													oz
												</Text>
											</TouchableOpacity>
										</View>
									</View>
								</View>
							</View>
						</ScrollView>
					</View>

					<View
						className={`flex-[1.5] w-full ${isGlassSelected && "bg-[#4975d1]"}`}
					>
						<View className="flex flex-row space-x-2 justify-center items-center">
							<View
								className={`h-2 w-2 rounded-full ${
									activeSlide === 0 ? "bg-primaryBlue" : "bg-gray-300"
								}`}
							/>
							<View
								className={`h-2 w-2 rounded-full ${
									activeSlide === 1 ? "bg-primaryBlue" : "bg-gray-300"
								}`}
							/>
						</View>

						<View className="items-center pt-3">
							<Text
								className={`font-raleway text-[14px] text-primaryDarkBlue ${
									isGlassSelected && "text-gray-100"
								}`}
							>
								{instructions[activeSlide]}
							</Text>
						</View>
					</View>
				</View>
			</View>
		</View>
	);
};

export default AddWater;

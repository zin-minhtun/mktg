import React, { useState, useEffect, useCallback } from "react";
import {
	SafeAreaView,
	View,
	Text,
	FlatList,
	TouchableOpacity,
	ActivityIndicator,
	Alert
} from "react-native";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import axios from "axios";
import { API_URL } from "@env";
import { useFocusEffect } from "@react-navigation/native";
import { useUserData } from "../../../Contexts/UserContext";
import { useTheme } from "../../../Contexts/ThemeContext";

// Component
import DecoratedAddBtn from "../DecoratedAddBtn";
import PersonalCareImg from "./svg/PersonalCareImg";
import { Trash2, Pencil } from "lucide-react-native";

dayjs.extend(isoWeek);

const AddPersonalCare = ({ navigation }) => {
	const { gUser } = useUserData();
	const { theme } = useTheme();
	const [selectedDate, setSelectedDate] = useState(
		dayjs().format("YYYY-MM-DD")
	);
	const [weekDates, setWeekDates] = useState([]);
	const [adls, setAdls] = useState([]);
	const [loading, setLoading] = useState(false);

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

	const fetchAdls = useCallback(async () => {
		if (!gUser?._id) return;
		setLoading(true);
		try {
			const response = await axios.get(`${API_URL}/api/adls`, {
				params: {
					userId: gUser._id,
					date: selectedDate
				}
			});
			setAdls(response.data || []);
		} catch (e) {
			console.error("Failed to fetch ADLs", e);
		} finally {
			setLoading(false);
		}
	}, [gUser?._id, selectedDate]);

	useFocusEffect(
		useCallback(() => {
			fetchAdls();
		}, [fetchAdls])
	);

	const handleDelete = async (id) => {
		try {
			await axios.delete(`${API_URL}/api/adls/delete/${id}`);
			fetchAdls();
		} catch (e) {
			Alert.alert("Error", "Failed to delete item");
		}
	};

	const confirmDelete = (id) => {
		Alert.alert("Delete", "Are you sure?", [
			{ text: "Cancel", style: "cancel" },
			{ text: "Delete", style: "destructive", onPress: () => handleDelete(id) }
		]);
	};

	const renderWeekDay = ({ item }) => {
		const isSelected = item === selectedDate;
		return (
			<TouchableOpacity
				onPress={() => setSelectedDate(item)}
				className="mt-6 rounded-lg w-[55px] h-[70px]"
				style={{
					backgroundColor: theme.mode === 'dark'
						? (isSelected ? '#003B5C' : theme.textFieldBG)
						: (isSelected ? "#DFF7FD" : "#fff"),
					borderWidth: 1,
					borderColor: theme.mode === 'dark'
						? (isSelected ? '#00AEEF' : theme.borderColor) // Fixed border color logic
						: (isSelected ? '#00AEEF' : '#E6E6E6'),
				}}
			>
				<View className="flex-1 justify-center items-center">
					<Text className="font-raleway" style={{ color: theme.textColor }}>{dayjs(item).format("ddd")}</Text>
					<Text className="text-center font-ralewayBold text-2xl"
						style={{ color: isSelected ? (theme.mode === 'dark' ? '#FFFFFF' : '#00AEEF') : theme.textColor }}>
						{dayjs(item).format("DD")}
					</Text>
				</View>
			</TouchableOpacity>
		);
	};

	const renderAdlItem = ({ item }) => (
		<TouchableOpacity
			onPress={() => navigation.navigate("AddPersonalCareDetails", {
				editMode: true,
				adlId: item._id,
				prefill: item,
				selectedDate: selectedDate
			})}
			className="p-4 rounded-xl mb-3 flex-row items-center border"
			style={{ backgroundColor: theme.textFieldBG, borderColor: theme.borderColor }}
		>
			<View className="p-3 rounded-full mr-3" style={{ backgroundColor: theme.mode === 'dark' ? '#003B5C' : '#E6F4FF' }}>
				<PersonalCareImg width={24} height={24} />
			</View>
			<View className="flex-1">
				<Text className="font-ralewaySemiBold text-[16px]" style={{ color: theme.textColor }}>
					{item.itemLabels && item.itemLabels.length > 0 ? item.itemLabels.join(", ") : "Personal Care"}
				</Text>
				{item.notes ? (
					<Text className="font-raleway text-[14px]" style={{ color: theme.darkGrey }} numberOfLines={1}>{item.notes}</Text>
				) : null}
			</View>
			<TouchableOpacity onPress={() => confirmDelete(item._id)} className="p-2">
				<Trash2 size={20} color="#FF6B6B" />
			</TouchableOpacity>
		</TouchableOpacity>
	);

	return (
		<SafeAreaView className="flex-1" style={{ backgroundColor: theme.background }}>
			<View className="flex-1 px-5 pt-16">
				{/* calendar section */}
				<View>
					<View>
						<Text className="font-raleway text-[14px] h-6" style={{ color: theme.darkGrey }}>
							{dayjs(selectedDate).format("MMM DD, YYYY")}
						</Text>
						<Text className="font-ralewayBold text-[24px]" style={{ color: theme.textColor }}>Today</Text>
					</View>

					{/* Horizontal scrollable week day section */}
					<View className="mt-4">
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

				{loading ? (
					<View className="flex-1 justify-center items-center mt-10">
						<ActivityIndicator size="large" color="#00C2FF" />
					</View>
				) : adls.length === 0 ? (
					<View className="items-center mt-10 flex-1">
						<PersonalCareImg width={100} height={100} />
						<View className="items-center mt-6">
							<Text className="text-[20px] font-ralewaySemiBold" style={{ color: theme.textColor }}>
								You don’t have any records.
							</Text>
							<Text className="text-[16px] pt-1.5 font-raleway" style={{ color: theme.darkGrey }}>
								Click the plus button to add
							</Text>
						</View>
						<View className="absolute bottom-10 right-0 left-0 items-center">
							<DecoratedAddBtn
								navigation={navigation}
								screen={"AddPersonalCareDetails"}
								selectedDate={selectedDate}
								params={{ selectedDate }}
							/>
						</View>
					</View>
				) : (
					<View className="flex-1 mt-6">
						<FlatList
							data={adls}
							renderItem={renderAdlItem}
							keyExtractor={(item) => item._id}
							showsVerticalScrollIndicator={false}
							contentContainerStyle={{ paddingBottom: 100 }}
						/>
						<View className="absolute bottom-5 right-0 left-0 items-center">
							<DecoratedAddBtn
								navigation={navigation}
								screen={"AddPersonalCareDetails"}
								selectedDate={selectedDate}
								params={{ selectedDate }}
							/>
						</View>
					</View>
				)}
			</View>
		</SafeAreaView>
	);
};

export default AddPersonalCare;

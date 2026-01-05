import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
	View,
	Text,
	StyleSheet,
	StatusBar,
	FlatList,
	TouchableOpacity,
	ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import axios from "axios";
import { API_URL } from "@env";
import { Ionicons } from "@expo/vector-icons";
import { useUserData } from "../../Contexts/UserContext";
import { useTheme } from "../../Contexts/ThemeContext";
import EditEventModal from "../../Components/Calendar/EditEventModal";

// Component
import JournalNav from "../../Components/JournalV1/JournalNav";
import NoteSection from "../../Components/JournalV1/Note/NoteSection";
import PainSection from "../../Components/JournalV1/Pain/PainSection";
import SymptomsSection from "../../Components/JournalV1/Symptoms/SymptomsSection";
import MedicationSection from "../../Components/JournalV1/Medication/MedicationSection";
import SleepSection from "../../Components/JournalV1/Sleep/SleepSection";
import MoodSection from "../../Components/JournalV1/Mood/MoodSection";
import LifestyleSection from "../../Components/JournalV1/Lifestyle/LifestyleSection";
import EventsSection from "../../Components/JournalV1/Events/EventsSection";

dayjs.extend(isoWeek);


// JournalV1: Weekly journal and event view
// After deleting or editing an event, immediately refetch the event list for the selected date
const JournalV1 = ({ navigation, route }) => {
	const { gUser } = useUserData();
	const { theme } = useTheme();
	const [selectedDate, setSelectedDate] = useState(
		dayjs().format("YYYY-MM-DD")
	); // Selected date state
	const [weekDates, setWeekDates] = useState([]);
	const [activeNavItem, setActiveNavItem] = useState("notes"); // Active nav item state
	const [dayEvents, setDayEvents] = useState([]);
	const [showEditEventModal, setShowEditEventModal] = useState(false);
	const [editingEvent, setEditingEvent] = useState(null);

	// Navigation items
	const navItems = [
		"notes",
		"pain",
		"symptoms",
		"medication",
		"sleep",
		"mood",
		"lifestyle",
		"events",
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
			console.log("try date: ", selectedDate)
		};

		getCurrentWeek();
	}, []);

	// Fetch events when selectedDate changes
	useEffect(() => {
		const fetchEvents = async () => {
			try {
				if (!gUser?.id && !gUser?._id) return;
				const userId = gUser?.id || gUser?._id;
				const res = await axios.get(`${API_URL}/api/v1/calendar-events/date`, {
					params: { userId, date: selectedDate }
				});
				console.log("Journal useEffect: Fetched", res.data?.length, "events for", selectedDate);
				if (res.data && res.data.length > 0) {
					console.log("Journal useEffect: First event structure:", JSON.stringify(res.data[0], null, 2));
				}
				// Sort events by start time (earliest to latest)
				const sortedEvents = (res.data || []).sort((a, b) => {
					const timeA = convertTo24Hour(a.start_time);
					const timeB = convertTo24Hour(b.start_time);
					return timeA.localeCompare(timeB);
				});
				setDayEvents(sortedEvents);
			} catch (e) {
				console.error("Journal useEffect: Failed to fetch day events", e.message);
			}
		};
		fetchEvents();
	}, [selectedDate, gUser]);

	// Refresh events when returning to Journal tab (e.g., after adding event from Calendar)
	useFocusEffect(
		useCallback(() => {
			const fetchEvents = async () => {
				try {
					if (!gUser?.id && !gUser?._id) return;
					const userId = gUser?.id || gUser?._id;
					const res = await axios.get(`${API_URL}/api/v1/calendar-events/date`, {
						params: { userId, date: selectedDate }
					});
					console.log("Journal useFocusEffect: Fetched", res.data?.length, "events for", selectedDate);
					// Sort events by start time (earliest to latest)
					const sortedEvents = (res.data || []).sort((a, b) => {
						const timeA = convertTo24Hour(a.start_time);
						const timeB = convertTo24Hour(b.start_time);
						return timeA.localeCompare(timeB);
					});
					setDayEvents(sortedEvents);
				} catch (e) {
					console.error("Journal useFocusEffect: Failed to fetch day events", e.message);
				}
			};
			fetchEvents();
		}, [selectedDate, gUser])
	);

	// When clicking on a section in the Home screen
	useEffect(() => {
		if (route.params?.section) {
			setActiveNavItem(route.params.section);
		}
	}, [route.params]);

	// Always refetch events when returning to the journal tab to ensure UI is up to date
	useEffect(() => {
		const unsubscribe = navigation.addListener('focus', () => {
			if (gUser?.id || gUser?._id) {
				fetchEventsForSelectedDate(selectedDate);
			}
		});
		return unsubscribe;
	}, [navigation, selectedDate, gUser]);

	// Helper function to convert 12-hour time to 24-hour format for sorting
	const convertTo24Hour = (time12h) => {
		if (!time12h) return "00:00";
		const [time, modifier] = time12h.split(" ");
		let [hours, minutes] = time.split(":");
		if (hours === "12") {
			hours = modifier === "AM" ? "00" : "12";
		} else if (modifier === "PM") {
			hours = String(parseInt(hours, 10) + 12);
		}
		return `${hours.padStart(2, "0")}:${minutes}`;
	};

	// Fetch events for a specific date
	const fetchEventsForSelectedDate = async (date) => {
		try {
			if (!gUser?.id && !gUser?._id) return;
			const userId = gUser?.id || gUser?._id;
			console.log("Journal: Fetching events for date:", date);
			const res = await axios.get(`${API_URL}/api/v1/calendar-events/date`, {
				params: { userId, date }
			});
			console.log("Journal: Fetched", res.data?.length, "events");
			if (res.data && res.data.length > 0) {
				console.log("Journal: First event _id:", res.data[0]._id, "name:", res.data[0].event_name);
			}
			// Sort events by start time (earliest to latest)
			const sortedEvents = (res.data || []).sort((a, b) => {
				const timeA = convertTo24Hour(a.start_time);
				const timeB = convertTo24Hour(b.start_time);
				return timeA.localeCompare(timeB);
			});
			setDayEvents(sortedEvents);
		} catch (e) {
			console.error("Journal: Failed to fetch day events", e.message);
		}
	};

	// Handle navigation item selection
	const onSelectNavItem = (item) => {
		setActiveNavItem(item);
	};

	const renderWeekDay = ({ item }) => {
		const isSelected = item === selectedDate;
		return (
			<TouchableOpacity
				onPress={() => setSelectedDate(item)}
				className={`mt-6 rounded-lg w-[55px] h-[70px] ${isSelected
					? (theme.mode === 'dark' ? 'border border-transparent' : 'border border-primaryBlue')
					: 'border border-gray-200'
					}`}
				style={{
					backgroundColor:
						theme.mode === 'dark'
							? (isSelected ? '#511d28' : theme.textFieldBG)
							: (isSelected ? "#DFF7FD" : "#fff"),
					borderColor:
						theme.mode === 'dark'
							? (isSelected ? '#791f25' : theme.borderColor)
							: undefined,
					borderWidth: theme.mode === 'dark' && isSelected ? 2 : 1,
					padding: theme.mode === 'dark' && isSelected ? 3 : 0,
				}}
			>
				<View style={theme.mode === 'dark' && isSelected ? { flex: 1, borderRadius: 8, backgroundColor: '#511d28' } : { flex: 1 }} className="justify-center items-center">
					<Text className="font-raleway" style={theme.mode === 'dark' ? { color: theme.textColor } : undefined}>
						{dayjs(item).format("ddd")}
					</Text>
					<Text
						className={`text-center font-ralewayBold text-2xl ${isSelected ? "text-red-800" : "text-gray-900"
							}`}
						style={theme.mode === 'dark' ? { color: '#FFFFFF' } : undefined}
					>
						{dayjs(item).format("DD")}
					</Text>
				</View>
			</TouchableOpacity>
		);
	};

	const renderEventRow = (ev) => (
		<View key={ev._id} style={{
			backgroundColor: '#fff', borderRadius: 12, paddingVertical: 10, paddingHorizontal: 12,
			shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 1,
			marginBottom: 8
		}}>
			<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
				<View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
					<View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#E74C3C', marginRight: 10 }} />
					<Text style={{ fontFamily: 'Raleway', fontSize: 15, color: '#111', flex: 1 }}>{ev.event_name}</Text>
				</View>
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<Text style={{ fontFamily: 'Raleway', fontSize: 14, color: '#111' }}>{ev.start_time}</Text>
					<TouchableOpacity onPress={() => {
						console.log("Journal: Opening edit modal for event:", ev._id, ev.event_name);
						console.log("Journal: Full event object:", JSON.stringify(ev, null, 2));
						setEditingEvent(ev);
						setShowEditEventModal(true);
					}} style={{ marginLeft: 8, padding: 4 }}>
						<Ionicons name="create-outline" size={18} color="#00B8DF" />
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);

	// Render content based on active nav item
	const renderJournalNavSection = () => {
		switch (activeNavItem) {
			case "notes":
				return <NoteSection selectedDate={selectedDate} />;
			case "pain":
				return <PainSection navigation={navigation} selectedDate={selectedDate} />;
			case "symptoms":
				return <SymptomsSection navigation={navigation} />;
			case "medication":
				return <MedicationSection navigation={navigation} selectedDate={selectedDate} />;
			case "sleep":
				return <SleepSection navigation={navigation} selectedDate={selectedDate} />;
			case "mood":
				return <MoodSection navigation={navigation} selectedDate={selectedDate} />;
			case "lifestyle":
				return <LifestyleSection navigation={navigation} selectedDate={selectedDate} />;
			case "events":
				return <EventsSection
					dayEvents={dayEvents}
					onEditEvent={(ev) => {
						setEditingEvent(ev);
						setShowEditEventModal(true);
					}}
					selectedDate={selectedDate}
				/>;
			default:
				return <Text>Select a tab to view content</Text>;
		}
	};

	return (
		<SafeAreaView className="flex-1" style={theme.mode === 'dark' ? { backgroundColor: theme.background } : { backgroundColor: '#FAFBFC' }}>
			<View className="flex-1 mt-5">
				{/* Calendar section - dynamically sized based on events */}
				<View>
					<View className="mx-5">
						<Text className="font-raleway text-[14px] h-6" style={theme.mode === 'dark' ? { color: theme.textColor } : { color: '#4b5563' }}>
							{dayjs(selectedDate).format("MMM DD, YYYY")}
						</Text>
						<Text className="font-ralewayBold text-[24px]" style={theme.mode === 'dark' ? { color: theme.textColor } : undefined}>Today</Text>
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

				{/* Symptom tracking section - takes remaining space */}
				<View className="flex-1 mt-2"
					style={{ paddingBottom: 20 }}
				>
					<JournalNav
						activeNavItem={activeNavItem}
						onSelectNavItem={onSelectNavItem}
						navItems={navItems}
					/>

					{/* Render content based on active navigation item */}
					<View className="flex-1">{renderJournalNavSection()}</View>
				</View>
			</View>

			{/* Edit Event Modal for Journal */}
			<EditEventModal
				visible={showEditEventModal}
				event={editingEvent}
				onClose={() => setShowEditEventModal(false)}
				// After editing or deleting an event, close the modal and refetch events for the selected date
				onEventUpdated={async () => {
					setShowEditEventModal(false);
					await fetchEventsForSelectedDate(selectedDate);
				}}
			/>
		</SafeAreaView>
	);
};

export default JournalV1;

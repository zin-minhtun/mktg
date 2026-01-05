import React, { useState, useEffect, memo } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useTheme } from "../../Contexts/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUserData } from "../../Contexts/UserContext";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { API_URL } from "@env";
import AddEventModal from "./AddEventScreen";

const MiniMonthCalendar = memo(({ year, month, onPress, markedDates, theme }) => {
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(month, year);
  const firstDay = getFirstDayOfMonth(month, year);
  const days = [];

  // Check if this is the current month
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
  const currentDay = today.getDate();

  // Empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(<View key={`empty-${i}`} style={styles.emptyDay} />);
  }

  // Actual days
  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const hasEvent = markedDates[dateKey] && markedDates[dateKey].length > 0;
    const isToday = isCurrentMonth && day === currentDay;

    days.push(
      <View key={day} style={styles.dayContainer}>
        {isToday && <View style={styles.todayCircle} />}
        <Text style={[styles.dayText, isToday && styles.todayText, { color: isToday ? "#ffffff" : theme.darkGrey }]}>{day}</Text>
        {hasEvent && <View style={styles.eventLine} />}
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.monthCard, { backgroundColor: theme.textFieldBG }]}
      onPress={() => onPress(month)}
      activeOpacity={0.7}
    >
      <Text style={[
        styles.monthTitle,
        { color: isCurrentMonth ? "#00B8DF" : theme.textColor }
      ]}>
        {monthNames[month]}
      </Text>
      <View style={styles.daysGrid}>{days}</View>
    </TouchableOpacity>
  );
});

const YearlyCalendar = memo(({ year, onMonthPress, markedDates, theme }) => {
  return (
    <View style={styles.yearlyContainer}>
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((monthIndex) => (
        <MiniMonthCalendar
          key={monthIndex}
          year={year}
          month={monthIndex}
          onPress={onMonthPress}
          markedDates={markedDates}
          theme={theme}
        />
      ))}
    </View>
  );
});

const CalendarYearlyView = ({ navigation }) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { gUser } = useUserData();
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [markedDates, setMarkedDates] = useState({});
  const [loading, setLoading] = useState(true);
  const [showAddEventModal, setShowAddEventModal] = useState(false);

  useEffect(() => {
    if (gUser?.id || gUser?._id) {
      fetchYearlyEvents();
    }
  }, [currentYear, gUser]);

  const fetchYearlyEvents = async () => {
    try {
      setLoading(true);
      const userId = gUser?.id || gUser?._id;

      const response = await axios.get(
        `${API_URL}/api/v1/calendar-events/yearly`,
        {
          params: {
            userId,
            year: currentYear,
          },
        }
      );

      if (response.data && response.data.eventsByDate) {
        setMarkedDates(response.data.eventsByDate);
      }
    } catch (error) {
      console.error("Error fetching yearly events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMonthPress = (monthIndex) => {
    navigation.navigate("MonthlyCalendar", {
      year: currentYear,
      month: monthIndex,
    });
  };

  const changeYear = (direction) => {
    setCurrentYear((prev) => prev + direction);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
      edges={['top', 'bottom']}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={[styles.headerTitle, { color: theme.textColor }]}>My Calendar</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Agenda')}>
          <Ionicons name="notifications-outline" size={24} color={theme.textColor} />
        </TouchableOpacity>
      </View>

      {/* Year Selector */}
      <View style={styles.yearSelector}>
        <TouchableOpacity onPress={() => changeYear(-1)} style={styles.yearButton}>
          <Ionicons name="chevron-back" size={24} color="#00B8DF" />
        </TouchableOpacity>
        <Text style={[styles.yearText, { color: "#00B8DF" }]}>{currentYear}</Text>
        <TouchableOpacity onPress={() => changeYear(1)} style={styles.yearButton}>
          <Ionicons name="chevron-forward" size={24} color="#00B8DF" />
        </TouchableOpacity>
      </View>

      {/* Calendar Grid */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00B8DF" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <YearlyCalendar
            year={currentYear}
            onMonthPress={handleMonthPress}
            markedDates={markedDates}
            theme={theme}
          />
        </ScrollView>
      )}

      {/* Add Event Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowAddEventModal(true)}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>

      {/* Add Event Modal */}
      <AddEventModal
        visible={showAddEventModal}
        onClose={() => setShowAddEventModal(false)}
        onEventAdded={fetchYearlyEvents}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: "Raleway-Bold",
  },
  yearSelector: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    paddingBottom: 15,
  },
  yearButton: {
    padding: 8,
    paddingHorizontal: 20,
  },
  yearText: {
    fontSize: 36,
    fontFamily: "Raleway-Bold",
    color: "#00B8DF",
    marginHorizontal: 20,
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingBottom: 100,
  },
  yearlyContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  monthCard: {
    width: "48%",
    marginBottom: 16,
    paddingTop: 12,
    paddingBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  monthTitle: {
    fontSize: 16,
    fontFamily: "Raleway-Bold",
    marginBottom: 10,
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayContainer: {
    width: "14.28%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginBottom: 2,
  },
  emptyDay: {
    width: "14.28%",
    aspectRatio: 1,
  },
  dayText: {
    fontSize: 12,
    fontFamily: "Raleway",
    zIndex: 2,
  },
  todayText: {
    fontWeight: "bold",
  },
  todayCircle: {
    position: "absolute",
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#E74C3C",
    zIndex: 1,
  },
  eventLine: {
    position: "absolute",
    bottom: 0,
    width: 18,
    height: 2,
    borderRadius: 1,
    backgroundColor: "#E74C3C",
    zIndex: 3,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  addButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#00B8DF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
});

export default CalendarYearlyView;

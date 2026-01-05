import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { useTheme } from "../../Contexts/ThemeContext";
import { useUserData } from "../../Contexts/UserContext";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { API_URL } from "@env";
import dayjs from "dayjs";
import AddEventModal from "./AddEventScreen";
import EditEventModal from "./EditEventModal";

const CalendarMonthlyView = ({ route, navigation }) => {
  const { theme } = useTheme();
  const { gUser } = useUserData();
  const { year: initialYear, month: initialMonth } = route.params || {};

  const [currentMonth, setCurrentMonth] = useState(
    initialMonth !== undefined ? initialMonth : new Date().getMonth()
  );
  const [currentYear, setCurrentYear] = useState(
    initialYear || new Date().getFullYear()
  );
  const [nextMonth, setNextMonth] = useState((currentMonth + 1) % 12);
  const [nextYear, setNextYear] = useState(
    currentMonth === 11 ? currentYear + 1 : currentYear
  );
  const [events, setEvents] = useState([]);
  const [eventsByDate, setEventsByDate] = useState({});
  const [markedDates, setMarkedDates] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [showEditEventModal, setShowEditEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const scrollViewRef = useRef(null);
  const eventsSectionRef = useRef(null);

  const today = new Date();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  useEffect(() => {
    if (currentMonth === 11) {
      setNextMonth(0);
      setNextYear(currentYear + 1);
    } else {
      setNextMonth(currentMonth + 1);
      setNextYear(currentYear);
    }
  }, [currentMonth, currentYear]);

  useEffect(() => {
    if (gUser?.id || gUser?._id) {
      fetchMonthlyEvents();
    }
  }, [currentMonth, currentYear, gUser]);

  // Refetch events when tab is focused
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchMonthlyEvents().then((freshIndexedEvents) => {
        if (selectedDate && freshIndexedEvents) {
          setSelectedEvents(freshIndexedEvents[selectedDate] || []);
        }
      });
    });
    return unsubscribe;
  }, [navigation, selectedDate, gUser]);

  // Refetch events on tab focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchMonthlyEvents().then((freshIndexedEvents) => {
        if (selectedDate && freshIndexedEvents) {
          const updatedEvents = freshIndexedEvents[selectedDate] || [];
          setSelectedEvents(updatedEvents);
        }
      });
    });
    return unsubscribe;
  }, [navigation, selectedDate, gUser]);

  // Convert 12-hour time to 24-hour for sorting
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

  const fetchMonthlyEvents = async () => {
    try {
      setLoading(true);
      const userId = gUser?.id || gUser?._id;

      const startDate = dayjs(`${currentYear}-${currentMonth + 1}-01`).format("YYYY-MM-DD");
      const endDate = dayjs(`${currentYear}-${currentMonth + 1}-01`)
        .endOf("month")
        .format("YYYY-MM-DD");

      const nextStartDate = dayjs(`${nextYear}-${nextMonth + 1}-01`).format("YYYY-MM-DD");
      const nextEndDate = dayjs(`${nextYear}-${nextMonth + 1}-01`)
        .endOf("month")
        .format("YYYY-MM-DD");

      const [currentMonthRes, nextMonthRes] = await Promise.all([
        axios.get(`${API_URL}/api/v1/calendar-events/range`, {
          params: { userId, startDate, endDate },
        }),
        axios.get(`${API_URL}/api/v1/calendar-events/range`, {
          params: { userId, startDate: nextStartDate, endDate: nextEndDate },
        }),
      ]);

      const allEvents = [...currentMonthRes.data, ...nextMonthRes.data];
      setEvents(allEvents);

      const marked = {};
      const indexed = {};

      allEvents.forEach((event) => {
        const dateKey = dayjs(event.date).format("YYYY-MM-DD");

        if (!marked[dateKey]) {
          marked[dateKey] = { marked: true };
        }

        if (!indexed[dateKey]) {
          indexed[dateKey] = [];
        }
        indexed[dateKey].push(event);
      });

      // Sort events by start time (earliest first)
      Object.keys(indexed).forEach((dateKey) => {
        indexed[dateKey].sort((a, b) => {
          const timeA = convertTo24Hour(a.start_time);
          const timeB = convertTo24Hour(b.start_time);
          return timeA.localeCompare(timeB);
        });
      });

      setMarkedDates(marked);
      setEventsByDate(indexed);

      return indexed;
    } catch (error) {
      console.error("Error fetching monthly events:", error);
      return {};
    } finally {
      setLoading(false);
    }
  };

  const handleDayPress = (day) => {
    const dateKey = day.dateString;
    const clickedDate = new Date(dateKey);
    const clickedMonth = clickedDate.getMonth();
    const clickedYear = clickedDate.getFullYear();

    if (
      (clickedMonth === currentMonth && clickedYear === currentYear) ||
      (clickedMonth === nextMonth && clickedYear === nextYear)
    ) {
      const dayEvents = eventsByDate[dateKey] || [];

      setSelectedDate(dateKey);
      setSelectedEvents(dayEvents);

      if (dayEvents.length > 0) {
        setTimeout(() => {
          eventsSectionRef.current?.measureLayout(
            scrollViewRef.current,
            (x, y) => {
              scrollViewRef.current?.scrollTo({ y: y - 20, animated: true });
            },
            () => { }
          );
        }, 100);
      }
    }
  };

  const handleBackPress = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate("Calendar");
    }
  };

  // Custom day component with event indicator line
  const renderDay = ({ date, state, marking }) => {
    const isToday = state === 'today';
    const isDisabled = state === 'disabled';
    const hasEvent = marking && marking.marked;

    if (isDisabled) {
      return <View style={{ width: 32, height: 32 }} />;
    }

    return (
      <TouchableOpacity
        style={{ alignItems: 'center', justifyContent: 'center', width: 32, height: 32 }}
        onPress={() => handleDayPress(date)}
        activeOpacity={0.7}
      >
        <View style={[
          { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
          isToday && { backgroundColor: '#a22222', borderRadius: 16 }
        ]}>
          <Text style={[
            { fontSize: 14, fontFamily: 'Raleway', color: isToday ? '#ffffff' : theme.textColor },
            isToday && { fontWeight: 'bold' }
          ]}>
            {date.day}
          </Text>
        </View>
        {hasEvent && (
          <View style={{
            position: 'absolute',
            bottom: 0,
            width: 18,
            height: 2,
            borderRadius: 1,
            backgroundColor: theme.mode === 'dark' ? '#8c98a2' : '#E74C3C',
          }} />
        )}
      </TouchableOpacity>
    );
  };

  const renderEventItem = (event) => {
    return (
      <TouchableOpacity
        key={event._id}
        style={[styles.eventCard, { backgroundColor: theme.textFieldBG, borderColor: theme.borderColor }]}
        onPress={() => navigation.navigate("EventDetail", { event })}
        activeOpacity={0.7}
      >
        <View style={styles.eventLeftSection}>
          <View style={styles.eventDotIndicator} />
          <Text style={[styles.eventName, { color: theme.textColor }]}>
            {event.event_name}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={[styles.eventTime, { color: theme.darkGrey }]}>
            {event.start_time}
          </Text>
          <TouchableOpacity
            onPress={() => { setEditingEvent(event); setShowEditEventModal(true); }}
            style={{ marginLeft: 8, padding: 4 }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityLabel="Edit event"
          >
            <Ionicons name="create-outline" size={18} color="#00B8DF" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  // Calendar theme configuration (memoized to prevent recreation on every render)
  const calendarTheme = useMemo(() => ({
    backgroundColor: theme.textFieldBG,
    calendarBackground: theme.textFieldBG,
    textSectionTitleColor: theme.darkGrey,
    selectedDayBackgroundColor: "transparent",
    selectedDayTextColor: theme.textColor,
    todayTextColor: "#ffffff",
    todayBackgroundColor: "#E74C3C",
    dayTextColor: theme.textColor,
    textDisabledColor: theme.darkGrey,
    arrowColor: "#00B8DF",
    monthTextColor: theme.textColor,
    textDayFontFamily: "Raleway",
    textMonthFontFamily: "Raleway-SemiBold",
    textDayHeaderFontFamily: "Raleway",
    textDayFontSize: 14,
    textMonthFontSize: 1,
    textDayHeaderFontSize: 12,
    'stylesheet.calendar.header': {
      header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 0,
        alignItems: 'center',
        height: 0,
        overflow: 'hidden',
        opacity: 0,
      },
      monthText: {
        fontSize: 1,
        height: 0,
        opacity: 0,
      },
    },
    'stylesheet.day.basic': {
      base: {
        flex: 1,
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
      },
      today: {
        backgroundColor: '#E74C3C',
        borderRadius: 16,
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
      },
      todayText: {
        color: '#ffffff',
        fontWeight: 'bold',
        textAlign: 'center',
      },
      selected: {
        backgroundColor: 'transparent',
        borderRadius: 16,
      },
      selectedText: {
        color: theme.textColor,
      },
      text: {
        marginTop: 0,
        fontSize: 14,
        fontFamily: 'Raleway',
      },
      disabledText: {
        color: 'transparent',
      },
    },
    'stylesheet.calendar.main': {
      week: {
        marginTop: 0,
        marginBottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
      },
      container: {
        paddingBottom: 0,
      },
    },
  }), [theme]);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color={theme.textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textColor }]}>
          {currentYear}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Agenda')}>
          <Ionicons name="notifications-outline" size={24} color={theme.textColor} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00B8DF" />
        </View>
      ) : (
        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          style={[styles.scrollView, { backgroundColor: theme.background }]}
        >
          {/* Current Month */}
          <View style={styles.monthCardContainer}>
            <View style={[styles.monthCard, { backgroundColor: theme.textFieldBG }]}>
              <Text style={[
                styles.monthCardTitle,
                { color: theme.textColor },
                (currentMonth === todayMonth && currentYear === todayYear) && styles.currentMonthTitle,
              ]}>
                {monthNames[currentMonth]}
              </Text>
              <Calendar
                current={`${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-01`}
                markedDates={markedDates}
                onDayPress={handleDayPress}
                theme={calendarTheme}
                hideExtraDays={true}
                enableSwipeMonths={false}
                hideArrows={true}
                dayComponent={renderDay}
              />
            </View>
          </View>

          {/* Next Month */}
          <View style={styles.monthCardContainer}>
            <View style={[styles.monthCard, { backgroundColor: theme.textFieldBG }]}>
              <Text style={[
                styles.monthCardTitle,
                { color: theme.textColor },
                (nextMonth === todayMonth && nextYear === todayYear) && styles.currentMonthTitle,
              ]}>
                {monthNames[nextMonth]}
              </Text>
              <Calendar
                current={`${nextYear}-${String(nextMonth + 1).padStart(2, "0")}-01`}
                markedDates={markedDates}
                onDayPress={handleDayPress}
                theme={calendarTheme}
                hideExtraDays={true}
                enableSwipeMonths={false}
                hideArrows={true}
                dayComponent={renderDay}
              />
            </View>
          </View>

          {/* Selected Date Events */}
          {selectedDate && selectedEvents.length > 0 && (
            <View
              ref={eventsSectionRef}
              style={styles.eventsSection}
              collapsable={false}
            >
              <Text style={[styles.eventsTitle, { color: theme.textColor }]}>
                Events on {dayjs(selectedDate).format("MMM DD, YYYY")}
              </Text>
              {selectedEvents.map(renderEventItem)}
            </View>
          )}

          {selectedDate && selectedEvents.length === 0 && (
            <View style={styles.noEventsContainer}>
              <Text style={[styles.noEventsText, { color: theme.darkGrey }]}>
                No events on this day
              </Text>
            </View>
          )}

          <View style={{ height: 100 }} />
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
        selectedDate={selectedDate}
        onEventAdded={() => {
          fetchMonthlyEvents();
        }}
      />

      {/* Edit Event Modal */}
      <EditEventModal
        visible={showEditEventModal}
        event={editingEvent}
        onClose={() => setShowEditEventModal(false)}
        // After editing or deleting an event, close the modal and refetch events
        onEventUpdated={async () => {
          setShowEditEventModal(false);
          // Refetch all events and update the selected date's events
          const freshIndexedEvents = await fetchMonthlyEvents();
          if (selectedDate && freshIndexedEvents) {
            setSelectedEvents(freshIndexedEvents[selectedDate] || []);
          }
        }}
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
    paddingTop: 30,
    paddingBottom: 10,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: "Raleway-Bold",
  },
  scrollView: {
  },
  monthCardContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  monthCard: {
    borderRadius: 12,
    padding: 16,
    paddingBottom: 4,
    minHeight: 320,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  monthCardTitle: {
    fontSize: 18,
    fontFamily: "Raleway-Bold",
    marginBottom: 8,
    textAlign: "left",
  },
  currentMonthTitle: {
    color: "#00B8DF",
  },
  monthSection: {
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  monthTitle: {
    fontSize: 20,
    fontFamily: "Raleway-SemiBold",
    marginBottom: 10,
    marginLeft: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  eventsSection: {
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  eventsTitle: {
    fontSize: 18,
    fontFamily: "Raleway-SemiBold",
    marginBottom: 12,
  },
  eventCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 8,
  },
  eventLeftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  eventDotIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#E74C3C",
    marginRight: 12,
  },
  eventName: {
    fontSize: 15,
    fontFamily: "Raleway",
    lineHeight: 20,
    flex: 1,
  },
  eventTime: {
    fontSize: 14,
    fontFamily: "Raleway",
    lineHeight: 20,
    marginLeft: 12,
  },
  noEventsContainer: {
    padding: 30,
    alignItems: "center",
  },
  noEventsText: {
    fontSize: 14,
    fontFamily: "Raleway",
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

export default CalendarMonthlyView;

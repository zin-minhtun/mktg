import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  SectionList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  RefreshControl,
  StatusBar,
  Platform,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { format, isToday, isYesterday, startOfDay, addDays, formatDistanceToNow } from 'date-fns';
import axios from 'axios';
import { API_URL } from '@env';
import { useUserData } from '../Contexts/UserContext';
import { useTheme } from '../Contexts/ThemeContext';
import NotificationService from '../Services/NotificationService';

export default function NotificationListScreen() {
  const navigation = useNavigation();
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { gUser } = useUserData();
  const { theme } = useTheme();
  const userId = gUser ? (gUser._id || gUser.id) : null;

  useFocusEffect(
    useCallback(() => {
      if (userId) {
        loadData();
      }
    }, [userId])
  );

  const loadData = async () => {
    try {
      if (!refreshing) setLoading(true);

      const [logs, { events, medications }] = await Promise.all([
        NotificationService.getNotificationLogs(),
        loadAllNotifications()
      ]);

      processData(logs, events, medications);

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const loadAllNotifications = async () => {
    try {
      // Load calendar events
      const today = new Date();
      const futureDate = new Date();
      futureDate.setMonth(futureDate.getMonth() + 3);

      const startDate = format(today, 'yyyy-MM-dd');
      const endDate = format(futureDate, 'yyyy-MM-dd');

      const eventsPromise = axios.get(
        `${API_URL}/api/v1/calendar-events/range`,
        { params: { userId, startDate, endDate } }
      );

      // Load medication reminders
      const medicationsPromise = axios.get(`${API_URL}/api/meds/records/${userId}`);

      const [eventsRes, medsRes] = await Promise.all([eventsPromise, medicationsPromise]);

      const events = eventsRes.data || [];
      const medications = medsRes.data?.data || [];

      return { events, medications };
    } catch (error) {
      console.error('Error loading notifications:', error);
      return { events: [], medications: [] };
    }
  };

  const processData = (logs, events, medications) => {
    const rawItems = [];

    logs.forEach(log => {
      rawItems.push({
        id: log.id,
        type: 'log',
        category: log.type || 'GENERAL',
        title: log.title,
        subtitle: log.body,
        date: new Date(log.receivedAt),
        entityId: log.entityId || log.title,
        isRead: log.read,
        data: log
      });
    });

    events.forEach(event => {
      const eventDate = parseEventDate(event.date, event.start_time);
      if (eventDate && eventDate > new Date()) {
        rawItems.push({
          id: event._id,
          type: 'event',
          category: 'EVENT',
          title: event.event_name,
          subtitle: `${event.start_time} - ${event.end_time}`,
          date: eventDate,
          entityId: event._id,
          isRead: true,
          data: event
        });
      }
    });

    // Add medication reminders (only show today's upcoming doses)
    medications.forEach(med => {
      if (med.medicationName && med.frequency) {
        // Create reminder for next dose (simplified - you can enhance with actual schedule)
        const now = new Date();
        const nextDose = new Date();
        nextDose.setHours(now.getHours() + 4, 0, 0, 0); // Example: 4 hours from now

        rawItems.push({
          id: `med-${med._id}`,
          type: 'medication',
          category: 'MEDICATION',
          title: `Take ${med.medicationName}`,
          subtitle: `${med.dosage} • ${med.frequency}`,
          date: nextDose,
          entityId: med._id,
          isRead: false,
          data: med
        });
      }
    });

    rawItems.sort((a, b) => b.date - a.date);

    const buckets = {
      Upcoming: [],
      Today: [],
      Yesterday: [],
      Older: []
    };

    const todayStart = startOfDay(new Date());
    const tomorrowStart = addDays(todayStart, 1);

    rawItems.forEach(item => {
      if (item.date >= tomorrowStart) {
        buckets.Upcoming.push(item);
      } else if (item.date >= todayStart) {
        buckets.Today.push(item);
      } else if (isYesterday(item.date)) {
        buckets.Yesterday.push(item);
      } else {
        buckets.Older.push(item);
      }
    });

    const newSections = [
      { title: 'Upcoming', data: buckets.Upcoming },
      { title: 'Today', data: buckets.Today },
      { title: 'Yesterday', data: buckets.Yesterday },
      { title: 'Older', data: buckets.Older }
    ].filter(s => s.data.length > 0);

    setSections(newSections);
  };

  const parseEventDate = (dateStr, timeStr) => {
    try {
      const dateOnly = dateStr.split('T')[0];
      const [year, month, day] = dateOnly.split('-').map(Number);
      const [time, modifier] = timeStr.split(' ');
      let [hours, minutes] = time.split(':');
      hours = parseInt(hours, 10);
      minutes = parseInt(minutes, 10);
      if (modifier === 'PM' && hours !== 12) hours += 12;
      else if (modifier === 'AM' && hours === 12) hours = 0;
      return new Date(year, month - 1, day, hours, minutes);
    } catch (e) { return null; }
  };

  const handleItemPress = (item) => {
    if (item.type === 'log') {
      NotificationService.markLogAsRead(item.id);
      loadData();
    } else {
      navigation.navigate('Calendar');
    }
  };

  const handleDeleteNotification = (item) => {
    Alert.alert(
      "Delete Notification",
      `Are you sure you want to delete "${item.title}"?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              if (item.type === 'event') {
                // Delete calendar event
                await axios.delete(`${API_URL}/api/v1/calendar-events/${item.entityId}`);
              } else if (item.type === 'medication') {
                // Delete medication reminder
                await axios.delete(`${API_URL}/api/meds/delete/${item.entityId}`);
              } else if (item.type === 'log') {
                // Delete notification log
                await NotificationService.deleteLog(item.id);
              }
              // Reload data
              loadData();
            } catch (error) {
              console.error('Error deleting notification:', error);
              Alert.alert('Error', 'Failed to delete notification');
            }
          }
        }
      ]
    );
  };

  const getSectionColor = (title) => {
    switch (title) {
      case 'Upcoming':
        return '#00BCD4'; // Cyan
      case 'Today':
        return '#FF5252'; // Red
      case 'Yesterday':
        return '#9E9E9E'; // Gray
      default:
        return '#9E9E9E'; // Gray
    }
  };

  const renderItem = ({ item }) => {
    // Format date to show actual time/date
    let dateStr;
    if (isToday(item.date)) {
      dateStr = `Today at ${format(item.date, 'h:mm a')}`;
    } else if (isYesterday(item.date)) {
      dateStr = `Yesterday at ${format(item.date, 'h:mm a')}`;
    } else {
      // Show relative time for older items (e.g., "2 weeks ago")
      dateStr = formatDistanceToNow(item.date, { addSuffix: true });
    }

    // Choose icon and color based on type
    const iconName = item.type === 'medication' ? 'medkit-outline' : 'calendar-outline';
    const iconBgColor = item.type === 'medication' ? '#3B82F6' : '#00BCD4'; // Blue for meds, cyan for calendar

    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: theme.textFieldBG }]}
        onPress={() => handleItemPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.cardContent}>
          {/* Icon Box */}
          <View style={[styles.iconBox, { backgroundColor: iconBgColor }]}>
            <Ionicons name={iconName} size={24} color="#FFFFFF" />
          </View>

          {/* Content */}
          <View style={styles.textContainer}>
            <Text style={[styles.itemTitle, { color: theme.textColor }]} numberOfLines={1}>
              {item.title}
            </Text>

            <Text style={[styles.itemSubtitle, { color: theme.darkGrey }]} numberOfLines={1}>
              {item.subtitle}
            </Text>

            <Text style={[styles.itemSubtitle, { fontSize: 12, marginTop: 2, opacity: 0.7, color: theme.darkGrey }]}>
              {dateStr}
            </Text>
          </View>

          {/* Three dots menu - triggers delete */}
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => handleDeleteNotification(item)}
          >
            <Ionicons name="ellipsis-horizontal" size={20} color={theme.darkGrey} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSectionHeader = ({ section: { title } }) => {
    const color = getSectionColor(title);

    return (
      <View style={[styles.sectionHeader, { backgroundColor: theme.background }]}>
        <Text style={[styles.sectionHeaderText, { color: color }]}>{title}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'} />



      {/* Header - Centered Title */}
      <View style={[styles.navbar, { backgroundColor: theme.textFieldBG }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color={theme.textColor} />
        </TouchableOpacity>

        <Text style={[styles.navTitle, { color: theme.textColor }]}>My Schedule & History</Text>

        <View style={{ width: 40 }} />
      </View>

      {/* List */}
      {loading && !refreshing ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.primaryLighBlue} />
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item, index) => item.id + index}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View style={styles.center}>
              <Ionicons name="notifications-off-outline" size={64} color={theme.darkGrey} />
              <Text style={[styles.emptyText, { color: theme.textColor }]}>No notifications yet</Text>
              <Text style={[styles.emptySubtext, { color: theme.darkGrey }]}>
                You'll see notifications for appointments and reminders here
              </Text>
            </View>
          }
          stickySectionHeadersEnabled={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 8,
    padding: 8,
  },
  navTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  center: {
    paddingTop: 100,
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
  },
  emptySubtext: {
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 40,
  },
  sectionHeader: {
    paddingTop: 16,
    paddingBottom: 12,
  },
  sectionHeaderText: {
    fontSize: 15,
    fontWeight: '600',
  },
  card: {
    borderRadius: 12,
    marginBottom: 8,
    ...Platform.select({
      android: {
        elevation: 1,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      }
    })
  },
  cardContent: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 13,
  },
  menuButton: {
    padding: 4,
  },
});

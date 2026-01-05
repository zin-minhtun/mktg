import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Switch,
  TouchableOpacity,
  StyleSheet,
  Platform,
  SafeAreaView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useNotifications } from '../../Contexts/NotificationContext';
import { useTheme } from '../../Contexts/ThemeContext';

const NotificationSettings = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const {
    notificationSettings,
    permissionsGranted,
    toggleEventNotifications,
    toggleMedicationNotifications,
    toggleJournalNotifications,
    setEventReminderTime,
    setJournalPromptTime,
    toggleQuietHours,
  } = useNotifications();

  const [showReminderPicker, setShowReminderPicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const reminderOptions = [
    { label: '5 minutes before', value: 5 },
    { label: '15 minutes before', value: 15 },
    { label: '30 minutes before', value: 30 },
    { label: '1 hour before', value: 60 },
    { label: '2 hours before', value: 120 },
  ];

  const handleReminderTimeChange = (minutes) => {
    setEventReminderTime(minutes);
    setShowReminderPicker(false);
  };

  // Parse time string (e.g., "08:00 PM") to Date object
  const parseTimeToDate = (timeString) => {
    const [time, modifier] = timeString.split(' ');
    let [hours, minutes] = time.split(':');
    hours = parseInt(hours, 10);
    minutes = parseInt(minutes, 10);

    if (modifier === 'PM' && hours !== 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;

    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  // Format Date object to time string (e.g., "08:00 PM")
  const formatDateToTime = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const modifier = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12 || 12; // Convert 0 to 12 for midnight
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedHours = hours.toString().padStart(2, '0');

    return `${formattedHours}:${formattedMinutes} ${modifier}`;
  };

  // Handle time change from picker
  const handleTimeChange = async (event, selectedTime) => {
    setShowTimePicker(false);

    if (event.type === 'set' && selectedTime) {
      const timeString = formatDateToTime(selectedTime);
      await setJournalPromptTime(timeString);
    }
  };

  const renderToggleRow = (title, description, value, onToggle) => (
    <View style={[styles.row, { borderBottomColor: theme.borderColor }]}>
      <View style={styles.rowContent}>
        <Text style={[styles.rowTitle, { color: theme.textColor }]}>{title}</Text>
        <Text style={[styles.rowDescription, { color: theme.darkGrey }]}>
          {description}
        </Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        disabled={!permissionsGranted}
        trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
        thumbColor={value ? '#3B82F6' : '#F3F4F6'}
      />
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* NOTIFICATION TYPES Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionHeader, { color: theme.darkGrey }]}>
            NOTIFICATION TYPES
          </Text>

          {/* Calendar Events */}
          <View style={[styles.card, { backgroundColor: theme.textFieldBG }]}>
            {renderToggleRow(
              'Calendar Events',
              'Get notified before your scheduled events',
              notificationSettings.eventsEnabled,
              toggleEventNotifications
            )}

            {notificationSettings.eventsEnabled && (
              <View style={styles.nestedSetting}>
                <Text style={[styles.nestedLabel, { color: theme.textColor }]}>
                  Reminder Time
                </Text>
                <TouchableOpacity
                  onPress={() => setShowReminderPicker(!showReminderPicker)}
                  style={[styles.input, {
                    backgroundColor: theme.background,
                    borderColor: theme.borderColor
                  }]}
                >
                  <Text style={[styles.inputText, { color: theme.textColor }]}>
                    {reminderOptions.find(opt => opt.value === notificationSettings.eventReminderTime)?.label || '15 minutes before'}
                  </Text>
                  <Ionicons name="chevron-down" size={16} color={theme.darkGrey} />
                </TouchableOpacity>

                {showReminderPicker && (
                  <View style={[styles.pickerContainer, {
                    backgroundColor: theme.textFieldBG,
                    borderColor: theme.borderColor
                  }]}>
                    {reminderOptions.map((option) => (
                      <TouchableOpacity
                        key={option.value}
                        onPress={() => handleReminderTimeChange(option.value)}
                        style={[
                          styles.pickerOption,
                          { borderBottomColor: theme.borderColor },
                          option.value === notificationSettings.eventReminderTime && {
                            backgroundColor: '#EFF6FF'
                          }
                        ]}
                      >
                        <Text style={[
                          styles.pickerText,
                          { color: theme.textColor },
                          option.value === notificationSettings.eventReminderTime && {
                            color: '#3B82F6',
                            fontWeight: '600'
                          }
                        ]}>
                          {option.label}
                        </Text>
                        {option.value === notificationSettings.eventReminderTime && (
                          <Ionicons name="checkmark" size={16} color="#3B82F6" />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            )}
          </View>

          {/* Medications */}
          <View style={[styles.card, { backgroundColor: theme.textFieldBG }]}>
            {renderToggleRow(
              'Medications',
              'Reminders for medication schedules',
              notificationSettings.medicationsEnabled,
              toggleMedicationNotifications
            )}
          </View>

          {/* Journal Prompts */}
          <View style={[styles.card, { backgroundColor: theme.textFieldBG }]}>
            {renderToggleRow(
              'Daily Pain Check-in',
              'Daily reminder to log your pain level',
              notificationSettings.journalEnabled,
              toggleJournalNotifications
            )}

            {notificationSettings.journalEnabled && (
              <View style={styles.nestedSetting}>
                <Text style={[styles.nestedLabel, { color: theme.textColor }]}>
                  Daily Prompt Time
                </Text>
                <TouchableOpacity
                  onPress={() => setShowTimePicker(true)}
                  style={[styles.input, {
                    backgroundColor: theme.background,
                    borderColor: theme.borderColor
                  }]}
                >
                  <Text style={[styles.inputText, { color: theme.textColor }]}>
                    {notificationSettings.journalPromptTime}
                  </Text>
                  <Ionicons name="time-outline" size={16} color={theme.darkGrey} />
                </TouchableOpacity>

                {showTimePicker && (
                  <DateTimePicker
                    value={parseTimeToDate(notificationSettings.journalPromptTime)}
                    mode="time"
                    display="default"
                    onChange={handleTimeChange}
                  />
                )}
              </View>
            )}
          </View>
        </View>

        {/* DO NOT DISTURB Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionHeader, { color: theme.darkGrey }]}>
            DO NOT DISTURB
          </Text>

          <View style={[styles.card, { backgroundColor: theme.textFieldBG }]}>
            {renderToggleRow(
              'Quiet Hours',
              'Silence notifications during specific hours',
              notificationSettings.quietHoursEnabled,
              toggleQuietHours
            )}
          </View>
        </View>

        {/* Info Footer */}
        <View style={[styles.infoContainer, { backgroundColor: theme.textFieldBG }]}>
          <Ionicons name="information-circle-outline" size={16} color={theme.darkGrey} style={styles.infoIcon} />
          <Text style={[styles.infoText, { color: theme.darkGrey }]}>
            Notifications help you stay on track with your health goals.
          </Text>
        </View>

        <View style={{ height: 50 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 80,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 10,
    opacity: 0.6,
  },
  card: {
    borderRadius: 10,
    marginBottom: 8,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      }
    })
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  rowContent: {
    flex: 1,
    marginRight: 12,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  rowDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  nestedSetting: {
    paddingHorizontal: 14,
    paddingBottom: 12,
    paddingTop: 4,
  },
  nestedLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  inputText: {
    fontSize: 14,
    flex: 1,
  },
  hint: {
    fontSize: 11,
    marginTop: 6,
    opacity: 0.6,
  },
  pickerContainer: {
    marginTop: 6,
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  pickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
  },
  pickerText: {
    fontSize: 14,
    flex: 1,
  },
  infoContainer: {
    flexDirection: 'row',
    marginTop: 24,
    padding: 12,
    borderRadius: 10,
    alignItems: 'flex-start',
    opacity: 0.7,
  },
  infoIcon: {
    marginRight: 10,
    marginTop: 1,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
  },
});

export default NotificationSettings;

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  Modal,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useTheme } from "../../Contexts/ThemeContext";
import { useUserData } from "../../Contexts/UserContext";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import { API_URL } from "@env";
import dayjs from "dayjs";
import NotificationService from "../../Services/NotificationService";
import { useNotifications } from "../../Contexts/NotificationContext";

const AddEventModal = ({ visible, onClose, selectedDate, onEventAdded }) => {
  const { theme } = useTheme();
  const { gUser } = useUserData();
  const { notificationSettings } = useNotifications();

  const [eventName, setEventName] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!visible) {
      setEventName("");
      setNotes("");
      setDate(null);
      setStartTime(null);
      setEndTime(null);
      setShowDatePicker(false);
      setShowStartTimePicker(false);
      setShowEndTimePicker(false);
    }
  }, [visible]);

  const formatTime = (date) => {
    return dayjs(date).format("h:mm A");
  };

  const formatDate = (date) => {
    return dayjs(date).format("MMMM DD, YYYY");
  };

  const isFormValid = () => {
    return (
      eventName.trim().length >= 3 &&
      eventName.trim().length <= 100 &&
      date !== null &&
      startTime !== null &&
      endTime !== null &&
      endTime > startTime &&
      notes.length <= 500
    );
  };

  const handleSaveEvent = async () => {
    if (!isFormValid()) return;

    try {
      setSaving(true);
      const userId = gUser?.id || gUser?._id;
      const email = gUser?.email;

      const eventData = {
        userId,
        email,
        event_name: eventName.trim(),
        date: dayjs(date).format("YYYY-MM-DD"),
        start_time: formatTime(startTime),
        end_time: formatTime(endTime),
        notes: notes.trim(),
      };

      const response = await axios.post(
        `${API_URL}/api/v1/calendar-events`,
        eventData
      );

      if (response.status === 201) {
        const createdEvent = response.data.event || response.data;
        
        // Schedule notification if enabled
        if (notificationSettings.eventsEnabled && createdEvent) {
          await NotificationService.scheduleEventNotification(
            createdEvent,
            notificationSettings.eventReminderTime
          );
        }

        Alert.alert("Success", "Event created successfully!");
        onEventAdded?.();
        onClose();
      }
    } catch (error) {
      console.error("Error creating event:", error);
      Alert.alert(
        "Error",
        error.response?.data?.error || "Failed to create event. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleStartTimeChange = (event, selectedTime) => {
    setShowStartTimePicker(false);
    if (selectedTime) {
      setStartTime(selectedTime);
    }
  };

  const handleEndTimeChange = (event, selectedTime) => {
    setShowEndTimePicker(false);
    if (selectedTime) {
      setEndTime(selectedTime);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.modalBackdrop} />
        </TouchableWithoutFeedback>

        <View style={[styles.modalContentFixed, { backgroundColor: theme.background }]}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.textColor }]}>Add new event</Text>
          </View>

          {/* Event Name */}
          <TextInput
            style={[styles.inputFixed, { backgroundColor: theme.textFieldBG, borderColor: theme.borderColor, color: theme.textColor }]}
            placeholder="Event name*"
            placeholderTextColor={theme.darkGrey}
            value={eventName}
            onChangeText={setEventName}
            maxLength={100}
          />

          {/* Notes */}
          <TextInput
            style={[styles.inputFixed, styles.textAreaFixed, { backgroundColor: theme.textFieldBG, borderColor: theme.borderColor, color: theme.textColor }]}
            placeholder="Type the note here..."
            placeholderTextColor={theme.darkGrey}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
            maxLength={500}
          />

          {/* Date */}
          <TouchableOpacity
            style={[styles.inputFixed, { backgroundColor: theme.textFieldBG, borderColor: theme.borderColor }]}
            onPress={() => {
              setShowDatePicker(true);
              setShowStartTimePicker(false);
              setShowEndTimePicker(false);
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ color: date ? theme.textColor : theme.darkGrey, fontSize: 16 }}>
                {date ? formatDate(date) : 'Date'}
              </Text>
              <Ionicons name="calendar-outline" size={20} color={theme.darkGrey} />
            </View>
          </TouchableOpacity>

          {/* Time Row */}
          <View style={styles.timeRowFixed}>
            {/* Start Time */}
            <TouchableOpacity
              style={[styles.inputFixed, styles.timeInputFixed, { backgroundColor: theme.textFieldBG, borderColor: theme.borderColor }]}
              onPress={() => {
                setShowStartTimePicker(true);
                setShowDatePicker(false);
                setShowEndTimePicker(false);
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: startTime ? theme.textColor : theme.darkGrey, fontSize: 16 }}>
                  {startTime ? formatTime(startTime) : 'Start'}
                </Text>
                <Ionicons name="time-outline" size={20} color={theme.darkGrey} />
              </View>
            </TouchableOpacity>

            {/* End Time */}
            <TouchableOpacity
              style={[styles.inputFixed, styles.timeInputFixed, { backgroundColor: theme.textFieldBG, borderColor: theme.borderColor }]}
              onPress={() => {
                setShowEndTimePicker(true);
                setShowDatePicker(false);
                setShowStartTimePicker(false);
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: endTime ? theme.textColor : theme.darkGrey, fontSize: 16 }}>
                  {endTime ? formatTime(endTime) : 'End time'}
                </Text>
                <Ionicons name="time-outline" size={20} color={theme.darkGrey} />
              </View>
            </TouchableOpacity>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={[
              styles.saveButton,
              !isFormValid() && styles.saveButtonDisabled,
            ]}
            onPress={handleSaveEvent}
            disabled={!isFormValid() || saving}
          >
            <Text style={styles.saveButtonText}>
              {saving ? "Saving..." : "Save Event"}
            </Text>
          </TouchableOpacity>

          {/* Date Picker */}
          {showDatePicker && (
            <DateTimePicker
              value={date || new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}

          {/* Start Time Picker */}
          {showStartTimePicker && (
            <DateTimePicker
              value={startTime || new Date()}
              mode="time"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleStartTimeChange}
            />
          )}

          {/* End Time Picker */}
          {showEndTimePicker && (
            <DateTimePicker
              value={endTime || new Date()}
              mode="time"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleEndTimeChange}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "transparent",
  },
  modalContentFixed: {
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 24,
    paddingBottom: 32,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: "Raleway-Bold",
  },
  inputFixed: {
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 14,
    fontFamily: "Raleway",
  },
  textAreaFixed: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  timeRowFixed: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  timeInputFixed: {
    flex: 1,
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: "#00B8DF",
    borderRadius: 25,
    padding: 18,
    alignItems: "center",
    marginTop: 8,
    opacity: 1,
  },
  saveButtonDisabled: {
    opacity: 1,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Raleway-Bold",
  },
});

export default AddEventModal;

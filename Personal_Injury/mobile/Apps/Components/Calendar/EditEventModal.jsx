import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, Alert, Modal } from "react-native";
import { useTheme } from "../../Contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import dayjs from "dayjs";
import axios from "axios";
import { API_URL } from "@env";
import NotificationService from "../../Services/NotificationService";
import { useNotifications } from "../../Contexts/NotificationContext";

const EditEventModal = ({ visible, event, onClose, onEventUpdated }) => {
  const { theme } = useTheme();
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
    if (visible && event) {
      console.log("EditEventModal: Received event:", event._id || event.id, event.event_name);
      console.log("EditEventModal: Full event object:", JSON.stringify(event, null, 2));
      setEventName(event.event_name || "");
      setNotes(event.notes || "");
      const d = event.date ? new Date(event.date) : new Date();
      setDate(d);
      setStartTime(parseTimeToToday(event.start_time));
      setEndTime(parseTimeToToday(event.end_time));
    }
  }, [visible, event]);

  const parseTimeToToday = (timeStr) => {
    if (!timeStr) return new Date();
    const [time, meridiem] = timeStr.split(" ");
    const [hStr, mStr] = time.split(":");
    let h = parseInt(hStr, 10);
    const m = parseInt(mStr, 10);
    if (meridiem?.toUpperCase() === "PM" && h !== 12) h += 12;
    if (meridiem?.toUpperCase() === "AM" && h === 12) h = 0;
    const now = new Date();
    now.setHours(h, m, 0, 0);
    return new Date(now);
  };

  const formatTime = (d) => dayjs(d).format("h:mm A");
  const formatDate = (d) => dayjs(d).format("MMMM DD, YYYY");

  const isFormValid = () => {
    return (
      eventName.trim().length >= 3 &&
      eventName.trim().length <= 100 &&
      !!date && !!startTime && !!endTime && endTime > startTime &&
      notes.length <= 500
    );
  };

  const handleUpdate = async () => {
    const eventId = event?._id || event?.id;
    if (!eventId) {
      Alert.alert("Error", "Missing event identifier; cannot update.");
      return;
    }
    if (!isFormValid()) return;
    try {
      setSaving(true);
      const payload = {
        event_name: eventName.trim(),
        date: dayjs(date).format("YYYY-MM-DD"),
        start_time: formatTime(startTime),
        end_time: formatTime(endTime),
        notes: notes.trim(),
      };
      const url = `${API_URL.replace(/\/$/, '')}/api/v1/calendar-events/${eventId}`;
      const res = await axios.put(url, payload);
      if (res.status === 200) {
        console.log("Update successful");
        
        // Cancel old notifications and schedule new ones if enabled
        await NotificationService.cancelEventNotifications(eventId);
        if (notificationSettings.eventsEnabled) {
          const updatedEvent = { 
            _id: eventId,
            ...payload,
            date: dayjs(date).toDate(),
            start_time: startTime,
            end_time: endTime
          };
          await NotificationService.scheduleEventNotification(
            updatedEvent,
            notificationSettings.eventReminderTime
          );
        }
        
        await new Promise(resolve => setTimeout(resolve, 300));
        console.log("Triggering update callbacks");
        onEventUpdated?.();
        onClose?.();
        setTimeout(() => {
          Alert.alert("Success", "Event updated successfully");
        }, 100);
      }
    } catch (e) {
      console.error("Update event error", e);
      Alert.alert("Error", e.response?.data?.error || "Failed to update event");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const eventId = event?._id || event?.id;
    if (!eventId) {
      Alert.alert("Error", "Missing event identifier; cannot delete.");
      return;
    }
    Alert.alert("Delete Event", "Are you sure you want to delete this event?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            setSaving(true);
            const url = `${API_URL.replace(/\/$/, '')}/api/v1/calendar-events/${eventId}`;
            console.log("Deleting event:", eventId, "URL:", url);
            const res = await axios.delete(url);
            console.log("Delete response:", res.status, res.data);
            if (res.status === 200) {
              console.log("Delete successful - event removed from database");
              
              // Cancel notifications for deleted event
              await NotificationService.cancelEventNotifications(eventId);
              
              await new Promise(resolve => setTimeout(resolve, 300));
              console.log("Triggering onEventUpdated and onClose callbacks");
              onEventUpdated?.();
              onClose?.();
              setTimeout(() => {
                Alert.alert("Success", "Event deleted successfully");
              }, 100);
            }
          } catch (e) {
            console.error("Delete event error", e);
            console.error("Delete error details:", e.response?.data);
            Alert.alert("Error", e.response?.data?.error || "Failed to delete event");
          } finally {
            setSaving(false);
          }
        }
      }
    ]);
  };

  const onDateChange = (evt, selected) => {
    setShowDatePicker(false);
    if (selected) setDate(selected);
  };
  const onStartChange = (evt, selected) => {
    setShowStartTimePicker(false);
    if (selected) setStartTime(selected);
  };
  const onEndChange = (evt, selected) => {
    setShowEndTimePicker(false);
    if (selected) setEndTime(selected);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        <View style={[styles.sheet, { backgroundColor: theme.background }]}> 
          <Text style={[styles.title, { color: theme.textColor }]}>Edit event</Text>

          <TextInput
            style={[styles.input, { backgroundColor: theme.textFieldBG, borderColor: theme.borderColor, color: theme.textColor }]}
            value={eventName}
            onChangeText={setEventName}
            placeholder="Event name*"
            placeholderTextColor={theme.darkGrey}
            maxLength={100}
          />

          <TextInput
            style={[styles.input, styles.textArea, { backgroundColor: theme.textFieldBG, borderColor: theme.borderColor, color: theme.textColor }]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Type the note here..."
            placeholderTextColor={theme.darkGrey}
            multiline
            numberOfLines={3}
            maxLength={500}
          />

          <TouchableOpacity style={[styles.input, { backgroundColor: theme.textFieldBG, borderColor: theme.borderColor }]} onPress={() => setShowDatePicker(true)}>
            <View style={styles.rowBetween}>
              <Text style={{ color: theme.textColor, fontSize: 16 }}>{formatDate(date)}</Text>
              <Ionicons name="calendar-outline" size={20} color={theme.darkGrey} />
            </View>
          </TouchableOpacity>

          <View style={styles.timeRow}>
            <TouchableOpacity style={[styles.input, styles.timeInput, { backgroundColor: theme.textFieldBG, borderColor: theme.borderColor }]} onPress={() => setShowStartTimePicker(true)}>
              <View style={styles.rowBetween}>
                <Text style={{ color: theme.textColor, fontSize: 16 }}>{formatTime(startTime)}</Text>
                <Ionicons name="time-outline" size={20} color={theme.darkGrey} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.input, styles.timeInput, { backgroundColor: theme.textFieldBG, borderColor: theme.borderColor }]} onPress={() => setShowEndTimePicker(true)}>
              <View style={styles.rowBetween}>
                <Text style={{ color: theme.textColor, fontSize: 16 }}>{formatTime(endTime)}</Text>
                <Ionicons name="time-outline" size={20} color={theme.darkGrey} />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.footerRow}>
            <TouchableOpacity style={[styles.button, styles.deleteBtn, { backgroundColor: theme.mode === 'dark' ? theme.textFieldBG : '#F9F9F9', borderColor: theme.mode === 'dark' ? '#F3D1D1' : '#F3D1D1' }]} onPress={handleDelete} disabled={saving}>
              <Text style={[styles.buttonText, { color: '#D9534F' }]}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, isFormValid() ? [styles.primaryBtn, { backgroundColor: '#00B8DF' }] : [styles.disabledBtn, { backgroundColor: theme.mode === 'dark' ? '#2b3a44' : '#D3D3D3' }]]} onPress={handleUpdate} disabled={!isFormValid() || saving}>
              <Text style={styles.buttonText}>{saving ? 'Saving...' : 'Save Event'}</Text>
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker value={date} mode="date" display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={onDateChange} />
          )}
          {showStartTimePicker && (
            <DateTimePicker value={startTime} mode="time" display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={onStartChange} />
          )}
          {showEndTimePicker && (
            <DateTimePicker value={endTime} mode="time" display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={onEndChange} />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { flex: 1, backgroundColor: 'transparent' },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: 32,
  },
  title: { fontSize: 22, fontWeight: '700', color: '#183153', textAlign: 'center', marginBottom: 16, fontFamily: 'Raleway-Bold' },
  input: { backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#E0E0E0', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, marginBottom: 14, color: '#222', fontFamily: 'Raleway' },
  textArea: { minHeight: 60, textAlignVertical: 'top' },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  timeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  timeInput: { flex: 1, marginRight: 8 },
  footerRow: { flexDirection: 'row', gap: 12, marginTop: 8 },
  button: { flex: 1, borderRadius: 25, padding: 16, alignItems: 'center', justifyContent: 'center' },
  primaryBtn: { backgroundColor: '#00B8DF' },
  disabledBtn: { backgroundColor: '#D3D3D3' },
  deleteBtn: { backgroundColor: '#F9F9F9', borderWidth: 1, borderColor: '#F3D1D1' },
  buttonText: { color: '#fff', fontSize: 16, fontFamily: 'Raleway-Bold' },
});

export default EditEventModal;

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Switch,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    StatusBar,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNotifications } from '../Contexts/NotificationContext';
import { useTheme } from '../Contexts/ThemeContext';
import DateTimePicker from '@react-native-community/datetimepicker';

const NotificationSettingsScreen = ({ navigation }) => {
    const { theme } = useTheme();
    const {
        notificationSettings,
        toggleEventNotifications,
        toggleMedicationNotifications,
        toggleJournalNotifications,
        toggleQuietHours,
        setQuietHours,
    } = useNotifications();

    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);

    // Helper to parse time string "10:00 PM" to Date object for picker
    const parseTime = (timeStr) => {
        const d = new Date();
        const [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':');
        hours = parseInt(hours, 10);
        if (hours === 12 && modifier === 'AM') hours = 0;
        if (hours !== 12 && modifier === 'PM') hours += 12;
        d.setHours(hours, parseInt(minutes, 10), 0);
        return d;
    };

    // Helper to format Date object to "10:00 PM"
    const formatTime = (date) => {
        let hours = date.getHours();
        let minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        return hours + ':' + minutes + ' ' + ampm;
    };

    const handleStartTimeChange = (event, selectedDate) => {
        setShowStartPicker(Platform.OS === 'ios');
        if (selectedDate) {
            const timeStr = formatTime(selectedDate);
            setQuietHours(timeStr, notificationSettings.quietHoursEnd);
        }
    };

    const handleEndTimeChange = (event, selectedDate) => {
        setShowEndPicker(Platform.OS === 'ios');
        if (selectedDate) {
            const timeStr = formatTime(selectedDate);
            setQuietHours(notificationSettings.quietHoursStart, timeStr);
        }
    };

    const renderToggleItem = (title, subtitle, value, onToggle, icon) => (
        <View style={[styles.card, { backgroundColor: theme.textFieldBG, borderColor: theme.borderColor }]}>
            <View style={styles.cardHeader}>
                <View style={styles.iconContainer}>
                    <Ionicons name={icon} size={22} color={theme.primary} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={[styles.itemTitle, { color: theme.textColor }]}>{title}</Text>
                    {subtitle && <Text style={[styles.itemSubtitle, { color: theme.darkGrey }]}>{subtitle}</Text>}
                </View>
                <Switch
                    trackColor={{ false: '#767577', true: theme.primary }}
                    thumbColor={Platform.OS === 'ios' ? '#fff' : value ? '#fff' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={onToggle}
                    value={value}
                />
            </View>
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <StatusBar barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'} />

            {/* Header */}
            <View style={[styles.header, { borderBottomColor: theme.borderColor }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color={theme.textColor} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.textColor }]}>Notifications</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                {/* DEBUG MARKER - REMOVE AFTER CONFIRMING */}
                <View style={{ backgroundColor: '#FF0000', padding: 20, marginBottom: 20 }}>
                    <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>
                        ✅ EDITING CORRECT FILE ✅
                    </Text>
                </View>

                <Text style={[styles.sectionTitle, { color: theme.darkGrey }]}>NOTIFICATION TYPES</Text>

                {renderToggleItem(
                    "Calendar Events",
                    "Get reminders for upcoming appointments",
                    notificationSettings.eventsEnabled,
                    toggleEventNotifications,
                    "calendar-outline"
                )}

                {renderToggleItem(
                    "Medications",
                    "Receive alerts to take your medications",
                    notificationSettings.medicationsEnabled,
                    toggleMedicationNotifications,
                    "medkit-outline"
                )}

                {renderToggleItem(
                    "Journal Prompts",
                    "Daily reminders to log your progress",
                    notificationSettings.journalEnabled,
                    toggleJournalNotifications,
                    "journal-outline"
                )}

                <Text style={[styles.sectionTitle, { color: theme.darkGrey, marginTop: 32 }]}>DO NOT DISTURB</Text>

                <View style={[styles.card, { backgroundColor: theme.textFieldBG, borderColor: theme.borderColor }]}>
                    <View style={styles.cardHeader}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="moon-outline" size={22} color={theme.primary} />
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={[styles.itemTitle, { color: theme.textColor }]}>Do Not Disturb</Text>
                            <Text style={[styles.itemSubtitle, { color: theme.darkGrey }]}>Mute notifications during set hours</Text>
                        </View>
                        <Switch
                            trackColor={{ false: '#767577', true: theme.primary }}
                            thumbColor={Platform.OS === 'ios' ? '#fff' : notificationSettings.quietHoursEnabled ? '#fff' : '#f4f3f4'}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleQuietHours}
                            value={notificationSettings.quietHoursEnabled}
                        />
                    </View>

                    {notificationSettings.quietHoursEnabled && (
                        <View style={[styles.timePickerContainer, { borderTopColor: theme.borderColor }]}>
                            <TouchableOpacity
                                style={styles.timeRow}
                                onPress={() => setShowStartPicker(true)}
                            >
                                <Text style={[styles.timeLabel, { color: theme.textColor }]}>Start Time</Text>
                                <Text style={[styles.timeValue, { color: theme.primary }]}>{notificationSettings.quietHoursStart}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.timeRow}
                                onPress={() => setShowEndPicker(true)}
                            >
                                <Text style={[styles.timeLabel, { color: theme.textColor }]}>End Time</Text>
                                <Text style={[styles.timeValue, { color: theme.primary }]}>{notificationSettings.quietHoursEnd}</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {showStartPicker && (
                    <DateTimePicker
                        value={parseTime(notificationSettings.quietHoursStart)}
                        mode="time"
                        is24Hour={false}
                        display="default"
                        onChange={handleStartTimeChange}
                    />
                )}

                {showEndPicker && (
                    <DateTimePicker
                        value={parseTime(notificationSettings.quietHoursEnd)}
                        mode="time"
                        is24Hour={false}
                        display="default"
                        onChange={handleEndTimeChange}
                    />
                )}

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
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
    headerTitle: {
        fontSize: 17,
        fontWeight: '600',
        textAlign: 'center',
    },
    content: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 12,
        letterSpacing: 0.5,
        opacity: 0.6,
    },
    card: {
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 16,
        overflow: 'hidden',
        ...Platform.select({
            android: {
                elevation: 2,
            },
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
            }
        })
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    iconContainer: {
        marginRight: 16,
        width: 32,
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
        marginRight: 16,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    itemSubtitle: {
        fontSize: 13,
        lineHeight: 18,
    },
    timePickerContainer: {
        borderTopWidth: 1,
        marginTop: 0,
    },
    timeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        paddingVertical: 18,
    },
    timeLabel: {
        fontSize: 16,
        fontWeight: '500',
    },
    timeValue: {
        fontSize: 16,
        fontWeight: '600',
    },
});

export default NotificationSettingsScreen;

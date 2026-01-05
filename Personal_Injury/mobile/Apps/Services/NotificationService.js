// NotificationService.js
// Manages notification scheduling and handling for calendar events, medications, and journal prompts

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTIFICATION_LOG_KEY = 'notification_log_history';
const NOTIFICATION_MAPPINGS_KEY = 'notification_mappings';

// Simple ID generator to avoid extra dependencies
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Configure notification presentation in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

class NotificationService {
  constructor() {
    this.init();
  }

  async init() {
    // Check if we need to clean up old logs
    this.pruneOldLogs();
  }

  // Request notification permissions from the user
  async requestPermissions() {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('Notification permissions not granted');
        return false;
      }

      // Setup Android notification channels
      if (Platform.OS === 'android') {
        await this.setupAndroidChannels();
      }

      return true;
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  // Setup Android notification channels
  async setupAndroidChannels() {
    await Notifications.setNotificationChannelAsync('events', {
      name: 'Calendar Events',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      sound: 'default',
      description: 'Notifications for upcoming calendar events',
    });

    await Notifications.setNotificationChannelAsync('medications', {
      name: 'Medications',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      sound: 'default',
      description: 'Medication reminder notifications',
      priority: 'high',
    });

    await Notifications.setNotificationChannelAsync('journal', {
      name: 'Journal Prompts',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250],
      sound: 'default',
      description: 'Daily journal entry reminders',
    });

    await Notifications.setNotificationChannelAsync('general', {
      name: 'General Reminders',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250],
      sound: 'default',
      description: 'General health tracking reminders',
    });

    // Silent channel for quiet hours
    await Notifications.setNotificationChannelAsync('silent', {
      name: 'Silent Notifications',
      importance: Notifications.AndroidImportance.LOW,
      vibrationPattern: null,
      sound: null,
      description: 'Notifications delivered during quiet hours',
    });
  }

  /**
   * Unified Scheduling Method
   * @param {Object} config - The reminder configuration
   * @param {string} config.type - 'EVENT' | 'MEDICATION' | 'JOURNAL' | 'CUSTOM'
   * @param {string} config.title - Notification Title
   * @param {string} config.body - Notification Body
   * @param {Date} config.scheduledTime - Date object for when to trigger
   * @param {string} config.entityId - ID of the source object (e.g., event ID)
   * @param {Object} config.data - Additional payload
   * @param {boolean} config.repeats - Whether it repeats
   * @param {Object} config.repeatTrigger - Expo specific trigger for repeating (e.g. { hour: 8, minute: 0, repeats: true })
   * @param {boolean} config.isQuiet - If true, forces silent delivery
   */
  async schedule(config) {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return null;

      const {
        type,
        title,
        body,
        scheduledTime,
        entityId,
        data = {},
        repeats = false,
        repeatTrigger = null,
        isQuiet = false
      } = config;

      // Determine Channel ID based on type or override if quiet
      let channelId = 'general';
      switch (type) {
        case 'EVENT': channelId = 'events'; break;
        case 'MEDICATION': channelId = 'medications'; break;
        case 'JOURNAL': channelId = 'journal'; break;
      }
      if (isQuiet) channelId = 'silent';

      // Determine Trigger
      let trigger;
      if (repeats && repeatTrigger) {
        trigger = { ...repeatTrigger, channelId };
      } else {
        if (!scheduledTime) {
          console.warn('Scheduled time is required for non-repeating notifications');
          return null;
        }
        if (scheduledTime <= new Date()) {
          console.log('Notification time is in the past, skipping');
          return null;
        }
        trigger = {
          date: scheduledTime,
          channelId
        };
      }

      // Schedule with Expo
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: isQuiet ? null : 'default',
          priority: isQuiet ? Notifications.AndroidNotificationPriority.LOW : Notifications.AndroidNotificationPriority.HIGH,
          data: {
            ...data,
            type,
            entityId,
            notificationType: type, // Redundant for safety
            scheduledAt: new Date().toISOString(),
          },
        },
        trigger,
      });

      // Map Entity to Notification ID
      if (entityId) {
        await this.storeNotificationMapping(entityId, notificationId, type);
      }

      console.log(`[${type}] Notification scheduled: ${notificationId}`);
      return notificationId;

    } catch (error) {
      console.error('Error in unified schedule:', error);
      return null;
    }
  }


  // --- Backward Compatibility Wrappers ---

  // Schedule notification for a calendar event
  async scheduleEventNotification(event, minutesBefore = 15) {
    const eventDateTime = this.parseEventDateTime(event.date, event.start_time);
    if (!eventDateTime) return null;

    const notificationTime = new Date(eventDateTime.getTime() - minutesBefore * 60 * 1000);

    return this.schedule({
      type: 'EVENT',
      title: `Upcoming: ${event.event_name}`,
      body: `Starts at ${event.start_time}`,
      scheduledTime: notificationTime,
      entityId: event._id,
      data: {
        eventId: event._id,
        eventName: event.event_name,
        eventTime: event.start_time
      }
    });
  }

  // Schedule daily medication reminder
  async scheduleMedicationReminder(medication, time, isQuiet = false) {
    const { hour, minute } = this.parse12HourTime(time);

    return this.schedule({
      type: 'MEDICATION',
      title: '💊 Medication Reminder',
      body: `Time to take ${medication.name}`,
      repeats: true,
      repeatTrigger: { hour, minute, repeats: true },
      entityId: medication._id,
      isQuiet,
      data: {
        medicationId: medication._id,
        medicationName: medication.name
      }
    });
  }

  // Schedule daily journal prompt
  async scheduleJournalPrompt(time, isQuiet = false) {
    const { hour, minute } = this.parse12HourTime(time);

    // Cancel existing generic journal prompt first if we track it differently
    // But here we'll just schedule new.

    const id = await this.schedule({
      type: 'JOURNAL',
      title: '🩹 Daily Pain Check-in',
      body: 'How are you feeling today? Log your pain level',
      repeats: true,
      repeatTrigger: { hour, minute, repeats: true },
      entityId: 'daily_journal', // Static ID for singleton
      isQuiet,
      data: {
        action: 'open_journal'
      }
    });

    if (id) {
      await AsyncStorage.setItem('journal_notification_id', id);
    }
    return id;
  }

  // --- Management & Logs ---

  // Cancel a specific notification
  async cancelNotification(notificationId) {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      console.log('Notification canceled:', notificationId);
    } catch (error) {
      console.error('Error canceling notification:', error);
    }
  }

  // Cancel all notifications for a specific event/entity
  async cancelEventNotifications(eventId) {
    await this.cancelEntityNotifications(eventId, 'EVENT');
  }

  // Generic cancel for entity
  async cancelEntityNotifications(entityId, type) {
    try {
      const notificationIds = await this.getNotificationIds(entityId, type);
      for (const id of notificationIds) {
        await this.cancelNotification(id);
      }
      await this.removeNotificationMapping(entityId, type);
      console.log(`${type} notifications canceled for:`, entityId);
    } catch (error) {
      console.error(`Error canceling ${type} notifications:`, error);
    }
  }

  async cancelAllNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      await AsyncStorage.removeItem(NOTIFICATION_MAPPINGS_KEY);
      console.log('All notifications canceled');
    } catch (error) {
      console.error('Error canceling all notifications:', error);
    }
  }

  async getAllScheduledNotifications() {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
      return [];
    }
  }

  // --- Notification History Log ---

  /**
   * Records a notification arrival in local storage (for the "Past" list)
   * This should be called by the NotificationReceivedListener
   */
  async logNotificationArrival(notification) {
    try {
      const content = notification.request.content;
      const data = content.data || {};

      const logItem = {
        id: generateId(),
        notificationId: notification.request.identifier,
        receivedAt: new Date().toISOString(),
        title: content.title,
        body: content.body,
        type: data.type || 'GENERAL',
        entityId: data.entityId,
        data: data,
        read: false,
      };

      const logs = await this.getNotificationLogs();
      logs.unshift(logItem); // Add to top

      // Keep only last 50
      if (logs.length > 50) {
        logs.length = 50;
      }

      await AsyncStorage.setItem(NOTIFICATION_LOG_KEY, JSON.stringify(logs));
      return logItem;
    } catch (e) {
      console.error("Failed to log notification arrival", e);
    }
  }

  async getNotificationLogs() {
    try {
      const json = await AsyncStorage.getItem(NOTIFICATION_LOG_KEY);
      return json ? JSON.parse(json) : [];
    } catch (e) {
      return [];
    }
  }

  async markLogAsRead(logId) {
    try {
      const logs = await this.getNotificationLogs();
      const index = logs.findIndex(l => l.id === logId);
      if (index !== -1) {
        logs[index].read = true;
        await AsyncStorage.setItem(NOTIFICATION_LOG_KEY, JSON.stringify(logs));
      }
    } catch (e) {
      console.error("Error marking log as read", e);
    }
  }

  async clearLogs() {
    await AsyncStorage.removeItem(NOTIFICATION_LOG_KEY);
  }

  async deleteLog(logId) {
    try {
      const logs = await this.getNotificationLogs();
      const filteredLogs = logs.filter(l => l.id !== logId);
      await AsyncStorage.setItem(NOTIFICATION_LOG_KEY, JSON.stringify(filteredLogs));
      return true;
    } catch (e) {
      console.error("Error deleting log", e);
      return false;
    }
  }

  async pruneOldLogs() {
    // Could implement logic to remove logs older than 30 days
  }

  // --- Helpers ---

  parseEventDateTime(dateStr, timeStr) {
    try {
      if (!dateStr || !timeStr) return null;
      // Extract just the day part
      const dateOnly = dateStr.split('T')[0];
      const [year, month, day] = dateOnly.split('-').map(Number);

      const { hour, minute } = this.parse12HourTime(timeStr);

      return new Date(year, month - 1, day, hour, minute, 0, 0);
    } catch (error) {
      console.error('Error parsing event date/time:', error);
      return null;
    }
  }

  parse12HourTime(timeStr) {
    if (!timeStr || typeof timeStr !== 'string') throw new Error('Invalid time string');
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':');
    hours = parseInt(hours, 10);
    minutes = parseInt(minutes, 10);
    if (modifier === 'PM' && hours !== 12) hours += 12;
    else if (modifier === 'AM' && hours === 12) hours = 0;
    return { hour: hours, minute: minutes };
  }

  // --- Mappings ---

  async storeNotificationMapping(entityId, notificationId, type) {
    try {
      const mappings = await this.getNotificationMappings();

      // key format: "EVENT_123"
      const key = `${type}_${entityId}`;

      if (!mappings[key]) mappings[key] = [];
      mappings[key].push(notificationId);

      await AsyncStorage.setItem(NOTIFICATION_MAPPINGS_KEY, JSON.stringify(mappings));
    } catch (error) {
      console.error('Error storing notification mapping:', error);
    }
  }

  async getNotificationIds(entityId, type) {
    try {
      const mappings = await this.getNotificationMappings();
      const key = `${type}_${entityId}`;
      return mappings[key] || [];
    } catch (error) {
      return [];
    }
  }

  async removeNotificationMapping(entityId, type) {
    try {
      const mappings = await this.getNotificationMappings();
      const key = `${type}_${entityId}`;
      delete mappings[key];
      await AsyncStorage.setItem(NOTIFICATION_MAPPINGS_KEY, JSON.stringify(mappings));
    } catch (error) {
      console.error('Error removing notification mapping:', error);
    }
  }

  async getNotificationMappings() {
    try {
      const data = await AsyncStorage.getItem(NOTIFICATION_MAPPINGS_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      return {};
    }
  }

  // Pass-throughs
  addNotificationResponseListener(callback) {
    return Notifications.addNotificationResponseReceivedListener(callback);
  }

  addNotificationReceivedListener(callback) {
    return Notifications.addNotificationReceivedListener(callback);
  }
}

export default new NotificationService();

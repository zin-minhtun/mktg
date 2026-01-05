// NotificationContext.js
// Global context for notification state and preferences

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NotificationService from '../Services/NotificationService';
import { set } from 'date-fns';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notificationSettings, setNotificationSettings] = useState({
    eventsEnabled: true,
    medicationsEnabled: true,
    journalEnabled: true,
    eventReminderTime: 15, // minutes before event
    journalPromptTime: '08:00 PM', // default journal prompt time
    quietHoursEnabled: false,
    quietHoursStart: '10:00 PM',
    quietHoursEnd: '07:00 AM',
  });

  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const responseListener = useRef();
  const notificationListener = useRef();

  // Load settings and setup listeners
  useEffect(() => {
    loadSettings();
    checkPermissions();

    // Listener for when notification is received (foreground)
    notificationListener.current = NotificationService.addNotificationReceivedListener(async notification => {
      // Smart Pain Check-in: Don't show if user already logged pain today
      if (notification.request.content.data?.type === 'JOURNAL') {
        try {
          const lastPainLogDate = await AsyncStorage.getItem('last_pain_log_date');
          const today = new Date().toDateString();

          if (lastPainLogDate === today) {
            console.log('[SmartReminder] User already logged pain today, suppressing check-in notification');
            return; // Don't log or show this notification
          }
        } catch (error) {
          console.error('[SmartReminder] Error checking pain log date:', error);
          // If there's an error, show the notification anyway
        }
      }

      // Log the notification arrival (original behavior)
      NotificationService.logNotificationArrival(notification);
    });

    // Listener for when user taps notification
    responseListener.current = NotificationService.addNotificationResponseListener(response => {
      const { notification } = response;
      // You could handle deep linking here or log interaction
      console.log('Notification tapped:', notification.request.content);
    });

    return () => {
      if (notificationListener.current && notificationListener.current.remove) {
        notificationListener.current.remove();
      }
      if (responseListener.current && responseListener.current.remove) {
        responseListener.current.remove();
      }
    };
  }, []);

  // Load notification settings from storage
  const loadSettings = async () => {
    try {
      const stored = await AsyncStorage.getItem('notification_settings');
      if (stored) {
        setNotificationSettings(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    }
  };

  // Save notification settings to storage
  const saveSettings = async (newSettings) => {
    try {
      setNotificationSettings(newSettings);
      await AsyncStorage.setItem('notification_settings', JSON.stringify(newSettings));
    } catch (error) {
      console.error('Error saving notification settings:', error);
    }
  };

  // Check if notification permissions are granted
  const checkPermissions = async () => {
    const granted = await NotificationService.requestPermissions();
    setPermissionsGranted(granted);
    return granted;
  };

  // Request notification permissions
  const requestPermissions = async () => {
    const granted = await NotificationService.requestPermissions();
    setPermissionsGranted(granted);
    return granted;
  };

  // Update a specific setting
  const updateSetting = async (key, value) => {
    const newSettings = { ...notificationSettings, [key]: value };
    await saveSettings(newSettings);
  };

  // Check if time is within quiet hours
  const isTimeInQuietHours = (timeStr) => {
    if (!notificationSettings.quietHoursEnabled) return false;

    try {
      const now = new Date();
      const { quietHoursStart, quietHoursEnd } = notificationSettings;

      // Simple string comparison doesn't work for time ranges crossing midnight
      // Parse times to Date objects for comparison
      const parseTime = (t) => {
        const [time, modifier] = t.split(' ');
        let [hours, minutes] = time.split(':');
        hours = parseInt(hours, 10);
        if (modifier === 'PM' && hours !== 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;
        return set(now, { hours, minutes, seconds: 0, milliseconds: 0 });
      };

      let start = parseTime(quietHoursStart);
      let end = parseTime(quietHoursEnd);
      let check = parseTime(timeStr);

      if (start > end) {
        // Range crosses midnight (e.g. 10 PM to 7 AM)
        return check >= start || check <= end;
      } else {
        return check >= start && check <= end;
      }
    } catch (e) {
      console.error("Error checking quiet hours", e);
      return false;
    }
  };

  // Toggle event notifications
  const toggleEventNotifications = async (enabled) => {
    await updateSetting('eventsEnabled', enabled);
  };

  // Toggle medication notifications
  const toggleMedicationNotifications = async (enabled) => {
    await updateSetting('medicationsEnabled', enabled);
  };

  // Toggle journal notifications
  const toggleJournalNotifications = async (enabled) => {
    await updateSetting('journalEnabled', enabled);

    if (enabled) {
      const isQuiet = isTimeInQuietHours(notificationSettings.journalPromptTime);
      await NotificationService.scheduleJournalPrompt(notificationSettings.journalPromptTime, isQuiet);
    } else {
      const journalNotificationId = await AsyncStorage.getItem('journal_notification_id');
      if (journalNotificationId) {
        await NotificationService.cancelNotification(journalNotificationId);
      }
    }
  };

  // Set event reminder time (minutes before)
  const setEventReminderTime = async (minutes) => {
    await updateSetting('eventReminderTime', minutes);
  };

  // Set journal prompt time
  const setJournalPromptTime = async (time) => {
    await updateSetting('journalPromptTime', time);

    if (notificationSettings.journalEnabled) {
      // Cancel old
      const journalNotificationId = await AsyncStorage.getItem('journal_notification_id');
      if (journalNotificationId) {
        await NotificationService.cancelNotification(journalNotificationId);
      }

      // Schedule new
      const isQuiet = isTimeInQuietHours(time);
      await NotificationService.scheduleJournalPrompt(time, isQuiet);
    }
  };

  // Toggle quiet hours
  const toggleQuietHours = async (enabled) => {
    await updateSetting('quietHoursEnabled', enabled);
    // Ideally, we would reschedule everything here to respect the new setting.
    // For now, we only apply it to new schedules or explicitly re-toggled items.
  };

  // Set quiet hours range
  const setQuietHours = async (start, end) => {
    const newSettings = {
      ...notificationSettings,
      quietHoursStart: start,
      quietHoursEnd: end,
    };
    await saveSettings(newSettings);
  };

  const value = {
    // State
    notificationSettings,
    permissionsGranted,

    // Methods
    requestPermissions,
    checkPermissions,
    updateSetting,
    toggleEventNotifications,
    toggleMedicationNotifications,
    toggleJournalNotifications,
    setEventReminderTime,
    setJournalPromptTime,
    toggleQuietHours,
    setQuietHours,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

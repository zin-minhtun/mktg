// ReminderSyncService.js
// Manages syncing reminders between backend and device
// Schedules/cancels local notifications based on backend state

import NotificationService from './NotificationService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '@env';

const MIGRATION_KEY = 'reminder_migration_complete';

class ReminderSyncService {

    /**
     * Main sync function - called on app launch/login
     * 1. Migrate local reminders to backend (first time only)
     * 2. Fetch reminders from backend
     * 3. Save to AsyncStorage (local cache)
     * 4. Re-schedule all enabled notifications
     */
    async syncReminders(userId) {
        console.log('[ReminderSync] Starting sync for user:', userId);

        if (!userId) {
            console.warn('[ReminderSync] No userId provided, skipping sync');
            return;
        }

        try {
            // Step 1: Migrate local data to backend (first time only)
            await this.migrateLocalToBackend(userId);

            // Step 2: Fetch reminders from backend
            const response = await axios.get(`${API_URL}/api/reminders/${userId}`, {
                timeout: 10000
            });

            const backendReminders = response.data?.data || [];
            console.log('[ReminderSync] Fetched reminders from backend:', backendReminders.length);

            // Step 3: Save to AsyncStorage (local cache)
            for (const reminder of backendReminders) {
                const storageKey = `reminders:${reminder.type}`;
                const localData = {
                    enabled: reminder.enabled,
                    message: reminder.message,
                    schedule: this.convertToScheduleObject(reminder),
                    items: [] // Populated separately for Medication type
                };
                await AsyncStorage.setItem(storageKey, JSON.stringify(localData));
            }

            // Step 4: Re-schedule all enabled notifications
            await this.rescheduleAllNotifications(backendReminders);

            console.log('[ReminderSync] Sync completed successfully');
        } catch (error) {
            console.error('[ReminderSync] Error syncing reminders:', error);

            // If backend sync fails, device can still use local AsyncStorage data
            // This provides offline-first functionality
        }
    }

    /**
     * One-time migration: Move existing AsyncStorage reminders to backend
     * Only runs once per user (tracked by migration key)
     */
    async migrateLocalToBackend(userId) {
        const migrationKey = `${MIGRATION_KEY}_${userId}`;
        const migrated = await AsyncStorage.getItem(migrationKey);

        if (migrated) {
            console.log('[ReminderSync] Migration already completed for this user');
            return;
        }

        console.log('[ReminderSync] Starting migration to backend...');

        const TYPES = ["Medication", "Supplement", "Water", "Meal", "Sleep", "DailyCheckin"];

        for (const type of TYPES) {
            try {
                const key = `reminders:${type}`;
                const raw = await AsyncStorage.getItem(key);

                if (raw) {
                    const local = JSON.parse(raw);

                    // Convert to backend format
                    const reminderData = {
                        userId,
                        type,
                        enabled: local.enabled !== undefined ? local.enabled : false,
                        message: local.message || "",
                        scheduleKind: local.schedule?.kind || 'none',
                        intervalMinutes: local.schedule?.kind === 'interval' ? local.schedule.value : undefined,
                        time: local.schedule?.kind === 'daily' ? local.schedule.value : local.schedule?.time,
                        daysOfWeek: local.schedule?.kind === 'weekly' ? local.schedule.days : undefined
                    };

                    // Save to backend
                    await axios.post(`${API_URL}/api/reminders`, reminderData, {
                        timeout: 10000
                    });

                    console.log(`[ReminderSync] Migrated ${type} reminder to backend`);
                }
            } catch (error) {
                console.error(`[ReminderSync] Error migrating ${type} reminder:`, error);
                // Continue with other types even if one fails
            }
        }

        // Mark migration as complete
        await AsyncStorage.setItem(migrationKey, 'true');
        console.log('[ReminderSync] Migration completed');
    }

    /**
     * Convert backend reminder format to frontend schedule object
     */
    convertToScheduleObject(reminder) {
        switch (reminder.scheduleKind) {
            case 'interval':
                return { kind: 'interval', value: reminder.intervalMinutes };
            case 'daily':
                return { kind: 'daily', value: reminder.time };
            case 'weekly':
                return { kind: 'weekly', days: reminder.daysOfWeek, time: reminder.time };
            default:
                return { kind: 'none', value: null };
        }
    }

    /**
     * Cancel all reminder notifications and re-schedule from backend state
     */
    async rescheduleAllNotifications(reminders) {
        console.log('[ReminderSync] Re-scheduling notifications...');

        // Cancel all existing reminder notifications
        // We use entity prefix to target only reminder notifications
        const TYPES = ["Medication", "Supplement", "Water", "Meal", "Sleep", "DailyCheckin"];
        for (const type of TYPES) {
            try {
                await NotificationService.cancelEntityNotifications(`reminder_${type}`, type.toUpperCase());
            } catch (error) {
                console.error(`[ReminderSync] Error canceling ${type} notifications:`, error);
            }
        }

        // Schedule new notifications for enabled reminders
        for (const reminder of reminders) {
            if (reminder.enabled) {
                await this.scheduleReminderNotification(reminder);
            }
        }

        console.log('[ReminderSync] Notification re-scheduling complete');
    }

    /**
     * Schedule a single reminder's notifications based on its schedule type
     */
    async scheduleReminderNotification(reminder) {
        const { type, message, scheduleKind, intervalMinutes, time, daysOfWeek } = reminder;

        try {
            if (scheduleKind === 'interval') {
                // For interval-based reminders (e.g., every 60 minutes)
                // Schedule ONE recurring notification that fires every X minutes

                // Select emoji based on reminder type
                const getEmoji = (type) => {
                    switch (type) {
                        case 'Water': return '💧';
                        case 'Meal': return '🍽️';
                        case 'Supplement': return '💊';
                        default: return '⏰';
                    }
                };

                // Calculate seconds for the interval (Expo uses seconds for interval notifications)
                const intervalSeconds = intervalMinutes * 60;

                console.log(`[ReminderSync] Scheduling ${type} reminder every ${intervalMinutes} minutes`);

                // Schedule a single repeating notification
                await NotificationService.schedule({
                    type: type.toUpperCase(),
                    title: `${getEmoji(type)} ${type} Reminder`,
                    body: message || `Time for your ${type.toLowerCase()}!`,
                    repeats: true,
                    repeatTrigger: { seconds: intervalSeconds, repeats: true },
                    entityId: `reminder_${type}`,
                    data: { reminderType: type }
                });

                console.log(`[ReminderSync] Finished scheduling 1 notification for ${type}`);
            }
            else if (scheduleKind === 'daily') {
                // Schedule daily notification at specific time
                const [hour, minute] = time.split(':').map(Number);

                // Select emoji based on reminder type
                const getEmoji = (type) => {
                    switch (type) {
                        case 'Sleep': return '😴';
                        case 'DailyCheckin': return '📝';
                        case 'Meal': return '🍽️';
                        default: return '⏰';
                    }
                };

                await NotificationService.schedule({
                    type: type.toUpperCase(),
                    title: `${getEmoji(type)} ${type} Reminder`,
                    body: message || `Time for your ${type.toLowerCase()}!`,
                    repeats: true,
                    repeatTrigger: { hour, minute, repeats: true },
                    entityId: `reminder_${type}`,
                    data: { reminderType: type }
                });
            }
            else if (scheduleKind === 'weekly') {
                // Schedule weekly notifications on specific days
                // Expo doesn't support weekly + specific days directly
                // We schedule multiple daily notifications (one for each selected day)
                const [hour, minute] = time.split(':').map(Number);

                const getEmoji = (type) => {
                    switch (type) {
                        case 'DailyCheckin': return '📋';
                        default: return '📅';
                    }
                };

                for (const dayOfWeek of daysOfWeek) {
                    await NotificationService.schedule({
                        type: type.toUpperCase(),
                        title: `${getEmoji(type)} ${type} Reminder`,
                        body: message || `Time for your ${type.toLowerCase()}!`,
                        repeats: true,
                        repeatTrigger: {
                            weekday: dayOfWeek + 1, // Expo uses 1-7 (Sunday = 1)
                            hour,
                            minute,
                            repeats: true
                        },
                        entityId: `reminder_${type}_day${dayOfWeek}`,
                        data: { reminderType: type, dayOfWeek }
                    });
                }
            }

            console.log(`[ReminderSync] Scheduled notification for ${type}`);
        } catch (error) {
            console.error(`[ReminderSync] Error scheduling notification for ${type}:`, error);
        }
    }

    /**
     * Save a single reminder to backend and update local notifications
     * Called when user changes a reminder in the UI
     */
    async saveReminder(userId, type, reminderData) {
        console.log('[ReminderSync] Saving reminder:', type);

        try {
            // 1. Save to backend
            const payload = {
                userId,
                type,
                enabled: reminderData.enabled,
                message: reminderData.message,
                scheduleKind: reminderData.schedule.kind,
                intervalMinutes: reminderData.schedule.kind === 'interval' ? reminderData.schedule.value : undefined,
                time: reminderData.schedule.kind === 'daily' ? reminderData.schedule.value : reminderData.schedule.time,
                daysOfWeek: reminderData.schedule.kind === 'weekly' ? reminderData.schedule.days : undefined
            };

            await axios.post(`${API_URL}/api/reminders`, payload, {
                timeout: 10000
            });

            console.log('[ReminderSync] Reminder saved to backend');

            // 2. Cancel old notifications for this type
            await NotificationService.cancelEntityNotifications(`reminder_${type}`, type.toUpperCase());

            // 3. Schedule new notifications if enabled
            if (reminderData.enabled) {
                await this.scheduleReminderNotification({
                    type,
                    message: reminderData.message,
                    scheduleKind: reminderData.schedule.kind,
                    intervalMinutes: reminderData.schedule.kind === 'interval' ? reminderData.schedule.value : undefined,
                    time: reminderData.schedule.kind === 'daily' ? reminderData.schedule.value : reminderData.schedule.time,
                    daysOfWeek: reminderData.schedule.kind === 'weekly' ? reminderData.schedule.days : undefined
                });
            }

            console.log('[ReminderSync] Reminder updated successfully');
            return true;
        } catch (error) {
            console.error('[ReminderSync] Error saving reminder:', error);
            return false;
        }
    }

    /**
     * Delete a reminder from backend and cancel its notifications
     */
    async deleteReminder(reminderId, type) {
        console.log('[ReminderSync] Deleting reminder:', reminderId);

        try {
            // 1. Delete from backend
            await axios.delete(`${API_URL}/api/reminders/${reminderId}`, {
                timeout: 10000
            });

            // 2. Cancel notifications
            await NotificationService.cancelEntityNotifications(`reminder_${type}`, type.toUpperCase());

            // 3. Remove from AsyncStorage
            await AsyncStorage.removeItem(`reminders:${type}`);

            console.log('[ReminderSync] Reminder deleted successfully');
            return true;
        } catch (error) {
            console.error('[ReminderSync] Error deleting reminder:', error);
            return false;
        }
    }
}

export default new ReminderSyncService();

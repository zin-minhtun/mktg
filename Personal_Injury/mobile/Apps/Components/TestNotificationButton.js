// TestNotificationButton.js
// Temporary component to test if notifications are working
// Add this to your Settings/Reminders screen to test

import React from 'react';
import { Pressable, Text, Alert } from 'react-native';
import NotificationService from '../../Services/NotificationService';

export default function TestNotificationButton({ theme }) {

    const testImmediateNotification = async () => {
        try {
            // Request permissions first
            const hasPermission = await NotificationService.requestPermissions();

            if (!hasPermission) {
                Alert.alert('Permission Denied', 'Please enable notifications in Settings');
                return;
            }

            // Schedule a notification in 5 seconds
            const notificationTime = new Date(Date.now() + 5000);

            const notifId = await NotificationService.schedule({
                type: 'TEST',
                title: '✅ Test Notification',
                body: 'If you see this, notifications are working!',
                scheduledTime: notificationTime,
                repeats: false,
                entityId: 'test_notification',
                data: { test: true }
            });

            if (notifId) {
                Alert.alert(
                    'Notification Scheduled',
                    'You should receive a test notification in 5 seconds!',
                    [{ text: 'OK' }]
                );
                console.log('[Test] Notification scheduled:', notifId);
            } else {
                Alert.alert('Error', 'Failed to schedule notification');
            }
        } catch (error) {
            console.error('[Test] Error scheduling notification:', error);
            Alert.alert('Error', error.message);
        }
    };

    const checkScheduledNotifications = async () => {
        try {
            const scheduled = await NotificationService.getAllScheduledNotifications();
            console.log('[Test] All scheduled notifications:', scheduled);

            Alert.alert(
                'Scheduled Notifications',
                `You have ${scheduled.length} notifications scheduled.\n\nCheck console for details.`,
                [{ text: 'OK' }]
            );
        } catch (error) {
            console.error('[Test] Error getting scheduled notifications:', error);
            Alert.alert('Error', error.message);
        }
    };

    return (
        <>
            <Pressable
                onPress={testImmediateNotification}
                style={{
                    marginTop: 16,
                    padding: 16,
                    backgroundColor: theme.primaryColor || '#00B8DF',
                    borderRadius: 8,
                    alignItems: 'center',
                }}
            >
                <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }}>
                    🔔 Test Notification (5 sec delay)
                </Text>
            </Pressable>

            <Pressable
                onPress={checkScheduledNotifications}
                style={{
                    marginTop: 8,
                    padding: 16,
                    backgroundColor: theme.borderColor || '#E0E0E0',
                    borderRadius: 8,
                    alignItems: 'center',
                }}
            >
                <Text style={{ color: theme.textColor, fontSize: 14 }}>
                    📋 Check Scheduled Notifications
                </Text>
            </Pressable>
        </>
    );
}

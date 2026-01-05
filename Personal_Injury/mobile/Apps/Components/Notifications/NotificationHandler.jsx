// NotificationHandler.jsx
// Handles notification responses and navigates to appropriate screens

import { useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import NotificationService from '../../Services/NotificationService';

const NotificationHandler = () => {
  const navigation = useNavigation();
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    // Listen for notifications received in foreground
    notificationListener.current = NotificationService.addNotificationReceivedListener(notification => {
      console.log('Notification received in foreground:', notification);
    });

    // Listen for user tapping notifications
    responseListener.current = NotificationService.addNotificationResponseListener(response => {
      console.log('Notification tapped:', response);
      handleNotificationResponse(response);
    });

    return () => {
      // Clean up listeners
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);

  // Handle notification tap and navigate to appropriate screen
  const handleNotificationResponse = (response) => {
    const { data } = response.notification.request.content;

    if (!data || !data.type) {
      console.log('No notification data or type');
      return;
    }

    switch (data.type) {
      case 'event':
        // Navigate to Calendar tab
        navigation.navigate('Calendar');
        break;

      case 'medication':
        // Navigate to Log tab (medications)
        navigation.navigate('Log', {
          screen: 'Medications',
          params: { medicationId: data.medicationId }
        });
        break;

      case 'journal':
        // Navigate to Journal tab
        navigation.navigate('Journal');
        break;

      default:
        console.log('Unknown notification type:', data.type);
    }
  };

  return null;
};

export default NotificationHandler;

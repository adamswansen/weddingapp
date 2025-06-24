import React, { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

interface NotificationManagerProps {
  onNotificationReceived?: (notification: any) => void;
}

export default function NotificationManager({ onNotificationReceived }: NotificationManagerProps) {
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  useEffect(() => {
    registerForPushNotificationsAsync();

    // Listen for incoming notifications
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
      if (onNotificationReceived) {
        onNotificationReceived(notification);
      }
    });

    // Listen for user interactions with notifications
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
    });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  return null; // This is a service component
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('wedding-updates', {
      name: 'Wedding Updates',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
      sound: 'default',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return;
    }
    
    try {
      const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
      if (!projectId) {
        throw new Error('Project ID not found');
      }
      token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
      console.log('Push token:', token);
    } catch (e) {
      console.log('Error getting push token:', e);
    }
  } else {
    console.log('Must use physical device for Push Notifications');
  }

  return token;
}

// Utility functions for sending notifications
export const NotificationService = {
  // Schedule a local notification
  scheduleLocalNotification: async (title: string, body: string, seconds: number = 0) => {
    try {
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: 'default',
          priority: Notifications.AndroidNotificationPriority.HIGH,
          color: '#d4af37', // Wedding gold color
        },
        trigger: seconds > 0 ? { seconds } : null,
      });
      return id;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      throw error;
    }
  },

  // Cancel a scheduled notification
  cancelNotification: async (notificationId: string) => {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.error('Error canceling notification:', error);
    }
  },

  // Cancel all scheduled notifications
  cancelAllNotifications: async () => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error canceling all notifications:', error);
    }
  },

  // Get all scheduled notifications
  getScheduledNotifications: async () => {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
      return [];
    }
  },

  // Wedding-specific notification templates
  weddingNotifications: {
    ceremonyStarting: () => ({
      title: '💒 Ceremony Starting Soon!',
      body: 'Adam & Courtney\'s ceremony begins in 15 minutes. Please take your seats!',
    }),
    
    cocktailHour: () => ({
      title: '🍸 Cocktail Hour Begins',
      body: 'Join us on the terrace for cocktails and appetizers!',
    }),
    
    dinnerReady: () => ({
      title: '🍽️ Dinner is Served',
      body: 'Please make your way to the reception hall for dinner.',
    }),
    
    firstDance: () => ({
      title: '💃 First Dance Time',
      body: 'Adam & Courtney are about to have their first dance!',
    }),
    
    photoReminder: () => ({
      title: '📸 Share Your Photos',
      body: 'Don\'t forget to add your favorite moments to the wedding photo collection!',
    }),
    
    guestbookReminder: () => ({
      title: '💕 Leave a Message',
      body: 'Share your wishes and memories in the digital guestbook!',
    }),

    customMessage: (message: string) => ({
      title: '💌 Wedding Update',
      body: message,
    }),
  },
}; 
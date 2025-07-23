// Notification and alarm service
import * as Notifications from 'expo-notifications';

import { Platform } from 'react-native';
import { APP_CONFIG } from '../utils/constants';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

class NotificationService {
  constructor() {
    this.notificationListener = null;
    this.responseListener = null;
    this.isInitialized = false;
  }

  /**
   * Initialize notification service
   * @returns {Promise<boolean>} Success status
   */
  async initialize() {
    try {
      if (this.isInitialized) return true;

      // Request permissions
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Notification permission not granted');
      }

      // Create notification channel for Android
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync(APP_CONFIG.notifications.channelId, {
          name: APP_CONFIG.notifications.channelName,
          description: APP_CONFIG.notifications.channelDescription,
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF7EB3',
          sound: 'default',
        });
      }

      // Set up notification listeners
      this.setupListeners();

      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Error initializing notification service:', error);
      return false;
    }
  }

  /**
   * Set up notification event listeners
   */
  setupListeners() {
    // Listener for notifications received while app is foregrounded
    this.notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    // Listener for when user taps on notification
    this.responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
      this.handleNotificationResponse(response);
    });
  }

  /**
   * Handle notification tap response
   * @param {object} response - Notification response
   */
  handleNotificationResponse(response) {
    const { notification } = response;
    const data = notification.request.content.data;

    // Handle different notification types
    switch (data?.type) {
      case 'destination_reached':
        // Navigate to alarm screen or handle destination reached
        console.log('Destination reached notification tapped');
        break;
      case 'journey_reminder':
        // Handle journey reminder
        console.log('Journey reminder notification tapped');
        break;
      default:
        console.log('Unknown notification type');
    }
  }

  /**
   * Show destination reached alarm notification
   * @param {object} destination - Destination object
   * @returns {Promise<string>} Notification ID
   */
  async showDestinationAlarm(destination) {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: '🎯 Wake Up! You\'ve Arrived!',
          body: `You have reached ${destination.name}. Time to wake up!`,
          sound: 'default',
          priority: Notifications.AndroidNotificationPriority.MAX,
          vibrate: [0, 250, 250, 250],
          data: {
            type: 'destination_reached',
            destinationId: destination.id,
            destinationName: destination.name,
          },
        },
        trigger: null, // Show immediately
      });

      console.log('Destination alarm notification scheduled:', notificationId);
      return notificationId;
    } catch (error) {
      console.error('Error showing destination alarm:', error);
      return null;
    }
  }

  /**
   * Show journey started notification
   * @param {object} destination - Destination object
   * @returns {Promise<string>} Notification ID
   */
  async showJourneyStarted(destination) {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: '🚀 Journey Started',
          body: `Tracking your journey to ${destination.name}`,
          sound: false,
          data: {
            type: 'journey_started',
            destinationId: destination.id,
          },
        },
        trigger: null,
      });

      return notificationId;
    } catch (error) {
      console.error('Error showing journey started notification:', error);
      return null;
    }
  }

  /**
   * Show approaching destination notification
   * @param {object} destination - Destination object
   * @param {number} distance - Distance to destination in meters
   * @returns {Promise<string>} Notification ID
   */
  async showApproachingDestination(destination, distance) {
    try {
      const distanceText = distance < 1000 ? `${Math.round(distance)}m` : `${(distance/1000).toFixed(1)}km`;
      
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: '📍 Approaching Destination',
          body: `You are ${distanceText} away from ${destination.name}`,
          sound: false,
          data: {
            type: 'approaching_destination',
            destinationId: destination.id,
            distance,
          },
        },
        trigger: null,
      });

      return notificationId;
    } catch (error) {
      console.error('Error showing approaching destination notification:', error);
      return null;
    }
  }

  /**
   * Show low battery warning
   * @param {number} batteryLevel - Battery level (0-1)
   * @returns {Promise<string>} Notification ID
   */
  async showLowBatteryWarning(batteryLevel) {
    try {
      const percentage = Math.round(batteryLevel * 100);
      
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: '🔋 Low Battery Warning',
          body: `Battery is at ${percentage}%. Consider charging to ensure reliable tracking.`,
          sound: false,
          data: {
            type: 'low_battery',
            batteryLevel: percentage,
          },
        },
        trigger: null,
      });

      return notificationId;
    } catch (error) {
      console.error('Error showing low battery warning:', error);
      return null;
    }
  }

  /**
   * Cancel notification by ID
   * @param {string} notificationId - Notification ID to cancel
   */
  async cancelNotification(notificationId) {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      console.log('Notification cancelled:', notificationId);
    } catch (error) {
      console.error('Error cancelling notification:', error);
    }
  }

  /**
   * Cancel all notifications
   */
  async cancelAllNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('All notifications cancelled');
    } catch (error) {
      console.error('Error cancelling all notifications:', error);
    }
  }

  /**
   * Get pending notifications
   * @returns {Promise<Array>} Array of pending notifications
   */
  async getPendingNotifications() {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error getting pending notifications:', error);
      return [];
    }
  }

  /**
   * Test notification (for debugging)
   * @returns {Promise<string>} Notification ID
   */
  async testNotification() {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: '🧪 Test Notification',
          body: 'This is a test notification from WakeMeGo',
          sound: 'default',
          data: {
            type: 'test',
          },
        },
        trigger: { seconds: 1 },
      });

      console.log('Test notification scheduled:', notificationId);
      return notificationId;
    } catch (error) {
      console.error('Error showing test notification:', error);
      return null;
    }
  }

  /**
   * Clean up notification service
   */
  cleanup() {
    if (this.notificationListener) {
      Notifications.removeNotificationSubscription(this.notificationListener);
      this.notificationListener = null;
    }

    if (this.responseListener) {
      Notifications.removeNotificationSubscription(this.responseListener);
      this.responseListener = null;
    }

    this.isInitialized = false;
  }
}

// Create singleton instance
const notificationService = new NotificationService();
export default notificationService;

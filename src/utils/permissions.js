// Permission utility functions
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { Alert, Linking } from 'react-native';

/**
 * Request location permissions with user-friendly explanations
 * @returns {Promise<boolean>} True if permissions granted
 */
export const requestLocationPermissions = async () => {
  try {
    // Request foreground location permission first
    const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
    
    if (foregroundStatus !== 'granted') {
      Alert.alert(
        'Location Permission Required',
        'WakeMeGo needs location access to track your journey and trigger alarms when you reach your destination.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() }
        ]
      );
      return false;
    }

    // Request background location permission
    const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
    
    if (backgroundStatus !== 'granted') {
      Alert.alert(
        'Background Location Required',
        'To wake you up when you reach your destination, WakeMeGo needs permission to access your location in the background.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() }
        ]
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error requesting location permissions:', error);
    return false;
  }
};

/**
 * Request notification permissions
 * @returns {Promise<boolean>} True if permissions granted
 */
export const requestNotificationPermissions = async () => {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Notification Permission Required',
        'WakeMeGo needs notification permission to alert you when you reach your destination.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() }
        ]
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
};

/**
 * Check if all required permissions are granted
 * @returns {Promise<object>} Permission status object
 */
export const checkPermissions = async () => {
  try {
    const locationForeground = await Location.getForegroundPermissionsAsync();
    const locationBackground = await Location.getBackgroundPermissionsAsync();
    const notifications = await Notifications.getPermissionsAsync();

    return {
      locationForeground: locationForeground.status === 'granted',
      locationBackground: locationBackground.status === 'granted',
      notifications: notifications.status === 'granted',
      allGranted: locationForeground.status === 'granted' && 
                  locationBackground.status === 'granted' && 
                  notifications.status === 'granted'
    };
  } catch (error) {
    console.error('Error checking permissions:', error);
    return {
      locationForeground: false,
      locationBackground: false,
      notifications: false,
      allGranted: false
    };
  }
};

/**
 * Request all required permissions
 * @returns {Promise<boolean>} True if all permissions granted
 */
export const requestAllPermissions = async () => {
  const locationGranted = await requestLocationPermissions();
  const notificationGranted = await requestNotificationPermissions();
  
  return locationGranted && notificationGranted;
};

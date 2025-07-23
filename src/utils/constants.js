// App constants
export const APP_CONFIG = {
  name: 'WakeMeGo',
  version: '1.0.0',
  
  // Location tracking settings
  location: {
    accuracy: 'high',
    distanceInterval: 10, // meters
    timeInterval: 5000,   // milliseconds
  },
  
  // Geofence settings
  geofence: {
    defaultRadius: 100,   // meters
    minRadius: 50,        // meters
    maxRadius: 1000,      // meters
    radiusOptions: [50, 100, 200, 500, 1000],
  },
  
  // Journey settings
  journey: {
    pathRecordingInterval: 5000, // milliseconds
    maxStoredJourneys: 50,
    defaultWalkingSpeed: 5, // km/h
  },
  
  // Notification settings
  notifications: {
    channelId: 'wakemego-alarms',
    channelName: 'WakeMeGo Alarms',
    channelDescription: 'Notifications for destination arrival alarms',
  },
  
  // Storage keys
  storage: {
    recentDestinations: 'recentDestinations',
    journeyHistory: 'journeyHistory',
    userPreferences: 'userPreferences',
    cachedSearches: 'cachedSearches',
  },
  
  // API settings
  api: {
    searchCacheExpiry: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    maxCachedSearches: 100,
  },
  
  // UI settings
  ui: {
    animationDuration: 300,
    mapAnimationDuration: 1000,
    splashScreenDuration: 2000,
  },
};

export const SCREEN_NAMES = {
  // Onboarding
  SPLASH: 'Splash',
  WELCOME: 'Welcome',
  TUTORIAL: 'Tutorial',
  
  // Main flow
  START: 'Start',
  DESTINATION_SEARCH: 'DestinationSearch',
  MAP_SELECTION: 'MapSelection',
  GEOFENCE_SETUP: 'GeofenceSetup',
  LIVE_TRACKING: 'LiveTracking',
  ALARM: 'Alarm',
  
  // Secondary
  HISTORY: 'History',
  SETTINGS: 'Settings',
  HELP: 'Help',
  JOURNEY_SUMMARY: 'JourneySummary',
};

export const JOURNEY_STATUS = {
  ACTIVE: 'active',
  PAUSED: 'paused',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const ALARM_TYPES = {
  SOUND: 'sound',
  VIBRATION: 'vibration',
  BOTH: 'both',
};

export const LOCATION_ACCURACY = {
  LOW: 'low',
  BALANCED: 'balanced',
  HIGH: 'high',
  BEST: 'best',
};

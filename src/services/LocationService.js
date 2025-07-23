// Location tracking service
import * as Location from 'expo-location';
import { APP_CONFIG } from '../utils/constants';
import { isAccurateLocation } from '../utils/validation';

class LocationService {
  constructor() {
    this.currentLocation = null;
    this.isTracking = false;
    this.watchId = null;
    this.locationSubscription = null;
    this.listeners = [];
    this.lastKnownLocation = null;
  }

  /**
   * Initialize location service and request permissions
   * @returns {Promise<boolean>} Success status
   */
  async initialize() {
    try {
      // Check if location services are enabled
      const enabled = await Location.hasServicesEnabledAsync();
      if (!enabled) {
        throw new Error('Location services are not enabled');
      }

      // Check permissions
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Location permission not granted');
      }

      return true;
    } catch (error) {
      console.error('Error initializing location service:', error);
      return false;
    }
  }

  /**
   * Get current location once
   * @returns {Promise<object|null>} Current location or null
   */
  async getCurrentLocation() {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        maximumAge: 10000, // 10 seconds
      });

      if (isAccurateLocation(location)) {
        this.currentLocation = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          accuracy: location.coords.accuracy,
          timestamp: location.timestamp,
        };
        this.lastKnownLocation = this.currentLocation;
        return this.currentLocation;
      }

      return null;
    } catch (error) {
      console.error('Error getting current location:', error);
      return this.lastKnownLocation;
    }
  }

  /**
   * Start continuous location tracking
   * @returns {Promise<boolean>} Success status
   */
  async startTracking() {
    try {
      if (this.isTracking) {
        console.log('Location tracking already started');
        return true;
      }

      const initialized = await this.initialize();
      if (!initialized) {
        throw new Error('Failed to initialize location service');
      }

      // Start watching location changes
      this.locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: APP_CONFIG.location.timeInterval,
          distanceInterval: APP_CONFIG.location.distanceInterval,
        },
        (location) => {
          this.handleLocationUpdate(location);
        }
      );

      this.isTracking = true;
      console.log('Location tracking started');
      return true;
    } catch (error) {
      console.error('Error starting location tracking:', error);
      return false;
    }
  }

  /**
   * Stop location tracking
   */
  stopTracking() {
    try {
      if (this.locationSubscription) {
        this.locationSubscription.remove();
        this.locationSubscription = null;
      }

      this.isTracking = false;
      console.log('Location tracking stopped');
    } catch (error) {
      console.error('Error stopping location tracking:', error);
    }
  }

  /**
   * Pause location tracking
   */
  pauseTracking() {
    if (this.isTracking) {
      this.stopTracking();
      console.log('Location tracking paused');
    }
  }

  /**
   * Resume location tracking
   */
  async resumeTracking() {
    if (!this.isTracking) {
      await this.startTracking();
      console.log('Location tracking resumed');
    }
  }

  /**
   * Handle location updates
   * @param {object} location - Location object from GPS
   */
  handleLocationUpdate(location) {
    if (!isAccurateLocation(location)) {
      console.warn('Received inaccurate location, ignoring');
      return;
    }

    this.currentLocation = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      accuracy: location.coords.accuracy,
      speed: location.coords.speed,
      heading: location.coords.heading,
      timestamp: location.timestamp,
    };

    this.lastKnownLocation = this.currentLocation;

    // Notify all listeners
    this.listeners.forEach(listener => {
      try {
        listener(this.currentLocation);
      } catch (error) {
        console.error('Error in location listener:', error);
      }
    });
  }

  /**
   * Add location update listener
   * @param {function} listener - Callback function
   * @returns {function} Unsubscribe function
   */
  onLocationUpdate(listener) {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Remove all listeners
   */
  removeAllListeners() {
    this.listeners = [];
  }

  /**
   * Get last known location
   * @returns {object|null} Last known location
   */
  getLastKnownLocation() {
    return this.lastKnownLocation;
  }

  /**
   * Check if location tracking is active
   * @returns {boolean} Tracking status
   */
  isLocationTracking() {
    return this.isTracking;
  }

  /**
   * Get location accuracy status
   * @returns {string} Accuracy status
   */
  getAccuracyStatus() {
    if (!this.currentLocation || !this.currentLocation.accuracy) {
      return 'unknown';
    }

    const accuracy = this.currentLocation.accuracy;
    if (accuracy <= 10) return 'excellent';
    if (accuracy <= 50) return 'good';
    if (accuracy <= 100) return 'fair';
    return 'poor';
  }

  /**
   * Calculate distance traveled
   * @param {Array} pathPoints - Array of location points
   * @returns {number} Total distance in meters
   */
  calculateTotalDistance(pathPoints) {
    if (!pathPoints || pathPoints.length < 2) return 0;

    let totalDistance = 0;
    for (let i = 1; i < pathPoints.length; i++) {
      const prev = pathPoints[i - 1];
      const curr = pathPoints[i];
      
      // Use Haversine formula for distance calculation
      const R = 6371e3; // Earth's radius in meters
      const φ1 = prev.latitude * Math.PI/180;
      const φ2 = curr.latitude * Math.PI/180;
      const Δφ = (curr.latitude - prev.latitude) * Math.PI/180;
      const Δλ = (curr.longitude - prev.longitude) * Math.PI/180;

      const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

      totalDistance += R * c;
    }

    return totalDistance;
  }
}

// Create singleton instance
const locationService = new LocationService();
export default locationService;

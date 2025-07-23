// Journey tracking and management service
import { calculateDistance, calculateETA, formatJourneyDuration } from '../utils/calculations';
import { JOURNEY_STATUS, APP_CONFIG } from '../utils/constants';
import { validateJourney } from '../utils/validation';
import LocationService from './LocationService';
import GeofenceService from './GeofenceService';
import StorageService from './StorageService';
import NotificationService from './NotificationService';

class JourneyService {
  constructor() {
    this.currentJourney = null;
    this.pathPoints = [];
    this.trackingInterval = null;
    this.isTracking = false;
    this.listeners = [];
    this.stats = {
      totalDistance: 0,
      startTime: null,
      endTime: null,
      averageSpeed: 0,
    };
  }

  /**
   * Start a new journey
   * @param {object} destination - Destination object
   * @param {number} geofenceRadius - Geofence radius in meters
   * @returns {Promise<object|null>} Journey object or null
   */
  async startJourney(destination, geofenceRadius) {
    try {
      // Validate inputs
      const journeyData = {
        destination,
        radius: geofenceRadius,
      };
      
      const validation = validateJourney({
        ...journeyData,
        id: 'temp',
        startTime: new Date().toISOString(),
      });
      
      if (!validation.isValid) {
        console.error('Invalid journey data:', validation.errors);
        return null;
      }

      // Stop any existing journey
      if (this.currentJourney) {
        await this.stopJourney();
      }

      // Create new journey
      this.currentJourney = {
        id: `journey_${Date.now()}`,
        destination,
        radius: geofenceRadius,
        startTime: new Date().toISOString(),
        status: JOURNEY_STATUS.ACTIVE,
        totalDistance: 0,
        pathPoints: [],
        createdAt: new Date().toISOString(),
      };

      // Reset tracking data
      this.pathPoints = [];
      this.stats = {
        totalDistance: 0,
        startTime: Date.now(),
        endTime: null,
        averageSpeed: 0,
      };

      // Add geofence for destination
      const geofenceId = GeofenceService.addGeofence({
        ...destination,
        radius: geofenceRadius,
        journeyId: this.currentJourney.id,
      });

      this.currentJourney.geofenceId = geofenceId;

      // Start location tracking
      await LocationService.startTracking();
      
      // Start geofence monitoring
      await GeofenceService.startMonitoring();

      // Start path recording
      this.startPathRecording();

      // Show journey started notification
      await NotificationService.showJourneyStarted(destination);

      // Save journey
      await this.saveCurrentJourney();

      // Notify listeners
      this.notifyListeners('journey_started', this.currentJourney);

      console.log(`Journey started to ${destination.name}`);
      return this.currentJourney;
    } catch (error) {
      console.error('Error starting journey:', error);
      return null;
    }
  }

  /**
   * Stop the current journey
   * @returns {Promise<object|null>} Completed journey or null
   */
  async stopJourney() {
    try {
      if (!this.currentJourney) {
        console.log('No active journey to stop');
        return null;
      }

      // Update journey status
      this.currentJourney.endTime = new Date().toISOString();
      this.currentJourney.status = JOURNEY_STATUS.COMPLETED;
      this.currentJourney.totalDistance = this.stats.totalDistance;
      this.currentJourney.pathPoints = [...this.pathPoints];

      // Stop tracking
      this.stopPathRecording();
      
      // Remove geofence
      if (this.currentJourney.geofenceId) {
        GeofenceService.removeGeofence(this.currentJourney.geofenceId);
      }

      // Save completed journey to history
      await StorageService.addJourney(this.currentJourney);

      // Notify listeners
      this.notifyListeners('journey_completed', this.currentJourney);

      const completedJourney = { ...this.currentJourney };
      
      // Reset current journey
      this.currentJourney = null;
      this.pathPoints = [];
      this.stats = {
        totalDistance: 0,
        startTime: null,
        endTime: null,
        averageSpeed: 0,
      };

      console.log('Journey completed and saved');
      return completedJourney;
    } catch (error) {
      console.error('Error stopping journey:', error);
      return null;
    }
  }

  /**
   * Pause the current journey
   * @returns {boolean} Success status
   */
  pauseJourney() {
    try {
      if (!this.currentJourney || this.currentJourney.status !== JOURNEY_STATUS.ACTIVE) {
        return false;
      }

      this.currentJourney.status = JOURNEY_STATUS.PAUSED;
      this.stopPathRecording();
      
      // Notify listeners
      this.notifyListeners('journey_paused', this.currentJourney);
      
      console.log('Journey paused');
      return true;
    } catch (error) {
      console.error('Error pausing journey:', error);
      return false;
    }
  }

  /**
   * Resume the current journey
   * @returns {boolean} Success status
   */
  resumeJourney() {
    try {
      if (!this.currentJourney || this.currentJourney.status !== JOURNEY_STATUS.PAUSED) {
        return false;
      }

      this.currentJourney.status = JOURNEY_STATUS.ACTIVE;
      this.startPathRecording();
      
      // Notify listeners
      this.notifyListeners('journey_resumed', this.currentJourney);
      
      console.log('Journey resumed');
      return true;
    } catch (error) {
      console.error('Error resuming journey:', error);
      return false;
    }
  }

  /**
   * Start recording path points
   */
  startPathRecording() {
    if (this.trackingInterval) {
      clearInterval(this.trackingInterval);
    }

    this.trackingInterval = setInterval(() => {
      this.recordPathPoint();
    }, APP_CONFIG.journey.pathRecordingInterval);

    this.isTracking = true;
    console.log('Path recording started');
  }

  /**
   * Stop recording path points
   */
  stopPathRecording() {
    if (this.trackingInterval) {
      clearInterval(this.trackingInterval);
      this.trackingInterval = null;
    }

    this.isTracking = false;
    console.log('Path recording stopped');
  }

  /**
   * Record a new path point
   */
  recordPathPoint() {
    const currentLocation = LocationService.currentLocation;
    
    if (!currentLocation || !this.currentJourney) {
      return;
    }

    const point = {
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
      timestamp: Date.now(),
      accuracy: currentLocation.accuracy,
      speed: currentLocation.speed || 0,
    };

    this.pathPoints.push(point);

    // Calculate distance if we have a previous point
    if (this.pathPoints.length > 1) {
      const prevPoint = this.pathPoints[this.pathPoints.length - 2];
      const segmentDistance = calculateDistance(
        prevPoint.latitude,
        prevPoint.longitude,
        point.latitude,
        point.longitude
      );

      this.stats.totalDistance += segmentDistance;
    }

    // Update average speed
    if (this.stats.startTime) {
      const timeElapsed = (Date.now() - this.stats.startTime) / 1000; // seconds
      this.stats.averageSpeed = this.stats.totalDistance / timeElapsed; // m/s
    }

    // Save journey periodically
    if (this.pathPoints.length % 10 === 0) {
      this.saveCurrentJourney();
    }
  }

  /**
   * Get current journey statistics
   * @returns {object|null} Journey stats or null
   */
  getCurrentStats() {
    if (!this.currentJourney || !LocationService.currentLocation) {
      return null;
    }

    const currentLocation = LocationService.currentLocation;
    const destination = this.currentJourney.destination;

    const distanceToDestination = calculateDistance(
      currentLocation.latitude,
      currentLocation.longitude,
      destination.latitude,
      destination.longitude
    );

    const eta = calculateETA(distanceToDestination, APP_CONFIG.journey.defaultWalkingSpeed);
    const isInGeofence = distanceToDestination <= this.currentJourney.radius;
    const journeyDuration = Date.now() - new Date(this.currentJourney.startTime).getTime();

    return {
      distanceToDestination: Math.round(distanceToDestination),
      eta,
      totalDistance: Math.round(this.stats.totalDistance),
      averageSpeed: this.stats.averageSpeed,
      isInGeofence,
      journeyDuration,
      journeyDurationFormatted: formatJourneyDuration(new Date(this.currentJourney.startTime).getTime()),
      pathPointsCount: this.pathPoints.length,
      status: this.currentJourney.status,
    };
  }

  /**
   * Get current journey
   * @returns {object|null} Current journey or null
   */
  getCurrentJourney() {
    return this.currentJourney;
  }

  /**
   * Get journey history
   * @returns {Promise<Array>} Array of completed journeys
   */
  async getJourneyHistory() {
    try {
      return await StorageService.getJourneyHistory();
    } catch (error) {
      console.error('Error getting journey history:', error);
      return [];
    }
  }

  /**
   * Save current journey to storage
   */
  async saveCurrentJourney() {
    if (!this.currentJourney) return;

    try {
      // Update journey with current data
      this.currentJourney.totalDistance = this.stats.totalDistance;
      this.currentJourney.pathPoints = [...this.pathPoints];
      this.currentJourney.lastUpdated = new Date().toISOString();

      await StorageService.setItem('currentJourney', this.currentJourney);
    } catch (error) {
      console.error('Error saving current journey:', error);
    }
  }

  /**
   * Load saved journey from storage
   */
  async loadSavedJourney() {
    try {
      const savedJourney = await StorageService.getItem('currentJourney');
      
      if (savedJourney && savedJourney.status === JOURNEY_STATUS.ACTIVE) {
        this.currentJourney = savedJourney;
        this.pathPoints = savedJourney.pathPoints || [];
        this.stats.totalDistance = savedJourney.totalDistance || 0;
        this.stats.startTime = new Date(savedJourney.startTime).getTime();
        
        console.log('Restored saved journey:', savedJourney.destination.name);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error loading saved journey:', error);
      return false;
    }
  }

  /**
   * Add event listener
   * @param {function} listener - Event listener function
   * @returns {function} Unsubscribe function
   */
  addEventListener(listener) {
    this.listeners.push(listener);
    
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Notify all listeners of an event
   * @param {string} eventType - Type of event
   * @param {object} eventData - Event data
   */
  notifyListeners(eventType, eventData) {
    this.listeners.forEach(listener => {
      try {
        listener(eventType, eventData);
      } catch (error) {
        console.error('Error in journey listener:', error);
      }
    });
  }

  /**
   * Check if journey is active
   * @returns {boolean} True if journey is active
   */
  isJourneyActive() {
    return this.currentJourney && this.currentJourney.status === JOURNEY_STATUS.ACTIVE;
  }

  /**
   * Get path points for current journey
   * @returns {Array} Array of path points
   */
  getPathPoints() {
    return [...this.pathPoints];
  }
}

// Create singleton instance
const journeyService = new JourneyService();
export default journeyService;

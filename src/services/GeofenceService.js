// Geofence monitoring and detection service
import { calculateDistance, isPointInGeofence } from '../utils/calculations';
import { JOURNEY_STATUS } from '../utils/constants';
import LocationService from './LocationService';
import NotificationService from './NotificationService';
import StorageService from './StorageService';

class GeofenceService {
  constructor() {
    this.activeGeofences = new Map();
    this.monitoringInterval = null;
    this.isMonitoring = false;
    this.listeners = [];
    this.lastNotificationTime = new Map();
    this.approachingNotificationSent = new Map();
  }

  /**
   * Initialize geofence service
   * @returns {Promise<boolean>} Success status
   */
  async initialize() {
    try {
      // Load any saved geofences
      await this.loadSavedGeofences();
      return true;
    } catch (error) {
      console.error('Error initializing geofence service:', error);
      return false;
    }
  }

  /**
   * Add a geofence for monitoring
   * @param {object} geofence - Geofence configuration
   * @returns {string} Geofence ID
   */
  addGeofence(geofence) {
    const geofenceId = geofence.id || `geofence_${Date.now()}`;
    
    const geofenceConfig = {
      id: geofenceId,
      latitude: geofence.latitude,
      longitude: geofence.longitude,
      radius: geofence.radius,
      name: geofence.name || 'Unnamed Location',
      createdAt: new Date().toISOString(),
      isActive: true,
      ...geofence
    };

    this.activeGeofences.set(geofenceId, geofenceConfig);
    
    // Save to storage
    this.saveGeofences();
    
    console.log(`Geofence added: ${geofenceConfig.name} (${geofenceId})`);
    return geofenceId;
  }

  /**
   * Remove a geofence
   * @param {string} geofenceId - Geofence ID to remove
   * @returns {boolean} Success status
   */
  removeGeofence(geofenceId) {
    try {
      const removed = this.activeGeofences.delete(geofenceId);
      
      if (removed) {
        // Clean up tracking data
        this.lastNotificationTime.delete(geofenceId);
        this.approachingNotificationSent.delete(geofenceId);
        
        // Save to storage
        this.saveGeofences();
        
        console.log(`Geofence removed: ${geofenceId}`);
      }
      
      return removed;
    } catch (error) {
      console.error('Error removing geofence:', error);
      return false;
    }
  }

  /**
   * Start monitoring geofences
   * @returns {Promise<boolean>} Success status
   */
  async startMonitoring() {
    try {
      if (this.isMonitoring) {
        console.log('Geofence monitoring already started');
        return true;
      }

      // Ensure location service is running
      if (!LocationService.isLocationTracking()) {
        const started = await LocationService.startTracking();
        if (!started) {
          throw new Error('Failed to start location tracking');
        }
      }

      // Start monitoring loop
      this.monitoringInterval = setInterval(() => {
        this.checkGeofences();
      }, 5000); // Check every 5 seconds

      this.isMonitoring = true;
      console.log('Geofence monitoring started');
      return true;
    } catch (error) {
      console.error('Error starting geofence monitoring:', error);
      return false;
    }
  }

  /**
   * Stop monitoring geofences
   */
  stopMonitoring() {
    try {
      if (this.monitoringInterval) {
        clearInterval(this.monitoringInterval);
        this.monitoringInterval = null;
      }

      this.isMonitoring = false;
      console.log('Geofence monitoring stopped');
    } catch (error) {
      console.error('Error stopping geofence monitoring:', error);
    }
  }

  /**
   * Check all active geofences against current location
   */
  checkGeofences() {
    const currentLocation = LocationService.currentLocation;
    
    if (!currentLocation) {
      console.warn('No current location available for geofence checking');
      return;
    }

    this.activeGeofences.forEach((geofence, geofenceId) => {
      if (!geofence.isActive) return;

      const distance = calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        geofence.latitude,
        geofence.longitude
      );

      const isInside = distance <= geofence.radius;
      const wasInside = geofence.wasInside || false;

      // Check for geofence entry
      if (isInside && !wasInside) {
        this.handleGeofenceEntry(geofence, distance);
      }
      // Check for geofence exit
      else if (!isInside && wasInside) {
        this.handleGeofenceExit(geofence, distance);
      }
      // Check for approaching destination
      else if (!isInside && distance <= geofence.radius * 2) {
        this.handleApproachingDestination(geofence, distance);
      }

      // Update state
      geofence.wasInside = isInside;
      geofence.lastDistance = distance;
      geofence.lastChecked = Date.now();
    });
  }

  /**
   * Handle geofence entry event
   * @param {object} geofence - Geofence that was entered
   * @param {number} distance - Distance to geofence center
   */
  async handleGeofenceEntry(geofence, distance) {
    console.log(`Entered geofence: ${geofence.name} (distance: ${Math.round(distance)}m)`);

    // Show alarm notification
    await NotificationService.showDestinationAlarm(geofence);

    // Notify listeners
    this.notifyListeners('geofence_entered', {
      geofence,
      distance,
      timestamp: Date.now(),
    });

    // Update last notification time
    this.lastNotificationTime.set(geofence.id, Date.now());
  }

  /**
   * Handle geofence exit event
   * @param {object} geofence - Geofence that was exited
   * @param {number} distance - Distance to geofence center
   */
  handleGeofenceExit(geofence, distance) {
    console.log(`Exited geofence: ${geofence.name} (distance: ${Math.round(distance)}m)`);

    // Reset approaching notification flag
    this.approachingNotificationSent.delete(geofence.id);

    // Notify listeners
    this.notifyListeners('geofence_exited', {
      geofence,
      distance,
      timestamp: Date.now(),
    });
  }

  /**
   * Handle approaching destination
   * @param {object} geofence - Geofence being approached
   * @param {number} distance - Distance to geofence center
   */
  async handleApproachingDestination(geofence, distance) {
    const notificationSent = this.approachingNotificationSent.get(geofence.id);
    
    if (!notificationSent) {
      console.log(`Approaching geofence: ${geofence.name} (distance: ${Math.round(distance)}m)`);
      
      // Show approaching notification
      await NotificationService.showApproachingDestination(geofence, distance);
      
      // Mark notification as sent
      this.approachingNotificationSent.set(geofence.id, true);
      
      // Notify listeners
      this.notifyListeners('approaching_destination', {
        geofence,
        distance,
        timestamp: Date.now(),
      });
    }
  }

  /**
   * Get all active geofences
   * @returns {Array} Array of geofence objects
   */
  getActiveGeofences() {
    return Array.from(this.activeGeofences.values());
  }

  /**
   * Get geofence by ID
   * @param {string} geofenceId - Geofence ID
   * @returns {object|null} Geofence object or null
   */
  getGeofence(geofenceId) {
    return this.activeGeofences.get(geofenceId) || null;
  }

  /**
   * Update geofence configuration
   * @param {string} geofenceId - Geofence ID
   * @param {object} updates - Updates to apply
   * @returns {boolean} Success status
   */
  updateGeofence(geofenceId, updates) {
    try {
      const geofence = this.activeGeofences.get(geofenceId);
      if (!geofence) return false;

      Object.assign(geofence, updates);
      this.saveGeofences();
      
      console.log(`Geofence updated: ${geofenceId}`);
      return true;
    } catch (error) {
      console.error('Error updating geofence:', error);
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
        console.error('Error in geofence listener:', error);
      }
    });
  }

  /**
   * Save geofences to storage
   */
  async saveGeofences() {
    try {
      const geofences = Array.from(this.activeGeofences.values());
      await StorageService.setItem('activeGeofences', geofences);
    } catch (error) {
      console.error('Error saving geofences:', error);
    }
  }

  /**
   * Load saved geofences from storage
   */
  async loadSavedGeofences() {
    try {
      const geofences = await StorageService.getItem('activeGeofences', []);
      
      geofences.forEach(geofence => {
        this.activeGeofences.set(geofence.id, geofence);
      });
      
      console.log(`Loaded ${geofences.length} saved geofences`);
    } catch (error) {
      console.error('Error loading saved geofences:', error);
    }
  }

  /**
   * Clear all geofences
   */
  async clearAllGeofences() {
    try {
      this.activeGeofences.clear();
      this.lastNotificationTime.clear();
      this.approachingNotificationSent.clear();
      
      await StorageService.removeItem('activeGeofences');
      console.log('All geofences cleared');
    } catch (error) {
      console.error('Error clearing geofences:', error);
    }
  }

  /**
   * Get monitoring status
   * @returns {boolean} True if monitoring is active
   */
  isMonitoringActive() {
    return this.isMonitoring;
  }
}

// Create singleton instance
const geofenceService = new GeofenceService();
export default geofenceService;

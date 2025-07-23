// Local storage service using AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';
import { APP_CONFIG } from '../utils/constants';

class StorageService {
  /**
   * Store data with key
   * @param {string} key - Storage key
   * @param {any} data - Data to store
   * @returns {Promise<boolean>} Success status
   */
  static async setItem(key, data) {
    try {
      const jsonData = JSON.stringify(data);
      await AsyncStorage.setItem(key, jsonData);
      return true;
    } catch (error) {
      console.error(`Error storing data for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Retrieve data by key
   * @param {string} key - Storage key
   * @param {any} defaultValue - Default value if key not found
   * @returns {Promise<any>} Retrieved data or default value
   */
  static async getItem(key, defaultValue = null) {
    try {
      const jsonData = await AsyncStorage.getItem(key);
      return jsonData ? JSON.parse(jsonData) : defaultValue;
    } catch (error) {
      console.error(`Error retrieving data for key ${key}:`, error);
      return defaultValue;
    }
  }

  /**
   * Remove data by key
   * @param {string} key - Storage key
   * @returns {Promise<boolean>} Success status
   */
  static async removeItem(key) {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing data for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Clear all stored data
   * @returns {Promise<boolean>} Success status
   */
  static async clear() {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  }

  /**
   * Get all keys
   * @returns {Promise<string[]>} Array of all keys
   */
  static async getAllKeys() {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error('Error getting all keys:', error);
      return [];
    }
  }

  // Specific storage methods for app data

  /**
   * Store recent destinations
   * @param {Array} destinations - Array of destination objects
   * @returns {Promise<boolean>} Success status
   */
  static async setRecentDestinations(destinations) {
    return this.setItem(APP_CONFIG.storage.recentDestinations, destinations);
  }

  /**
   * Get recent destinations
   * @returns {Promise<Array>} Array of recent destinations
   */
  static async getRecentDestinations() {
    return this.getItem(APP_CONFIG.storage.recentDestinations, []);
  }

  /**
   * Add destination to recent list
   * @param {object} destination - Destination object
   * @returns {Promise<boolean>} Success status
   */
  static async addRecentDestination(destination) {
    try {
      const recent = await this.getRecentDestinations();
      const updated = [destination, ...recent.filter(d => d.id !== destination.id)].slice(0, 10);
      return this.setRecentDestinations(updated);
    } catch (error) {
      console.error('Error adding recent destination:', error);
      return false;
    }
  }

  /**
   * Store journey history
   * @param {Array} journeys - Array of journey objects
   * @returns {Promise<boolean>} Success status
   */
  static async setJourneyHistory(journeys) {
    return this.setItem(APP_CONFIG.storage.journeyHistory, journeys);
  }

  /**
   * Get journey history
   * @returns {Promise<Array>} Array of journey objects
   */
  static async getJourneyHistory() {
    return this.getItem(APP_CONFIG.storage.journeyHistory, []);
  }

  /**
   * Add journey to history
   * @param {object} journey - Journey object
   * @returns {Promise<boolean>} Success status
   */
  static async addJourney(journey) {
    try {
      const history = await this.getJourneyHistory();
      const updated = [journey, ...history.filter(j => j.id !== journey.id)]
        .slice(0, APP_CONFIG.journey.maxStoredJourneys);
      return this.setJourneyHistory(updated);
    } catch (error) {
      console.error('Error adding journey to history:', error);
      return false;
    }
  }

  /**
   * Store user preferences
   * @param {object} preferences - User preferences object
   * @returns {Promise<boolean>} Success status
   */
  static async setUserPreferences(preferences) {
    return this.setItem(APP_CONFIG.storage.userPreferences, preferences);
  }

  /**
   * Get user preferences
   * @returns {Promise<object>} User preferences object
   */
  static async getUserPreferences() {
    return this.getItem(APP_CONFIG.storage.userPreferences, {
      alarmSound: true,
      vibration: true,
      volume: 0.8,
      geofenceRadius: APP_CONFIG.geofence.defaultRadius,
      locationAccuracy: APP_CONFIG.location.accuracy,
    });
  }

  /**
   * Update user preferences
   * @param {object} updates - Preference updates
   * @returns {Promise<boolean>} Success status
   */
  static async updateUserPreferences(updates) {
    try {
      const current = await this.getUserPreferences();
      const updated = { ...current, ...updates };
      return this.setUserPreferences(updated);
    } catch (error) {
      console.error('Error updating user preferences:', error);
      return false;
    }
  }

  /**
   * Store cached search results
   * @param {string} query - Search query
   * @param {Array} results - Search results
   * @returns {Promise<boolean>} Success status
   */
  static async setCachedSearch(query, results) {
    try {
      const cached = await this.getItem(APP_CONFIG.storage.cachedSearches, {});
      cached[query] = {
        results,
        timestamp: Date.now(),
      };
      
      // Clean old cache entries
      const now = Date.now();
      Object.keys(cached).forEach(key => {
        if (now - cached[key].timestamp > APP_CONFIG.api.searchCacheExpiry) {
          delete cached[key];
        }
      });
      
      return this.setItem(APP_CONFIG.storage.cachedSearches, cached);
    } catch (error) {
      console.error('Error caching search results:', error);
      return false;
    }
  }

  /**
   * Get cached search results
   * @param {string} query - Search query
   * @returns {Promise<Array|null>} Cached results or null
   */
  static async getCachedSearch(query) {
    try {
      const cached = await this.getItem(APP_CONFIG.storage.cachedSearches, {});
      const entry = cached[query];
      
      if (!entry) return null;
      
      // Check if cache is still valid
      const now = Date.now();
      if (now - entry.timestamp > APP_CONFIG.api.searchCacheExpiry) {
        delete cached[query];
        await this.setItem(APP_CONFIG.storage.cachedSearches, cached);
        return null;
      }
      
      return entry.results;
    } catch (error) {
      console.error('Error getting cached search:', error);
      return null;
    }
  }
}

export default StorageService;

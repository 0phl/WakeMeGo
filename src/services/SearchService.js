// Location search service with caching
import StorageService from './StorageService';
import { isValidSearchQuery, sanitizeInput } from '../utils/validation';

class SearchService {
  constructor() {
    this.isSearching = false;
    this.searchCache = new Map();
  }

  /**
   * Search for places using a mock implementation
   * Note: In production, this would use Google Places API
   * @param {string} query - Search query
   * @returns {Promise<Array>} Array of search results
   */
  async searchPlaces(query) {
    try {
      const sanitizedQuery = sanitizeInput(query);
      
      if (!isValidSearchQuery(sanitizedQuery)) {
        return [];
      }

      this.isSearching = true;

      // Check cache first
      const cachedResults = await StorageService.getCachedSearch(sanitizedQuery);
      if (cachedResults) {
        console.log('Returning cached search results for:', sanitizedQuery);
        this.isSearching = false;
        return cachedResults;
      }

      // Mock search results for development
      // In production, replace with actual Google Places API call
      const mockResults = this.generateMockResults(sanitizedQuery);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Cache the results
      await StorageService.setCachedSearch(sanitizedQuery, mockResults);

      this.isSearching = false;
      return mockResults;
    } catch (error) {
      console.error('Error searching places:', error);
      this.isSearching = false;
      return [];
    }
  }

  /**
   * Generate mock search results for development
   * @param {string} query - Search query
   * @returns {Array} Mock search results
   */
  generateMockResults(query) {
    const mockPlaces = [
      {
        id: 'mock_1',
        name: 'Central Park',
        address: 'New York, NY 10024, USA',
        latitude: 40.785091,
        longitude: -73.968285,
        rating: 4.7,
        types: ['park', 'tourist_attraction'],
      },
      {
        id: 'mock_2',
        name: 'Times Square',
        address: 'Manhattan, NY 10036, USA',
        latitude: 40.758896,
        longitude: -73.985130,
        rating: 4.3,
        types: ['tourist_attraction', 'point_of_interest'],
      },
      {
        id: 'mock_3',
        name: 'Brooklyn Bridge',
        address: 'New York, NY, USA',
        latitude: 40.706086,
        longitude: -73.996864,
        rating: 4.6,
        types: ['tourist_attraction', 'establishment'],
      },
      {
        id: 'mock_4',
        name: 'Statue of Liberty',
        address: 'New York, NY 10004, USA',
        latitude: 40.689247,
        longitude: -74.044502,
        rating: 4.5,
        types: ['tourist_attraction', 'establishment'],
      },
      {
        id: 'mock_5',
        name: 'Empire State Building',
        address: '350 5th Ave, New York, NY 10118, USA',
        latitude: 40.748817,
        longitude: -73.985428,
        rating: 4.4,
        types: ['tourist_attraction', 'establishment'],
      },
    ];

    // Filter results based on query
    const lowerQuery = query.toLowerCase();
    return mockPlaces
      .filter(place => 
        place.name.toLowerCase().includes(lowerQuery) ||
        place.address.toLowerCase().includes(lowerQuery)
      )
      .map(place => ({
        ...place,
        id: `${place.id}_${Date.now()}`, // Make ID unique
      }))
      .slice(0, 5); // Limit to 5 results
  }

  /**
   * Get recent destinations
   * @returns {Promise<Array>} Array of recent destinations
   */
  async getRecentDestinations() {
    try {
      return await StorageService.getRecentDestinations();
    } catch (error) {
      console.error('Error getting recent destinations:', error);
      return [];
    }
  }

  /**
   * Add destination to recent list
   * @param {object} destination - Destination object
   * @returns {Promise<boolean>} Success status
   */
  async addToRecent(destination) {
    try {
      return await StorageService.addRecentDestination(destination);
    } catch (error) {
      console.error('Error adding to recent destinations:', error);
      return false;
    }
  }

  /**
   * Get popular nearby locations (mock implementation)
   * @param {object} currentLocation - Current location {latitude, longitude}
   * @returns {Promise<Array>} Array of popular locations
   */
  async getPopularNearby(currentLocation) {
    try {
      // Mock popular locations
      const popularPlaces = [
        {
          id: 'popular_1',
          name: 'Nearest Coffee Shop',
          address: '123 Main St',
          latitude: currentLocation.latitude + 0.001,
          longitude: currentLocation.longitude + 0.001,
          rating: 4.2,
          types: ['cafe', 'food'],
          distance: 150, // meters
        },
        {
          id: 'popular_2',
          name: 'Local Grocery Store',
          address: '456 Oak Ave',
          latitude: currentLocation.latitude - 0.002,
          longitude: currentLocation.longitude + 0.002,
          rating: 4.0,
          types: ['grocery_or_supermarket', 'store'],
          distance: 300, // meters
        },
        {
          id: 'popular_3',
          name: 'City Library',
          address: '789 Pine St',
          latitude: currentLocation.latitude + 0.003,
          longitude: currentLocation.longitude - 0.001,
          rating: 4.5,
          types: ['library', 'establishment'],
          distance: 450, // meters
        },
      ];

      return popularPlaces;
    } catch (error) {
      console.error('Error getting popular nearby locations:', error);
      return [];
    }
  }

  /**
   * Reverse geocode coordinates to get address
   * @param {object} location - Location {latitude, longitude}
   * @returns {Promise<string>} Address string
   */
  async reverseGeocode(location) {
    try {
      // Mock reverse geocoding
      // In production, use Google Geocoding API or Expo Location.reverseGeocodeAsync
      const mockAddress = `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`;
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return `Address near ${mockAddress}`;
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      return 'Unknown location';
    }
  }

  /**
   * Get current location using device GPS
   * @returns {Promise<object|null>} Current location or null
   */
  async getCurrentLocation() {
    try {
      // This would typically use LocationService
      // For now, return a mock location
      return {
        latitude: 40.7128,
        longitude: -74.0060,
        address: 'New York, NY, USA',
      };
    } catch (error) {
      console.error('Error getting current location:', error);
      return null;
    }
  }

  /**
   * Clear search cache
   * @returns {Promise<boolean>} Success status
   */
  async clearCache() {
    try {
      await StorageService.removeItem('cachedSearches');
      this.searchCache.clear();
      console.log('Search cache cleared');
      return true;
    } catch (error) {
      console.error('Error clearing search cache:', error);
      return false;
    }
  }

  /**
   * Get search suggestions based on partial query
   * @param {string} partialQuery - Partial search query
   * @returns {Array} Array of suggestions
   */
  getSearchSuggestions(partialQuery) {
    const suggestions = [
      'Coffee shop',
      'Restaurant',
      'Gas station',
      'Hospital',
      'School',
      'Park',
      'Library',
      'Shopping mall',
      'Airport',
      'Train station',
    ];

    if (!partialQuery || partialQuery.length < 2) {
      return suggestions.slice(0, 5);
    }

    const lowerQuery = partialQuery.toLowerCase();
    return suggestions
      .filter(suggestion => suggestion.toLowerCase().includes(lowerQuery))
      .slice(0, 5);
  }

  /**
   * Check if currently searching
   * @returns {boolean} True if search is in progress
   */
  isSearchInProgress() {
    return this.isSearching;
  }

  /**
   * Cancel current search
   */
  cancelSearch() {
    this.isSearching = false;
    console.log('Search cancelled');
  }
}

// Create singleton instance
const searchService = new SearchService();
export default searchService;

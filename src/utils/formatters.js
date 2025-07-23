// Formatting utility functions

/**
 * Format address for display
 * @param {string} address - Full address string
 * @param {number} maxLength - Maximum length to display
 * @returns {string} Formatted address
 */
export const formatAddress = (address, maxLength = 50) => {
  if (!address) return 'Unknown location';
  
  if (address.length <= maxLength) {
    return address;
  }
  
  return address.substring(0, maxLength - 3) + '...';
};

/**
 * Format coordinates for display
 * @param {number} latitude - Latitude
 * @param {number} longitude - Longitude
 * @returns {string} Formatted coordinates
 */
export const formatCoordinates = (latitude, longitude) => {
  return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
};

/**
 * Format date for display
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const now = new Date();
  const diffInMs = now - dateObj;
  const diffInHours = diffInMs / (1000 * 60 * 60);
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
  
  if (diffInHours < 1) {
    const minutes = Math.floor(diffInMs / (1000 * 60));
    return `${minutes} minutes ago`;
  } else if (diffInHours < 24) {
    const hours = Math.floor(diffInHours);
    return `${hours} hours ago`;
  } else if (diffInDays < 7) {
    const days = Math.floor(diffInDays);
    return `${days} days ago`;
  } else {
    return dateObj.toLocaleDateString();
  }
};

/**
 * Format journey duration
 * @param {number} startTime - Start timestamp
 * @param {number} endTime - End timestamp (optional, defaults to now)
 * @returns {string} Formatted duration
 */
export const formatJourneyDuration = (startTime, endTime = Date.now()) => {
  const durationMs = endTime - startTime;
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((durationMs % (1000 * 60)) / 1000);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
};

/**
 * Format speed for display
 * @param {number} speed - Speed in m/s
 * @returns {string} Formatted speed in km/h
 */
export const formatSpeed = (speed) => {
  const kmh = speed * 3.6; // Convert m/s to km/h
  return `${kmh.toFixed(1)} km/h`;
};

/**
 * Format battery percentage
 * @param {number} level - Battery level (0-1)
 * @returns {string} Formatted battery percentage
 */
export const formatBattery = (level) => {
  return `${Math.round(level * 100)}%`;
};

/**
 * Format file size
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Capitalize first letter of each word
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalizeWords = (str) => {
  return str.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

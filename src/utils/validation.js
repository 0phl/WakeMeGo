// Validation utility functions

/**
 * Validate coordinates
 * @param {number} latitude - Latitude value
 * @param {number} longitude - Longitude value
 * @returns {boolean} True if coordinates are valid
 */
export const isValidCoordinates = (latitude, longitude) => {
  return (
    typeof latitude === 'number' &&
    typeof longitude === 'number' &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180 &&
    !isNaN(latitude) &&
    !isNaN(longitude)
  );
};

/**
 * Validate geofence radius
 * @param {number} radius - Radius in meters
 * @returns {boolean} True if radius is valid
 */
export const isValidRadius = (radius) => {
  return (
    typeof radius === 'number' &&
    radius >= 10 &&
    radius <= 10000 &&
    !isNaN(radius)
  );
};

/**
 * Validate destination object
 * @param {object} destination - Destination object
 * @returns {object} Validation result with isValid and errors
 */
export const validateDestination = (destination) => {
  const errors = [];
  
  if (!destination) {
    errors.push('Destination is required');
    return { isValid: false, errors };
  }
  
  if (!destination.name || typeof destination.name !== 'string' || destination.name.trim().length === 0) {
    errors.push('Destination name is required');
  }
  
  if (!isValidCoordinates(destination.latitude, destination.longitude)) {
    errors.push('Valid coordinates are required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate journey data
 * @param {object} journey - Journey object
 * @returns {object} Validation result
 */
export const validateJourney = (journey) => {
  const errors = [];
  
  if (!journey) {
    errors.push('Journey data is required');
    return { isValid: false, errors };
  }
  
  if (!journey.id || typeof journey.id !== 'string') {
    errors.push('Journey ID is required');
  }
  
  const destinationValidation = validateDestination(journey.destination);
  if (!destinationValidation.isValid) {
    errors.push(...destinationValidation.errors);
  }
  
  if (!isValidRadius(journey.radius)) {
    errors.push('Valid geofence radius is required');
  }
  
  if (!journey.startTime || isNaN(new Date(journey.startTime).getTime())) {
    errors.push('Valid start time is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate search query
 * @param {string} query - Search query string
 * @returns {boolean} True if query is valid
 */
export const isValidSearchQuery = (query) => {
  return (
    typeof query === 'string' &&
    query.trim().length >= 2 &&
    query.trim().length <= 200
  );
};

/**
 * Validate location accuracy
 * @param {object} location - Location object from GPS
 * @returns {boolean} True if location has acceptable accuracy
 */
export const isAccurateLocation = (location, maxAccuracy = 100) => {
  return (
    location &&
    location.coords &&
    isValidCoordinates(location.coords.latitude, location.coords.longitude) &&
    location.coords.accuracy &&
    location.coords.accuracy <= maxAccuracy
  );
};

/**
 * Validate notification settings
 * @param {object} settings - Notification settings object
 * @returns {object} Validation result
 */
export const validateNotificationSettings = (settings) => {
  const errors = [];
  
  if (!settings) {
    errors.push('Notification settings are required');
    return { isValid: false, errors };
  }
  
  if (settings.sound !== undefined && typeof settings.sound !== 'boolean') {
    errors.push('Sound setting must be a boolean');
  }
  
  if (settings.vibration !== undefined && typeof settings.vibration !== 'boolean') {
    errors.push('Vibration setting must be a boolean');
  }
  
  if (settings.volume !== undefined && (typeof settings.volume !== 'number' || settings.volume < 0 || settings.volume > 1)) {
    errors.push('Volume must be a number between 0 and 1');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Sanitize user input
 * @param {string} input - User input string
 * @returns {string} Sanitized string
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 500); // Limit length
};

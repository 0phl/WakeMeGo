// Utility functions for distance and location calculations

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in meters
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // Distance in meters
};

/**
 * Calculate estimated time of arrival
 * @param {number} distance - Distance in meters
 * @param {number} speed - Speed in km/h
 * @returns {number} ETA in minutes
 */
export const calculateETA = (distance, speed = 5) => {
  const distanceInKm = distance / 1000;
  const timeInHours = distanceInKm / speed;
  return Math.round(timeInHours * 60); // Convert to minutes
};

/**
 * Check if a point is within a geofence
 * @param {object} point - {latitude, longitude}
 * @param {object} center - {latitude, longitude}
 * @param {number} radius - Radius in meters
 * @returns {boolean} True if point is within geofence
 */
export const isPointInGeofence = (point, center, radius) => {
  const distance = calculateDistance(
    point.latitude,
    point.longitude,
    center.latitude,
    center.longitude
  );
  return distance <= radius;
};

/**
 * Format distance for display
 * @param {number} distance - Distance in meters
 * @returns {string} Formatted distance string
 */
export const formatDistance = (distance) => {
  if (distance < 1000) {
    return `${Math.round(distance)}m`;
  } else {
    return `${(distance / 1000).toFixed(1)}km`;
  }
};

/**
 * Format time for display
 * @param {number} minutes - Time in minutes
 * @returns {string} Formatted time string
 */
export const formatTime = (minutes) => {
  if (minutes < 60) {
    return `${minutes}min`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}min`;
  }
};

/**
 * Calculate bearing between two points
 * @param {number} lat1 - Start latitude
 * @param {number} lon1 - Start longitude
 * @param {number} lat2 - End latitude
 * @param {number} lon2 - End longitude
 * @returns {number} Bearing in degrees
 */
export const calculateBearing = (lat1, lon1, lat2, lon2) => {
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

  const θ = Math.atan2(y, x);

  return (θ * 180/Math.PI + 360) % 360; // Convert to degrees and normalize
};

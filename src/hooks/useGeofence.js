// Custom hook for geofence management
import { useState, useEffect, useCallback } from 'react';
import { GeofenceService } from '../services';

const useGeofence = (options = {}) => {
  const [geofences, setGeofences] = useState([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  const {
    autoStart = false,
    maxEvents = 50,
  } = options;

  useEffect(() => {
    loadGeofences();
    
    if (autoStart) {
      startMonitoring();
    }

    // Set up event listener
    const unsubscribe = GeofenceService.addEventListener(handleGeofenceEvent);

    return () => {
      unsubscribe();
      stopMonitoring();
    };
  }, [autoStart]);

  const loadGeofences = useCallback(async () => {
    try {
      const activeGeofences = GeofenceService.getActiveGeofences();
      setGeofences(activeGeofences);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const handleGeofenceEvent = useCallback((eventType, eventData) => {
    const newEvent = {
      id: `event_${Date.now()}`,
      type: eventType,
      data: eventData,
      timestamp: Date.now(),
    };

    setEvents(prevEvents => {
      const updatedEvents = [newEvent, ...prevEvents];
      return updatedEvents.slice(0, maxEvents);
    });
  }, [maxEvents]);

  const addGeofence = useCallback(async (geofenceConfig) => {
    try {
      const geofenceId = GeofenceService.addGeofence(geofenceConfig);
      await loadGeofences();
      return geofenceId;
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, [loadGeofences]);

  const removeGeofence = useCallback(async (geofenceId) => {
    try {
      const removed = GeofenceService.removeGeofence(geofenceId);
      if (removed) {
        await loadGeofences();
      }
      return removed;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, [loadGeofences]);

  const updateGeofence = useCallback(async (geofenceId, updates) => {
    try {
      const updated = GeofenceService.updateGeofence(geofenceId, updates);
      if (updated) {
        await loadGeofences();
      }
      return updated;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, [loadGeofences]);

  const startMonitoring = useCallback(async () => {
    try {
      const started = await GeofenceService.startMonitoring();
      setIsMonitoring(started);
      return started;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, []);

  const stopMonitoring = useCallback(() => {
    GeofenceService.stopMonitoring();
    setIsMonitoring(false);
  }, []);

  const clearAllGeofences = useCallback(async () => {
    try {
      await GeofenceService.clearAllGeofences();
      await loadGeofences();
      setEvents([]);
    } catch (err) {
      setError(err.message);
    }
  }, [loadGeofences]);

  const getGeofence = useCallback((geofenceId) => {
    return GeofenceService.getGeofence(geofenceId);
  }, []);

  const getRecentEvents = useCallback((eventType = null, limit = 10) => {
    let filteredEvents = events;
    
    if (eventType) {
      filteredEvents = events.filter(event => event.type === eventType);
    }
    
    return filteredEvents.slice(0, limit);
  }, [events]);

  return {
    geofences,
    isMonitoring,
    events,
    error,
    addGeofence,
    removeGeofence,
    updateGeofence,
    startMonitoring,
    stopMonitoring,
    clearAllGeofences,
    getGeofence,
    getRecentEvents,
    loadGeofences,
  };
};

export default useGeofence;

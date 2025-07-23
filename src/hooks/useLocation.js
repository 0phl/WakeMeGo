// Custom hook for location tracking
import { useState, useEffect, useCallback } from 'react';
import { LocationService } from '../services';

const useLocation = (options = {}) => {
  const [location, setLocation] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [accuracy, setAccuracy] = useState('unknown');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    autoStart = false,
    highAccuracy = true,
    updateInterval = 5000,
  } = options;

  useEffect(() => {
    if (autoStart) {
      startTracking();
    }

    return () => {
      stopTracking();
    };
  }, [autoStart]);

  const startTracking = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const started = await LocationService.startTracking();
      
      if (started) {
        setIsTracking(true);
        
        // Set up location listener
        const unsubscribe = LocationService.onLocationUpdate((newLocation) => {
          setLocation(newLocation);
          setAccuracy(LocationService.getAccuracyStatus());
        });

        // Get initial location
        const currentLocation = await LocationService.getCurrentLocation();
        if (currentLocation) {
          setLocation(currentLocation);
          setAccuracy(LocationService.getAccuracyStatus());
        }

        return unsubscribe;
      } else {
        throw new Error('Failed to start location tracking');
      }
    } catch (err) {
      setError(err.message);
      setIsTracking(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const stopTracking = useCallback(() => {
    LocationService.stopTracking();
    setIsTracking(false);
    setLocation(null);
    setAccuracy('unknown');
  }, []);

  const getCurrentLocation = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const currentLocation = await LocationService.getCurrentLocation();
      if (currentLocation) {
        setLocation(currentLocation);
        setAccuracy(LocationService.getAccuracyStatus());
        return currentLocation;
      } else {
        throw new Error('Unable to get current location');
      }
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const pauseTracking = useCallback(() => {
    LocationService.pauseTracking();
    setIsTracking(false);
  }, []);

  const resumeTracking = useCallback(async () => {
    try {
      await LocationService.resumeTracking();
      setIsTracking(true);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  return {
    location,
    isTracking,
    accuracy,
    error,
    isLoading,
    startTracking,
    stopTracking,
    getCurrentLocation,
    pauseTracking,
    resumeTracking,
  };
};

export default useLocation;

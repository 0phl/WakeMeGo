// Custom hook for journey management
import { useState, useEffect, useCallback } from 'react';
import { JourneyService } from '../services';
import { JOURNEY_STATUS } from '../utils/constants';

const useJourney = (options = {}) => {
  const [currentJourney, setCurrentJourney] = useState(null);
  const [journeyHistory, setJourneyHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [pathPoints, setPathPoints] = useState([]);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    autoLoadHistory = true,
    autoLoadSaved = true,
    maxEvents = 100,
  } = options;

  useEffect(() => {
    if (autoLoadHistory) {
      loadJourneyHistory();
    }
    
    if (autoLoadSaved) {
      loadSavedJourney();
    }

    // Set up event listener
    const unsubscribe = JourneyService.addEventListener(handleJourneyEvent);

    return () => {
      unsubscribe();
    };
  }, [autoLoadHistory, autoLoadSaved]);

  useEffect(() => {
    // Update stats periodically if journey is active
    let interval;
    
    if (currentJourney && currentJourney.status === JOURNEY_STATUS.ACTIVE) {
      interval = setInterval(() => {
        updateStats();
      }, 5000); // Update every 5 seconds
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [currentJourney]);

  const handleJourneyEvent = useCallback((eventType, eventData) => {
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

    // Update current journey based on event
    switch (eventType) {
      case 'journey_started':
        setCurrentJourney(eventData);
        break;
      case 'journey_completed':
      case 'journey_cancelled':
        setCurrentJourney(null);
        setStats(null);
        setPathPoints([]);
        loadJourneyHistory(); // Refresh history
        break;
      case 'journey_paused':
      case 'journey_resumed':
        setCurrentJourney(eventData);
        break;
    }
  }, [maxEvents]);

  const loadJourneyHistory = useCallback(async () => {
    try {
      const history = await JourneyService.getJourneyHistory();
      setJourneyHistory(history);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const loadSavedJourney = useCallback(async () => {
    try {
      const restored = await JourneyService.loadSavedJourney();
      if (restored) {
        const journey = JourneyService.getCurrentJourney();
        setCurrentJourney(journey);
        updateStats();
      }
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const updateStats = useCallback(() => {
    const currentStats = JourneyService.getCurrentStats();
    const currentPathPoints = JourneyService.getPathPoints();
    
    setStats(currentStats);
    setPathPoints(currentPathPoints);
  }, []);

  const startJourney = useCallback(async (destination, geofenceRadius) => {
    setIsLoading(true);
    setError(null);

    try {
      const journey = await JourneyService.startJourney(destination, geofenceRadius);
      if (journey) {
        setCurrentJourney(journey);
        return journey;
      } else {
        throw new Error('Failed to start journey');
      }
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const stopJourney = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const completedJourney = await JourneyService.stopJourney();
      if (completedJourney) {
        setCurrentJourney(null);
        setStats(null);
        setPathPoints([]);
        await loadJourneyHistory();
        return completedJourney;
      }
      return null;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [loadJourneyHistory]);

  const pauseJourney = useCallback(() => {
    try {
      const paused = JourneyService.pauseJourney();
      if (paused && currentJourney) {
        setCurrentJourney({
          ...currentJourney,
          status: JOURNEY_STATUS.PAUSED,
        });
      }
      return paused;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, [currentJourney]);

  const resumeJourney = useCallback(() => {
    try {
      const resumed = JourneyService.resumeJourney();
      if (resumed && currentJourney) {
        setCurrentJourney({
          ...currentJourney,
          status: JOURNEY_STATUS.ACTIVE,
        });
      }
      return resumed;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, [currentJourney]);

  const isJourneyActive = useCallback(() => {
    return currentJourney && currentJourney.status === JOURNEY_STATUS.ACTIVE;
  }, [currentJourney]);

  const isJourneyPaused = useCallback(() => {
    return currentJourney && currentJourney.status === JOURNEY_STATUS.PAUSED;
  }, [currentJourney]);

  const getJourneyById = useCallback((journeyId) => {
    return journeyHistory.find(journey => journey.id === journeyId);
  }, [journeyHistory]);

  const getRecentJourneys = useCallback((limit = 10) => {
    return journeyHistory.slice(0, limit);
  }, [journeyHistory]);

  const getJourneyStats = useCallback((journeyId = null) => {
    if (journeyId) {
      const journey = getJourneyById(journeyId);
      return journey ? {
        totalDistance: journey.totalDistance || 0,
        duration: journey.endTime ? 
          new Date(journey.endTime).getTime() - new Date(journey.startTime).getTime() : 0,
        pathPointsCount: journey.pathPoints ? journey.pathPoints.length : 0,
      } : null;
    }
    
    return stats;
  }, [stats, getJourneyById]);

  return {
    currentJourney,
    journeyHistory,
    stats,
    pathPoints,
    events,
    isLoading,
    error,
    startJourney,
    stopJourney,
    pauseJourney,
    resumeJourney,
    isJourneyActive,
    isJourneyPaused,
    getJourneyById,
    getRecentJourneys,
    getJourneyStats,
    loadJourneyHistory,
    updateStats,
  };
};

export default useJourney;

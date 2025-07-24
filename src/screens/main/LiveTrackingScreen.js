// Live tracking screen showing journey progress
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { GradientButton, StatusIndicator } from '../../components/common';
import { InteractiveMap } from '../../components/map';
import { LiveStats } from '../../components/tracking';
import { COLORS, TYPOGRAPHY } from '../../styles';
import { JourneyService, LocationService, GeofenceService } from '../../services';

const LiveTrackingScreen = ({ route, navigation }) => {
  const { journey } = route.params;
  const [currentStats, setCurrentStats] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [pathPoints, setPathPoints] = useState([]);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    // Set up listeners
    const locationUnsubscribe = LocationService.onLocationUpdate(handleLocationUpdate);
    const geofenceUnsubscribe = GeofenceService.addEventListener(handleGeofenceEvent);
    const journeyUnsubscribe = JourneyService.addEventListener(handleJourneyEvent);

    // Start tracking
    startTracking();

    return () => {
      locationUnsubscribe();
      geofenceUnsubscribe();
      journeyUnsubscribe();
    };
  }, []);

  const startTracking = async () => {
    try {
      await LocationService.startTracking();
      await GeofenceService.startMonitoring();
      
      // Get initial stats
      updateStats();
    } catch (error) {
      console.error('Error starting tracking:', error);
      Alert.alert('Error', 'Failed to start tracking. Please check your permissions.');
    }
  };

  const handleLocationUpdate = (location) => {
    setCurrentLocation(location);
    updateStats();
  };

  const handleGeofenceEvent = (eventType, eventData) => {
    if (eventType === 'geofence_entered') {
      // Navigate to alarm screen
      navigation.replace('Alarm', { 
        destination: journey.destination,
        journey: JourneyService.getCurrentJourney()
      });
    }
  };

  const handleJourneyEvent = (eventType, eventData) => {
    if (eventType === 'journey_completed') {
      navigation.replace('JourneySummary', { journey: eventData });
    }
  };

  const updateStats = () => {
    const stats = JourneyService.getCurrentStats();
    if (stats) {
      setCurrentStats(stats);
      setPathPoints(JourneyService.getPathPoints());
    }
  };

  const handlePauseResume = () => {
    if (isPaused) {
      JourneyService.resumeJourney();
      setIsPaused(false);
    } else {
      JourneyService.pauseJourney();
      setIsPaused(true);
    }
  };

  const handleStopJourney = () => {
    Alert.alert(
      'Stop Journey',
      'Are you sure you want to stop tracking? This will end your current journey.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Stop', 
          style: 'destructive',
          onPress: async () => {
            const completedJourney = await JourneyService.stopJourney();
            if (completedJourney) {
              navigation.replace('JourneySummary', { journey: completedJourney });
            } else {
              navigation.navigate('Start');
            }
          }
        },
      ]
    );
  };

  const handleMinimize = () => {
    // Navigate back to start screen but keep tracking in background
    navigation.navigate('Start');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleMinimize} style={styles.minimizeButton}>
          <Icon name="minimize" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        
        <Text style={styles.title}>Live Tracking</Text>
        
        <TouchableOpacity onPress={handleStopJourney} style={styles.stopButton}>
          <Icon name="stop" size={24} color={COLORS.error} />
        </TouchableOpacity>
      </View>

      {/* Status Bar */}
      <View style={styles.statusBar}>
        <StatusIndicator
          type="gps"
          status={LocationService.getAccuracyStatus()}
          size="small"
        />
        <StatusIndicator
          type="tracking"
          status={isPaused ? 'paused' : 'active'}
          size="small"
        />
        <StatusIndicator
          type="battery"
          value={85} // This would come from device battery API
          size="small"
        />
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        <InteractiveMap
          initialLocation={journey.destination}
          currentLocation={currentLocation}
          showCurrentLocation={true}
          geofenceRadius={journey.radius}
          pathPoints={pathPoints}
          showPath={true}
          editable={false}
          style={styles.map}
        />
      </View>

      {/* Live Stats */}
      <LiveStats
        stats={currentStats}
        destination={journey.destination}
        style={styles.stats}
      />

      {/* Control Buttons */}
      <View style={styles.controlsContainer}>
        <View style={styles.controlsRow}>
          <GradientButton
            title={isPaused ? 'Resume' : 'Pause'}
            onPress={handlePauseResume}
            variant={isPaused ? 'success' : 'warning'}
            style={styles.controlButton}
          />
          
          <GradientButton
            title="Stop Journey"
            onPress={handleStopJourney}
            variant="error"
            style={styles.controlButton}
          />
        </View>
        
        <Text style={styles.trackingNote}>
          {isPaused 
            ? 'Tracking is paused. Tap Resume to continue.'
            : 'Tracking in background. You can minimize the app safely.'
          }
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundWhite,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: COLORS.backgroundWhite,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  minimizeButton: {
    padding: 8,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
  },
  stopButton: {
    padding: 8,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: COLORS.backgroundGray,
  },
  mapContainer: {
    flex: 1,
    minHeight: 200,
  },
  map: {
    flex: 1,
  },
  stats: {
    marginHorizontal: 0,
    marginVertical: 0,
    borderRadius: 0,
  },
  controlsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.backgroundWhite,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  controlButton: {
    flex: 1,
    marginHorizontal: 6,
  },
  trackingNote: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default LiveTrackingScreen;

// Alarm screen when destination is reached
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  Vibration,
  Alert 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { GradientBackground, GradientButton } from '../../components/common';
import { COLORS, TYPOGRAPHY } from '../../styles';
import { JourneyService, NotificationService } from '../../services';
import { formatJourneyDuration } from '../../utils/calculations';

const AlarmScreen = ({ route, navigation }) => {
  const { destination, journey } = route.params;
  const [pulseAnimation] = useState(new Animated.Value(1));
  const [isAlarmActive, setIsAlarmActive] = useState(true);

  useEffect(() => {
    startAlarmAnimation();
    startVibration();
    
    return () => {
      stopAlarm();
    };
  }, []);

  const startAlarmAnimation = () => {
    const pulse = () => {
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.2,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (isAlarmActive) {
          pulse();
        }
      });
    };
    pulse();
  };

  const startVibration = () => {
    // Vibration pattern: [wait, vibrate, wait, vibrate, ...]
    const pattern = [0, 1000, 500, 1000, 500, 1000];
    
    if (isAlarmActive) {
      Vibration.vibrate(pattern, true); // Repeat indefinitely
    }
  };

  const stopAlarm = () => {
    setIsAlarmActive(false);
    Vibration.cancel();
    pulseAnimation.stopAnimation();
  };

  const handleDismissAlarm = async () => {
    stopAlarm();
    
    // Complete the journey
    const completedJourney = await JourneyService.stopJourney();
    
    if (completedJourney) {
      navigation.replace('JourneySummary', { journey: completedJourney });
    } else {
      navigation.navigate('Start');
    }
  };

  const handleSnooze = () => {
    stopAlarm();
    
    Alert.alert(
      'Snooze Alarm',
      'The alarm will stop for now, but tracking will continue. You can return to this screen anytime.',
      [
        { text: 'Cancel', onPress: () => setIsAlarmActive(true) },
        { 
          text: 'Snooze', 
          onPress: () => {
            navigation.navigate('LiveTracking', { journey });
          }
        },
      ]
    );
  };

  const getJourneyDuration = () => {
    if (journey && journey.startTime) {
      return formatJourneyDuration(new Date(journey.startTime).getTime());
    }
    return 'Unknown';
  };

  return (
    <GradientBackground style={styles.container}>
      <View style={styles.content}>
        {/* Alarm Icon */}
        <Animated.View
          style={[
            styles.alarmIconContainer,
            {
              transform: [{ scale: pulseAnimation }],
            },
          ]}
        >
          <Icon name="notifications-active" size={120} color={COLORS.textLight} />
        </Animated.View>

        {/* Alarm Message */}
        <View style={styles.messageContainer}>
          <Text style={styles.alarmTitle}>Wake Up!</Text>
          <Text style={styles.alarmSubtitle}>You've arrived at your destination</Text>
          
          <View style={styles.destinationInfo}>
            <Icon name="place" size={24} color={COLORS.textLight} />
            <Text style={styles.destinationName}>{destination.name}</Text>
          </View>
          
          <Text style={styles.destinationAddress}>{destination.address}</Text>
        </View>

        {/* Journey Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Icon name="schedule" size={20} color="rgba(255, 255, 255, 0.8)" />
            <Text style={styles.statText}>Journey time: {getJourneyDuration()}</Text>
          </View>
          
          {journey?.totalDistance && (
            <View style={styles.statItem}>
              <Icon name="timeline" size={20} color="rgba(255, 255, 255, 0.8)" />
              <Text style={styles.statText}>
                Distance: {(journey.totalDistance / 1000).toFixed(1)}km
              </Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <GradientButton
            title="I'm Awake!"
            onPress={handleDismissAlarm}
            style={styles.dismissButton}
            colors={[COLORS.backgroundWhite, COLORS.backgroundGray]}
            textStyle={{ color: COLORS.gradientStart }}
          />
          
          <TouchableOpacity onPress={handleSnooze} style={styles.snoozeButton}>
            <Text style={styles.snoozeText}>Snooze</Text>
          </TouchableOpacity>
        </View>

        {/* Alarm Status */}
        {isAlarmActive && (
          <View style={styles.statusContainer}>
            <View style={styles.statusIndicator}>
              <Icon name="vibration" size={16} color="rgba(255, 255, 255, 0.8)" />
              <Text style={styles.statusText}>Vibrating</Text>
            </View>
          </View>
        )}
      </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  alarmIconContainer: {
    marginBottom: 40,
    padding: 20,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  alarmTitle: {
    fontSize: TYPOGRAPHY.fontSize.display,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textLight,
    marginBottom: 8,
    textAlign: 'center',
  },
  alarmSubtitle: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 24,
    textAlign: 'center',
  },
  destinationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  destinationName: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textLight,
    marginLeft: 8,
    textAlign: 'center',
  },
  destinationAddress: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 22,
  },
  statsContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 8,
  },
  actionContainer: {
    width: '100%',
    alignItems: 'center',
  },
  dismissButton: {
    width: '100%',
    marginBottom: 16,
  },
  snoozeButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  snoozeText: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  statusContainer: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 6,
  },
});

export default AlarmScreen;

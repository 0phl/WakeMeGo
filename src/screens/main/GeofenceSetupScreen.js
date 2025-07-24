// Geofence setup screen for configuring alarm radius
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Slider } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { GradientButton, Card } from '../../components/common';
import { InteractiveMap } from '../../components/map';
import { COLORS, TYPOGRAPHY } from '../../styles';
import { APP_CONFIG } from '../../utils/constants';
import { formatDistance } from '../../utils/calculations';
import { JourneyService } from '../../services';

const GeofenceSetupScreen = ({ route, navigation }) => {
  const { destination } = route.params;
  const [radius, setRadius] = useState(APP_CONFIG.geofence.defaultRadius);
  const [isStarting, setIsStarting] = useState(false);

  const handleRadiusChange = (value) => {
    setRadius(Math.round(value));
  };

  const handleStartJourney = async () => {
    setIsStarting(true);
    
    try {
      const journey = await JourneyService.startJourney(destination, radius);
      
      if (journey) {
        navigation.replace('LiveTracking', { journey });
      } else {
        alert('Failed to start journey. Please try again.');
      }
    } catch (error) {
      console.error('Error starting journey:', error);
      alert('Failed to start journey. Please check your permissions and try again.');
    } finally {
      setIsStarting(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const getRadiusDescription = () => {
    if (radius <= 50) return 'Very precise - for exact locations';
    if (radius <= 100) return 'Precise - for buildings and small areas';
    if (radius <= 200) return 'Moderate - for neighborhoods';
    if (radius <= 500) return 'Wide - for districts';
    return 'Very wide - for large areas';
  };

  const getRadiusColor = () => {
    if (radius <= 100) return COLORS.success;
    if (radius <= 300) return COLORS.warning;
    return COLORS.error;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        
        <Text style={styles.title}>Set Alarm Zone</Text>
        
        <View style={styles.headerSpacer} />
      </View>

      {/* Map with Geofence */}
      <View style={styles.mapContainer}>
        <InteractiveMap
          initialLocation={destination}
          geofenceRadius={radius}
          editable={false}
          style={styles.map}
        />
        
        {/* Radius Info Overlay */}
        <View style={styles.radiusOverlay}>
          <Card style={styles.radiusCard}>
            <View style={styles.radiusInfo}>
              <Icon name="radio-button-checked" size={20} color={getRadiusColor()} />
              <Text style={[styles.radiusText, { color: getRadiusColor() }]}>
                {formatDistance(radius)} radius
              </Text>
            </View>
          </Card>
        </View>
      </View>

      {/* Radius Controls */}
      <View style={styles.controlsContainer}>
        <Card style={styles.controlsCard}>
          <Text style={styles.controlsTitle}>Alarm Zone Radius</Text>
          
          <View style={styles.radiusDisplay}>
            <Text style={styles.radiusValue}>{formatDistance(radius)}</Text>
            <Text style={styles.radiusDescription}>{getRadiusDescription()}</Text>
          </View>

          <View style={styles.sliderContainer}>
            <Text style={styles.sliderLabel}>
              {formatDistance(APP_CONFIG.geofence.minRadius)}
            </Text>
            
            <Slider
              style={styles.slider}
              minimumValue={APP_CONFIG.geofence.minRadius}
              maximumValue={APP_CONFIG.geofence.maxRadius}
              value={radius}
              onValueChange={handleRadiusChange}
              minimumTrackTintColor={COLORS.gradientStart}
              maximumTrackTintColor={COLORS.borderLight}
              thumbStyle={{ backgroundColor: COLORS.gradientStart }}
              step={10}
            />
            
            <Text style={styles.sliderLabel}>
              {formatDistance(APP_CONFIG.geofence.maxRadius)}
            </Text>
          </View>

          {/* Quick Radius Options */}
          <View style={styles.quickOptions}>
            <Text style={styles.quickOptionsTitle}>Quick Select:</Text>
            <View style={styles.quickOptionsRow}>
              {APP_CONFIG.geofence.radiusOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.quickOption,
                    radius === option && styles.quickOptionActive,
                  ]}
                  onPress={() => setRadius(option)}
                >
                  <Text style={[
                    styles.quickOptionText,
                    radius === option && styles.quickOptionTextActive,
                  ]}>
                    {formatDistance(option)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Card>
      </View>

      {/* Destination Info */}
      <View style={styles.destinationInfo}>
        <Card style={styles.destinationCard}>
          <View style={styles.destinationHeader}>
            <Icon name="place" size={20} color={COLORS.gradientStart} />
            <Text style={styles.destinationName}>{destination.name}</Text>
          </View>
          <Text style={styles.destinationAddress}>{destination.address}</Text>
        </Card>
      </View>

      {/* Action Button */}
      <View style={styles.actionContainer}>
        <GradientButton
          title="Start Journey"
          onPress={handleStartJourney}
          loading={isStarting}
          style={styles.startButton}
        />
        
        <Text style={styles.disclaimer}>
          You'll be notified when you enter the alarm zone around your destination
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
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: COLORS.backgroundWhite,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  backButton: {
    padding: 8,
  },
  title: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  headerSpacer: {
    width: 40,
  },
  mapContainer: {
    height: 250,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  radiusOverlay: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  radiusCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 8,
  },
  radiusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radiusText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    marginLeft: 6,
  },
  controlsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  controlsCard: {
    padding: 20,
  },
  controlsTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
  },
  radiusDisplay: {
    alignItems: 'center',
    marginBottom: 20,
  },
  radiusValue: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.gradientStart,
    marginBottom: 4,
  },
  radiusDescription: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  slider: {
    flex: 1,
    marginHorizontal: 12,
  },
  sliderLabel: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
    minWidth: 40,
    textAlign: 'center',
  },
  quickOptions: {
    alignItems: 'center',
  },
  quickOptionsTitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  quickOptionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  quickOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLORS.backgroundGray,
    borderRadius: 16,
    marginHorizontal: 4,
    marginVertical: 2,
  },
  quickOptionActive: {
    backgroundColor: COLORS.gradientStart,
  },
  quickOptionText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  quickOptionTextActive: {
    color: COLORS.textLight,
  },
  destinationInfo: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  destinationCard: {
    padding: 16,
  },
  destinationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  destinationName: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
    marginLeft: 8,
  },
  destinationAddress: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginLeft: 28,
  },
  actionContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  startButton: {
    marginBottom: 12,
  },
  disclaimer: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default GeofenceSetupScreen;

// Map selection screen for precise location adjustment
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { GradientButton, Card } from '../../components/common';
import { InteractiveMap } from '../../components/map';
import { COLORS, TYPOGRAPHY } from '../../styles';
import { SearchService } from '../../services';
import { formatAddress } from '../../utils/formatters';

const MapSelectionScreen = ({ route, navigation }) => {
  const { destination, useCurrentLocation } = route.params;
  const [selectedLocation, setSelectedLocation] = useState(destination);
  const [address, setAddress] = useState(destination?.address || '');
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);

  useEffect(() => {
    if (useCurrentLocation) {
      getCurrentLocation();
    }
  }, [useCurrentLocation]);

  const getCurrentLocation = async () => {
    try {
      setIsLoadingAddress(true);
      const currentLocation = await SearchService.getCurrentLocation();
      
      if (currentLocation) {
        setSelectedLocation(currentLocation);
        const addressResult = await SearchService.reverseGeocode(currentLocation);
        setAddress(addressResult);
      }
    } catch (error) {
      console.error('Error getting current location:', error);
      Alert.alert('Error', 'Failed to get current location');
    } finally {
      setIsLoadingAddress(false);
    }
  };

  const handleLocationChange = async (location) => {
    setSelectedLocation({
      ...selectedLocation,
      latitude: location.latitude,
      longitude: location.longitude,
    });

    // Update address
    setIsLoadingAddress(true);
    try {
      const addressResult = await SearchService.reverseGeocode(location);
      setAddress(addressResult);
    } catch (error) {
      console.error('Error reverse geocoding:', error);
    } finally {
      setIsLoadingAddress(false);
    }
  };

  const handleConfirmLocation = () => {
    const finalDestination = {
      ...selectedLocation,
      address,
      id: selectedLocation.id || `location_${Date.now()}`,
      name: selectedLocation.name || 'Selected Location',
    };

    navigation.navigate('GeofenceSetup', { destination: finalDestination });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        
        <Text style={styles.title}>Adjust Location</Text>
        
        <View style={styles.headerSpacer} />
      </View>

      {/* Map Container */}
      <View style={styles.mapContainer}>
        <InteractiveMap
          initialLocation={selectedLocation}
          onLocationChange={handleLocationChange}
          editable={true}
          style={styles.map}
        />
        
        {/* Map Instructions */}
        <View style={styles.instructionsOverlay}>
          <Card style={styles.instructionsCard}>
            <View style={styles.instructionsContent}>
              <Icon name="touch-app" size={20} color={COLORS.gradientStart} />
              <Text style={styles.instructionsText}>
                Tap on the map or drag the pin to adjust the location
              </Text>
            </View>
          </Card>
        </View>
      </View>

      {/* Location Info */}
      <View style={styles.locationInfo}>
        <Card style={styles.locationCard}>
          <View style={styles.locationHeader}>
            <Icon name="place" size={24} color={COLORS.gradientStart} />
            <Text style={styles.locationTitle}>Selected Location</Text>
          </View>
          
          <Text style={styles.locationName}>
            {selectedLocation?.name || 'Custom Location'}
          </Text>
          
          <Text style={styles.locationAddress}>
            {isLoadingAddress ? 'Getting address...' : formatAddress(address)}
          </Text>
          
          <View style={styles.coordinatesContainer}>
            <Icon name="my-location" size={16} color={COLORS.textSecondary} />
            <Text style={styles.coordinates}>
              {selectedLocation?.latitude?.toFixed(6)}, {selectedLocation?.longitude?.toFixed(6)}
            </Text>
          </View>
        </Card>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <GradientButton
          title="Confirm Location"
          onPress={handleConfirmLocation}
          style={styles.confirmButton}
        />
        
        <TouchableOpacity onPress={getCurrentLocation} style={styles.currentLocationButton}>
          <Icon name="my-location" size={20} color={COLORS.gradientStart} />
          <Text style={styles.currentLocationText}>Use Current Location</Text>
        </TouchableOpacity>
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
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  instructionsOverlay: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
  },
  instructionsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 12,
  },
  instructionsContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  instructionsText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textPrimary,
    marginLeft: 8,
    flex: 1,
  },
  locationInfo: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  locationCard: {
    padding: 16,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
    marginLeft: 8,
  },
  locationName: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  coordinatesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coordinates: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
    marginLeft: 4,
    fontFamily: 'monospace',
  },
  actionContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: COLORS.backgroundWhite,
  },
  confirmButton: {
    marginBottom: 12,
  },
  currentLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.backgroundGray,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  currentLocationText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.gradientStart,
    marginLeft: 8,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
});

export default MapSelectionScreen;

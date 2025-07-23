// Interactive map component with drag & drop functionality
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import MapView, { Marker, Circle, Polyline } from 'react-native-maps';
import { COLORS } from '../../styles';

const InteractiveMap = ({ 
  initialLocation, 
  geofenceRadius = 100, 
  onLocationChange,
  showCurrentLocation = false,
  currentLocation,
  pathPoints = [],
  showPath = false,
  editable = true,
  style,
  mapType = 'standard'
}) => {
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [isDragging, setIsDragging] = useState(false);
  const pinAnimation = useRef(new Animated.Value(0)).current;

  const handlePinDrag = (coordinate) => {
    setSelectedLocation(coordinate);
    if (onLocationChange) {
      onLocationChange(coordinate);
    }
  };

  const animatePin = () => {
    Animated.sequence([
      Animated.timing(pinAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(pinAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleMapPress = (event) => {
    if (!editable) return;
    
    const { coordinate } = event.nativeEvent;
    handlePinDrag(coordinate);
    animatePin();
  };

  return (
    <View style={[styles.container, style]}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: initialLocation.latitude,
          longitude: initialLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        onPress={handleMapPress}
        mapType={mapType}
        showsUserLocation={false}
        showsMyLocationButton={false}
        showsCompass={true}
        showsScale={true}
      >
        {/* Current Location Marker */}
        {showCurrentLocation && currentLocation && (
          <Marker
            coordinate={currentLocation}
            title="Your Location"
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View style={styles.currentLocationMarker}>
              <View style={styles.currentLocationDot} />
              <View style={styles.currentLocationRing} />
            </View>
          </Marker>
        )}

        {/* Destination Marker with Animation */}
        <Marker
          coordinate={selectedLocation}
          draggable={editable}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={(event) => {
            setIsDragging(false);
            handlePinDrag(event.nativeEvent.coordinate);
          }}
          anchor={{ x: 0.5, y: 1 }}
          title="Destination"
          description="Drag to adjust location"
        >
          <Animated.View
            style={[
              styles.destinationPin,
              {
                transform: [
                  {
                    scale: pinAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.3],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.pinHead} />
            <View style={styles.pinTail} />
          </Animated.View>
        </Marker>

        {/* Geofence Circle */}
        <Circle
          center={selectedLocation}
          radius={geofenceRadius}
          fillColor={COLORS.geofenceFill}
          strokeColor={COLORS.geofenceStroke}
          strokeWidth={2}
        />

        {/* Path Trail */}
        {showPath && pathPoints.length > 1 && (
          <Polyline
            coordinates={pathPoints}
            strokeColor={COLORS.gradientStart}
            strokeWidth={3}
            strokePattern={[1, 1]}
          />
        )}
      </MapView>

      {/* Drag Instruction */}
      {isDragging && editable && (
        <View style={styles.dragInstruction}>
          <Text style={styles.instructionText}>Drag to adjust location</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  currentLocationMarker: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentLocationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.currentLocationMarker,
    borderWidth: 2,
    borderColor: COLORS.backgroundWhite,
  },
  currentLocationRing: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.currentLocationMarker,
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
  },
  destinationPin: {
    alignItems: 'center',
  },
  pinHead: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.gradientStart,
    borderWidth: 2,
    borderColor: COLORS.backgroundWhite,
    shadowColor: COLORS.cardShadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  pinTail: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: COLORS.gradientStart,
    marginTop: -2,
  },
  dragInstruction: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    backgroundColor: COLORS.overlayLight,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
});

export default InteractiveMap;

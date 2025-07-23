// Location marker component for different types of locations
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../styles';

const LocationMarker = ({ 
  coordinate,
  type = 'destination', // 'current', 'destination', 'waypoint'
  title,
  description,
  onPress,
  draggable = false,
  onDragEnd,
  size = 'medium' // 'small', 'medium', 'large'
}) => {
  const getMarkerStyle = () => {
    const baseSize = size === 'large' ? 32 : size === 'small' ? 16 : 24;
    
    switch (type) {
      case 'current':
        return {
          width: baseSize,
          height: baseSize,
          borderRadius: baseSize / 2,
          backgroundColor: COLORS.currentLocationMarker,
          borderWidth: 3,
          borderColor: COLORS.backgroundWhite,
          shadowColor: COLORS.cardShadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 5,
        };
      case 'destination':
        return {
          width: baseSize,
          height: baseSize,
          borderRadius: baseSize / 2,
          backgroundColor: COLORS.gradientStart,
          borderWidth: 3,
          borderColor: COLORS.backgroundWhite,
          shadowColor: COLORS.cardShadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 5,
        };
      case 'waypoint':
        return {
          width: baseSize * 0.8,
          height: baseSize * 0.8,
          borderRadius: (baseSize * 0.8) / 2,
          backgroundColor: COLORS.warning,
          borderWidth: 2,
          borderColor: COLORS.backgroundWhite,
        };
      default:
        return {
          width: baseSize,
          height: baseSize,
          borderRadius: baseSize / 2,
          backgroundColor: COLORS.gradientStart,
          borderWidth: 2,
          borderColor: COLORS.backgroundWhite,
        };
    }
  };

  const getIconName = () => {
    switch (type) {
      case 'current':
        return 'my-location';
      case 'destination':
        return 'place';
      case 'waypoint':
        return 'radio-button-checked';
      default:
        return 'place';
    }
  };

  const renderCustomMarker = () => {
    if (type === 'current') {
      return (
        <View style={[styles.currentLocationContainer, getMarkerStyle()]}>
          <View style={styles.currentLocationPulse} />
        </View>
      );
    }

    return (
      <View style={[styles.markerContainer, getMarkerStyle()]}>
        <Icon 
          name={getIconName()} 
          size={size === 'large' ? 20 : size === 'small' ? 10 : 14} 
          color={COLORS.backgroundWhite} 
        />
      </View>
    );
  };

  return (
    <Marker
      coordinate={coordinate}
      title={title}
      description={description}
      onPress={onPress}
      draggable={draggable}
      onDragEnd={onDragEnd}
      anchor={{ x: 0.5, y: 0.5 }}
    >
      {renderCustomMarker()}
    </Marker>
  );
};

const styles = StyleSheet.create({
  markerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentLocationContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  currentLocationPulse: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderWidth: 1,
    borderColor: COLORS.currentLocationMarker,
  },
});

export default LocationMarker;

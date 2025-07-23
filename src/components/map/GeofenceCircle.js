// Geofence circle component for map visualization
import React from 'react';
import { Circle } from 'react-native-maps';
import { COLORS } from '../../styles';

const GeofenceCircle = ({ 
  center, 
  radius, 
  fillColor = COLORS.geofenceFill,
  strokeColor = COLORS.geofenceStroke,
  strokeWidth = 2,
  opacity = 0.3,
  animated = false
}) => {
  return (
    <Circle
      center={center}
      radius={radius}
      fillColor={fillColor}
      strokeColor={strokeColor}
      strokeWidth={strokeWidth}
      zIndex={1}
    />
  );
};

export default GeofenceCircle;

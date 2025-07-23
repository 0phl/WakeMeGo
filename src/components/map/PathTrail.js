// Path trail component for showing journey route
import React from 'react';
import { Polyline } from 'react-native-maps';
import { COLORS } from '../../styles';

const PathTrail = ({ 
  coordinates = [],
  strokeColor = COLORS.gradientStart,
  strokeWidth = 3,
  strokePattern = null, // [1, 1] for dashed line
  lineCap = 'round',
  lineJoin = 'round',
  animated = false,
  zIndex = 2
}) => {
  // Don't render if we don't have enough points
  if (!coordinates || coordinates.length < 2) {
    return null;
  }

  return (
    <Polyline
      coordinates={coordinates}
      strokeColor={strokeColor}
      strokeWidth={strokeWidth}
      strokePattern={strokePattern}
      lineCap={lineCap}
      lineJoin={lineJoin}
      zIndex={zIndex}
    />
  );
};

export default PathTrail;

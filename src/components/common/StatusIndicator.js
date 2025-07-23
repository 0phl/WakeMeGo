// Status indicator component for GPS, battery, etc.
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, TYPOGRAPHY } from '../../styles';

const StatusIndicator = ({ 
  type, // 'gps', 'battery', 'connection', 'tracking'
  status, // 'excellent', 'good', 'fair', 'poor', 'offline'
  value, // numeric value (e.g., battery percentage, accuracy in meters)
  label,
  style,
  showLabel = true,
  size = 'small' // 'small', 'medium', 'large'
}) => {
  const getIconName = () => {
    switch (type) {
      case 'gps':
        return status === 'offline' ? 'gps-off' : 'gps-fixed';
      case 'battery':
        if (value > 80) return 'battery-full';
        if (value > 60) return 'battery-80';
        if (value > 40) return 'battery-60';
        if (value > 20) return 'battery-30';
        return 'battery-20';
      case 'connection':
        return status === 'offline' ? 'signal-wifi-off' : 'signal-wifi-4-bar';
      case 'tracking':
        return status === 'active' ? 'my-location' : 'location-disabled';
      default:
        return 'info';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'excellent':
        return COLORS.success;
      case 'good':
        return COLORS.success;
      case 'fair':
        return COLORS.warning;
      case 'poor':
        return COLORS.error;
      case 'offline':
        return COLORS.error;
      case 'active':
        return COLORS.success;
      default:
        return COLORS.textSecondary;
    }
  };

  const getStatusText = () => {
    if (label) return label;
    
    switch (type) {
      case 'gps':
        if (status === 'offline') return 'GPS Off';
        if (value) return `±${value}m`;
        return status.charAt(0).toUpperCase() + status.slice(1);
      case 'battery':
        return `${value}%`;
      case 'connection':
        return status === 'offline' ? 'Offline' : 'Online';
      case 'tracking':
        return status === 'active' ? 'Tracking' : 'Stopped';
      default:
        return status;
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'large':
        return 24;
      case 'medium':
        return 20;
      default:
        return 16;
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'large':
        return TYPOGRAPHY.fontSize.md;
      case 'medium':
        return TYPOGRAPHY.fontSize.sm;
      default:
        return TYPOGRAPHY.fontSize.xs;
    }
  };

  return (
    <View style={[styles.container, style]}>
      <Icon 
        name={getIconName()} 
        size={getIconSize()} 
        color={getStatusColor()} 
      />
      {showLabel && (
        <Text style={[
          styles.text,
          { 
            color: getStatusColor(),
            fontSize: getFontSize()
          }
        ]}>
          {getStatusText()}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: COLORS.backgroundGray,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  text: {
    marginLeft: 4,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
});

export default StatusIndicator;

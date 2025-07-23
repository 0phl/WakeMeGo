// Distance indicator component for map overlay
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, TYPOGRAPHY } from '../../styles';
import { formatDistance } from '../../utils/calculations';

const DistanceIndicator = ({ 
  distance,
  eta,
  style,
  position = 'top', // 'top', 'bottom', 'center'
  variant = 'compact' // 'compact', 'detailed'
}) => {
  const getPositionStyle = () => {
    switch (position) {
      case 'top':
        return { top: 16, left: 16, right: 16 };
      case 'bottom':
        return { bottom: 16, left: 16, right: 16 };
      case 'center':
        return { 
          top: '50%', 
          left: 16, 
          right: 16,
          transform: [{ translateY: -25 }]
        };
      default:
        return { top: 16, left: 16, right: 16 };
    }
  };

  if (variant === 'compact') {
    return (
      <View style={[
        styles.container,
        styles.compactContainer,
        getPositionStyle(),
        style
      ]}>
        <View style={styles.distanceRow}>
          <Icon name="my-location" size={16} color={COLORS.gradientStart} />
          <Text style={styles.distanceText}>
            {formatDistance(distance)}
          </Text>
          {eta && (
            <>
              <Icon name="schedule" size={16} color={COLORS.textSecondary} style={styles.etaIcon} />
              <Text style={styles.etaText}>
                {eta}min
              </Text>
            </>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={[
      styles.container,
      styles.detailedContainer,
      getPositionStyle(),
      style
    ]}>
      <View style={styles.row}>
        <Icon name="my-location" size={20} color={COLORS.gradientStart} />
        <View style={styles.textContainer}>
          <Text style={styles.label}>Distance to destination</Text>
          <Text style={styles.value}>{formatDistance(distance)}</Text>
        </View>
      </View>
      
      {eta && (
        <View style={styles.row}>
          <Icon name="schedule" size={20} color={COLORS.textSecondary} />
          <View style={styles.textContainer}>
            <Text style={styles.label}>Estimated arrival</Text>
            <Text style={styles.value}>{eta} minutes</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: COLORS.overlayLight,
    borderRadius: 8,
    padding: 12,
    shadowColor: COLORS.cardShadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  compactContainer: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  detailedContainer: {
    padding: 16,
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.gradientStart,
    marginLeft: 6,
  },
  etaIcon: {
    marginLeft: 12,
  },
  etaText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  textContainer: {
    marginLeft: 12,
    flex: 1,
  },
  label: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  value: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
  },
});

export default DistanceIndicator;

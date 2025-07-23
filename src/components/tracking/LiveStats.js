// Live tracking statistics component
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Card } from '../common';
import { COLORS, TYPOGRAPHY } from '../../styles';
import { formatDistance, formatTime } from '../../utils/calculations';

const LiveStats = ({ 
  stats, 
  destination,
  style 
}) => {
  if (!stats) {
    return (
      <Card style={[styles.container, style]}>
        <Text style={styles.noDataText}>No tracking data available</Text>
      </Card>
    );
  }

  const StatItem = ({ icon, label, value, color = COLORS.textPrimary }) => (
    <View style={styles.statItem}>
      <Icon name={icon} size={20} color={color} />
      <View style={styles.statTextContainer}>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={[styles.statValue, { color }]}>{value}</Text>
      </View>
    </View>
  );

  return (
    <Card style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.title}>Journey to {destination.name}</Text>
        <View style={[
          styles.statusBadge,
          { backgroundColor: stats.isInGeofence ? COLORS.success : COLORS.gradientStart }
        ]}>
          <Text style={styles.statusText}>
            {stats.isInGeofence ? 'ARRIVED' : 'TRACKING'}
          </Text>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <StatItem
          icon="my-location"
          label="Distance to destination"
          value={formatDistance(stats.distanceToDestination)}
          color={stats.isInGeofence ? COLORS.success : COLORS.gradientStart}
        />
        
        <StatItem
          icon="schedule"
          label="Estimated arrival"
          value={formatTime(stats.eta)}
        />
        
        <StatItem
          icon="timeline"
          label="Total distance"
          value={formatDistance(stats.totalDistance)}
        />
        
        <StatItem
          icon="timer"
          label="Journey time"
          value={stats.journeyDurationFormatted}
        />
      </View>

      {stats.averageSpeed > 0 && (
        <View style={styles.speedContainer}>
          <Icon name="speed" size={16} color={COLORS.textSecondary} />
          <Text style={styles.speedText}>
            Average speed: {(stats.averageSpeed * 3.6).toFixed(1)} km/h
          </Text>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textLight,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 12,
  },
  statTextContainer: {
    marginLeft: 8,
    flex: 1,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  statValue: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
  speedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  speedText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  noDataText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    padding: 20,
  },
});

export default LiveStats;

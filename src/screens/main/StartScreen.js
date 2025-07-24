// Start screen - main landing page of the app
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { 
  GradientBackground, 
  GradientButton, 
  Card, 
  StatusIndicator 
} from '../../components/common';
import { COLORS, TYPOGRAPHY } from '../../styles';
import { JourneyService, LocationService } from '../../services';
import { formatDate } from '../../utils/formatters';

const StartScreen = ({ navigation }) => {
  const [stats, setStats] = useState({
    totalJourneys: 0,
    lastUsed: null,
    currentLocation: null,
  });
  const [locationStatus, setLocationStatus] = useState('offline');

  useEffect(() => {
    loadStats();
    checkLocationStatus();
  }, []);

  const loadStats = async () => {
    try {
      const journeyHistory = await JourneyService.getJourneyHistory();
      const lastJourney = journeyHistory[0];
      
      setStats({
        totalJourneys: journeyHistory.length,
        lastUsed: lastJourney ? lastJourney.startTime : null,
        currentLocation: LocationService.getLastKnownLocation(),
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const checkLocationStatus = async () => {
    try {
      const location = await LocationService.getCurrentLocation();
      if (location) {
        setLocationStatus(LocationService.getAccuracyStatus());
      } else {
        setLocationStatus('offline');
      }
    } catch (error) {
      setLocationStatus('offline');
    }
  };

  const handleStartNewJourney = () => {
    navigation.navigate('DestinationSearch');
  };

  const handleViewHistory = () => {
    navigation.navigate('History');
  };

  const handleSettings = () => {
    navigation.navigate('Settings');
  };

  const QuickStats = () => (
    <Card style={styles.statsCard}>
      <Text style={styles.statsTitle}>Quick Stats</Text>
      
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Icon name="timeline" size={24} color={COLORS.gradientStart} />
          <View style={styles.statText}>
            <Text style={styles.statValue}>{stats.totalJourneys}</Text>
            <Text style={styles.statLabel}>Total Journeys</Text>
          </View>
        </View>
        
        <View style={styles.statItem}>
          <Icon name="schedule" size={24} color={COLORS.success} />
          <View style={styles.statText}>
            <Text style={styles.statValue}>
              {stats.lastUsed ? formatDate(stats.lastUsed) : 'Never'}
            </Text>
            <Text style={styles.statLabel}>Last Used</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.statusRow}>
        <StatusIndicator
          type="gps"
          status={locationStatus}
          size="medium"
        />
        <StatusIndicator
          type="tracking"
          status={JourneyService.isJourneyActive() ? 'active' : 'offline'}
          size="medium"
        />
      </View>
    </Card>
  );

  return (
    <GradientBackground style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.appTitle}>Wake Me Go</Text>
            <Text style={styles.subtitle}>Never miss your destination again</Text>
          </View>
          
          <View style={styles.headerActions}>
            <Icon 
              name="settings" 
              size={28} 
              color={COLORS.textLight} 
              onPress={handleSettings}
              style={styles.settingsIcon}
            />
          </View>
        </View>

        <View style={styles.content}>
          <QuickStats />
          
          <View style={styles.actionSection}>
            <GradientButton
              title="Start New Journey"
              onPress={handleStartNewJourney}
              style={styles.primaryButton}
            />
            
            <GradientButton
              title="View Previous Destinations"
              onPress={handleViewHistory}
              variant="secondary"
              style={styles.secondaryButton}
            />
          </View>

          {/* Quick Actions */}
          <Card style={styles.quickActionsCard}>
            <Text style={styles.quickActionsTitle}>Quick Actions</Text>
            
            <View style={styles.quickActionsGrid}>
              <View style={styles.quickAction}>
                <Icon name="my-location" size={32} color={COLORS.gradientStart} />
                <Text style={styles.quickActionText}>Current Location</Text>
              </View>
              
              <View style={styles.quickAction}>
                <Icon name="history" size={32} color={COLORS.success} />
                <Text style={styles.quickActionText}>Recent Places</Text>
              </View>
              
              <View style={styles.quickAction}>
                <Icon name="help" size={32} color={COLORS.warning} />
                <Text style={styles.quickActionText}>Help</Text>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 30,
  },
  titleContainer: {
    flex: 1,
  },
  appTitle: {
    fontSize: TYPOGRAPHY.fontSize.xxxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsIcon: {
    padding: 8,
  },
  content: {
    paddingHorizontal: 20,
  },
  statsCard: {
    marginBottom: 24,
  },
  statsTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statText: {
    marginLeft: 12,
  },
  statValue: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  actionSection: {
    marginBottom: 24,
  },
  primaryButton: {
    marginBottom: 12,
  },
  secondaryButton: {
    marginBottom: 12,
  },
  quickActionsCard: {
    marginBottom: 24,
  },
  quickActionsTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quickAction: {
    alignItems: 'center',
    flex: 1,
  },
  quickActionText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default StartScreen;

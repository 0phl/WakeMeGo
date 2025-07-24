// Welcome screen with app introduction
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { GradientBackground, GradientButton, Card } from '../../components/common';
import { COLORS, TYPOGRAPHY } from '../../styles';

const WelcomeScreen = ({ navigation }) => {
  const features = [
    {
      icon: 'my-location',
      title: 'Real-time Tracking',
      description: 'Track your location in real-time with high accuracy GPS'
    },
    {
      icon: 'notifications-active',
      title: 'Smart Alarms',
      description: 'Get notified when you reach your destination, even while sleeping'
    },
    {
      icon: 'offline-pin',
      title: 'Works Offline',
      description: 'No internet required - all data stored locally on your device'
    },
    {
      icon: 'battery-saver',
      title: 'Battery Optimized',
      description: 'Intelligent tracking that preserves your battery life'
    }
  ];

  const handleGetStarted = () => {
    navigation.navigate('Tutorial');
  };

  return (
    <GradientBackground style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to</Text>
          <Text style={styles.appName}>Wake Me Go</Text>
          <Text style={styles.subtitle}>
            Your intelligent travel companion that ensures you never miss your destination
          </Text>
        </View>

        <View style={styles.featuresContainer}>
          {features.map((feature, index) => (
            <Card key={index} style={styles.featureCard}>
              <View style={styles.featureContent}>
                <View style={styles.iconContainer}>
                  <Icon 
                    name={feature.icon} 
                    size={32} 
                    color={COLORS.gradientStart} 
                  />
                </View>
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </View>
              </View>
            </Card>
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <GradientButton
            title="Get Started"
            onPress={handleGetStarted}
            style={styles.getStartedButton}
          />
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
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 60,
    paddingBottom: 40,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.regular,
    color: COLORS.textLight,
    marginBottom: 8,
  },
  appName: {
    fontSize: TYPOGRAPHY.fontSize.xxxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textLight,
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.regular,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
  },
  featuresContainer: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  featureCard: {
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  featureContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 126, 179, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  buttonContainer: {
    paddingHorizontal: 32,
    paddingBottom: 20,
  },
  getStartedButton: {
    marginTop: 20,
  },
});

export default WelcomeScreen;

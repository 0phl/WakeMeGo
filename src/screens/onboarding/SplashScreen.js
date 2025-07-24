// Splash screen with app logo and pink gradient
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { GradientBackground } from '../../components/common';
import { TYPOGRAPHY } from '../../styles';
import { APP_CONFIG } from '../../utils/constants';

const SplashScreen = ({ navigation }) => {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate to welcome screen after delay
    const timer = setTimeout(() => {
      navigation.replace('Welcome');
    }, APP_CONFIG.ui.splashScreenDuration);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <GradientBackground style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.logoContainer}>
          <Text style={styles.appTitle}>Wake Me Go</Text>
          <Text style={styles.tagline}>Never miss your destination again</Text>
        </View>
      </Animated.View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    alignItems: 'center',
  },
  appTitle: {
    ...TYPOGRAPHY.appTitle,
    marginBottom: 16,
    textAlign: 'center',
  },
  tagline: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.regular,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 28,
  },
});

export default SplashScreen;

// Tutorial screen with permission flows and app usage guide
import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Dimensions,
  TouchableOpacity 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { GradientBackground, GradientButton, Card } from '../../components/common';
import { COLORS, TYPOGRAPHY } from '../../styles';
import { requestAllPermissions } from '../../utils/permissions';

const { width } = Dimensions.get('window');

const TutorialScreen = ({ navigation, onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const scrollViewRef = useRef(null);

  const slides = [
    {
      icon: 'search',
      title: 'Search Your Destination',
      description: 'Search for any location or select from your recent destinations. You can also tap on the map to set a custom location.',
      color: COLORS.gradientStart,
    },
    {
      icon: 'place',
      title: 'Set Your Geofence',
      description: 'Adjust the radius around your destination. When you enter this area, the app will wake you up with an alarm.',
      color: COLORS.success,
    },
    {
      icon: 'my-location',
      title: 'Track Your Journey',
      description: 'The app tracks your location in real-time and shows your progress. Works even when your phone is locked.',
      color: COLORS.warning,
    },
    {
      icon: 'notifications-active',
      title: 'Get Alerted',
      description: 'Receive notifications and alarms when you reach your destination. Never miss your stop again!',
      color: COLORS.error,
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      const nextSlide = currentSlide + 1;
      setCurrentSlide(nextSlide);
      scrollViewRef.current?.scrollTo({
        x: nextSlide * width,
        animated: true,
      });
    } else {
      handleRequestPermissions();
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      const prevSlide = currentSlide - 1;
      setCurrentSlide(prevSlide);
      scrollViewRef.current?.scrollTo({
        x: prevSlide * width,
        animated: true,
      });
    }
  };

  const handleRequestPermissions = async () => {
    try {
      const granted = await requestAllPermissions();
      setPermissionsGranted(granted);
      
      if (granted) {
        // Navigate to main app
        onComplete();
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const renderSlide = (slide, index) => (
    <View key={index} style={styles.slide}>
      <View style={styles.slideContent}>
        <View style={[styles.iconContainer, { backgroundColor: `${slide.color}20` }]}>
          <Icon name={slide.icon} size={64} color={slide.color} />
        </View>
        
        <Text style={styles.slideTitle}>{slide.title}</Text>
        <Text style={styles.slideDescription}>{slide.description}</Text>
      </View>
    </View>
  );

  const renderPermissionSlide = () => (
    <View style={styles.slide}>
      <View style={styles.slideContent}>
        <View style={[styles.iconContainer, { backgroundColor: `${COLORS.gradientStart}20` }]}>
          <Icon name="security" size={64} color={COLORS.gradientStart} />
        </View>
        
        <Text style={styles.slideTitle}>Permissions Required</Text>
        <Text style={styles.slideDescription}>
          To provide the best experience, Wake Me Go needs access to:
        </Text>
        
        <View style={styles.permissionsList}>
          <View style={styles.permissionItem}>
            <Icon name="location-on" size={24} color={COLORS.success} />
            <Text style={styles.permissionText}>Location (for tracking your journey)</Text>
          </View>
          <View style={styles.permissionItem}>
            <Icon name="notifications" size={24} color={COLORS.success} />
            <Text style={styles.permissionText}>Notifications (for destination alerts)</Text>
          </View>
        </View>
        
        {permissionsGranted && (
          <Card style={styles.successCard}>
            <View style={styles.successContent}>
              <Icon name="check-circle" size={24} color={COLORS.success} />
              <Text style={styles.successText}>Permissions granted! You're all set.</Text>
            </View>
          </Card>
        )}
      </View>
    </View>
  );

  const isLastSlide = currentSlide === slides.length;

  return (
    <GradientBackground style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        style={styles.scrollView}
      >
        {slides.map(renderSlide)}
        {renderPermissionSlide()}
      </ScrollView>

      {/* Pagination dots */}
      <View style={styles.pagination}>
        {[...slides, {}].map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentSlide === index && styles.activeDot,
            ]}
          />
        ))}
      </View>

      {/* Navigation buttons */}
      <View style={styles.navigation}>
        {currentSlide > 0 && (
          <TouchableOpacity onPress={handlePrevious} style={styles.navButton}>
            <Icon name="arrow-back" size={24} color={COLORS.textLight} />
          </TouchableOpacity>
        )}
        
        <View style={styles.spacer} />
        
        <GradientButton
          title={isLastSlide ? (permissionsGranted ? 'Get Started' : 'Grant Permissions') : 'Next'}
          onPress={isLastSlide && permissionsGranted ? onComplete : handleNext}
          style={styles.nextButton}
        />
      </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  skipButton: {
    padding: 8,
  },
  skipText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textLight,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  slideContent: {
    alignItems: 'center',
    maxWidth: 300,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  slideTitle: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: 16,
  },
  slideDescription: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
  },
  permissionsList: {
    marginTop: 24,
    marginBottom: 24,
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
  },
  permissionText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textLight,
    marginLeft: 12,
    flex: 1,
  },
  successCard: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderWidth: 1,
    borderColor: COLORS.success,
  },
  successContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  successText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.success,
    marginLeft: 8,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: COLORS.textLight,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  navigation: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingBottom: 40,
  },
  navButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spacer: {
    flex: 1,
  },
  nextButton: {
    minWidth: 120,
  },
});

export default TutorialScreen;

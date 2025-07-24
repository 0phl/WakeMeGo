// Root app navigator
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OnboardingNavigator from './OnboardingNavigator';
import MainNavigator from './MainNavigator';
import { LoadingSpinner } from '../components/common';
import { checkPermissions } from '../utils/permissions';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(true);

  useEffect(() => {
    checkAppState();
  }, []);

  const checkAppState = async () => {
    try {
      // Check if user has completed onboarding
      const hasCompletedOnboarding = await AsyncStorage.getItem('hasCompletedOnboarding');
      
      // Check permissions
      const permissions = await checkPermissions();
      
      // Show onboarding if not completed or permissions not granted
      const shouldShowOnboarding = !hasCompletedOnboarding || !permissions.allGranted;
      
      setShowOnboarding(shouldShowOnboarding);
    } catch (error) {
      console.error('Error checking app state:', error);
      // Default to showing onboarding on error
      setShowOnboarding(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnboardingComplete = async () => {
    try {
      await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
      setShowOnboarding(false);
    } catch (error) {
      console.error('Error saving onboarding completion:', error);
    }
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading..." overlay={true} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
        }}
      >
        {showOnboarding ? (
          <Stack.Screen name="Onboarding">
            {(props) => (
              <OnboardingNavigator 
                {...props} 
                onComplete={handleOnboardingComplete}
              />
            )}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="MainApp" component={MainNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

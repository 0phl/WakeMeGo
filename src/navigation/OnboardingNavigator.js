// Onboarding navigation stack
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { 
  SplashScreen, 
  WelcomeScreen, 
  TutorialScreen 
} from '../screens/onboarding';

const Stack = createStackNavigator();

const OnboardingNavigator = ({ onComplete }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}
    >
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{
          animationTypeForReplace: 'push',
        }}
      />
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{
          animationTypeForReplace: 'push',
        }}
      />
      <Stack.Screen name="Tutorial">
        {(props) => <TutorialScreen {...props} onComplete={onComplete} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default OnboardingNavigator;

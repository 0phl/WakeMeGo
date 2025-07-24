// Main app navigation stack
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { 
  StartScreen,
  DestinationSearchScreen,
  MapSelectionScreen,
  GeofenceSetupScreen,
  LiveTrackingScreen,
  AlarmScreen
} from '../screens/main';

const Stack = createStackNavigator();

const MainNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
      }}
      initialRouteName="Start"
    >
      <Stack.Screen 
        name="Start" 
        component={StartScreen}
        options={{
          gestureEnabled: false,
        }}
      />
      
      <Stack.Screen 
        name="DestinationSearch" 
        component={DestinationSearchScreen}
        options={{
          animationTypeForReplace: 'push',
        }}
      />
      
      <Stack.Screen 
        name="MapSelection" 
        component={MapSelectionScreen}
        options={{
          animationTypeForReplace: 'push',
        }}
      />
      
      <Stack.Screen 
        name="GeofenceSetup" 
        component={GeofenceSetupScreen}
        options={{
          animationTypeForReplace: 'push',
        }}
      />
      
      <Stack.Screen 
        name="LiveTracking" 
        component={LiveTrackingScreen}
        options={{
          gestureEnabled: false,
          animationTypeForReplace: 'push',
        }}
      />
      
      <Stack.Screen 
        name="Alarm" 
        component={AlarmScreen}
        options={{
          gestureEnabled: false,
          animationTypeForReplace: 'push',
        }}
      />
    </Stack.Navigator>
  );
};

export default MainNavigator;

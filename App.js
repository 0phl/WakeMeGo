// WakeMeGo - Never miss your destination again
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { AppNavigator } from './src/navigation';
import { NotificationService } from './src/services';

export default function App() {
  useEffect(() => {
    // Initialize notification service
    NotificationService.initialize();

    return () => {
      // Cleanup on app unmount
      NotificationService.cleanup();
    };
  }, []);

  return (
    <>
      <StatusBar style="light" backgroundColor="#FF7EB3" />
      <AppNavigator />
    </>
  );
}

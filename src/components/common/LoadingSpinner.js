// Loading spinner component
import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../../styles';

const LoadingSpinner = ({ 
  size = 'large', 
  color = COLORS.gradientStart,
  text,
  style,
  overlay = false
}) => {
  const containerStyle = [
    styles.container,
    overlay && styles.overlay,
    style
  ];

  return (
    <View style={containerStyle}>
      <ActivityIndicator 
        size={size} 
        color={color} 
      />
      {text && (
        <Text style={styles.text}>
          {text}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.overlay,
    zIndex: 1000,
  },
  text: {
    marginTop: 12,
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default LoadingSpinner;

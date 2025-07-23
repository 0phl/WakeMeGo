// Gradient background component
import React from 'react';
import { StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { GRADIENTS } from '../../styles';

const GradientBackground = ({ 
  children, 
  style, 
  colors = GRADIENTS.primary,
  start = { x: 0, y: 0 },
  end = { x: 0, y: 1 }
}) => {
  return (
    <LinearGradient
      colors={colors}
      start={start}
      end={end}
      style={[styles.container, style]}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default GradientBackground;

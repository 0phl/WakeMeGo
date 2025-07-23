// Gradient button component
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { GRADIENTS, COLORS, TYPOGRAPHY } from '../../styles';

const GradientButton = ({ 
  title, 
  onPress, 
  style, 
  textStyle,
  disabled = false,
  loading = false,
  colors = GRADIENTS.primary,
  variant = 'primary' // 'primary', 'secondary', 'success', 'warning', 'error'
}) => {
  const getColors = () => {
    if (disabled) return GRADIENTS.disabled;
    
    switch (variant) {
      case 'success':
        return GRADIENTS.success;
      case 'warning':
        return GRADIENTS.warning;
      case 'error':
        return GRADIENTS.error;
      case 'secondary':
        return GRADIENTS.secondaryButton;
      default:
        return colors;
    }
  };

  const getTextColor = () => {
    if (variant === 'secondary') {
      return COLORS.textPrimary;
    }
    return COLORS.textLight;
  };

  return (
    <TouchableOpacity 
      onPress={onPress} 
      disabled={disabled || loading}
      style={[styles.container, style]}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={getColors()}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        {loading ? (
          <ActivityIndicator 
            color={getTextColor()} 
            size="small" 
          />
        ) : (
          <Text style={[
            styles.text, 
            { color: getTextColor() },
            textStyle
          ]}>
            {title}
          </Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    marginVertical: 8,
    shadowColor: COLORS.cardShadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gradient: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    ...TYPOGRAPHY.button,
    textAlign: 'center',
  },
});

export default GradientButton;

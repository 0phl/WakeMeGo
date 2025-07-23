// Card component for consistent styling
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../../styles';

const Card = ({ 
  children, 
  style, 
  onPress,
  disabled = false,
  elevation = 3,
  padding = 16,
  margin = 8,
  borderRadius = 12,
  backgroundColor = COLORS.backgroundWhite
}) => {
  const cardStyles = [
    styles.card,
    {
      padding,
      margin,
      borderRadius,
      backgroundColor,
      elevation,
      shadowOpacity: elevation * 0.05,
    },
    style
  ];

  if (onPress) {
    return (
      <TouchableOpacity 
        style={cardStyles}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.7}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyles}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: 12,
    shadowColor: COLORS.cardShadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default Card;

// Destination card component
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Card } from '../common';
import { COLORS, TYPOGRAPHY } from '../../styles';
import { formatAddress, formatDate } from '../../utils/formatters';

const DestinationCard = ({ 
  destination, 
  onPress,
  onDelete,
  showLastUsed = false,
  style 
}) => {
  const handlePress = () => {
    if (onPress) {
      onPress(destination);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(destination);
    }
  };

  return (
    <Card 
      style={[styles.container, style]}
      onPress={handlePress}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Icon 
            name="location-on" 
            size={24} 
            color={COLORS.gradientStart} 
          />
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.name} numberOfLines={1}>
            {destination.name}
          </Text>
          <Text style={styles.address} numberOfLines={2}>
            {formatAddress(destination.address)}
          </Text>
          
          {showLastUsed && destination.lastUsed && (
            <Text style={styles.lastUsed}>
              Last used: {formatDate(destination.lastUsed)}
            </Text>
          )}
          
          {destination.rating && (
            <View style={styles.ratingContainer}>
              <Icon 
                name="star" 
                size={16} 
                color={COLORS.warning} 
              />
              <Text style={styles.rating}>
                {destination.rating.toFixed(1)}
              </Text>
            </View>
          )}
        </View>
        
        {onDelete && (
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={handleDelete}
          >
            <Icon 
              name="close" 
              size={20} 
              color={COLORS.textSecondary} 
            />
          </TouchableOpacity>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  address: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  lastUsed: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  rating: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
});

export default DestinationCard;

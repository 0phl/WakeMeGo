// Draggable pin component for precise location selection
import React, { useState, useRef } from 'react';
import { View, StyleSheet, Animated, PanResponder } from 'react-native';
import { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../styles';

const DraggablePin = ({ 
  coordinate,
  onDragEnd,
  onDragStart,
  title = "Drag to adjust",
  description,
  size = 'large',
  color = COLORS.gradientStart
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const scaleAnimation = useRef(new Animated.Value(1)).current;
  const shadowAnimation = useRef(new Animated.Value(0)).current;

  const animatePress = () => {
    Animated.parallel([
      Animated.timing(scaleAnimation, {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(shadowAnimation, {
        toValue: 1,
        duration: 150,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const animateRelease = () => {
    Animated.parallel([
      Animated.timing(scaleAnimation, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(shadowAnimation, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handleDragStart = () => {
    setIsDragging(true);
    animatePress();
    if (onDragStart) {
      onDragStart();
    }
  };

  const handleDragEnd = (event) => {
    setIsDragging(false);
    animateRelease();
    if (onDragEnd) {
      onDragEnd(event);
    }
  };

  const getPinSize = () => {
    switch (size) {
      case 'small':
        return 20;
      case 'large':
        return 32;
      default:
        return 26;
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 12;
      case 'large':
        return 20;
      default:
        return 16;
    }
  };

  return (
    <Marker
      coordinate={coordinate}
      draggable={true}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      title={title}
      description={description}
      anchor={{ x: 0.5, y: 1 }}
    >
      <Animated.View
        style={[
          styles.pinContainer,
          {
            transform: [{ scale: scaleAnimation }],
          },
        ]}
      >
        <Animated.View
          style={[
            styles.pinHead,
            {
              width: getPinSize(),
              height: getPinSize(),
              borderRadius: getPinSize() / 2,
              backgroundColor: color,
              shadowOpacity: shadowAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0.2, 0.4],
              }),
              elevation: shadowAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [3, 8],
              }),
            },
          ]}
        >
          <Icon 
            name="place" 
            size={getIconSize()} 
            color={COLORS.backgroundWhite} 
          />
        </Animated.View>
        
        <View style={[
          styles.pinTail,
          {
            borderTopColor: color,
          }
        ]} />
        
        {isDragging && (
          <Animated.View 
            style={[
              styles.dragIndicator,
              {
                opacity: shadowAnimation,
              }
            ]} 
          />
        )}
      </Animated.View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  pinContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinHead: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.backgroundWhite,
    shadowColor: COLORS.cardShadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  pinTail: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: -3,
  },
  dragIndicator: {
    position: 'absolute',
    bottom: -20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 126, 179, 0.2)',
    borderWidth: 2,
    borderColor: COLORS.gradientStart,
  },
});

export default DraggablePin;

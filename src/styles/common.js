// Common styles for WakeMeGo app
import { StyleSheet } from 'react-native';
import { COLORS } from './colors';
import { TYPOGRAPHY } from './typography';

export const COMMON_STYLES = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundWhite,
  },
  
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundWhite,
  },
  
  // Card styles
  card: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: COLORS.cardShadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  // Button styles
  gradientButton: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginVertical: 8,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  secondaryButton: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginVertical: 8,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundGray,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  
  buttonText: {
    ...TYPOGRAPHY.button,
  },
  
  secondaryButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.textPrimary,
  },
  
  // Input styles
  input: {
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: COLORS.backgroundWhite,
    marginVertical: 8,
  },
  
  // Text styles
  title: TYPOGRAPHY.heading1,
  subtitle: TYPOGRAPHY.heading2,
  body: TYPOGRAPHY.body,
  caption: TYPOGRAPHY.caption,
  
  // Layout styles
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  spaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  // Spacing
  padding: {
    padding: 16,
  },
  
  paddingHorizontal: {
    paddingHorizontal: 16,
  },
  
  paddingVertical: {
    paddingVertical: 16,
  },
  
  margin: {
    margin: 16,
  },
  
  marginHorizontal: {
    marginHorizontal: 16,
  },
  
  marginVertical: {
    marginVertical: 16,
  },
  
  // Map styles
  mapContainer: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    margin: 16,
  },
  
  map: {
    flex: 1,
  },
});

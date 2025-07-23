// Gradient definitions for WakeMeGo app
import { COLORS } from './colors';

export const GRADIENTS = {
  primary: [COLORS.gradientStart, COLORS.gradientEnd],
  disabled: ['#CCCCCC', '#BBBBBB'],
  success: ['#4CAF50', '#45A049'],
  warning: ['#FF9800', '#F57C00'],
  error: ['#F44336', '#D32F2F'],
  
  // Background gradients
  screenBackground: [COLORS.gradientStart, COLORS.gradientEnd],
  cardBackground: [COLORS.backgroundWhite, COLORS.backgroundGray],
  
  // Button gradients
  primaryButton: [COLORS.gradientStart, COLORS.gradientEnd],
  secondaryButton: [COLORS.backgroundGray, COLORS.backgroundWhite],
};

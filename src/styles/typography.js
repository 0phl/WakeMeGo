// Typography styles for WakeMeGo app
import { COLORS } from './colors';

export const TYPOGRAPHY = {
  // Font sizes
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    display: 48,
  },
  
  // Font weights
  fontWeight: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  
  // Text styles
  heading1: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.textPrimary,
    lineHeight: 40,
  },
  
  heading2: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.textPrimary,
    lineHeight: 32,
  },
  
  heading3: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.textPrimary,
    lineHeight: 28,
  },
  
  body: {
    fontSize: 16,
    fontWeight: '400',
    color: COLORS.textPrimary,
    lineHeight: 24,
  },
  
  bodySmall: {
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  
  caption: {
    fontSize: 12,
    fontWeight: '400',
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  
  button: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textLight,
    textAlign: 'center',
  },
  
  appTitle: {
    fontSize: 48,
    fontWeight: '700',
    color: COLORS.textLight,
    textAlign: 'center',
  },
};

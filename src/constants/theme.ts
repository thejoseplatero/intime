// Enhanced theme with best-in-class UX colors
export const theme = {
  colors: {
    // Primary - Calming, intentional (Headspace-inspired)
    primary: '#8B7BE8', // Soft purple
    primaryLight: '#B8A9F5',
    primaryDark: '#6B5CCC',
    
    // Accent - Energy when needed (Duolingo-inspired)
    accent: '#FF9F80', // Warm coral
    accentLight: '#FFB5A0',
    accentDark: '#FF7A5A',
    
    // Success - Encouraging (Duolingo)
    success: '#58CC6C',
    successLight: '#7FE896',
    
    // Warning
    warning: '#FFCB3B',
    
    // Error - Not harsh (Headspace)
    error: '#FF8B8B',
    
    // Neutral - Clean (Airbnb)
    background: '#FAFAFA',
    backgroundElevated: '#FFFFFF',
    surface: '#FFFFFF',
    
    // Text - Clear hierarchy (Airbnb)
    text: '#2C2C2C',
    textSecondary: '#666666',
    textTertiary: '#9E9E9E',
    textInverse: '#FFFFFF',
    
    // Borders - Subtle (Headspace)
    border: '#E8E8E8',
    borderLight: '#F0F0F0',
    divider: '#F5F5F5',
    
    // Shadows - Soft (Headspace)
    shadow: 'rgba(0, 0, 0, 0.04)',
    shadowLight: 'rgba(0, 0, 0, 0.02)',
    
    // Gradient colors for special moments
    gradientStart: '#8B7BE8',
    gradientEnd: '#FF9F80',
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  typography: {
    h1: {
      fontSize: 40,
      fontWeight: '700' as const,
      lineHeight: 48,
      letterSpacing: -0.5,
    },
    h2: {
      fontSize: 32,
      fontWeight: '600' as const,
      lineHeight: 40,
      letterSpacing: -0.5,
    },
    h3: {
      fontSize: 28,
      fontWeight: '600' as const,
      lineHeight: 36,
      letterSpacing: -0.3,
    },
    body: {
      fontSize: 17,
      fontWeight: '400' as const,
      lineHeight: 26,
    },
    bodyLarge: {
      fontSize: 18,
      fontWeight: '500' as const,
      lineHeight: 28,
    },
    bodySmall: {
      fontSize: 15,
      fontWeight: '400' as const,
      lineHeight: 22,
    },
    caption: {
      fontSize: 13,
      fontWeight: '400' as const,
      lineHeight: 20,
    },
    button: {
      fontSize: 17,
      fontWeight: '600' as const,
      letterSpacing: 0.3,
    },
  },
  
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 999,
  },
  
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 4,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 2,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 16,
      elevation: 4,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 24,
      elevation: 8,
    },
  },
};


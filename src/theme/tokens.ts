export const tokens = {
  space: {
    2: 2,
    4: 4,
    6: 6,
    8: 8,
    12: 12,
    16: 16,
    20: 20,
    24: 24,
    32: 32,
    40: 40,
    64: 64,
  },
  
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 999,
  },
  
  motion: {
    fast: 120,
    base: 200,
    slow: 320,
  },
  
  color: {
    bg: {
      default: '#FFFFFF',
      surface: '#FAFAFA',
      elevated: '#FFFFFF',
    },
    fg: {
      primary: '#0E1116',
      secondary: 'rgba(14,17,22,0.7)',
      tertiary: 'rgba(14,17,22,0.5)',
    },
    brand: {
      500: '#3B82F6',
      600: '#2563EB',
      700: '#1D4ED8',
    },
    state: {
      success: '#16A34A',
      warning: '#D97706',
      danger: '#DC2626',
    },
    line: {
      soft: 'rgba(0,0,0,0.12)',
      medium: 'rgba(0,0,0,0.16)',
    },
  },
  
  type: {
    h1: {
      fontSize: 28,
      lineHeight: 36,
      fontWeight: '600' as const,
    },
    h2: {
      fontSize: 22,
      lineHeight: 28,
      fontWeight: '600' as const,
    },
    h3: {
      fontSize: 18,
      lineHeight: 24,
      fontWeight: '600' as const,
    },
    body: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '400' as const,
    },
    body2: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '400' as const,
    },
    caption: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '500' as const,
    },
  },
};

export const shadows = {
  elev1: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    shadowOpacity: 0.08,
    elevation: 1,
  },
  elev2: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    shadowOpacity: 0.10,
    elevation: 2,
  },
  elev3: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 24,
    shadowOpacity: 0.12,
    elevation: 3,
  },
};


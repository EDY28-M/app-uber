const colors = {
  primary: '#3B82F6', // Blue
  secondary: '#8B5CF6', // Purple
  success: '#10B981', // Green
  warning: '#F59E0B', // Yellow
  danger: '#EF4444', // Red
  error: '#EF4444', // Red
  info: '#06B6D4', // Cyan
  
  background: '#F9FAFB',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  
  text: '#111827',
  textSecondary: '#6B7280',
  textDisabled: '#9CA3AF',
  textInverse: '#FFFFFF',
  
  border: '#E5E7EB',
  borderMedium: '#D1D5DB',
  borderDark: '#9CA3AF',
  
  gradient: {
    primary: ['#3B82F6', '#8B5CF6'],
    success: ['#10B981', '#059669'],
    warning: ['#F59E0B', '#D97706']
  }
};

const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48
};

const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 999
};

const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32
};

const fontWeight = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const
};

export const theme = {
  colors,
  spacing,
  borderRadius,
  fontSize,
  fontWeight,
};

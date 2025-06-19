import { Dimensions, PixelRatio, Platform } from 'react-native';

// Get screen dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions (iPhone 14 Pro as reference - 393x852)
const BASE_WIDTH = 393;
const BASE_HEIGHT = 852;

// Device type detection
export const getDeviceType = () => {
  if (SCREEN_WIDTH < 768) return 'phone';
  if (SCREEN_WIDTH < 1024) return 'tablet';
  return 'desktop';
};

// Screen size categories
export const isSmallPhone = () => SCREEN_WIDTH < 375;
export const isMediumPhone = () => SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414;
export const isLargePhone = () => SCREEN_WIDTH >= 414 && SCREEN_WIDTH < 768;
export const isTablet = () => SCREEN_WIDTH >= 768;

// Responsive width calculation
export const wp = (percentage: number): number => {
  const value = (percentage * SCREEN_WIDTH) / 100;
  return Math.round(PixelRatio.roundToNearestPixel(value));
};

// Responsive height calculation
export const hp = (percentage: number): number => {
  const value = (percentage * SCREEN_HEIGHT) / 100;
  return Math.round(PixelRatio.roundToNearestPixel(value));
};

// Responsive font size
export const rf = (size: number): number => {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  const newSize = size * scale;
  
  // Apply platform-specific adjustments
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }
  
  // Android needs slightly different scaling
  return Math.round(PixelRatio.roundToNearestPixel(newSize * 0.95));
};

// Responsive spacing
export const rs = (size: number): number => {
  const scale = Math.min(SCREEN_WIDTH / BASE_WIDTH, SCREEN_HEIGHT / BASE_HEIGHT);
  return Math.round(PixelRatio.roundToNearestPixel(size * scale));
};

// Icon size scaling
export const ri = (size: number): number => {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  let scaledSize = size * scale;
  
  // Ensure minimum and maximum icon sizes
  if (scaledSize < size * 0.8) scaledSize = size * 0.8;
  if (scaledSize > size * 1.3) scaledSize = size * 1.3;
  
  return Math.round(PixelRatio.roundToNearestPixel(scaledSize));
};

// Responsive dimensions for specific use cases
export const getResponsiveDimensions = () => {
  const deviceType = getDeviceType();
  
  return {
    // Feed card dimensions
    feedCard: {
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT - rs(180),
    },
    
    // App bar
    appBar: {
      height: rs(44),
      paddingHorizontal: rs(20),
    },
    
    // Tab bar
    tabBar: {
      height: rs(80),
      paddingBottom: rs(20),
      paddingTop: rs(10),
    },
    
    // Profile picture sizes
    profilePicture: {
      small: rs(32),
      medium: rs(40),
      large: rs(80),
    },
    
    // Button sizes
    button: {
      small: { width: rs(32), height: rs(32) },
      medium: { width: rs(40), height: rs(40) },
      large: { width: rs(56), height: rs(56) },
    },
    
    // Media grid
    mediaGrid: {
      itemWidth: SCREEN_WIDTH / 3,
      aspectRatio: 4/5,
      padding: rs(1),
    },
    
    // Create FAB
    fab: {
      size: rs(56),
      borderRadius: rs(28),
      elevation: deviceType === 'phone' ? 8 : 12,
    },
    
    // Modal and overlay
    modal: {
      borderRadius: rs(16),
      padding: rs(16),
    },
    
    // Input fields
    input: {
      height: rs(48),
      borderRadius: rs(12),
      paddingHorizontal: rs(16),
    },
  };
};

// Typography scale
export const getTypographyScale = () => {
  return {
    // Headings
    h1: rf(32),
    h2: rf(24),
    h3: rf(20),
    h4: rf(18),
    h5: rf(16),
    h6: rf(14),
    
    // Body text
    body: rf(16),
    bodySmall: rf(14),
    
    // UI text
    button: rf(16),
    caption: rf(12),
    overline: rf(10),
    
    // App specific
    appTitle: rf(18),
    userName: rf(16),
    location: rf(13),
    timestamp: rf(12),
    counter: rf(12),
  };
};

// Spacing scale
export const getSpacingScale = () => {
  return {
    xs: rs(4),
    sm: rs(8),
    md: rs(16),
    lg: rs(24),
    xl: rs(32),
    xxl: rs(48),
  };
};

// Border radius scale
export const getBorderRadiusScale = () => {
  return {
    xs: rs(4),
    sm: rs(8),
    md: rs(12),
    lg: rs(16),
    xl: rs(20),
    xxl: rs(28),
    round: rs(999),
  };
};

// Safe area adjustments
export const getSafeAreaAdjustments = () => {
  const deviceType = getDeviceType();
  
  return {
    top: Platform.OS === 'ios' ? (deviceType === 'phone' ? rs(44) : rs(24)) : rs(24),
    bottom: Platform.OS === 'ios' ? rs(34) : rs(16),
    horizontal: rs(16),
  };
};

// Export screen dimensions
export const RESPONSIVE_SCREEN = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  isSmallPhone: isSmallPhone(),
  isMediumPhone: isMediumPhone(),
  isLargePhone: isLargePhone(),
  isTablet: isTablet(),
  deviceType: getDeviceType(),
};

// Export all utilities
export default {
  wp,
  hp,
  rf,
  rs,
  ri,
  getResponsiveDimensions,
  getTypographyScale,
  getSpacingScale,
  getBorderRadiusScale,
  getSafeAreaAdjustments,
  RESPONSIVE_SCREEN,
}; 
import { Dimensions, PixelRatio, Platform } from 'react-native';

// Get screen dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions (iPhone 14 Pro as reference - 393x852)
const BASE_WIDTH = 393;
const BASE_HEIGHT = 852;

// Enhanced device type detection with more granular categories
export const getDeviceType = () => {
  if (SCREEN_WIDTH < 480) return 'small-phone';    // iPhone SE, small phones
  if (SCREEN_WIDTH < 768) return 'phone';          // Regular phones
  if (SCREEN_WIDTH < 1024) return 'tablet';        // iPads, tablets
  if (SCREEN_WIDTH < 1440) return 'desktop';       // Laptop screens
  return 'large-desktop';                          // Large monitors
};

// Enhanced screen size categories
export const isSmallPhone = () => SCREEN_WIDTH < 375;
export const isMediumPhone = () => SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414;
export const isLargePhone = () => SCREEN_WIDTH >= 414 && SCREEN_WIDTH < 480;
export const isXLPhone = () => SCREEN_WIDTH >= 480 && SCREEN_WIDTH < 768;
export const isTablet = () => SCREEN_WIDTH >= 768 && SCREEN_WIDTH < 1024;
export const isDesktop = () => SCREEN_WIDTH >= 1024;

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

// Enhanced responsive dimensions for specific use cases
export const getResponsiveDimensions = () => {
  const deviceType = getDeviceType();
  
  // Base multipliers for different device types
  const deviceMultiplier = {
    'small-phone': 0.9,
    'phone': 1.0,
    'tablet': 1.2,
    'desktop': 1.4,
    'large-desktop': 1.6
  }[deviceType] || 1.0;

  return {
    // Feed card dimensions - Exact immersive screen calculation
    feedCard: {
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT - rs(70), // Exact: status bar top to bottom nav top (rs(70) = tabBar height)
    },
    
    // App bar
    appBar: {
      height: rs(44),
      paddingHorizontal: rs(20),
    },
    
    // Tab bar - Slightly bigger with icons at the edge
    tabBar: {
      height: rs(70), // Increased slightly from rs(60) to rs(70)
      paddingBottom: rs(16), // Increased from rs(12) to rs(16)
      paddingTop: rs(2), // Reduced from rs(6) to rs(2) - icons closer to edge
    },
    
    // Profile picture sizes
    profilePicture: {
      small: rs(32),
      medium: rs(40),
      large: rs(80),
      xlarge: rs(120), // Added for tablets/desktop
    },
    
    // Button sizes
    button: {
      small: { width: rs(32), height: rs(32) },
      medium: { width: rs(40), height: rs(40) },
      large: { width: rs(56), height: rs(56) },
      xlarge: { width: rs(72), height: rs(72) }, // Added for tablets
    },
    
    // Media grid
    mediaGrid: {
      itemWidth: SCREEN_WIDTH / (deviceType === 'tablet' || deviceType === 'desktop' ? 4 : 3),
      aspectRatio: 4/5,
      padding: rs(1),
    },
    
    // Create post images (responsive heights)
    createPost: {
      singleImage: { height: rs(192) },
      doubleImage: { height: rs(192) },
      mainImage: { height: rs(160) },
      secondaryImage: { height: rs(96) },
      placeholder: { height: rs(128) },
    },
    
    // Settings items
    settings: {
      iconSize: rs(24),
      iconContainer: { width: rs(24), height: rs(24) },
      itemPadding: rs(20),
      arrowSize: rs(16),
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
      maxWidth: deviceType === 'tablet' || deviceType === 'desktop' ? wp(80) : wp(100),
    },
    
    // Input fields
    input: {
      height: rs(48),
      borderRadius: rs(12),
      paddingHorizontal: rs(16),
    },
    
    // Post content areas
    postContent: {
      textInput: { height: rs(100) },
      imageGrid: {
        gap: rs(8),
        borderRadius: rs(16),
        smallRadius: rs(12),
      },
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
    appTitle: rf(20),
    userName: rf(16),
    location: rf(13),
    timestamp: rf(12),
    counter: rf(12),
  };
};

// PERFECT TEXT STYLES SYSTEM - Based on DetailPostView standard
export const getTextStyles = () => {
  return {
    // Primary text styles
    userName: {
      fontSize: rf(14),
      fontWeight: '600' as const,
      fontFamily: 'System',
    },
    
    // Secondary text styles  
    secondary: {
      fontSize: rf(12),
      fontWeight: '400' as const,
      fontFamily: 'System',
    },
    
    // Menu and navigation items
    menuItem: {
      fontSize: rf(14),
      fontWeight: '400' as const,
      fontFamily: 'System',
    },
    
    // Tab labels
    tabLabel: {
      fontSize: rf(14),
      fontWeight: '400' as const,
      fontFamily: 'System',
    },
    
    // Input labels and hints
    inputLabel: {
      fontSize: rf(14),
      fontWeight: '400' as const,
      fontFamily: 'System',
    },
    
    // Notification text - FIXED: 1 size smaller
    notificationTitle: {
      fontSize: rf(13),
      fontWeight: '400' as const,
      fontFamily: 'System',
    },
    
    notificationSubtitle: {
      fontSize: rf(11),
      fontWeight: '400' as const,
      fontFamily: 'System',
    },
    
    // Settings text - FIXED: Smaller title
    settingsTitle: {
      fontSize: rf(16),
      fontWeight: '600' as const,
      fontFamily: 'System',
    },
    
    settingsItem: {
      fontSize: rf(14),
      fontWeight: '400' as const,
      fontFamily: 'System',
    },
    
    settingsSubtitle: {
      fontSize: rf(12),
      fontWeight: '400' as const,
      fontFamily: 'System',
    },
    
    // Create post text
    createLabel: {
      fontSize: rf(14),
      fontWeight: '400' as const,
      fontFamily: 'System',
    },
    
    // Library text - 1 size bigger to match Settings exactly
    libraryTitle: {
      fontSize: rf(17),
      fontWeight: '600' as const,
      fontFamily: 'System',
    },
    
    // Forum post text
    forumAuthor: {
      fontSize: rf(13),
      fontWeight: '600' as const,
      fontFamily: 'System',
    },
    
    forumContent: {
      fontSize: rf(13),
      fontWeight: '400' as const,
      fontFamily: 'System',
    },
    
    forumMeta: {
      fontSize: rf(12),
      fontWeight: '400' as const,
      fontFamily: 'System',
    },
    
    // Button text
    buttonText: {
      fontSize: rf(14),
      fontWeight: '600' as const,
      fontFamily: 'System',
    },
    
    // Caption text
    caption: {
      fontSize: rf(11),
      fontWeight: '400' as const,
      fontFamily: 'System',
    },
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

// Enhanced safe area adjustments with device-specific values
export const getSafeAreaAdjustments = () => {
  const deviceType = getDeviceType();
  
  return {
    top: Platform.OS === 'ios' ? 
      (deviceType === 'phone' || deviceType === 'small-phone' ? rs(44) : rs(24)) : 
      rs(24),
    bottom: Platform.OS === 'ios' ? 
      (deviceType === 'phone' || deviceType === 'small-phone' ? rs(34) : rs(16)) : 
      rs(16),
    horizontal: rs(16),
  };
};

// Exact immersive screen dimensions - from top edge of status bar to top edge of bottom nav
export const getImmersiveScreenDimensions = () => {
  const safeArea = getSafeAreaAdjustments();
  const responsiveDims = getResponsiveDimensions();
  
  return {
    // Full screen width
    width: SCREEN_WIDTH,
    
    // Exact height: Full screen minus bottom nav bar height
    // This gives us from status bar top edge to bottom nav top edge
    height: SCREEN_HEIGHT - responsiveDims.tabBar.height,
    
    // Safe area offsets for overlay positioning
    statusBarHeight: safeArea.top,
    bottomNavHeight: responsiveDims.tabBar.height,
    
    // Calculated overlay positions
    topOverlayPosition: safeArea.top + rs(10), // Status bar + small margin
    bottomOverlayPosition: responsiveDims.tabBar.height + rs(20), // Above bottom nav + margin
  };
};

// Enhanced screen dimensions export
export const RESPONSIVE_SCREEN = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  isSmallPhone: isSmallPhone(),
  isMediumPhone: isMediumPhone(),
  isLargePhone: isLargePhone(),
  isXLPhone: isXLPhone(),
  isTablet: isTablet(),
  isDesktop: isDesktop(),
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

// Component-specific responsive dimensions
export const getComponentDimensions = () => {
  const deviceType = getDeviceType();
  
  return {
    // Header components
    header: {
      height: rs(60),
      backButtonSize: rs(40),
      titleFontSize: rf(24),
      paddingHorizontal: rs(24),
    },
    
    // Navigation components
    tabBar: {
      height: rs(80),
      iconSize: ri(24),
      labelFontSize: rf(12),
      paddingTop: rs(10),
      paddingBottom: rs(20),
    },
    
    // List items
    listItem: {
      height: rs(56),
      paddingHorizontal: rs(16),
      iconSize: ri(20),
      fontSize: rf(16),
      subtitleFontSize: rf(14),
    },
    
    // Cards
    card: {
      borderRadius: rs(16),
      padding: rs(16),
      marginBottom: rs(16),
      shadowRadius: rs(8),
    },
    
    // Form elements
    form: {
      inputHeight: rs(48),
      inputPadding: rs(16),
      inputBorderRadius: rs(12),
      buttonHeight: rs(48),
      buttonBorderRadius: rs(12),
      labelFontSize: rf(14),
    },
  };
};

// Layout helpers for common patterns
export const getLayoutHelpers = () => {
  return {
    // Consistent spacing
    containerPadding: rs(24),
    sectionSpacing: rs(32),
    itemSpacing: rs(16),
    smallSpacing: rs(8),
    
    // Grid layouts
    gridGap: rs(8),
    gridItemMinWidth: rs(150),
    
    // Modal/overlay
    modalPadding: rs(20),
    modalBorderRadius: rs(20),
    overlayOpacity: 0.5,
  };
};

// Responsive grid system
export const getGridColumns = () => {
  const deviceType = getDeviceType();
  
  switch (deviceType) {
    case 'small-phone':
      return { default: 2, media: 2 };
    case 'phone':
      return { default: 3, media: 3 };
    case 'tablet':
      return { default: 4, media: 4 };
    case 'desktop':
      return { default: 5, media: 5 };
    case 'large-desktop':
      return { default: 6, media: 6 };
    default:
      return { default: 3, media: 3 };
  }
};

// Responsive breakpoint utilities
export const useResponsiveValue = <T>(values: {
  'small-phone'?: T;
  phone?: T;
  tablet?: T;
  desktop?: T;
  'large-desktop'?: T;
  default: T;
}): T => {
  const deviceType = getDeviceType();
  return values[deviceType] || values.default;
};

// CENTRALIZED USERNAME FORMATTING - Backend Ready & Scalable
export const formatUsername = (username: string | null | undefined): string => {
  if (!username) return '@username';
  
  // Remove any existing @ symbols to avoid duplicates
  const cleanUsername = username.replace(/^@+/, '');
  
  // Always ensure username starts with @
  return `@${cleanUsername}`;
}; 
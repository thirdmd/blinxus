import { ActivityKey } from '../../constants/activityTags';
import { SubLocation, Country, Continent } from '../../constants/placesData';

// Pod Tab Types
export type PodTabType = 'Forum' | 'Highlights' | 'Explore' | 'Q&A' | 'Market' | 'Events' | 'Activities' | 'Lost';
export const allPodTabs: PodTabType[] = ['Forum', 'Highlights', 'Explore', 'Q&A', 'Market', 'Events', 'Activities', 'Lost'];

// Navigation state for Pods screens
export interface PodsNavigationState {
  currentScreen: 'continent-list' | 'country-view' | 'location-view';
  selectedContinent: Continent | null;
  selectedCountry: Country | null;
  selectedLocation: SubLocation | null;
  activeTab: PodTabType;
  searchQuery: string;
  isSearchMode: boolean;
}

// UI Layout Configurations
export interface PodLayoutConfig {
  headerHeight: number;
  tabBarHeight: number;
  cardBorderRadius: number;
  pillBorderRadius: number;
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  breakpoints: {
    mobile: number;
    tablet: number;
  };
}

// Theme Configuration for Pods
export interface PodThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    backgroundSecondary: string;
    surface: string;
    border: string;
    text: string;
    textSecondary: string;
    accent: string;
    success: string;
    warning: string;
    error: string;
  };
  typography: {
    title: {
      fontSize: number;
      fontWeight: string;
      lineHeight: number;
    };
    subtitle: {
      fontSize: number;
      fontWeight: string;
      lineHeight: number;
    };
    body: {
      fontSize: number;
      fontWeight: string;
      lineHeight: number;
    };
    caption: {
      fontSize: number;
      fontWeight: string;
      lineHeight: number;
    };
  };
}

// Animation Configuration
export interface PodAnimationConfig {
  duration: {
    fast: number;
    normal: number;
    slow: number;
  };
  easing: {
    easeIn: string;
    easeOut: string;
    easeInOut: string;
  };
  transitions: {
    screenChange: number;
    tabSwitch: number;
    cardHover: number;
  };
}

// Header component props for different Pod screens
export interface PodHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  onSearch?: () => void;
  backgroundColor?: string;
  showSearchIcon?: boolean;
  breadcrumbs?: string[];
}

// Tab Bar component props
export interface PodTabBarProps {
  activeTab: PodTabType;
  onTabChange: (tab: PodTabType) => void;
  tabs: PodTabType[];
  backgroundColor?: string;
  activeColor?: string;
  inactiveColor?: string;
}

// Location Card component props
export interface LocationCardProps {
  location: SubLocation;
  onPress: (location: SubLocation) => void;
  showStats?: boolean;
  showActivities?: boolean;
  compact?: boolean;
  theme: PodThemeConfig;
}

// Country Card component props
export interface CountryCardProps {
  country: Country;
  onPress: (country: Country) => void;
  showPreview?: boolean;
  previewCount?: number;
  theme: PodThemeConfig;
}

// Search component props
export interface PodSearchProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSearch: (query: string) => void;
  placeholder?: string;
  backgroundColor?: string;
  borderColor?: string;
}

// Empty State component props
export interface PodEmptyStateProps {
  title: string;
  subtitle?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  theme: PodThemeConfig;
}

// Post Card component props for Pods
export interface PodPostCardProps {
  postId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  location: string;
  activityType: ActivityKey;
  timeAgo: string;
  likes: number;
  comments: number;
  onLike: () => void;
  onComment: () => void;
  onSave: () => void;
  onShare: () => void;
  theme: PodThemeConfig;
}

// Stats component props
export interface PodStatsProps {
  memberCount?: number;
  postCount?: number;
  activeUsers?: number;
  showLabels?: boolean;
  compact?: boolean;
  theme: PodThemeConfig;
}

// Activity Pills component props
export interface ActivityPillsProps {
  activities: ActivityKey[];
  selectedActivity?: ActivityKey;
  onActivitySelect?: (activity: ActivityKey) => void;
  maxVisible?: number;
  showAll?: boolean;
}

// Screen Layout Templates
export interface PodScreenLayout {
  hasHeader: boolean;
  hasTabBar: boolean;
  hasFloatingAction: boolean;
  scrollable: boolean;
  padding: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

// Main Pods screen component props
export interface PodsMainScreenProps {
  navigationState: PodsNavigationState;
  onNavigationChange: (state: Partial<PodsNavigationState>) => void;
  theme: PodThemeConfig;
  animationConfig: PodAnimationConfig;
}

// Screen-specific configurations
export const podScreenLayouts: Record<string, PodScreenLayout> = {
  'continent-list': {
    hasHeader: true,
    hasTabBar: false,
    hasFloatingAction: false,
    scrollable: true,
    padding: { top: 24, bottom: 24, left: 24, right: 24 },
  },
  'country-view': {
    hasHeader: true,
    hasTabBar: true,
    hasFloatingAction: false,
    scrollable: true,
    padding: { top: 16, bottom: 16, left: 16, right: 16 },
  },
  'location-view': {
    hasHeader: true,
    hasTabBar: true,
    hasFloatingAction: true,
    scrollable: true,
    padding: { top: 16, bottom: 16, left: 16, right: 16 },
  },
};

// Default configurations
export const defaultPodLayoutConfig: PodLayoutConfig = {
  headerHeight: 60,
  tabBarHeight: 48,
  cardBorderRadius: 16,
  pillBorderRadius: 20,
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  breakpoints: {
    mobile: 768,
    tablet: 1024,
  },
};

export const defaultPodAnimationConfig: PodAnimationConfig = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  easing: {
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
  transitions: {
    screenChange: 300,
    tabSwitch: 200,
    cardHover: 150,
  },
};

// Navigation helpers
export const createInitialPodsState = (): PodsNavigationState => ({
  currentScreen: 'continent-list',
  selectedContinent: null,
  selectedCountry: null,
  selectedLocation: null,
  activeTab: 'Forum',
  searchQuery: '',
  isSearchMode: false,
});

export const updatePodsNavigation = (
  currentState: PodsNavigationState,
  updates: Partial<PodsNavigationState>
): PodsNavigationState => ({
  ...currentState,
  ...updates,
});

// Type guards for navigation
export const isLocationScreen = (state: PodsNavigationState): boolean => {
  return state.currentScreen === 'location-view' && state.selectedLocation !== null;
};

export const isCountryScreen = (state: PodsNavigationState): boolean => {
  return state.currentScreen === 'country-view' && state.selectedCountry !== null;
};

export const isContinentScreen = (state: PodsNavigationState): boolean => {
  return state.currentScreen === 'continent-list';
};

// Utility functions for UI state management
export const getScreenTitle = (state: PodsNavigationState): string => {
  switch (state.currentScreen) {
    case 'continent-list':
      return 'Pods';
    case 'country-view':
      return state.selectedCountry?.name || 'Country';
    case 'location-view':
      return state.selectedLocation?.name || 'Location';
    default:
      return 'Pods';
  }
};

export const getBreadcrumbs = (state: PodsNavigationState): string[] => {
  const breadcrumbs: string[] = [];
  
  if (state.selectedContinent) {
    breadcrumbs.push(state.selectedContinent.name);
  }
  
  if (state.selectedCountry) {
    breadcrumbs.push(state.selectedCountry.name);
  }
  
  return breadcrumbs;
};

// Component factory functions
export const createLocationCard = (
  location: SubLocation,
  theme: PodThemeConfig,
  onPress: (location: SubLocation) => void
): LocationCardProps => ({
  location,
  onPress,
  showStats: true,
  showActivities: true,
  compact: false,
  theme,
});

export const createCountryCard = (
  country: Country,
  theme: PodThemeConfig,
  onPress: (country: Country) => void
): CountryCardProps => ({
  country,
  onPress,
  showPreview: true,
  previewCount: 4,
  theme,
});

 
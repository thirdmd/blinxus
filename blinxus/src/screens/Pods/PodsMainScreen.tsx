import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { SafeAreaView, StatusBar, View } from 'react-native';
import { useThemeColors } from '../../hooks/useThemeColors';
import { 
  PodsNavigationState,
  createInitialPodsState,
  PodTabType,
  defaultPodLayoutConfig,
  defaultPodAnimationConfig,
  PodThemeConfig
} from '../../types/structures/podsUIStructure';
import { PodsPostingService } from '../../utils/podsPostingLogic';
import { 
  philippinesData, 
  asiaData,
  SubLocation,
  Country
} from '../../constants/placesData';

// Import screen components
import ContinentListScreen from '../../screens/Pods/components/ContinentListScreen';
import CountryViewScreen from '../../screens/Pods/components/CountryViewScreen';
import LocationViewScreen from '../../screens/Pods/components/LocationViewScreen';

// Export interface for App.tsx ref
export interface PodsMainScreenRef {
  resetToTop: () => void;
}

const PodsMainScreen = forwardRef<PodsMainScreenRef>((props, ref) => {
  const themeColors = useThemeColors();
  const [navigationState, setNavigationState] = useState<PodsNavigationState>(createInitialPodsState());
  const [activeTab, setActiveTab] = useState<PodTabType>('Forum');
  
  // State persistence for ContinentListScreen
  const [continentListState, setContinentListState] = useState({
    activeContinent: 0,
    scrollPosition: 0,
  });

  // Reset key for triggering full screen reset
  const [resetKey, setResetKey] = useState(0);
  
  // Initialize posting service
  const postingService = PodsPostingService.getInstance();

  // Create theme config from current theme
  const podTheme: PodThemeConfig = {
    colors: {
      primary: '#0047AB',
      secondary: themeColors.backgroundSecondary,
      background: themeColors.background,
      backgroundSecondary: themeColors.backgroundSecondary,
      surface: themeColors.background,
      border: themeColors.border,
      text: themeColors.text,
      textSecondary: themeColors.textSecondary,
      accent: '#0047AB',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
    },
    typography: {
      title: { fontSize: 24, fontWeight: '600', lineHeight: 32 },
      subtitle: { fontSize: 18, fontWeight: '500', lineHeight: 24 },
      body: { fontSize: 16, fontWeight: '400', lineHeight: 22 },
      caption: { fontSize: 12, fontWeight: '400', lineHeight: 16 },
    },
  };

  // Navigation handlers
  const handleLocationPress = (location: SubLocation) => {
    setNavigationState(prev => ({
      ...prev,
      currentScreen: 'location-view',
      selectedLocation: location,
      selectedCountry: philippinesData,
      selectedContinent: asiaData,
    }));
    setActiveTab('Forum');
  };

  const handleCountryPress = (country: Country) => {
    setNavigationState(prev => ({
      ...prev,
      currentScreen: 'country-view',
      selectedCountry: country,
      selectedContinent: asiaData,
    }));
    setActiveTab('Forum');
  };

  const handleBackToMain = () => {
    setNavigationState(prev => ({
      ...prev,
      currentScreen: 'continent-list',
      selectedCountry: null,
      selectedLocation: null,
      selectedContinent: null,
      searchQuery: '',
      isSearchMode: false,
    }));
    setActiveTab('Forum');
    // Keep continent list state - user returns to their previous continent tab position
  };

  const handleBackToCountry = () => {
    setNavigationState(prev => ({
      ...prev,
      currentScreen: 'country-view',
      selectedLocation: null,
    }));
  };

  const handleTabChange = (tab: PodTabType) => {
    setActiveTab(tab);
  };

  // Handle continent tab changes from ContinentListScreen
  const handleContinentTabChange = (tabIndex: number) => {
    setContinentListState(prev => ({
      ...prev,
      activeContinent: tabIndex,
    }));
  };

  // Handle double-tap to reset to "For You" tab - trigger full screen reset
  const handleDoubleTabPress = () => {
    // Reset continent list state completely
    setContinentListState({
      activeContinent: 0,
      scrollPosition: 0,
    });
    
    // Increment reset key to trigger useEffect in ContinentListScreen
    setResetKey(prev => prev + 1);
  };

  // Expose reset function to parent via ref
  useImperativeHandle(ref, () => ({
    resetToTop: () => {
      // First navigate back to continent list if we're in other screens
      setNavigationState(createInitialPodsState());
      setActiveTab('Forum');
      
      // Then trigger the full reset
      handleDoubleTabPress();
    },
  }));

  // Render appropriate screen based on navigation state
  const renderCurrentScreen = () => {
    return (
      <>
        {/* Always render ContinentListScreen but hide it when not active */}
        <View style={{ 
          flex: 1, 
          display: navigationState.currentScreen === 'continent-list' ? 'flex' : 'none' 
        }}>
          <ContinentListScreen
            key="continent-list-persistent"
            theme={podTheme}
            onCountryPress={handleCountryPress}
            initialActiveContinent={continentListState.activeContinent}
            onTabChange={handleContinentTabChange}
            onDoubleTabPress={handleDoubleTabPress}
            resetKey={resetKey}
          />
        </View>

        {/* Render country view when active */}
        {navigationState.currentScreen === 'country-view' && navigationState.selectedCountry && (
          <CountryViewScreen
            country={navigationState.selectedCountry}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            onLocationPress={handleLocationPress}
            onBack={handleBackToMain}
            theme={podTheme}
          />
        )}

        {/* Render location view when active */}
        {navigationState.currentScreen === 'location-view' && navigationState.selectedLocation && navigationState.selectedCountry && (
          <LocationViewScreen
            location={navigationState.selectedLocation}
            country={navigationState.selectedCountry}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            onBack={handleBackToCountry}
            theme={podTheme}
          />
        )}
      </>
    );
  };

  return (
    <SafeAreaView style={{ 
      flex: 1, 
      backgroundColor: themeColors.background
    }}>
      <StatusBar 
        barStyle={themeColors.isDark ? "light-content" : "dark-content"} 
        backgroundColor={themeColors.background}
      />
      {renderCurrentScreen()}
    </SafeAreaView>
  );
});

export default PodsMainScreen; 
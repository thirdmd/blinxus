import React, { useState } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
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

const PodsMainScreen: React.FC = () => {
  const themeColors = useThemeColors();
  const [navigationState, setNavigationState] = useState<PodsNavigationState>(createInitialPodsState());
  const [activeTab, setActiveTab] = useState<PodTabType>('Highlights');
  
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
    setActiveTab('Highlights');
  };

  const handleCountryPress = (country: Country) => {
    setNavigationState(prev => ({
      ...prev,
      currentScreen: 'country-view',
      selectedCountry: country,
      selectedContinent: asiaData,
    }));
    setActiveTab('Highlights');
  };

  const handleBackToMain = () => {
    setNavigationState(createInitialPodsState());
    setActiveTab('Highlights');
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

  // Render appropriate screen based on navigation state
  const renderCurrentScreen = () => {
    switch (navigationState.currentScreen) {
      case 'continent-list':
        return (
          <ContinentListScreen
            theme={podTheme}
            onCountryPress={handleCountryPress}
          />
        );
      
      case 'country-view':
        if (!navigationState.selectedCountry) return null;
        return (
          <CountryViewScreen
            country={navigationState.selectedCountry}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            onLocationPress={handleLocationPress}
            onBack={handleBackToMain}
            theme={podTheme}
            postingService={postingService}
          />
        );
      
      case 'location-view':
        if (!navigationState.selectedLocation || !navigationState.selectedCountry) return null;
        return (
          <LocationViewScreen
            location={navigationState.selectedLocation}
            country={navigationState.selectedCountry}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            onBack={handleBackToCountry}
            theme={podTheme}
            postingService={postingService}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
      <StatusBar 
        barStyle={themeColors.isDark ? "light-content" : "dark-content"} 
        backgroundColor={themeColors.background} 
      />
      {renderCurrentScreen()}
    </SafeAreaView>
  );
};

export default PodsMainScreen; 
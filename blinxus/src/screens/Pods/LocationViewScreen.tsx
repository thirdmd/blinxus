import React, { useState, useRef, useCallback } from 'react';
import { View, Animated, StatusBar, SafeAreaView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useThemeColors } from '../../hooks/useThemeColors';
import CountryViewScreen from './components/CountryViewScreen';
import { PodTabType } from '../../types/structures/podsUIStructure';
import { Country } from '../../constants/placesData';
import { placesData, getLocationByName, getCountryByLocationId, resolveLocationForNavigation } from '../../constants/placesData';
import NavigationManager from '../../utils/navigationManager';

interface LocationViewScreenParams {
  location: string;
  fromScreen?: string;
  scrollPosition?: number;
}

/**
 * LocationViewScreen - A stack-navigable wrapper for location/pods navigation
 * Provides proper back navigation to the source screen (ImmersiveFeed, Explore, etc.)
 * Centralizes location navigation logic across the entire app
 */
const LocationViewScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const themeColors = useThemeColors();
  
  // Get navigation params
  const params = route.params as LocationViewScreenParams || {};
  const { location, fromScreen, scrollPosition } = params;
  
  // State for tab navigation, default to Forum
  const [activeTab, setActiveTab] = useState<PodTabType>('Forum');
  
  // Resolve location to get country data
  const resolvedLocation = resolveLocationForNavigation(location);
  const country = resolvedLocation?.country || placesData.find(continent => continent.name === 'Asia')?.countries.find((c: Country) => c.name === 'Philippines');
  
  // Theme configuration for pods
  const podTheme = {
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
  
  // Handle back navigation
  const handleBack = useCallback(() => {
    NavigationManager.goBack({
      navigation: navigation as any,
      previousScreen: fromScreen,
      scrollPosition,
      scrollRef: undefined
    });
  }, [navigation, fromScreen, scrollPosition]);
  
  // Handle location press within the country view
  const handleLocationPress = useCallback((subLocation: any) => {
    // For now, just log - can be extended to navigate to specific location
    console.log('Location pressed within LocationView:', subLocation.name);
  }, []);
  
  // Handle tab change
  const handleTabChange = useCallback((tab: PodTabType) => {
    setActiveTab(tab);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
      <StatusBar 
        barStyle={themeColors.isDark ? "light-content" : "dark-content"} 
        backgroundColor={themeColors.background}
        translucent={false}
      />
      
      <View style={{ flex: 1 }}>
        <CountryViewScreen
          country={country as Country}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onLocationPress={handleLocationPress}
          onBack={handleBack}
          theme={podTheme}
          navigation={navigation as any}
          navigationContext={{
            targetLocationFilter: location,
            autoSelectLocationTab: true
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default LocationViewScreen; 
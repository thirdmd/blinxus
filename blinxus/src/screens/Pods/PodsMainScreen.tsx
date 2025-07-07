import React, { useState, useRef, forwardRef, useImperativeHandle, useCallback, useMemo, useEffect } from 'react';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { SafeAreaView, StatusBar, View, ScrollView, Animated, Dimensions, Platform } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');
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
import { ANIMATION_DURATIONS } from '../../utils/animations';
import { 
  philippinesData, 
  asiaData,
  placesData,
  SubLocation,
  Country
} from '../../constants/placesData';

// Import screen components
import ContinentListScreen, { ContinentListScreenRef } from '../../screens/Pods/components/ContinentListScreen';
import CountryViewScreen, { CountryViewScreenRef } from '../../screens/Pods/components/CountryViewScreen';
import LocationViewScreen from '../../screens/Pods/components/LocationViewScreen';

// Export interface for App.tsx ref
export interface PodsMainScreenRef {
  resetToTop: () => void;
  scrollToTop: () => void;
}

const PodsMainScreen = forwardRef<PodsMainScreenRef>((props, ref) => {
  const themeColors = useThemeColors();
  const route = useRoute();
  const navigation = useNavigation();
  const [navigationState, setNavigationState] = useState<PodsNavigationState>(createInitialPodsState());
  const [activeTab, setActiveTab] = useState<PodTabType>('Forum');
  
  // State persistence for ContinentListScreen
  const [continentListState, setContinentListState] = useState({
    activeContinent: 0,
    scrollPosition: 0,
  });

  // Reset key for triggering full screen reset
  const [resetKey, setResetKey] = useState(0);
  
  // Scroll key for smooth re-render
  const [scrollKey, setScrollKey] = useState(0);
  
  // Ref for CountryViewScreen to enable scroll to top
  const countryScreenRef = useRef<CountryViewScreenRef>(null);
  
  // Ref for ContinentListScreen to enable scroll to top
  const continentScreenRef = useRef<ContinentListScreenRef>(null);
  
  // RADICAL APPROACH: Single animation container with translateX only
  const containerTranslateX = useRef(new Animated.Value(0)).current;
  
  // Initialize posting service
  const postingService = PodsPostingService.getInstance();

  // Handle navigation parameters from location clicks
  useEffect(() => {
    const params = route.params as any;
    
    if (params?.autoNavigateToCountry && params?.initialCountry) {
      // Find the target country
      const targetCountry = placesData
        .flatMap(continent => continent.countries)
        .find(country => country.id === params.initialCountry);
      
      if (targetCountry) {
        // Set up the navigation state with target location info
        setNavigationState(prev => ({
          ...prev,
          currentScreen: 'country-view',
          selectedCountry: targetCountry,
          selectedContinent: asiaData, // Default to Asia, could be improved
          // Add navigation context for location selection
          navigationContext: {
            targetLocationFilter: params.targetLocationFilter,
            autoSelectLocationTab: params.autoSelectLocationTab
          }
        }));
        
        // Animate to country view
        setTimeout(() => {
          Animated.timing(containerTranslateX, {
            toValue: -screenWidth,
            duration: ANIMATION_DURATIONS.lightning,
            useNativeDriver: true,
          }).start();
        }, 100);
        
        // Set active tab from navigation params or default to Forum
        const initialTab = params.initialTab || 'Forum';
        setActiveTab(initialTab);
        
        // Clear the navigation context after a delay to prevent affecting future navigations
        setTimeout(() => {
          setNavigationState(prev => ({
            ...prev,
            navigationContext: undefined
          }));
        }, 1000);
      }
    }
  }, [route.params, containerTranslateX]);

  // ULTRA-RESPONSIVE: Memoized theme config
  const podTheme: PodThemeConfig = useMemo(() => ({
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
  }), [themeColors]);

  // ULTRA-RESPONSIVE: Memoized navigation handlers
  const handleLocationPress = useCallback((location: SubLocation) => {
    setNavigationState(prev => ({
      ...prev,
      currentScreen: 'location-view',
      selectedLocation: location,
      selectedCountry: philippinesData,
      selectedContinent: asiaData,
    }));
    setActiveTab('Forum');
  }, []);

  const handleCountryPress = useCallback((country: Country) => {
    // INSTANT: Lightning-fast page transition - entire page moves as one unit
    Animated.timing(containerTranslateX, {
      toValue: -screenWidth,
      duration: ANIMATION_DURATIONS.lightning, // 120ms for instant feel
      useNativeDriver: true,
    }).start();
    
    setNavigationState(prev => ({
      ...prev,
      currentScreen: 'country-view',
      selectedCountry: country,
      selectedContinent: asiaData,
    }));
    setActiveTab('Forum');
  }, [containerTranslateX]);

  const handleBackToMain = useCallback(() => {
    // INSTANT: Lightning-fast page transition back
    Animated.timing(containerTranslateX, {
      toValue: 0,
      duration: ANIMATION_DURATIONS.lightning, // 120ms for instant feel
      useNativeDriver: true,
    }).start();
    
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
  }, [containerTranslateX]);

  const handleBackToCountry = useCallback(() => {
    setNavigationState(prev => ({
      ...prev,
      currentScreen: 'country-view',
      selectedLocation: null,
    }));
  }, []);

  const handleTabChange = useCallback((tab: PodTabType) => {
    setActiveTab(tab);
  }, []);

  // Handle continent tab changes from ContinentListScreen
  const handleContinentTabChange = useCallback((tabIndex: number) => {
    setContinentListState(prev => ({
      ...prev,
      activeContinent: tabIndex,
    }));
  }, []);

  // Handle double-tap to reset to "For You" tab - trigger full screen reset
  const handleDoubleTabPress = useCallback(() => {
    // Reset continent list state completely
    setContinentListState({
      activeContinent: 0,
      scrollPosition: 0,
    });
    
    // Increment reset key to trigger useEffect in ContinentListScreen
    setResetKey(prev => prev + 1);
  }, []);

  // ULTRA-RESPONSIVE: Memoized scroll functions
  const resetToTop = useCallback(() => {
    // First navigate back to continent list if we're in other screens
    setNavigationState(createInitialPodsState());
    setActiveTab('Forum');
    
    // Reset animation to initial position
    containerTranslateX.setValue(0);
    
    // Then trigger the full reset
    handleDoubleTabPress();
  }, [handleDoubleTabPress, containerTranslateX]);

  const scrollToTop = useCallback(() => {
    // ULTRA-RESPONSIVE: Optimized scroll behavior
    if (navigationState.currentScreen === 'country-view' && countryScreenRef.current) {
      countryScreenRef.current.scrollToTop();
    } else if (navigationState.currentScreen === 'continent-list' && continentScreenRef.current) {
      // NEW: Scroll to top of current continent section
      continentScreenRef.current.scrollToTop();
    } else {
      // For other screens, still use key-based re-render as fallback
      setScrollKey(prev => prev + 0.01);
    }
  }, [navigationState.currentScreen]);

  // Expose reset function to parent via ref
  useImperativeHandle(ref, () => ({
    resetToTop,
    scrollToTop,
  }), [resetToTop, scrollToTop]);

  // RADICAL APPROACH: Single container with side-by-side screens
  const renderCurrentScreen = useCallback(() => {
    return (
      <View style={{ flex: 1, overflow: 'hidden' }}>
        <Animated.View style={{ 
          flexDirection: 'row',
          width: screenWidth * 2, // Double width to fit both screens
          height: '100%',
          transform: [{ translateX: containerTranslateX }],
        }}>
          {/* ContinentListScreen - always rendered at position 0 */}
          <View style={{ width: screenWidth, height: '100%' }}>
            <ContinentListScreen
              ref={continentScreenRef}
              key="continent-list-persistent"
              theme={podTheme}
              onCountryPress={handleCountryPress}
              initialActiveContinent={continentListState.activeContinent}
              onTabChange={handleContinentTabChange}
              onDoubleTabPress={handleDoubleTabPress}
              resetKey={resetKey}
            />
          </View>

          {/* CountryViewScreen - always rendered at position screenWidth */}
          <View style={{ width: screenWidth, height: '100%' }}>
            {navigationState.selectedCountry ? (
              <CountryViewScreen
                ref={countryScreenRef}
                country={navigationState.selectedCountry}
                activeTab={activeTab}
                onTabChange={handleTabChange}
                onLocationPress={handleLocationPress}
                onBack={handleBackToMain}
                theme={podTheme}
                navigation={navigation as any}
                navigationContext={navigationState.navigationContext}
              />
            ) : (
              <View style={{ flex: 1, backgroundColor: themeColors.background }} />
            )}
          </View>
        </Animated.View>

        {/* Render location view as overlay when active */}
        {navigationState.currentScreen === 'location-view' && navigationState.selectedLocation && navigationState.selectedCountry && (
          <View style={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: themeColors.background,
          }}>
            <LocationViewScreen
              key={`location-${scrollKey}`}
              location={navigationState.selectedLocation}
              country={navigationState.selectedCountry}
              activeTab={activeTab}
              onTabChange={handleTabChange}
              onBack={handleBackToCountry}
              theme={podTheme}
            />
          </View>
        )}
      </View>
    );
  }, [
    navigationState,
    podTheme,
    handleCountryPress,
    continentListState.activeContinent,
    handleContinentTabChange,
    handleDoubleTabPress,
    resetKey,
    activeTab,
    handleTabChange,
    handleLocationPress,
    handleBackToMain,
    scrollKey,
    handleBackToCountry,
    containerTranslateX,
    themeColors.background,
    navigation
  ]);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle(themeColors.isDark ? "light-content" : "dark-content");
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(themeColors.background);
        StatusBar.setTranslucent(false);
      }
    }, [themeColors.isDark, themeColors.background])
  );

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

PodsMainScreen.displayName = 'PodsMainScreen';

export default PodsMainScreen; 
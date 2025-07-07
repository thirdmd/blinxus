import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle, useCallback } from 'react';
import { View, Animated, Dimensions, StatusBar, Platform } from 'react-native';
import ProfileStructure from '../../types/structures/profile_structure';
import { profileData } from '../../types/userData/profile_data';
import { usePosts } from '../../store/PostsContext';
import ProfileSettings from '../Settings/profile_settings';
import { useScrollContext } from '../../contexts/ScrollContext';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import { useThemeColors } from '../../hooks/useThemeColors';
import { createSettingsSlideInAnimation, createSettingsSlideOutAnimation } from '../../utils/animations';
import useFullscreenManager from '../../hooks/useFullscreenManager';

const { width } = Dimensions.get('window');

export interface ProfileScreenRef {
  resetToTop: () => void;
  scrollToTop: () => void; // New function for actual scroll reset
}

const ProfileScreen = forwardRef<ProfileScreenRef>((props, ref) => {
  const [showSettings, setShowSettings] = useState(false);
  const { posts } = usePosts();
  const { profileScrollRef } = useScrollContext();
  const navigation = useNavigation();
  const route = useRoute();
  const themeColors = useThemeColors();
  
  // Get fullscreen manager to check if we're in fullscreen mode
  const fullscreenManager = useFullscreenManager();
  
  // Animation values for smooth Settings transition
  const settingsSlideAnim = useRef(new Animated.Value(width)).current; // Start off-screen right
  const backgroundSlideAnim = useRef(new Animated.Value(0)).current; // For parallax effect
  
  // Get route params to detect navigation source
  const routeParams = route.params as { fromFeed?: boolean; previousScreen?: string } | undefined;
  
  // Create a ref to hold the reset function from ProfileStructure
  const profileStructureResetRef = useRef<(() => void) | null>(null);
  
  // Create a ref to hold the scroll to top function from ProfileStructure
  const profileStructureScrollToTopRef = useRef<(() => void) | null>(null);
  
  // Track if this is a fresh navigation (from post click)
  const isNavigatingFromPost = useRef(false);
  
  // Ultra-smooth Settings open animation with parallax
  const openSettings = () => {
    setShowSettings(true);
    createSettingsSlideInAnimation(settingsSlideAnim, backgroundSlideAnim).start();
  };

  // Ultra-smooth Settings close animation with parallax
  const closeSettings = () => {
    createSettingsSlideOutAnimation(settingsSlideAnim, backgroundSlideAnim).start(() => {
      setShowSettings(false);
    });
  };
  
  // RADICAL FIX: Modified to preserve scroll position - only close settings, never reset scroll
  const resetToTop = () => {
    // Close settings with animation if open
    if (showSettings) {
      closeSettings();
    } else {
      setShowSettings(false);
    }
    
    // Reset animation state for settings
    settingsSlideAnim.setValue(width);
    backgroundSlideAnim.setValue(0);
    
    // Call ProfileStructure's reset function (which now preserves scroll position)
    if (profileStructureResetRef.current) {
      profileStructureResetRef.current();
    }
    
    // REMOVED: All scroll position resets to preserve user's scroll position
  };

  // NEW: Function that actually scrolls to top (for profile icon tap when already on profile)
  const scrollToTop = () => {
    // Close settings if open
    if (showSettings) {
      closeSettings();
    } else {
      setShowSettings(false);
    }
    
    // Reset animation state
    settingsSlideAnim.setValue(width);
    backgroundSlideAnim.setValue(0);
    
    // Call ProfileStructure's scroll to top function if available
    if (profileStructureScrollToTopRef.current) {
      profileStructureScrollToTopRef.current();
    } else {
      // Fallback: scroll manually
      if (profileScrollRef?.current) {
        profileScrollRef.current.scrollTo({ y: 0, animated: true });
      }
    }
  };

  // Expose both functions to parent via ref
  useImperativeHandle(ref, () => ({
    resetToTop,
    scrollToTop
  }));

  // RADICAL FIX: Completely disable auto-reset to always preserve scroll position
  useFocusEffect(
    React.useCallback(() => {
      // NEVER auto-reset scroll position - always preserve it
      // Only reset animation state for settings
      settingsSlideAnim.setValue(width);
      backgroundSlideAnim.setValue(0);
      setShowSettings(false);
    }, [])
  );

  // Update status bar style based on theme when this screen is focused
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle(themeColors.isDark ? "light-content" : "dark-content");
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(themeColors.background);
        StatusBar.setTranslucent(false);
      }
    }, [themeColors.isDark, themeColors.background])
  );

  // Clear feed params when navigating away from Profile
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      // Clear route params when leaving Profile screen
      if (routeParams?.fromFeed) {
        (navigation as any).setParams({ 
          fromFeed: false, 
          previousScreen: undefined
        });
      }
    });

    return unsubscribe;
  }, [navigation, routeParams?.fromFeed]);

  // Debug logging
      // Profile data loaded

  return (
    <View style={{ flex: 1 }}>
      <StatusBar
        barStyle={themeColors.isDark ? "light-content" : "dark-content"}
        backgroundColor={themeColors.background}
        translucent={false}
      />
      <Animated.View 
        style={{ 
          flex: 1,
          transform: [{ translateX: backgroundSlideAnim }]
        }}
      >
        <ProfileStructure
          profileData={profileData}
          posts={posts}
          onSettingsPress={openSettings}
          scrollRef={profileScrollRef}
          onResetToTop={profileStructureResetRef}
          onScrollToTop={profileStructureScrollToTopRef}
          fromFeed={routeParams?.fromFeed}
          previousScreen={routeParams?.previousScreen}
        />
      </Animated.View>
      
      {/* Settings Overlay - Slides in from right */}
      {showSettings && (
        <Animated.View 
          style={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            transform: [{ translateX: settingsSlideAnim }],
            backgroundColor: themeColors.background,
            zIndex: 1000,
          }}
        >
          <ProfileSettings onBackPress={closeSettings} />
        </Animated.View>
      )}
    </View>
  );
});

export default ProfileScreen; 
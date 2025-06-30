import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { View, Animated, Dimensions } from 'react-native';
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
  
  // Create a reset function that can be called externally
  const resetToTop = () => {
    // Close settings with animation if open
    if (showSettings) {
      closeSettings();
    } else {
      setShowSettings(false);
    }
    
    // Reset animation state
    settingsSlideAnim.setValue(width);
    backgroundSlideAnim.setValue(0);
    
    // Call ProfileStructure's reset function if available
    if (profileStructureResetRef.current) {
      profileStructureResetRef.current();
    } else {
      // Fallback: reset scroll manually
      setTimeout(() => {
        if (profileScrollRef?.current) {
          profileScrollRef.current.scrollTo({ y: 0, animated: true });
        }
      }, 100);
    }
  };

  // Expose reset function to parent via ref
  useImperativeHandle(ref, () => ({
    resetToTop
  }));

  // Auto-reset to top when navigating to Profile from post
  useFocusEffect(
    React.useCallback(() => {
      // Don't reset if:
      // 1. Coming from feed (preserve feed navigation behavior)
      // 2. Fullscreen manager is active (preserve fullscreen state)
      // 3. Coming back from LucidFullscreen (preserve the current state)
      if (!routeParams?.fromFeed && !fullscreenManager.isFullscreen) {
        resetToTop();
      } else {
        // Reset animation state when coming from feed or when fullscreen is active
        settingsSlideAnim.setValue(width);
        backgroundSlideAnim.setValue(0);
        setShowSettings(false);
      }
    }, [routeParams?.fromFeed, fullscreenManager.isFullscreen])
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
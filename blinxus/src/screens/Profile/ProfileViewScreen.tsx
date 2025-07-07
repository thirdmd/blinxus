import React, { useState, useRef, useCallback } from 'react';
import { View, Animated, Dimensions, StatusBar, Platform } from 'react-native';
import ProfileStructure from '../../types/structures/profile_structure';
import { profileData } from '../../types/userData/profile_data';
import { usePosts } from '../../store/PostsContext';
import ProfileSettings from '../Settings/profile_settings';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useThemeColors } from '../../hooks/useThemeColors';
import { createSettingsSlideInAnimation, createSettingsSlideOutAnimation } from '../../utils/animations';
import NavigationManager from '../../utils/navigationManager';

const { width } = Dimensions.get('window');

interface ProfileViewScreenParams {
  userId?: string;
  username?: string;
  fromFeed?: boolean;
  previousScreen?: string;
  scrollPosition?: number;
}

/**
 * ProfileViewScreen - A stack-navigable version of ProfileScreen
 * Used when navigating to profile from other screens (not tab navigation)
 * Ensures proper back navigation flow
 */
const ProfileViewScreen: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false);
  const { posts } = usePosts();
  const navigation = useNavigation();
  const route = useRoute<any>();
  const themeColors = useThemeColors();
  
  // Get navigation params
  const params = route.params as ProfileViewScreenParams || {};
  const { userId, username, fromFeed, previousScreen, scrollPosition } = params;
  
  // Animation values for settings
  const settingsSlideAnim = useRef(new Animated.Value(width)).current;
  const backgroundSlideAnim = useRef(new Animated.Value(0)).current;
  
  // Profile scroll ref
  const profileScrollRef = useRef<any>(null);
  
  // For now, we always show the current user's profile
  // TODO: In the future, support showing other users' profiles based on userId/username
  const isCurrentUser = !userId || username === 'Third Camacho';
  
  // Settings handlers
  const openSettings = () => {
    setShowSettings(true);
    createSettingsSlideInAnimation(settingsSlideAnim, backgroundSlideAnim).start();
  };

  const closeSettings = () => {
    createSettingsSlideOutAnimation(settingsSlideAnim, backgroundSlideAnim).start(() => {
      setShowSettings(false);
    });
  };
  
  // Handle back navigation
  const handleBack = () => {
    NavigationManager.goBack({
      navigation: navigation as any,
      previousScreen,
      scrollPosition,
      scrollRef: undefined // Scroll restoration will be handled by the previous screen
    });
  };

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
    <View style={{ flex: 1, backgroundColor: themeColors.background }}>
      <StatusBar 
        barStyle={themeColors.isDark ? "light-content" : "dark-content"} 
        backgroundColor={themeColors.background}
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
          fromFeed={true} // Always show back button for stack navigation
          previousScreen={previousScreen}
        />
      </Animated.View>
      
      {/* Settings Overlay */}
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
};

export default ProfileViewScreen; 
// src/types/structures/profile_structure.tsx

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  NativeSyntheticEvent,
  NativeScrollEvent,
  FlatList,
  Animated,
} from 'react-native';

import { ProfileDataType } from '../userData/profile_data';
import { Post } from '../userData/posts_data';
import { mapPostToCardProps } from './posts_structure';
import TravelFeedCard from '../../components/TravelFeedCard';
import MediaGridItem from '../../components/MediaGridItem';
import LucidAlbumView from '../../components/LucidAlbumView';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Plus, Settings, Bookmark, ChevronLeft, Album } from 'lucide-react-native';
import Library from '../../screens/Profile/Library';
import { useThemeColors } from '../../hooks/useThemeColors';
import { useFullscreenTheme } from '../../hooks/useFullscreenTheme';
import { useFullscreen } from '../../contexts/FullscreenContext';
import { getResponsiveDimensions, getTypographyScale, getSpacingScale, ri, rs, rf, RESPONSIVE_SCREEN, formatUsername } from '../../utils/responsive';
import { 
  createAnimationValues, 
  FEED_ANIMATIONS, 
  runAnimation,
  ANIMATION_DURATIONS,
  createLibrarySlideInAnimation,
  createLibrarySlideOutAnimation
} from '../../utils/animations';

const { width, height: screenHeight } = RESPONSIVE_SCREEN;
const responsiveDimensions = getResponsiveDimensions();
const typography = getTypographyScale();
const spacing = getSpacingScale();

interface Props {
  profileData: ProfileDataType;
  posts: Post[];
  onSettingsPress: () => void;
  scrollRef?: React.RefObject<ScrollView | null>;
  onResetToTop?: React.MutableRefObject<(() => void) | null>;
  fromFeed?: boolean;
  previousScreen?: string;
}

export default function ProfileStructure({
  profileData,
  posts,
  onSettingsPress,
  scrollRef,
  onResetToTop,
  fromFeed,
  previousScreen,
}: Props) {
  const navigation = useNavigation();
  const route = useRoute();
  const { isFullscreen, setIsFullscreen } = useFullscreen();
  const themeColors = useFullscreenTheme(isFullscreen);
  const [selectedPostIndex, setSelectedPostIndex] = useState(0);
  const [showLibrary, setShowLibrary] = useState(false);
  const localScrollViewRef = useRef<ScrollView>(null);
  
  // NEW: State for lucid album view
  const [showLucidAlbum, setShowLucidAlbum] = useState(false);
  const [selectedLucidPost, setSelectedLucidPost] = useState<any>(null);
  
  // NEW: Animation values for Instagram-like transitions
  const animationValues = useRef(createAnimationValues()).current;
  
  // Animation values for smooth Library transition
  const librarySlideAnim = useRef(new Animated.Value(width)).current; // Start off-screen right
  const backgroundSlideAnim = useRef(new Animated.Value(0)).current; // For parallax effect
  // Use the scrollRef from props (for double tap functionality) or fallback to local ref
  const scrollViewRef = scrollRef || localScrollViewRef;
  
  // Enhanced scroll position tracking like ExploreScreen
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollPositionRef = useRef(0); // Use ref for immediate access
  
  // App bar state management
  const [scrollY, setScrollY] = useState(0);
  const [appBarOpacity, setAppBarOpacity] = useState(1);
  const [appBarBlur, setAppBarBlur] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);
  
  // Ultra-smooth Library open animation with parallax
  const openLibrary = () => {
    setShowLibrary(true);
    createLibrarySlideInAnimation(librarySlideAnim, backgroundSlideAnim).start();
  };

  // Ultra-smooth Library close animation with parallax
  const closeLibrary = () => {
    createLibrarySlideOutAnimation(librarySlideAnim, backgroundSlideAnim).start(() => {
      setShowLibrary(false);
    });
  };

  // NEW: Handle lucid press - show lucid album view within same screen context
  const handleLucidPress = (post: any) => {
    setSelectedLucidPost(post);
    setShowLucidAlbum(true);
  };

  // NEW: Handle back from lucid album view - return to scroll view
  const handleBackFromLucidAlbum = () => {
    setShowLucidAlbum(false);
    setSelectedLucidPost(null);
  };

  // Internal reset function that handles all ProfileStructure states
  const handleResetToTop = () => {
    // Reset all internal states
    setIsFullscreen(false);
    setShowLucidAlbum(false);
    setSelectedLucidPost(null);
    
    // Close library with animation if open
    if (showLibrary) {
      closeLibrary();
    } else {
      setShowLibrary(false);
    }
    
    // Reset animation state
    librarySlideAnim.setValue(width);
    backgroundSlideAnim.setValue(0);
    
    // Reset app bar states
    setScrollY(0);
    setAppBarOpacity(1);
    setAppBarBlur(false);
    setHeaderVisible(true);
    setScrollPosition(0);
    scrollPositionRef.current = 0;
    lastScrollY.current = 0;
    // Scroll to top after states are reset
    setTimeout(() => {
      if (scrollViewRef?.current) {
        scrollViewRef.current.scrollTo({ y: 0, animated: true });
      }
    }, 100);
  };

  // Reset library state when coming from feed
  React.useEffect(() => {
    if (fromFeed) {
      setShowLibrary(false);
      setIsFullscreen(false);
      librarySlideAnim.setValue(width); // Reset animation
      backgroundSlideAnim.setValue(0); // Reset background animation
    }
  }, [fromFeed]);

  // Handle navigation away from Profile (for tab navigation cancellation)
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      // When navigating away from Profile via tabs, check if we need to cancel fullscreen
      const routeParams = route.params as { 
        fromFeed?: boolean; 
        previousScreen?: string;
        fullscreenContext?: {
          postData: any;
          isFromGrid: boolean;
        }
      } | undefined;
      
      if (routeParams?.fullscreenContext && routeParams?.previousScreen === 'TravelFeedCard') {
        // Cancel fullscreen and preserve grid position by not passing restoration params
        setIsFullscreen(false);
      }
    });

    return unsubscribe;
  }, [navigation, route.params]);
  
  // Expose the reset function to parent component
  React.useEffect(() => {
    if (onResetToTop) {
      // Replace the parent's reset function with our internal one
      onResetToTop.current = handleResetToTop;
    }
  }, [onResetToTop]);
  
  // Debug logging
  // Profile structure initialized

  // Get filtered posts for current user with media (for Feed tab)
  const userMediaPosts = (posts || []).filter(post => 
    post.authorName === profileData?.name && 
    post.images && 
    post.images.length > 0
  );

  // Enhanced scroll handler - Same as ExploreScreen
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    setScrollY(currentScrollY);
    
    // Calculate dynamic app bar opacity and blur based on scroll
    const scrollThreshold = 100;
    const opacity = Math.max(0.3, 1 - (currentScrollY / scrollThreshold));
    const shouldBlur = currentScrollY > 50;
    
    setAppBarOpacity(opacity);
    setAppBarBlur(shouldBlur);
    
    // Update both state and ref for immediate access
    setScrollPosition(currentScrollY);
    scrollPositionRef.current = currentScrollY;
    
    // Smooth header visibility logic
    if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
      // Scrolling down - fade out header
      setHeaderVisible(false);
    } else if (currentScrollY <= 20) {
      // At top - show header
      setHeaderVisible(true);
    } else if (currentScrollY < lastScrollY.current - 50) {
      // Scrolling up significantly - show header
      setHeaderVisible(true);
    }
    
    lastScrollY.current = currentScrollY;
  };

  // Handle post press with Instagram-like expand animation
  const handlePostPress = (post: any) => {
    // Store current scroll position before entering fullscreen
    const currentOffset = scrollPositionRef.current;
    setScrollPosition(currentOffset);
    
    const filteredPosts = (posts || []).filter(p => {
      const isCurrentUser = p.authorName === profileData?.name;
      if (!isCurrentUser) return false;
      return p.images && p.images.length > 0;
    });
    
    // Set selected post for TravelFeedCard view
    const postIndex = filteredPosts.findIndex(p => p.id === post.id);
    setSelectedPostIndex(postIndex >= 0 ? postIndex : 0);
    
    // Start expand animation and then show fullscreen
    runAnimation(
      FEED_ANIMATIONS.expand(animationValues),
      () => {
        setIsFullscreen(true);
      }
    );
  };

  // Handle back from fullscreen with Instagram-like collapse animation
  const handleBackFromFullscreen = () => {
    // Start collapse animation first
    runAnimation(
      FEED_ANIMATIONS.collapse(animationValues),
      () => {
        // INSTANT back transition after animation
        setIsFullscreen(false);
        
        const restoreScrollPosition = () => {
          if (scrollViewRef?.current) {
            // Always restore position, even if it's 0 (top of scroll)
            scrollViewRef.current.scrollTo({ 
              y: scrollPosition, 
              animated: false 
            });
          }
        };
        
        // Use EXACT same restoration attempts as Library for maximum reliability
        // Immediate attempt
        setTimeout(restoreScrollPosition, 0);
        
        // Secondary attempt after next frame
        requestAnimationFrame(() => {
          setTimeout(restoreScrollPosition, 0);
        });
        
        // Final attempt after a short delay
        setTimeout(restoreScrollPosition, 100);
      }
    );
  };

  // Better social media icon components
  const FacebookIcon = () => (
    <View className="w-8 h-8 bg-blue-600 rounded-lg items-center justify-center">
      <Text className="text-white text-lg font-bold">f</Text>
    </View>
  );

  const InstagramIcon = () => (
    <View className="w-8 h-8 rounded-lg items-center justify-center relative" style={{ backgroundColor: '#E1306C' }}>
      {/* Instagram camera outline - rounded square like the real logo */}
      <View className="w-5 h-5 rounded border-2 border-white items-center justify-center">
        {/* Camera lens - circle */}
        <View className="w-2.5 h-2.5 rounded-full border-2 border-white" />
      </View>
      {/* Camera flash - small dot in top right */}
      <View className="absolute top-1.5 right-1.5 w-1 h-1 rounded-full bg-white" />
    </View>
  );

  const YouTubeIcon = () => (
    <View className="w-8 h-8 bg-red-600 rounded-lg items-center justify-center">
      <View 
        style={{
          width: 0,
          height: 0,
          borderLeftWidth: 6,
          borderRightWidth: 0,
          borderTopWidth: 4,
          borderBottomWidth: 4,
          borderLeftColor: '#FFFFFF',
          borderRightColor: 'transparent',
          borderTopColor: 'transparent',
          borderBottomColor: 'transparent',
          marginLeft: 2,
        }}
      />
    </View>
  );

  const TikTokIcon = () => {
    // Helper to draw the musical note (stem + rounded hook)
    const Note = ({ color, offsetX, offsetY }: { color: string; offsetX: number; offsetY: number }) => (
      <View style={{ position: 'absolute', left: 10 + offsetX, top: 6 + offsetY }}>
        {/* Stem */}
        <View style={{ width: 3, height: 16, backgroundColor: color, borderRadius: 1.5 }} />
        {/* Hook */}
        <View style={{
          width: 10,
          height: 10,
          borderWidth: 3,
          borderColor: color,
          borderLeftColor: 'transparent',
          borderBottomColor: 'transparent',
          borderRadius: 16,
          position: 'absolute',
          left: 3,
          top: 2,
        }} />
      </View>
    );

    return (
      <View className="w-8 h-8 bg-black rounded-lg items-center justify-center relative" style={{ overflow: 'hidden' }}>
        {/* Cyan shadow */}
        <Note color="#25F4EE" offsetX={-1.5} offsetY={-1.5} />
        {/* Pink shadow */}
        <Note color="#FE2C55" offsetX={1.5} offsetY={1.5} />
        {/* Main white note */}
        <Note color="#FFFFFF" offsetX={0} offsetY={0} />
      </View>
    );
  };

  // NEW: If showing lucid album view, render LucidAlbumView
  if (showLucidAlbum && selectedLucidPost) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
        <StatusBar 
          barStyle={themeColors.isDark ? "light-content" : "dark-content"} 
          backgroundColor={themeColors.background} 
        />
        <LucidAlbumView 
          post={selectedLucidPost}
          onBack={handleBackFromLucidAlbum}
        />
      </SafeAreaView>
    );
  }

  // If in fullscreen mode, show TravelFeedCard view with animation
  if (isFullscreen) {
    const filteredPosts = (posts || []).filter(post => {
      const isCurrentUser = post.authorName === profileData?.name;
      if (!isCurrentUser) return false;
      return post.images && post.images.length > 0;
    });

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
        <StatusBar 
          barStyle={themeColors.isDark ? "light-content" : "dark-content"} 
          backgroundColor={themeColors.background} 
        />
        
        {/* Animated Background Overlay */}
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: themeColors.background,
            opacity: animationValues.backgroundOpacity,
          }}
        />
        
        {/* Animated Content Container */}
        <Animated.View
          style={{
            flex: 1,
            transform: [{ scale: animationValues.scale }],
            opacity: animationValues.opacity,
          }}
        >
          {/* Fixed App Bar - Back button moved to far left corner */}
          <View style={{
            height: responsiveDimensions.appBar.height,
            backgroundColor: themeColors.background,
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: rs(8), // Minimal left padding to reach corner
            paddingRight: responsiveDimensions.appBar.paddingHorizontal,
          }}>
            {/* Back button - Far left corner */}
            <TouchableOpacity 
              onPress={handleBackFromFullscreen}
              style={{ 
                width: responsiveDimensions.button.small.width, 
                height: responsiveDimensions.button.small.height, 
                alignItems: 'center', 
                justifyContent: 'center',
                borderRadius: rs(16),
                backgroundColor: 'transparent',
              }}
              activeOpacity={0.95}
              delayPressIn={0}
              delayPressOut={0}
            >
              <ChevronLeft size={ri(18)} color={themeColors.text} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          {/* TravelFeedCard FlatList - Same as ExploreScreen with custom onLucidPress */}
          <FlatList
            data={filteredPosts}
            renderItem={({ item }) => {
              const postCardProps = mapPostToCardProps(item);
              return (
                <TravelFeedCard 
                  {...postCardProps} 
                  onDetailsPress={() => {}}
                  onLucidPress={postCardProps.type === 'lucid' ? () => handleLucidPress(postCardProps) : undefined}
                  isVisible={true}
                />
              );
            }}
            keyExtractor={(item) => item.id}
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            pagingEnabled={true}
            snapToInterval={responsiveDimensions.feedCard.height}
            snapToAlignment="end"
            decelerationRate="fast"
            initialScrollIndex={selectedPostIndex}
            getItemLayout={(data, index) => ({
              length: responsiveDimensions.feedCard.height,
              offset: responsiveDimensions.feedCard.height * index,
              index,
            })}
            removeClippedSubviews={false}
            initialNumToRender={1}
            maxToRenderPerBatch={3}
            windowSize={5}
          />
        </Animated.View>
      </SafeAreaView>
    );
  }

  // Handle back navigation to specific previous screen
  const handleBackToPreviousScreen = () => {
    // Get route params to check for fullscreen context
    const routeParams = route.params as { 
      fromFeed?: boolean; 
      previousScreen?: string;
      fullscreenContext?: {
        postData: any;
        isFromGrid: boolean;
      }
    } | undefined;
    
    // Clear route params first to reset state
    (navigation as any).setParams({ 
      fromFeed: false, 
      previousScreen: undefined,
      fullscreenContext: undefined
    });
    
    // Navigate to specific screen based on previous screen context
    switch (previousScreen) {
      case 'TravelFeedCard':
        // Special case: Return to TravelFeedCard fullscreen mode
        if (routeParams?.fullscreenContext) {
          // Go back to Explore and restore fullscreen state
          (navigation as any).navigate('MainTabs', { 
            screen: 'Home',
            params: {
              restoreFullscreen: true,
              postData: routeParams.fullscreenContext.postData,
              isFromGrid: routeParams.fullscreenContext.isFromGrid
            }
          });
        } else {
          // Fallback to generic navigation
          (navigation as any).navigate('MainTabs', { screen: 'Home' });
        }
        break;
      case 'Explore':
        (navigation as any).navigate('MainTabs', { screen: 'Home' });
        break;
      case 'Forum':
        (navigation as any).navigate('MainTabs', { screen: 'Pods' });
        break;
      case 'Library':
        // For Library, just goBack since it's within the Profile screen
        if (navigation.canGoBack()) {
          navigation.goBack();
        }
        break;
      case 'PostDetail':
        // For post detail, use generic goBack since it's a modal/overlay
        if (navigation.canGoBack()) {
          navigation.goBack();
        }
        break;
      default:
        // Fallback to generic goBack
        if (navigation.canGoBack()) {
          navigation.goBack();
        }
        break;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
      <StatusBar 
        barStyle={themeColors.isDark ? "light-content" : "dark-content"} 
        backgroundColor={themeColors.background} 
      />
      {/* Dynamic App Bar - Conditional layout based on navigation source */}
      <View style={{
        height: responsiveDimensions.appBar.height,
        backgroundColor: scrollY > 50 ? 'transparent' : themeColors.background,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: fromFeed ? rs(4) : rs(8), // AGGRESSIVE left padding - push username to edge
        paddingRight: rs(8), // AGGRESSIVE right padding - push buttons to edge
        borderBottomWidth: scrollY > 20 && scrollY < 50 ? rs(0.5) : 0,
        borderBottomColor: `${themeColors.border}20`,
      }}>
        {/* Left side - Back button + Username */}
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center',
          flex: 1,
        }}>
          {/* Back button - Only show when coming from feed */}
          {fromFeed && (
            <TouchableOpacity 
              onPress={handleBackToPreviousScreen}
              style={{ 
                width: responsiveDimensions.button.small.width, 
                height: responsiveDimensions.button.small.height, 
                alignItems: 'center', 
                justifyContent: 'center',
                borderRadius: rs(16),
                backgroundColor: 'transparent',
                marginRight: rs(4), // REDUCED spacing
                opacity: 1.0, // Always visible - no collapsing
              }}
              activeOpacity={0.7}
            >
              <ChevronLeft size={ri(18)} color={themeColors.text} strokeWidth={2} />
            </TouchableOpacity>
          )}
          
          {/* Username - AGGRESSIVELY positioned at most left corner */}
          <Text style={{ 
            fontSize: typography.appTitle, 
            fontWeight: '700', 
            color: themeColors.text,
            opacity: 1.0, // Always visible - no collapsing
          }}>
            {formatUsername(profileData?.username)}
          </Text>
        </View>
        
        {/* Action buttons - AGGRESSIVELY pushed to right edge with tight spacing */}
        {!fromFeed && (
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center',
            opacity: scrollY > 50 ? 0 : 1,
          }}>
            {/* Library Button */}
            <TouchableOpacity
              onPress={openLibrary}
              style={{ 
                width: responsiveDimensions.button.medium.width, 
                height: responsiveDimensions.button.medium.height, 
                alignItems: 'center', 
                justifyContent: 'center',
                borderRadius: rs(16),
                backgroundColor: scrollY > 20 
                  ? `${themeColors.backgroundSecondary}40` 
                  : 'transparent',
                marginRight: rs(2), // CLOSER to settings button
              }}
              activeOpacity={0.7}
            >
              <Bookmark size={ri(22)} color={`${themeColors.text}CC`} strokeWidth={2} />
            </TouchableOpacity>
            
            {/* Settings Button */}
            <TouchableOpacity
              onPress={onSettingsPress}
              style={{ 
                width: responsiveDimensions.button.medium.width, 
                height: responsiveDimensions.button.medium.height, 
                alignItems: 'center', 
                justifyContent: 'center',
                borderRadius: rs(16),
                backgroundColor: scrollY > 20 
                  ? `${themeColors.backgroundSecondary}40` 
                  : 'transparent',
              }}
              activeOpacity={0.7}
            >
              <Settings size={ri(22)} color={`${themeColors.text}CC`} strokeWidth={2} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Animated.View 
        style={{ 
          flex: 1,
          transform: [{ translateX: backgroundSlideAnim }]
        }}
      >
        <ScrollView 
          ref={scrollViewRef}
          style={{ flex: 1, backgroundColor: themeColors.background }}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={1}
          bounces={true}
          removeClippedSubviews={false}
          keyboardShouldPersistTaps="handled"
          maintainVisibleContentPosition={{
            minIndexForVisible: 0,
            autoscrollToTopThreshold: 0,
          }}
        >

        {/* Profile Picture - Clean square with rounded edges */}
        <View style={{ marginTop: 48, alignItems: 'center' }}>
          <View style={{ 
            width: 192, 
            height: 192, 
            borderRadius: 16, 
            overflow: 'hidden', 
            backgroundColor: themeColors.backgroundSecondary 
          }}>
            <Image
              source={{ uri: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=400' }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
          </View>
        </View>

        {/* Name & Flag - Minimal typography */}
        <View style={{ marginTop: 32, alignItems: 'center' }}>
          <Text style={{ fontSize: 24, color: themeColors.text }}>
            <Text style={{ fontWeight: '500' }}>{profileData?.name || 'Loading'}</Text>
            <Text style={{ fontWeight: '300' }}> {profileData?.nationalityFlag || '🏳️'}</Text>
          </Text>
        </View>

        {/* Location - Subtle */}
        <View style={{ marginTop: 8, alignItems: 'center' }}>
          <Text style={{ 
            fontSize: 14, 
            color: themeColors.textSecondary, 
            fontWeight: '300' 
          }}>
            {profileData?.country || 'Location'}
          </Text>
        </View>

        {/* Social Media Icons - Ultra minimal */}
        <View className="mt-10 flex-row justify-center items-center">
          <TouchableOpacity className="mx-3" activeOpacity={0.3}>
            <FacebookIcon />
          </TouchableOpacity>
          
          <TouchableOpacity className="mx-3" activeOpacity={0.3}>
            <InstagramIcon />
          </TouchableOpacity>
          
          <TouchableOpacity className="mx-3" activeOpacity={0.3}>
            <YouTubeIcon />
          </TouchableOpacity>
          
          <TouchableOpacity className="mx-3" activeOpacity={0.3}>
            <TikTokIcon />
          </TouchableOpacity>
        </View>

        {/* Interests Section - Clean tags */}
        <View style={{ marginTop: 64, paddingHorizontal: 24 }}>
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: 24 
          }}>
            <Text style={{ 
              fontSize: 18, 
              fontWeight: '400', 
              color: themeColors.text 
            }}>
              Interests
            </Text>
            <TouchableOpacity activeOpacity={0.3}>
              <Text style={{ 
                fontSize: 14, 
                color: themeColors.textSecondary, 
                fontWeight: '300' 
              }}>
                Edit
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={{ 
            flexDirection: 'row', 
            flexWrap: 'wrap', 
            gap: 8 
          }}>
            {(profileData?.interests || []).map((interest, index) => (
              <View
                key={index}
                style={{ 
                  borderWidth: 1, 
                  borderColor: themeColors.border, 
                  paddingHorizontal: 16, 
                  paddingVertical: 8, 
                  borderRadius: 20, 
                  flexDirection: 'row', 
                  alignItems: 'center' 
                }}
              >
                <Text style={{ fontSize: 14, marginRight: 8 }}>{interest.icon}</Text>
                <Text style={{ 
                  fontSize: 14, 
                  fontWeight: '300', 
                  color: themeColors.text 
                }}>
                  {interest.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Media Grid - Edge to edge with smooth corners */}
        <View style={{ paddingTop: 32 }}>
          {(() => {
            const filteredPosts = (posts || []).filter(post => {
              const isCurrentUser = post.authorName === profileData?.name;
              if (!isCurrentUser) return false;
              return post.images && post.images.length > 0;
            });

            if (filteredPosts.length === 0) {
              // Empty state - minimal
              return (
                <View style={{ 
                  flex: 1, 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  paddingVertical: 80,
                  paddingHorizontal: 24
                }}>
                  <Text style={{ 
                    fontSize: 14, 
                    color: themeColors.textSecondary, 
                    fontWeight: '300' 
                  }}>
                    All your Media Uploads
                  </Text>
                </View>
              );
            }

            return (
              <View style={{ 
                flexDirection: 'row', 
                flexWrap: 'wrap', 
                paddingBottom: 32 
              }}>
                {filteredPosts.map((post) => (
                  <TouchableOpacity
                    key={post.id}
                    style={{ 
                      width: width / 3,
                      aspectRatio: 4/5,
                      padding: 1
                    }}
                    onPress={() => handlePostPress(post)}
                    activeOpacity={0.8}
                  >
                    <View style={{ position: 'relative', flex: 1 }}>
                      <Image
                        source={{ uri: post.images![0] }}
                        style={{ 
                          width: '100%', 
                          height: '100%',
                          borderRadius: 8,
                          backgroundColor: themeColors.backgroundSecondary 
                        }}
                        resizeMode="cover"
                      />
                      
                      {/* Lucid Indicator Icon */}
                      {post.type === 'lucid' && (
                        <View style={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          width: 24,
                          height: 24,
                          borderRadius: 12,
                          backgroundColor: '#0047AB',
                          alignItems: 'center',
                          justifyContent: 'center',
                          shadowColor: '#000',
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.25,
                          shadowRadius: 4,
                          elevation: 3
                        }}>
                          <Album size={14} color="white" strokeWidth={2.5} />
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            );
          })()}
        </View>
      </ScrollView>
      </Animated.View>
      
      {/* Library Overlay - Slides in from right */}
      {showLibrary && (
        <Animated.View 
          style={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            transform: [{ translateX: librarySlideAnim }],
            backgroundColor: themeColors.background,
            zIndex: 1000,
          }}
        >
          <Library onBackPress={closeLibrary} />
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

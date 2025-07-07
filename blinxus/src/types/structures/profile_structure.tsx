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
import { mapPostToCardProps, PostCardProps } from './posts_structure';
import TravelFeedCard from '../../components/TravelFeedCard';
import MediaGridItem from '../../components/MediaGridItem';

import { useNavigation } from '@react-navigation/native';
import { Plus, Settings, Bookmark, ChevronLeft, Album } from 'lucide-react-native';
import Library from '../../screens/Profile/Library';
import { useThemeColors } from '../../hooks/useThemeColors';
import { getResponsiveDimensions, getTypographyScale, getSpacingScale, ri, rs, rf, RESPONSIVE_SCREEN, formatUsername } from '../../utils/responsive';
import { 
  createAnimationValues, 
  runAnimation,
  ANIMATION_DURATIONS,
  createLibrarySlideInAnimation,
  createLibrarySlideOutAnimation
} from '../../utils/animations';
import { ImmersiveNavigation } from '../../utils/immersiveNavigation';
import { NavigationManager } from '../../utils/navigationManager';
import UserProfileNavigation from '../../utils/userProfileNavigation';

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
  onScrollToTop?: React.MutableRefObject<(() => void) | null>; // New prop for actual scroll reset
  fromFeed?: boolean;
  previousScreen?: string;
}

export default function ProfileStructure({
  profileData,
  posts,
  onSettingsPress,
  scrollRef,
  onResetToTop,
  onScrollToTop,
  fromFeed,
  previousScreen,
}: Props) {
  const themeColors = useThemeColors();
  const navigation = useNavigation();
  
  // Library slide animation
  const [showLibrary, setShowLibrary] = useState(false);
  const librarySlideAnim = useRef(new Animated.Value(width)).current;
  const backgroundSlideAnim = useRef(new Animated.Value(0)).current;
  
  // Scroll and app bar state
  const [scrollY, setScrollY] = useState(0);
  const [appBarOpacity, setAppBarOpacity] = useState(1);
  const [appBarBlur, setAppBarBlur] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollPositionRef = useRef(0);
  const lastScrollY = useRef(0);
  const scrollViewRef = useRef<ScrollView>(null);
  

  
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

  // RADICAL FIX: Modified to preserve scroll position - only close library, never reset scroll
  const handleResetToTop = () => {
    // Close library with animation if open
    if (showLibrary) {
      closeLibrary();
    } else {
      setShowLibrary(false);
    }
    
    // Reset animation state for library
    librarySlideAnim.setValue(width);
    backgroundSlideAnim.setValue(0);
    
    // REMOVED: All scroll position resets to preserve user's scroll position
    // The app bar states and scroll position are preserved
  };

  // NEW: Function that actually scrolls to top (for profile icon tap when already on profile)
  const handleScrollToTop = () => {
    // Close library with animation if open
    if (showLibrary) {
      closeLibrary();
    } else {
      setShowLibrary(false);
    }
    
    // Reset animation state for library
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
    
    // Actually scroll to top
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
      librarySlideAnim.setValue(width); // Reset animation
      backgroundSlideAnim.setValue(0); // Reset background animation
    }
  }, [fromFeed]);
  
  // Expose the reset function to parent component
  React.useEffect(() => {
    if (onResetToTop) {
      // Replace the parent's reset function with our internal one
      onResetToTop.current = handleResetToTop;
    }
  }, [onResetToTop]);

  // Expose the scroll to top function to parent component
  React.useEffect(() => {
    if (onScrollToTop) {
      // Replace the parent's scroll to top function with our internal one
      onScrollToTop.current = handleScrollToTop;
    }
  }, [onScrollToTop]);
  
  // Debug logging
  // Profile structure initialized

  // Get filtered posts for current user with media (for Feed tab)
  const userMediaPosts = (posts || []).filter(post => 
    post.authorName === profileData?.name && 
    post.images && 
    post.images.length > 0
  ).map(post => mapPostToCardProps(post));

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

  // Handle post press with immersive navigation
  const handlePostPress = (post: PostCardProps) => {
    // Use immersive navigation for TikTok-style experience
    ImmersiveNavigation.navigateFromPostInList(navigation as any, userMediaPosts, post, 'Profile');
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



  // Handle back navigation to specific previous screen
  const handleBackToPreviousScreen = () => {
    // Use centralized navigation manager
    NavigationManager.goBack({
      navigation: navigation as any,
      previousScreen,
      scrollPosition: scrollPosition,
      scrollRef: scrollViewRef
    });
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
          {/* Back button - Only show when coming from feed - ALWAYS VISIBLE */}
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
                opacity: 1.0, // ALWAYS VISIBLE - no fade on scroll
              }}
              activeOpacity={0.7}
            >
              <ChevronLeft size={ri(18)} color={themeColors.text} strokeWidth={2} />
            </TouchableOpacity>
          )}
          
          {/* Username - ALWAYS VISIBLE on scroll */}
          <Text style={{ 
            fontSize: typography.appTitle, 
            fontWeight: '700', 
            color: themeColors.text,
            opacity: 1.0, // ALWAYS VISIBLE - no fade on scroll
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

import React, { useState, useRef, useImperativeHandle, forwardRef, useCallback, useMemo, useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, FlatList, NativeSyntheticEvent, NativeScrollEvent, StatusBar, TextInput, Dimensions, ImageBackground, Animated, Image, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { Search, ChevronLeft, Grid3X3, Clock } from 'lucide-react-native';
import { activityTags, ActivityKey, activityNames } from '../../constants/activityTags';
import PillTag from '../../components/PillTag';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { usePosts } from '../../store/PostsContext';
import { mapPostToCardProps, PostCardProps } from '../../types/structures/posts_structure';
import MediaGridItem from '../../components/MediaGridItem';
import { useScrollContext } from '../../contexts/ScrollContext';
import { useThemeColors } from '../../hooks/useThemeColors';
import { useSettings } from '../../contexts/SettingsContext';
import TravelFeedCard from '../../components/TravelFeedCard';
import FullscreenView from '../../components/FullscreenView';
import { getResponsiveDimensions, getTypographyScale, getSpacingScale, ri, rs, rf, RESPONSIVE_SCREEN } from '../../utils/responsive';
import { 
  createAnimationValues, 
  FEED_ANIMATIONS, 
  runAnimation,
  ANIMATION_DURATIONS,
  createPageSlideInAnimation,
  createPageSlideOutAnimation
} from '../../utils/animations';
import useFullscreenManager from '../../hooks/useFullscreenManager';


const { width, height: screenHeight } = RESPONSIVE_SCREEN;
const responsiveDimensions = getResponsiveDimensions();
const typography = getTypographyScale();
const spacing = getSpacingScale();

export interface ExploreScreenRef {
  resetToAll: () => void;
  scrollToTopInMediaMode: () => void;
  isInMediaMode: () => boolean;
  isInFullscreenMode: () => boolean;
  exitFullscreenOnly: () => void;
  directResetFromFullscreen: () => void; // NEW: Direct transition without grid flicker
}

const ExploreScreen = forwardRef<ExploreScreenRef, {}>((props, ref) => {
  const navigation = useNavigation();
  const themeColors = useThemeColors();
  const { posts } = usePosts();
  const { exploreScrollRef } = useScrollContext();
  const { isImmersiveFeedEnabled } = useSettings();
  const [headerVisible, setHeaderVisible] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<ActivityKey | 'all'>('all');
  const [isMediaMode, setIsMediaMode] = useState(false);
  
  // Search functionality state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  
  // Search modal animation values
  const searchModalTranslateX = useRef(new Animated.Value(width)).current;
  const searchModalOpacity = useRef(new Animated.Value(0)).current;
  
  // TextInput ref for programmatic focus
  const searchInputRef = useRef<TextInput>(null);
  
  // Centralized fullscreen management
  const fullscreenManager = useFullscreenManager();
  
  const lastScrollY = useRef(0);
  
  // New state for custom app bar behavior
  const [scrollY, setScrollY] = useState(0);
  const [appBarOpacity, setAppBarOpacity] = useState(1);
  const [appBarBlur, setAppBarBlur] = useState(false);
  
  // Global header state - once hidden by scrolling, stays hidden until explicitly shown
  const [globalHeaderHidden, setGlobalHeaderHidden] = useState(false);
  
  // Media mode scroll position tracking
  const [mediaScrollPosition, setMediaScrollPosition] = useState(0);
  const mediaScrollPositionRef = useRef(0); // Use ref for immediate access
  const mediaScrollRef = useRef<ScrollView>(null);
  
  // Store scroll positions for each filter
  const scrollPositions = useRef<{ [key: string]: number }>({});
  
  // Store scroll positions for media mode separately
  const mediaScrollPositions = useRef<{ [key: string]: number }>({});
  
  // Double tap detection for activity pills
  const lastPillTapRef = useRef<{ [key: string]: number }>({});

  // Store previous filter when entering media mode
  const previousFilterRef = useRef<ActivityKey | 'all'>('all');

  // Track currently visible post index for immersive feed - OPTIMIZED
  const [currentVisibleIndex, setCurrentVisibleIndex] = useState(0);
  const currentVisibleIndexRef = useRef(0); // Use ref to avoid re-renders during scroll
  


  // Expose reset function for double-tap
  useImperativeHandle(ref, () => ({
    resetToAll: () => {
      // RADICAL FIX: Exit fullscreen mode if active - using phase check
      if (fullscreenManager.phase === 'active') {
        fullscreenManager.exitFullscreen();
      }
      
      // Exit media mode and reset to normal view
      setIsMediaMode(false);
      setSelectedFilter('all');
      
      // Reset search state
      setSearchQuery('');
      setIsSearchActive(false);
      setSearchSuggestions([]);
      
      // Reset app bar states
      setScrollY(0);
      setAppBarOpacity(1);
      setAppBarBlur(false);
      setHeaderVisible(true);
      setGlobalHeaderHidden(false);
      
      // Scroll to top in normal view
      setTimeout(() => {
        if (exploreScrollRef?.current) {
          exploreScrollRef.current.scrollToOffset({ offset: 0, animated: true });
        }
      }, 100);
    },
    scrollToTopInMediaMode: () => {
      // Only scroll to top if currently in media mode, don't exit media mode
      if (isMediaMode && mediaScrollRef?.current) {
        mediaScrollRef.current.scrollTo({ y: 0, animated: true });
        
        // Reset media scroll position tracking
        setMediaScrollPosition(0);
        mediaScrollPositionRef.current = 0;
        mediaScrollPositions.current[selectedFilter] = 0;
        
        // Show header when going to top
        setHeaderVisible(true);
        setGlobalHeaderHidden(false);
        setScrollY(0);
        setAppBarOpacity(1);
        setAppBarBlur(false);
      }
    },
    isInMediaMode: () => {
      return isMediaMode;
    },
    isInFullscreenMode: () => {
      return fullscreenManager.phase === 'active';
    },
    exitFullscreenOnly: () => {
      // RADICAL FIX: Only exit fullscreen mode using phase check
      if (fullscreenManager.phase === 'active') {
        fullscreenManager.exitFullscreen();
      }
    },
    directResetFromFullscreen: () => {
      // 🚀 RADICAL DIRECT TRANSITION: Skip grid view completely
      // This is specifically for double-tap from fullscreen mode
      
      // Step 1: Immediately prepare the normal view state (NO GRID FLICKER)
      setIsMediaMode(false);
      setSelectedFilter('all');
      
      // Reset search state
      setSearchQuery('');
      setIsSearchActive(false);
      setSearchSuggestions([]);
      
      // Step 2: Reset all app bar states instantly
      setScrollY(0);
      setAppBarOpacity(1);
      setAppBarBlur(false);
      setHeaderVisible(true);
      setGlobalHeaderHidden(false);
      
      // Step 3: Reset scroll positions
      scrollPositions.current = {};
      mediaScrollPositions.current = {};
      
      // Step 4: INSTANT EXIT - No animation, direct transition
      if (fullscreenManager.phase === 'active') {
        // Use instant exit instead of animated exit for buttery smooth transition
        fullscreenManager.instantExit();
      }
      
      // Step 5: Ensure scroll position is at top immediately
      setTimeout(() => {
        if (exploreScrollRef?.current) {
          exploreScrollRef.current.scrollToOffset({ offset: 0, animated: false });
        }
      }, 10); // Ultra-minimal delay for instant feel
    },
  }));

  // Search suggestions data - memoized for performance
  const allSearchSuggestions = useMemo(() => {
    const suggestions = new Set<string>();
    
    // Add activity names
    activityTags.forEach(tag => suggestions.add(tag.name));
    
    // Add location names from posts
    posts.forEach(post => {
      if (post.location) suggestions.add(post.location);
    });
    
    // Add common search terms
    ['Adventure', 'Travel', 'Food', 'Culture', 'Nature', 'City', 'Beach', 'Mountain'].forEach(term => 
      suggestions.add(term)
    );
    
    return Array.from(suggestions).sort();
  }, [posts]);

  // Handle search input changes
  const handleSearchChange = useCallback((text: string) => {
    setSearchQuery(text);
    
    if (text.length > 0) {
      const filtered = allSearchSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(text.toLowerCase())
      ).slice(0, 8); // Limit to 8 suggestions
      setSearchSuggestions(filtered);
    } else {
      setSearchSuggestions([]);
    }
  }, [allSearchSuggestions]);

  // Handle search focus
  const handleSearchFocus = useCallback(() => {
    setIsSearchActive(true);
    if (searchQuery.length === 0) {
      // Show popular suggestions when no query
      setSearchSuggestions(['Adventure', 'Food', 'Culture', 'Nature', 'Travel', 'Beach'].slice(0, 6));
    }
  }, [searchQuery]);

  // Handle search blur
  const handleSearchBlur = useCallback(() => {
    // Delay hiding to allow suggestion tap
    setTimeout(() => {
      setIsSearchActive(false);
      setSearchSuggestions([]);
    }, 150);
  }, []);

  // Animate search modal opening
  const openSearchModal = useCallback(() => {
    setIsSearchActive(true);
    // Reset animation values
    searchModalTranslateX.setValue(width);
    searchModalOpacity.setValue(0);
    
    // Start animation
    const animation = createPageSlideInAnimation(
      searchModalTranslateX,
      searchModalOpacity,
      { 
        duration: ANIMATION_DURATIONS.medium,
        onComplete: () => {
          // FORCE keyboard to show every time - guaranteed focus
          setTimeout(() => {
            if (searchInputRef.current) {
              // Force focus regardless of previous state
              searchInputRef.current.focus();
            }
          }, 50);
        }
      }
    );
    runAnimation(animation);
    
    // Also try to focus immediately (double guarantee)
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 100);
  }, [searchModalTranslateX, searchModalOpacity]);

  // Animate search modal closing
  const closeSearchModal = useCallback(() => {
    // Dismiss keyboard first
    Keyboard.dismiss();
    
    const animation = createPageSlideOutAnimation(
      searchModalTranslateX,
      searchModalOpacity,
      { 
        duration: ANIMATION_DURATIONS.fast,
        direction: 'right',
        onComplete: () => {
          setIsSearchActive(false);
          setSearchQuery('');
          setSearchSuggestions([]);
        }
      }
    );
    runAnimation(animation);
  }, [searchModalTranslateX, searchModalOpacity]);

  // Handle suggestion selection
  const handleSuggestionSelect = useCallback((suggestion: string) => {
    setSearchQuery(suggestion);
    setSearchSuggestions([]);
    // Use animated close for smooth transition
    closeSearchModal();
  }, [closeSearchModal]);

  // Dismiss keyboard when tapping outside
  const dismissKeyboard = useCallback(() => {
    Keyboard.dismiss();
  }, []);

  // MEMORY OPTIMIZATION: Memoize expensive calculations
  const cardPropsArray = useMemo(() => 
    posts.map(post => mapPostToCardProps(post)), 
    [posts]
  );

  // Filter posts based on selected activity
  const filteredPosts = useMemo(() => 
    selectedFilter === 'all' 
      ? cardPropsArray 
      : cardPropsArray.filter(post => post.activity === selectedFilter),
    [cardPropsArray, selectedFilter]
  );

  // Filter posts that have images for media mode
  const postsWithImages = useMemo(() => 
    filteredPosts.filter(post => post.images && post.images.length > 0),
    [filteredPosts]
  );

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    setScrollY(currentScrollY);
    
    // Calculate dynamic app bar opacity and blur based on scroll
    const scrollThreshold = 100;
    const opacity = Math.max(0.3, 1 - (currentScrollY / scrollThreshold));
    const shouldBlur = currentScrollY > 50;
    
    setAppBarOpacity(opacity);
    setAppBarBlur(shouldBlur);
    
    // Store scroll position ONLY for current active filter (prevent contamination)
    if (isMediaMode) {
      // Only store for media mode if we're actually in media mode
      mediaScrollPositions.current[selectedFilter] = currentScrollY;
    } else {
      // Only store for normal mode if we're actually in normal mode
      scrollPositions.current[selectedFilter] = currentScrollY;
    }
    
    // OPTIMIZED: Update current visible index for immersive feed - Use ref to prevent re-renders
    if (isImmersiveFeedEnabled && !isMediaMode) {
      const cardHeight = responsiveDimensions.feedCard.height;
      // Simplified calculation for better performance
      const newIndex = Math.max(0, Math.round(currentScrollY / cardHeight));
      // Only update state when actually changed to prevent unnecessary re-renders
      if (newIndex !== currentVisibleIndexRef.current) {
        currentVisibleIndexRef.current = newIndex;
        // Batch state update to prevent multiple re-renders
        requestAnimationFrame(() => {
          setCurrentVisibleIndex(newIndex);
        });
      }
    }
    
    // Smooth header visibility logic
    if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
      // Scrolling down - fade out header
      setHeaderVisible(false);
      setGlobalHeaderHidden(true);
    } else if (currentScrollY <= 20) {
      // At top - show header
      setHeaderVisible(true);
      setGlobalHeaderHidden(false);
    } else if (currentScrollY < lastScrollY.current - 50) {
      // Scrolling up significantly - show header
      setHeaderVisible(true);
    }
    
    lastScrollY.current = currentScrollY;
  }, [isImmersiveFeedEnabled, isMediaMode, selectedFilter]);

  // Handle filter selection with scroll position restoration and double-tap detection
  // HIDDEN PILLS LOGIC - keeping for future use
  const handleFilterSelect = (activityKey: ActivityKey | 'all') => {
    const now = Date.now();
    const lastTap = lastPillTapRef.current[activityKey] || 0;
    
    // Check for double-tap (within 300ms on same pill)
    if (now - lastTap < 300 && activityKey === selectedFilter) {
      // Double-tap detected on current pill - scroll to top
      if (isMediaMode) {
        // For media mode, reset only the current tab's position
        mediaScrollPositions.current[activityKey] = 0;
      } else {
        if (exploreScrollRef?.current) {
          exploreScrollRef.current.scrollToOffset({ offset: 0, animated: true });
        }
        // Reset only the current tab's position
        scrollPositions.current[activityKey] = 0;
      }
      lastPillTapRef.current[activityKey] = 0; // Reset to prevent triple-tap issues
      setHeaderVisible(true); // Show header when going to top
      setGlobalHeaderHidden(false); // Reset global hidden state
      return;
    }
    
    // Update last tap time
    lastPillTapRef.current[activityKey] = now;
    
    if (activityKey === selectedFilter) return; // Don't change if same filter (single tap)
    
    setSelectedFilter(activityKey);
    
    // Restore scroll position for the selected filter after a short delay
    setTimeout(() => {
      if (isMediaMode) {
        // For media mode, get the saved position (0 for unvisited tabs)
        const savedPosition = mediaScrollPositions.current[activityKey] || 0;
        // Header state is inherited - no change based on position
      } else {
        // Normal mode logic - always scroll to saved position (0 for unvisited tabs)
        const savedPosition = scrollPositions.current[activityKey] || 0;
        if (exploreScrollRef?.current) {
          exploreScrollRef.current.scrollToOffset({ offset: savedPosition, animated: false });
        }
        // Header state is inherited - no change based on position
      }
    }, 100);
  };

  // Handle entering media mode
  const enterMediaMode = useCallback(() => {
    previousFilterRef.current = selectedFilter; // Store current filter
    setSelectedFilter('all'); // Always go to "All" in media mode
    setMediaScrollPosition(0); // Reset media scroll position
    setIsMediaMode(true);
  }, [selectedFilter]);

  // Handle exiting media mode
  const exitMediaMode = useCallback(() => {
    setIsMediaMode(false);
    setSelectedFilter(previousFilterRef.current); // Restore previous filter
    setMediaScrollPosition(0); // Reset media scroll position
    
    // Restore scroll position for the previous filter after a short delay
    setTimeout(() => {
      const savedPosition = scrollPositions.current[previousFilterRef.current] || 0;
      if (exploreScrollRef?.current) {
        exploreScrollRef.current.scrollToOffset({ offset: savedPosition, animated: false });
      }
      // Header state is inherited from media mode - no change based on position
    }, 100);
  }, []);

  // Handle swipe gesture
  const onGestureEvent = (event: any) => {
    const { translationX, state } = event.nativeEvent;
    
    if (state === State.END) {
      if (translationX > 50 && !isMediaMode) {
        // Swipe right detected - currently no action
      }
    }
  };

  // MEMORY OPTIMIZATION: Memoize handlers - ULTRA SMOOTH like Profile with animation
  const handleMediaItemPress = useCallback((post: PostCardProps) => {
    // Store current scroll position before entering fullscreen - DIRECT like Profile
    const currentOffset = mediaScrollPositionRef.current;
    setMediaScrollPosition(currentOffset);
    
    // Use centralized fullscreen manager
    fullscreenManager.handlePostPress(post, postsWithImages, {
      screenName: 'Explore',
      feedContext: 'explore',
      scrollPosition: currentOffset,
      setScrollPosition: setMediaScrollPosition,
      scrollRef: mediaScrollRef
    });
  }, [postsWithImages, fullscreenManager]);

  // Handle travel details popup
  const handleShowTravelDetails = useCallback((post: PostCardProps) => {
    // Travel details are now handled within TravelFeedCard component
          // Show travel details
  }, []);

  // Create activity key mapping for filter functionality
  const createActivityKeyMap = () => {
    const activityKeyMap: { [key: string]: ActivityKey } = {
      'Aquatics': 'aquatics',
      'Outdoors': 'outdoors', 
      'City': 'city',
      'Food': 'food',
      'Stays': 'stays',
      'Heritage': 'heritage',
      'Wellness': 'wellness',
      'Amusements': 'amusements',
      'Cultural': 'cultural',
      'Special Experiences': 'special',
      'Thrill': 'thrill',
    };
    return activityKeyMap;
  };

  const activityKeyMap = createActivityKeyMap();

  // RADICAL FIX: Only show fullscreen when phase is 'active' - prevents render conflicts
  if (fullscreenManager.phase === 'active' && fullscreenManager.currentConfig) {
    return (
      <FullscreenView
        visible={fullscreenManager.isFullscreen}
        posts={fullscreenManager.currentConfig.posts}
        selectedPostIndex={fullscreenManager.selectedPostIndex}
        animationValues={fullscreenManager.animationValues}
        config={fullscreenManager.currentConfig}
        onBack={fullscreenManager.exitFullscreen}
        onLucidPress={fullscreenManager.handleLucidPress}
      />
    );
  }

  // Clean Grid Icon using Lucide
  
  return (
    <PanGestureHandler onGestureEvent={onGestureEvent}>
      <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
        <StatusBar 
          barStyle={themeColors.isDark ? "light-content" : "dark-content"} 
          backgroundColor={themeColors.background} 
        />
        
        {/* Fixed Minimal App Bar with Search - Back button always visible */}
        <View style={{
          height: responsiveDimensions.appBar.height,
          backgroundColor: scrollY > 50 
            ? 'transparent' 
            : themeColors.background,
          flexDirection: 'row',
          alignItems: 'center',
          paddingLeft: rs(8),
          paddingRight: rs(8),
          borderBottomWidth: scrollY > 20 && scrollY < 50 ? rs(0.5) : 0,
          borderBottomColor: `${themeColors.border}20`,
        }}>
          {isMediaMode ? (
            <>
              {/* Back button - ALWAYS VISIBLE */}
              <TouchableOpacity 
                onPress={exitMediaMode}
                style={{ 
                  width: rs(32), 
                  height: rs(32), 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  borderRadius: rs(8),
                  backgroundColor: 'transparent',
                  opacity: 1.0, // ALWAYS VISIBLE - no fade on scroll
                  marginRight: rs(12),
                }}
                activeOpacity={0.7}
              >
                <ChevronLeft size={ri(20)} color={themeColors.text} strokeWidth={2} />
              </TouchableOpacity>
              
              {/* Search Bar - Full width in media mode with improved design */}
              <TouchableOpacity 
                style={{ flex: 1, position: 'relative', marginRight: rs(12) }}
                onPress={openSearchModal}
                activeOpacity={0.8}
              >
                <View style={{
                  backgroundColor: themeColors.isDark 
                    ? 'rgba(45, 45, 45, 1)' 
                    : 'rgba(240, 240, 240, 1)',
                  borderRadius: rs(8), // Soft rectangle edges - matching dropdown
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: rs(10),
                  height: rs(32), // Thinner search bar - matching dropdown
                }}>
                  <Search size={ri(16)} color={themeColors.textSecondary} strokeWidth={2} />
                  <Text style={{
                    flex: 1,
                    marginLeft: rs(8),
                    fontSize: rf(14),
                    color: themeColors.textSecondary,
                    fontWeight: '400',
                    fontFamily: 'System',
                  }}>
                    Search
                  </Text>
                </View>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {/* Blinxus logo - RESTORED to original position and behavior */}
              <Image 
                source={require('../../../../assets/blinxus-logo.png')} 
                style={{ 
                  position: 'absolute',
                  left: rs(-1), // Move more to the left
                  top: rs(-65), // Move up
                  width: ri(120), // Keep same size
                  height: ri(180), // Keep same size
                  opacity: scrollY > 50 ? 0 : (scrollY > 20 ? 0.7 : 1.0),
                  zIndex: 10, // Make sure it's visible on top
                }}
                resizeMode="contain" // Maintains aspect ratio
              />
              
              {/* Grid icon - positioned on the right */}
              <TouchableOpacity
                onPress={enterMediaMode}
                style={{ 
                  position: 'absolute',
                  right: rs(8),
                  width: responsiveDimensions.button.large.width, 
                  height: responsiveDimensions.button.large.height, 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  borderRadius: rs(16),
                  backgroundColor: scrollY > 20 
                    ? `${themeColors.backgroundSecondary}40` 
                    : `${themeColors.backgroundSecondary}20`,
                  opacity: scrollY > 50 ? 0 : 1,
                }}
                activeOpacity={0.7}
              >
                <Grid3X3 
                  size={ri(28)} 
                  color={themeColors.text} 
                  strokeWidth={2} 
                />
              </TouchableOpacity>
            </>
          )}
        </View>



        {/* Full-Screen Search Modal - matching user's design */}
        {isSearchActive && (
          <Animated.View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: themeColors.background,
            zIndex: 2000,
            opacity: searchModalOpacity,
            transform: [{ translateX: searchModalTranslateX }],
          }}>
            {/* Safe Area for Status Bar - No content blocking */}
            <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
              <StatusBar 
                barStyle={themeColors.isDark ? "light-content" : "dark-content"} 
                backgroundColor={themeColors.background} 
              />
              
              <TouchableWithoutFeedback onPress={dismissKeyboard}>
                <View style={{ flex: 1 }}>
                  {/* Search Header - Content starts below status bar */}
                  <View style={{
                    height: rs(60), // Fixed height for search header
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: rs(16),
                    backgroundColor: themeColors.background,
                  }}>
                                {/* Search Bar - Rectangle with soft edges */}
                  <TouchableWithoutFeedback>
                    <View style={{
                      flex: 1,
                      backgroundColor: themeColors.isDark 
                        ? 'rgba(45, 45, 45, 1)' 
                        : 'rgba(240, 240, 240, 1)',
                      borderRadius: rs(8), // Soft rectangle edges - matching grid view
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: rs(10),
                      height: rs(32), // Thinner search bar - matching grid view
                      marginRight: rs(12),
                    }}>
                      <Search size={ri(16)} color={themeColors.textSecondary} strokeWidth={2} />
                      <TextInput
                        value={searchQuery}
                        onChangeText={handleSearchChange}
                        placeholder="Search"
                        placeholderTextColor={themeColors.textSecondary}
                        style={{
                          flex: 1,
                          marginLeft: rs(8),
                          fontSize: rf(14),
                          color: themeColors.text,
                          fontWeight: '400',
                          fontFamily: 'System',
                        }}
                        returnKeyType="search"
                        autoFocus={false}
                        clearButtonMode="while-editing"
                        ref={searchInputRef}
                        blurOnSubmit={false}
                      />
                    </View>
                  </TouchableWithoutFeedback>
              
                                {/* Cancel Button */}
                  <TouchableWithoutFeedback>
                    <View>
                      <TouchableOpacity
                        onPress={closeSearchModal}
                        style={{
                          paddingVertical: rs(8),
                          paddingHorizontal: rs(4),
                        }}
                        activeOpacity={0.7}
                      >
                        <Text style={{
                          fontSize: rf(16),
                          color: themeColors.text,
                          fontWeight: '400',
                          fontFamily: 'System',
                        }}>
                          Cancel
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableWithoutFeedback>
            </View>
            
            {/* Search Content */}
            <View style={{ flex: 1 }}>
              {searchQuery.length === 0 ? (
                // Search homepage with recent searches and trending
                <ScrollView 
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                  style={{ flex: 1 }}
                >
                  {/* Recent searches section - MOCK DATA (easy to replace for scale) */}
                  {[
                    'Boracay beaches', 
                    'Tokyo street food', 
                    'Baguio hiking trails'
                  ].map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleSuggestionSelect(item)}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: rs(20),
                        paddingVertical: rs(16),
                        borderBottomWidth: rs(0.5),
                        borderBottomColor: themeColors.isDark 
                          ? 'rgba(255, 255, 255, 0.06)' 
                          : 'rgba(0, 0, 0, 0.06)',
                      }}
                      activeOpacity={0.7}
                    >
                      {/* Recent icon */}
                      <Clock 
                        size={ri(20)} 
                        color={themeColors.textSecondary} 
                        strokeWidth={1.5}
                        style={{ marginRight: rs(16) }}
                      />
                      
                      {/* Search term */}
                      <Text style={{
                        flex: 1,
                        fontSize: rf(14),
                        color: themeColors.text,
                        fontWeight: '400',
                        fontFamily: 'System',
                      }}>
                        {item}
                      </Text>
                      
                      {/* X button */}
                      <TouchableOpacity
                        onPress={(e) => {
                          e.stopPropagation();
                          // Handle remove recent search
                        }}
                        style={{
                          width: rs(24),
                          height: rs(24),
                          borderRadius: rs(12),
                          backgroundColor: themeColors.isDark 
                            ? 'rgba(255, 255, 255, 0.1)' 
                            : 'rgba(0, 0, 0, 0.1)',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        activeOpacity={0.7}
                      >
                        <Text style={{
                          fontSize: rf(14),
                          color: themeColors.textSecondary,
                          fontWeight: '500',
                          fontFamily: 'System',
                        }}>
                          ×
                        </Text>
                      </TouchableOpacity>
                    </TouchableOpacity>
                  ))}
                  
                  {/* Trending Today section */}
                  <View style={{ 
                    paddingTop: rs(32),
                    paddingBottom: rs(20),
                  }}>
                    <Text style={{
                      fontSize: rf(20),
                      fontWeight: '600',
                      color: themeColors.text,
                      fontFamily: 'System',
                      paddingHorizontal: rs(20),
                      marginBottom: rs(20),
                    }}>
                      Trending Today
                    </Text>
                    
                    {/* Trending posts - using real posts data */}
                    {posts.slice(0, 6).map((post, index) => (
                      <TouchableOpacity
                        key={post.id}
                        onPress={() => handleSuggestionSelect(post.location || post.activity || 'Trending')}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          paddingHorizontal: rs(20),
                          paddingVertical: rs(12),
                        }}
                        activeOpacity={0.7}
                      >
                        {/* Post thumbnail */}
                        <View style={{
                          width: rs(60),
                          height: rs(60),
                          borderRadius: rs(8),
                          backgroundColor: themeColors.isDark 
                            ? 'rgba(45, 45, 45, 1)' 
                            : 'rgba(240, 240, 240, 1)',
                          marginRight: rs(12),
                          overflow: 'hidden',
                        }}>
                          {post.images && post.images[0] ? (
                            <Image
                              source={{ uri: post.images[0] }}
                              style={{
                                width: '100%',
                                height: '100%',
                              }}
                              resizeMode="cover"
                            />
                          ) : (
                            <View style={{
                              width: '100%',
                              height: '100%',
                              backgroundColor: themeColors.backgroundSecondary,
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                              <Text style={{
                                fontSize: rf(12),
                                color: themeColors.textSecondary,
                                fontWeight: '500',
                                fontFamily: 'System',
                              }}>
                                {post.activity?.charAt(0) || 'T'}
                              </Text>
                            </View>
                          )}
                        </View>
                        
                        {/* Post content */}
                        <View style={{ flex: 1 }}>
                          <Text style={{
                            fontSize: rf(16),
                            color: '#007AFF',
                            fontWeight: '400',
                            fontFamily: 'System',
                            marginBottom: rs(2),
                          }}>
                            {post.location || post.activity || 'Trending Post'}
                          </Text>
                          <Text 
                            style={{
                              fontSize: rf(14),
                              color: themeColors.textSecondary,
                              fontWeight: '400',
                              fontFamily: 'System',
                            }}
                            numberOfLines={2}
                          >
                            {post.content && post.content.length > 60 ? `${post.content.substring(0, 60)}...` : (post.content || 'Trending content')}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              ) : (
                // Search suggestions dropdown
                <ScrollView 
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                  style={{ flex: 1 }}
                >
                  {searchSuggestions.map((suggestion, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleSuggestionSelect(suggestion)}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: rs(20),
                        paddingVertical: rs(12),
                        borderBottomWidth: index < searchSuggestions.length - 1 ? rs(0.5) : 0,
                        borderBottomColor: themeColors.isDark 
                          ? 'rgba(255, 255, 255, 0.06)' 
                          : 'rgba(0, 0, 0, 0.03)',
                      }}
                      activeOpacity={0.7}
                    >
                      <Search 
                        size={ri(16)} 
                        color={themeColors.textSecondary} 
                        strokeWidth={1.5} 
                      />
                      <Text style={{
                        marginLeft: rs(12),
                        fontSize: rf(14),
                        color: themeColors.text,
                        fontWeight: '400',
                        fontFamily: 'System',
                      }}>
                        {suggestion}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </SafeAreaView>
          </Animated.View>
        )}

        {/* Pills Layer - HIDDEN FOR NOW (keeping logic intact for future use) */}
        {false && (
          <View style={{ backgroundColor: themeColors.background, paddingBottom: 16 }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24 }}>
              <View style={{ flexDirection: 'row' }}>
                {/* All Filter Pill */}
                <View style={{ marginRight: 6 }}>
                  <PillTag
                    label="All"
                    color={themeColors.isDark ? themeColors.backgroundSecondary : "#E5E7EB"} // Adapt to theme
                    selected={selectedFilter === 'all'}
                    onPress={() => handleFilterSelect('all')}
                    alwaysFullColor={true}
                    size="medium"
                  />
                </View>
                {activityTags.map((tag, index) => {
                  const activityKey = activityKeyMap[tag.name];
                  return (
                    <View key={tag.id} style={{ marginRight: 6 }}>
                      <PillTag
                        label={tag.name}
                        color={tag.color}
                        selected={selectedFilter === activityKey}
                        onPress={() => handleFilterSelect(activityKey)}
                        alwaysFullColor={true}
                        size="medium"
                      />
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        )}
        
        {/* Content Area */}
        {isMediaMode ? (
          // Media Grid View - EXACT COPY of Library Recent Tab Structure
          <ScrollView 
            ref={mediaScrollRef}
            showsVerticalScrollIndicator={false}
            onScroll={(event) => {
              handleScroll(event);
              // Update both state and ref for immediate access - EXACT like Library
              const currentY = event.nativeEvent.contentOffset.y;
              setMediaScrollPosition(currentY);
              mediaScrollPositionRef.current = currentY;
            }}
            scrollEventThrottle={16}
            bounces={true}
            removeClippedSubviews={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={{ 
              flexDirection: 'row', 
              flexWrap: 'wrap', 
              paddingBottom: 32 
            }}>
              {postsWithImages.map((post) => (
                <MediaGridItem
                  key={post.id}
                  imageUri={post.images![0]}
                  isLucid={post.type === 'lucid'}
                  onPress={() => handleMediaItemPress(post)}
                />
              ))}
            </View>
          </ScrollView>
        ) : (
          // Posts Feed - Conditional rendering based on immersive mode
          <FlatList
            ref={exploreScrollRef}
            data={filteredPosts}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => {
              if (isImmersiveFeedEnabled) {
                return (
                  <TravelFeedCard
                    {...item}
                    onDetailsPress={() => handleShowTravelDetails(item)}
                    isVisible={index >= currentVisibleIndex - 1 && index <= currentVisibleIndex + 1} // INSTANT: Pre-render adjacent cards
                  />
                );
              } else {
                // Fallback to regular cards - though this shouldn't be reached in normal usage
                return <TravelFeedCard {...item} onDetailsPress={() => {}} isVisible={true} />;
              }
            }}
            style={{ flex: 1, backgroundColor: themeColors.background }}
            showsVerticalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={1} // ULTRA FAST: Maximum responsiveness
            bounces={true}
            pagingEnabled={isImmersiveFeedEnabled}
            snapToInterval={isImmersiveFeedEnabled ? responsiveDimensions.feedCard.height : undefined}
            snapToAlignment={isImmersiveFeedEnabled ? "end" : undefined}
            decelerationRate="fast" // ULTRA FAST: Always use fastest deceleration
            // ULTRA FAST GESTURES: Instant response
            scrollsToTop={false}
            disableIntervalMomentum={true} // ULTRA FAST: No momentum delays
            // ULTRA FAST PERFORMANCE OPTIMIZATIONS
            removeClippedSubviews={false} // ULTRA FAST: Keep all views ready
            maxToRenderPerBatch={15} // ULTRA FAST: Render even more items at once
            windowSize={21} // ULTRA FAST: Keep way more items in memory
            initialNumToRender={8} // ULTRA FAST: Start with more items ready
            updateCellsBatchingPeriod={1} // ULTRA FAST: Fastest possible batch updates
            legacyImplementation={false} // ULTRA FAST: Use new optimized implementation
            maintainVisibleContentPosition={{
              minIndexForVisible: 0,
              autoscrollToTopThreshold: 100
            }} // ULTRA FAST: Maintain position during updates
            getItemLayout={isImmersiveFeedEnabled ? (data, index) => ({
              length: responsiveDimensions.feedCard.height,
              offset: responsiveDimensions.feedCard.height * index,
              index,
            }) : undefined}
          />
        )}

      </SafeAreaView>
    </PanGestureHandler>
  );
});

ExploreScreen.displayName = 'ExploreScreen';

export default ExploreScreen;
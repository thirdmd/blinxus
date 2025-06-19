import React, { useState, useRef, useImperativeHandle, forwardRef, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, FlatList, NativeSyntheticEvent, NativeScrollEvent, StatusBar, TextInput, Dimensions } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { Search, ArrowLeft, Grid3X3 } from 'lucide-react-native';
import { activityTags, ActivityKey, activityNames } from '../../constants/activityTags';
import PillTag from '../../components/PillTag';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { usePosts } from '../../store/PostsContext';
import { mapPostToCardProps, PostCardProps } from '../../types/structures/posts_structure';
import PostCard from '../../components/PostCard';
import LucidPostCard from '../../components/LucidPostCard';
import LucidAlbumView from '../../components/LucidAlbumView';
import MediaGridItem from '../../components/MediaGridItem';
import MasonryList from '../../components/MasonryList';
import FullPostView from '../../components/FullPostView';
import { useScrollContext } from '../../contexts/ScrollContext';
import { useThemeColors } from '../../hooks/useThemeColors';
import { useSettings } from '../../contexts/SettingsContext';
import TravelFeedCard from '../../components/TravelFeedCard';

export interface ExploreScreenRef {
  resetToAll: () => void;
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
  const [selectedPost, setSelectedPost] = useState<PostCardProps | null>(null);
  const [showFullPost, setShowFullPost] = useState(false);
  const lastScrollY = useRef(0);
  
  // New state for custom app bar behavior
  const [scrollY, setScrollY] = useState(0);
  const [appBarOpacity, setAppBarOpacity] = useState(1);
  const [appBarBlur, setAppBarBlur] = useState(false);
  
  // Global header state - once hidden by scrolling, stays hidden until explicitly shown
  const [globalHeaderHidden, setGlobalHeaderHidden] = useState(false);
  
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
      // Exit fullscreen mode if active
      setShowFullPost(false);
      setSelectedPost(null);
      
      // Exit media mode and reset to normal view
      setIsMediaMode(false);
      setSelectedFilter('all');
      
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
  }));

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

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
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
      const cardHeight = Dimensions.get('window').height - 180;
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
  };

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
    setIsMediaMode(true);
  }, [selectedFilter]);

  // Handle exiting media mode
  const exitMediaMode = useCallback(() => {
    setIsMediaMode(false);
    setSelectedFilter(previousFilterRef.current); // Restore previous filter
    
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

  // MEMORY OPTIMIZATION: Memoize handlers
  const handleMediaItemPress = useCallback((post: PostCardProps) => {
    // If it's a Lucid post, navigate to dedicated fullscreen
    if (post.type === 'lucid') {
      (navigation as any).navigate('LucidFullscreen', {
        post: post
      });
    } else {
      // For regular posts, use existing fullscreen logic
      setSelectedPost(post);
      setShowFullPost(true);
    }
  }, [navigation]);

  // Handle back from full post
  const handleBackFromFullPost = useCallback(() => {
    setShowFullPost(false);
    setSelectedPost(null);
  }, []);

  // Handle travel details popup
  const handleShowTravelDetails = useCallback((post: PostCardProps) => {
    // Travel details are now handled within TravelFeedCard component
    console.log('Travel details for post:', post.id);
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

  // Render media grid item
  const renderMediaItem = (item: PostCardProps, index: number, columnWidth: number) => {
    const aspectRatio = 1.2 + Math.random() * 0.8; // Random aspect ratios between 1.2 and 2.0
    
    return (
      <MediaGridItem
        id={item.id}
        imageUri={item.images![0]}
        username={item.authorName}
        nationalityFlag={item.authorNationalityFlag}
        location={item.location}
        activityColor={item.activityColor}
        onPress={() => handleMediaItemPress(item)}
        columnWidth={columnWidth}
        aspectRatio={aspectRatio}
      />
    );
  };

  // Show full post view
  if (showFullPost && selectedPost) {
    const exploreHeaderComponent = (
      <View className="px-4 py-6">
        <Text className="text-2xl font-normal text-black mb-4">Explore</Text>
        <MasonryList
          data={postsWithImages.filter(p => p.id !== selectedPost.id)}
          renderItem={renderMediaItem}
          columns={2}
          spacing={12}
          bounces={false}
        />
      </View>
    );

    return (
      <FullPostView
        post={selectedPost}
        onBack={handleBackFromFullPost}
        bottomComponent={exploreHeaderComponent}
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
        
        {/* Fixed Minimal App Bar - Positioned at Safe Area Edge */}
        <View style={{
          height: 44, // Fixed height - exactly like the brown section
          backgroundColor: scrollY > 50 
            ? 'transparent' 
            : themeColors.background,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          borderBottomWidth: scrollY > 20 && scrollY < 50 ? 0.5 : 0,
          borderBottomColor: `${themeColors.border}20`,
        }}>
          {isMediaMode ? (
            // Back button - hidden when scrolling
            <TouchableOpacity 
              onPress={exitMediaMode}
              style={{ 
                width: 32, 
                height: 32, 
                alignItems: 'center', 
                justifyContent: 'center',
                borderRadius: 16,
                backgroundColor: scrollY > 20 ? `${themeColors.backgroundSecondary}40` : 'transparent',
                opacity: scrollY > 50 ? 0 : 1,
              }}
              activeOpacity={0.7}
            >
              <ArrowLeft size={18} color={themeColors.text} strokeWidth={2} />
            </TouchableOpacity>
          ) : (
            // Blinxus title - fades out when scrolling
            <Text style={{ 
              fontSize: 18, 
              fontWeight: '600', 
              color: themeColors.text,
              opacity: scrollY > 50 ? 0 : (scrollY > 20 ? 0.7 : 1.0),
            }}>
              Blinxus
            </Text>
          )}
          
          {!isMediaMode && (
            // Grid icon - fades out when scrolling
            <TouchableOpacity
              onPress={enterMediaMode}
              style={{ 
                width: 32, 
                height: 32, 
                alignItems: 'center', 
                justifyContent: 'center',
                borderRadius: 16,
                backgroundColor: scrollY > 20 
                  ? `${themeColors.backgroundSecondary}40` 
                  : `${themeColors.backgroundSecondary}20`,
                opacity: scrollY > 50 ? 0 : 1,
              }}
              activeOpacity={0.7}
            >
              <Grid3X3 
                size={20} 
                color={themeColors.text} 
                strokeWidth={2} 
              />
            </TouchableOpacity>
          )}
        </View>

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
          // Media Grid View
          <MasonryList
            data={postsWithImages}
            renderItem={renderMediaItem}
            columns={2}
            spacing={12}
            onScroll={handleScroll}
            scrollEventThrottle={32}
            contentContainerStyle={{ paddingBottom: 20 }}
            bounces={true}
          />
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
                    isVisible={true} // INSTANT GESTURES: Always visible so gestures work during transitions
                  />
                );
              } else {
                return item.type === 'lucid' ? 
                  <LucidPostCard {...item} /> : 
                  <PostCard {...item} />;
              }
            }}
            style={{ flex: 1, backgroundColor: themeColors.background }}
            showsVerticalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16} // OPTIMIZED: Changed from 1 to 16 for better performance
            bounces={true}
            pagingEnabled={isImmersiveFeedEnabled}
            snapToInterval={isImmersiveFeedEnabled ? Dimensions.get('window').height - 180 : undefined}
            snapToAlignment={isImmersiveFeedEnabled ? "end" : undefined}
            decelerationRate={isImmersiveFeedEnabled ? "fast" : "normal"}
            // INSTANT GESTURES: Allow simultaneous gestures during transitions
            scrollsToTop={false}
            disableIntervalMomentum={isImmersiveFeedEnabled ? true : false}
            // PERFORMANCE OPTIMIZATIONS
            removeClippedSubviews={true}
            maxToRenderPerBatch={2}
            windowSize={3}
            initialNumToRender={1}
            getItemLayout={isImmersiveFeedEnabled ? (data, index) => ({
              length: Dimensions.get('window').height - 180,
              offset: (Dimensions.get('window').height - 180) * index,
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
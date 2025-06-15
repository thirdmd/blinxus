import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, FlatList, NativeSyntheticEvent, NativeScrollEvent, Animated, StatusBar, TextInput } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { Search, ArrowLeft, Grid3X3 } from 'lucide-react-native';
import { activityTags, ActivityKey, activityNames } from '../../constants/activityTags';
import PillTag from '../../components/PillTag';
import { useNavigation } from '@react-navigation/native';
import { usePosts } from '../../store/PostsContext';
import { mapPostToCardProps, PostCardProps } from '../../types/structures/posts_structure';
import PostCard from '../../components/PostCard';
import LucidPostCard from '../../components/LucidPostCard';
import LucidAlbumView from '../../components/LucidAlbumView';
import MediaGridItem from '../../components/MediaGridItem';
import MasonryList from '../../components/MasonryList';
import FullPostView from '../../components/FullPostView';
import { useScrollContext } from '../../contexts/ScrollContext';

export interface ExploreScreenRef {
  resetToAll: () => void;
}

const ExploreScreen = forwardRef<ExploreScreenRef>((props, ref) => {
  const navigation = useNavigation();
  const { posts } = usePosts();
  const { exploreScrollRef } = useScrollContext();
  const [headerVisible, setHeaderVisible] = useState(true);
  const [fabVisible, setFabVisible] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<ActivityKey | 'all'>('all');
  const [isMediaMode, setIsMediaMode] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PostCardProps | null>(null);
  const [showFullPost, setShowFullPost] = useState(false);
  const lastScrollY = useRef(0);
  const fabAnimatedValue = useRef(new Animated.Value(1)).current;
  const fabOpacityValue = useRef(new Animated.Value(1)).current;
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
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

  // Expose reset function for double-tap
  useImperativeHandle(ref, () => ({
    resetToAll: () => {
      // Exit fullscreen mode if active
      setShowFullPost(false);
      setSelectedPost(null);
      
      // Exit media mode and reset to normal view
      setIsMediaMode(false);
      setSelectedFilter('all');
      
      // Scroll to top in normal view
      setTimeout(() => {
        if (exploreScrollRef?.current) {
          exploreScrollRef.current.scrollToOffset({ offset: 0, animated: true });
        }
      }, 100);
    },
  }));

  const cardPropsArray = posts.map(post => mapPostToCardProps(post));

  // Filter posts based on selected activity
  const filteredPosts = selectedFilter === 'all' 
    ? cardPropsArray 
    : cardPropsArray.filter(post => post.activity === selectedFilter);

  // Filter posts that have images for media mode
  const postsWithImages = filteredPosts.filter(post => post.images && post.images.length > 0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    
    // Store scroll position ONLY for current active filter (prevent contamination)
    if (isMediaMode) {
      // Only store for media mode if we're actually in media mode
      mediaScrollPositions.current[selectedFilter] = currentScrollY;
    } else {
      // Only store for normal mode if we're actually in normal mode
      scrollPositions.current[selectedFilter] = currentScrollY;
    }
    
    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
      // Scrolling down
      setHeaderVisible(false);
      setGlobalHeaderHidden(true); // Mark header as globally hidden
      setIsScrollingUp(false);
      if (fabVisible) {
        setFabVisible(false);
        Animated.timing(fabAnimatedValue, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
    } else if (currentScrollY <= 10) {
      // Only show header when actually at the very top (≤10px)
      setHeaderVisible(true);
      setGlobalHeaderHidden(false); // Reset global hidden state when at top
      setIsScrollingUp(false);
      if (!fabVisible) {
        setFabVisible(true);
        Animated.timing(fabAnimatedValue, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
      // Full opacity when at top
      Animated.timing(fabOpacityValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else if (lastScrollY.current - currentScrollY > 30) {
      // Show FAB when scrolling up significantly (>30px), but keep header hidden
      setIsScrollingUp(true);
      if (!fabVisible) {
        setFabVisible(true);
        Animated.timing(fabAnimatedValue, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }).start();
      }
      // Semi-transparent when scrolling up
      Animated.timing(fabOpacityValue, {
        toValue: 0.6,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
    
    // Set timeout to restore full opacity when scrolling stops
    scrollTimeoutRef.current = setTimeout(() => {
      if (isScrollingUp && currentScrollY > 10) {
        setIsScrollingUp(false);
        Animated.timing(fabOpacityValue, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
    }, 150);
    
    lastScrollY.current = currentScrollY;
  };

  // Handle filter selection with scroll position restoration and double-tap detection
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
  const enterMediaMode = () => {
    previousFilterRef.current = selectedFilter; // Store current filter
    setSelectedFilter('all'); // Always go to "All" in media mode
    setIsMediaMode(true);
  };

  // Handle exiting media mode
  const exitMediaMode = () => {
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
  };

  // Handle swipe gesture
  const onGestureEvent = (event: any) => {
    const { translationX, state } = event.nativeEvent;
    
    if (state === State.END) {
      if (translationX > 50 && !isMediaMode) {
        // Swipe right - switch to media mode
        enterMediaMode();
      } else if (translationX < -50 && isMediaMode && !showFullPost) {
        // Swipe left - switch back to normal mode
        exitMediaMode();
      }
    }
  };

  // Handle media item press
  const handleMediaItemPress = (post: PostCardProps) => {
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
  };

  // Handle back from full post
  const handleBackFromFullPost = () => {
    setShowFullPost(false);
    setSelectedPost(null);
  };

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
      <SafeAreaView className="flex-1 bg-white">
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        
        {/* Header - Minimal Design */}
        {headerVisible && (
          <View className="bg-white py-4 px-6">
            {isMediaMode ? (
              // Search bar for media mode - Minimal
              <View className="flex-row items-center">
                <TouchableOpacity 
                  onPress={exitMediaMode}
                  className="w-10 h-10 -ml-2 items-center justify-center"
                  activeOpacity={0.3}
                >
                  <ArrowLeft size={20} color="#000000" />
                </TouchableOpacity>
                <View className="flex-1 flex-row items-center border border-gray-200 rounded-full px-4 py-2.5 ml-2">
                  <Search size={18} color="#9CA3AF" />
                  <TextInput
                    placeholder="Search places..."
                    className="flex-1 ml-3 text-base text-black font-light"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>
            ) : (
              // Normal title with toggle button - Minimal
              <View className="flex-row items-center justify-between">
                <Text className="text-2xl font-normal text-black">Blinxus</Text>
                <TouchableOpacity
                  onPress={enterMediaMode}
                  className="w-10 h-10 items-center justify-center"
                  activeOpacity={0.3}
                >
                  <Grid3X3 size={24} color="#000000" strokeWidth={2} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* Pills Layer - Minimal */}
        <View className="bg-white pb-4">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24 }}>
            <View className="flex-row">
              {/* All Filter Pill */}
              <View className="mr-1.5">
                <PillTag
                  label="All"
                  color="#E5E7EB" // Light gray color for "All"
                  selected={selectedFilter === 'all'}
                  onPress={() => handleFilterSelect('all')}
                  alwaysFullColor={true}
                  size="medium"
                />
              </View>
              {activityTags.map((tag, index) => {
                const activityKey = activityKeyMap[tag.name];
                return (
                  <View key={tag.id} className="mr-1.5">
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
          // Normal Posts Feed
          <FlatList
            ref={exploreScrollRef}
            data={filteredPosts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => 
              item.type === 'lucid' ? 
                <LucidPostCard {...item} /> : 
                <PostCard {...item} />
            }
            className="flex-1"
            showsVerticalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            bounces={true}
          />
        )}

        {/* Floating Action Button - Minimal Design */}
        {!isMediaMode && (
          <Animated.View
            style={{
              position: 'absolute',
              bottom: 24,
              right: 24,
              opacity: fabAnimatedValue,
              transform: [
                {
                  scale: fabAnimatedValue,
                },
              ],
            }}
          >
            <Animated.View
              style={{
                opacity: fabOpacityValue,
              }}
            >
              <TouchableOpacity
                className="w-14 h-14 rounded-full bg-black justify-center items-center"
                onPress={() => navigation.navigate('CreatePost' as never)}
                activeOpacity={0.7}
              >
                <View className="w-5 h-0.5 bg-white absolute" />
                <View className="w-0.5 h-5 bg-white absolute" />
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        )}
      </SafeAreaView>
    </PanGestureHandler>
  );
});

export default ExploreScreen;
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  FlatList,
  ScrollView,
  Dimensions,
  Image,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Animated,
} from 'react-native';
import { ChevronLeft, Heart, Bookmark, Grid3X3, Map, Album } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { activityTags } from '../../constants/activityTags';
import { usePosts } from '../../store/PostsContext';
import { useSavedPosts } from '../../store/SavedPostsContext';
import { mapPostToCardProps, PostCardProps } from '../../types/structures/posts_structure';
import TravelFeedCard from '../../components/TravelFeedCard';
import MediaGridItem from '../../components/MediaGridItem';
import LucidAlbumView from '../../components/LucidAlbumView';
import { useThemeColors } from '../../hooks/useThemeColors';
import { useNavigation } from '@react-navigation/native';
import { getResponsiveDimensions, getTypographyScale, getSpacingScale, ri, rs, rf, RESPONSIVE_SCREEN, getTextStyles } from '../../utils/responsive';
import { 
  createAnimationValues, 
  FEED_ANIMATIONS, 
  runAnimation,
  ANIMATION_DURATIONS 
} from '../../utils/animations';

const { width, height: screenHeight } = RESPONSIVE_SCREEN;
const responsiveDimensions = getResponsiveDimensions();
const typography = getTypographyScale();
const spacing = getSpacingScale();

interface LibraryProps {
  onBackPress?: () => void;
}

export default function Library({ onBackPress }: LibraryProps = {}) {
  const themeColors = useThemeColors();
  const navigation = useNavigation();
  const responsiveDimensions = getResponsiveDimensions();
  const typography = getTypographyScale();
  const spacing = getSpacingScale();
  const textStyles = getTextStyles();
  
  // State for active tab
  const [activeTab, setActiveTab] = useState<'recent' | 'activities' | 'map'>('recent');
  
  // State for TravelFeedCard fullscreen view
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedPostIndex, setSelectedPostIndex] = useState(0);
  const [feedContext, setFeedContext] = useState<'recent' | 'activities'>('recent');
  const [selectedActivityCategory, setSelectedActivityCategory] = useState<string | null>(null); // Track which tab context
  
  // NEW: State for lucid album view
  const [showLucidAlbum, setShowLucidAlbum] = useState(false);
  const [selectedLucidPost, setSelectedLucidPost] = useState<PostCardProps | null>(null);
  
  // NEW: Animation values for Instagram-like transitions
  const animationValues = useRef(createAnimationValues()).current;
  
  // Scroll position tracking for Activities tab
  const [activitiesScrollPosition, setActivitiesScrollPosition] = useState(0);
  const activitiesScrollRef = useRef<FlatList>(null);
  
  // Scroll position tracking for Recent tab - Enhanced like ExploreScreen
  const [recentScrollPosition, setRecentScrollPosition] = useState(0);
  const recentScrollPositionRef = useRef(0); // Use ref for immediate access
  const recentScrollRef = useRef<ScrollView>(null);
  
  // App bar state management for Recent tab
  const [scrollY, setScrollY] = useState(0);
  const [appBarOpacity, setAppBarOpacity] = useState(1);
  const [appBarBlur, setAppBarBlur] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);
  
  // Get posts and saved posts
  const { posts } = usePosts();
  const { savedPostIds, savedPosts: savedPostsData } = useSavedPosts();
  
  // Filter to only saved posts and convert to PostCard props
  const savedPosts = posts.filter(post => savedPostIds.includes(post.id));
  const savedPostsProps = savedPosts.map(post => mapPostToCardProps(post));

  // Sort posts by save timestamp (most recently saved first)
  const sortedByRecent = [...savedPostsProps].sort((a, b) => {
    const aSaveData = savedPostsData.find(saved => saved.postId === a.id);
    const bSaveData = savedPostsData.find(saved => saved.postId === b.id);
    
    if (!aSaveData || !bSaveData) return 0;
    
    return new Date(bSaveData.savedAt).getTime() - new Date(aSaveData.savedAt).getTime();
  });

  // Helper function to get posts for an activity (only posts with activities)
  const getPostsForActivity = (activityName: string) => {
    const activityPosts = savedPostsProps.filter(post => post.activityName === activityName && post.activityColor);
    
    // Sort by save timestamp (most recently saved first)
    return activityPosts.sort((a, b) => {
      const aSaveData = savedPostsData.find(saved => saved.postId === a.id);
      const bSaveData = savedPostsData.find(saved => saved.postId === b.id);
      
      if (!aSaveData || !bSaveData) return 0;
      
      return new Date(bSaveData.savedAt).getTime() - new Date(aSaveData.savedAt).getTime();
    });
  };

  // Get unique activities that actually have posts (only posts with activities)
  const activitiesWithPosts = activityTags.filter(tag => {
    return savedPostsProps.some(post => post.activityName === tag.name && post.activityColor);
  });

  // Get all posts from activities tab (flattened)
  const allActivityPosts = activitiesWithPosts.reduce((acc: PostCardProps[], category) => {
    const postsInCategory = getPostsForActivity(category.name);
    return [...acc, ...postsInCategory];
  }, []);

  // Handle profile navigation - same logic as feeds
  const handleProfilePress = (authorName: string) => {
    if (authorName === 'Third Camacho') {
      // Navigate to current user's profile from Library
      (navigation as any).navigate('Profile', { 
        fromFeed: true,
        previousScreen: 'Library' 
      });
    } else {
      // Navigate to other user's profile (future implementation)
      // For now, could navigate to a generic UserProfile screen
      // (navigation as any).navigate('UserProfile', { 
      //   userId: authorId,
      //   fromFeed: true,
      //   previousScreen: 'Library' 
      // });
    }
  };

  // Handle post press with Instagram-like expand animation
  const handlePostPress = (post: PostCardProps, context: 'recent' | 'activities' = 'recent', categoryName?: string) => {
    // Store current scroll position - DIRECT like Profile
    if (context === 'recent') {
      const currentOffset = recentScrollPositionRef.current;
      setRecentScrollPosition(currentOffset);
    }
    
    let postsToShow: PostCardProps[];
    
    if (context === 'recent') {
      postsToShow = sortedByRecent;
    } else if (context === 'activities' && categoryName) {
      // For activities tab, only show posts from the specific category
      postsToShow = getPostsForActivity(categoryName);
      setSelectedActivityCategory(categoryName);
    } else {
      // Fallback to all activity posts
      postsToShow = allActivityPosts;
      setSelectedActivityCategory(null);
    }
    
    const postIndex = postsToShow.findIndex(p => p.id === post.id);
    setSelectedPostIndex(postIndex >= 0 ? postIndex : 0);
    setFeedContext(context);
    
    // Start expand animation and then show fullscreen
    runAnimation(
      FEED_ANIMATIONS.expand(animationValues),
      () => {
        setIsFullscreen(true);
      }
    );
  };

  // NEW: Handle lucid press - show lucid album view within same screen context
  const handleLucidPress = (post: PostCardProps) => {
    setSelectedLucidPost(post);
    setShowLucidAlbum(true);
  };

  // NEW: Handle back from lucid album view - return to scroll view
  const handleBackFromLucidAlbum = () => {
    setShowLucidAlbum(false);
    setSelectedLucidPost(null);
  };

  // Handle back from fullscreen with Instagram-like collapse animation
  const handleBackFromFullscreen = () => {
    // Start collapse animation first
    runAnimation(
      FEED_ANIMATIONS.collapse(animationValues),
      () => {
        // INSTANT back transition after animation
        setIsFullscreen(false);
        
        // EXACT same restoration approach as Profile
        const restoreScrollPosition = () => {
          if (feedContext === 'activities' && activitiesScrollRef.current) {
            activitiesScrollRef.current.scrollToOffset({ 
              offset: activitiesScrollPosition, 
              animated: false 
            });
          } else if (feedContext === 'recent' && recentScrollRef.current) {
            // Always restore position, even if it's 0 (top of scroll)
            recentScrollRef.current.scrollTo({ 
              y: recentScrollPosition, 
              animated: false 
            });
          }
        };
        
        // Use EXACT same restoration attempts as Profile for maximum reliability
        // Immediate attempt
        setTimeout(restoreScrollPosition, 0);
        
        // Secondary attempt after next frame
        requestAnimationFrame(() => {
          setTimeout(restoreScrollPosition, 0);
        });
        
        // Final attempt after a short delay
        setTimeout(restoreScrollPosition, 100);
        
        setSelectedActivityCategory(null); // Reset category selection
      }
    );
  };

  // Render item for Activities Tab (grid-based) - needs category context
  const renderActivityPostItem = (categoryName: string) => ({ item }: { item: PostCardProps }) => (
    <MediaGridItem
      imageUri={item.images![0]}
      isLucid={item.type === 'lucid'}
      onPress={() => handlePostPress(item, 'activities', categoryName)}
    />
  );

  // Enhanced scroll handler for Recent tab - Same as ExploreScreen
  const handleRecentScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    setScrollY(currentScrollY);
    
    // Calculate dynamic app bar opacity and blur based on scroll
    const scrollThreshold = 100;
    const opacity = Math.max(0.3, 1 - (currentScrollY / scrollThreshold));
    const shouldBlur = currentScrollY > 50;
    
    setAppBarOpacity(opacity);
    setAppBarBlur(shouldBlur);
    
    // Update both state and ref for immediate access
    setRecentScrollPosition(currentScrollY);
    recentScrollPositionRef.current = currentScrollY;
    
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

  // Render Recent Tab
  const renderRecentTab = () => {
    if (sortedByRecent.length === 0) {
      return (
        <View style={{ 
          flex: 1, 
          alignItems: 'center', 
          justifyContent: 'center', 
          paddingHorizontal: 32 
        }}>
          <View style={{ 
            width: 80, 
            height: 80, 
            backgroundColor: themeColors.backgroundSecondary, 
            borderRadius: 40, 
            alignItems: 'center', 
            justifyContent: 'center', 
            marginBottom: 24 
          }}>
            <Bookmark size={32} color={themeColors.textSecondary} strokeWidth={1.5} />
          </View>
          <Text style={{ 
            fontSize: 20, 
            fontWeight: '400', 
            color: themeColors.text, 
            marginBottom: 12, 
            textAlign: 'center' 
          }}>
            No saved posts yet
          </Text>
          <Text style={{ 
            color: themeColors.textSecondary, 
            textAlign: 'center', 
            lineHeight: 24, 
            fontWeight: '300' 
          }}>
            Posts you save will appear here. Tap the bookmark icon on any post to save it to your library.
          </Text>
        </View>
      );
    }

    return (
      <ScrollView 
        ref={recentScrollRef}
        showsVerticalScrollIndicator={false}
        onScroll={handleRecentScroll}
        scrollEventThrottle={1}
        bounces={true}
        removeClippedSubviews={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ 
          flexDirection: 'row', 
          flexWrap: 'wrap', 
          paddingBottom: 32 
        }}>
          {sortedByRecent.map((post) => (
            <MediaGridItem
              key={post.id}
              imageUri={post.images![0]}
              isLucid={post.type === 'lucid'}
              onPress={() => handlePostPress(post, 'recent')}
            />
          ))}
        </View>
      </ScrollView>
    );
  };

  // Render Activities Tab
  const renderActivitiesTab = () => {
    if (activitiesWithPosts.length === 0) {
      return (
        <View style={{ 
          flex: 1, 
          alignItems: 'center', 
          justifyContent: 'center', 
          paddingHorizontal: 32 
        }}>
          <View style={{ 
            width: 80, 
            height: 80, 
            backgroundColor: themeColors.backgroundSecondary, 
            borderRadius: 40, 
            alignItems: 'center', 
            justifyContent: 'center', 
            marginBottom: 24 
          }}>
            <Grid3X3 size={32} color={themeColors.textSecondary} strokeWidth={1.5} />
          </View>
          <Text style={{ 
            fontSize: 20, 
            fontWeight: '400', 
            color: themeColors.text, 
            marginBottom: 12, 
            textAlign: 'center' 
          }}>
            No activities yet
          </Text>
          <Text style={{ 
            color: themeColors.textSecondary, 
            textAlign: 'center', 
            lineHeight: 24, 
            fontWeight: '300' 
          }}>
            Your saved posts will be organized by activity type here.
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        ref={activitiesScrollRef}
        data={activitiesWithPosts}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 8, paddingHorizontal: 16 }}
        onScroll={(event: NativeSyntheticEvent<NativeScrollEvent>) => {
          setActivitiesScrollPosition(event.nativeEvent.contentOffset.y);
        }}
        scrollEventThrottle={1}
        getItemLayout={(data, index) => ({
          length: 120,
          offset: 120 * index,
          index,
        })}
        removeClippedSubviews={true}
        initialNumToRender={8}
        maxToRenderPerBatch={10}
        windowSize={12}
        renderItem={({ item: category }) => {
          const postsInCategory = getPostsForActivity(category.name);
          
          return (
            <View className="mb-8">
              {/* Category Header */}
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center">
                  <View 
                    className="w-4 h-4 rounded-full mr-3"
                    style={{ backgroundColor: category.color }}
                  />
                  <Text 
                    className="font-normal text-lg"
                    style={{ color: themeColors.text }}
                  >
                    {category.name}
                  </Text>
                </View>
                <View style={{ 
                  backgroundColor: themeColors.backgroundSecondary, 
                  paddingHorizontal: 12, 
                  paddingVertical: 4, 
                  borderRadius: 12 
                }}>
                  <Text style={{ 
                    fontSize: 14, 
                    color: themeColors.textSecondary, 
                    fontWeight: '300' 
                  }}>
                    {postsInCategory.length}
                  </Text>
                </View>
              </View>
              
              {/* Posts Horizontal Scroll */}
              <FlatList
                data={postsInCategory}
                renderItem={renderActivityPostItem(category.name)}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 0 }}
                ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
              />
            </View>
          );
        }}
      />
    );
  };

  // Render Map Tab
  const renderMapTab = () => {
    if (savedPostsProps.length === 0) {
      return (
        <View style={{ 
          flex: 1, 
          alignItems: 'center', 
          justifyContent: 'center', 
          paddingHorizontal: 32 
        }}>
          <View style={{ 
            width: 80, 
            height: 80, 
            backgroundColor: themeColors.backgroundSecondary, 
            borderRadius: 40, 
            alignItems: 'center', 
            justifyContent: 'center', 
            marginBottom: 24 
          }}>
            <Map size={32} color={themeColors.textSecondary} strokeWidth={1.5} />
          </View>
          <Text style={{ 
            fontSize: 20, 
            fontWeight: '400', 
            color: themeColors.text, 
            marginBottom: 12, 
            textAlign: 'center' 
          }}>
            No saved posts
          </Text>
          <Text style={{ 
            color: themeColors.textSecondary, 
            textAlign: 'center', 
            lineHeight: 24, 
            fontWeight: '300' 
          }}>
            Saved posts with locations will appear on the map here.
          </Text>
        </View>
      );
    }

    return (
      <View style={{ 
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: 32 
      }}>
        <View style={{ 
          width: 80, 
          height: 80, 
          backgroundColor: themeColors.backgroundSecondary, 
          borderRadius: 40, 
          alignItems: 'center', 
          justifyContent: 'center', 
          marginBottom: 24 
        }}>
          <Map size={32} color={themeColors.textSecondary} strokeWidth={1.5} />
        </View>
        <Text style={{ 
          fontSize: 20, 
          fontWeight: '400', 
          color: themeColors.text, 
          marginBottom: 12, 
          textAlign: 'center' 
        }}>
          Map View
        </Text>
        <Text style={{ 
          color: themeColors.textSecondary, 
          textAlign: 'center', 
          lineHeight: 24, 
          fontWeight: '300' 
        }}>
          Your saved posts displayed on an interactive map
        </Text>
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
    let postsToShow: PostCardProps[];
    
    if (feedContext === 'recent') {
      postsToShow = sortedByRecent;
    } else if (feedContext === 'activities' && selectedActivityCategory) {
      // For activities tab with specific category, only show posts from that category
      postsToShow = getPostsForActivity(selectedActivityCategory);
    } else {
      // Fallback to all activity posts
      postsToShow = allActivityPosts;
    }

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
            data={postsToShow}
            renderItem={({ item }) => (
              <TravelFeedCard 
                {...item} 
                onDetailsPress={() => {}}
                onLucidPress={item.type === 'lucid' ? () => handleLucidPress(item) : undefined}
                isVisible={true}
              />
            )}
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

  // Otherwise render the main library screen
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
      <StatusBar 
        barStyle={themeColors.isDark ? "light-content" : "dark-content"} 
        backgroundColor={themeColors.background} 
      />
      
      {/* Dynamic App Bar - Back button moved to far left corner */}
      <View style={{
        height: responsiveDimensions.appBar.height,
        backgroundColor: activeTab === 'recent' 
          ? (scrollY > 50 ? 'transparent' : themeColors.background)
          : themeColors.background,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: rs(8), // Minimal left padding to reach corner
        paddingRight: responsiveDimensions.appBar.paddingHorizontal,
        borderBottomWidth: activeTab === 'recent' && scrollY > 20 && scrollY < 50 ? rs(0.5) : 0,
        borderBottomColor: `${themeColors.border}20`,
      }}>
        {/* Back button - Far left corner */}
        <TouchableOpacity
          onPress={onBackPress}
          style={{ 
            width: responsiveDimensions.button.small.width, 
            height: responsiveDimensions.button.small.height, 
            alignItems: 'center', 
            justifyContent: 'center',
            borderRadius: rs(16),
            backgroundColor: activeTab === 'recent' && scrollY > 20 
              ? `${themeColors.backgroundSecondary}40` 
              : 'transparent',
            opacity: activeTab === 'recent' && scrollY > 50 ? 0 : 1,
          }}
          activeOpacity={0.7}
        >
          <ChevronLeft size={ri(18)} color={themeColors.text} strokeWidth={2} />
        </TouchableOpacity>
        
        {/* Library title - perfectly centered */}
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ 
            ...textStyles.libraryTitle, 
            fontWeight: '600', 
            color: themeColors.text,
            opacity: activeTab === 'recent' 
              ? (scrollY > 50 ? 0 : (scrollY > 20 ? 0.7 : 1.0))
              : 1.0,
          }}>
            Library
          </Text>
        </View>

        {/* Right spacer to balance the back button */}
        <View style={{ 
          width: responsiveDimensions.button.small.width, 
          height: responsiveDimensions.button.small.height,
        }} />
      </View>

      {/* Tab Navigation - Clean design */}
      <View style={{ backgroundColor: themeColors.background }}>
        <View style={{ flexDirection: 'row', paddingHorizontal: 24 }}>
          <TouchableOpacity 
            style={{ flex: 1, paddingVertical: 16 }}
            onPress={() => setActiveTab('recent')}
            activeOpacity={0.6}
          >
            <Text
              style={{
                textAlign: 'center',
                ...textStyles.tabLabel,
                fontWeight: '400',
                color: activeTab === 'recent' ? themeColors.text : themeColors.textSecondary
              }}
            >
              Recent
            </Text>
            {activeTab === 'recent' && (
              <View style={{ 
                width: '100%', 
                height: 2, 
                backgroundColor: themeColors.text, 
                marginTop: 12 
              }} />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={{ flex: 1, paddingVertical: 16 }}
            onPress={() => setActiveTab('activities')}
            activeOpacity={0.6}
          >
            <Text
              style={{
                textAlign: 'center',
                ...textStyles.tabLabel,
                fontWeight: '400',
                color: activeTab === 'activities' ? themeColors.text : themeColors.textSecondary
              }}
            >
              Activities
            </Text>
            {activeTab === 'activities' && (
              <View style={{ 
                width: '100%', 
                height: 2, 
                backgroundColor: themeColors.text, 
                marginTop: 12 
              }} />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={{ flex: 1, paddingVertical: 16 }}
            onPress={() => setActiveTab('map')}
            activeOpacity={0.6}
          >
            <Text
              style={{
                textAlign: 'center',
                ...textStyles.tabLabel,
                fontWeight: '400',
                color: activeTab === 'map' ? themeColors.text : themeColors.textSecondary
              }}
            >
              Map
            </Text>
            {activeTab === 'map' && (
              <View style={{ 
                width: '100%', 
                height: 2, 
                backgroundColor: themeColors.text, 
                marginTop: 12 
              }} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Content */}
      <View className="flex-1">
        {activeTab === 'recent' && renderRecentTab()}
        {activeTab === 'activities' && renderActivitiesTab()}
        {activeTab === 'map' && renderMapTab()}
      </View>
    </SafeAreaView>
  );
}
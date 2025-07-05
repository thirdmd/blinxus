import React, { useState, useRef, useEffect, useMemo } from 'react';
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
import { ChevronLeft, Heart, Bookmark, Grid3X3, Map, Album, Clock, Activity, MoreHorizontal, MessageCircle, Send, MapPin, Calendar, User, Zap, Eye, Shuffle, TrendingUp, Star, Users, Camera, Image as ImageIcon } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { activityTags, activityColors, ActivityKey } from '../../constants/activityTags';
import { usePosts } from '../../store/PostsContext';
import { useSavedPosts } from '../../store/SavedPostsContext';
import { useLikedPosts } from '../../store/LikedPostsContext';
import { mapPostToCardProps, PostCardProps } from '../../types/structures/posts_structure';
import TravelFeedCard from '../../components/TravelFeedCard';
import MediaGridItem from '../../components/MediaGridItem';

import FullscreenView from '../../components/FullscreenView';
import { useThemeColors } from '../../hooks/useThemeColors';
import { useNavigation, NavigationProp, ParamListBase } from '@react-navigation/native';
import { getResponsiveDimensions, getTypographyScale, getSpacingScale, ri, rs, rf, RESPONSIVE_SCREEN, getTextStyles } from '../../utils/responsive';
import useFullscreenManager from '../../hooks/useFullscreenManager';
import NavigationManager from '../../utils/navigationManager';
import FilterPills from '../../components/FilterPills';
import UserProfileNavigation from '../../utils/userProfileNavigation';

const { width, height: screenHeight } = RESPONSIVE_SCREEN;
const responsiveDimensions = getResponsiveDimensions();
const typography = getTypographyScale();
const spacing = getSpacingScale();

interface LibraryProps {
  onBackPress?: () => void;
}

export default function Library({ onBackPress }: LibraryProps = {}) {
  const themeColors = useThemeColors();
  const navigation = useNavigation() as NavigationProp<ParamListBase>;
  const textStyles = getTextStyles();
  
  // State for active tab
  const [activeTab, setActiveTab] = useState<'recent' | 'activities' | 'map'>('recent');
  
  // Centralized fullscreen management
  const fullscreenManager = useFullscreenManager();
  
  // State for feed context and category selection
  const [feedContext, setFeedContext] = useState<'recent' | 'activities'>('recent');
  const [selectedActivityCategory, setSelectedActivityCategory] = useState<string | null>(null);
  
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
  const { likedPosts } = useLikedPosts();
  
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

  // Handle profile navigation using centralized navigation
  const handleProfilePress = (authorName: string, authorId?: string) => {
    const { handleTravelFeedProfile } = UserProfileNavigation.createHandlersForScreen(navigation as any, 'Library');
    handleTravelFeedProfile({
      authorId,
      authorName
    });
  };

  // Handle post press with centralized fullscreen manager
  const handlePostPress = (post: PostCardProps, context: 'recent' | 'activities', categoryName?: string) => {
    // Store current scroll position
    if (context === 'recent') {
      const currentOffset = recentScrollPositionRef.current;
      setRecentScrollPosition(currentOffset);
    }
    
    let postsToShow: PostCardProps[];
    let scrollRef: React.RefObject<any>;
    let scrollPosition: number;
    
    if (context === 'recent') {
      postsToShow = sortedByRecent;
      scrollRef = recentScrollRef;
      scrollPosition = recentScrollPosition;
    } else if (context === 'activities' && categoryName) {
      // For activities tab, only show posts from the specific category
      postsToShow = getPostsForActivity(categoryName);
      setSelectedActivityCategory(categoryName);
      scrollRef = activitiesScrollRef;
      scrollPosition = activitiesScrollPosition;
    } else {
      // Fallback to all activity posts
      postsToShow = allActivityPosts;
      setSelectedActivityCategory(null);
      scrollRef = activitiesScrollRef;
      scrollPosition = activitiesScrollPosition;
    }
    
    setFeedContext(context);
    
    // Use centralized fullscreen manager
    fullscreenManager.handlePostPress(post, postsToShow, {
      screenName: 'Library',
      feedContext: context,
      scrollPosition,
      setScrollPosition: context === 'recent' ? setRecentScrollPosition : setActivitiesScrollPosition,
      scrollRef,
      onBackCustom: () => {
        setSelectedActivityCategory(null); // Reset category selection
      }
    });
  };

  // Handle activity selection
  const handleActivitySelect = (activityName: string) => {
    // Filter posts by selected activity
    const filteredPosts = getPostsForActivity(activityName);
    setSelectedActivityCategory(activityName);
  };

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
          justifyContent: 'flex-start', 
          paddingHorizontal: 32,
          paddingTop: 120 // Position content lower to match other tabs
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
            fontSize: 18, 
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
          justifyContent: 'flex-start', 
          paddingHorizontal: 32,
          paddingTop: 120 // Position content lower
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
            fontSize: 18, 
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
                renderItem={({ item }) => (
                  <MediaGridItem
                    imageUri={item.images![0]}
                    isLucid={item.type === 'lucid'}
                    onPress={() => handlePostPress(item, 'activities', category.name)}
                  />
                )}
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
    return (
      <View style={{ 
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'flex-start', 
        padding: 32,
        paddingTop: 120 // Position content lower
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
          fontSize: 18, 
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

  // Show fullscreen modal when active
  if (fullscreenManager.isFullscreen && fullscreenManager.currentConfig) {
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
      <FullscreenView
        visible={fullscreenManager.isFullscreen}
        posts={postsToShow}
        selectedPostIndex={fullscreenManager.selectedPostIndex}
        animationValues={fullscreenManager.animationValues}
        config={fullscreenManager.currentConfig}
        onBack={fullscreenManager.exitFullscreen}
        onLucidPress={fullscreenManager.handleLucidPress}
        navigation={navigation}
      />
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

      {/* Tab Navigation - Modern Icon Design */}
      <View style={{ backgroundColor: themeColors.background }}>
        <View style={{ flexDirection: 'row', paddingHorizontal: rs(32), paddingVertical: rs(8) }}>
          <TouchableOpacity 
            style={{ 
              flex: 1, 
              paddingVertical: rs(16),
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onPress={() => setActiveTab('recent')}
            activeOpacity={0.6}
          >
            <Clock 
              size={ri(22)} 
              color={activeTab === 'recent' ? themeColors.text : themeColors.textSecondary}
              strokeWidth={activeTab === 'recent' ? 2.2 : 1.8}
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={{ 
              flex: 1, 
              paddingVertical: rs(16),
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onPress={() => setActiveTab('activities')}
            activeOpacity={0.6}
          >
            <Activity 
              size={ri(22)} 
              color={activeTab === 'activities' ? themeColors.text : themeColors.textSecondary}
              strokeWidth={activeTab === 'activities' ? 2.2 : 1.8}
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={{ 
              flex: 1, 
              paddingVertical: rs(16),
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onPress={() => setActiveTab('map')}
            activeOpacity={0.6}
          >
            <Map 
              size={ri(22)} 
              color={activeTab === 'map' ? themeColors.text : themeColors.textSecondary}
              strokeWidth={activeTab === 'map' ? 2.2 : 1.8}
            />
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
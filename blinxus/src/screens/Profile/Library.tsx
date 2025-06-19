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
} from 'react-native';
import { ChevronLeft, Heart, Bookmark, Grid3X3, Map, Album } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { activityTags } from '../../constants/activityTags';
import { usePosts } from '../../store/PostsContext';
import { useSavedPosts } from '../../store/SavedPostsContext';
import { mapPostToCardProps, PostCardProps } from '../../types/structures/posts_structure';
import TravelFeedCard from '../../components/TravelFeedCard';
import MediaGridItem from '../../components/MediaGridItem';
import { useThemeColors } from '../../hooks/useThemeColors';

const { width, height: screenHeight } = Dimensions.get('window');

interface LibraryProps {
  onBackPress?: () => void;
}

export default function Library({ onBackPress }: LibraryProps = {}) {
  const themeColors = useThemeColors();
  
  // State for active tab
  const [activeTab, setActiveTab] = useState<'recent' | 'activities' | 'map'>('recent');
  
  // State for TravelFeedCard fullscreen view
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedPostIndex, setSelectedPostIndex] = useState(0);
  const [feedContext, setFeedContext] = useState<'recent' | 'activities'>('recent');
  const [selectedActivityCategory, setSelectedActivityCategory] = useState<string | null>(null); // Track which tab context
  
  // Scroll position tracking for Activities tab
  const [activitiesScrollPosition, setActivitiesScrollPosition] = useState(0);
  const activitiesScrollRef = useRef<FlatList>(null);
  
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





  // Handle post press - navigate to TravelFeedCard view with context
  const handlePostPress = (post: PostCardProps, context: 'recent' | 'activities' = 'recent', categoryName?: string) => {
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
    setIsFullscreen(true);
  };

  // Handle back from fullscreen
  const handleBackFromFullscreen = () => {
    setIsFullscreen(false);
    
    // Restore scroll position for Activities tab after a short delay
    if (feedContext === 'activities' && activitiesScrollRef.current && activitiesScrollPosition > 0) {
      setTimeout(() => {
        activitiesScrollRef.current?.scrollToOffset({ 
          offset: activitiesScrollPosition, 
          animated: false 
        });
      }, 100);
    }
    
    setSelectedActivityCategory(null); // Reset category selection
  };





  // Render item for Activities Tab (grid-based) - needs category context
  const renderActivityPostItem = (categoryName: string) => ({ item }: { item: PostCardProps }) => (
    <View style={{ width: width / 3 - 8 }}>
      <MediaGridItem
        imageUri={item.images![0]}
        isLucid={item.type === 'lucid'}
        onPress={() => handlePostPress(item, 'activities', categoryName)}
      />
    </View>
  );

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
      <ScrollView showsVerticalScrollIndicator={false}>
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
        scrollEventThrottle={16}
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

  // If in fullscreen mode, show TravelFeedCard view
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
        
        {/* Back Button Header */}
        <View style={{ 
          position: 'absolute', 
          top: 50, 
          left: 16, 
          zIndex: 1000,
          width: 32, 
          height: 32, 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: themeColors.isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)',
          borderWidth: 0.5,
          borderColor: themeColors.isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)',
          borderRadius: 16
        }}>
          <TouchableOpacity
            onPress={handleBackFromFullscreen}
            style={{ 
              width: 32, 
              height: 32, 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <ChevronLeft size={20} color="white" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        {/* TravelFeedCard ScrollView */}
        <ScrollView 
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          decelerationRate="normal"
          contentOffset={{ x: 0, y: selectedPostIndex * (screenHeight - 180) }}
        >
          {postsToShow.map((post, index) => {
            const postCardProps = post;
            return (
              <TravelFeedCard 
                key={post.id} 
                {...postCardProps} 
                onDetailsPress={() => {}}
                isVisible={true}
              />
            );
          })}
        </ScrollView>
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
      
      {/* Header - Modern minimalist */}
      <View style={{ 
        backgroundColor: themeColors.background, 
        paddingHorizontal: 24, 
        paddingVertical: 16 
      }}>
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          justifyContent: 'space-between' 
        }}>
          <TouchableOpacity
            onPress={onBackPress}
            style={{ 
              width: 40, 
              height: 40, 
              alignItems: 'center', 
              justifyContent: 'center', 
              marginLeft: -8 
            }}
            activeOpacity={0.6}
          >
            <ChevronLeft size={24} color={themeColors.text} strokeWidth={2} />
          </TouchableOpacity>
          
          <Text style={{ 
            fontSize: 20, 
            fontWeight: '400', 
            color: themeColors.text 
          }}>
            Library
          </Text>
          
          <View style={{ width: 40 }} />
        </View>
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
                fontWeight: '300',
                fontSize: 16,
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
                fontWeight: '300',
                fontSize: 16,
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
                fontWeight: '300',
                fontSize: 16,
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
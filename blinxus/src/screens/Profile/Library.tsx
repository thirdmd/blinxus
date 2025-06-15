import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  FlatList,
  Dimensions,
  Image,
} from 'react-native';
import { ChevronLeft, Heart, Bookmark, Grid3X3, Map } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { activityTags } from '../../constants/activityTags';
import { usePosts } from '../../store/PostsContext';
import { useSavedPosts } from '../../store/SavedPostsContext';
import { mapPostToCardProps, PostCardProps } from '../../types/structures/posts_structure';

const { width } = Dimensions.get('window');

interface LibraryProps {
  onBackPress?: () => void;
}

export default function Library({ onBackPress }: LibraryProps = {}) {
  // State for active tab
  const [activeTab, setActiveTab] = useState<'recent' | 'activities' | 'map'>('recent');
  
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

  // Get unique activities that actually have posts (only posts with activities)
  const activitiesWithPosts = activityTags.filter(tag => {
    return savedPostsProps.some(post => post.activityName === tag.name && post.activityColor);
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

  // Dynamic Library Post Card for Recent Tab - Pinterest-style with flexible heights
  const DynamicLibraryPostCard = ({ post, onPress }: { post: PostCardProps; onPress: () => void }) => {
    // Calculate dynamic height for text posts based on content length
    const getTextLines = (content: string) => {
      if (!content) return 1;
      
      // Count actual line breaks first
      const explicitLines = content.split('\n').length;
      
      // Estimate wrapped lines based on character count (approximately 40 chars per line on mobile)
      const charsPerLine = 40;
      const estimatedWrappedLines = Math.ceil(content.length / charsPerLine);
      
      // Use the higher of the two estimates, but cap at reasonable max
      const totalLines = Math.max(explicitLines, estimatedWrappedLines);
      return Math.min(totalLines, 8); // Max 8 lines
    };

    return (
      <TouchableOpacity 
        onPress={onPress}
        className="bg-white rounded-xl overflow-hidden mb-3"
        style={{ 
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 4,
          elevation: 3,
        }}
        activeOpacity={0.9}
      >
        {/* Image Section */}
        {post.images && post.images.length > 0 ? (
          <View className="relative">
            <Image 
              source={{ uri: post.images[0] }}
              className="w-full"
              style={{ height: 180 + Math.random() * 120 }} // Random height between 180-300
              resizeMode="cover"
            />
            
            {/* Location Pill - Top Left */}
            <View className="absolute top-3 left-3">
              <View 
                className="px-2 py-0.5 rounded-full"
                style={{ 
                  backgroundColor: post.activityColor || 'rgba(255,255,255,0.9)',
                  borderWidth: post.activityColor ? 0 : 0.5,
                  borderColor: post.activityColor ? 'transparent' : '#000000'
                }}
              >
                <Text 
                  className="text-xs font-medium"
                  style={{ 
                    color: post.activityColor ? 'white' : '#000000'
                  }}
                  numberOfLines={1}
                >
                  {post.location.split(',')[0]}
                </Text>
              </View>
            </View>
            
            {/* Gradient Overlay for better text visibility */}
            <View 
              className="absolute bottom-0 left-0 right-0 h-12"
              style={{
                backgroundColor: 'rgba(0,0,0,0.25)',
              }}
            />
            
            {/* Bottom Info */}
            <View className="absolute bottom-0 left-0 right-0 p-3 flex-row items-center justify-between">
              <Text className="text-white text-sm font-medium flex-1 mr-2" numberOfLines={1}>
                {post.authorName}
              </Text>
              
              <View className="flex-row items-center">
                <Heart size={14} color="#FFFFFF" fill="none" strokeWidth={2} />
                <Text className="text-white text-xs ml-1 font-medium">{post.likes}</Text>
              </View>
            </View>
          </View>
        ) : (
          /* Text-only post - Dynamic height based on content */
          <View style={{ minHeight: Math.max(120, 80 + (getTextLines(post.content || '') * 18)) }}>
            <View className="p-4">
              {/* Location Pill */}
              <View 
                className="px-2 py-0.5 rounded-full self-start mb-3"
                style={{ 
                  backgroundColor: post.activityColor || 'transparent',
                  borderWidth: post.activityColor ? 0 : 0.5,
                  borderColor: post.activityColor ? 'transparent' : '#000000'
                }}
              >
                <Text 
                  className="text-xs font-medium"
                  style={{ 
                    color: post.activityColor ? 'white' : '#000000'
                  }}
                  numberOfLines={1}
                >
                  {post.location.split(',')[0]}
                </Text>
              </View>
              
              {/* Content - Dynamic lines */}
              <Text 
                className="text-gray-800 text-base leading-6 mb-3"
                numberOfLines={getTextLines(post.content || '')}
                ellipsizeMode="tail"
              >
                {post.content}
              </Text>
              
              {/* Bottom Info */}
              <View className="flex-row items-center justify-between">
                <Text className="text-gray-600 text-sm font-medium flex-1 mr-2" numberOfLines={1}>
                  {post.authorName}
                </Text>
                
                <View className="flex-row items-center">
                  <Heart size={14} color="#6B7280" fill="none" strokeWidth={1.5} />
                  <Text className="text-gray-600 text-xs ml-1">{post.likes}</Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // Fixed Height Library Post Card for Activities Tab - Existing design
  const FixedLibraryPostCard = ({ post, onPress }: { post: PostCardProps; onPress: () => void }) => (
    <TouchableOpacity 
      onPress={onPress}
      className="bg-white rounded-xl overflow-hidden mb-3"
      style={{ 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
        height: 280, // Fixed height for uniform sizing
      }}
      activeOpacity={0.9}
    >
      {/* Image Section */}
      {post.images && post.images.length > 0 ? (
        <View className="relative h-full">
          <Image 
            source={{ uri: post.images[0] }}
            className="w-full h-full"
            resizeMode="cover"
          />
          
          {/* Location Pill - Top Left */}
          <View className="absolute top-3 left-3">
            <View 
              className="px-2 py-0.5 rounded-full"
              style={{ 
                backgroundColor: post.activityColor || 'rgba(255,255,255,0.9)',
                borderWidth: post.activityColor ? 0 : 0.5,
                borderColor: post.activityColor ? 'transparent' : '#000000'
              }}
            >
              <Text 
                className="text-xs font-medium"
                style={{ 
                  color: post.activityColor ? 'white' : '#000000'
                }}
                numberOfLines={1}
              >
                {post.location.split(',')[0]}
              </Text>
            </View>
          </View>
          
          {/* Gradient Overlay for better text visibility */}
          <View 
            className="absolute bottom-0 left-0 right-0 h-12"
            style={{
              backgroundColor: 'rgba(0,0,0,0.25)',
            }}
          />
          
          {/* Bottom Info */}
          <View className="absolute bottom-0 left-0 right-0 p-3 flex-row items-center justify-between">
            <Text className="text-white text-sm font-medium flex-1 mr-2" numberOfLines={1}>
              {post.authorName}
            </Text>
            
            <View className="flex-row items-center">
              <Heart size={14} color="#FFFFFF" fill="none" strokeWidth={2} />
              <Text className="text-white text-xs ml-1 font-medium">{post.likes}</Text>
            </View>
          </View>
        </View>
      ) : (
        /* Text-only post - Full height utilization */
        <View className="p-4 h-full flex">
          {/* Location Pill */}
          <View 
            className="px-2 py-0.5 rounded-full self-start mb-3"
            style={{ 
              backgroundColor: post.activityColor || 'transparent',
              borderWidth: post.activityColor ? 0 : 0.5,
              borderColor: post.activityColor ? 'transparent' : '#000000'
            }}
          >
            <Text 
              className="text-xs font-medium"
              style={{ 
                color: post.activityColor ? 'white' : '#000000'
              }}
              numberOfLines={1}
            >
              {post.location.split(',')[0]}
            </Text>
          </View>
          
          {/* Content - Fills available space */}
          <Text 
            className="text-gray-800 text-base leading-6 flex-1"
            numberOfLines={8}
            ellipsizeMode="tail"
          >
            {post.content}
          </Text>
          
          {/* Bottom Info */}
          <View className="flex-row items-center justify-between mt-3">
            <Text className="text-gray-600 text-sm font-medium flex-1 mr-2" numberOfLines={1}>
              {post.authorName}
            </Text>
            
            <View className="flex-row items-center">
              <Heart size={14} color="#6B7280" fill="none" strokeWidth={1.5} />
              <Text className="text-gray-600 text-xs ml-1">{post.likes}</Text>
            </View>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );

  // Handle post press - for now just log, later can navigate to full post
  const handlePostPress = (post: PostCardProps) => {
    console.log('Navigating to post:', post.id);
    // TODO: Add navigation to full post view
  };

  // Render item for Recent Tab FlatList (2 columns with dynamic height)
  const renderRecentPostItem = ({ item }: { item: PostCardProps }) => (
    <View style={{ width: (width - 32) / 2, marginHorizontal: 4 }}>
      <DynamicLibraryPostCard post={item} onPress={() => handlePostPress(item)} />
    </View>
  );

  // Render item for Activities Tab (fixed height)
  const renderActivityPostItem = ({ item }: { item: PostCardProps }) => (
    <View style={{ width: width / 2 - 8 }}>
      <FixedLibraryPostCard post={item} onPress={() => handlePostPress(item)} />
    </View>
  );

  // Render Recent Tab
  const renderRecentTab = () => {
    if (sortedByRecent.length === 0) {
      return (
        <View className="flex-1 items-center justify-center px-8">
          <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-6">
            <Bookmark size={32} color="#9CA3AF" strokeWidth={1.5} />
          </View>
          <Text className="text-xl font-normal text-gray-900 mb-3 text-center">No saved posts yet</Text>
          <Text className="text-gray-500 text-center leading-6 font-light">
            Posts you save will appear here. Tap the bookmark icon on any post to save it to your library.
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={sortedByRecent}
        renderItem={renderRecentPostItem}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 12, paddingTop: 0 }}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
      />
    );
  };

  // Render Activities Tab
  const renderActivitiesTab = () => {
    if (activitiesWithPosts.length === 0) {
      return (
        <View className="flex-1 items-center justify-center px-8">
          <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-6">
            <Grid3X3 size={32} color="#9CA3AF" strokeWidth={1.5} />
          </View>
          <Text className="text-xl font-normal text-gray-900 mb-3 text-center">No activities yet</Text>
          <Text className="text-gray-500 text-center leading-6 font-light">
            Your saved posts will be organized by activity type here.
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={activitiesWithPosts}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 8, paddingHorizontal: 16 }}
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
                  <Text className="font-normal text-gray-900 text-lg">{category.name}</Text>
                </View>
                <View className="bg-gray-100 px-3 py-1 rounded-full">
                  <Text className="text-sm text-gray-600 font-light">
                    {postsInCategory.length}
                  </Text>
                </View>
              </View>
              
              {/* Posts Horizontal Scroll */}
              <FlatList
                data={postsInCategory}
                renderItem={renderActivityPostItem}
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
        <View className="flex-1 items-center justify-center px-8">
          <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-6">
            <Map size={32} color="#9CA3AF" strokeWidth={1.5} />
          </View>
          <Text className="text-xl font-normal text-gray-900 mb-3 text-center">No saved posts</Text>
          <Text className="text-gray-500 text-center leading-6 font-light">
            Saved posts with locations will appear on the map here.
          </Text>
        </View>
      );
    }

    return (
      <View className="flex-1 items-center justify-center p-8">
        <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-6">
          <Map size={32} color="#6B7280" strokeWidth={1.5} />
        </View>
        <Text className="text-xl font-normal text-gray-900 mb-3">Map View</Text>
        <Text className="text-gray-500 text-center leading-6 font-light">
          Your saved posts displayed on an interactive map
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header - Modern minimalist */}
      <View className="bg-white px-6 py-4">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={onBackPress}
            className="w-10 h-10 items-center justify-center -ml-2"
            activeOpacity={0.6}
          >
            <ChevronLeft size={24} color="#000000" strokeWidth={2} />
          </TouchableOpacity>
          
          <Text className="text-xl font-normal text-gray-900">Library</Text>
          
          <View className="w-10" />
        </View>
      </View>

      {/* Tab Navigation - Clean design */}
      <View className="bg-white">
        <View className="flex-row px-6">
          <TouchableOpacity 
            className="flex-1 py-4"
            onPress={() => setActiveTab('recent')}
            activeOpacity={0.6}
          >
            <Text
              className={`text-center font-light text-base ${
                activeTab === 'recent' ? 'text-black' : 'text-gray-400'
              }`}
            >
              Recent
            </Text>
            {activeTab === 'recent' && (
              <View className="w-full h-0.5 bg-black mt-3" />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="flex-1 py-4"
            onPress={() => setActiveTab('activities')}
            activeOpacity={0.6}
          >
            <Text
              className={`text-center font-light text-base ${
                activeTab === 'activities' ? 'text-black' : 'text-gray-400'
              }`}
            >
              Activities
            </Text>
            {activeTab === 'activities' && (
              <View className="w-full h-0.5 bg-black mt-3" />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="flex-1 py-4"
            onPress={() => setActiveTab('map')}
            activeOpacity={0.6}
          >
            <Text
              className={`text-center font-light text-base ${
                activeTab === 'map' ? 'text-black' : 'text-gray-400'
              }`}
            >
              Map
            </Text>
            {activeTab === 'map' && (
              <View className="w-full h-0.5 bg-black mt-3" />
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
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
import { Heart } from 'lucide-react-native';
import { colors } from '../../../constants/colors';
import { activityTags } from '../../../constants/activityTags';
import { usePosts } from '../../../store/PostsContext';
import { useSavedPosts } from '../../../store/SavedPostsContext';
import { mapPostToCardProps, PostCardProps } from '../../../types/structures/posts_structure';

const { width } = Dimensions.get('window');

interface LibraryProps {
  onBackPress?: () => void;
}

export default function Library({ onBackPress }: LibraryProps = {}) {
  // State for active tab
  const [activeTab, setActiveTab] = useState<'recent' | 'activities' | 'map'>('recent');
  
  // Get posts and saved posts
  const { posts } = usePosts();
  const { savedPostIds } = useSavedPosts();
  
  // Filter to only saved posts and convert to PostCard props
  const savedPosts = posts.filter(post => savedPostIds.includes(post.id));
  const savedPostsProps = savedPosts.map(post => mapPostToCardProps(post));

  // Sort posts by timestamp (most recent first)
  const sortedByRecent = [...savedPostsProps].sort((a, b) => {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  // Get unique activities that actually have posts
  const activitiesWithPosts = activityTags.filter(tag => {
    return savedPostsProps.some(post => post.activityName === tag.name);
  });

  // Helper function to get posts for an activity
  const getPostsForActivity = (activityName: string) => {
    return savedPostsProps.filter(post => post.activityName === activityName);
  };

  // Custom Library Post Card - Compact version for 2-column layout
  const LibraryPostCard = ({ post, onPress }: { post: PostCardProps; onPress: () => void }) => (
    <TouchableOpacity 
      onPress={onPress}
      className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100"
      activeOpacity={0.7}
    >
      {/* Image */}
      {post.images && post.images.length > 0 && (
        <View className="relative h-32">
          <Image 
            source={{ uri: post.images[0] }}
            className="w-full h-full"
            resizeMode="cover"
          />
          {/* Location Pill - Shows location instead of activity */}
          <View 
            className="absolute top-2 right-2 px-2 py-1 rounded-lg"
            style={{ backgroundColor: `${post.activityColor || colors.cobalt}E6` }}
          >
            <Text className="text-white text-xs font-medium" numberOfLines={1}>
              {post.location}
            </Text>
          </View>
        </View>
      )}
      
      {/* Content */}
      <View className="p-3">
        {/* Title/Content */}
        <Text className="font-semibold text-sm text-gray-900 mb-2" numberOfLines={2}>
          {post.content || `Post by ${post.authorName}`}
        </Text>
        
        {/* Author and Stats */}
        <View className="flex-row items-center justify-between">
          <Text className="text-xs text-gray-500" numberOfLines={1}>
            {post.authorName}
          </Text>
          {/* Only show likes with proper Heart icon - removed comments */}
          <View className="flex-row items-center">
            <Heart size={12} color="#6B7280" fill="none" />
            <Text className="text-gray-600 text-xs ml-1">{post.likes}</Text>
          </View>
        </View>
        
        {/* Time */}
        <Text className="text-gray-400 text-xs mt-1">
          {post.timeAgo}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // Handle post press - for now just log, later can navigate to full post
  const handlePostPress = (post: PostCardProps) => {
    console.log('Navigating to post:', post.id);
    // TODO: Add navigation to full post view
  };

  // Render item for FlatList (2 columns)
  const renderPostItem = ({ item }: { item: PostCardProps }) => (
    <View style={{ width: (width - 24) / 2, marginHorizontal: 4, marginBottom: 8 }}>
      <LibraryPostCard post={item} onPress={() => handlePostPress(item)} />
    </View>
  );

  // Render Recent Tab
  const renderRecentTab = () => {
    if (sortedByRecent.length === 0) {
      return (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-6xl mb-4">💾</Text>
          <Text className="text-xl font-semibold text-gray-900 mb-2 text-center">No Saved Posts</Text>
          <Text className="text-gray-500 text-center">
            Posts you save will appear here. Tap the bookmark icon on any post to save it to your library.
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={sortedByRecent}
        renderItem={renderPostItem}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 8 }}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
      />
    );
  };

  // Render Activities Tab
  const renderActivitiesTab = () => {
    if (activitiesWithPosts.length === 0) {
      return (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-6xl mb-4">🏷️</Text>
          <Text className="text-xl font-semibold text-gray-900 mb-2 text-center">No Activities</Text>
          <Text className="text-gray-500 text-center">
            Your saved posts will be organized by activity type here.
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={activitiesWithPosts}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item: category }) => {
          const postsInCategory = getPostsForActivity(category.name);
          
          return (
            <View className="mb-8">
              {/* Category Header */}
              <View 
                className="flex-row items-center mb-4 p-3 rounded-lg"
                style={{ backgroundColor: `${category.color}20`, borderLeftWidth: 4, borderLeftColor: category.color }}
              >
                <View 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: category.color }}
                />
                <Text className="font-semibold text-gray-900 text-lg">{category.name}</Text>
                <View className="ml-2 px-2 py-1 rounded-lg bg-white">
                  <Text className="text-xs text-gray-600">
                    {postsInCategory.length}
                  </Text>
                </View>
              </View>
              
              {/* Posts Grid */}
              <FlatList
                data={postsInCategory}
                renderItem={renderPostItem}
                numColumns={2}
                scrollEnabled={false}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
              />
            </View>
          );
        }}
      />
    );
  };

  // Render Map Tab (simplified)
  const renderMapTab = () => {
    if (savedPostsProps.length === 0) {
      return (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-6xl mb-4">🗺️</Text>
          <Text className="text-xl font-semibold text-gray-900 mb-2 text-center">No Saved Posts</Text>
          <Text className="text-gray-500 text-center">
            Saved posts with locations will appear on the map here.
          </Text>
        </View>
      );
    }

    return (
      <View className="flex-1 items-center justify-center p-8">
        <Text className="text-6xl mb-4">🗺️</Text>
        <Text className="text-xl font-semibold text-gray-900 mb-2">Map View</Text>
        <Text className="text-gray-500 text-center">
          Your saved posts displayed on an interactive map
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View className="bg-white px-4 py-4 border-b border-gray-100">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={onBackPress}
            className="w-10 h-10 items-center justify-center"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text className="text-gray-600 text-2xl">←</Text>
          </TouchableOpacity>
          
          <View className="flex-row items-center">
            <Text className="text-gray-600 text-lg mr-2">💾</Text>
            <Text className="text-xl font-semibold text-gray-900">Library</Text>
          </View>
          
          <View className="w-10" />
        </View>
      </View>

      {/* Tab Navigation */}
      <View className="bg-white border-b border-gray-100">
        <View className="flex-row">
          <TouchableOpacity 
            className="flex-1 py-3"
            onPress={() => setActiveTab('recent')}
          >
            <Text
              className={`text-center font-semibold text-lg ${
                activeTab === 'recent' ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              Recent
            </Text>
            {activeTab === 'recent' && (
              <View className="w-full h-0.5 bg-blue-600 mt-2" />
            )}
          </TouchableOpacity>
          <TouchableOpacity 
            className="flex-1 py-3"
            onPress={() => setActiveTab('activities')}
          >
            <Text
              className={`text-center font-semibold text-lg ${
                activeTab === 'activities' ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              Activities
            </Text>
            {activeTab === 'activities' && (
              <View className="w-full h-0.5 bg-blue-600 mt-2" />
            )}
          </TouchableOpacity>
          <TouchableOpacity 
            className="flex-1 py-3"
            onPress={() => setActiveTab('map')}
          >
            <Text
              className={`text-center font-semibold text-lg ${
                activeTab === 'map' ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              Map
            </Text>
            {activeTab === 'map' && (
              <View className="w-full h-0.5 bg-blue-600 mt-2" />
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

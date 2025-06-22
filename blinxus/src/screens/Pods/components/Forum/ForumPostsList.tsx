// Forum Posts List Container - Handles all forum functionality

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { MessageCircle, Filter, Search } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { ForumPostCard } from './ForumPostCard';
import ForumPostModal from '../../../../components/ForumPostModal';
import { useForumPosts } from './useForumPosts';
import { ForumAPI } from './forumAPI';
import { LocationFilter, FORUM_CATEGORIES } from './forumTypes';
import { useThemeColors } from '../../../../hooks/useThemeColors';
import { Country } from '../../../../constants/placesData';

interface ForumPostsListProps {
  country: Country;
  selectedLocationFilter: LocationFilter;
  onLocationFilterChange: (filter: LocationFilter) => void;
}

export const ForumPostsList: React.FC<ForumPostsListProps> = ({
  country,
  selectedLocationFilter,
  onLocationFilterChange,
}) => {
  const themeColors = useThemeColors();
  const navigation = useNavigation();
  
  // Use the custom hook for all forum functionality
  const {
    posts,
    uiState,
    filters,
    actions
  } = useForumPosts({
    country,
    initialFilters: {
      location: selectedLocationFilter
    }
  });

  // Local UI state
  const [showFilters, setShowFilters] = useState(false);

  // Get location filter tabs
  const locationTabs = ForumAPI.getLocationFilters(country);

  // Update location filter when parent changes
  React.useEffect(() => {
    if (filters.location !== selectedLocationFilter) {
      actions.updateFilters({ location: selectedLocationFilter });
    }
  }, [selectedLocationFilter, filters.location, actions]);

  // Handle post interactions
  const handleLike = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      const action = post.isLiked ? 'unlike' : 'like';
      actions.updatePostInteraction(postId, action);
    }
  };

  const handleBookmark = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      const action = post.isBookmarked ? 'unbookmark' : 'bookmark';
      actions.updatePostInteraction(postId, action);
    }
  };

  const handleReply = (postId: string) => {
    // TODO: Open reply modal/screen
    console.log('Reply to post:', postId);
  };

  const handleShare = (postId: string) => {
    // TODO: Implement share functionality
    console.log('Share post:', postId);
  };

  const handleMore = (postId: string) => {
    // TODO: Show more options modal
    console.log('More options for post:', postId);
  };

  const handleAuthorPress = (authorId: string) => {
    // Navigate to profile if it's the current user, otherwise show message
    if (authorId === 'current_user') {
      (navigation as any).navigate('Profile');
    } else {
      console.log('View author profile:', authorId);
      // TODO: Navigate to other user profiles when implemented
    }
  };

  const handleTagPress = (tagId: string) => {
    // Add tag to activity filter
    const currentTags = filters.activityTags;
    if (!currentTags.includes(tagId)) {
      actions.updateFilters({ 
        activityTags: [...currentTags, tagId] 
      });
    }
  };

  const handleCategoryPress = (categoryId: string) => {
    // Set category filter
    actions.updateFilters({ 
      category: categoryId as any
    });
  };

  // Empty state component
  const EmptyState = () => (
    <View style={{
      alignItems: 'center',
      paddingVertical: 40,
      paddingHorizontal: 20,
    }}>
      <MessageCircle size={48} color={themeColors.textSecondary} strokeWidth={1} />
      <Text style={{
        color: themeColors.textSecondary,
        fontSize: 16,
        fontWeight: '500',
        marginTop: 16,
        fontFamily: 'System',
        textAlign: 'center',
      }}>
        {selectedLocationFilter === 'All' 
          ? 'No discussions yet' 
          : `No discussions in ${selectedLocationFilter}`}
      </Text>
      <Text style={{
        color: themeColors.textSecondary,
        fontSize: 14,
        marginTop: 4,
        textAlign: 'center',
        fontFamily: 'System',
      }}>
        {selectedLocationFilter === 'All' 
          ? 'Be the first to start a conversation!' 
          : 'Start a discussion about this location'}
      </Text>
    </View>
  );

  // Error state component
  const ErrorState = () => (
    <View style={{
      alignItems: 'center',
      paddingVertical: 40,
      paddingHorizontal: 20,
    }}>
      <Text style={{
        color: '#EF4444',
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 12,
        fontFamily: 'System',
        textAlign: 'center',
      }}>
        Failed to load discussions
      </Text>
      <Text style={{
        color: themeColors.textSecondary,
        fontSize: 14,
        marginBottom: 16,
        textAlign: 'center',
        fontFamily: 'System',
      }}>
        {uiState.error}
      </Text>
      <TouchableOpacity
        onPress={actions.refreshPosts}
        style={{
          backgroundColor: themeColors.isDark 
            ? 'rgba(59, 130, 246, 0.2)'
            : 'rgba(59, 130, 246, 0.1)',
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderRadius: 8,
        }}
        activeOpacity={0.7}
      >
        <Text style={{
          color: '#3B82F6',
          fontSize: 14,
          fontWeight: '600',
          fontFamily: 'System',
        }}>
          Try Again
        </Text>
      </TouchableOpacity>
    </View>
  );

  // Loading state component
  const LoadingState = () => (
    <View style={{
      alignItems: 'center',
      paddingVertical: 40,
    }}>
      <ActivityIndicator 
        size="large" 
        color={themeColors.isDark ? '#3B82F6' : '#6B7280'} 
      />
      <Text style={{
        color: themeColors.textSecondary,
        fontSize: 14,
        marginTop: 12,
        fontFamily: 'System',
      }}>
        Loading discussions...
      </Text>
    </View>
  );

  // Header component for FlatList
  const ListHeaderComponent = () => (
    <View>
      {/* Create Post Button */}
      <TouchableOpacity
        style={{
          backgroundColor: themeColors.isDark 
            ? 'rgba(255, 255, 255, 0.05)'
            : 'rgba(0, 0, 0, 0.02)',
          borderRadius: 12,
          padding: 16,
          marginHorizontal: 20,
          marginBottom: 20,
          borderWidth: 1,
          borderColor: themeColors.isDark 
            ? 'rgba(255, 255, 255, 0.08)'
            : 'rgba(0, 0, 0, 0.06)',
        }}
        activeOpacity={0.7}
        onPress={() => actions.setShowCreateModal(true)}
      >
        <Text style={{
          color: themeColors.textSecondary,
          fontSize: 16,
          fontFamily: 'System',
        }}>
          What's on your mind about {country.name}?
        </Text>
      </TouchableOpacity>

      {/* Active Filters Display */}
      {(filters.category !== 'All' || filters.activityTags.length > 0 || filters.searchQuery) && (
        <View style={{
          paddingHorizontal: 20,
          marginBottom: 16,
        }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}
          >
            {/* Category Filter Pill */}
            {filters.category !== 'All' && (
              <TouchableOpacity
                onPress={() => actions.updateFilters({ category: 'All' })}
                style={{
                  backgroundColor: FORUM_CATEGORIES.find(cat => cat.id === filters.category)?.color || '#6B7280',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
                activeOpacity={0.7}
              >
                <Text style={{ fontSize: 12, marginRight: 4 }}>
                  {FORUM_CATEGORIES.find(cat => cat.id === filters.category)?.emoji || '💬'}
                </Text>
                <Text style={{
                  color: 'white',
                  fontSize: 12,
                  fontWeight: '600',
                  marginRight: 4,
                  fontFamily: 'System',
                }}>
                  {FORUM_CATEGORIES.find(cat => cat.id === filters.category)?.label || filters.category}
                </Text>
                <Text style={{ color: 'white', fontSize: 14 }}>×</Text>
              </TouchableOpacity>
            )}

            {/* Activity Tag Pills */}
            {filters.activityTags.map(tagId => (
              <TouchableOpacity
                key={tagId}
                onPress={() => actions.updateFilters({
                  activityTags: filters.activityTags.filter(t => t !== tagId)
                })}
                style={{
                  backgroundColor: '#3B82F6',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
                activeOpacity={0.7}
              >
                <Text style={{
                  color: 'white',
                  fontSize: 12,
                  fontWeight: '500',
                  marginRight: 4,
                  fontFamily: 'System',
                }}>
                  {tagId}
                </Text>
                <Text style={{ color: 'white', fontSize: 14 }}>×</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );

  return (
    <View style={{ flex: 1 }}>

      {/* Posts List */}
      {uiState.isLoading && posts.length === 0 ? (
        <LoadingState />
      ) : uiState.error && posts.length === 0 ? (
        <ErrorState />
      ) : posts.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={ListHeaderComponent}
          renderItem={({ item }) => (
            <View style={{ paddingHorizontal: 20 }}>
              <ForumPostCard
                post={item}
                onLike={handleLike}
                onBookmark={handleBookmark}
                onReply={handleReply}
                onShare={handleShare}
                onMore={handleMore}
                onAuthorPress={handleAuthorPress}
                onTagPress={handleTagPress}
                onCategoryPress={handleCategoryPress}
              />
            </View>
          )}
          refreshControl={
            <RefreshControl
              refreshing={uiState.isRefreshing}
              onRefresh={actions.refreshPosts}
              tintColor={themeColors.isDark ? '#3B82F6' : '#6B7280'}
            />
          }
          onEndReached={actions.loadMorePosts}
          onEndReachedThreshold={0.3}
          ListFooterComponent={() => (
            uiState.isLoadingMore ? (
              <View style={{ paddingVertical: 20, alignItems: 'center' }}>
                <ActivityIndicator 
                  size="small" 
                  color={themeColors.isDark ? '#3B82F6' : '#6B7280'} 
                />
              </View>
            ) : null
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      {/* Create Post Modal */}
      <ForumPostModal
        visible={uiState.showCreateModal}
        onClose={() => actions.setShowCreateModal(false)}
        onSubmit={(post) => {
          // Adapt ForumPostModal format to CreateForumPostRequest format
          actions.createPost({
            content: post.content,
            category: post.category,
            activityTags: post.activityTags,
            locationId: post.locationId,
            countryId: country.id,
          });
        }}
        country={country}
        defaultLocation={selectedLocationFilter === 'All' ? 'All' : selectedLocationFilter}
      />
    </View>
  );
}; 
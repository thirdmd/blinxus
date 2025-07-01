// Forum Posts List Container - ULTRA-RESPONSIVE with instant UI updates

import React, { useState, forwardRef, useImperativeHandle, useRef, useCallback, useMemo } from 'react';
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
import UserProfileNavigation from '../../../../utils/userProfileNavigation';

interface ForumPostsListProps {
  country: Country;
  selectedLocationFilter: LocationFilter;
  onLocationFilterChange: (filter: LocationFilter) => void;
}

export interface ForumPostsListRef {
  scrollToTop: () => void;
  refresh: () => void;
}

// RADICAL: Memoized components for zero unnecessary re-renders
const EmptyState = React.memo(({ themeColors }: { themeColors: any }) => (
  <View style={{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  }}>
    <MessageCircle 
      size={48} 
      color={themeColors.textSecondary} 
      strokeWidth={1.5}
    />
    <Text style={{
      fontSize: 18,
      fontWeight: '600',
      color: themeColors.text,
      marginTop: 16,
      marginBottom: 8,
      textAlign: 'center',
      fontFamily: 'System',
    }}>
      No discussions yet
    </Text>
    <Text style={{
      fontSize: 15,
      color: themeColors.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
      fontFamily: 'System',
    }}>
      Be the first to start a conversation about this location
    </Text>
  </View>
));

const ErrorState = React.memo(({ error, onRetry, themeColors }: { 
  error: string; 
  onRetry: () => void; 
  themeColors: any; 
}) => (
  <View style={{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  }}>
    <Text style={{
      fontSize: 16,
      color: themeColors.textSecondary,
      textAlign: 'center',
      marginBottom: 20,
      fontFamily: 'System',
    }}>
      {error}
    </Text>
    <TouchableOpacity
      onPress={onRetry}
      style={{
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: '#3B82F6',
        borderRadius: 8,
      }}
    >
      <Text style={{
        color: 'white',
        fontSize: 15,
        fontWeight: '600',
        fontFamily: 'System',
      }}>
        Try Again
      </Text>
    </TouchableOpacity>
  </View>
));

const LoadingState = React.memo(({ themeColors }: { themeColors: any }) => (
  <View style={{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  }}>
    <ActivityIndicator size="large" color="#3B82F6" />
    <Text style={{
      fontSize: 15,
      color: themeColors.textSecondary,
      marginTop: 16,
      fontFamily: 'System',
    }}>
      Loading discussions...
    </Text>
  </View>
));

export const ForumPostsList = forwardRef<ForumPostsListRef, ForumPostsListProps>(({
  country,
  selectedLocationFilter,
  onLocationFilterChange,
}, ref) => {
  const themeColors = useThemeColors();
  const navigation = useNavigation();
  const flatListRef = useRef<FlatList>(null);

  // RADICAL: Use the new instant UI hook
  const { posts, uiState, filters, actions } = useForumPosts({
    country,
    initialFilters: {
      location: selectedLocationFilter,
    }
  });

  // RADICAL: Memoized handlers to prevent re-renders
  const handleScrollToTop = useCallback(() => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, []);

  const handleRefresh = useCallback(() => {
    actions.refreshPosts();
  }, [actions.refreshPosts]);

  const handleLoadMore = useCallback(() => {
    if (uiState.hasMore && !uiState.isLoadingMore && !uiState.isLoading) {
      actions.loadMorePosts();
    }
  }, [actions.loadMorePosts, uiState.hasMore, uiState.isLoadingMore, uiState.isLoading]);

  const handleCreatePost = useCallback(() => {
    actions.setShowCreateModal(true);
  }, [actions.setShowCreateModal]);

  // RADICAL: Memoized interaction handlers
  const handleLike = useCallback((postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      const action = post.isLiked ? 'unlike' : 'like';
      actions.updatePostInteraction(postId, action);
    }
  }, [posts, actions.updatePostInteraction]);

  const handleBookmark = useCallback((postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      const action = post.isBookmarked ? 'unbookmark' : 'bookmark';
      actions.updatePostInteraction(postId, action);
    }
  }, [posts, actions.updatePostInteraction]);

  const handleReply = useCallback((postId: string) => {
    // TODO: Open reply modal/screen
  }, []);

  const handleShare = useCallback((postId: string) => {
    // TODO: Implement share functionality
  }, []);

  const handleMore = useCallback((postId: string) => {
    // TODO: Show more options modal
  }, []);

  const handleAuthorPress = useCallback((authorId: string) => {
    // Get the post to extract author info
    const post = posts.find(p => p.authorId === authorId);
    if (post) {
      const { handleForumPostProfile } = UserProfileNavigation.createHandlersForScreen(navigation as any, 'Forum');
      handleForumPostProfile({
        authorId: post.authorId,
        author: post.author
      });
    }
  }, [navigation, posts]);

  const handleTagPress = useCallback((tagId: string) => {
    const currentTags = filters.activityTags;
    if (!currentTags.includes(tagId)) {
      actions.updateFilters({ 
        activityTags: [...currentTags, tagId] 
      });
    }
  }, [filters.activityTags, actions.updateFilters]);

  const handleCategoryPress = useCallback((categoryId: string) => {
    actions.updateFilters({ 
      category: categoryId as any
    });
  }, [actions.updateFilters]);

  // RADICAL: Memoized render functions for maximum performance
  const renderPost = useCallback(({ item }: { item: any }) => (
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
  ), [handleLike, handleBookmark, handleReply, handleShare, handleMore, handleAuthorPress, handleTagPress, handleCategoryPress]);

  const keyExtractor = useCallback((item: any) => item.id, []);

  // RADICAL: Memoized refresh control
  const refreshControl = useMemo(() => (
    <RefreshControl
      refreshing={uiState.isRefreshing}
      onRefresh={handleRefresh}
      tintColor="#3B82F6"
      colors={['#3B82F6']}
    />
  ), [uiState.isRefreshing, handleRefresh]);

  // RADICAL: Memoized footer component
  const renderFooter = useCallback(() => {
    if (!uiState.isLoadingMore) return null;
    
    return (
      <View style={{
        paddingVertical: 20,
        alignItems: 'center',
      }}>
        <ActivityIndicator size="small" color="#3B82F6" />
      </View>
    );
  }, [uiState.isLoadingMore]);

  // RESTORED: Original discussion bar header
  const ListHeaderComponent = React.memo(() => (
    <View>
      {/* Create Post Button - Original Style */}
      <TouchableOpacity
        style={{
          backgroundColor: themeColors.isDark 
            ? 'rgba(255, 255, 255, 0.05)'
            : 'rgba(0, 0, 0, 0.02)',
          borderRadius: 12,
          padding: 16,
          marginHorizontal: 20,
          marginTop: 20,
          marginBottom: 20,
          borderWidth: 1,
          borderColor: themeColors.isDark 
            ? 'rgba(255, 255, 255, 0.08)'
            : 'rgba(0, 0, 0, 0.06)',
        }}
        activeOpacity={0.7}
        onPress={handleCreatePost}
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
            removeClippedSubviews={false}
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
  ));

  // Update location filter when prop changes
  React.useEffect(() => {
    if (filters.location !== selectedLocationFilter) {
      actions.updateFilters({ location: selectedLocationFilter });
    }
  }, [selectedLocationFilter, filters.location, actions.updateFilters]);

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    scrollToTop: handleScrollToTop,
    refresh: handleRefresh,
  }), [handleScrollToTop, handleRefresh]);

  // RADICAL: Early returns for different states - prevents unnecessary renders
  if (uiState.isLoading && posts.length === 0) {
    return <LoadingState themeColors={themeColors} />;
  }

  if (uiState.error && posts.length === 0) {
    return (
      <ErrorState 
        error={uiState.error} 
        onRetry={actions.loadPosts} 
        themeColors={themeColors} 
      />
    );
  }

  if (!uiState.isLoading && posts.length === 0) {
    return <EmptyState themeColors={themeColors} />;
  }

  return (
    <View style={{ flex: 1 }}>
      {/* FIXED: Ultra-smooth FlatList with proper touch handling */}
      <FlatList
        ref={flatListRef}
        data={posts}
        renderItem={renderPost}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeaderComponent}
        refreshControl={refreshControl}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={renderFooter}
        
        // PERFORMANCE: Critical optimizations for 100% smooth scrolling
        getItemLayout={(data, index) => ({
          length: 180, // Estimated item height for consistent scrolling
          offset: 180 * index,
          index,
        })}
        removeClippedSubviews={true} // Enable for better memory management
        initialNumToRender={6} // Reduce initial render for faster load
        maxToRenderPerBatch={8} // Optimize batch rendering
        windowSize={12} // Increase window size for smoother scrolling
        updateCellsBatchingPeriod={50} // Optimize batching
        
        // TOUCH: 100% responsive touch handling
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={1} // Ultra-smooth scroll events
        decelerationRate="normal"
        bounces={true}
        overScrollMode="always"
        
        // KEYBOARD: Proper keyboard handling
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        
        // PERFORMANCE: Disable scroll to top on status bar tap for better performance
        automaticallyAdjustContentInsets={false}
        contentInsetAdjustmentBehavior="never"
        
        style={{
          flex: 1,
          backgroundColor: themeColors.background,
        }}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
      />

      {/* RADICAL: Instant Modal - No delays, no state conflicts */}
      <ForumPostModal
        visible={uiState.showCreateModal}
        onClose={() => actions.setShowCreateModal(false)}
        onSubmit={(post) => {
          // INSTANT: Submit happens immediately, UI updates instantly
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
});

ForumPostsList.displayName = 'ForumPostsList';
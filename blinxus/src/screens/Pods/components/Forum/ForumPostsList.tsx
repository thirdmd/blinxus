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
import FloatingCreatePostBar from '../../../../components/FloatingCreatePostBar';
import FilterPill from '../../../../components/FilterPill';
import { useForumPosts } from './useForumPosts';
import { ForumAPI } from './forumAPI';
import { LocationFilter, FORUM_CATEGORIES } from './forumTypes';
import { useThemeColors } from '../../../../hooks/useThemeColors';
import { Country } from '../../../../constants/placesData';
import UserProfileNavigation from '../../../../utils/userProfileNavigation';
import { SPACING } from '../../../../constants/spacing';
import { PodTabType } from '../../../../types/structures/podsUIStructure';

interface ForumPostsListProps {
  country: Country;
  selectedLocationFilter: LocationFilter;
  onLocationFilterChange: (filter: LocationFilter) => void;
  onTabChange: (tab: PodTabType) => void;
}

export interface ForumPostsListRef {
  scrollToTop: () => void;
  refresh: () => void;
  getCurrentScrollPosition: () => number;
  scrollToOffset: (params: { offset: number; animated?: boolean }) => void;
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
  onTabChange,
}, ref) => {
  const themeColors = useThemeColors();
  const navigation = useNavigation();
  const flatListRef = useRef<FlatList>(null);
  
  // RADICAL: Track scroll position for persistence
  const currentScrollPosition = useRef(0);

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
    // Add tag to current filters
    const currentTags = filters.activityTags || [];
    if (!currentTags.includes(tagId)) {
      actions.updateFilters({
        ...filters,
        activityTags: [...currentTags, tagId]
      });
    }
  }, [filters, actions.updateFilters]);

  const handleCategoryPress = useCallback((categoryId: string) => {
    // Set category filter
    actions.updateFilters({
      ...filters,
      category: categoryId as any
    });
  }, [filters, actions.updateFilters]);

  const handleLocationPress = useCallback((post: any, location: any) => {
    // NEW: Handle subsublocation navigation properly
    let targetFilter = location.name;
    
    // Check if the location is a formatted subsublocation like "Anilao, Batangas"
    if (location.name.includes(', ')) {
      const [subSubLocationName, parentSubLocationName] = location.name.split(', ');
      // For subsublocations, navigate to the parent sublocation tab
      targetFilter = parentSubLocationName;
    }
    
    // Switch filter tab and select sublocation without navigating away
    onLocationFilterChange(targetFilter);
    onTabChange('Forum');
  }, [onLocationFilterChange, onTabChange]);

  // RADICAL: Memoized render functions for maximum performance
  const renderPost = useCallback(({ item }: { item: any }) => (
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
      onLocationPress={handleLocationPress}
    />
  ), [handleLike, handleBookmark, handleReply, handleShare, handleMore, handleAuthorPress, handleTagPress, handleCategoryPress, handleLocationPress]);

  const keyExtractor = useCallback((item: any, index: number) => `forum-post-${item.id}-${index}`, []);

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
      {/* Active Filters Display */}
      {(filters.category !== 'All' || filters.activityTags.length > 0 || filters.searchQuery) && (
        <View style={{
          paddingHorizontal: 20,
          marginBottom: SPACING.FILTER_TAGS_TO_POSTS,
        }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}
            removeClippedSubviews={false}
          >
            {/* Category Filter Pill */}
            {filters.category !== 'All' && (
              <FilterPill
                label={FORUM_CATEGORIES.find(cat => cat.id === filters.category)?.label || filters.category}
                emoji={FORUM_CATEGORIES.find(cat => cat.id === filters.category)?.emoji || '💬'}
                color={FORUM_CATEGORIES.find(cat => cat.id === filters.category)?.color || '#6B7280'}
                variant="category"
                size="medium"
                onPress={() => actions.updateFilters({ category: 'All' })}
                onRemove={() => actions.updateFilters({ category: 'All' })}
              />
            )}

            {/* Activity Tag Pills */}
            {filters.activityTags.map(tagId => (
              <FilterPill
                key={tagId}
                label={tagId}
                tagId={tagId}
                variant="tag"
                size="medium"
                isSelected={true}
                onPress={() => actions.updateFilters({
                  activityTags: filters.activityTags.filter(t => t !== tagId)
                })}
                onRemove={() => actions.updateFilters({
                  activityTags: filters.activityTags.filter(t => t !== tagId)
                })}
              />
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

  // RADICAL: Handle scroll position tracking
  const handleScroll = useCallback((event: any) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    currentScrollPosition.current = scrollY;
  }, []);

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    scrollToTop: handleScrollToTop,
    refresh: handleRefresh,
    getCurrentScrollPosition: () => currentScrollPosition.current,
    scrollToOffset: (params) => flatListRef.current?.scrollToOffset(params),
  }), [handleScrollToTop, handleRefresh]);

  // RADICAL: Early returns for different states - prevents unnecessary renders
  if (uiState.isLoading && posts.length === 0) {
    return <LoadingState themeColors={themeColors} />;
  }

  if (uiState.error && posts.length === 0) {
    return (
      <View style={{ flex: 1 }}>
        <ErrorState 
          error={uiState.error} 
          onRetry={actions.loadPosts} 
          themeColors={themeColors} 
        />
        
        {/* Floating Create Post Bar - Always present even on error */}
        <FloatingCreatePostBar 
          onPress={handleCreatePost}
          placeholder={`What's on your mind about ${country.name}?`}
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
  }

  if (!uiState.isLoading && posts.length === 0) {
    return (
      <View style={{ flex: 1 }}>
        <EmptyState themeColors={themeColors} />
        
        {/* Floating Create Post Bar - Always present even when no posts */}
        <FloatingCreatePostBar 
          onPress={handleCreatePost}
          placeholder={`What's on your mind about ${country.name}?`}
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
        onScroll={handleScroll}
        
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
          paddingTop: 0,
          paddingBottom: SPACING.FLATLIST_BOTTOM_PADDING,
        }}
      />

      {/* Floating Create Post Bar */}
      <FloatingCreatePostBar 
        onPress={handleCreatePost}
        placeholder={`What's on your mind about ${country.name}?`}
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
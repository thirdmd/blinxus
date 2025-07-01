// Global Feed Component - Shows all posts from all countries (centralized feed)

import React, { useState, forwardRef, useImperativeHandle, useRef, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Animated,
} from 'react-native';
import { MessageCircle, Search, X, TrendingUp, Globe } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { ForumPostCard } from './Forum/ForumPostCard';
import ForumPostModal from '../../../components/ForumPostModal';
import { ForumAPI } from './Forum/forumAPI';
import { ForumPost } from './Forum/forumTypes';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { PodThemeConfig } from '../../../types/structures/podsUIStructure';
import { placesData } from '../../../constants/placesData';
import UserProfileNavigation from '../../../utils/userProfileNavigation';

export interface GlobalFeedRef {
  scrollToTop: () => void;
}

interface GlobalFeedProps {
  theme: PodThemeConfig;
  onCreatePost?: () => void;
}

const GlobalFeed = forwardRef<GlobalFeedRef, GlobalFeedProps>(({
  theme,
  onCreatePost,
}, ref) => {
  const themeColors = useThemeColors();
  const navigation = useNavigation();
  const flatListRef = useRef<FlatList>(null);

  // State management
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  
  // Search functionality
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchAnimation = useRef(new Animated.Value(0)).current;
  
  // Create post modal
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Load posts function
  const loadPosts = useCallback(async (page: number = 1, isRefresh: boolean = false) => {
    try {
      if (page === 1) {
        isRefresh ? setIsRefreshing(true) : setIsLoading(true);
        setError(null);
      } else {
        setIsLoadingMore(true);
      }

      const response = await ForumAPI.getGlobalFeedPosts({
        page,
        limit: 15,
        searchQuery: searchQuery.trim() || undefined,
        sortBy: 'recent'
      });

      if (response.success) {
        if (page === 1) {
          setPosts(response.posts);
        } else {
          setPosts(prev => [...prev, ...response.posts]);
        }
        setHasMore(response.hasMore);
        setCurrentPage(page);
      } else {
        setError(response.error || 'Failed to load posts');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
      setIsRefreshing(false);
    }
  }, [searchQuery]);

  // Initial load
  useEffect(() => {
    loadPosts(1);
  }, [loadPosts]);

  // Search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery !== '') {
        loadPosts(1);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, loadPosts]);

  // Scroll to top function
  const scrollToTop = useCallback(() => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, []);

  useImperativeHandle(ref, () => ({
    scrollToTop,
  }), [scrollToTop]);

  // Event handlers
  const handleRefresh = useCallback(() => {
    loadPosts(1, true);
  }, [loadPosts]);

  const handleLoadMore = useCallback(() => {
    if (hasMore && !isLoadingMore && !isLoading) {
      loadPosts(currentPage + 1);
    }
  }, [hasMore, isLoadingMore, isLoading, currentPage, loadPosts]);

  const handleCreatePost = useCallback(() => {
    if (onCreatePost) {
      onCreatePost();
    } else {
      setShowCreateModal(true);
    }
  }, [onCreatePost]);

  // Search functionality
  const expandSearch = useCallback(() => {
    setIsSearchExpanded(true);
    Animated.timing(searchAnimation, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [searchAnimation]);

  const collapseSearch = useCallback(() => {
    setSearchQuery('');
    setIsSearchExpanded(false);
    Animated.timing(searchAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [searchAnimation]);



  // Direct post interaction handlers (no centralized function to avoid hooks issues)
  const handleLike = useCallback(async (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    // Optimistic update
    setPosts(prev => prev.map(p => 
      p.id === postId 
        ? { 
            ...p, 
            isLiked: !p.isLiked,
            likes: p.isLiked ? p.likes - 1 : p.likes + 1
          }
        : p
    ));

    // API call
    try {
      await ForumAPI.updatePostInteraction({
        postId,
        action: post.isLiked ? 'unlike' : 'like'
      });
    } catch (error) {
      // Revert on error
      setPosts(prev => prev.map(p => 
        p.id === postId 
          ? { 
              ...p, 
              isLiked: post.isLiked,
              likes: post.likes
            }
          : p
      ));
    }
  }, [posts]);

  const handleBookmark = useCallback(async (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    // Optimistic update
    setPosts(prev => prev.map(p => 
      p.id === postId 
        ? { ...p, isBookmarked: !p.isBookmarked }
        : p
    ));

    try {
      await ForumAPI.updatePostInteraction({
        postId,
        action: post.isBookmarked ? 'unbookmark' : 'bookmark'
      });
    } catch (error) {
      // Revert on error
      setPosts(prev => prev.map(p => 
        p.id === postId 
          ? { ...p, isBookmarked: post.isBookmarked }
          : p
      ));
    }
  }, [posts]);

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
    // For global feed, search by tag name
    const tagData = require('./Forum/forumTypes').FORUM_ACTIVITY_TAGS.find((tag: any) => tag.id === tagId);
    if (tagData) {
      setSearchQuery(tagData.label);
    }
  }, []);

  const handleCategoryPress = useCallback((categoryId: string) => {
    // For global feed, search by category name
    const categoryData = require('./Forum/forumTypes').FORUM_CATEGORIES.find((cat: any) => cat.id === categoryId);
    if (categoryData) {
      setSearchQuery(categoryData.label);
    }
  }, []);

  const handleCreatePostSubmit = useCallback(async (postData: {
    content: string;
    category: any;
    activityTags: string[];
    locationId: string;
  }) => {
    try {
      // For global feed, we need to determine a default country
      // In a real app, this would be based on user's location or selection
      const defaultCountryId = 'ph'; // Philippines as default, can be made dynamic
      
      const response = await ForumAPI.createPost({
        ...postData,
        countryId: defaultCountryId,
      });

      if (response.success && response.post) {
        // Add new post to the top of the feed
        setPosts(prev => [response.post!, ...prev]);
        setShowCreateModal(false);
      }
    } catch (error) {
      // Handle error
    }
  }, []);

  // Render functions
  const renderPost = useCallback(({ item }: { item: ForumPost }) => (
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

  const renderHeader = useCallback(() => (
    <View style={{ paddingHorizontal: 20, paddingBottom: 16 }}>
      {/* Header */}
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: 16,
      }}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <Globe size={20} color={theme.colors.primary} strokeWidth={2} />
            <Text style={{
              color: themeColors.text,
              fontSize: 20,
              fontWeight: '800',
              fontFamily: 'System',
              letterSpacing: -0.6,
              marginLeft: 8,
            }}>
              Global Feed
            </Text>
          </View>
          <Text style={{
            color: themeColors.textSecondary,
            fontSize: 13,
            fontWeight: '400',
            fontFamily: 'System',
            letterSpacing: -0.1,
          }}>
            Posts from all destinations worldwide
          </Text>
        </View>

        {/* Search */}
        <Animated.View style={{
          width: searchAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [40, 180],
          }),
          height: 40,
        }}>
          {!isSearchExpanded ? (
            <TouchableOpacity
              onPress={expandSearch}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: themeColors.isDark 
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(0, 0, 0, 0.05)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              activeOpacity={0.7}
            >
              <Search size={18} color={themeColors.textSecondary} strokeWidth={2} />
            </TouchableOpacity>
          ) : (
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 12,
              height: 40,
              borderRadius: 20,
              backgroundColor: themeColors.isDark 
                ? 'rgba(255, 255, 255, 0.08)'
                : 'rgba(0, 0, 0, 0.05)',
            }}>
              <Search size={16} color={themeColors.textSecondary} strokeWidth={2} />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search global feed..."
                placeholderTextColor={themeColors.textSecondary}
                style={{
                  flex: 1,
                  marginLeft: 8,
                  marginRight: 8,
                  fontSize: 14,
                  color: themeColors.text,
                  fontFamily: 'System',
                }}
                autoFocus
                returnKeyType="search"
              />
              <TouchableOpacity
                onPress={collapseSearch}
                style={{ padding: 4 }}
                activeOpacity={0.7}
              >
                <X size={14} color={themeColors.textSecondary} strokeWidth={2} />
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      </View>

      {/* Create Post Button */}
      <TouchableOpacity
        onPress={handleCreatePost}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 16,
          borderRadius: 16,
          backgroundColor: themeColors.isDark 
            ? 'rgba(255, 255, 255, 0.06)'
            : 'rgba(0, 0, 0, 0.04)',
          borderWidth: 1,
          borderColor: themeColors.isDark 
            ? 'rgba(255, 255, 255, 0.08)'
            : 'rgba(0, 0, 0, 0.06)',
        }}
        activeOpacity={0.8}
      >
        <MessageCircle size={20} color={themeColors.textSecondary} strokeWidth={2} />
        <Text style={{
          color: themeColors.textSecondary,
          fontSize: 16,
          fontFamily: 'System',
          marginLeft: 12,
        }}>
          What's on your mind?
        </Text>
      </TouchableOpacity>
    </View>
  ), [theme.colors.primary, themeColors, searchAnimation, isSearchExpanded, searchQuery, expandSearch, collapseSearch, handleCreatePost]);

  const renderFooter = useCallback(() => {
    if (!isLoadingMore) return null;
    
    return (
      <View style={{ paddingVertical: 20, alignItems: 'center' }}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
      </View>
    );
  }, [isLoadingMore, theme.colors.primary]);

  const renderEmpty = useCallback(() => {
    if (isLoading) return null;
    
    return (
      <View style={{ 
        paddingTop: 60, 
        alignItems: 'center', 
        paddingHorizontal: 40 
      }}>
        <View style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: themeColors.isDark 
            ? 'rgba(26, 35, 50, 0.4)'
            : 'rgba(248, 249, 250, 0.7)',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 20,
        }}>
          <Globe size={32} color={themeColors.textSecondary} strokeWidth={1.5} />
        </View>
        <Text style={{ 
          color: themeColors.text, 
          fontSize: 18,
          fontWeight: '700',
          marginBottom: 8,
          fontFamily: 'System',
        }}>
          No posts yet
        </Text>
        <Text style={{ 
          color: themeColors.textSecondary, 
          fontSize: 14,
          textAlign: 'center',
          lineHeight: 20,
          fontFamily: 'System',
        }}>
          Be the first to share something with the global community
        </Text>
      </View>
    );
  }, [isLoading, themeColors]);

  // Render loading state as part of main return instead of early return
  if (isLoading && posts.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: themeColors.background }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={{
            fontSize: 15,
            color: themeColors.textSecondary,
            marginTop: 16,
            fontFamily: 'System',
          }}>
            Loading global feed...
          </Text>
        </View>
        
        {/* Create Post Modal */}
        <ForumPostModal
          visible={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreatePostSubmit}
          country={{
            id: 'global',
            name: 'Global',
            alternateNames: [],
            continentId: 'global',
            subLocations: placesData.reduce((allLocations, continent) => {
              const continentLocations = continent.countries.reduce((countryLocations, country) => {
                // Add country as a location option
                countryLocations.push({
                  id: country.id,
                  name: country.name,
                  alternateNames: country.alternateNames,
                  parentId: 'global',
                  popularActivities: [],
                });
                
                // Add all sub-locations from this country
                country.subLocations.forEach(subLocation => {
                  countryLocations.push({
                    ...subLocation,
                    name: `${subLocation.name}, ${country.name}`, // Show location with country for clarity
                    parentId: 'global',
                  });
                });
                
                return countryLocations;
              }, [] as any[]);
              
              return [...allLocations, ...continentLocations];
            }, [] as any[])
          }}
          defaultLocation=""
        />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: themeColors.background }}>
      <FlatList
        ref={flatListRef}
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ 
          paddingTop: 16,
          paddingBottom: 30,
          flexGrow: 1,
        }}
        removeClippedSubviews={true}
        initialNumToRender={10}
        maxToRenderPerBatch={5}
        windowSize={10}
      />

      {/* Create Post Modal */}
      <ForumPostModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreatePostSubmit}
        country={{
          id: 'global',
          name: 'Global',
          alternateNames: [],
          continentId: 'global',
          subLocations: placesData.reduce((allLocations, continent) => {
            const continentLocations = continent.countries.reduce((countryLocations, country) => {
              // Add country as a location option
              countryLocations.push({
                id: country.id,
                name: country.name,
                alternateNames: country.alternateNames,
                parentId: 'global',
                popularActivities: [],
              });
              
              // Add all sub-locations from this country
              country.subLocations.forEach(subLocation => {
                countryLocations.push({
                  ...subLocation,
                  name: `${subLocation.name}, ${country.name}`, // Show location with country for clarity
                  parentId: 'global',
                });
              });
              
              return countryLocations;
            }, [] as any[]);
            
            return [...allLocations, ...continentLocations];
          }, [] as any[])
        }}
        defaultLocation=""
      />
    </View>
  );
});

export default GlobalFeed; 
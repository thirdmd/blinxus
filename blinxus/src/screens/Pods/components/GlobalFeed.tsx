// Global Feed Component - Shows all posts from all countries (centralized feed)

import React, { useState, forwardRef, useImperativeHandle, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { MessageCircle, Globe } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { ForumPostCard } from './Forum/ForumPostCard';
import ForumPostModal from '../../../components/ForumPostModal';
import FloatingCreatePostBar from '../../../components/FloatingCreatePostBar';
import { ForumAPI } from './Forum/forumAPI';
import { ForumPost, FORUM_CATEGORIES } from './Forum/forumTypes';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { PodThemeConfig } from '../../../types/structures/podsUIStructure';
import { placesData, getCountryByLocationId, getLocationByName } from '../../../constants/placesData';
import UserProfileNavigation from '../../../utils/userProfileNavigation';
import LocationNavigation from '../../../utils/locationNavigation';

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
  
  // Centralized filtering state (same as country forums)
  const [filters, setFilters] = useState({
    category: 'All' as string,
    activityTags: [] as string[],
    searchQuery: ''
  });
  
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
        sortBy: 'recent',
        searchQuery: filters.searchQuery || undefined,
        category: filters.category !== 'All' ? filters.category : undefined,
        activityTags: filters.activityTags.length > 0 ? filters.activityTags : undefined
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
  }, [filters]);

  // Initial load
  useEffect(() => {
    loadPosts(1);
  }, [loadPosts]);

  // Centralized filter update function (same as country forums)
  const updateFilters = useCallback((newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

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
    // Add tag to current filters (same as country forums)
    const currentTags = filters.activityTags || [];
    if (!currentTags.includes(tagId)) {
      updateFilters({
        activityTags: [...currentTags, tagId]
      });
    }
  }, [filters.activityTags, updateFilters]);

  const handleCategoryPress = useCallback((categoryId: string) => {
    // Set category filter (same as country forums)
    updateFilters({
      category: categoryId
    });
  }, [updateFilters]);

  const handleLocationPress = useCallback((post: any, location: any) => {
    const { handleForumPostLocation } = LocationNavigation.createHandlersForScreen(navigation as any, 'GlobalFeed');
    handleForumPostLocation({ post, location });
  }, [navigation]);

  const handleCreatePostSubmit = useCallback(async (postData: {
    content: string;
    category: any;
    activityTags: string[];
    locationId: string;
  }) => {
    try {
      // FIXED: Properly parse location from global feed selection
      let countryId = 'ph'; // fallback to Philippines only if we can't determine the country
      let actualLocationId = postData.locationId;
      let isGlobalPost = false; // Track if this is a global-only post
      
      if (postData.locationId && postData.locationId !== 'All' && postData.locationId !== '') {
        // Handle "Global" selection specifically - GLOBAL FEED ONLY LOGIC
        if (postData.locationId === 'Global' || postData.locationId === 'global-all') {
          // For Global posts, use special global identifier
          countryId = 'global'; // Special identifier for global-only posts
          actualLocationId = 'global-all'; // Keep global identifier
          isGlobalPost = true; // Mark as global-only post
        }
        // Check if this is a formatted location like "Bangkok, Thailand"
        else if (postData.locationId.includes(', ')) {
          const [locationName, countryName] = postData.locationId.split(', ');
          
          // Find the country by name first
          const foundCountry = placesData
            .flatMap(continent => continent.countries)
            .find(country => country.name === countryName);
          
          if (foundCountry) {
            countryId = foundCountry.id;
            
            // Find the specific location within that country
            const foundLocation = foundCountry.subLocations.find(
              loc => loc.name === locationName
            );
            
            if (foundLocation) {
              actualLocationId = foundLocation.id;
            } else {
              // If location not found, use 'All' for the country
              actualLocationId = 'All';
            }
          }
        } else {
          // Check if this is a direct country selection
          const foundCountry = placesData
            .flatMap(continent => continent.countries)
            .find(country => country.name === postData.locationId || country.id === postData.locationId);
          
          if (foundCountry) {
            countryId = foundCountry.id;
            actualLocationId = 'All'; // Country-level post
          } else {
            // Try to find location by ID or name across all countries
            const country = getCountryByLocationId(postData.locationId);
            if (country) {
              countryId = country.id;
              actualLocationId = postData.locationId;
            } else {
              // Try to find by location name as fallback
              const location = getLocationByName(postData.locationId);
              if (location) {
                const locationCountry = getCountryByLocationId(location.id);
                if (locationCountry) {
                  countryId = locationCountry.id;
                  actualLocationId = location.id;
                }
              }
            }
          }
        }
      }
      
      const response = await ForumAPI.createPost({
        ...postData,
        locationId: actualLocationId, // Use the properly parsed location ID
        countryId, // Use the properly determined country ID
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

  const renderHeader = useCallback(() => (
    <View style={{ paddingHorizontal: 20, paddingBottom: 16 }}>
      {/* Active Filters Display (same as country forums) */}
      {(filters.category !== 'All' || filters.activityTags.length > 0 || filters.searchQuery) && (
        <View style={{
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
                onPress={() => updateFilters({ category: 'All' })}
                style={{
                  backgroundColor: FORUM_CATEGORIES.find(cat => cat.id === filters.category)?.color || '#6B7280',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 8,
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
                onPress={() => updateFilters({
                  activityTags: filters.activityTags.filter(t => t !== tagId)
                })}
                style={{
                  backgroundColor: '#3B82F6',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 8,
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
  ), [themeColors, handleCreatePost, filters, updateFilters]);

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
          subLocations: [
            // Add "Global" as the first option
            {
              id: 'global-all',
              name: 'Global',
              alternateNames: ['Worldwide', 'International'],
              parentId: 'global',
              popularActivities: [],
            },
            // Add all countries and locations
            ...placesData.reduce((allLocations, continent) => {
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
          ]
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
        keyExtractor={(item, index) => `global-feed-${item.id}-${index}`}
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
          paddingTop: 0,
          paddingBottom: 50, // Reduced padding to align with "What's on your mind" bar
          flexGrow: 1,
        }}
        removeClippedSubviews={true}
        initialNumToRender={10}
        maxToRenderPerBatch={5}
        windowSize={10}
      />

      {/* Floating Create Post Bar */}
      <FloatingCreatePostBar 
        onPress={handleCreatePost}
        placeholder="What's on your mind?"
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
          subLocations: [
            // Add "Global" as the first option
            {
              id: 'global-all',
              name: 'Global',
              alternateNames: ['Worldwide', 'International'],
              parentId: 'global',
              popularActivities: [],
            },
            // Add all countries and locations
            ...placesData.reduce((allLocations, continent) => {
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
          ]
        }}
        defaultLocation=""
      />
    </View>
  );
});

export default GlobalFeed; 
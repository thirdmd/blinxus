// Custom hook for Forum Posts - Backend ready state management

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  ForumPost, 
  ForumFilters, 
  ForumUIState, 
  UseForumPostsReturn,
  CreateForumPostRequest,
  UpdatePostInteractionRequest
} from './forumTypes';
import { ForumAPI } from './forumAPI';
import { Country } from '../../../../constants/placesData';

interface UseForumPostsProps {
  country: Country;
  initialFilters?: Partial<ForumFilters>;
}

export const useForumPosts = ({ 
  country, 
  initialFilters = {} 
}: UseForumPostsProps): UseForumPostsReturn => {
  
  // Forum posts stay separate from main explore feed
  
  // State management
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [uiState, setUIState] = useState<ForumUIState>({
    isLoading: true, // Show loading state initially
    isLoadingMore: false,
    isRefreshing: false,
    error: null,
    hasMore: true,
    currentPage: 1,
    selectedPost: null,
    showCreateModal: false,
    showFilters: false
  });

  const [filters, setFilters] = useState<ForumFilters>({
    location: 'All',
    category: 'All',
    sortBy: 'recent',
    timeFilter: 'all',
    activityTags: [],
    searchQuery: '',
    ...initialFilters
  });

  // Refs for preventing duplicate calls
  const isLoadingRef = useRef(false);
  const currentRequestRef = useRef<AbortController | null>(null);

  // Update UI state helper
  const updateUIState = useCallback((updates: Partial<ForumUIState>) => {
    setUIState(prev => ({ ...prev, ...updates }));
  }, []);

  // Load posts with error handling and loading states
  const loadPosts = useCallback(async (reset: boolean = true) => {
    if (isLoadingRef.current) return;

    try {
      isLoadingRef.current = true;
      
      // Cancel previous request
      if (currentRequestRef.current) {
        currentRequestRef.current.abort();
      }
      currentRequestRef.current = new AbortController();

      updateUIState({ 
        isLoading: reset, // Show loading state for better UX
        isLoadingMore: !reset,
        error: null 
      });

      const requestParams = {
        countryId: country.id,
        locationId: filters.location !== 'All' ? filters.location : undefined,
        category: filters.category !== 'All' ? filters.category : undefined,
        activityTags: filters.activityTags.length > 0 ? filters.activityTags : undefined,
        sortBy: filters.sortBy,
        page: reset ? 1 : uiState.currentPage + 1,
        limit: 10,
        searchQuery: filters.searchQuery || undefined
      };

      const response = await ForumAPI.getPosts(requestParams);

      if (response.success) {
        if (reset) {
          setPosts(response.posts);
          updateUIState({ currentPage: 1 });
        } else {
          setPosts(prev => [...prev, ...response.posts]);
          updateUIState({ currentPage: requestParams.page! });
        }
        
        updateUIState({ 
          hasMore: response.hasMore,
          isLoading: false,
          isLoadingMore: false
        });
      } else {
        updateUIState({
          error: response.error || 'Failed to load posts',
          isLoading: false,
          isLoadingMore: false
        });
      }

    } catch (error: any) {
      if (error.name !== 'AbortError') {
        updateUIState({
          error: error.message || 'An unexpected error occurred',
          isLoading: false,
          isLoadingMore: false
        });
      }
    } finally {
      isLoadingRef.current = false;
      currentRequestRef.current = null;
    }
  }, [country.id, filters, uiState.currentPage, updateUIState]);

  // Load more posts for pagination
  const loadMorePosts = useCallback(async () => {
    if (!uiState.hasMore || uiState.isLoadingMore || uiState.isLoading) return;
    await loadPosts(false);
  }, [loadPosts, uiState.hasMore, uiState.isLoadingMore, uiState.isLoading]);

  // Refresh posts (pull to refresh)
  const refreshPosts = useCallback(async () => {
    if (uiState.isRefreshing) return;

    try {
      updateUIState({ isRefreshing: true, error: null });
      await loadPosts(true);
    } finally {
      updateUIState({ isRefreshing: false });
    }
  }, [loadPosts, uiState.isRefreshing, updateUIState]);

  // Create new post
  const createPost = useCallback(async (data: CreateForumPostRequest): Promise<boolean> => {
    try {
      updateUIState({ error: null });

      const response = await ForumAPI.createPost({
        ...data,
        countryId: country.id
      });

      if (response.success && response.post) {
        // Add new post to the beginning of the forum list only
        setPosts(prev => [response.post!, ...prev]);
        
        updateUIState({ showCreateModal: false });
        return true;
      } else {
        updateUIState({ error: response.error || 'Failed to create post' });
        return false;
      }

    } catch (error: any) {
      updateUIState({ error: error.message || 'Failed to create post' });
      return false;
    }
  }, [country.id, updateUIState]);

  // Update post interactions (like, bookmark, etc.)
  const updatePostInteraction = useCallback(async (
    postId: string, 
    action: UpdatePostInteractionRequest['action']
  ) => {
    try {
      // Optimistic update
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          const updatedPost = { ...post };
          
          switch (action) {
            case 'like':
              updatedPost.likes += 1;
              updatedPost.isLiked = true;
              if (updatedPost.isDisliked) {
                updatedPost.dislikes -= 1;
                updatedPost.isDisliked = false;
              }
              break;
            case 'unlike':
              updatedPost.likes = Math.max(0, updatedPost.likes - 1);
              updatedPost.isLiked = false;
              break;
            case 'dislike':
              updatedPost.dislikes += 1;
              updatedPost.isDisliked = true;
              if (updatedPost.isLiked) {
                updatedPost.likes -= 1;
                updatedPost.isLiked = false;
              }
              break;
            case 'undislike':
              updatedPost.dislikes = Math.max(0, updatedPost.dislikes - 1);
              updatedPost.isDisliked = false;
              break;
            case 'bookmark':
              updatedPost.bookmarkCount += 1;
              updatedPost.isBookmarked = true;
              break;
            case 'unbookmark':
              updatedPost.bookmarkCount = Math.max(0, updatedPost.bookmarkCount - 1);
              updatedPost.isBookmarked = false;
              break;
            case 'follow':
              updatedPost.isFollowing = true;
              break;
            case 'unfollow':
              updatedPost.isFollowing = false;
              break;
          }
          
          return updatedPost;
        }
        return post;
      }));

      // Make API call
      const response = await ForumAPI.updatePostInteraction({ postId, action });
      
      if (!response.success) {
        // Revert optimistic update on failure
        await loadPosts(true);
        updateUIState({ error: response.error || 'Failed to update post' });
      }

    } catch (error: any) {
      // Revert optimistic update on error
      await loadPosts(true);
      updateUIState({ error: error.message || 'Failed to update post' });
    }
  }, [loadPosts, updateUIState]);

  // Update filters and reload posts
  const updateFilters = useCallback((newFilters: Partial<ForumFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // UI state setters
  const setSelectedPost = useCallback((post: ForumPost | null) => {
    updateUIState({ selectedPost: post });
  }, [updateUIState]);

  const setShowCreateModal = useCallback((show: boolean) => {
    updateUIState({ showCreateModal: show });
  }, [updateUIState]);

  const setShowFilters = useCallback((show: boolean) => {
    updateUIState({ showFilters: show });
  }, [updateUIState]);

  // Load posts when filters change
  useEffect(() => {
    loadPosts(true);
  }, [filters.location, filters.category, filters.sortBy, filters.timeFilter, filters.activityTags, filters.searchQuery]);

  // Initial load
  useEffect(() => {
    loadPosts(true);
  }, [country.id]); // Only reload when country changes

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (currentRequestRef.current) {
        currentRequestRef.current.abort();
      }
    };
  }, []);

  return {
    posts,
    uiState,
    filters,
    actions: {
      loadPosts: () => loadPosts(true),
      loadMorePosts,
      refreshPosts,
      createPost,
      updatePostInteraction,
      updateFilters,
      setSelectedPost,
      setShowCreateModal,
      setShowFilters
    }
  };
}; 
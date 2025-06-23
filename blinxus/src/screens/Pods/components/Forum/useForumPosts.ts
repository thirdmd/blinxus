// Custom hook for Forum Posts - ULTRA-RESPONSIVE with instant UI updates

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
  
  // RADICAL: Separate UI posts from loading state
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [uiState, setUIState] = useState<ForumUIState>({
    isLoading: true,
    isLoadingMore: false,
    isRefreshing: false,
    error: null,
    hasMore: true,
    currentPage: 1,
    selectedPost: null,
    showCreateModal: false,
    showFilters: false,
  });

  // RADICAL: Background sync queue for instant UI updates
  const [pendingPosts, setPendingPosts] = useState<ForumPost[]>([]);
  const backgroundSyncRef = useRef<Set<string>>(new Set());
  
  const [filters, setFilters] = useState<ForumFilters>({
    location: 'All',
    category: 'All',
    sortBy: 'recent',
    timeFilter: 'all',
    activityTags: [],
    searchQuery: '',
    ...initialFilters
  });

  // Loading state management
  const isLoadingRef = useRef(false);
  const currentRequestRef = useRef<AbortController | null>(null);

  const updateUIState = useCallback((updates: Partial<ForumUIState>) => {
    setUIState(prev => ({ ...prev, ...updates }));
  }, []);

  // RADICAL: Get combined posts (real + pending) for instant UI
  const getAllPosts = useCallback(() => {
    return [...pendingPosts, ...posts];
  }, [pendingPosts, posts]);

  // Load posts from API
  const loadPosts = useCallback(async (reset: boolean = true) => {
    if (isLoadingRef.current) {
      currentRequestRef.current?.abort();
    }

    isLoadingRef.current = true;
    const controller = new AbortController();
    currentRequestRef.current = controller;

    try {
      const pageToLoad = reset ? 1 : uiState.currentPage + 1;
      
      updateUIState({ 
        isLoading: reset,
        isLoadingMore: !reset,
        error: null,
        currentPage: pageToLoad
      });

      const response = await ForumAPI.getPosts({
        countryId: country.id,
        locationId: filters.location !== 'All' ? filters.location : undefined,
        category: filters.category !== 'All' ? filters.category : undefined,
        activityTags: filters.activityTags.length > 0 ? filters.activityTags : undefined,
        sortBy: filters.sortBy,
        searchQuery: filters.searchQuery || undefined,
        page: pageToLoad,
        limit: 20
      });

      if (controller.signal.aborted) return;

      if (response.success && response.posts) {
        // RADICAL: Only update real posts, don't touch pending posts
        if (reset) {
          setPosts(response.posts);
          // Clear pending posts that are now in real posts
          setPendingPosts(prev => prev.filter(pending => 
            !response.posts!.some(real => real.id === pending.id)
          ));
        } else {
          setPosts(prev => [...prev, ...response.posts!]);
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

  // RADICAL: Create post with INSTANT UI update + background sync
  const createPost = useCallback(async (data: CreateForumPostRequest): Promise<boolean> => {
    try {
      // INSTANT: Create optimistic post for immediate UI update
      const optimisticPost: ForumPost = {
        id: `optimistic-${Date.now()}-${Math.random()}`,
        authorId: 'current_user',
        author: {
          id: 'current_user',
          username: 'you',
          displayName: 'You',
          initials: 'YU',
          color: '#3B82F6',
          nationalityFlag: '🇵🇭',
          memberSince: new Date().toISOString()
        },
        content: data.content,
        locationId: data.locationId,
        location: {
          id: data.locationId,
          name: data.locationId === 'All' ? country.name : data.locationId,
          type: 'city',
          countryId: country.id
        },
        countryId: country.id,
        category: data.category,
        activityTags: data.activityTags,
        likes: 0,
        dislikes: 0,
        replyCount: 0,
        viewCount: 1,
        bookmarkCount: 0,
        isLiked: false,
        isDisliked: false,
        isBookmarked: false,
        isFollowing: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastActivityAt: new Date().toISOString(),
        status: 'active',
        isPinned: false,
        isLocked: false,
        metadata: {
          editCount: 0,
          reportCount: 0
        }
      };

      // INSTANT: Add to pending posts for immediate UI update
      setPendingPosts(prev => [optimisticPost, ...prev]);
      updateUIState({ showCreateModal: false, error: null });

      // BACKGROUND: Sync with API without blocking UI
      backgroundSyncRef.current.add(optimisticPost.id);
      
      // Don't await this - let it run in background
      ForumAPI.createPost({
        ...data,
        countryId: country.id
      }).then(response => {
        if (response.success && response.post) {
          // SUCCESS: Replace optimistic post with real post
          setPendingPosts(prev => prev.filter(p => p.id !== optimisticPost.id));
          setPosts(prev => [response.post!, ...prev]);
          backgroundSyncRef.current.delete(optimisticPost.id);
        } else {
          // FAILURE: Remove optimistic post and show error
          setPendingPosts(prev => prev.filter(p => p.id !== optimisticPost.id));
          updateUIState({ error: response.error || 'Failed to create post' });
          backgroundSyncRef.current.delete(optimisticPost.id);
        }
      }).catch(error => {
        // ERROR: Remove optimistic post and show error
        setPendingPosts(prev => prev.filter(p => p.id !== optimisticPost.id));
        updateUIState({ error: error.message || 'Failed to create post' });
        backgroundSyncRef.current.delete(optimisticPost.id);
      });

      // INSTANT: Return success immediately for UI responsiveness
      return true;

    } catch (error: any) {
      updateUIState({ error: error.message || 'Failed to create post' });
      return false;
    }
  }, [country, updateUIState]);

  // RADICAL: Update post interactions with instant feedback
  const updatePostInteraction = useCallback(async (
    postId: string, 
    action: UpdatePostInteractionRequest['action']
  ) => {
    try {
      // INSTANT: Optimistic update for immediate feedback
      const updatePost = (post: ForumPost) => {
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
      };

      // Update both pending and real posts instantly
      setPendingPosts(prev => prev.map(post => 
        post.id === postId ? updatePost(post) : post
      ));
      setPosts(prev => prev.map(post => 
        post.id === postId ? updatePost(post) : post
      ));

      // BACKGROUND: Sync with API
      ForumAPI.updatePostInteraction({ postId, action }).then(response => {
        if (!response.success) {
          // Revert on failure - but don't block UI
          console.warn('Failed to sync interaction:', response.error);
        }
      }).catch(error => {
        console.warn('Failed to sync interaction:', error.message);
      });

    } catch (error: any) {
      console.warn('Failed to update interaction:', error.message);
    }
  }, []);

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

  // PERFORMANCE: Instant filter changes - no debounce delay
  useEffect(() => {
    // INSTANT: Load posts immediately when filters change
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
      backgroundSyncRef.current.clear();
    };
  }, []);

  return {
    posts: getAllPosts(), // RADICAL: Return combined posts for instant UI
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
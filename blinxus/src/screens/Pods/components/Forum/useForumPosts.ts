// Custom hook for Forum Posts - ULTRA-RESPONSIVE with instant UI updates

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
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
import { useLikedPosts } from '../../../../store/LikedPostsContext';
import { useSavedPosts } from '../../../../store/SavedPostsContext';
import { useComments } from '../../../../store/CommentsContext';

interface UseForumPostsProps {
  country?: Country; // Make country optional for global feed
  initialFilters?: Partial<ForumFilters>;
}

export const useForumPosts = ({ 
  country, // Can be undefined now
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

  // Centralized state hooks
  const { isPostLiked, likePost, unlikePost } = useLikedPosts();
  const { isPostSaved, savePost, unsavePost } = useSavedPosts();
  const { getCommentsForPost } = useComments();

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

      const requestParams: any = {
        locationId: filters.location !== 'All' ? filters.location : undefined,
        category: filters.category !== 'All' ? filters.category : undefined,
        activityTags: filters.activityTags.length > 0 ? filters.activityTags : undefined,
        sortBy: filters.sortBy,
        searchQuery: filters.searchQuery || undefined,
        page: pageToLoad,
        limit: 20
      };

      if (country?.id) {
        requestParams.countryId = country.id;
      }

      const response = await ForumAPI.getPosts(requestParams);

      if (controller.signal.aborted) return;

      if (response.success && response.posts) {
        // Decorate posts with centralized state
        const decoratedPosts = response.posts.map(post => ({
          ...post,
          isLiked: isPostLiked(post.id),
          isBookmarked: isPostSaved(post.id),
          replyCount: getCommentsForPost(post.id).length,
        }));

        // RADICAL: Only update real posts, don't touch pending posts
        if (reset) {
          setPosts(decoratedPosts);
          // Clear pending posts that are now in real posts
          setPendingPosts(prev => prev.filter(pending => 
            !decoratedPosts.some(real => real.id === pending.id)
          ));
        } else {
          setPosts(prev => [...prev, ...decoratedPosts]);
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
  }, [country?.id, filters, uiState.currentPage, updateUIState, isPostLiked, likePost, unlikePost, isPostSaved, savePost, unsavePost, getCommentsForPost]);

  // Function to update a single post in the state
  const updatePost = useCallback((postId: string, updates: Partial<ForumPost>) => {
    const updateList = (list: ForumPost[]) => 
      list.map(p => (p.id === postId ? { ...p, ...updates } : p));

    setPosts(prev => updateList(prev));
    setPendingPosts(prev => updateList(prev));
  }, []);

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
          name: data.locationId === 'All' ? (country?.name || 'Global') : data.locationId,
          type: 'city',
          countryId: country?.id || 'global'
        },
        countryId: country?.id || 'global',
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
        countryId: country?.id || 'global', // Ensure countryId is always a string
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
    switch(action) {
        case 'like': {
            const post = [...posts, ...pendingPosts].find(p => p.id === postId);
            if (!post) break;
            const currentlyLiked = isPostLiked(postId);
            // Optimistic UI update
            updatePost(postId, {
                isLiked: !currentlyLiked,
                likes: post.likes + (currentlyLiked ? -1 : 1),
            });
            // Update context
            if (currentlyLiked) {
                unlikePost(postId);
            } else {
                likePost(postId);
            }
            break;
        }
        case 'bookmark':
            if (isPostSaved(postId)) {
                unsavePost(postId);
            } else {
                savePost(postId);
            }
            break;
    }

    // Backend sync
    try {
        await ForumAPI.updatePostInteraction({ postId, action });
    } catch (error) {
        // Revert on failure
        switch(action) {
            case 'like': {
                const post = [...posts, ...pendingPosts].find(p => p.id === postId);
                if (!post) break;
                const currentlyLiked = isPostLiked(postId);
                updatePost(postId, {
                    isLiked: currentlyLiked,
                    likes: post.likes,
                });
                if (currentlyLiked) unlikePost(postId); else likePost(postId);
                break;
            }
            case 'bookmark':
                if (isPostSaved(postId)) unsavePost(postId); else savePost(postId);
                break;
        }
    }
  }, [isPostLiked, likePost, unlikePost, isPostSaved, savePost, unsavePost, updatePost, posts, pendingPosts]);

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
  }, [country?.id]); // Only reload when country changes

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (currentRequestRef.current) {
        currentRequestRef.current.abort();
      }
      backgroundSyncRef.current.clear();
    };
  }, []);

  const returnedValue = useMemo(() => {
    return {
      posts: getAllPosts(), // RADICAL: Return combined posts for instant UI
      uiState,
      filters,
      actions: {
        loadPosts,
        loadMorePosts,
        refreshPosts,
        createPost,
        updatePostInteraction,
        updateFilters,
        setSelectedPost,
        setShowCreateModal,
        setShowFilters,
        updatePost, // Expose the new function
      },
    };
  }, [
    posts,
    pendingPosts,
    uiState,
    loadPosts,
    loadMorePosts,
    refreshPosts,
    createPost,
    updatePostInteraction,
    updateFilters,
    setSelectedPost,
    setShowCreateModal,
    setShowFilters,
    updatePost, // Add to dependency array
  ]);

  return returnedValue;
}; 
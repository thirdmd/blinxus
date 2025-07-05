import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { PostCardProps } from '../types/structures/posts_structure';
import { createAnimationValues } from '../utils/animations';

export interface FullscreenConfig {
  // Context information
  screenName: string;
  feedContext?: 'recent' | 'activities' | 'explore' | 'profile' | 'photos';
  
  // Data management
  posts: PostCardProps[];
  selectedPostIndex: number;
  
  // Scroll position management
  scrollPosition: number;
  setScrollPosition: (position: number) => void;
  scrollRef: React.RefObject<any>;
  
  // Custom handlers
  onLucidPress?: (post: PostCardProps) => void;
  onBackCustom?: () => void;
}

export interface FullscreenState {
  isFullscreen: boolean;
  selectedPostIndex: number;
  animationValues: ReturnType<typeof createAnimationValues>;
}

// Simplified state management for modal-based fullscreen
type FullscreenPhase = 'idle' | 'active' | 'closing';

export const useFullscreenManager = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedPostIndex, setSelectedPostIndex] = useState(0);
  const [currentConfig, setCurrentConfig] = useState<FullscreenConfig | null>(null);
  const [phase, setPhase] = useState<FullscreenPhase>('idle');
  
  // Keep animation values for backward compatibility
  const animationValues = useRef(createAnimationValues()).current;
  
  // RADICAL FIX: Safe navigation hook with error handling
  let navigation;
  try {
    navigation = useNavigation();
  } catch (error) {
    // Silently handle navigation hook failure to prevent text rendering errors
    navigation = null;
  }

  // RADICAL FIX: Safe cleanup with proper sequencing
  const safeCleanup = useCallback(() => {
    // Step 1: Restore scroll position first
    if (currentConfig?.scrollRef.current) {
      const restoreScroll = () => {
        try {
          if (currentConfig.scrollRef.current?.scrollTo) {
            currentConfig.scrollRef.current.scrollTo({ 
              y: currentConfig.scrollPosition, 
              animated: false 
            });
          } else if (currentConfig.scrollRef.current?.scrollToOffset) {
            currentConfig.scrollRef.current.scrollToOffset({ 
              offset: currentConfig.scrollPosition, 
              animated: false 
            });
          }
        } catch (error) {
          // Silently handle scroll restoration errors
        }
      };
      
      // Multiple restoration attempts for reliability
      restoreScroll();
      setTimeout(restoreScroll, 50);
      setTimeout(restoreScroll, 100);
    }
    
    // Step 2: Custom back handler (if any)
    if (currentConfig?.onBackCustom) {
      try {
        currentConfig.onBackCustom();
      } catch (error) {
        // Silently handle custom back handler failures
      }
    }
    
    // Step 3: Reset state safely
    setCurrentConfig(null);
    setPhase('idle');
  }, [currentConfig]);

  // Enter fullscreen - simplified for modal
  const enterFullscreen = useCallback((config: FullscreenConfig) => {
    if (phase !== 'idle') return; // Prevent multiple entries
    
    setCurrentConfig(config);
    setSelectedPostIndex(config.selectedPostIndex);
    setIsFullscreen(true);
    setPhase('active');
  }, [phase]);

  // RADICAL FIX: Safe exit with proper sequencing
  const exitFullscreen = useCallback(() => {
    if (phase !== 'active' || !currentConfig) return; // Prevent multiple exits
    
    // Step 1: Set closing phase to prevent further operations
    setPhase('closing');
    
    // Step 2: Close modal immediately
    setIsFullscreen(false);
    
    // Step 3: Schedule cleanup after modal closes
    setTimeout(() => {
      safeCleanup();
    }, 100); // Small delay to let modal close animation complete
    
  }, [currentConfig, phase, safeCleanup]);

  // 🚀 INSTANT EXIT: For direct transitions without animation
  const instantExit = useCallback(() => {
    if (phase !== 'active' || !currentConfig) return;
    
    // Immediate cleanup for instant transitions
    setIsFullscreen(false);
    setPhase('closing');
    
    // Immediate cleanup
    setTimeout(() => {
      if (currentConfig?.onBackCustom) {
        try {
          currentConfig.onBackCustom();
        } catch (error) {
          // Silently handle instant exit custom handler failures
        }
      }
      setCurrentConfig(null);
      setPhase('idle');
    }, 50); // Minimal delay for state consistency
    
  }, [currentConfig, phase]);

  // Handle post press with context awareness
  const handlePostPress = useCallback((
    post: PostCardProps, 
    posts: PostCardProps[], 
    config: Omit<FullscreenConfig, 'posts' | 'selectedPostIndex'>
  ) => {
    // RADICAL FIX: Prevent operations during closing phase
    if (phase === 'closing') return;
    
    const postIndex = posts.findIndex(p => p.id === post.id);
    const fullConfig: FullscreenConfig = {
      ...config,
      posts,
      selectedPostIndex: postIndex >= 0 ? postIndex : 0
    };
    
    enterFullscreen(fullConfig);
  }, [enterFullscreen, phase]);

  // Handle lucid press with fallback navigation
  const handleLucidPress = useCallback((post: PostCardProps) => {
    // RADICAL FIX: Prevent navigation during closing phase
    if (phase === 'closing') return;
    
    // RADICAL FIX: Check if navigation is available
    if (!navigation) {
      // Silently handle navigation unavailability
      return;
    }
    
    try {
      // CENTRALIZED LUCID BEHAVIOR: Always navigate to LucidFullscreen for consistent immersive experience
      // Pass current fullscreen context so LucidFullscreen knows where to navigate back to
      (navigation as any).navigate('LucidFullscreen', { 
        post,
        // Pass context about where we came from for proper back navigation
        previousContext: currentConfig ? {
          screenName: currentConfig.screenName,
          feedContext: currentConfig.feedContext,
          scrollPosition: currentConfig.scrollPosition,
          selectedPostIndex: currentConfig.selectedPostIndex
        } : null
      });
    } catch (error) {
      // Silently handle lucid navigation failures
    }
  }, [navigation, currentConfig, phase]);

  return {
    // State
    isFullscreen,
    selectedPostIndex,
    animationValues,
    currentConfig,
    phase, // Expose phase for debugging
    
    // Actions
    enterFullscreen,
    exitFullscreen,
    instantExit, // NEW: Instant exit for direct transitions
    handlePostPress,
    handleLucidPress,
    
    // Utilities
    setSelectedPostIndex,
  };
};

export default useFullscreenManager; 
import { useState, useRef, useCallback, useEffect } from 'react';
import { Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PostCardProps } from '../types/structures/posts_structure';
import { 
  createAnimationValues, 
  FEED_ANIMATIONS, 
  runAnimation 
} from '../utils/animations';

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

// RADICAL APPROACH: State Machine for Fullscreen Management  
type FullscreenPhase = 'idle' | 'entering' | 'active' | 'exiting';

export const useFullscreenManager = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedPostIndex, setSelectedPostIndex] = useState(0);
  const [currentConfig, setCurrentConfig] = useState<FullscreenConfig | null>(null);
  const [phase, setPhase] = useState<FullscreenPhase>('idle');
  
  // Animation values for consistent transitions
  const animationValues = useRef(createAnimationValues()).current;
  
  const navigation = useNavigation();
  
  // RADICAL FIX: Async state scheduler to avoid React's restricted phases
  const scheduleStateUpdate = useCallback((updateFn: () => void) => {
    // Schedule state updates outside React's render/effect phases
    requestAnimationFrame(() => {
      setTimeout(updateFn, 0);
    });
  }, []);

  // RADICAL FIX: State machine effect for safe transitions
  useEffect(() => {
    if (phase === 'entering') {
      // Safe state update after animation completes
      scheduleStateUpdate(() => {
        setIsFullscreen(true);
        setPhase('active');
      });
    } else if (phase === 'exiting') {
      // Safe cleanup after exit animation
      scheduleStateUpdate(() => {
        setIsFullscreen(false);
        setPhase('idle');
        
        // Scroll position restoration
        if (currentConfig?.scrollRef.current) {
          const restoreScroll = () => {
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
          };
          
          // Multiple restoration attempts for reliability
          restoreScroll();
          setTimeout(restoreScroll, 50);
          setTimeout(restoreScroll, 100);
        }
        
        // Custom back handler
        if (currentConfig?.onBackCustom) {
          currentConfig.onBackCustom();
        }
        
        // Reset config
        setCurrentConfig(null);
      });
    }
  }, [phase, currentConfig, scheduleStateUpdate]);

  // Enter fullscreen with state machine approach
  const enterFullscreen = useCallback((config: FullscreenConfig) => {
    if (phase !== 'idle') return; // Prevent multiple entries
    
    setCurrentConfig(config);
    setSelectedPostIndex(config.selectedPostIndex);
    setPhase('entering');
    
    // Start expand animation - state updates happen in useEffect
    runAnimation(
      FEED_ANIMATIONS.expand(animationValues)
      // No callback needed - state machine handles it
    );
  }, [animationValues, phase]);

  // Exit fullscreen with state machine approach
  const exitFullscreen = useCallback(() => {
    if (phase !== 'active' || !currentConfig) return; // Prevent multiple exits
    
    setPhase('exiting');
    
    // Start collapse animation - state updates happen in useEffect  
    runAnimation(
      FEED_ANIMATIONS.collapse(animationValues)
      // No callback needed - state machine handles it
    );
  }, [currentConfig, animationValues, phase]);

  // 🚀 INSTANT EXIT: For direct transitions without animation
  const instantExit = useCallback(() => {
    if (phase !== 'active' || !currentConfig) return;
    
    // Skip animation, go directly to cleanup
    scheduleStateUpdate(() => {
      setIsFullscreen(false);
      setPhase('idle');
      
      // Skip scroll restoration for direct transitions
      // The calling component will handle scroll positioning
      
      // Custom back handler
      if (currentConfig?.onBackCustom) {
        currentConfig.onBackCustom();
      }
      
      // Reset config
      setCurrentConfig(null);
    });
  }, [currentConfig, phase, scheduleStateUpdate]);

  // Handle post press with context awareness
  const handlePostPress = useCallback((
    post: PostCardProps, 
    posts: PostCardProps[], 
    config: Omit<FullscreenConfig, 'posts' | 'selectedPostIndex'>
  ) => {
    const postIndex = posts.findIndex(p => p.id === post.id);
    const fullConfig: FullscreenConfig = {
      ...config,
      posts,
      selectedPostIndex: postIndex >= 0 ? postIndex : 0
    };
    
    enterFullscreen(fullConfig);
  }, [enterFullscreen]);

  // Handle lucid press with fallback navigation
  const handleLucidPress = useCallback((post: PostCardProps) => {
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
  }, [navigation, currentConfig]);

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
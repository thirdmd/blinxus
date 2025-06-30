import { useState, useRef, useCallback } from 'react';
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
  feedContext?: 'recent' | 'activities' | 'explore' | 'profile';
  
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

export const useFullscreenManager = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedPostIndex, setSelectedPostIndex] = useState(0);
  const [currentConfig, setCurrentConfig] = useState<FullscreenConfig | null>(null);
  
  // Animation values for consistent transitions
  const animationValues = useRef(createAnimationValues()).current;
  
  const navigation = useNavigation();

  // Enter fullscreen with consistent animation
  const enterFullscreen = useCallback((config: FullscreenConfig) => {
    setCurrentConfig(config);
    setSelectedPostIndex(config.selectedPostIndex);
    
    // Start expand animation and then show fullscreen
    runAnimation(
      FEED_ANIMATIONS.expand(animationValues),
      () => {
        setIsFullscreen(true);
      }
    );
  }, [animationValues]);

  // Exit fullscreen with consistent animation and scroll restoration
  const exitFullscreen = useCallback(() => {
    if (!currentConfig) return;

    // Start collapse animation first
    runAnimation(
      FEED_ANIMATIONS.collapse(animationValues),
      () => {
        // INSTANT back transition after animation
        setIsFullscreen(false);
        
        // Consistent scroll position restoration
        const restoreScrollPosition = () => {
          if (currentConfig.scrollRef.current) {
            // Handle different scroll ref types
            if (currentConfig.scrollRef.current.scrollTo) {
              // ScrollView
              currentConfig.scrollRef.current.scrollTo({ 
                y: currentConfig.scrollPosition, 
                animated: false 
              });
            } else if (currentConfig.scrollRef.current.scrollToOffset) {
              // FlatList
              currentConfig.scrollRef.current.scrollToOffset({ 
                offset: currentConfig.scrollPosition, 
                animated: false 
              });
            }
          }
        };
        
        // Multiple restoration attempts for reliability
        setTimeout(restoreScrollPosition, 0);
        requestAnimationFrame(() => {
          setTimeout(restoreScrollPosition, 0);
        });
        setTimeout(restoreScrollPosition, 100);
        
        // Call custom back handler if provided
        if (currentConfig.onBackCustom) {
          currentConfig.onBackCustom();
        }
        
        // Reset config
        setCurrentConfig(null);
      }
    );
  }, [currentConfig, animationValues]);

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
    
    // Actions
    enterFullscreen,
    exitFullscreen,
    handlePostPress,
    handleLucidPress,
    
    // Utilities
    setSelectedPostIndex,
  };
};

export default useFullscreenManager; 
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions, StatusBar, ScrollView, Alert, Modal, TextInput, Animated, ImageBackground } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import ReanimatedAnimated, { useSharedValue, useAnimatedStyle, useAnimatedGestureHandler, runOnJS, withSpring, withTiming } from 'react-native-reanimated';
import { PostCardProps } from '../types/structures/posts_structure';
import { Heart, MessageCircle, Send, Bookmark, MoreVertical, MapPinned, Edit, Trash2, Flag, X, Check, Camera, Info, Images, MoreHorizontal, Album, Menu, ChevronRight, Maximize2, Square, Layout, FileText, AlignJustify, Maximize, Minimize, ArrowRightCircle } from 'lucide-react-native';
import { usePosts } from '../store/PostsContext';
import { useSavedPosts } from '../store/SavedPostsContext';
import { useLikedPosts } from '../store/LikedPostsContext';
import { useThemeColors } from '../hooks/useThemeColors';
import { useNavigation, NavigationProp, ParamListBase } from '@react-navigation/native';
import { activityTags, ActivityKey, type ActivityTag, activityColors, activityNames } from '../constants/activityTags';
import PillTag from './PillTag';
import DetailPostView from './DetailPostView';
import { getResponsiveDimensions, getTypographyScale, getSpacingScale, ri, rs, rf, RESPONSIVE_SCREEN, getImmersiveScreenDimensions, getSafeAreaAdjustments } from '../utils/responsive';
import { useOrientation, Orientation } from '../hooks/useOrientation';
import UserProfileNavigation from '../utils/userProfileNavigation';
import { placesData, getLocationByName, getCountryByLocationId, resolveLocationForNavigation } from '../constants/placesData';
import { LocationNavigation } from '../utils/locationNavigation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface TravelFeedCardProps extends PostCardProps {
  onDetailsPress: () => void;
  onReset?: () => void;
  isVisible?: boolean;
  onLucidPress?: () => void;
  appBarElementsVisible?: boolean; // Whether app bar elements (logo, grid) are visible
  cardIndex?: number; // Card index for alignment logic
}

const { width: screenWidth, height: screenHeight } = RESPONSIVE_SCREEN;
const responsiveDimensions = getResponsiveDimensions();
const typography = getTypographyScale();
const spacing = getSpacingScale();
const immersiveDimensions = getImmersiveScreenDimensions();
const safeArea = getSafeAreaAdjustments();

const iconShadow = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.15,
  shadowRadius: 4,
  elevation: 3, // for Android
};

// Immersive Swipeable Image Carousel Component
const ImmersiveImageCarousel: React.FC<{
  images: string[];
  onImageChange?: (index: number) => void;
  onSwipeLeftOnFirst?: () => void;
  onDoubleTap?: () => void;
  isLucid?: boolean;
  detailsTranslateX?: any;
  onGestureStart?: () => void;
  onGestureEnd?: (shouldOpen: boolean) => void;
  onLucidPress?: () => void;
  onZoomToggle?: (toggleFn: () => void, isZoomedOut: boolean) => void;
}> = React.memo(({ images, onImageChange, onSwipeLeftOnFirst, onDoubleTap, isLucid = false, detailsTranslateX, onGestureStart, onGestureEnd, onLucidPress, onZoomToggle }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastTap, setLastTap] = useState(0);
  const [showHeart, setShowHeart] = useState(false);
  const heartScale = useRef(new Animated.Value(0)).current;
  
  // Zoom state management for free zoom
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const [isZoomedOut, setIsZoomedOut] = useState(false);
  
  // FIXED: Add state to track scale for render-time decisions
  const [currentScale, setCurrentScale] = useState(1);
  
  // Toggle zoom mode with button - FIXED: Keep scale at 1.0 for edge-to-edge contain mode
  const toggleZoomMode = useCallback(() => {
    if (isZoomedOut) {
      // Return to fullscreen cover mode
      scale.value = withTiming(1, undefined, (finished) => {
        if (finished) {
          runOnJS(setCurrentScale)(1);
        }
      });
      translateX.value = withTiming(0);
      translateY.value = withTiming(0);
      setIsZoomedOut(false);
    } else {
      // Switch to original aspect ratio (contain mode) - keep scale at 1.0 for edge-to-edge
      scale.value = withTiming(1, undefined, (finished) => {
        if (finished) {
          runOnJS(setCurrentScale)(1);
        }
      });
      translateX.value = withTiming(0);
      translateY.value = withTiming(0);
      setIsZoomedOut(true);
    }
  }, [isZoomedOut, scale, translateX, translateY]);

  // FIXED: Initialize currentScale
  React.useEffect(() => {
    setCurrentScale(1); // Initialize to default scale
  }, []);

  // Pass toggle function to parent
  useEffect(() => {
    if (onZoomToggle) {
      onZoomToggle(toggleZoomMode, isZoomedOut);
    }
  }, [onZoomToggle, toggleZoomMode, isZoomedOut]);
  
  // CLEANUP: Reset state when component unmounts or images change
  useEffect(() => {
    return () => {
      // Clean up animation
      heartScale.setValue(0);
      setShowHeart(false);
      setCurrentIndex(0);
      setLastTap(0);
      // Reset zoom state
      scale.value = 1;
      translateX.value = 0;
      translateY.value = 0;
      setIsZoomedOut(false);
      setCurrentScale(1);
    };
  }, [heartScale, scale, translateX, translateY]);

  // Pan gesture handler for details panel (original functionality)
  const panGestureHandler = useAnimatedGestureHandler({
    onStart: () => {
      // FIXED: Remove .value access during gesture
      if (onGestureStart) {
        runOnJS(onGestureStart)();
      }
    },
    onActive: (event) => {
      // INSTANT: Reduced threshold from 20 to 5 for immediate response
      const isHorizontalSwipe = Math.abs(event.translationX) > Math.abs(event.translationY) * 1.2;
      const isRightSwipe = event.translationX > 0;
      
      if (isRightSwipe && Math.abs(event.translationX) > 5 && isHorizontalSwipe) {
        const canSwipeToDetails = isLucid || currentIndex === 0;
        if (canSwipeToDetails && onGestureStart) {
          runOnJS(onGestureStart)();
        }
      }
      
      const canSwipeToDetails = isLucid ? isRightSwipe : (currentIndex === 0 && isRightSwipe);
      
      // INSTANT: Reduced threshold from 15 to 5
      if (canSwipeToDetails && isHorizontalSwipe && detailsTranslateX && Math.abs(event.translationX) > 5) {
        const progress = Math.max(0, event.translationX / screenWidth);
        detailsTranslateX.value = -screenWidth + (progress * screenWidth);
      }
    },
    onEnd: (event) => {
      // Original details panel logic
      const isHorizontalSwipe = Math.abs(event.translationX) > Math.abs(event.translationY) * 1.5;
      const isRightSwipe = event.translationX > 0;
      // INSTANT: Reduced threshold from 0.15 to 0.08
      const shouldOpen = isHorizontalSwipe && isRightSwipe && Math.abs(event.translationX) > screenWidth * 0.08;
      const finalShouldOpen = shouldOpen && (isLucid || currentIndex === 0);
      
      if (onGestureEnd) {
        runOnJS(onGestureEnd)(finalShouldOpen);
      }
    }
  });

  // Animated style for zoom and pan
  const animatedImageStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });

  // MEMORY OPTIMIZATION: Memoize scroll handlers
  const handleScroll = useCallback((event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / screenWidth);
    
    // INSTANT DETECTION: Check for left swipe during scroll for immediate response
    if (scrollPosition < -10 && currentIndex === 0) { // INSTANT: Reduced from -25 to -10
      onSwipeLeftOnFirst?.();
      return;
    }
    
    if (index !== currentIndex) {
      setCurrentIndex(index);
      onImageChange?.(index);
    }
  }, [currentIndex, onSwipeLeftOnFirst, onImageChange]);

  const handleScrollEnd = useCallback((event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    // SUPER SENSITIVE: If we're swiping left on the first image (negative scroll)
    if (scrollPosition < -5 && currentIndex === 0) { // INSTANT: Reduced from -15 to -5
      onSwipeLeftOnFirst?.();
    }
  }, [currentIndex, onSwipeLeftOnFirst]);

  const handleMomentumScrollBegin = useCallback((event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    // Even more sensitive detection during momentum start
    if (scrollPosition < -5 && currentIndex === 0) { // INSTANT: Reduced from -10 to -5
      onSwipeLeftOnFirst?.();
    }
  }, [currentIndex, onSwipeLeftOnFirst]);

  const handleImagePress = useCallback(() => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 250; // INSTANT: Faster double-tap recognition
    
    if (lastTap && now - lastTap < DOUBLE_PRESS_DELAY) {
      // Double tap detected - ONLY FOR HEART REACT (removed zoom conflict)
      if (onDoubleTap) {
        onDoubleTap(); // Original like functionality
      }
      
      // Prevent the single tap action from firing
      setLastTap(0);
      
      // CLEANUP: Stop any existing animation before starting new one
      heartScale.stopAnimation();
      
      // ULTRA FAST ANIMATION: Even faster for instant feedback
      setShowHeart(true);
      Animated.sequence([
        Animated.timing(heartScale, {
          toValue: 1.3,
          duration: 100, // INSTANT: Even faster scale up
          useNativeDriver: true,
        }),
        Animated.timing(heartScale, {
          toValue: 0,
          duration: 150, // INSTANT: Faster fade out
          useNativeDriver: true,
        }),
      ]).start((finished) => {
        if (finished) {
          setShowHeart(false);
          heartScale.setValue(0);
        }
      });
    } else {
      // Single tap - INSTANT RESPONSE for Lucids
      if (isLucid && onLucidPress) {
        onLucidPress();
      }
      setLastTap(now);
    }
  }, [lastTap, onDoubleTap, isLucid, onLucidPress, heartScale]);

  if (!images || images.length === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      {/* Frosted Background - Only show when zoomed out */}
      {isZoomedOut && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
          <Image 
            source={{ uri: currentImage }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
            blurRadius={8}
          />
          <View style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            backgroundColor: 'rgba(0, 0, 0, 0.15)' 
          }} />
        </View>
      )}

      <PanGestureHandler 
        onGestureEvent={panGestureHandler}
        enabled={true}
        activeOffsetX={[-5, 5]} // INSTANT: Reduced from [-15, 15] to [-5, 5]
        failOffsetY={[-5, 5]} // INSTANT: Reduced from [-8, 8]
        simultaneousHandlers={[]}
        shouldCancelWhenOutside={false}
        minPointers={1}
        maxPointers={1}
        avgTouches={false}
        waitFor={[]}
      >
        <ReanimatedAnimated.View style={{ flex: 1 }}>
          <ScrollView
            horizontal
            pagingEnabled={!isLucid && currentScale <= 1.1}
            showsHorizontalScrollIndicator={false}
            onScroll={!isLucid ? handleScroll : undefined}
            onScrollEndDrag={!isLucid ? handleScrollEnd : undefined}
            onMomentumScrollBegin={!isLucid ? handleMomentumScrollBegin : undefined}
            scrollEventThrottle={1} // INSTANT: Maximum responsiveness
            style={{ flex: 1 }}
            bounces={true}
            scrollEnabled={!isLucid && currentScale <= 1.1}
            removeClippedSubviews={false} // INSTANT: Keep all views ready
            contentInsetAdjustmentBehavior="never"
            decelerationRate="fast"
            directionalLockEnabled={true}
          >
            {images.map((image, index) => (
              <View
                key={index}
                style={{
                  width: responsiveDimensions.feedCard.width,
                  height: '100%',
                  position: 'relative'
                }}
              >
                <ReanimatedAnimated.View style={[animatedImageStyle, { width: '100%', height: '100%' }]}>
                  <Image
                    source={{ uri: image }}
                    style={{
                      width: '100%',
                      height: '100%',
                      resizeMode: isZoomedOut ? 'contain' : 'cover'
                    }}
                  />
                </ReanimatedAnimated.View>
                {/* Full-area touchable overlay with profile area exclusion */}
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                  }}
                  pointerEvents="box-none" // Allow touches to pass through to children
                >
                  {/* Profile exclusion zone - ULTRA PRECISE AREA ONLY for profile pic and name */}
                  <View
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: rs(180), // Reduced width - only cover profile pic and name
                      height: rs(45), // Reduced height - only cover profile pic and name row, NOT location pill
                    }}
                    pointerEvents="none" // Completely ignore touches in this area
                  />
                  
                  {/* Main touchable area */}
                  <TouchableOpacity
                    onPress={handleImagePress}
                    activeOpacity={1}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'transparent'
                    }}
                    delayPressIn={0}
                    delayPressOut={0}
                    delayLongPress={600}
                    hitSlop={{ top: 0, bottom: 0, left: 0, right: 0 }}
                  />
                </View>
              </View>
            ))}
          </ScrollView>
        </ReanimatedAnimated.View>
      </PanGestureHandler>
      
      {/* Heart Animation Overlay */}
      {showHeart && (
        <Animated.View
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: [
              { translateX: -25 },
              { translateY: -25 },
              { scale: heartScale }
            ],
            zIndex: 1000,
          }}
          pointerEvents="none"
        >
          <Heart
            size={50}
            color="#ff3040"
            fill="#ff3040"
          />
        </Animated.View>
      )}

    </View>
  );
});



const TravelFeedCard: React.FC<TravelFeedCardProps> = React.memo(({
  id,
  authorId,
  authorName,
  authorNationalityFlag,
  authorProfileImage,
  content,
  images,
  device,
  location,
  activityName,
  activityColor,
  timeAgo,
  likes,
  comments,
  activity,
  isEdited,
  editAttempts,
  locationEditCount,
  activityEditCount,
  onDetailsPress,
  type,
  timestamp,
  onReset,
  isVisible,
  onLucidPress,
  appBarElementsVisible = false, // Default to false (app bar elements hidden)
  cardIndex = 0 // Default to 0
}) => {
  const { deletePost, editPost, likePost, unlikePost, addComment } = usePosts();
  const { savePost, unsavePost, isPostSaved } = useSavedPosts();
  const { likePost: userLikePost, unlikePost: userUnlikePost, isPostLiked } = useLikedPosts();
  
  // Use navigation hook with error handling
  let finalNavigation;
  try {
    finalNavigation = useNavigation();
  } catch (error) {
    console.warn('Navigation hook failed in TravelFeedCard:', error);
    finalNavigation = null;
  }
  
  const themeColors = useThemeColors();
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const detailsTranslateX = useSharedValue(-screenWidth);
  const [commentCount, setCommentCount] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const [shareCount, setShareCount] = useState(0);
  const [savedCount, setSavedCount] = useState(0);

  // Zoom state from carousel
  const [zoomToggleFn, setZoomToggleFn] = useState<(() => void) | null>(null);
  const [isZoomedOut, setIsZoomedOut] = useState(false);

  // Fullscreen image state for rotation
  const [showFullscreenImage, setShowFullscreenImage] = useState(false);

  // Check if this is a Lucid post
  const isLucid = type === 'lucid';

  // CENTRALIZED LOGIC: ALL names and counters positioned below app bar
  const insets = useSafeAreaInsets();
  const overlayTop = insets.top + rs(12); // base value for all overlays
  const profileOffset = rs(5); // additional offset for profile group
  const indicatorOffset = rs(9); // additional offset for image indicator

  // Ensure name and image counter are always aligned
  const getAlignedTopPosition = () => {
    return overlayTop + profileOffset; // Both use same position for perfect alignment
  };

  // Handle rotation to fullscreen image - only when TravelFeedCard is visible
  const handleOrientationChange = useCallback((newOrientation: Orientation) => {
    if (isVisible && newOrientation === 'landscape' && images && images.length > 0) {
      // Show fullscreen image when rotating to landscape
      setShowFullscreenImage(true);
    } else if (newOrientation === 'portrait') {
      // Hide fullscreen image when rotating back to portrait
      setShowFullscreenImage(false);
    }
  }, [isVisible, images]);

  // Use orientation hook with callback only for this component
  const orientation = useOrientation(handleOrientationChange);

  // MEMORY OPTIMIZATION: Initialize saved and liked states
  useEffect(() => {
    const savedStatus = isPostSaved(id);
    setIsSaved(savedStatus);
    // Initialize saved count based on whether post is saved (simplified approach)
    setSavedCount(savedStatus ? 1 : 0);
    
    // Initialize like state from LikedPostsContext
    const likedStatus = isPostLiked(id);
    setIsLiked(likedStatus);
    setLikeCount(likes); // Ensure like count matches props
    setCommentCount(comments); // Ensure comment count matches props
  }, [id, isPostSaved, isPostLiked, likes, comments]);

  // INSTANT SYNC: Listen for changes in post data to immediately reflect edits
  const { posts } = usePosts();
  useEffect(() => {
    const currentPost = posts.find(p => p.id === id);
    if (currentPost) {
      // Force re-render with updated post data - this ensures instant sync
      setCommentCount(currentPost.comments || 0);
      setLikeCount(currentPost.likes || 0);
    }
  }, [posts, id]);

  // SYNC: Keep local state in sync with props when they change
  useEffect(() => {
    setLikeCount(likes);
    setCommentCount(comments);
  }, [likes, comments]);

  // CLEANUP: Comprehensive cleanup when component unmounts or changes
  useEffect(() => {
    return () => {
      // Reset all state to prevent memory leaks
      setShowDetails(false);
      setCurrentImageIndex(0);
      setIsLiked(false);
      setIsSaved(false);
      setCommentCount(comments);
      setLikeCount(likes);
      setShareCount(0);
      setSavedCount(0);
      
      // Reset animations
      if (showDetails) {
        detailsTranslateX.value = -screenWidth;
      }
    };
  }, []);

  // INSTANT SYNC: Use fresh post data from context to ensure immediate updates
  const postData = useMemo(() => {
    const currentPost = posts.find(p => p.id === id);
    if (currentPost) {
      // ABSOLUTE TRUTH: Get current activity data from post
      let currentActivityColor: string | undefined = undefined; // Default to undefined (no filter)
      let currentActivityName: string | undefined = undefined; // Default to undefined (no filter)
      
      // Only set activity color/name if post currently has an activity
      if (currentPost.activity) {
        currentActivityColor = activityColors[currentPost.activity];
        currentActivityName = activityNames[currentPost.activity];
      }
      
      return {
        ...currentPost,
        likes: likeCount, // Use current like count for UI consistency
        comments: commentCount, // Use current comment count for UI consistency
        activityColor: currentActivityColor, // ABSOLUTE TRUTH: undefined if no activity
        activityName: currentActivityName, // ABSOLUTE TRUTH: undefined if no activity
      };
    }
    // Fallback to original data if not found in context
    return {
      id,
      authorId,
      authorName,
      authorNationalityFlag,
      authorProfileImage,
      content,
      images,
      device,
      location,
      activityName,
      activityColor,
      timeAgo,
      likes: likeCount,
      comments: commentCount,
      activity,
      isEdited,
      editAttempts,
      locationEditCount,
      activityEditCount,
      type,
      timestamp
    };
  }, [posts, id, likeCount, commentCount, authorId, authorName, authorNationalityFlag, authorProfileImage, content, images, device, location, activityName, activityColor, timeAgo, activity, isEdited, editAttempts, locationEditCount, activityEditCount, type, timestamp]);

  // CENTRALIZED: Use unified profile navigation
  const handleProfilePress = useCallback(() => {
    if (!finalNavigation) {
      console.warn('Navigation not available for profile press');
      return;
    }
    
    try {
      // Navigate directly to profile
      const { handleTravelFeedProfile } = UserProfileNavigation.createHandlersForScreen(finalNavigation as any, 'ImmersiveFeed');
      handleTravelFeedProfile({
        authorId,
        authorName
      });
    } catch (error) {
      console.warn('Profile navigation failed:', error);
    }
  }, [authorName, authorId, finalNavigation]);

  // CENTRALIZED: Location navigation to Pods Forum - UNIVERSAL SYSTEM
  const handleLocationPress = useCallback(() => {
    if (!location) return;
    if (!finalNavigation) {
      console.warn('Navigation not available for location press');
      return;
    }
    
    try {
      // Navigate directly to forum for this location, preserving back behavior
      const success = LocationNavigation.navigateToForum(finalNavigation, location, 'ImmersiveFeed');
      console.log(`[DEBUG] Navigation to Forum success:`, success);
    } catch (error) {
      console.warn('Location navigation failed:', error);
    }
  }, [location, finalNavigation]);

  // Add ref for debouncing likes
  const lastLikeTime = useRef(0);
  const lastSaveTime = useRef(0);

  // Add animation refs for button feedback
  const likeButtonScale = useRef(new Animated.Value(1)).current;
  const saveButtonScale = useRef(new Animated.Value(1)).current;

  const handleLike = useCallback(() => {
    // Prevent multiple rapid likes by adding a small debounce check
    const now = Date.now();
    if (now - lastLikeTime.current < 50) { // ULTRA FAST: Reduced from 100 to 50ms
      return;
    }
    lastLikeTime.current = now;

    // INSTANT FEEDBACK: Trigger scale animation immediately
    Animated.sequence([
      Animated.timing(likeButtonScale, {
        toValue: 0.85,
        duration: 80, // INSTANT: Very fast scale down
        useNativeDriver: true,
      }),
      Animated.timing(likeButtonScale, {
        toValue: 1,
        duration: 120, // INSTANT: Quick bounce back
        useNativeDriver: true,
      }),
    ]).start();

    if (isLiked) {
      // Unlike the post
      userUnlikePost(id);
      unlikePost(id);
      setIsLiked(false);
      setLikeCount(prev => Math.max(0, prev - 1));
    } else {
      // Like the post
      userLikePost(id);
      likePost(id);
      setIsLiked(true);
      setLikeCount(prev => prev + 1);
    }
  }, [isLiked, id, unlikePost, likePost, userLikePost, userUnlikePost, likeButtonScale]);

  const handleGestureStart = useCallback(() => {
    setShowDetails(true);
  }, []);

  const handleGestureEnd = useCallback((shouldOpen: boolean) => {
    if (shouldOpen) {
      detailsTranslateX.value = withSpring(0, {
        damping: 25,  // INSTANT: Even faster spring response
        stiffness: 500, // INSTANT: Increased stiffness
        mass: 0.7 // INSTANT: Less mass
      });
    } else {
      detailsTranslateX.value = withSpring(-screenWidth, {
        damping: 25,
        stiffness: 500,
        mass: 0.7
      });
      setShowDetails(false);
    }
  }, [detailsTranslateX]);

  const handleShowDetails = useCallback(() => {
    setShowDetails(true);
    detailsTranslateX.value = withSpring(0, {
      damping: 25,  // INSTANT: Even faster spring response
      stiffness: 500,
      mass: 0.7
    });
  }, [detailsTranslateX]);

  const handleCloseDetails = useCallback(() => {
    detailsTranslateX.value = withSpring(-screenWidth, {
      damping: 25,
      stiffness: 500,
      mass: 0.7
    });
    setShowDetails(false);
  }, [detailsTranslateX]);

  const handleCommentsPress = useCallback(() => {
    handleShowDetails();
  }, [handleShowDetails]);

  const handleComment = useCallback(() => {
    handleShowDetails();
  }, [handleShowDetails]);

  const handleShare = useCallback(() => {
    Alert.alert(
      'Share Post',
      'Share this amazing travel moment!',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Share', 
          onPress: () => {
            setShareCount(prev => prev + 1);
            // Share post functionality
          }
        }
      ]
    );
  }, [id]);

  const handleSave = useCallback(() => {
    // Add debounce for save button too
    const now = Date.now();
    if (now - lastSaveTime.current < 50) { // ULTRA FAST: 50ms debounce
      return;
    }
    lastSaveTime.current = now;

    // INSTANT FEEDBACK: Trigger scale animation immediately
    Animated.sequence([
      Animated.timing(saveButtonScale, {
        toValue: 0.85,
        duration: 80, // INSTANT: Very fast scale down
        useNativeDriver: true,
      }),
      Animated.timing(saveButtonScale, {
        toValue: 1,
        duration: 120, // INSTANT: Quick bounce back
        useNativeDriver: true,
      }),
    ]).start();

    if (isSaved) {
      unsavePost(id);
      setIsSaved(false);
      setSavedCount(prev => Math.max(0, prev - 1));
    } else {
      savePost(id);
      setIsSaved(true);
      setSavedCount(prev => prev + 1);
    }
  }, [isSaved, id, unsavePost, savePost, saveButtonScale]);

  const handleSwipeLeftOnFirst = useCallback(() => {
    handleShowDetails();
  }, [handleShowDetails]);

  const handleLucidPress = useCallback(() => {
    if (isLucid) {
      if (onLucidPress) {
        // Use custom handler if provided (for in-screen lucid album view)
        onLucidPress();
      } else {
        // Fallback to navigation (for screens that don't handle lucid album in-screen)
        if (!finalNavigation) {
          console.warn('Navigation not available for lucid press');
          return;
        }
        
        try {
          (finalNavigation as any).navigate('LucidFullscreen', {
            post: postData
          });
        } catch (error) {
          console.warn('Lucid navigation failed:', error);
        }
      }
    }
  }, [isLucid, onLucidPress, finalNavigation, postData]);

  // Handle zoom toggle from carousel
  const handleZoomToggle = useCallback((toggleFn: () => void, zoomedOut: boolean) => {
    setZoomToggleFn(() => toggleFn);
    setIsZoomedOut(zoomedOut);
  }, []);

  // Rotation Mode: Show only image when in landscape with frosted background
  if (orientation === 'landscape') {
    const currentImage = images && images.length > 0 ? images[currentImageIndex] : null;
    
    return (
      <View 
        style={{ 
          width: screenWidth, // Use full screen width
          height: screenHeight, // Use full screen height
          backgroundColor: '#000'
        }}
      >
        {/* Only show the image carousel in landscape mode - FULLSCREEN */}
        {images && images.length > 0 ? (
          <View style={{ flex: 1 }}>
            <ScrollView
              horizontal
              pagingEnabled={true}
              showsHorizontalScrollIndicator={false}
              onScroll={(event) => {
                const scrollPosition = event.nativeEvent.contentOffset.x;
                const index = Math.round(scrollPosition / screenWidth);
                if (index !== currentImageIndex) {
                  setCurrentImageIndex(index);
                }
              }}
              scrollEventThrottle={1}
              style={{ flex: 1 }}
              bounces={true}
              scrollEnabled={true}
              removeClippedSubviews={false}
              contentInsetAdjustmentBehavior="never"
              decelerationRate="fast"
              directionalLockEnabled={true}
            >
              {images.map((image, index) => (
                <View
                  key={index}
                  style={{
                    width: screenWidth, // Full screen width
                    height: screenHeight, // Full screen height
                    position: 'relative'
                  }}
                >
                  <Image
                    source={{ uri: image }}
                    style={{
                      width: '100%',
                      height: '100%',
                      resizeMode: 'cover' // Fill entire screen for immersive experience
                    }}
                  />
                </View>
              ))}
            </ScrollView>
            
            {/* Image counter for landscape mode */}
            {images.length > 1 && (
              <View style={{
                position: 'absolute',
                top: immersiveDimensions.topOverlayPosition, // Use standard position for landscape
                right: rs(20),
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                paddingHorizontal: rs(12),
                paddingVertical: rs(6),
                borderRadius: rs(16)
              }}>
                <Text style={{
                  color: 'white',
                  fontSize: rf(14),
                  fontWeight: '600',
                  fontFamily: 'System'
                }}>
                  {currentImageIndex + 1}/{images.length}
                </Text>
              </View>
            )}
          </View>
        ) : (
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Text style={{ color: '#fff', fontSize: rf(16) }}>No Image</Text>
          </View>
        )}
      </View>
    );
  }

  return (
    <View 
      style={{ 
        width: responsiveDimensions.feedCard.width, 
        height: responsiveDimensions.feedCard.height, // Keep normal height
        backgroundColor: themeColors.background 
      }}
    >
      {/* Main Photo Carousel */}
      {images && images.length > 0 ? (
        <ImmersiveImageCarousel 
          images={images} 
          onImageChange={setCurrentImageIndex}
          onSwipeLeftOnFirst={handleSwipeLeftOnFirst}
          onDoubleTap={handleLike}
          isLucid={isLucid}
          detailsTranslateX={detailsTranslateX}
          onGestureStart={handleGestureStart}
          onGestureEnd={handleGestureEnd}
          onLucidPress={handleLucidPress}
          onZoomToggle={handleZoomToggle}
        />
      ) : (
        <View style={{
          flex: 1,
          backgroundColor: themeColors.border,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Text style={{ color: themeColors.textSecondary }}>No Image</Text>
        </View>
      )}

      {/* Top Left Overlay - User Info - MOVED CLOSER TO LEFT EDGE */}
      <View style={{
        position: 'absolute',
        top: overlayTop + profileOffset,
        left: insets.left + rs(12),
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 1000
      }}>
        {/* Profile Pic */}
        <TouchableOpacity onPress={handleProfilePress} activeOpacity={0.5}>
          {authorProfileImage ? (
            <Image
              source={{ uri: authorProfileImage }}
              style={{
                width: responsiveDimensions.profilePicture.medium,
                height: responsiveDimensions.profilePicture.medium,
                borderRadius: responsiveDimensions.profilePicture.medium / 2,
                borderWidth: rs(2),
                borderColor: 'white',
                marginRight: rs(12)
              }}
            />
          ) : (
            <View style={{ 
              width: responsiveDimensions.profilePicture.medium, 
              height: responsiveDimensions.profilePicture.medium, 
              borderRadius: responsiveDimensions.profilePicture.medium / 2, 
              backgroundColor: 'rgba(255, 255, 255, 0.9)', 
              alignItems: 'center', 
              justifyContent: 'center',
              marginRight: rs(12)
            }}>
              <Text style={{ color: '#000', fontSize: typography.userName, fontWeight: '600', fontFamily: 'System' }}>
                {authorName.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Name, Flag and Location */}
        <View>
          <TouchableOpacity onPress={handleProfilePress} activeOpacity={0.5}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{
                color: 'white',
                fontSize: typography.userName,
                fontWeight: '600',
                fontFamily: 'System',
                textShadowColor: 'rgba(0,0,0,0.7)',
                textShadowOffset: { width: 0, height: rs(1) },
                textShadowRadius: rs(3)
              }}>
                {authorName} {authorNationalityFlag || ''}
              </Text>
              {isLucid && (
                <Text style={{
                  fontSize: typography.caption,
                  fontWeight: '600',
                  fontFamily: 'System',
                  color: '#3B82F6',
                  marginLeft: rs(8),
                  textShadowColor: 'rgba(0,0,0,0.8)',
                  textShadowOffset: { width: 0, height: rs(1) },
                  textShadowRadius: rs(3)
                }}>
                  • LUCID
                </Text>
              )}
            </View>
          </TouchableOpacity>
          {/* Location Pill with Activity Color - CENTRALIZED Navigation */}
          <View style={{ marginTop: rs(4), flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              onPress={handleLocationPress}
              activeOpacity={0.8}
              hitSlop={{ top: rs(12), bottom: rs(12), left: rs(12), right: rs(12) }}
              style={{ 
                paddingHorizontal: rs(8), 
                paddingVertical: rs(3), 
                borderRadius: rs(12), 
                backgroundColor: isLucid ? 'rgba(255, 255, 255, 0.2)' : (postData.activityColor || 'rgba(255, 255, 255, 0.2)'),
                borderWidth: isLucid ? rs(1) : (postData.activityColor ? 0 : rs(1)),
                borderColor: isLucid ? 'rgba(255, 255, 255, 0.5)' : (postData.activityColor ? 'transparent' : 'rgba(255, 255, 255, 0.5)'),
                flexDirection: 'row',
                alignItems: 'center',
                alignSelf: 'flex-start',
                // ULTRA RESPONSIVE: Add minimum touch area
                minWidth: rs(60),
                minHeight: rs(24)
              }}
            >
              <Text style={{ fontSize: typography.caption, color: 'white' }}>📍</Text>
              <Text 
                style={{ 
                  fontSize: typography.location, 
                  fontWeight: '500',
                  fontFamily: 'System',
                  color: 'white',
                  marginLeft: rs(4),
                  textShadowColor: isLucid ? 'rgba(0,0,0,0.7)' : (postData.activityColor ? 'none' : 'rgba(0,0,0,0.7)'),
                  textShadowOffset: isLucid ? { width: 0, height: rs(1) } : (postData.activityColor ? { width: 0, height: 0 } : { width: 0, height: rs(1) }),
                  textShadowRadius: isLucid ? rs(3) : (postData.activityColor ? 0 : rs(3))
                }}
              >
                {postData.location}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Top Right Area - Image Counter and Lucid Button */}
      <View style={{
        position: 'absolute',
        top: overlayTop + indicatorOffset,
        right: rs(8),
        alignItems: 'flex-end',
        zIndex: 1000
      }}>
        {/* Lucid Album Button - Top positioned for Lucids */}
        {isLucid && (
          <TouchableOpacity
            onPress={onLucidPress}
            style={{
              alignItems: 'center',
              marginBottom: rs(8)
            }}
            hitSlop={{ top: rs(10), bottom: rs(10), left: rs(10), right: rs(10) }}
            activeOpacity={0.7}
          >
            <View style={{
              width: responsiveDimensions.button.medium.width,
              height: responsiveDimensions.button.medium.height,
              borderRadius: responsiveDimensions.button.medium.width / 2,
              backgroundColor: '#0047AB',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Album size={ri(20)} color="white" strokeWidth={2} />
            </View>
          </TouchableOpacity>
        )}
        
        {/* Image Counter - Below Lucid button if present */}
        {images && images.length > 1 && !isLucid && (
          <View style={{
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            paddingHorizontal: rs(8),
            paddingVertical: rs(4),
            borderRadius: rs(12),
          }}>
            <Text style={{
              color: 'white',
              fontSize: typography.caption,
              fontWeight: '500',
              fontFamily: 'System',
              textShadowColor: 'rgba(0,0,0,0.7)',
              textShadowOffset: { width: 0, height: rs(1) },
              textShadowRadius: rs(3)
            }}>
              {currentImageIndex + 1}/{images.length}
            </Text>
          </View>
        )}
      </View>

      {/* Bottom Right Action Buttons - Stacked vertically with better positioning */}
      <View style={{
        position: 'absolute',
        bottom: rs(45),
        right: rs(15),
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start'
      }}>
        {/* Like Button */}
        <TouchableOpacity
          onPress={handleLike}
          style={[
            iconShadow,
            { alignItems: 'center', marginTop: rs(16), marginLeft: rs(3) }
          ]}
          hitSlop={{ top: rs(10), bottom: rs(10), left: rs(10), right: rs(10) }}
          activeOpacity={0.3}
          delayPressIn={0}
          delayPressOut={0}
        >
          <Animated.View style={[
            iconShadow,
            { alignItems: 'center', transform: [{ scale: likeButtonScale }] }
          ]}>
            <Heart
              size={ri(26)}
              color={isLiked ? '#ff3040' : 'white'}
              fill={isLiked ? '#ff3040' : 'none'}
            />
            <Text style={{
              color: 'white',
              fontSize: typography.counter,
              fontWeight: '600',
              fontFamily: 'System',
              marginTop: rs(4),
              textShadowColor: 'rgba(0,0,0,0.7)',
              textShadowOffset: { width: 0, height: rs(1) },
              textShadowRadius: rs(3)
            }}>
              {likeCount}
            </Text>
          </Animated.View>
        </TouchableOpacity>

        {/* Details Button */}
        <TouchableOpacity
          onPress={handleCommentsPress}
          style={[
            iconShadow,
            {
              alignItems: 'center',
              marginTop: rs(35),
              shadowOpacity: 0.3,
              shadowRadius: 6,
              elevation: 6,
              shadowOffset: { width: 0, height: 3 }
            }
          ]}
          hitSlop={{ top: rs(10), bottom: rs(10), left: rs(10), right: rs(10) }}
          activeOpacity={0.3}
          delayPressIn={0}
          delayPressOut={0}
        >
          <ArrowRightCircle size={ri(26)} color="white" strokeWidth={2} />
        </TouchableOpacity>

        {/* Zoom Toggle Button */}
        <TouchableOpacity
          onPress={zoomToggleFn || (() => {})}
          style={[
            iconShadow,
            {
              alignItems: 'center',
              marginTop: rs(40),
              marginRight: rs(1),
              shadowOpacity: 0.6,
              shadowRadius: 10,
              elevation: 12,
              shadowOffset: { width: 0, height: 5 }
            }
          ]}
          hitSlop={{ top: rs(10), bottom: rs(10), left: rs(10), right: rs(10) }}
          activeOpacity={0.7}
        >
          {isZoomedOut ? (
            <Maximize size={ri(26)} color="white" strokeWidth={2} />
          ) : (
            <Minimize size={ri(26)} color="white" strokeWidth={2} />
          )}
        </TouchableOpacity>
      </View>

      {/* Details Page */}
      <DetailPostView
        visible={showDetails}
        onClose={handleCloseDetails}
        post={postData}
        detailsTranslateX={detailsTranslateX}
        isLiked={isLiked}
        setIsLiked={setIsLiked}
        isSaved={isSaved}
        setSaved={setIsSaved}
        commentCount={commentCount}
        setCommentCount={setCommentCount}
        likeCount={likeCount}
        setLikeCount={setLikeCount}
        shareCount={shareCount}
        savedCount={savedCount}
        onShare={handleShare}
        onSave={handleSave}
        onLike={handleLike}
        navigation={finalNavigation as any} // Cast to any to handle type complexity
      />

      {/* Fullscreen Image Modal - Triggered by rotation */}
      <Modal
        visible={showFullscreenImage}
        animationType="fade"
        presentationStyle="fullScreen"
        statusBarTranslucent={true}
        onRequestClose={() => setShowFullscreenImage(false)}
      >
        <View style={{ 
          flex: 1, 
          backgroundColor: '#000',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <StatusBar hidden={true} />
          {images && images[currentImageIndex] && (
            <Image
              source={{ uri: images[currentImageIndex] }}
              style={{
                width: '100%',
                height: '100%',
              }}
              resizeMode="contain"
            />
          )}
          {/* Close button - only visible on tap */}
          <TouchableOpacity
            onPress={() => setShowFullscreenImage(false)}
            style={{
              position: 'absolute',
              top: 50,
              right: 20,
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              justifyContent: 'center',
              alignItems: 'center',
              opacity: 0.7
            }}
            activeOpacity={0.8}
          >
            <X size={24} color="white" strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}, (prevProps, nextProps) => {
  // PERFORMANCE OPTIMIZATION: Custom comparison to prevent unnecessary re-renders
  return (
    prevProps.id === nextProps.id &&
    prevProps.isVisible === nextProps.isVisible &&
    prevProps.likes === nextProps.likes &&
    prevProps.comments === nextProps.comments
  );
});

TravelFeedCard.displayName = 'TravelFeedCard';

export default TravelFeedCard;
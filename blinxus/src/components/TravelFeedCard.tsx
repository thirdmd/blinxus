import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions, StatusBar, ScrollView, Alert, Modal, TextInput, Animated, ImageBackground } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import ReanimatedAnimated, { useSharedValue, useAnimatedStyle, useAnimatedGestureHandler, runOnJS, withSpring, withTiming } from 'react-native-reanimated';
import { PostCardProps } from '../types/structures/posts_structure';
import { Heart, MessageCircle, Send, Bookmark, MoreVertical, MapPinned, Edit, Trash2, Flag, X, Check, Camera, Info, Images, MoreHorizontal, Album, Menu, ChevronRight, Maximize2, Square, Layout, FileText, AlignJustify, Maximize, Minimize } from 'lucide-react-native';
import { usePosts } from '../store/PostsContext';
import { useSavedPosts } from '../store/SavedPostsContext';
import { useLikedPosts } from '../store/LikedPostsContext';
import { useThemeColors } from '../hooks/useThemeColors';
import { useNavigation } from '@react-navigation/native';
import { activityTags, ActivityKey, type ActivityTag, activityColors, activityNames } from '../constants/activityTags';
import PillTag from './PillTag';
import DetailPostView from './DetailPostView';
import { getResponsiveDimensions, getTypographyScale, getSpacingScale, ri, rs, rf, RESPONSIVE_SCREEN } from '../utils/responsive';
import { useOrientation, Orientation } from '../hooks/useOrientation';

interface TravelFeedCardProps extends PostCardProps {
  onDetailsPress: () => void;
  onReset?: () => void;
  isVisible?: boolean;
  onLucidPress?: () => void;
}

const { width: screenWidth, height: screenHeight } = RESPONSIVE_SCREEN;
const responsiveDimensions = getResponsiveDimensions();
const typography = getTypographyScale();
const spacing = getSpacingScale();

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
                {/* ULTRA SENSITIVE: Full-area touchable overlay for instant gesture handling */}
                <TouchableOpacity
                  onPress={handleImagePress}
                  activeOpacity={1} // INSTANT: No opacity change
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
                  delayLongPress={600} // INSTANT: Faster long press detection
                  hitSlop={{ top: 0, bottom: 0, left: 0, right: 0 }} // INSTANT: No extra hit area needed
                />
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
      
              {/* Image counter - Only show for regular posts, not for Lucids */}
        {images.length > 1 && !isLucid && (
          <View style={{
            position: 'absolute',
            top: rs(20),
            right: rs(16),
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            paddingHorizontal: rs(8),
            paddingVertical: rs(4),
            borderRadius: rs(12)
          }}>
            <Text style={{
              color: 'white',
              fontSize: typography.caption,
              fontWeight: '500',
              fontFamily: 'System'
            }}>
              {currentIndex + 1}/{images.length}
            </Text>
          </View>
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
  onLucidPress
}) => {
  const { deletePost, editPost, likePost, unlikePost, addComment } = usePosts();
  const { savePost, unsavePost, isPostSaved } = useSavedPosts();
  const { likePost: userLikePost, unlikePost: userUnlikePost, isPostLiked } = useLikedPosts();
  const navigation = useNavigation();
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
      // Get the current activity color from activityColors based on the activity key
      let currentActivityColor = activityColor; // fallback to original
      let currentActivityName = activityName; // fallback to original
      
      if (currentPost.activity) {
        currentActivityColor = activityColors[currentPost.activity];
        currentActivityName = activityNames[currentPost.activity];
      }
      
      return {
        ...currentPost,
        likes: likeCount, // Use current like count for UI consistency
        comments: commentCount, // Use current comment count for UI consistency
        activityColor: currentActivityColor, // Use updated activity color
        activityName: currentActivityName, // Use updated activity name
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

  // MEMORY OPTIMIZATION: Memoize all handlers to prevent recreation
  const handleProfilePress = useCallback(() => {
    if (authorName === 'Third Camacho') {
      // Navigate to current user's profile with fullscreen context
      (navigation as any).navigate('Profile', { 
        fromFeed: true,
        previousScreen: 'TravelFeedCard',
        fullscreenContext: {
          postData: postData,
          isFromGrid: true // Indicates this came from grid view fullscreen
        }
      });
    } else {
      // Navigate to other user's profile (future implementation)
      // For now, could navigate to a generic UserProfile screen
      // (navigation as any).navigate('UserProfile', { 
      //   userId: authorId,
      //   fromFeed: true,
      //   previousScreen: 'TravelFeedCard',
      //   fullscreenContext: {
      //     postData: postData,
      //     isFromGrid: true
      //   }
      // });
    }
  }, [authorName, navigation, postData]);

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
        (navigation as any).navigate('LucidFullscreen', {
          post: postData
        });
      }
    }
  }, [isLucid, onLucidPress, navigation, postData]);

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
                      resizeMode: 'contain' // Show full image without cropping
                    }}
                  />
                </View>
              ))}
            </ScrollView>
            
            {/* Image counter for landscape mode */}
            {images.length > 1 && (
              <View style={{
                position: 'absolute',
                top: rs(60), // Account for status bar in landscape
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
        height: responsiveDimensions.feedCard.height,
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

      {/* Top Left Overlay - User Info */}
      <View style={{
        position: 'absolute',
        top: rs(20),
        left: rs(16),
        flexDirection: 'row',
        alignItems: 'center'
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
            <Text style={{
              color: 'white',
              fontSize: typography.userName,
              fontWeight: '600',
              fontFamily: 'System',
              textShadowColor: 'rgba(0,0,0,0.7)',
              textShadowOffset: { width: 0, height: rs(1) },
              textShadowRadius: rs(3)
            }}>
              {authorName} {authorNationalityFlag}
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
                  {' '}• LUCID
                </Text>
              )}
            </Text>
          </TouchableOpacity>
          {/* Location Pill with Activity Color */}
          <View style={{ marginTop: rs(4), flexDirection: 'row', alignItems: 'center' }}>
            <View 
              style={{ 
                paddingHorizontal: rs(8), 
                paddingVertical: rs(3), 
                borderRadius: rs(12), 
                backgroundColor: isLucid ? 'rgba(255, 255, 255, 0.2)' : (postData.activityColor || 'rgba(255, 255, 255, 0.2)'),
                borderWidth: isLucid ? rs(1) : (postData.activityColor ? 0 : rs(1)),
                borderColor: isLucid ? 'rgba(255, 255, 255, 0.5)' : (postData.activityColor ? 'transparent' : 'rgba(255, 255, 255, 0.5)'),
                flexDirection: 'row',
                alignItems: 'center',
                alignSelf: 'flex-start'
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
            </View>
          </View>
        </View>
      </View>

      {/* Bottom Right Action Buttons - Stacked vertically with better positioning */}
      <View style={{
        position: 'absolute',
        bottom: rs(40),
        right: rs(20),
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: isLucid ? rs(300) : rs(260)
      }}>
        {/* Lucid Album Indicator - Only show for Lucids */}
        {isLucid && (
          <TouchableOpacity
            onPress={handleLucidPress}
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
        
        {/* Zoom Toggle Button - Above heart react */}
        <TouchableOpacity
          onPress={zoomToggleFn || (() => {})}
          style={{
            alignItems: 'center',
            marginBottom: rs(8)
          }}
          hitSlop={{ top: rs(10), bottom: rs(10), left: rs(10), right: rs(10) }}
          activeOpacity={0.7}
        >
          {isZoomedOut ? (
            <Maximize size={ri(26)} color="white" strokeWidth={2} />
          ) : (
            <Minimize size={ri(26)} color="white" strokeWidth={2} />
          )}
        </TouchableOpacity>
        
        {/* Like Button - Moved higher */}
        <TouchableOpacity
          onPress={handleLike}
          style={{
            alignItems: 'center'
          }}
          hitSlop={{ top: rs(10), bottom: rs(10), left: rs(10), right: rs(10) }}
          activeOpacity={0.3}
          delayPressIn={0}
          delayPressOut={0}
        >
          <Animated.View style={{ 
            alignItems: 'center',
            transform: [{ scale: likeButtonScale }]
          }}>
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

        {/* Details Button (changed from Comment) */}
        <TouchableOpacity
          onPress={handleCommentsPress}
          style={{
            alignItems: 'center'
          }}
          hitSlop={{ top: rs(10), bottom: rs(10), left: rs(10), right: rs(10) }}
          activeOpacity={0.3}
          delayPressIn={0}
          delayPressOut={0}
        >
          <Square size={ri(26)} color="white" strokeWidth={2} strokeDasharray="4 4" />
        </TouchableOpacity>

        {/* Share Button */}
        <TouchableOpacity
          onPress={handleShare}
          style={{
            alignItems: 'center'
          }}
          hitSlop={{ top: rs(10), bottom: rs(10), left: rs(10), right: rs(10) }}
          activeOpacity={0.3}
          delayPressIn={0}
          delayPressOut={0}
        >
          <Send size={ri(26)} color="white" />
        </TouchableOpacity>

        {/* Save Button - Moved lower */}
        <TouchableOpacity
          onPress={handleSave}
          style={{
            alignItems: 'center'
          }}
          hitSlop={{ top: rs(10), bottom: rs(10), left: rs(10), right: rs(10) }}
          activeOpacity={0.3}
          delayPressIn={0}
          delayPressOut={0}
        >
          <Animated.View style={{ 
            alignItems: 'center',
            transform: [{ scale: saveButtonScale }]
          }}>
            <Bookmark
              size={ri(26)}
              color={isSaved ? '#FFD700' : 'white'}
              fill={isSaved ? '#FFD700' : 'none'}
            />
          </Animated.View>
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
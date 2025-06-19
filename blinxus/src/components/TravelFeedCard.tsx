import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions, StatusBar, ScrollView, Alert, Modal, TextInput, Animated } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import ReanimatedAnimated, { useSharedValue, useAnimatedStyle, useAnimatedGestureHandler, runOnJS, withSpring } from 'react-native-reanimated';
import { PostCardProps } from '../types/structures/posts_structure';
import { Heart, MessageCircle, Send, Bookmark, MoreVertical, MapPin, Edit, Trash2, Flag, X, Check, Camera, Info, Images, MoreHorizontal, Album, Menu, ChevronRight, Maximize2, Square, Layout, FileText, AlignJustify } from 'lucide-react-native';
import { usePosts } from '../store/PostsContext';
import { useSavedPosts } from '../store/SavedPostsContext';
import { useLikedPosts } from '../store/LikedPostsContext';
import { useThemeColors } from '../hooks/useThemeColors';
import { useNavigation } from '@react-navigation/native';
import { activityTags, ActivityKey, type ActivityTag, activityColors, activityNames } from '../constants/activityTags';
import PillTag from './PillTag';
import DetailPostView from './DetailPostView';

interface TravelFeedCardProps extends PostCardProps {
  onDetailsPress: () => void;
  onReset?: () => void;
  isVisible?: boolean;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

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
}> = React.memo(({ images, onImageChange, onSwipeLeftOnFirst, onDoubleTap, isLucid = false, detailsTranslateX, onGestureStart, onGestureEnd, onLucidPress }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastTap, setLastTap] = useState(0);
  const [showHeart, setShowHeart] = useState(false);
  const heartScale = useRef(new Animated.Value(0)).current;
  
  // CLEANUP: Reset state when component unmounts or images change
  useEffect(() => {
    return () => {
      // Clean up animation
      heartScale.setValue(0);
      setShowHeart(false);
      setCurrentIndex(0);
      setLastTap(0);
    };
  }, [heartScale]);

  // SUPER SENSITIVE: Gesture handling for details page - maximum responsiveness
  const gestureHandler = useAnimatedGestureHandler({
    onStart: () => {
      if (onGestureStart) {
        runOnJS(onGestureStart)();
      }
    },
    onActive: (event) => {
      // INSTANT GESTURES: Work during transitions with balanced detection
      const isHorizontalSwipe = Math.abs(event.translationX) > Math.abs(event.translationY) * 1.2; // Balanced for instant response
      const isRightSwipe = event.translationX > 0;
      
      // INSTANT RESPONSE: Lower threshold for immediate activation during transitions
      if (isRightSwipe && Math.abs(event.translationX) > 20 && isHorizontalSwipe) {
        const canSwipeToDetails = isLucid || currentIndex === 0;
        if (canSwipeToDetails && onGestureStart) {
          runOnJS(onGestureStart)();
        }
      }
      
      // DETAILS VIEW LOGIC: Work immediately during transitions
      const canSwipeToDetails = isLucid ? isRightSwipe : (currentIndex === 0 && isRightSwipe);
      
      if (canSwipeToDetails && isHorizontalSwipe && detailsTranslateX && Math.abs(event.translationX) > 15) {
        // INSTANT FEEDBACK: Visual response during transitions
        const progress = Math.max(0, event.translationX / screenWidth);
        detailsTranslateX.value = -screenWidth + (progress * screenWidth);
      }
    },
    onEnd: (event) => {
      // SCROLL FIX: Conservative end detection
      const isHorizontalSwipe = Math.abs(event.translationX) > Math.abs(event.translationY) * 1.5;
      const isRightSwipe = event.translationX > 0;
      
      // Reasonable threshold that doesn't interfere with scrolling
      const shouldOpen = isHorizontalSwipe && isRightSwipe && Math.abs(event.translationX) > screenWidth * 0.15;
      
      // Apply conditions only after determining if gesture should trigger
      const finalShouldOpen = shouldOpen && (isLucid || currentIndex === 0);
      
      if (onGestureEnd) {
        runOnJS(onGestureEnd)(finalShouldOpen);
      }
    }
  });

  // MEMORY OPTIMIZATION: Memoize scroll handlers
  const handleScroll = useCallback((event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / screenWidth);
    
    // INSTANT DETECTION: Check for left swipe during scroll for immediate response
    if (scrollPosition < -25 && currentIndex === 0) {
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
    if (scrollPosition < -15 && currentIndex === 0) {
      onSwipeLeftOnFirst?.();
    }
  }, [currentIndex, onSwipeLeftOnFirst]);

  const handleMomentumScrollBegin = useCallback((event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    // Even more sensitive detection during momentum start
    if (scrollPosition < -10 && currentIndex === 0) {
      onSwipeLeftOnFirst?.();
    }
  }, [currentIndex, onSwipeLeftOnFirst]);

  const handleImagePress = useCallback(() => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300; // Slightly increased for better detection
    
    if (lastTap && now - lastTap < DOUBLE_PRESS_DELAY) {
      // Double tap detected - INSTANT RESPONSE
      if (onDoubleTap) {
        // Prevent the single tap action from firing
        setLastTap(0);
        
        onDoubleTap();
        
        // CLEANUP: Stop any existing animation before starting new one
        heartScale.stopAnimation();
        
        // FASTER ANIMATION: Reduced duration for instant feedback
        setShowHeart(true);
        Animated.sequence([
          Animated.timing(heartScale, {
            toValue: 1.2,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(heartScale, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start((finished) => {
          if (finished) {
            setShowHeart(false);
            heartScale.setValue(0);
          }
        });
      }
    } else {
      // Single tap - INSTANT RESPONSE for Lucids
      if (isLucid && onLucidPress) {
        onLucidPress();
      }
      setLastTap(now);
    }
  }, [lastTap, onDoubleTap, isLucid, onLucidPress, heartScale]);

  if (!images || images.length === 0) return null;

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <PanGestureHandler 
        onGestureEvent={gestureHandler} 
        enabled={true}
        // INSTANT GESTURES: Work during scroll transitions
        activeOffsetX={[-15, 15]} // Balanced for instant response during transitions
        failOffsetY={[-8, 8]} // Allow vertical scrolling to pass through
        simultaneousHandlers={[]} // Allow simultaneous with parent scroll
        shouldCancelWhenOutside={false}
        minPointers={1}
        maxPointers={1}
        avgTouches={false}
        // CONCURRENT GESTURES: Work during transitions
        waitFor={[]} // Don't wait for other gestures to fail
      >
        <ReanimatedAnimated.View style={{ flex: 1 }}>
          <ScrollView
            horizontal
            pagingEnabled={!isLucid} // Disable paging for Lucids
            showsHorizontalScrollIndicator={false}
            onScroll={!isLucid ? handleScroll : undefined}
            onScrollEndDrag={!isLucid ? handleScrollEnd : undefined}
            onMomentumScrollBegin={!isLucid ? handleMomentumScrollBegin : undefined}
            scrollEventThrottle={8} // SUPER RESPONSIVE: Reduced for instant detection
            style={{ flex: 1 }}
            bounces={true} // CHANGED: Enable bounces for left swipe detection
            scrollEnabled={!isLucid} // Disable scrolling for Lucids
            // PERFORMANCE OPTIMIZATIONS
            removeClippedSubviews={true}
            contentInsetAdjustmentBehavior="never"
            // INSTANT RESPONSE OPTIMIZATIONS
            decelerationRate="fast"
            directionalLockEnabled={true}
          >
        {images.map((image, index) => (
          <View
            key={index}
            style={{
              width: screenWidth,
              height: '100%',
              position: 'relative'
            }}
          >
            <Image
              source={{ uri: image }}
              style={{
                width: screenWidth,
                height: '100%',
                resizeMode: 'cover'
              }}
            />
            {/* SUPER SENSITIVE: Full-area touchable overlay for instant gesture handling */}
            <TouchableOpacity
              onPress={handleImagePress}
              activeOpacity={0.95} // Slight feedback for instant response
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'transparent'
              }}
              // ULTRA RESPONSIVE: Zero delay for instant touch response
              delayPressIn={0}
              delayPressOut={0}
              delayLongPress={800} // Longer delay to prevent accidental triggers
              hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }} // Larger hit area
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
          top: 20,
          right: 16,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 12
        }}>
          <Text style={{
            color: 'white',
            fontSize: 12,
            fontWeight: '500'
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
  isVisible
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


  // Check if this is a Lucid post
  const isLucid = type === 'lucid';

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

  // INSTANT GESTURES: Remove visibility dependency to allow gestures during transitions
  // useEffect(() => {
  //   if (isVisible === false && showDetails) {
  //     // Card is no longer visible and details are open - close them
  //     detailsTranslateX.value = -screenWidth;
  //     setShowDetails(false);
  //   }
  // }, [isVisible, showDetails, detailsTranslateX]);

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
      navigation.navigate('Profile' as never);
    } else {
      console.log(`Navigating to ${authorName}'s profile`);
    }
  }, [authorName, navigation]);

  // Add ref for debouncing likes
  const lastLikeTime = useRef(0);

  const handleLike = useCallback(() => {
    // Prevent multiple rapid likes by adding a small debounce check
    const now = Date.now();
    if (now - lastLikeTime.current < 300) {
      return; // Ignore rapid successive calls
    }
    lastLikeTime.current = now;

    if (isLiked) {
      // Unlike the post - update both contexts
      unlikePost(id); // Update like count in PostsContext
      userUnlikePost(id); // Remove from user's liked posts
      setIsLiked(false);
      setLikeCount(prev => Math.max(0, prev - 1)); // Ensure count doesn't go negative
    } else {
      // Like the post - update both contexts
      likePost(id); // Update like count in PostsContext
      userLikePost(id); // Add to user's liked posts
      setIsLiked(true);
      setLikeCount(prev => prev + 1);
    }
  }, [isLiked, id, unlikePost, likePost, userLikePost, userUnlikePost]);

  const handleGestureStart = useCallback(() => {
    setShowDetails(true);
  }, []);

  const handleGestureEnd = useCallback((shouldOpen: boolean) => {
    if (shouldOpen) {
      detailsTranslateX.value = withSpring(0, {
        damping: 30,  // ULTRA FAST: Even faster spring response
        stiffness: 450,
        mass: 0.8
      });
    } else {
      detailsTranslateX.value = withSpring(-screenWidth, {
        damping: 30,
        stiffness: 450,
        mass: 0.8
      });
      setShowDetails(false);
    }
  }, [detailsTranslateX]);

  const handleShowDetails = useCallback(() => {
    setShowDetails(true);
    detailsTranslateX.value = withSpring(0, {
      damping: 30,  // ULTRA FAST: Even faster spring response
      stiffness: 450,
      mass: 0.8
    });
  }, [detailsTranslateX]);

  const handleCloseDetails = useCallback(() => {
    detailsTranslateX.value = withSpring(-screenWidth, {
      damping: 30,
      stiffness: 450,
      mass: 0.8
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
            console.log('Sharing post:', id);
          }
        }
      ]
    );
  }, [id]);

  const handleSave = useCallback(() => {
    if (isSaved) {
      unsavePost(id);
      setIsSaved(false);
      setSavedCount(prev => Math.max(0, prev - 1));
    } else {
      savePost(id);
      setIsSaved(true);
      setSavedCount(prev => prev + 1);
    }
  }, [isSaved, id, unsavePost, savePost]);

  const handleSwipeLeftOnFirst = useCallback(() => {
    handleShowDetails();
  }, [handleShowDetails]);

  const handleLucidPress = useCallback(() => {
    if (isLucid) {
      (navigation as any).navigate('LucidFullscreen', {
        post: postData
      });
    }
  }, [isLucid, navigation, postData]);



  return (
    <View 
      style={{ 
        width: screenWidth, 
        height: screenHeight - 180,
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
        top: 20,
        left: 16,
        flexDirection: 'row',
        alignItems: 'center'
      }}>
        {/* Profile Pic */}
        <TouchableOpacity onPress={handleProfilePress} activeOpacity={0.7}>
          {authorProfileImage ? (
            <Image
              source={{ uri: authorProfileImage }}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                borderWidth: 2,
                borderColor: 'white',
                marginRight: 12
              }}
            />
          ) : (
            <View style={{ 
              width: 40, 
              height: 40, 
              borderRadius: 20, 
              backgroundColor: 'rgba(255, 255, 255, 0.9)', 
              alignItems: 'center', 
              justifyContent: 'center',
              marginRight: 12
            }}>
              <Text style={{ color: '#000', fontSize: 16, fontWeight: '600' }}>
                {authorName.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Name, Flag and Location */}
        <View>
          <TouchableOpacity onPress={handleProfilePress} activeOpacity={0.7}>
            <Text style={{
              color: 'white',
              fontSize: 16,
              fontWeight: '600',
              textShadowColor: 'rgba(0,0,0,0.7)',
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 3
            }}>
              {authorName} {authorNationalityFlag}
              {isLucid && (
                <Text style={{
                  fontSize: 12,
                  fontWeight: '600',
                  color: '#3B82F6',
                  marginLeft: 8,
                  textShadowColor: 'rgba(0,0,0,0.8)',
                  textShadowOffset: { width: 0, height: 1 },
                  textShadowRadius: 3
                }}>
                  {' '}• LUCID
                </Text>
              )}
            </Text>
          </TouchableOpacity>
          {/* Location Pill with Activity Color */}
          <View style={{ marginTop: 4, flexDirection: 'row', alignItems: 'center' }}>
            <View 
              style={{ 
                paddingHorizontal: 8, 
                paddingVertical: 3, 
                borderRadius: 12, 
                backgroundColor: isLucid ? 'rgba(255, 255, 255, 0.2)' : (postData.activityColor || 'rgba(255, 255, 255, 0.2)'),
                borderWidth: isLucid ? 1 : (postData.activityColor ? 0 : 1),
                borderColor: isLucid ? 'rgba(255, 255, 255, 0.5)' : (postData.activityColor ? 'transparent' : 'rgba(255, 255, 255, 0.5)'),
                flexDirection: 'row',
                alignItems: 'center',
                alignSelf: 'flex-start'
              }}
            >
              <MapPin 
                size={12} 
                color="white" 
              />
              <Text 
                style={{ 
                  fontSize: 13, 
                  fontWeight: '500',
                  color: 'white',
                  marginLeft: 4,
                  textShadowColor: isLucid ? 'rgba(0,0,0,0.7)' : (postData.activityColor ? 'none' : 'rgba(0,0,0,0.7)'),
                  textShadowOffset: isLucid ? { width: 0, height: 1 } : (postData.activityColor ? { width: 0, height: 0 } : { width: 0, height: 1 }),
                  textShadowRadius: isLucid ? 3 : (postData.activityColor ? 0 : 3)
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
        bottom: 40,
        right: 20,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: isLucid ? 260 : 220
      }}>
        {/* Lucid Album Indicator - Only show for Lucids */}
        {isLucid && (
          <TouchableOpacity
            onPress={handleLucidPress}
            style={{
              alignItems: 'center',
              marginBottom: 8
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.7}
          >
            <View style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: '#0047AB',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Album size={20} color="white" strokeWidth={2} />
            </View>
          </TouchableOpacity>
        )}
        
        {/* Like Button - Moved higher */}
        <TouchableOpacity
          onPress={handleLike}
          style={{
            alignItems: 'center'
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
        >
          <Heart
            size={26}
            color={isLiked ? '#ff3040' : 'white'}
            fill={isLiked ? '#ff3040' : 'none'}
          />
          <Text style={{
            color: 'white',
            fontSize: 12,
            fontWeight: '600',
            marginTop: 4,
            textShadowColor: 'rgba(0,0,0,0.7)',
            textShadowOffset: { width: 0, height: 1 },
            textShadowRadius: 3
          }}>
            {likeCount}
          </Text>
        </TouchableOpacity>

        {/* Details Button (changed from Comment) */}
        <TouchableOpacity
          onPress={handleCommentsPress}
          style={{
            alignItems: 'center'
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
        >
          <AlignJustify size={26} color="white" strokeWidth={2} />
        </TouchableOpacity>

        {/* Share Button */}
        <TouchableOpacity
          onPress={handleShare}
          style={{
            alignItems: 'center'
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
        >
          <Send size={26} color="white" />
        </TouchableOpacity>

        {/* Save Button - Moved lower */}
        <TouchableOpacity
          onPress={handleSave}
          style={{
            alignItems: 'center'
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
        >
          <Bookmark
            size={26}
            color={isSaved ? '#FFD700' : 'white'}
            fill={isSaved ? '#FFD700' : 'none'}
          />
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
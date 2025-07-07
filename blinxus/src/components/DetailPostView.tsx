import React, { useState, useRef, useEffect, useMemo } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions, StatusBar, ScrollView, Alert, Modal, TextInput, Animated } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import ReanimatedAnimated, { useSharedValue, useAnimatedStyle, useAnimatedGestureHandler, runOnJS, withSpring } from 'react-native-reanimated';
import { PostCardProps } from '../types/structures/posts_structure';
import { Heart, MessageCircle, Send, Bookmark, MoreVertical, MapPinned, Edit, Trash2, Flag, X, Check, Camera, Info, Images, MoreHorizontal, Album, Menu, ChevronRight, Maximize2, Square, Layout, FileText, AlignJustify, Plus, Minus } from 'lucide-react-native';
import { usePosts } from '../store/PostsContext';
import { useSavedPosts } from '../store/SavedPostsContext';
import { useLikedPosts } from '../store/LikedPostsContext';

import { useNavigation, NavigationProp, ParamListBase } from '@react-navigation/native';
import { activityTags, ActivityKey, type ActivityTag, activityColors } from '../constants/activityTags';
import PillTag from './PillTag';
import UserProfileNavigation from '../utils/userProfileNavigation';
import { LocationNavigation } from '../utils/locationNavigation';
import { getImmersiveScreenDimensions } from '../utils/responsive';

interface DetailPostViewProps {
  visible: boolean;
  onClose: () => void;
  post: PostCardProps;
  detailsTranslateX: any;
  isLiked: boolean;
  setIsLiked: (liked: boolean) => void;
  isSaved: boolean;
  setSaved: (saved: boolean) => void;
  commentCount: number;
  setCommentCount: (count: number) => void;
  likeCount: number;
  setLikeCount: (count: number) => void;
  shareCount: number;
  savedCount: number;
  onShare: () => void;
  onSave: () => void;
  onLike: () => void;
  navigation?: NavigationProp<ParamListBase>; // Optional navigation prop
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const DetailPostView: React.FC<DetailPostViewProps> = ({ 
  visible, 
  onClose, 
  post, 
  detailsTranslateX, 
  isLiked, 
  setIsLiked, 
  isSaved, 
  setSaved, 
  commentCount, 
  setCommentCount, 
  likeCount, 
  setLikeCount, 
  shareCount, 
  savedCount, 
  onShare,
  onSave,
  onLike,
  navigation
}) => {
  // Fixed dark mode colors
  const darkColors = {
    background: '#1a1a1a',
    backgroundSecondary: '#1a2332',
    text: '#ffffff',
    textSecondary: '#9ca3af',
    border: '#374151',
    cobalt: '#3B82F6'
  };
  const { deletePost, editPost, likePost, unlikePost, addComment } = usePosts();
  const { savePost, unsavePost } = useSavedPosts();
  const { likePost: userLikePost, unlikePost: userUnlikePost, isPostLiked } = useLikedPosts();
  
  // Use prop navigation if available, otherwise use hook with error handling
  let finalNavigation;
  if (navigation) {
    finalNavigation = navigation;
  } else {
    try {
      finalNavigation = useNavigation();
    } catch (error) {
      console.warn('Navigation hook failed in DetailPostView:', error);
      finalNavigation = null;
    }
  }
  
  const [openMenu, setOpenMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editActivity, setEditActivity] = useState<number | null>(null);
  const [originalContent, setOriginalContent] = useState('');
  const [originalLocation, setOriginalLocation] = useState('');
  const [originalActivity, setOriginalActivity] = useState<number | null>(null);
  const [commentText, setCommentText] = useState('');
  const [localComments, setLocalComments] = useState<{
    id: string;
    text: string;
    author: string;
    timestamp: string;
    isOwn: boolean;
  }[]>([]);
  const [openCommentMenu, setOpenCommentMenu] = useState<string | null>(null);
  const [showAllActivities, setShowAllActivities] = useState(false);

  // Get immersive dimensions for alignment with user name
  const immersiveDimensions = getImmersiveScreenDimensions();
  
  // Align DetailPostView header with user name position (same logic as TravelFeedCard)
  const getAlignedHeaderPosition = () => {
    return immersiveDimensions.topOverlayPosition + 25; // Same as user name positioning
  };

  // INSTANT SYNC: Get fresh post data from context to ensure immediate updates
  const { posts } = usePosts();
  const currentPost = useMemo(() => {
    return posts.find(p => p.id === post.id) || post;
  }, [posts, post]);

  // Check if current user is the author
  const isCurrentUserPost = currentPost.authorName === 'Third Camacho';

  // Check if location/activity can still be edited
  const canEditLocation = (currentPost.locationEditCount || 0) < 1;
  const canEditActivity = (currentPost.activityEditCount || 0) < 1;

  // Check if any changes have been made
  const hasChanges = 
    editContent !== originalContent || 
    editLocation !== originalLocation || 
    editActivity !== originalActivity;

  // Add animation refs for button feedback
  const likeButtonScale = useRef(new Animated.Value(1)).current;
  const saveButtonScale = useRef(new Animated.Value(1)).current;

  const handleProfilePress = () => {
    if (!finalNavigation) {
      console.warn('Navigation not available for profile press in DetailPostView');
      return;
    }
    
    try {
      // Navigate directly to profile
      const { handleTravelFeedProfile } = UserProfileNavigation.createHandlersForScreen(finalNavigation as any, 'PostDetail');
      handleTravelFeedProfile({
        authorId: currentPost.authorId,
        authorName: currentPost.authorName
      });
    } catch (error) {
      console.warn('Profile navigation failed in DetailPostView:', error);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this post?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            deletePost(currentPost.id);
            setOpenMenu(false);
            onClose();
          }
        }
      ]
    );
  };

  const handleEdit = () => {
    const currentContent = currentPost.content || '';
    const currentLocation = currentPost.location;
    
    setEditContent(currentContent);
    setEditLocation(currentLocation);
    setOriginalContent(currentContent);
    setOriginalLocation(currentLocation);
    
    if (currentPost.activity) {
      const currentActivityTag = activityTags.find(tag => {
        const activityKeyMap: { [key: string]: ActivityKey } = {
          'Aquatics': 'aquatics',
          'Outdoors': 'outdoors', 
          'City': 'city',
          'Food': 'food',
          'Stays': 'stays',
          'Heritage': 'heritage',
          'Wellness': 'wellness',
          'Amusements': 'amusements',
          'Cultural': 'cultural',
          'Special Experiences': 'special',
          'Thrill': 'thrill',
        };
        return activityKeyMap[tag.name] === currentPost.activity;
      });
      setEditActivity(currentActivityTag?.id || null);
      setOriginalActivity(currentActivityTag?.id || null);
    } else {
      setEditActivity(null);
      setOriginalActivity(null);
    }
    
    setShowEditModal(true);
    setOpenMenu(false);
  };

  const handleActivitySelect = (activityId: number) => {
    if (!canEditActivity) return;
    setEditActivity(activityId === editActivity ? null : activityId);
  };

  const handleSaveEdit = () => {
    if (editLocation.trim() === '') {
      Alert.alert('Error', 'Location cannot be empty.');
      return;
    }

    let activityKey: ActivityKey | undefined = undefined;
    if (editActivity) {
      const activityTag = activityTags.find(tag => tag.id === editActivity);
      if (activityTag) {
        const activityKeyMap: { [key: string]: ActivityKey } = {
          'Aquatics': 'aquatics',
          'Outdoors': 'outdoors', 
          'City': 'city',
          'Food': 'food',
          'Stays': 'stays',
          'Heritage': 'heritage',
          'Wellness': 'wellness',
          'Amusements': 'amusements',
          'Cultural': 'cultural',
          'Special Experiences': 'special',
          'Thrill': 'thrill',
        };
        activityKey = activityKeyMap[activityTag.name];
      }
    }

    editPost(currentPost.id, {
      content: editContent.trim() === '' ? undefined : editContent.trim(),
      location: editLocation.trim(),
      activity: activityKey
    });
    
    // Reset edit state to clear memory after successful save
    setEditContent('');
    setEditLocation('');
    setEditActivity(null);
    setOriginalContent('');
    setOriginalLocation('');
    setOriginalActivity(null);
    
    setShowEditModal(false);
  };

  const handleCancelEdit = () => {
    // Reset to empty state, not current post values
    setEditContent('');
    setEditLocation('');
    setEditActivity(null);
    setOriginalContent('');
    setOriginalLocation('');
    setOriginalActivity(null);
    setShowEditModal(false);
  };

  const handleReport = () => {
    Alert.alert(
      'Report Post',
      'This feature will be available soon.',
      [{ text: 'OK', onPress: () => setOpenMenu(false) }]
    );
  };

  const handleLike = () => {
    // INSTANT FEEDBACK: Trigger scale animation immediately
    Animated.sequence([
      Animated.timing(likeButtonScale, {
        toValue: 0.9,
        duration: 80, // INSTANT: Very fast scale down
        useNativeDriver: true,
      }),
      Animated.timing(likeButtonScale, {
        toValue: 1,
        duration: 120, // INSTANT: Quick bounce back
        useNativeDriver: true,
      }),
    ]).start();

    onLike();
  };

  const handleAddComment = () => {
    if (commentText.trim()) {
      const newComment = {
        id: Date.now().toString(),
        text: commentText.trim(),
        author: 'Third Camacho',
        timestamp: 'now',
        isOwn: true
      };
      
      setLocalComments([...localComments, newComment]);
      setCommentText('');
      setCommentCount(commentCount + 1);
      addComment(currentPost.id);
    }
  };

  const handleDeleteComment = (commentId: string) => {
    Alert.alert(
      'Delete Comment',
      'Are you sure you want to delete this comment?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setLocalComments(prevComments => 
              prevComments.filter(comment => comment.id !== commentId)
            );
            setCommentCount(commentCount - 1);
            setOpenCommentMenu(null);
          }
        }
      ]
    );
  };

  const handleReportComment = (commentId: string) => {
    Alert.alert(
      'Report Comment',
      'This comment will be reported for review.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Report',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement comment reporting
            setOpenCommentMenu(null);
          }
        }
      ]
    );
  };

  const handleSave = () => {
    // INSTANT FEEDBACK: Trigger scale animation immediately
    Animated.sequence([
      Animated.timing(saveButtonScale, {
        toValue: 0.9,
        duration: 80, // INSTANT: Very fast scale down
        useNativeDriver: true,
      }),
      Animated.timing(saveButtonScale, {
        toValue: 1,
        duration: 120, // INSTANT: Quick bounce back
        useNativeDriver: true,
      }),
    ]).start();

    onSave();
  };

  // SUPER SENSITIVE: Gesture handler for swipe left to close - maximum responsiveness
  const closeGestureHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      // ULTRA SENSITIVE: Instant response to any leftward movement
      if (event.translationX < 0) {
        // INSTANT TRIGGER: Start closing immediately on small movement
        if (Math.abs(event.translationX) > 8) { // Super low threshold
          runOnJS(onClose)(); // Trigger close immediately
          return;
        }
        // Direct calculation for ultra-smooth animation
        const progress = Math.abs(event.translationX) / screenWidth;
        detailsTranslateX.value = -(progress * screenWidth);
      }
    },
    onEnd: (event) => {
      // ULTRA SENSITIVE: Super low threshold for instant closing
      const isLeftSwipe = event.translationX < 0;
      const shouldClose = Math.abs(event.translationX) > screenWidth * 0.02 && isLeftSwipe; // Ultra sensitive!
      
      if (shouldClose) {
        detailsTranslateX.value = withSpring(-screenWidth, {
          damping: 30,  // Even faster spring
          stiffness: 400,
          mass: 0.8
        });
        runOnJS(onClose)();
      } else {
        detailsTranslateX.value = withSpring(0, {
          damping: 30,
          stiffness: 400,
          mass: 0.8
        });
      }
    }
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: detailsTranslateX.value }],
    };
  });

  if (!visible) return null;

  return (
    <>
      {/* Edit Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCancelEdit}
      >
        <View style={{ flex: 1, backgroundColor: darkColors.background }}>
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            paddingHorizontal: 24, 
            paddingTop: 60, 
            paddingBottom: 20,
            backgroundColor: darkColors.background,
            borderBottomWidth: 0.5,
            borderBottomColor: darkColors.border
          }}>
            <TouchableOpacity onPress={handleCancelEdit}>
              <X size={24} color={darkColors.textSecondary} />
            </TouchableOpacity>
            
            <Text style={{ fontSize: 18, fontWeight: '600', fontFamily: 'System', color: darkColors.text }}>
              Edit Post
            </Text>
            
            <TouchableOpacity 
              onPress={handleSaveEdit}
              disabled={!hasChanges}
              style={{ opacity: hasChanges ? 1 : 0.5 }}
            >
              <Check size={24} color='#3B82F6' />
            </TouchableOpacity>
          </View>

          <ScrollView style={{ flex: 1, paddingHorizontal: 24 }}>
            <View style={{ marginBottom: 40, marginTop: 24 }}>
              <Text style={{ fontSize: 16, fontWeight: 'normal', color: darkColors.text, marginBottom: 16 }}>
                CAPTION
              </Text>
              
              <View style={{ 
                borderWidth: 1, 
                borderColor: darkColors.border, 
                borderRadius: 8, 
                padding: 16,
                backgroundColor: darkColors.backgroundSecondary
              }}>
                <TextInput
                  value={editContent}
                  onChangeText={setEditContent}
                  placeholder="Share your thoughts..."
                  multiline
                  numberOfLines={4}
                  style={{
                    fontSize: 16,
                    color: darkColors.text,
                    fontWeight: '300',
                    minHeight: 100,
                    textAlignVertical: 'top'
                  }}
                  placeholderTextColor={darkColors.textSecondary}
                />
              </View>
            </View>

            <View style={{ marginBottom: 40 }}>
              <Text style={{ fontSize: 16, fontWeight: 'normal', color: darkColors.text, marginBottom: 16 }}>
                LOCATION
              </Text>
              {!canEditLocation && (
                <Text style={{ fontSize: 14, color: darkColors.textSecondary, fontWeight: '300', marginBottom: 12 }}>
                  Location has already been edited
                </Text>
              )}
              <View
                style={{
                  borderWidth: 1,
                  borderColor: darkColors.border,
                  borderRadius: 8,
                  padding: 16,
                  backgroundColor: darkColors.backgroundSecondary,
                  opacity: canEditLocation ? 1 : 0.5
                }}
              >
                <TextInput
                  value={editLocation}
                  onChangeText={canEditLocation ? setEditLocation : undefined}
                  placeholder="Enter location"
                  style={{ fontSize: 16, color: darkColors.text, fontWeight: '300' }}
                  placeholderTextColor={darkColors.textSecondary}
                  editable={canEditLocation}
                />
              </View>
            </View>

            {/* CENTRALIZED: Only show activity editing for NON-LUCID posts */}
            {currentPost.type !== 'lucid' && (
              <View style={{ marginBottom: 40 }}>
                <Text style={{ fontSize: 16, fontWeight: 'normal', color: darkColors.text, marginBottom: 16 }}>
                  ACTIVITIES
                </Text>
                {!canEditActivity && (
                  <Text style={{ fontSize: 14, color: darkColors.textSecondary, fontWeight: '300', marginBottom: 12 }}>
                    Activities have already been edited
                  </Text>
                )}
                <View 
                  style={{
                    borderWidth: 1,
                    borderColor: darkColors.border,
                    borderRadius: 8,
                    padding: 16,
                    backgroundColor: darkColors.backgroundSecondary,
                    opacity: canEditActivity ? 1 : 0.5
                  }}
                >
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                    {activityTags.map((tag: ActivityTag) => (
                      <PillTag
                        key={tag.id}
                        label={tag.name}
                        color={tag.color}
                        selected={editActivity === tag.id}
                        onPress={canEditActivity ? () => handleActivitySelect(tag.id) : undefined}
                        size="medium"
                        isCreatePage={true}
                      />
                    ))}
                  </View>
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>

      <PanGestureHandler 
        onGestureEvent={closeGestureHandler}
        enabled={true}
        // SUPER SENSITIVE: Ultra-responsive offsets for instant close
        activeOffsetX={[-3, 3]} // Super sensitive horizontal detection
        failOffsetY={[-60, 60]} // More forgiving vertical tolerance
        avgTouches={false} // Disable averaging for instant response
      >
        <ReanimatedAnimated.View
          style={[{
            position: 'absolute',
            top: getAlignedHeaderPosition(),
            left: 0,
            width: screenWidth,
            height: screenHeight - getAlignedHeaderPosition() - 70,
            zIndex: 1000,
          }, animatedStyle]}
        >
          {/* Frosted Glass Background Layer - STARTS BELOW HEADER to show curved edges */}
          <View style={{
            position: 'absolute',
            top: 84, // START BELOW HEADER to show curved edges
            left: 0,
            right: 0,
            bottom: 0,
                      backgroundColor: 'rgba(26, 26, 26, 0.75)',
            // Frosted glass border
            borderTopWidth: 0.5,
            borderTopColor: 'rgba(255, 255, 255, 0.1)',
            // Additional shadow for depth
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }} />
          
          {/* Subtle gradient overlay for extra frosted effect - STARTS BELOW HEADER */}
          <View style={{
            position: 'absolute',
            top: 84, // START BELOW HEADER to show curved edges
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(40, 40, 40, 0.15)',
          }} />
          
          {/* Additional frosted layer for depth - POSITIONED BELOW HEADER */}
          <View style={{
            position: 'absolute',
            top: 84, // START BELOW HEADER to show curved edges
            left: 0,
            right: 0,
            height: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
          }} />
        {/* Overlay to close menu when tapping outside */}
        {openMenu && (
          <TouchableOpacity
            onPress={() => setOpenMenu(false)}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 5,
            }}
            activeOpacity={0.0}
          />
        )}

        {/* Overlay to close comment menu when tapping outside */}
        {openCommentMenu && (
          <TouchableOpacity
            onPress={() => setOpenCommentMenu(null)}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 50,
            }}
            activeOpacity={0.0}
          />
        )}

        {/* Header */}
        <View style={{
          backgroundColor: currentPost.activity ? activityColors[currentPost.activity] : darkColors.backgroundSecondary, // Use activity color or default section color
          paddingTop: 20,
          paddingBottom: 16,
          paddingHorizontal: 20,
          borderTopLeftRadius: 16, // Soft rounded corners
          borderTopRightRadius: 16,
          // Subtle shadow for depth
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 4,
          zIndex: 1000, // High z-index for entire header
          position: 'relative', // Ensure z-index works
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            {/* User Info */}
            <TouchableOpacity 
              onPress={handleProfilePress}
              style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                flex: 1 
              }}
              activeOpacity={0.7}
            >
                      {(currentPost.authorProfileImage || currentPost.authorName === 'Third Camacho') ? (
                <Image
                  source={{ uri: currentPost.authorProfileImage || 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=400' }}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    borderWidth: 2,
                    borderColor: 'white',
                    marginRight: 12
                  }}
                />
              ) : (
                <View style={{ 
                  width: 48, 
                  height: 48, 
                  borderRadius: 24, 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginRight: 12
                }}>
                  <Text style={{ 
                    color: '#000', 
                    fontSize: 20, 
                    fontWeight: '600',
                    fontFamily: 'System'
                  }}>
                    {currentPost.authorName.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}

              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{
                    color: currentPost.activity ? 'white' : darkColors.text, // White for activity colors, theme text for default
                    fontSize: 16,
                    fontWeight: '600',
                    fontFamily: 'System'
                  }}>
                    {currentPost.authorName}
                  </Text>
                  <Text style={{ 
                    fontSize: 16, 
                    marginLeft: 4 
                  }}>
                    {currentPost.authorNationalityFlag || ''}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                  <Text style={{ 
                    color: currentPost.activity ? 'rgba(255, 255, 255, 0.8)' : darkColors.textSecondary, // White for activity colors, theme secondary for default
                    fontSize: 13, 
                    fontWeight: '400',
                    fontFamily: 'System'
                  }}>
                    {currentPost.timeAgo}
                  </Text>
                  {currentPost.isEdited && (
                    <Text style={{ 
                      color: currentPost.activity ? 'rgba(255, 255, 255, 0.8)' : darkColors.textSecondary, // White for activity colors, theme secondary for default
                      fontSize: 13, 
                      fontWeight: '400',
                      fontFamily: 'System',
                      marginLeft: 6 
                    }}>
                      • Edited
                    </Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>

            {/* Action Buttons */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <TouchableOpacity 
                onPress={() => setOpenMenu(!openMenu)}
                style={{ 
                  padding: 10,
                  borderRadius: 22,
                }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                activeOpacity={0.7}
              >
                <MoreVertical size={22} color={currentPost.activity ? "white" : darkColors.text} />
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={onClose}
                style={{ 
                  padding: 10,
                  borderRadius: 22,
                }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                activeOpacity={0.7}
              >
                <X size={22} color={currentPost.activity ? "white" : darkColors.text} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Dropdown Menu */}
          {openMenu && (
            <View style={{ 
              position: 'absolute', 
              top: 80, 
              right: 20, 
              backgroundColor: darkColors.background, 
              borderWidth: 1, 
              borderColor: darkColors.border, 
              borderRadius: 12, 
              paddingVertical: 4, 
              zIndex: 9999, // SUPER HIGH Z-INDEX to appear above everything
              minWidth: 160,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 12,
              elevation: 25, // Higher elevation for Android
            }}>
              {isCurrentUserPost ? (
                <>
                  <TouchableOpacity
                    onPress={handleEdit}
                    style={{ 
                      flexDirection: 'row', 
                      alignItems: 'center', 
                      paddingHorizontal: 16, 
                      paddingVertical: 14 
                    }}
                    activeOpacity={0.3}
                  >
                    <Edit size={18} color={darkColors.textSecondary} />
                    <Text style={{ 
                      marginLeft: 12, 
                      color: darkColors.text, 
                      fontSize: 15,
                      fontWeight: '400',
                      fontFamily: 'System'
                    }}>
                      Edit Post
                    </Text>
                  </TouchableOpacity>
                  <View style={{ 
                    height: 1, 
                    backgroundColor: darkColors.border, 
                    marginHorizontal: 16 
                  }} />
                  <TouchableOpacity
                    onPress={handleDelete}
                    style={{ 
                      flexDirection: 'row', 
                      alignItems: 'center', 
                      paddingHorizontal: 16, 
                      paddingVertical: 14 
                    }}
                    activeOpacity={0.3}
                  >
                    <Trash2 size={18} color="#EF4444" />
                    <Text style={{ 
                      marginLeft: 12, 
                      color: '#EF4444', 
                      fontSize: 15,
                      fontWeight: '400',
                      fontFamily: 'System'
                    }}>
                      Delete Post
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  onPress={handleReport}
                  style={{ 
                    flexDirection: 'row', 
                    alignItems: 'center', 
                    paddingHorizontal: 16, 
                    paddingVertical: 14 
                  }}
                  activeOpacity={0.3}
                >
                  <Flag size={18} color={darkColors.textSecondary} />
                  <Text style={{ 
                    marginLeft: 12, 
                    color: darkColors.text, 
                    fontSize: 15,
                    fontWeight: '400',
                    fontFamily: 'System'
                  }}>
                    Report Post
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {/* Main Content */}
        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Info Card */}
          <View style={{
            margin: 20,
            borderRadius: 16,
            overflow: 'hidden',
            position: 'relative',
          }}>
            {/* Frosted Background Layer */}
            <View style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: true 
                ? 'rgba(26, 35, 50, 0.75)' // Same as backgroundSecondary with transparency
                : 'rgba(248, 249, 250, 0.75)',
              borderRadius: 16,
              // Frosted glass border
              borderWidth: 0.5,
              borderColor: true 
                ? 'rgba(255, 255, 255, 0.05)' 
                : 'rgba(0, 0, 0, 0.03)',
              // Subtle shadow
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 2,
            }} />
            
            {/* Subtle gradient overlay */}
            <View style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: true 
                ? 'rgba(40, 40, 40, 0.1)' 
                : 'rgba(240, 240, 240, 0.1)',
              borderRadius: 16,
            }} />
            {/* Location */}
            <View style={{
              padding: 16,
              borderBottomWidth: 1,
              borderBottomColor: darkColors.border,
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: darkColors.background,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12
                }}>
                  <Text style={{ fontSize: 18 }}>📍</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: 11,
                    color: darkColors.textSecondary,
                    fontWeight: '500',
                    fontFamily: 'System',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    marginBottom: 2
                  }}>
                    Location
                  </Text>
                  <Text style={{
                    fontSize: 15,
                    color: darkColors.text,
                    fontWeight: '500',
                    fontFamily: 'System'
                  }}>
                    {currentPost.location}
                  </Text>
                </View>
                <TouchableOpacity 
                  onPress={() => {
                    if (!finalNavigation) {
                      console.warn('Navigation not available for location press in DetailPostView');
                      return;
                    }
                    
                    try {
                      // Navigate directly to location
                      const success = LocationNavigation.navigateToForum(finalNavigation, currentPost.location);
                      console.log(`[DEBUG] Location navigation success from DetailPostView:`, success);
                    } catch (error) {
                      console.warn('Location navigation failed in DetailPostView:', error);
                    }
                  }}
                  style={{
                    backgroundColor: darkColors.cobalt,
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    borderRadius: 20
                  }}
                >
                  <Text style={{
                    color: 'white',
                    fontSize: 13,
                    fontWeight: '600',
                    fontFamily: 'System'
                  }}>
                    View Pod
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Camera Info */}
            {currentPost.device && (
              <View style={{
                padding: 16,
                borderBottomWidth: 1,
                borderBottomColor: darkColors.border,
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: darkColors.background,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12
                  }}>
                    <Camera size={18} color={darkColors.textSecondary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{
                      fontSize: 11,
                      color: darkColors.textSecondary,
                      fontWeight: '500',
                      fontFamily: 'System',
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                      marginBottom: 2
                    }}>
                      Camera
                    </Text>
                    <Text style={{
                      fontSize: 15,
                      color: darkColors.text,
                      fontWeight: '400',
                      fontFamily: 'System'
                    }}>
                      {currentPost.device}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* Activity */}
            <View style={{
              padding: 16,
            }}>
              <Text style={{
                fontSize: 11,
                color: darkColors.textSecondary,
                fontWeight: '500',
                fontFamily: 'System',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                marginBottom: 12
              }}>
                Activity
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                {(() => {
                  const selectedActivityTag = currentPost.activity ? activityTags.find(tag => {
                    const activityKeyMap: { [key: string]: ActivityKey } = {
                      'Aquatics': 'aquatics',
                      'Outdoors': 'outdoors', 
                      'City': 'city',
                      'Food': 'food',
                      'Stays': 'stays',
                      'Heritage': 'heritage',
                      'Wellness': 'wellness',
                      'Amusements': 'amusements',
                      'Cultural': 'cultural',
                      'Special Experiences': 'special',
                      'Thrill': 'thrill',
                    };
                    return activityKeyMap[tag.name] === currentPost.activity;
                  }) : null;

                  if (selectedActivityTag) {
                    return (
                      <>
                        <View
                          style={{
                            backgroundColor: selectedActivityTag.color,
                            paddingHorizontal: 16,
                            paddingVertical: 8,
                            borderRadius: 20,
                          }}
                        >
                          <Text style={{
                            color: 'white',
                            fontSize: 14,
                            fontWeight: '600',
                            fontFamily: 'System'
                          }}>
                            {selectedActivityTag.name}
                          </Text>
                        </View>
                        
                        {/* Plus/Minus button to show/hide other activities */}
                        <TouchableOpacity
                          onPress={() => setShowAllActivities(!showAllActivities)}
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 16,
                            backgroundColor: darkColors.backgroundSecondary,
                            borderWidth: 1,
                            borderColor: darkColors.border,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {showAllActivities ? (
                            <Minus size={16} color={darkColors.textSecondary} />
                          ) : (
                            <Plus size={16} color={darkColors.textSecondary} />
                          )}
                        </TouchableOpacity>
                        
                        {/* Show other activities when expanded */}
                        {showAllActivities && (
                          <View style={{ 
                            width: '100%', 
                            flexDirection: 'row', 
                            flexWrap: 'wrap', 
                            gap: 8, 
                            marginTop: 8 
                          }}>
                            {activityTags
                              .filter(tag => tag.id !== selectedActivityTag.id)
                              .map((tag) => (
                                <View
                                  key={tag.id}
                                  style={{
                                    backgroundColor: tag.color,
                                    paddingHorizontal: 16,
                                    paddingVertical: 8,
                                    borderRadius: 20,
                                    opacity: 0.4,
                                  }}
                                >
                                  <Text style={{
                                    color: 'white',
                                    fontSize: 14,
                                    fontWeight: '600',
                                    fontFamily: 'System'
                                  }}>
                                    {tag.name}
                                  </Text>
                                </View>
                              ))}
                          </View>
                        )}
                      </>
                    );
                  } else {
                    return (
                      <Text style={{
                        color: darkColors.textSecondary,
                        fontSize: 14,
                        fontStyle: 'italic',
                        fontFamily: 'System'
                      }}>
                        No activity selected
                      </Text>
                    );
                  }
                })()}
              </View>
            </View>
          </View>

          {/* Caption */}
          {currentPost.content && (
            <View style={{
              marginHorizontal: 20,
              marginBottom: 24,
              position: 'relative',
            }}>
              {/* Frosted Background Layer */}
              <View style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: true 
                  ? 'rgba(26, 35, 50, 0.75)' // Same as other bubbles
                  : 'rgba(248, 249, 250, 0.75)', // Same as other bubbles
                borderRadius: 16,
                // Frosted glass border
                borderWidth: 0.5,
                borderColor: true 
                  ? 'rgba(255, 255, 255, 0.05)' 
                  : 'rgba(0, 0, 0, 0.03)',
                // Subtle shadow
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 2,
              }} />
              
              {/* Subtle gradient overlay */}
              <View style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: true 
                  ? 'rgba(40, 40, 40, 0.1)' // Same as other bubbles
                  : 'rgba(240, 240, 240, 0.1)', // Same as other bubbles
                borderRadius: 16,
              }} />
              
              {/* Content */}
              <View style={{
                padding: 16,
                zIndex: 1,
              }}>
                <Text style={{
                  fontSize: 11,
                  color: darkColors.textSecondary,
                  fontWeight: '500',
                  fontFamily: 'System',
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  marginBottom: 8
                }}>
                  Caption
                </Text>
                <Text style={{
                  fontSize: 16,
                  lineHeight: 24,
                  color: darkColors.text,
                  fontWeight: '400',
                  fontFamily: 'System'
                }}>
                  {currentPost.content}
                </Text>
              </View>
            </View>
          )}

          {/* Engagement Bar */}
          <View style={{
            flexDirection: 'row',
            marginHorizontal: 20,
            marginBottom: 24,
            borderRadius: 16,
            padding: 4,
            position: 'relative',
          }}>
            {/* Frosted Background Layer */}
            <View style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: true 
                ? 'rgba(26, 35, 50, 0.75)' 
                : 'rgba(248, 249, 250, 0.75)',
              borderRadius: 16,
              borderWidth: 0.5,
              borderColor: true 
                ? 'rgba(255, 255, 255, 0.05)' 
                : 'rgba(0, 0, 0, 0.03)',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 2,
            }} />
            
            {/* Gradient overlay */}
            <View style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: true 
                ? 'rgba(40, 40, 40, 0.1)' 
                : 'rgba(240, 240, 240, 0.1)',
              borderRadius: 16,
            }} />
            <TouchableOpacity
              onPress={handleLike}
              activeOpacity={0.4}
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 12,
                borderRadius: 12,
                backgroundColor: isLiked ? 'rgba(255, 48, 64, 0.1)' : 'transparent'
              }}
            >
              <Animated.View style={{
                flexDirection: 'row',
                alignItems: 'center',
                transform: [{ scale: likeButtonScale }]
              }}>
                <Heart
                  size={20}
                  color={isLiked ? '#ff3040' : darkColors.textSecondary}
                  fill={isLiked ? '#ff3040' : 'none'}
                />
                <Text style={{
                  fontSize: 15,
                  fontWeight: '600',
                  fontFamily: 'System',
                  color: isLiked ? '#ff3040' : darkColors.text,
                  marginLeft: 6
                }}>
                  {likeCount}
                </Text>
              </Animated.View>
            </TouchableOpacity>

            <View style={{
              width: 1,
              backgroundColor: darkColors.border,
              marginVertical: 8
            }} />

            <TouchableOpacity
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 12
              }}
            >
              <MessageCircle size={20} color={darkColors.textSecondary} />
              <Text style={{
                fontSize: 15,
                fontWeight: '600',
                fontFamily: 'System',
                color: darkColors.text,
                marginLeft: 6
              }}>
                {commentCount}
              </Text>
            </TouchableOpacity>

            <View style={{
              width: 1,
              backgroundColor: darkColors.border,
              marginVertical: 8
            }} />

            <TouchableOpacity
              onPress={onShare}
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 12
              }}
            >
              <Send size={20} color={darkColors.textSecondary} />
              <Text style={{
                fontSize: 15,
                fontWeight: '600',
                fontFamily: 'System',
                color: darkColors.text,
                marginLeft: 6
              }}>
                {shareCount}
              </Text>
            </TouchableOpacity>

            <View style={{
              width: 1,
              backgroundColor: darkColors.border,
              marginVertical: 8
            }} />

            <TouchableOpacity
              onPress={handleSave}
              activeOpacity={0.4}
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 12,
                borderRadius: 12,
                backgroundColor: isSaved ? 'rgba(255, 215, 0, 0.1)' : 'transparent'
              }}
            >
              <Animated.View style={{
                flexDirection: 'row',
                alignItems: 'center',
                transform: [{ scale: saveButtonScale }]
              }}>
                <Bookmark
                  size={20}
                  color={isSaved ? '#FFD700' : darkColors.textSecondary}
                  fill={isSaved ? '#FFD700' : 'none'}
                />
                <Text style={{
                  fontSize: 15,
                  fontWeight: '600',
                  fontFamily: 'System',
                  color: isSaved ? '#FFD700' : darkColors.text,
                  marginLeft: 6
                }}>
                  {savedCount}
                </Text>
              </Animated.View>
            </TouchableOpacity>
          </View>

          {/* Comments Section */}
          <View style={{
            marginHorizontal: 20
          }}>
            <Text style={{
              fontSize: 11,
              color: darkColors.textSecondary,
              fontWeight: '500',
              fontFamily: 'System',
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              marginBottom: 16
            }}>
              Comments ({commentCount})
            </Text>

            {/* Comment Input */}
            <View style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
              borderRadius: 16,
              padding: 12,
              marginBottom: 16,
              position: 'relative',
            }}>
              {/* Frosted Background Layer */}
              <View style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: true 
                  ? 'rgba(26, 35, 50, 0.75)' 
                  : 'rgba(248, 249, 250, 0.75)',
                borderRadius: 16,
                borderWidth: 0.5,
                borderColor: true 
                  ? 'rgba(255, 255, 255, 0.05)' 
                  : 'rgba(0, 0, 0, 0.03)',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 2,
              }} />
              
              {/* Gradient overlay */}
              <View style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: true 
                  ? 'rgba(40, 40, 40, 0.1)' 
                  : 'rgba(240, 240, 240, 0.1)',
                borderRadius: 16,
              }} />
              <TextInput
                value={commentText}
                onChangeText={setCommentText}
                placeholder="Add a comment..."
                style={{
                  flex: 1,
                  fontSize: 15,
                  color: darkColors.text,
                  fontWeight: '400',
                  fontFamily: 'System',
                  minHeight: 40,
                  maxHeight: 120
                }}
                placeholderTextColor={darkColors.textSecondary}
                multiline
              />
              <TouchableOpacity
                onPress={handleAddComment}
                disabled={!commentText.trim()}
                style={{
                  backgroundColor: commentText.trim() ? darkColors.cobalt : darkColors.border,
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: 12
                }}
              >
                <Send size={16} color="white" />
              </TouchableOpacity>
            </View>

            {/* Comments List */}
            {localComments.map((comment) => (
              <View key={comment.id} style={{
                padding: 16,
                borderRadius: 16,
                marginBottom: 12,
                position: 'relative'
              }}>
                {/* Frosted Background Layer */}
                <View style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: true 
                    ? 'rgba(26, 35, 50, 0.75)' 
                    : 'rgba(248, 249, 250, 0.75)',
                  borderRadius: 16,
                  borderWidth: 0.5,
                  borderColor: true 
                    ? 'rgba(255, 255, 255, 0.05)' 
                    : 'rgba(0, 0, 0, 0.03)',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                  elevation: 2,
                }} />
                
                {/* Gradient overlay */}
                <View style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: true 
                    ? 'rgba(40, 40, 40, 0.1)' 
                    : 'rgba(240, 240, 240, 0.1)',
                  borderRadius: 16,
                }} />
                <View style={{ 
                  flexDirection: 'row', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  marginBottom: 8 
                }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <Text style={{
                      fontSize: 14,
                      fontWeight: '600',
                      fontFamily: 'System',
                      color: darkColors.text
                    }}>
                      {comment.author}
                    </Text>
                    <Text style={{
                      fontSize: 12,
                      color: darkColors.textSecondary,
                      fontFamily: 'System',
                      marginLeft: 8
                    }}>
                      • {comment.timestamp}
                    </Text>
                  </View>
                  
                  <TouchableOpacity
                    onPress={() => setOpenCommentMenu(openCommentMenu === comment.id ? null : comment.id)}
                    style={{ padding: 4 }}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <MoreVertical size={16} color={darkColors.textSecondary} />
                  </TouchableOpacity>
                </View>
                
                <Text style={{
                  fontSize: 15,
                  color: darkColors.text,
                  fontWeight: '400',
                  fontFamily: 'System',
                  lineHeight: 22
                }}>
                  {comment.text}
                </Text>

                {/* Comment Menu Dropdown */}
                {openCommentMenu === comment.id && (
                  <View style={{
                    position: 'absolute',
                    top: 40,
                    right: 16,
                    backgroundColor: darkColors.background,
                    borderWidth: 1,
                    borderColor: darkColors.border,
                    borderRadius: 12,
                    paddingVertical: 4,
                    zIndex: 100,
                    minWidth: 120,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.15,
                    shadowRadius: 12,
                    elevation: 15,
                  }}>
                    {comment.isOwn ? (
                      <TouchableOpacity
                        onPress={() => handleDeleteComment(comment.id)}
                        style={{ 
                          flexDirection: 'row', 
                          alignItems: 'center', 
                          paddingHorizontal: 16, 
                          paddingVertical: 12 
                        }}
                      >
                        <Trash2 size={16} color="#EF4444" />
                        <Text style={{ 
                          marginLeft: 8, 
                          color: '#EF4444', 
                          fontSize: 14, 
                          fontWeight: '400',
                          fontFamily: 'System'
                        }}>
                          Delete
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        onPress={() => handleReportComment(comment.id)}
                        style={{ 
                          flexDirection: 'row', 
                          alignItems: 'center', 
                          paddingHorizontal: 16, 
                          paddingVertical: 12 
                        }}
                      >
                        <Flag size={16} color={darkColors.textSecondary} />
                        <Text style={{ 
                          marginLeft: 8, 
                          color: darkColors.text, 
                          fontSize: 14, 
                          fontWeight: '400',
                          fontFamily: 'System'
                        }}>
                          Report
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>
            ))}

            {/* Load More Comments */}
            {currentPost.comments > 0 && (
              <TouchableOpacity style={{
                paddingVertical: 14,
                borderRadius: 16,
                alignItems: 'center',
                marginBottom: 20,
                position: 'relative',
              }}>
                {/* Frosted Background Layer */}
                <View style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: true 
                    ? 'rgba(26, 35, 50, 0.75)' 
                    : 'rgba(248, 249, 250, 0.75)',
                  borderRadius: 16,
                  borderWidth: 0.5,
                  borderColor: true 
                    ? 'rgba(255, 255, 255, 0.05)' 
                    : 'rgba(0, 0, 0, 0.03)',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                  elevation: 2,
                }} />
                
                {/* Gradient overlay */}
                <View style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: true 
                    ? 'rgba(40, 40, 40, 0.1)' 
                    : 'rgba(240, 240, 240, 0.1)',
                  borderRadius: 16,
                }} />
                <Text style={{
                  color: darkColors.cobalt,
                  fontSize: 14,
                  fontWeight: '600',
                  fontFamily: 'System'
                }}>
                  Load {currentPost.comments} more comments
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </ReanimatedAnimated.View>
      </PanGestureHandler>
    </>
  );
};

export default DetailPostView;
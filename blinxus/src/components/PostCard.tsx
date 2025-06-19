import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Alert, Modal, TextInput, ScrollView, Dimensions } from 'react-native';
import { PostCardProps } from '../types/structures/posts_structure';
import { Heart, MessageCircle, Send, Bookmark, MoreVertical, Camera, Trash2, Flag, Edit, X, Check } from 'lucide-react-native';
import { usePosts } from '../store/PostsContext';
import { useSavedPosts } from '../store/SavedPostsContext';
import { activityTags, ActivityKey } from '../constants/activityTags';
import type { ActivityTag } from '../constants/activityTags';
import PillTag from './PillTag';
import { useNavigation } from '@react-navigation/native';
import { useThemeColors } from '../hooks/useThemeColors';

const { width: screenWidth } = Dimensions.get('window');

interface PostCardComponentProps extends PostCardProps {}

const PostCard: React.FC<PostCardComponentProps> = ({
  id,
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
  isEdited,
  editAttempts,
  locationEditCount,
  activityEditCount,
  activity
}) => {
  const { deletePost, editPost, likePost, unlikePost, addComment } = usePosts();
  const { savePost, unsavePost, isPostSaved } = useSavedPosts();
  const navigation = useNavigation();
  const themeColors = useThemeColors();
  const [openMenu, setOpenMenu] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editContent, setEditContent] = useState(content || '');
  const [editLocation, setEditLocation] = useState(location);
  const [editActivity, setEditActivity] = useState<number | null>(null);
  // Track original values to detect changes
  const [originalContent, setOriginalContent] = useState(content || '');
  const [originalLocation, setOriginalLocation] = useState(location);
  const [originalActivity, setOriginalActivity] = useState<number | null>(null);

  // Check if current user is the author
  const isCurrentUserPost = authorName === 'Third Camacho';

  // Check if location/activity can still be edited (only once each allowed)
  const canEditLocation = (locationEditCount || 0) < 1;
  const canEditActivity = (activityEditCount || 0) < 1;

  // Check if any changes have been made
  const hasChanges = 
    editContent !== originalContent || 
    editLocation !== originalLocation || 
    editActivity !== originalActivity;

  // Future-proof profile navigation handler
  const handleProfilePress = () => {
    // For now, only Third Camacho has a profile since no authentication/backend yet
    // In the future, this will navigate to any user's profile based on authorName/authorId
    if (authorName === 'Third Camacho') {
      // Navigate to Profile - the profile will handle resetting to top
      navigation.navigate('Profile' as never);
    }
    // TODO: When backend is implemented, add logic for other users:
    // navigation.navigate('UserProfile', { userId: authorId, userName: authorName });
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
            deletePost(id);
            setOpenMenu(false);
          }
        }
      ]
    );
  };

  const handleEdit = () => {
    const currentContent = content || '';
    const currentLocation = location;
    
    // Set current values
    setEditContent(currentContent);
    setEditLocation(currentLocation);
    
    // Set original values for comparison
    setOriginalContent(currentContent);
    setOriginalLocation(currentLocation);
    
    // Set current activity selection
    if (activity) {
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
        return activityKeyMap[tag.name] === activity;
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
    if (!canEditActivity) return; // Prevent selection if activity already edited once
    setEditActivity(activityId === editActivity ? null : activityId);
  };

  const handleSaveEdit = () => {
    if (editLocation.trim() === '') {
      Alert.alert('Error', 'Location cannot be empty.');
      return;
    }

    // Convert activity ID to ActivityKey for post update
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

    editPost(id, {
      content: editContent.trim() === '' ? undefined : editContent.trim(),
      location: editLocation.trim(),
      activity: activityKey
    });
    
    setShowEditModal(false);
  };

  const handleCancelEdit = () => {
    setEditContent(content || '');
    setEditLocation(location);
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
    if (isLiked) {
      unlikePost(id);
      setIsLiked(false);
    } else {
      likePost(id);
      setIsLiked(true);
    }
  };

  const handleComment = () => {
    // For now, just increment comment count
    // In the future, this could open a comment modal
    addComment(id);
    Alert.alert(
      'Comment Added',
      'Comment functionality will be expanded soon!',
      [{ text: 'OK' }]
    );
  };

  // Swipeable Image Carousel Component
  const SwipeableImageCarousel: React.FC<{
    images: string[];
    device?: string;
  }> = ({ images, device }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleScroll = (event: any) => {
      const scrollPosition = event.nativeEvent.contentOffset.x;
      const index = Math.round(scrollPosition / screenWidth);
      setCurrentIndex(index);
    };

    if (!images || images.length === 0) return null;

    return (
      <View style={{ position: 'relative' }}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={{ width: screenWidth }}
        >
          {images.map((image, index) => (
            <Image
              key={index}
              source={{ uri: image }}
              style={{ width: screenWidth, height: 320 }}
              resizeMode="cover"
            />
          ))}
        </ScrollView>
        
        {/* Image indicators */}
        {images.length > 1 && (
          <View style={{
            position: 'absolute',
            top: 16,
            right: 16,
            paddingHorizontal: 12,
            paddingVertical: 6,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            borderRadius: 16,
            flexDirection: 'row',
            alignItems: 'center'
          }}>
            <Text style={{ color: '#ffffff', fontSize: 12, fontWeight: '500' }}>
              {currentIndex + 1}/{images.length}
            </Text>
          </View>
        )}
        
        {/* Device info */}
        {device && (
          <View style={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            paddingHorizontal: 12,
            paddingVertical: 8,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: 20,
            flexDirection: 'row',
            alignItems: 'center'
          }}>
            <Camera size={14} color="#000000" style={{ marginRight: 4 }} />
            <Text style={{ color: '#000000', fontSize: 12, fontWeight: '300' }}>
              {device}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View>
      {/* Edit Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCancelEdit}
      >
        <View style={{ flex: 1, backgroundColor: themeColors.background }}>
          {/* Header */}
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            paddingHorizontal: 24, 
            paddingTop: 60, 
            paddingBottom: 20,
            backgroundColor: themeColors.background,
            borderBottomWidth: 0.5,
            borderBottomColor: themeColors.border
          }}>
            <TouchableOpacity onPress={handleCancelEdit}>
              <X size={24} color={themeColors.textSecondary} />
            </TouchableOpacity>
            
            <Text style={{ fontSize: 18, fontWeight: '600', color: themeColors.text }}>
              Edit Post
            </Text>
            
            <TouchableOpacity 
              onPress={handleSaveEdit}
              disabled={!hasChanges}
              style={{ opacity: hasChanges ? 1 : 0.5 }}
            >
                             <Check size={24} color={themeColors.isDark ? '#3B82F6' : '#0047AB'} />
            </TouchableOpacity>
          </View>

          <View style={{ flex: 1, paddingHorizontal: 24 }}>
            {/* Caption Section */}
            <View style={{ marginBottom: 40 }}>
              <Text style={{ fontSize: 16, fontWeight: 'normal', color: themeColors.text, marginBottom: 16 }}>
                CAPTION
              </Text>
              
              <View style={{ 
                borderWidth: 1, 
                borderColor: themeColors.border, 
                borderRadius: 8, 
                padding: 16,
                backgroundColor: themeColors.backgroundSecondary
              }}>
                <TextInput
                  value={editContent}
                  onChangeText={setEditContent}
                  placeholder="Share your thoughts..."
                  multiline
                  numberOfLines={4}
                  style={{
                    fontSize: 16,
                    color: themeColors.text,
                    fontWeight: '300',
                    minHeight: 100,
                    textAlignVertical: 'top'
                  }}
                  placeholderTextColor={themeColors.textSecondary}
                />
              </View>
            </View>

            {/* Location Section */}
            <View style={{ marginBottom: 40 }}>
              <Text style={{ fontSize: 16, fontWeight: 'normal', color: themeColors.text, marginBottom: 16 }}>
                LOCATION
              </Text>
              {!canEditLocation && (
                <Text style={{ fontSize: 14, color: themeColors.textSecondary, fontWeight: '300', marginBottom: 12 }}>
                  Location has already been edited
                </Text>
              )}
              <View
                style={{
                  borderWidth: 1,
                  borderColor: themeColors.border,
                  borderRadius: 8,
                  padding: 16,
                  backgroundColor: themeColors.backgroundSecondary,
                  opacity: canEditLocation ? 1 : 0.5
                }}
              >
                <TextInput
                  value={editLocation}
                  onChangeText={canEditLocation ? setEditLocation : undefined}
                  placeholder="Enter location"
                  style={{ fontSize: 16, color: themeColors.text, fontWeight: '300' }}
                  placeholderTextColor={themeColors.textSecondary}
                  editable={canEditLocation}
                />
              </View>
            </View>

            {/* Activity Section */}
            <View style={{ marginBottom: 40 }}>
              <Text style={{ fontSize: 16, fontWeight: 'normal', color: themeColors.text, marginBottom: 16 }}>
                ACTIVITY
              </Text>
              {!canEditActivity && (
                <Text style={{ fontSize: 14, color: themeColors.textSecondary, fontWeight: '300', marginBottom: 12 }}>
                  Activity has already been edited
                </Text>
              )}
              <View 
                style={{
                  borderWidth: 1,
                  borderColor: themeColors.border,
                  borderRadius: 8,
                  padding: 16,
                  backgroundColor: themeColors.backgroundSecondary,
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
          </View>
        </View>
      </Modal>

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
          activeOpacity={1}
        />
      )}

      {/* Card Container */}
      <View style={{ backgroundColor: themeColors.background, borderBottomWidth: 1, borderBottomColor: themeColors.border }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', padding: 24 }}>
          <View style={{ flexDirection: 'row', flex: 1 }}>
            {/* Avatar */}
            <TouchableOpacity onPress={handleProfilePress} activeOpacity={0.7}>
              <View style={{ height: 48, width: 48, borderRadius: 24, overflow: 'hidden', marginRight: 16 }}>
                {authorProfileImage ? (
                  <Image source={{ uri: authorProfileImage }} style={{ height: '100%', width: '100%' }} />
                ) : (
                  <View style={{ height: '100%', width: '100%', backgroundColor: themeColors.backgroundTertiary, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: themeColors.textSecondary, fontSize: 16, fontWeight: '300' }}>
                      {authorName.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
            
            {/* User Info */}
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={handleProfilePress} activeOpacity={0.7}>
                  <Text style={{ fontWeight: 'normal', color: themeColors.text, fontSize: 16 }}>{authorName}</Text>
                </TouchableOpacity>
                {authorNationalityFlag && (
                  <Text style={{ marginLeft: 8, fontSize: 16, fontWeight: '300', color: themeColors.text }}>{authorNationalityFlag}</Text>
                )}
              </View>
              
              {/* Location Pill */}
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                <View 
                  style={{ 
                    paddingHorizontal: 6, 
                    paddingVertical: 2, 
                    borderRadius: 12, 
                    marginRight: 12,
                    backgroundColor: activityColor || 'transparent',
                    borderWidth: activityColor ? 0 : 0.5,
                    borderColor: activityColor ? 'transparent' : themeColors.text
                  }}
                >
                  <Text 
                    style={{ 
                      fontSize: 14, 
                      fontWeight: '300',
                      color: activityColor ? 'white' : themeColors.text
                    }}
                  >
                    {location}
                  </Text>
                </View>
                <Text style={{ color: themeColors.textSecondary, fontSize: 14, fontWeight: '300' }}>{timeAgo}</Text>
                {isEdited && (
                  <Text style={{ color: themeColors.textSecondary, fontSize: 14, fontWeight: '300', marginLeft: 4 }}>• edited</Text>
                )}
              </View>
            </View>
          </View>
          
          {/* More Options */}
          <TouchableOpacity 
            onPress={() => setOpenMenu(!openMenu)}
            style={{ padding: 8 }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.3}
          >
            <MoreVertical size={20} color={themeColors.textSecondary} />
          </TouchableOpacity>

          {/* Dropdown Menu */}
          {openMenu && (
            <View style={{ 
              position: 'absolute', 
              top: 56, 
              right: 24, 
              backgroundColor: themeColors.backgroundSecondary, 
              borderWidth: 1, 
              borderColor: themeColors.border, 
              borderRadius: 8, 
              paddingVertical: 8, 
              zIndex: 10, 
              minWidth: 128,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 5,
            }}>
              {isCurrentUserPost ? (
                <>
                  <TouchableOpacity
                    onPress={handleEdit}
                    style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 }}
                    activeOpacity={0.3}
                  >
                    <Edit size={16} color={themeColors.textSecondary} />
                    <Text style={{ marginLeft: 12, color: themeColors.text, fontWeight: '300' }}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleDelete}
                    style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 }}
                    activeOpacity={0.3}
                  >
                    <Trash2 size={16} color="#EF4444" />
                    <Text style={{ marginLeft: 12, color: '#EF4444', fontWeight: '300' }}>Delete</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  onPress={handleReport}
                  style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 }}
                  activeOpacity={0.3}
                >
                  <Flag size={16} color={themeColors.textSecondary} />
                  <Text style={{ marginLeft: 12, color: themeColors.text, fontWeight: '300' }}>Report</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {/* Image */}
        {images && images.length > 0 && (
          <SwipeableImageCarousel images={images} device={device} />
        )}

        {/* Content Text */}
        {content && (
          <View style={{ paddingHorizontal: 24, paddingTop: 16 }}>
            <Text style={{ 
              fontSize: 16, 
              lineHeight: 24, 
              color: themeColors.text, 
              fontWeight: '300' 
            }}>
              {content}
            </Text>
          </View>
        )}

        {/* Interaction Bar */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 16 }}>
          {/* Like Button */}
          <TouchableOpacity 
            onPress={handleLike}
            style={{ flexDirection: 'row', alignItems: 'center' }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.3}
          >
            <Heart 
              size={20} 
              color={isLiked ? '#EF4444' : themeColors.textSecondary}
              fill={isLiked ? '#EF4444' : 'none'}
            />
            <Text style={{ marginLeft: 8, fontSize: 14, fontWeight: '300', color: isLiked ? '#EF4444' : themeColors.textSecondary }}>
              {likes}
            </Text>
          </TouchableOpacity>

          {/* Comment Button */}
          <TouchableOpacity 
            onPress={handleComment}
            style={{ flexDirection: 'row', alignItems: 'center' }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.3}
          >
            <MessageCircle size={20} color={themeColors.textSecondary} />
            <Text style={{ marginLeft: 8, color: themeColors.textSecondary, fontSize: 14, fontWeight: '300' }}>{comments}</Text>
          </TouchableOpacity>

          {/* Share Button */}
          <TouchableOpacity
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.3}
          >
            <Send size={20} color={themeColors.textSecondary} />
          </TouchableOpacity>

          {/* Save Button */}
          <TouchableOpacity 
            onPress={() => {
              if (isPostSaved(id)) {
                unsavePost(id);
              } else {
                savePost(id);
              }
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.3}
          >
            <Bookmark 
              size={20} 
              color={isPostSaved(id) ? '#FFD700' : themeColors.textSecondary}
              fill={isPostSaved(id) ? '#FFD700' : 'none'}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default PostCard;
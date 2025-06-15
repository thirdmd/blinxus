import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { PostCardProps } from '../types/structures/posts_structure';
import { Heart, MessageCircle, Send, Bookmark, MoreVertical, Camera, Trash2, Flag, Edit, X, Check, MapPin } from 'lucide-react-native';
import { usePosts } from '../store/PostsContext';
import { useSavedPosts } from '../store/SavedPostsContext';
import { activityTags, ActivityKey } from '../constants/activityTags';
import type { ActivityTag } from '../constants/activityTags';
import PillTag from './PillTag';
import { useNavigation } from '@react-navigation/native';

interface LucidPostCardProps extends PostCardProps {
  // Additional props specific to Lucids
  duration?: number;
  dayCount?: number;
  isLucidPost?: boolean;
}

const LucidPostCard: React.FC<LucidPostCardProps> = ({
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
  activity,
  duration,
  dayCount,
  isLucidPost = true
}) => {
  const { deletePost, editPost, likePost, unlikePost, addComment } = usePosts();
  const { savePost, unsavePost, isPostSaved } = useSavedPosts();
  const navigation = useNavigation();
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
    if (authorName === 'Third Camacho') {
      navigation.navigate('Profile' as never);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Lucid',
      'Are you sure you want to delete this Lucid post?',
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
    
    setEditContent(currentContent);
    setEditLocation(currentLocation);
    setOriginalContent(currentContent);
    setOriginalLocation(currentLocation);
    
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
      'Report Lucid',
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
    addComment(id);
    Alert.alert(
      'Comment Added',
      'Comment functionality will be expanded soon!',
      [{ text: 'OK' }]
    );
  };

  const handleImagePress = () => {
    // Navigate to dedicated fullscreen instead of showing inline
    (navigation as any).navigate('LucidFullscreen', {
      post: {
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
        activity,
        type: 'lucid',
        authorId: '',
        timestamp: '',
        title: undefined
      }
    });
  };

  return (
    <View>
      {/* Edit Modal - Same as PostCard for now */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCancelEdit}
      >
        <View className="flex-1 bg-white">
          <View className="flex-row items-center justify-between px-6 pt-6 pb-4">
            <TouchableOpacity
              onPress={handleCancelEdit}
              className="w-10 h-10 items-center justify-center"
              activeOpacity={0.3}
            >
              <X size={20} color="#000000" />
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={handleSaveEdit}
              className="w-10 h-10 items-center justify-center"
              activeOpacity={0.3}
              disabled={!hasChanges}
            >
              <Check size={20} color={hasChanges ? '#000000' : '#9CA3AF'} />
            </TouchableOpacity>
          </View>

          <View className="px-6 pb-8">
            <Text className="text-2xl font-normal text-black">Edit Lucid</Text>
            <Text className="text-sm text-gray-400 font-light mt-2">
              Update your Lucid post details
            </Text>
            
            {(canEditLocation || canEditActivity) && (
              <View className="mt-6 p-4 rounded-lg" style={{ backgroundColor: '#FEF3C7' }}>
                <Text className="text-sm font-light" style={{ color: '#92400E' }}>
                  NOTE: ⚠️ LOCATION and ACTIVITY can only be changed once each per post
                </Text>
              </View>
            )}
          </View>

          <View className="flex-1 px-6">
            <View className="mb-10">
              <Text className="text-base font-normal text-black mb-4">
                CAPTION
              </Text>
              
              <View className="border border-gray-200 rounded-lg p-4">
                <TextInput
                  value={editContent}
                  onChangeText={setEditContent}
                  placeholder="Share your Lucid experience..."
                  multiline
                  numberOfLines={4}
                  className="text-base text-black font-light"
                  style={{
                    minHeight: 100,
                    textAlignVertical: 'top'
                  }}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            <View className="mb-10">
              <Text className="text-base font-normal text-black mb-4">
                LOCATION
              </Text>
              {!canEditLocation && (
                <Text className="text-sm text-gray-500 font-light mb-3">
                  Location has already been edited
                </Text>
              )}
              <View
                className="border border-gray-200 rounded-lg p-4"
                style={{
                  opacity: canEditLocation ? 1 : 0.5
                }}
              >
                <TextInput
                  value={editLocation}
                  onChangeText={canEditLocation ? setEditLocation : undefined}
                  placeholder="Enter location"
                  className="text-base text-black font-light"
                  placeholderTextColor="#9CA3AF"
                  editable={canEditLocation}
                />
              </View>
            </View>

            <View className="mb-10">
              <Text className="text-base font-normal text-black mb-4">
                ACTIVITY
              </Text>
              {!canEditActivity && (
                <Text className="text-sm text-gray-500 font-light mb-3">
                  Activity has already been edited
                </Text>
              )}
              <View 
                className="border border-gray-200 rounded-lg p-4"
                style={{
                  opacity: canEditActivity ? 1 : 0.5
                }}
              >
                <View className="flex-row flex-wrap gap-2">
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

      {/* Overlay to close menu */}
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

      {/* Lucid Card Container - Special styling for Lucids */}
      <View className="bg-white border-b border-gray-100">
        {/* Header with Lucid indicator */}
        <View className="flex-row items-start justify-between p-6">
          <View className="flex-row flex-1">
            <TouchableOpacity onPress={handleProfilePress} activeOpacity={0.7}>
              <View className="h-12 w-12 rounded-full overflow-hidden mr-4">
                {authorProfileImage ? (
                  <Image source={{ uri: authorProfileImage }} className="h-full w-full" />
                ) : (
                  <View className="h-full w-full bg-gray-100 items-center justify-center">
                    <Text className="text-gray-600 text-base font-light">
                      {authorName.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
            
            <View className="flex-1">
              <View className="flex-row items-center">
                <TouchableOpacity onPress={handleProfilePress} activeOpacity={0.7}>
                  <Text className="font-normal text-black text-base">{authorName}</Text>
                </TouchableOpacity>
                {authorNationalityFlag && (
                  <Text className="ml-2 text-base font-light">{authorNationalityFlag}</Text>
                )}
                {/* Lucid Badge */}
                <View className="ml-2 px-2 py-0.5 bg-blue-100 rounded-full">
                  <Text className="text-blue-600 text-xs font-medium">LUCID</Text>
                </View>
              </View>
              
              <View className="flex-row items-center mt-1">
                <View 
                  className="px-1.5 py-0.5 rounded-full mr-3 flex-row items-center"
                  style={{ 
                    backgroundColor: activityColor || 'transparent',
                    borderWidth: activityColor ? 0 : 0.5,
                    borderColor: activityColor ? 'transparent' : '#000000'
                  }}
                >
                  <MapPin size={12} color={activityColor ? 'white' : '#000000'} />
                  <Text 
                    className="text-sm font-light ml-1"
                    style={{ 
                      color: activityColor ? 'white' : '#000000'
                    }}
                  >
                    {location}
                  </Text>
                </View>
                {duration && (
                  <Text className="text-gray-400 text-sm font-light mr-2">
                    {duration} days
                  </Text>
                )}
                <Text className="text-gray-400 text-sm font-light">{timeAgo}</Text>
                {isEdited && (
                  <Text className="text-gray-400 text-sm font-light ml-1">• edited</Text>
                )}
              </View>
            </View>
          </View>
          
          <TouchableOpacity 
            onPress={() => setOpenMenu(!openMenu)}
            className="p-2"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.3}
          >
            <MoreVertical size={20} color="#9CA3AF" />
          </TouchableOpacity>

          {/* Dropdown Menu */}
          {openMenu && (
            <View className="absolute top-14 right-6 bg-white border border-gray-200 rounded-lg py-2 z-10 min-w-32">
              {isCurrentUserPost ? (
                <>
                  <TouchableOpacity
                    onPress={handleEdit}
                    className="flex-row items-center px-4 py-3"
                    activeOpacity={0.3}
                  >
                    <Edit size={16} color="#6B7280" />
                    <Text className="ml-3 text-black font-light">Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleDelete}
                    className="flex-row items-center px-4 py-3"
                    activeOpacity={0.3}
                  >
                    <Trash2 size={16} color="#EF4444" />
                    <Text className="ml-3 text-red-500 font-light">Delete</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  onPress={handleReport}
                  className="flex-row items-center px-4 py-3"
                  activeOpacity={0.3}
                >
                  <Flag size={16} color="#6B7280" />
                  <Text className="ml-3 text-black font-light">Report</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>



        {/* Image - Clickable for Lucid Album */}
        {images && images.length > 0 && (
          <TouchableOpacity onPress={handleImagePress} activeOpacity={0.95}>
            <View className="relative">
              <Image 
                source={{ uri: images[0] }} 
                className="w-full h-80" 
                resizeMode="cover" 
              />
              {/* Lucid Album Indicator */}
              <View className="absolute top-4 left-4 px-3 py-1 bg-blue-600/90 rounded-full">
                <Text className="text-white text-xs font-medium">ALBUM</Text>
              </View>
              {device && (
                <View className="absolute bottom-4 right-4 px-3 py-2 bg-white/90 rounded-full flex-row items-center">
                  <Camera size={14} color="#000000" style={{ marginRight: 4 }} />
                  <Text className="text-black text-xs font-light">
                    {device}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        )}

        {/* Interaction Bar */}
        <View className="flex-row items-center justify-between px-6 py-4">
          <TouchableOpacity 
            onPress={handleLike}
            className="flex-row items-center"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.3}
          >
            <Heart 
              size={20} 
              color={isLiked ? '#EF4444' : '#6B7280'}
              fill={isLiked ? '#EF4444' : 'none'}
            />
            <Text className={`ml-2 text-sm font-light ${isLiked ? 'text-red-500' : 'text-gray-500'}`}>
              {likes}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={handleComment}
            className="flex-row items-center"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.3}
          >
            <MessageCircle size={20} color="#6B7280" />
            <Text className="ml-2 text-gray-500 text-sm font-light">{comments}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.3}
          >
            <Send size={20} color="#6B7280" />
          </TouchableOpacity>

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
              color={isPostSaved(id) ? '#0047AB' : '#6B7280'}
              fill={isPostSaved(id) ? '#0047AB' : 'none'}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LucidPostCard; 
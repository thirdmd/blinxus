import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { PostCardProps } from '../types/structures/posts_structure';
import { Heart, MessageCircle, Send, Bookmark, MoreVertical, Camera, Trash2, Flag, Edit, X, Check } from 'lucide-react-native';
import { usePosts } from '../store/PostsContext';
import { useSavedPosts } from '../store/SavedPostsContext';
import { activityTags, ActivityKey } from '../constants/activityTags';
import type { ActivityTag } from '../constants/activityTags';
import PillTag from './PillTag';

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
  activity
}) => {
  const { deletePost, editPost } = usePosts();
  const { savePost, unsavePost, isPostSaved } = useSavedPosts();
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

  // Check if location/activity can still be edited (only once allowed)
  const canEditLocationActivity = (editAttempts || 0) < 1;

  // Check if any changes have been made
  const hasChanges = 
    editContent !== originalContent || 
    editLocation !== originalLocation || 
    editActivity !== originalActivity;

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
    if (!canEditLocationActivity) return; // Prevent selection if already edited once
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

  return (
    <View>
      {/* Edit Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCancelEdit}
      >
        <View className="flex-1 bg-white">
          {/* Header - Matching CreatePost design */}
          <View className="flex-row items-center justify-between px-6 py-6">
            <TouchableOpacity
              onPress={handleCancelEdit}
              className="w-12 h-12 rounded-full bg-gray-50 items-center justify-center"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 1,
              }}
              activeOpacity={0.7}
            >
              <Text className="text-gray-600 text-lg">✕</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={handleSaveEdit}
              className={`w-12 h-12 rounded-full items-center justify-center ${
                hasChanges ? 'bg-blue-600' : 'bg-gray-300'
              }`}
              style={{
                shadowColor: hasChanges ? '#0047AB' : '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: hasChanges ? 0.12 : 0.05,
                shadowRadius: 6,
                elevation: hasChanges ? 3 : 1,
              }}
              activeOpacity={0.8}
              disabled={!hasChanges}
            >
              <Text className={`text-lg font-semibold ${
                hasChanges ? 'text-white' : 'text-gray-500'
              }`}>✓</Text>
            </TouchableOpacity>
          </View>

          {/* Title Section */}
          <View className="items-center py-4 px-6">
            <Text className="text-xl font-semibold text-gray-900">Edit Post</Text>
            <Text className="text-sm text-gray-400 mt-2 text-center">
              Update your caption and location
            </Text>
            
            {/* First-time edit warning */}
            {canEditLocationActivity && (
              <View className="mt-4 p-3 bg-amber-50 rounded-2xl border border-amber-200">
                <Text className="text-sm text-amber-800 text-center">
                  ⚠️ Important: LOCATION and ACTIVITY can only be changed once per post!
                </Text>
              </View>
            )}
          </View>

          {/* Modal Content */}
          <View className="flex-1 px-6" style={{ paddingBottom: 20 }}>
            {/* Caption Section */}
            <View className="mb-8">
              <Text className="text-lg font-semibold text-gray-900 mb-4">
                What's on your mind?
              </Text>
              
              <View 
                className="bg-gray-50 rounded-3xl p-5"
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.03,
                  shadowRadius: 8,
                  elevation: 1,
                }}
              >
                <TextInput
                  value={editContent}
                  onChangeText={setEditContent}
                  placeholder="Share your experience, thoughts, or memories..."
                  multiline
                  numberOfLines={4}
                  className="text-base text-gray-900 leading-6"
                  style={{
                    minHeight: 100,
                    textAlignVertical: 'top'
                  }}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

                         {/* Location Section */}
             <View className="mb-8">
               <Text className="text-lg font-semibold text-gray-900 mb-4">
                 Where are you posting about?
               </Text>
               {!canEditLocationActivity && (
                 <Text className="text-sm text-orange-600 mb-3">
                   ⚠️ Location can only be changed once. You've already edited this post.
                 </Text>
               )}
               <View
                 className="bg-gray-50 rounded-3xl p-5"
                 style={{
                   shadowColor: '#000',
                   shadowOffset: { width: 0, height: 1 },
                   shadowOpacity: 0.03,
                   shadowRadius: 8,
                   elevation: 1,
                   opacity: canEditLocationActivity ? 1 : 0.5
                 }}
               >
                 <View className="flex-row items-center">
                   <View className="w-10 h-10 rounded-full bg-white items-center justify-center mr-4">
                     <Text className="text-gray-400 text-lg">📍</Text>
                   </View>
                   <TextInput
                     value={editLocation}
                     onChangeText={canEditLocationActivity ? setEditLocation : undefined}
                     placeholder="Enter your destination"
                     className="text-base text-gray-900 flex-1"
                     placeholderTextColor="#9CA3AF"
                     editable={canEditLocationActivity}
                   />
                 </View>
               </View>
             </View>

                         {/* Activity Section */}
             <View className="mb-8">
               <Text className="text-lg font-semibold text-gray-900 mb-4">
                 What type of experience?
               </Text>
               {!canEditLocationActivity && (
                 <Text className="text-sm text-orange-600 mb-3">
                   ⚠️ Activity can only be changed once. You've already edited this post.
                 </Text>
               )}
               <View 
                 className="bg-gray-50 p-4 rounded-3xl"
                 style={{
                   shadowColor: '#000',
                   shadowOffset: { width: 0, height: 1 },
                   shadowOpacity: 0.03,
                   shadowRadius: 8,
                   elevation: 1,
                   opacity: canEditLocationActivity ? 1 : 0.5
                 }}
               >
                 <View className="flex-row flex-wrap gap-3">
                   {activityTags.map((tag: ActivityTag) => (
                     <PillTag
                       key={tag.id}
                       label={tag.name}
                       color={tag.color}
                       selected={editActivity === tag.id}
                       onPress={canEditLocationActivity ? () => handleActivitySelect(tag.id) : undefined}
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
          className="absolute inset-0 z-5"
          activeOpacity={1}
        />
      )}

      {/* Card Container with Soft Shadow */}
      <View 
        className="bg-white overflow-hidden relative"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        {/* Header */}
        <View className="flex-row items-start justify-between p-5">
          <View className="flex-row flex-1">
            {/* Avatar - Circle with same size */}
            <View className="h-16 w-16 overflow-hidden mr-3" style={{ borderRadius: 32 }}>
              {authorProfileImage ? (
                <Image source={{ uri: authorProfileImage }} className="h-full w-full" />
              ) : (
                <View className="h-full w-full bg-gray-200 items-center justify-center">
                  <Text className="text-gray-600 text-lg font-semibold">
                    {authorName.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
            </View>
            
            {/* User Info */}
            <View className="flex-1 justify-center">
              <View className="flex-row items-center">
                <Text className="font-semibold text-gray-900 text-base">{authorName}</Text>
                {authorNationalityFlag && (
                  <Text className="ml-2 text-base">{authorNationalityFlag}</Text>
                )}
              </View>
              
              {/* Smart Location Pill - Below Name */}
              <View className="flex-row items-center mt-2">
                <View 
                  className="px-3 py-1.5 mr-2"
                  style={{ 
                    backgroundColor: activityColor || 'white',
                    borderRadius: 12,
                    borderWidth: activityColor ? 0 : 1,
                    borderColor: activityColor ? 'transparent' : '#000000'
                  }}
                >
                  <Text 
                    className="text-sm font-medium"
                    style={{ 
                      color: activityColor ? 'white' : '#1F2937'
                    }}
                  >
                    {location}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Text className="text-gray-500 text-sm">{timeAgo}</Text>
                  {isEdited && (
                    <View className="flex-row items-center ml-2">
                      <Text className="text-gray-400 text-xs">•</Text>
                      <Text className="text-gray-400 text-xs ml-1">edited</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </View>
          
          {/* More Options */}
          <View className="relative">
            <TouchableOpacity 
              onPress={() => setOpenMenu(!openMenu)}
              className="p-2"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MoreVertical size={20} color="#9CA3AF" />
            </TouchableOpacity>

            {/* Dropdown Menu */}
            {openMenu && (
              <View 
                className="absolute top-10 right-0 bg-white rounded-2xl py-2 z-10"
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.15,
                  shadowRadius: 12,
                  elevation: 8,
                  minWidth: 140,
                }}
              >
                {isCurrentUserPost ? (
                  // Show Edit and Delete options for current user's posts
                  <>
                    <TouchableOpacity
                      onPress={handleEdit}
                      className="flex-row items-center px-4 py-3"
                      activeOpacity={0.7}
                    >
                      <Edit size={18} color="#6B7280" />
                      <Text className="ml-3 text-gray-600 font-medium">Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleDelete}
                      className="flex-row items-center px-4 py-3"
                      activeOpacity={0.7}
                    >
                      <Trash2 size={18} color="#EF4444" />
                      <Text className="ml-3 text-red-500 font-medium">Delete</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  // Show Report option for other users' posts
                  <TouchableOpacity
                    onPress={handleReport}
                    className="flex-row items-center px-4 py-3"
                    activeOpacity={0.7}
                  >
                    <Flag size={18} color="#6B7280" />
                    <Text className="ml-3 text-gray-600 font-medium">Report</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        </View>

        {/* Content Text */}
        {content && (
          <View className="px-5 pb-4">
            <Text className="text-gray-800 text-base leading-6">{content}</Text>
          </View>
        )}

        {/* Image */}
        {images && images.length > 0 && (
          <View className="relative">
            <Image 
              source={{ uri: images[0] }} 
              className="w-full h-80" 
              resizeMode="cover" 
            />
            {device && (
              <View 
                className="absolute bottom-3 right-3 px-3 py-1.5 flex-row items-center"
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  borderRadius: 16,
                }}
              >
                <Camera size={14} color="white" style={{ marginRight: 4, opacity: 0.9 }} />
                <Text className="text-white text-xs" style={{ opacity: 0.9 }}>
                  {device}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Interaction Bar */}
        <View className="flex-row items-center justify-between px-5 py-4">
          {/* Left Actions */}
          <View className="flex-row items-center">
            {/* Like Button */}
            <TouchableOpacity 
              onPress={() => setIsLiked(!isLiked)}
              className="flex-row items-center mr-5"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Heart 
                size={22} 
                color={isLiked ? '#EF4444' : '#6B7280'}
                fill={isLiked ? '#EF4444' : 'none'}
              />
              <Text className={`ml-2 text-sm ${isLiked ? 'text-red-500 font-medium' : 'text-gray-600'}`}>
                {likes}
              </Text>
            </TouchableOpacity>

            {/* Comment Button */}
            <TouchableOpacity 
              className="flex-row items-center mr-5"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MessageCircle size={22} color="#6B7280" />
              <Text className="ml-2 text-gray-600 text-sm">{comments}</Text>
            </TouchableOpacity>

            {/* Share Button */}
            <TouchableOpacity
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Send size={22} color="#6B7280" />
            </TouchableOpacity>
          </View>

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
          >
            <Bookmark 
              size={22} 
              color={isPostSaved(id) ? '#0047AB' : '#6B7280'}
              fill={isPostSaved(id) ? '#0047AB' : 'none'}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default PostCard;
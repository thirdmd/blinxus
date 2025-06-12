import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { PostCardProps } from '../types/structures/posts_structure';
import { Heart, MessageCircle, Send, Bookmark, MoreVertical, Camera } from 'lucide-react-native';

interface PostCardComponentProps extends PostCardProps {}

const PostCard: React.FC<PostCardComponentProps> = ({
  id,
  authorName,
  authorProfileImage,
  content,
  images,
  device,
  location,
  activityName,
  activityColor,
  timeAgo,
  likes,
  comments
}) => {
  const [openMenu, setOpenMenu] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  return (
    <View>
      {/* Card Container with Soft Shadow */}
      <View 
        className="bg-white overflow-hidden"
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
              <Text className="font-semibold text-gray-900 text-base">{authorName}</Text>
              
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
                    className="text-xs font-medium"
                    style={{ 
                      color: activityColor ? 'white' : '#1F2937'
                    }}
                  >
                    {location}
                  </Text>
                </View>
                <Text className="text-gray-500 text-sm">{timeAgo}</Text>
              </View>
            </View>
          </View>
          
          {/* More Options */}
          <TouchableOpacity 
            onPress={() => setOpenMenu(!openMenu)}
            className="p-2"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MoreVertical size={20} color="#9CA3AF" />
          </TouchableOpacity>
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
        <View className="flex-row items-center justify-between px-5 py-4 border-t border-gray-100">
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
            onPress={() => setIsSaved(!isSaved)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Bookmark 
              size={22} 
              color={isSaved ? '#0047AB' : '#6B7280'}
              fill={isSaved ? '#0047AB' : 'none'}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default PostCard;
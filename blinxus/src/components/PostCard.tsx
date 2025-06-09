import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { PostCardProps } from '../types/structures/posts_structure';

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

  return (
    <View className="bg-white border-b border-gray-200 mb-3">
      {/* Header */}
      <View className="p-4">
        <View className="flex-row items-center mb-3">
          <View className="h-10 w-10 rounded-full overflow-hidden mr-3 bg-gray-300">
            {authorProfileImage ? (
              <Image source={{ uri: authorProfileImage }} className="h-full w-full" />
            ) : (
              <View className="h-full w-full bg-gray-300 items-center justify-center">
                <Text className="text-gray-500 text-sm font-semibold">
                  {authorName.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
          </View>
          <View className="flex-1">
            <Text className="font-semibold text-gray-800">{authorName}</Text>
            <View className="flex-row items-center space-x-2 mt-1">
              <Text className="text-xs text-gray-500">{timeAgo}</Text>
              
              {/* Smart Location Pill - Colored if activity exists, Colorless if not */}
              <View 
                className="px-2 py-1 rounded-full"
                style={{ 
                  backgroundColor: activityColor || '#E5E7EB' // Use activity color or gray if no activity
                }}
              >
                <Text 
                  className="text-xs font-medium"
                  style={{ 
                    color: activityColor ? 'white' : '#6B7280' // White text if colored, gray text if colorless
                  }}
                >
                  {location}
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity onPress={() => setOpenMenu(!openMenu)}>
            <Text className="text-gray-500 text-lg">⋯</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {content && (
          <View className="mb-3">
            <Text className="text-gray-700 text-sm leading-5">{content}</Text>
          </View>
        )}
      </View>

      {/* Image */}
      {images && images.length > 0 && (
        <View className="relative mb-2">
          <Image source={{ uri: images[0] }} className="w-full h-80" resizeMode="cover" />
          {device && (
            <View className="absolute bottom-2 right-2 bg-black bg-opacity-40 backdrop-blur-sm rounded-full px-2 py-1 flex-row items-center">
              <Text className="text-white text-xs opacity-80 mr-1">📸</Text>
              <Text className="text-white text-xs opacity-80">{device}</Text>
            </View>
          )}
        </View>
      )}

      {/* Interaction Bar */}
      <View className="px-4 py-3 flex-row items-center justify-between">
        <View className="flex-row items-center space-x-6">
          <View className="flex-row items-center space-x-1">
            <TouchableOpacity onPress={() => setIsLiked(!isLiked)}>
              <Text className="text-xl" style={{ color: isLiked ? "#DC2626" : "#6B7280" }}>
                {isLiked ? '❤️' : '🤍'}
              </Text>
            </TouchableOpacity>
            <Text className="text-sm text-gray-600">{likes}</Text>
          </View>
          <View className="flex-row items-center space-x-1">
            <TouchableOpacity>
              <Text className="text-xl text-gray-500">💬</Text>
            </TouchableOpacity>
            <Text className="text-sm text-gray-600">{comments}</Text>
          </View>
          <TouchableOpacity>
            <Text className="text-xl text-gray-500">📤</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity>
          <Text className="text-xl text-gray-500">🔖</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PostCard;

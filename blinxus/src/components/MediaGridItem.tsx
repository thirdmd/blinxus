import React from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';

interface MediaGridItemProps {
  id: string;
  imageUri: string;
  username: string;
  location: string;
  activityColor?: string;
  onPress: () => void;
  columnWidth: number;
  aspectRatio?: number;
}

const MediaGridItem: React.FC<MediaGridItemProps> = ({
  id,
  imageUri,
  username,
  location,
  activityColor,
  onPress,
  columnWidth,
  aspectRatio = 1,
}) => {
  const imageHeight = columnWidth / aspectRatio;

  return (
    <TouchableOpacity 
      onPress={onPress} 
      className="mb-3"
      activeOpacity={0.9}
    >
      <View>
        {/* Image with soft corners */}
        <Image
          source={{ uri: imageUri }}
          className="w-full"
          style={{ 
            height: imageHeight,
            borderRadius: 20,
          }}
          resizeMode="cover"
        />
        
        {/* Username and Location overlay */}
        <View className="flex-row items-center justify-between mt-2 px-1">
          {/* Username */}
          <Text 
            className="text-xs font-medium text-gray-700 flex-shrink"
            numberOfLines={1}
          >
            {username}
          </Text>
          
          {/* Location Pill */}
          <View 
            className="ml-2 px-2 py-1"
            style={{ 
              backgroundColor: activityColor || '#E5E7EB',
              borderRadius: 12,
              maxWidth: '60%',
            }}
          >
            <Text 
              className="text-xs font-medium"
              style={{ 
                color: activityColor ? 'white' : '#374151'
              }}
              numberOfLines={1}
            >
              {location.split(',')[0]} {/* Show only city/first part */}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default MediaGridItem; 
import React from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useThemeColors } from '../hooks/useThemeColors';

interface MediaGridItemProps {
  id: string;
  imageUri: string;
  username: string;
  nationalityFlag?: string;
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
  nationalityFlag,
  location,
  activityColor,
  onPress,
  columnWidth,
  aspectRatio = 1,
}) => {
  const imageHeight = columnWidth / aspectRatio;
  const themeColors = useThemeColors();

  return (
    <TouchableOpacity 
      onPress={onPress} 
      style={{ marginBottom: 12 }}
      activeOpacity={0.9}
    >
      <View>
        {/* Image with soft corners */}
        <Image
          source={{ uri: imageUri }}
          style={{ 
            width: '100%',
            height: imageHeight,
            borderRadius: 20,
          }}
          resizeMode="cover"
        />
        
        {/* Username and Location overlay */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8, paddingHorizontal: 4 }}>
          {/* Username with Flag - More visible */}
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 8 }}>
            <Text 
              style={{ 
                fontSize: 12, // Back to original size
                fontWeight: 'normal', // Back to original weight
                color: themeColors.text, // Theme-aware color
                flex: 1
              }}
              numberOfLines={1}
            >
              {username}
            </Text>
            {nationalityFlag && (
              <Text style={{ marginLeft: 4, fontSize: 12, fontWeight: '300', color: themeColors.text }}>{nationalityFlag}</Text>
            )}
          </View>
          
          {/* Location Pill */}
          <View 
            style={{ 
              paddingHorizontal: 8, 
              paddingVertical: 4,
              backgroundColor: activityColor || 'transparent',
              borderRadius: 12,
              maxWidth: '60%',
              borderWidth: activityColor ? 0 : 0.5,
              borderColor: activityColor ? 'transparent' : themeColors.text
            }}
          >
            <Text 
              style={{ 
                fontSize: 12,
                fontWeight: '300',
                color: activityColor ? 'white' : themeColors.text
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
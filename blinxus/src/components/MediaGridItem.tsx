import React from 'react';
import { Image, TouchableOpacity, View, Dimensions } from 'react-native';
import { Album } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface MediaGridItemProps {
  imageUri: string;
  onPress: () => void;
  isLucid?: boolean;
}

const MediaGridItem: React.FC<MediaGridItemProps> = ({
  imageUri,
  onPress,
  isLucid = false,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ 
        width: width / 3,
        aspectRatio: 4/5,
        padding: 1
      }}
      activeOpacity={0.8}
    >
      <View style={{ position: 'relative', flex: 1 }}>
        <Image
          source={{ uri: imageUri }}
          style={{ 
            width: '100%', 
            height: '100%',
            borderRadius: 8,
            backgroundColor: '#f3f4f6'
          }}
          resizeMode="cover"
        />
        
        {/* Lucid Indicator Icon */}
        {isLucid && (
          <View style={{
            position: 'absolute',
            top: 8,
            right: 8,
            width: 24,
            height: 24,
            borderRadius: 12,
            backgroundColor: '#0047AB',
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 3
          }}>
            <Album size={14} color="white" strokeWidth={2.5} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default MediaGridItem; 
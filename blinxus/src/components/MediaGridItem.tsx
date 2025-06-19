import React from 'react';
import { Image, TouchableOpacity, View, Dimensions, Animated } from 'react-native';
import { Album } from 'lucide-react-native';
import { getResponsiveDimensions, ri, rs, RESPONSIVE_SCREEN } from '../utils/responsive';

const { width } = RESPONSIVE_SCREEN;
const responsiveDimensions = getResponsiveDimensions();

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
  const scaleValue = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.98,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={{ 
        width: responsiveDimensions.mediaGrid.itemWidth,
        aspectRatio: responsiveDimensions.mediaGrid.aspectRatio,
        padding: responsiveDimensions.mediaGrid.padding
      }}
      activeOpacity={1}
      delayPressIn={0}
      delayPressOut={0}
    >
      <Animated.View 
        style={{ 
          position: 'relative', 
          flex: 1,
          transform: [{ scale: scaleValue }]
        }}
      >
        <Image
          source={{ uri: imageUri }}
          style={{ 
            width: '100%', 
            height: '100%',
            borderRadius: rs(8),
            backgroundColor: '#f3f4f6'
          }}
          resizeMode="cover"
        />
        
        {/* Lucid Indicator Icon */}
        {isLucid && (
          <View style={{
            position: 'absolute',
            top: rs(8),
            right: rs(8),
            width: rs(24),
            height: rs(24),
            borderRadius: rs(12),
            backgroundColor: '#0047AB',
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: rs(2) },
            shadowOpacity: 0.25,
            shadowRadius: rs(4),
            elevation: 3
          }}>
            <Album size={ri(14)} color="white" strokeWidth={2.5} />
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

export default MediaGridItem; 
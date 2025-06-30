import React from 'react';
import { 
  View, 
  SafeAreaView, 
  StatusBar, 
  TouchableOpacity, 
  FlatList, 
  Animated 
} from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { PostCardProps } from '../types/structures/posts_structure';
import TravelFeedCard from './TravelFeedCard';
import { useThemeColors } from '../hooks/useThemeColors';
import { getResponsiveDimensions, ri, rs } from '../utils/responsive';
import { FullscreenConfig } from '../hooks/useFullscreenManager';

const responsiveDimensions = getResponsiveDimensions();

interface FullscreenViewProps {
  visible: boolean;
  posts: PostCardProps[];
  selectedPostIndex: number;
  animationValues: ReturnType<typeof import('../utils/animations').createAnimationValues>;
  config: FullscreenConfig;
  onBack: () => void;
  onLucidPress?: (post: PostCardProps) => void;
}

const FullscreenView: React.FC<FullscreenViewProps> = ({
  visible,
  posts,
  selectedPostIndex,
  animationValues,
  config,
  onBack,
  onLucidPress
}) => {
  const themeColors = useThemeColors();

  if (!visible) return null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
      <StatusBar 
        barStyle={themeColors.isDark ? "light-content" : "dark-content"} 
        backgroundColor={themeColors.background} 
      />
      
      {/* Animated Background Overlay */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: themeColors.background,
          opacity: animationValues.backgroundOpacity,
        }}
      />
      
      {/* Animated Content Container */}
      <Animated.View
        style={{
          flex: 1,
          transform: [{ scale: animationValues.scale }],
          opacity: animationValues.opacity,
        }}
      >
        {/* Fixed App Bar - Back button moved to far left corner */}
        <View style={{
          height: responsiveDimensions.appBar.height,
          backgroundColor: themeColors.background,
          flexDirection: 'row',
          alignItems: 'center',
          paddingLeft: rs(8), // Minimal left padding to reach corner
          paddingRight: responsiveDimensions.appBar.paddingHorizontal,
        }}>
          {/* Back button - Far left corner */}
          <TouchableOpacity 
            onPress={onBack}
            style={{ 
              width: responsiveDimensions.button.small.width, 
              height: responsiveDimensions.button.small.height, 
              alignItems: 'center', 
              justifyContent: 'center',
              borderRadius: rs(16),
              backgroundColor: 'transparent',
            }}
            activeOpacity={0.95}
            delayPressIn={0}
            delayPressOut={0}
          >
            <ChevronLeft size={ri(18)} color={themeColors.text} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* TravelFeedCard FlatList */}
        <FlatList
          data={posts}
          renderItem={({ item }) => (
            <TravelFeedCard 
              {...item} 
              onDetailsPress={() => {}}
              onLucidPress={item.type === 'lucid' ? () => onLucidPress?.(item) : undefined}
              isVisible={true}
            />
          )}
          keyExtractor={(item) => item.id}
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          pagingEnabled={true}
          snapToInterval={responsiveDimensions.feedCard.height}
          snapToAlignment="end"
          decelerationRate="fast"
          initialScrollIndex={selectedPostIndex}
          getItemLayout={(data, index) => ({
            length: responsiveDimensions.feedCard.height,
            offset: responsiveDimensions.feedCard.height * index,
            index,
          })}
          removeClippedSubviews={false}
          initialNumToRender={1}
          maxToRenderPerBatch={3}
          windowSize={5}
        />
      </Animated.View>
    </SafeAreaView>
  );
};

export default FullscreenView; 
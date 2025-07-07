import React, { useState, useRef, useCallback, useMemo } from 'react';
import { View, FlatList, StatusBar, TouchableOpacity, Dimensions, Alert, Text } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { PostCardProps } from '../types/structures/posts_structure';
import TravelFeedCard from './TravelFeedCard';
import { useThemeColors } from '../hooks/useThemeColors';
import { getResponsiveDimensions, ri, rs, rf } from '../utils/responsive';

const { width, height: screenHeight } = Dimensions.get('window');
const responsiveDimensions = getResponsiveDimensions();

interface ImmersiveFeedProps {
  posts: PostCardProps[];
  initialIndex?: number;
  title?: string;
  onBack?: () => void;
}

const ImmersiveFeed: React.FC<ImmersiveFeedProps> = ({
  posts,
  initialIndex = 0,
  title = 'Feed',
  onBack
}) => {
  const navigation = useNavigation();
  const themeColors = useThemeColors();
  
  // Use dark theme for immersive experience (same as ExploreScreen)
  const immersiveThemeColors = {
    background: '#000000',
    backgroundSecondary: '#1A1A1A',
    text: '#FFFFFF',
    textSecondary: '#B8B8B8',
    isDark: true
  };

  // Track currently visible post index
  const [currentVisibleIndex, setCurrentVisibleIndex] = useState(initialIndex);
  const currentVisibleIndexRef = useRef(initialIndex);
  
  // FlatList ref for programmatic control
  const flatListRef = useRef<FlatList>(null);

  // Handle back navigation
  const handleBack = useCallback(() => {
    if (onBack) {
      onBack();
    } else {
      navigation.goBack();
    }
  }, [navigation, onBack]);

  // Handle travel details press (same as ExploreScreen)
  const handleShowTravelDetails = useCallback((post: PostCardProps) => {
    // Details are handled within TravelFeedCard component
  }, []);

  // Optimized scroll handler (same as ExploreScreen)
  const handleScroll = useCallback((event: any) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    
    // Update current visible index for immersive feed
    const cardHeight = responsiveDimensions.feedCard.height;
    const newIndex = Math.max(0, Math.round(currentScrollY / cardHeight));
    
    // Only update state when actually changed to prevent unnecessary re-renders
    if (newIndex !== currentVisibleIndexRef.current) {
      currentVisibleIndexRef.current = newIndex;
      // Batch state update to prevent multiple re-renders
      requestAnimationFrame(() => {
        setCurrentVisibleIndex(newIndex);
      });
    }
  }, []);

  // Render each post item (same logic as ExploreScreen)
  const renderItem = useCallback(({ item, index }: { item: PostCardProps; index: number }) => {
    const isCurrentlyVisible = index >= currentVisibleIndex - 1 && index <= currentVisibleIndex + 1;
    
    return (
      <TravelFeedCard
        {...item}
        onDetailsPress={() => handleShowTravelDetails(item)}
        isVisible={isCurrentlyVisible}
        appBarElementsVisible={true} // Always position below app bar for immersive mode
        cardIndex={index}
      />
    );
  }, [currentVisibleIndex, handleShowTravelDetails]);

  // Memoize keyExtractor for performance
  const keyExtractor = useCallback((item: PostCardProps) => item.id, []);

  // Get item layout for performance (same as ExploreScreen)
  const getItemLayout = useCallback((data: any, index: number) => ({
    length: responsiveDimensions.feedCard.height,
    offset: responsiveDimensions.feedCard.height * index,
    index,
  }), []);

  return (
    <View style={{ flex: 1, backgroundColor: immersiveThemeColors.background }}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="transparent" 
        translucent={true}
      />
      
      {/* Back button - Floating overlay (same as ExploreScreen media mode) */}
      <TouchableOpacity 
        onPress={handleBack}
        style={{ 
          position: 'absolute',
          top: rs(60), // Safe area top + padding
          left: rs(16),
          width: rs(32), 
          height: rs(32), 
          alignItems: 'center', 
          justifyContent: 'center',
          borderRadius: rs(8),
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          zIndex: 1000,
        }}
        activeOpacity={0.7}
      >
        <ChevronLeft size={ri(20)} color="white" strokeWidth={2} />
      </TouchableOpacity>

      {/* Ensure the image extends to the top */}
      <View style={{ flex: 1 }}>
        <FlatList
          ref={flatListRef}
          data={posts}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          style={{ flex: 1, backgroundColor: immersiveThemeColors.background }}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={1} // Ultra fast responsiveness
          bounces={true}
          pagingEnabled={true} // TikTok-style snapping
          snapToInterval={responsiveDimensions.feedCard.height} // Snap to card height
          snapToAlignment="end"
          decelerationRate="fast"
          scrollsToTop={false}
          disableIntervalMomentum={true}
          // Performance optimizations (same as ExploreScreen)
          removeClippedSubviews={false}
          maxToRenderPerBatch={15}
          windowSize={21}
          initialNumToRender={8}
          updateCellsBatchingPeriod={1}
          legacyImplementation={false}
          maintainVisibleContentPosition={{
            minIndexForVisible: 0,
            autoscrollToTopThreshold: 100
          }}
          getItemLayout={getItemLayout}
          // Start at initial index if provided
          initialScrollIndex={initialIndex}
        />
      </View>

      {/* Placeholder bottom bar matching navigation bar height */}
      <TouchableOpacity
        onPress={() => Alert.alert('Comments', 'Opening comments view...')}
        style={{
          height: responsiveDimensions.tabBar.height,
          backgroundColor: '#000',
          justifyContent: 'center',
          paddingLeft: rs(16)
        }}
        activeOpacity={0.7}
      >
        <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: rf(14) }}>
          Add comment...
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ImmersiveFeed; 
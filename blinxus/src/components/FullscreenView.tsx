import React, { useRef, useEffect } from 'react';
import { 
  View, 
  StatusBar, 
  FlatList, 
  Modal,
  TouchableOpacity
} from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
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
  navigation?: NavigationProp<ParamListBase>;
}

const FullscreenView: React.FC<FullscreenViewProps> = ({
  visible,
  posts,
  selectedPostIndex,
  animationValues,
  config,
  onBack,
  onLucidPress,
  navigation
}) => {
  const themeColors = useThemeColors();
  const flatListRef = useRef<FlatList>(null);

  // RADICAL FIX: Force correct scroll position after mount
  useEffect(() => {
    if (visible && selectedPostIndex > 0 && flatListRef.current) {
      // Multiple attempts to ensure proper positioning
      const scrollToIndex = () => {
        flatListRef.current?.scrollToIndex({
          index: selectedPostIndex,
          animated: false,
          viewPosition: 0 // Ensure item is at the top
        });
      };

      // Immediate attempt
      scrollToIndex();
      
      // Backup attempts with delays to handle React Native timing issues
      setTimeout(scrollToIndex, 10);
      setTimeout(scrollToIndex, 50);
      setTimeout(scrollToIndex, 100);
    }
  }, [visible, selectedPostIndex]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onBack}
    >
      <View style={{ flex: 1, backgroundColor: themeColors.background }}>
        <StatusBar 
          barStyle={themeColors.isDark ? "light-content" : "dark-content"} 
          backgroundColor={themeColors.background} 
        />
        
        {/* Back Button - Floating Over Content */}
        <TouchableOpacity 
          onPress={onBack}
          style={{ 
            position: 'absolute',
            top: rs(8),
            left: rs(8),
            width: rs(32), 
            height: rs(32), 
            alignItems: 'center', 
            justifyContent: 'center',
            borderRadius: rs(16),
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            zIndex: 1000,
          }}
          activeOpacity={0.7}
        >
          <ChevronLeft size={ri(20)} color="white" strokeWidth={2} />
        </TouchableOpacity>
        
        {/* TravelFeedCard FlatList - Clean, No Padding */}
        <FlatList
          ref={flatListRef}
          data={posts}
          renderItem={({ item }) => (
            <TravelFeedCard 
              {...item} 
              onDetailsPress={() => {}}
              onLucidPress={item.type === 'lucid' ? () => onLucidPress?.(item) : undefined}
              isVisible={true}
              isInModal={true}
              navigation={navigation}
              onModalDismiss={onBack}
            />
          )}
          keyExtractor={(item) => item.id}
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          pagingEnabled={true}
          snapToInterval={responsiveDimensions.feedCard.height}
          snapToAlignment="start"
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
          onScrollToIndexFailed={(info) => {
            // RADICAL FALLBACK: Handle scroll failures
            const wait = new Promise<void>(resolve => setTimeout(() => resolve(), 500));
            wait.then(() => {
              flatListRef.current?.scrollToIndex({
                index: info.index,
                animated: false,
                viewPosition: 0
              });
            });
          }}
        />
      </View>
    </Modal>
  );
};

export default FullscreenView; 
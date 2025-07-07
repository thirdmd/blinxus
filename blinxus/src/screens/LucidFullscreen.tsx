import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import LucidAlbumView from '../components/LucidAlbumView';
import { PostCardProps } from '../types/structures/posts_structure';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useThemeColors } from '../hooks/useThemeColors';
import NavigationManager from '../utils/navigationManager';

interface LucidFullscreenParams {
  post: PostCardProps;
  previousContext?: {
    screenName: string;
    feedContext?: string;
    scrollPosition: number;
    selectedPostIndex: number;
  } | null;
}

export default function LucidFullscreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const themeColors = useThemeColors();
  const { post, previousContext } = route.params as LucidFullscreenParams;

  const handleBack = () => {
    // Simple back navigation - since LucidFullscreen is a modal/overlay screen,
    // goBack() should return to the previous screen (fullscreen TravelFeedCard view)
    // without affecting the fullscreen manager state
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor={themeColors.background} 
      />
      <LucidAlbumView 
        post={post}
        onBack={handleBack}
      />
    </SafeAreaView>
  );
} 
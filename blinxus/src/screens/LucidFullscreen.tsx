import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import LucidAlbumView from '../components/LucidAlbumView';
import { PostCardProps } from '../types/structures/posts_structure';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useThemeColors } from '../hooks/useThemeColors';

interface LucidFullscreenParams {
  post: PostCardProps;
}

export default function LucidFullscreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const themeColors = useThemeColors();
  const { post } = route.params as LucidFullscreenParams;

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
      <StatusBar 
        barStyle={themeColors.isDark ? "light-content" : "dark-content"} 
        backgroundColor={themeColors.background} 
      />
      <LucidAlbumView 
        post={post}
        onBack={handleBack}
      />
    </SafeAreaView>
  );
} 
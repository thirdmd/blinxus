import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import LucidAlbumView from '../components/LucidAlbumView';
import { PostCardProps } from '../types/structures/posts_structure';
import { useNavigation, useRoute } from '@react-navigation/native';

interface LucidFullscreenParams {
  post: PostCardProps;
  source?: string; // Optional source parameter to know where user came from
}

export default function LucidFullscreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { post, source } = route.params as LucidFullscreenParams;

  const handleBack = () => {
    if (source === 'library') {
      // If coming from library, navigate back to Profile with a parameter to show Library
      (navigation as any).navigate('MainTabs', {
        screen: 'Profile',
        params: { showLibrary: true }
      });
    } else {
      // Default behavior for other sources
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <LucidAlbumView 
        post={post}
        onBack={handleBack}
      />
    </SafeAreaView>
  );
} 
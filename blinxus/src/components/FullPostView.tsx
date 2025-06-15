import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import PostCard from './PostCard';
import LucidPostCard from './LucidPostCard';
import { PostCardProps, mapPostToCardProps } from '../types/structures/posts_structure';
import { usePosts } from '../store/PostsContext';
import { useNavigation } from '@react-navigation/native';

interface FullPostViewProps {
  post: PostCardProps;
  onBack: () => void;
  bottomComponent?: React.ReactElement;
}

const FullPostView: React.FC<FullPostViewProps> = ({ post, onBack, bottomComponent }) => {
  const { posts } = usePosts();
  const navigation = useNavigation();
  
  // Get the latest version of the post from the context
  const latestPost = posts.find(p => p.id === post.id);
  const currentPostProps = latestPost ? mapPostToCardProps(latestPost) : post;

  // Monitor if post still exists - if deleted, automatically exit fullscreen
  useEffect(() => {
    if (!latestPost) {
      // Post was deleted, automatically exit fullscreen
      onBack();
    }
  }, [latestPost, onBack]);

  // If post doesn't exist, don't render anything (component will unmount anyway)
  if (!latestPost) {
    return null;
  }

  // If it's a Lucid post, navigate to dedicated fullscreen instead
  useEffect(() => {
    if (latestPost && latestPost.type === 'lucid') {
      (navigation as any).navigate('LucidFullscreen', {
        post: currentPostProps,
        source: 'fullpost'
      });
      // Go back from current view since we're navigating to new screen
      onBack();
    }
  }, [latestPost, currentPostProps, navigation, onBack]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        bounces={true}
        scrollEventThrottle={32}
        decelerationRate="normal"
        overScrollMode="auto"
        removeClippedSubviews={true}
      >
        {/* Full Post Card - Using latest post data */}
        {currentPostProps.type === 'lucid' ? 
          <LucidPostCard {...currentPostProps} /> : 
          <PostCard {...currentPostProps} />
        }
        
        {/* Bottom Component (Explore header + grid) */}
        {bottomComponent}
      </ScrollView>
      
      {/* Floating Back Button - Clean Minimalist Design */}
      <TouchableOpacity
        onPress={onBack}
        className="absolute top-16 left-6 w-10 h-10 justify-center items-center"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.8)', // Dark semi-transparent
          borderRadius: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 8,
          elevation: 5,
        }}
        activeOpacity={0.7}
      >
        <ChevronLeft size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default FullPostView; 
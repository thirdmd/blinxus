import React, { useRef, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import PostCard from './PostCard';
import LucidPostCard from './LucidPostCard';
import { PostCardProps } from '../types/structures/posts_structure';

interface LibraryFeedViewProps {
  selectedPost: PostCardProps;
  allPosts: PostCardProps[];
  onBack: () => void;
}

const LibraryFeedView: React.FC<LibraryFeedViewProps> = ({ 
  selectedPost, 
  allPosts, 
  onBack 
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Find the index of the selected post in the original array
  const selectedPostIndex = allPosts.findIndex(post => post.id === selectedPost.id);
  
  // Use the original order of posts (don't reorder)
  const postsToShow = allPosts;
  
  // Calculate approximate scroll position based on post index
  useEffect(() => {
    if (scrollViewRef.current && selectedPostIndex >= 0) {
      // Estimate post height (PostCard + spacing)
      // PostCard is roughly 400-500px + 16px spacing
      const estimatedPostHeight = 450;
      const scrollToY = selectedPostIndex * estimatedPostHeight;
      
      // Small delay to ensure ScrollView is fully rendered
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          y: scrollToY,
          animated: false, // No animation for initial positioning
        });
      }, 100);
    }
  }, [selectedPostIndex]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView 
        ref={scrollViewRef}
        className="flex-1"
        showsVerticalScrollIndicator={false}
        bounces={true}
        scrollEventThrottle={32}
        decelerationRate="normal"
        overScrollMode="auto"
        removeClippedSubviews={true}
      >
        {/* Render all posts in original order */}
        {postsToShow.map((post, index) => (
          <View key={`${post.id}-${index}`}>
            {post.type === 'lucid' ? 
              <LucidPostCard {...post} /> : 
              <PostCard {...post} />
            }
            {/* Add spacing between posts except for the last one */}
            {index < postsToShow.length - 1 && (
              <View className="h-4 bg-gray-50" />
            )}
          </View>
        ))}
      </ScrollView>
      
      {/* Floating Back Button */}
      <TouchableOpacity
        onPress={onBack}
        className="absolute top-16 left-6 w-10 h-10 justify-center items-center"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
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

export default LibraryFeedView; 
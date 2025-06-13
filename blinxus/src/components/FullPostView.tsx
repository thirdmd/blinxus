import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import PostCard from './PostCard';
import { PostCardProps } from '../types/structures/posts_structure';

interface FullPostViewProps {
  post: PostCardProps;
  onBack: () => void;
  bottomComponent?: React.ReactElement;
}

const FullPostView: React.FC<FullPostViewProps> = ({ post, onBack, bottomComponent }) => {
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
        {/* Full Post Card */}
        <PostCard {...post} />
        
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
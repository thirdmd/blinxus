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
        bounces={false}
      >
        {/* Full Post Card */}
        <PostCard {...post} />
        
        {/* Bottom Component (Explore header + grid) */}
        {bottomComponent}
      </ScrollView>
      
      {/* Floating Back Button - Liquid Glass Effect */}
      <TouchableOpacity
        onPress={onBack}
        className="absolute top-12 left-4 w-12 h-12 justify-center items-center"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.85)', // Semi-transparent white
          borderRadius: 24,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 5,
        }}
        activeOpacity={0.8}
      >
        <ChevronLeft size={24} color="#1F2937" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default FullPostView; 
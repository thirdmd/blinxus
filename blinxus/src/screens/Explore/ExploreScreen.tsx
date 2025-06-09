import React from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import { activityTags } from '../../constants/activityTags';
import PillTag from '../../components/PillTag';
import { useNavigation } from '@react-navigation/native';
import { usePosts } from '../../store/PostsContext';
import { mapPostToCardProps } from '../../types/structures/posts_structure';
import PostCard from '../../components/PostCard';

export default function ExploreScreen() {
  const navigation = useNavigation();
  const { posts } = usePosts();

  const cardPropsArray = posts.map(post => mapPostToCardProps(post));
  
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white border-b border-gray-200 py-3 px-4 flex items-center justify-center shadow-sm">
        <Text className="text-2xl font-bold text-gray-800">Blinxus</Text>
      </View>

      {/* Activity Tags Section */}
      <View className="bg-white p-4 border-b border-gray-200">
        <Text className="text-lg font-medium text-gray-900 mb-3">
          What are you looking for?
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row">
            {activityTags.map((tag, index) => (
              <View key={tag.id} className="mr-2">
                <PillTag
                  label={tag.name}
                  color={tag.color}
                  onPress={() => console.log(`Tapped ${tag.name}`)}
                  alwaysFullColor={true}
                />
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
      
      {/* Posts Feed */}
      <FlatList
        data={cardPropsArray}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PostCard {...item} />}
        className="flex-1"
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Action Button - Fixed position to bottom right corner */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 w-16 h-16 rounded-full bg-blue-600 justify-center items-center shadow-lg"
        style={{
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
        }}
        onPress={() => navigation.navigate('CreatePost' as never)}
      >
        <Text className="text-white text-2xl font-bold">+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
} 
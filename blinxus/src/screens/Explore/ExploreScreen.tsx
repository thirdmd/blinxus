import React from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { activityTags } from '../../constants/activityTags';
import PillTag from '../../components/PillTag';
import { useNavigation } from '@react-navigation/native';

export default function ExploreScreen() {
  const navigation = useNavigation();
  
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="p-4 border-b border-gray-200">
          <Text className="text-2xl font-semibold text-gray-900">
            Explore
          </Text>
        </View>

        {/* Activity Tags Section */}
        <View className="p-4">
          <Text className="text-lg font-medium text-gray-900 mb-3">
            What are you looking for?
          </Text>
          <View className="flex-row flex-wrap">
            {activityTags.map((tag, index) => (
              <View key={tag.id} className="mr-2 mb-2">
                <PillTag
                  label={tag.name}
                  color={tag.color}
                  onPress={() => console.log(`Tapped ${tag.name}`)}
                  alwaysFullColor={true}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Placeholder content */}
        <View className="p-4">
          <Text className="text-base text-gray-600">
            Discover amazing places and connect with fellow travelers...
          </Text>
        </View>
      </ScrollView>

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
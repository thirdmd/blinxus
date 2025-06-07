import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { colors, activityTags } from '../../constants';
import type { ActivityTag } from '../../constants/activityTags';
import PillTag from '../../components/PillTag';
import Button from '../../components/Button';

interface CreateRegularPostProps {
  navigation: {
    goBack: () => void;
  };
}

export default function CreateRegularPost({ navigation }: CreateRegularPostProps) {
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedActivity, setSelectedActivity] = useState<number | null>(null);
  const [postText, setPostText] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleLocationPress = () => {
    // TODO: Open location picker modal
    console.log('Open location picker');
  };

  const handleImagePicker = () => {
    // TODO: Open image picker
    console.log('Open image picker');
  };

  const handleActivitySelect = (activityId: number) => {
    setSelectedActivity(activityId === selectedActivity ? null : activityId);
  };

  const handlePost = () => {
    if (!selectedLocation || !selectedActivity) {
      alert('Please select both location and activity');
      return;
    }
    
    // TODO: Implement post creation logic
    console.log('Creating post...', {
      location: selectedLocation,
      activity: selectedActivity,
      text: postText,
      image: selectedImage,
    });
    
    navigation.goBack();
  };

  return (
    <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
      {/* What's on your mind - Combined text and photo */}
      <View className="mb-8">
        <Text className="text-lg font-semibold text-gray-900 mb-4">
          What's on your mind?
        </Text>
        
        <View 
          className="bg-gray-50 rounded-3xl p-5"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.03,
            shadowRadius: 8,
            elevation: 1,
          }}
        >
          {/* Text Input */}
          <TextInput
            value={postText}
            onChangeText={setPostText}
            placeholder="Share your experience, thoughts, or memories..."
            multiline
            numberOfLines={4}
            className="text-base text-gray-900 leading-6 mb-4"
            style={{
              height: 100,
              textAlignVertical: 'top',
            }}
            placeholderTextColor={colors.mediumGray}
          />
          
          {/* Photo Section */}
          {selectedImage ? (
            <View className="relative">
              <Image
                source={{ uri: selectedImage }}
                className="w-full rounded-2xl"
                style={{ height: 160 }}
                resizeMode="cover"
              />
              <TouchableOpacity
                onPress={() => setSelectedImage(null)}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black bg-opacity-50 items-center justify-center"
              >
                <Text className="text-white text-lg">×</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={handleImagePicker}
              className="flex-row items-center p-4 bg-white rounded-2xl"
              activeOpacity={0.7}
            >
              <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mr-3">
                <Text className="text-gray-400 text-lg">📷</Text>
              </View>
              <Text className="text-gray-500 text-base flex-1">Add a photo</Text>
              <Text className="text-gray-400 text-sm">Optional</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Location Selection */}
      <View className="mb-8">
        <Text className="text-lg font-semibold text-gray-900 mb-4">
          Where are you posting about?
        </Text>
        <TouchableOpacity
          onPress={handleLocationPress}
          className="flex-row items-center p-5 bg-gray-50 rounded-3xl"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.03,
            shadowRadius: 8,
            elevation: 1,
          }}
          activeOpacity={0.7}
        >
          <View className="w-10 h-10 rounded-full bg-white items-center justify-center mr-4">
            <Text className="text-gray-400 text-lg">📍</Text>
          </View>
          <Text className="text-base text-gray-500 flex-1">
            {selectedLocation || 'Choose your destination'}
          </Text>
          <View className="w-8 h-8 rounded-full bg-white items-center justify-center">
            <Text className="text-gray-400 text-sm">›</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Activity Selection */}
      <View className="mb-10">
        <Text className="text-lg font-semibold text-gray-900 mb-4">
          What type of experience?
        </Text>
        <View className="bg-gray-50 p-4 rounded-3xl">
          <View className="flex-row flex-wrap gap-3">
            {activityTags.map((tag: ActivityTag) => (
              <PillTag
                key={tag.id}
                label={tag.name}
                color={tag.color}
                selected={selectedActivity === tag.id}
                onPress={() => handleActivitySelect(tag.id)}
                size="medium"
                isCreatePage={true}
              />
            ))}
          </View>
        </View>
      </View>

      {/* Share Button */}
      <View className="pb-12">
        <Button
          title="Share Your Story"
          onPress={handlePost}
          disabled={!selectedLocation || !selectedActivity}
          size="large"
          variant="primary"
        />
        
        {/* Helpful hint when disabled */}
        {(!selectedLocation || !selectedActivity) && (
          <Text className="text-center text-gray-400 text-sm mt-3">
            Please select a location and activity type to continue
          </Text>
        )}
      </View>
    </ScrollView>
  );
} 
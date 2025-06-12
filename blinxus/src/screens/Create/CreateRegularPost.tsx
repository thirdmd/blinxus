import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { colors } from '../../constants';
import { activityTags, activityNames, ActivityKey } from '../../constants/activityTags';
import type { ActivityTag } from '../../constants/activityTags';
import PillTag from '../../components/PillTag';
import Button from '../../components/Button';
import { usePosts } from '../../store/PostsContext';

interface CreateRegularPostProps {
  navigation: {
    goBack: () => void;
  };
  onValidationChange: (isValid: boolean) => void;
}

const CreateRegularPost = forwardRef(({ navigation, onValidationChange }: CreateRegularPostProps, ref) => {
  const { addPost } = usePosts();
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedActivity, setSelectedActivity] = useState<number | null>(null);
  const [postText, setPostText] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleLocationPress = () => {
    // Simple prompt for location input - can be enhanced later
    Alert.prompt(
      'Add Location',
      'Where are you posting about?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Add', 
          onPress: (location) => {
            if (location && location.trim()) {
              setSelectedLocation(location.trim());
            }
          }
        }
      ],
      'plain-text',
      selectedLocation
    );
  };

  const handleImagePicker = () => {
    // For demo purposes, add a sample image URL
    if (!selectedImage) {
      setSelectedImage(`https://picsum.photos/400/600?random=${Date.now()}`);
    } else {
      setSelectedImage(null);
    }
  };

  const handleActivitySelect = (activityId: number) => {
    setSelectedActivity(activityId === selectedActivity ? null : activityId);
  };

  useImperativeHandle(ref, () => ({
    handleSubmit: handlePost
  }), [selectedLocation, postText, selectedImage, selectedActivity]);

  useEffect(() => {
    const isValid = selectedLocation.trim() && (postText.trim() || selectedImage);
    onValidationChange(!!isValid);
  }, [selectedLocation, postText, selectedImage]);

  const handlePost = () => {
    if (!selectedLocation.trim() || (!postText.trim() && !selectedImage)) {
      return;
    }
    
    try {
      // Convert activity ID to ActivityKey for post creation
      let activityKey: ActivityKey | undefined = undefined;
      if (selectedActivity) {
        const activityTag = activityTags.find(tag => tag.id === selectedActivity);
        if (activityTag) {
          const activityKeyMap: { [key: string]: ActivityKey } = {
            'Aquatics': 'aquatics',
            'Outdoors': 'outdoors', 
            'City': 'city',
            'Food': 'food',
            'Stays': 'stays',
            'Heritage': 'heritage',
            'Wellness': 'wellness',
            'Amusements': 'amusements',
            'Cultural': 'cultural',
            'Special Experiences': 'special',
            'Thrill': 'thrill',
          };
          activityKey = activityKeyMap[activityTag.name];
        }
      }

      addPost({
        authorId: 'current_user', // Replace with actual user ID later
        authorName: 'Third Camacho', // Current user name
        type: 'regular',
        content: postText.trim() || undefined,
        images: selectedImage ? [selectedImage] : undefined,
        location: selectedLocation.trim(),
        activity: activityKey,
    });
    
      navigation.goBack();
    } catch (error) {
      console.log('Error creating post:', error);
    }
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

    </ScrollView>
  );
});

export default CreateRegularPost; 

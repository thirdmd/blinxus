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
import { MapPin, Camera, Plus, X, ChevronRight, Navigation } from 'lucide-react-native';
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
    Alert.prompt(
      'Location',
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
        authorId: 'current_user',
        authorName: 'Third Camacho',
        authorNationalityFlag: '🇵🇭',
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
      {/* Location */}
      <View className="mb-6">
        <TouchableOpacity
          onPress={handleLocationPress}
          className={`bg-gray-50 rounded-2xl p-4 flex-row items-center ${
            selectedLocation ? 'border-2 border-black' : ''
          }`}
          activeOpacity={0.3}
        >
          <Navigation 
            size={16} 
            color={selectedLocation ? '#000000' : '#6B7280'} 
            strokeWidth={1.5} 
          />
          <Text className={`ml-3 flex-1 text-base ${
            selectedLocation ? 'text-black font-normal' : 'text-gray-500 font-light'
          }`}>
            {selectedLocation || 'Add location'}
          </Text>
          <ChevronRight size={20} color="#6B7280" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      {/* Text Input */}
      <View className="mb-6">
        <View className="bg-gray-50 rounded-2xl p-4">
          <TextInput
            value={postText}
            onChangeText={setPostText}
            placeholder="What's on your mind?"
            multiline
            numberOfLines={4}
            className="text-base text-black font-light"
            style={{
              height: 100,
              textAlignVertical: 'top',
            }}
            placeholderTextColor="#6B7280"
          />
        </View>
      </View>

      {/* Photo */}
      <View className="mb-6">
        {selectedImage ? (
          <View className="relative">
            <Image
              source={{ uri: selectedImage }}
              className="w-full h-48 rounded-2xl"
              resizeMode="cover"
            />
            <TouchableOpacity
              onPress={() => setSelectedImage(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black bg-opacity-70 items-center justify-center"
              activeOpacity={0.3}
            >
              <X size={16} color="#ffffff" strokeWidth={2} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={handleImagePicker}
            className="h-32 bg-gray-50 rounded-2xl items-center justify-center border-2 border-dashed border-gray-200"
            activeOpacity={0.3}
          >
            <Camera size={24} color="#6B7280" strokeWidth={2} />
            <Text className="text-gray-500 text-sm font-light mt-2">Add photo</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Activity Tags */}
      <View className="mb-8">
        <Text className="text-base font-normal text-black mb-3">Activity</Text>
        <View className="flex-row flex-wrap gap-2">
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
    </ScrollView>
  );
});

export default CreateRegularPost; 

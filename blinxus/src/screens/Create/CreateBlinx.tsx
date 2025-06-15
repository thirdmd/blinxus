import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Navigation, Camera, X, ChevronRight } from 'lucide-react-native';
import { colors, activityTags } from '../../constants';
import type { ActivityTag } from '../../constants/activityTags';
import PillTag from '../../components/PillTag';
import Button from '../../components/Button';

interface CreateBlinxProps {
  navigation: {
    goBack: () => void;
  };
  onValidationChange: (isValid: boolean) => void;
}

const CreateBlinx = forwardRef(({ navigation, onValidationChange }: CreateBlinxProps, ref) => {
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedActivity, setSelectedActivity] = useState<number | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

  const handleLocationPress = () => {
    Alert.prompt(
      'Location',
      'Where are you right now?',
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

  const handleCameraCapture = () => {
    // For demo, add a random image
    if (!capturedPhoto) {
      setCapturedPhoto(`https://picsum.photos/400/400?random=${Date.now()}`);
    }
  };

  const handleActivitySelect = (activityId: number) => {
    setSelectedActivity(activityId === selectedActivity ? null : activityId);
  };

  useImperativeHandle(ref, () => ({
    handleSubmit: handleCreateBlinx
  }), [selectedLocation, selectedActivity, capturedPhoto]);

  useEffect(() => {
    const isValid = selectedLocation && capturedPhoto;
    onValidationChange(!!isValid);
  }, [selectedLocation, capturedPhoto]);

  const handleCreateBlinx = () => {
    if (!selectedLocation || !capturedPhoto) {
      return;
    }
    
    console.log('Creating Blinx...', {
      location: selectedLocation,
      activity: selectedActivity,
      photo: capturedPhoto,
    });
    
    navigation.goBack();
  };

  return (
    <ScrollView className="flex-1 px-6 pt-2" showsVerticalScrollIndicator={false}>
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
            selectedLocation ? 'text-black font-light' : 'text-gray-500 font-light'
          }`}>
            {selectedLocation || 'Current location'}
          </Text>
          <ChevronRight size={20} color="#6B7280" strokeWidth={1.5} />
        </TouchableOpacity>
      </View>

      {/* Photo */}
      <View className="mb-6">
        {capturedPhoto ? (
          <View className="relative">
            <Image
              source={{ uri: capturedPhoto }}
              className="w-full h-48 rounded-2xl"
              resizeMode="cover"
            />
            <TouchableOpacity
              onPress={() => setCapturedPhoto(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black bg-opacity-70 items-center justify-center"
              activeOpacity={0.3}
            >
              <X size={16} color="#ffffff" strokeWidth={2} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={handleCameraCapture}
            className="h-32 bg-gray-50 rounded-2xl items-center justify-center border-2 border-dashed border-gray-200"
            activeOpacity={0.3}
          >
            <Camera size={24} color="#6B7280" strokeWidth={2} />
            <Text className="text-gray-500 text-sm font-light mt-2">Open camera</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Activity Tags */}
      <View className="mb-8">
        <Text className="text-base font-light text-black mb-3">Activity</Text>
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

export default CreateBlinx; 
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
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
    // TODO: Open location picker modal
    console.log('Open location picker');
  };

  const handleCameraCapture = () => {
    // TODO: Open camera for back-camera capture
    console.log('Open camera for Blinx');
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
    
    // TODO: Implement Blinx creation logic
    console.log('Creating Blinx...', {
      location: selectedLocation,
      activity: selectedActivity,
      photo: capturedPhoto,
    });
    
    navigation.goBack();
  };

  return (
    <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
      {/* Info Section - More compact */}
      <View className="mb-6">
        <View 
          className="p-4 bg-blue-50 rounded-3xl"
          style={{
            shadowColor: '#0047AB',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.04,
            shadowRadius: 8,
            elevation: 1,
          }}
        >
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center mr-3">
              <Text className="text-lg">📸</Text>
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-blue-900">
                Blinx Stories
              </Text>
              <Text className="text-sm text-blue-700">
                Real moments, 12-hour stories
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Camera Capture - First and prominent */}
      <View className="mb-8">
        <Text className="text-lg font-semibold text-gray-900 mb-4">
          Capture the moment
        </Text>
        <TouchableOpacity
          onPress={handleCameraCapture}
          className="w-full bg-gray-50 rounded-3xl overflow-hidden"
          style={{
            aspectRatio: 1,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 12,
            elevation: 2,
          }}
          activeOpacity={0.8}
        >
          {capturedPhoto ? (
            <View className="relative w-full h-full">
              <Image
                source={{ uri: capturedPhoto }}
                className="w-full h-full"
                resizeMode="cover"
              />
              <TouchableOpacity
                onPress={() => setCapturedPhoto(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black bg-opacity-50 items-center justify-center"
              >
                <Text className="text-white text-lg">×</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="flex-1 items-center justify-center">
              <View className="w-16 h-16 rounded-full bg-white items-center justify-center mb-3">
                <Text className="text-gray-400 text-3xl">📷</Text>
              </View>
              <Text className="text-gray-600 text-base font-semibold mb-1">
                Tap to capture
              </Text>
              <Text className="text-gray-400 text-sm">
                Back camera only
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Location Selection */}
      <View className="mb-8">
        <Text className="text-lg font-semibold text-gray-900 mb-4">
          Where are you right now?
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
            {selectedLocation || 'Choose your current location'}
          </Text>
          <View className="w-8 h-8 rounded-full bg-white items-center justify-center">
            <Text className="text-gray-400 text-sm">›</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Activity Selection */}
      <View className="mb-10">
        <Text className="text-lg font-semibold text-gray-900 mb-4">
          What are you doing?
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

export default CreateBlinx; 
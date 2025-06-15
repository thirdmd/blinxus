import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Navigation, ChevronRight, Calendar, Plus } from 'lucide-react-native';
import { colors, activityTags } from '../../constants';
import type { ActivityTag } from '../../constants/activityTags';
import PillTag from '../../components/PillTag';
import Button from '../../components/Button';

interface CreateLucidsProps {
  navigation: {
    goBack: () => void;
  };
  onValidationChange: (isValid: boolean) => void;
}

const CreateLucids = forwardRef(({ navigation, onValidationChange }: CreateLucidsProps, ref) => {
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedActivity, setSelectedActivity] = useState<number | null>(null);
  const [tripTitle, setTripTitle] = useState<string>('');
  const [duration, setDuration] = useState<number>(3);

  const handleLocationPress = () => {
    Alert.prompt(
      'Location',
      'Where did you go?',
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

  const handleActivitySelect = (activityId: number) => {
    setSelectedActivity(activityId === selectedActivity ? null : activityId);
  };

  useImperativeHandle(ref, () => ({
    handleSubmit: handleCreateLucid
  }), [selectedLocation, selectedActivity, tripTitle, duration]);

  useEffect(() => {
    const isValid = selectedLocation && tripTitle;
    onValidationChange(!!isValid);
  }, [selectedLocation, tripTitle]);

  const handleCreateLucid = () => {
    if (!selectedLocation || !tripTitle) {
      return;
    }
    
    console.log('Creating Lucids...', {
      title: tripTitle,
      location: selectedLocation,
      activity: selectedActivity,
      duration,
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
            {selectedLocation || 'Destination'}
          </Text>
          <ChevronRight size={20} color="#6B7280" strokeWidth={1.5} />
        </TouchableOpacity>
      </View>

      {/* Trip Title */}
      <View className="mb-6">
        <View className="bg-gray-50 rounded-2xl p-4">
          <TextInput
            value={tripTitle}
            onChangeText={setTripTitle}
            placeholder="Trip title"
            className="text-base text-black font-light"
            placeholderTextColor="#6B7280"
          />
        </View>
      </View>

      {/* Duration */}
      <View className="mb-6">
        <Text className="text-base font-light text-black mb-3">Duration</Text>
        <View className="flex-row flex-wrap gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((day) => (
            <TouchableOpacity
              key={day}
              onPress={() => setDuration(day)}
              className={`px-4 py-2 rounded-full ${
                duration === day ? 'bg-black' : 'bg-gray-100'
              }`}
              activeOpacity={0.3}
            >
              <Text
                className={`text-sm font-light ${
                  duration === day ? 'text-white' : 'text-gray-600'
                }`}
              >
                {day}d
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Activity Tags */}
      <View className="mb-6">
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

      {/* Days Preview */}
      <View className="mb-8">
        <Text className="text-base font-light text-black mb-3">Days</Text>
        <View className="space-y-2">
          {Array.from({ length: duration }, (_, i) => (
            <View key={i} className="bg-gray-50 rounded-2xl p-4 flex-row items-center justify-between">
              <Text className="text-black font-light">Day {i + 1}</Text>
              <TouchableOpacity 
                className="bg-gray-200 rounded-full p-1"
                activeOpacity={0.3}
              >
                <Plus size={16} color="#6B7280" strokeWidth={1.5} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
});

export default CreateLucids; 
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
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
  const [tripMode, setTripMode] = useState<'Days' | 'Date Range'>('Days');

  const handleLocationPress = () => {
    // TODO: Open location picker modal
    console.log('Open location picker');
  };

  const handleActivitySelect = (activityId: number) => {
    setSelectedActivity(activityId === selectedActivity ? null : activityId);
  };

  useImperativeHandle(ref, () => ({
    handleSubmit: handleCreateLucid
  }), [selectedLocation, selectedActivity, tripTitle, duration, tripMode]);

  useEffect(() => {
    const isValid = selectedLocation && tripTitle;
    onValidationChange(!!isValid);
  }, [selectedLocation, tripTitle]);

  const handleCreateLucid = () => {
    if (!selectedLocation || !tripTitle) {
      return;
    }
    
    // TODO: Implement Lucids creation logic
    console.log('Creating Lucids...', {
      title: tripTitle,
      location: selectedLocation,
      activity: selectedActivity,
      duration,
      mode: tripMode,
    });
    
    navigation.goBack();
  };

  const renderDayCards = () => {
    const days = [];
    for (let i = 1; i <= duration; i++) {
      days.push(
        <View key={i} className="mb-3">
          <TouchableOpacity 
            className="flex-row items-center justify-between p-4 bg-gray-50 rounded-2xl"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.02,
              shadowRadius: 4,
              elevation: 1,
            }}
            activeOpacity={0.7}
          >
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-white items-center justify-center mr-3">
                <Text className="text-gray-600 font-semibold text-xs">{i}</Text>
              </View>
              <Text className="text-sm font-medium text-gray-900">
                Day {i}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-sm text-gray-500 mr-2">Add photos</Text>
              <Text className="text-gray-400 text-sm">›</Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    }
    return days;
  };

  return (
    <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
      {/* Trip Title - First */}
      <View className="mb-8">
        <Text className="text-lg font-semibold text-gray-900 mb-4">
          Name your adventure
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
          <TextInput
            value={tripTitle}
            onChangeText={setTripTitle}
            placeholder="My amazing trip to..."
            className="text-base text-gray-900"
            placeholderTextColor={colors.mediumGray}
          />
        </View>
      </View>

      {/* Location Selection */}
      <View className="mb-8">
        <Text className="text-lg font-semibold text-gray-900 mb-4">
          Where did you go?
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
      <View className="mb-8">
        <Text className="text-lg font-semibold text-gray-900 mb-4">
          Main activity type
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

      {/* Duration Section - Simplified */}
      <View className="mb-8">
        <Text className="text-lg font-semibold text-gray-900 mb-4">
          How long was your trip?
        </Text>
        
        {/* Duration Mode Selector - Compact */}
        <View className="flex-row mb-4 bg-gray-50 p-1 rounded-full">
          <TouchableOpacity
            onPress={() => setTripMode('Days')}
            className={`flex-1 px-4 py-3 rounded-full ${
              tripMode === 'Days' ? 'bg-gray-900' : 'bg-transparent'
            }`}
            activeOpacity={0.7}
          >
            <Text
              className={`font-medium text-sm text-center ${
                tripMode === 'Days' ? 'text-white' : 'text-gray-500'
              }`}
            >
              Days
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => setTripMode('Date Range')}
            className={`flex-1 px-4 py-3 rounded-full ${
              tripMode === 'Date Range' ? 'bg-gray-900' : 'bg-transparent'
            }`}
            activeOpacity={0.7}
          >
            <Text
              className={`font-medium text-sm text-center ${
                tripMode === 'Date Range' ? 'text-white' : 'text-gray-500'
              }`}
            >
              Date Range
            </Text>
          </TouchableOpacity>
        </View>

        {/* Duration Selector - Compact */}
        {tripMode === 'Days' && (
          <View className="mb-4">
            <View className="items-center mb-4">
              <View className="bg-blue-600 px-4 py-2 rounded-full">
                <Text className="text-white font-semibold text-base">
                  {duration} {duration === 1 ? 'day' : 'days'}
                </Text>
              </View>
            </View>
            
            <View className="bg-gray-50 p-4 rounded-3xl">
              <View className="flex-row flex-wrap justify-center gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((day) => (
                  <TouchableOpacity
                    key={day}
                    onPress={() => setDuration(day)}
                    className={`w-10 h-10 rounded-full items-center justify-center ${
                      duration === day ? 'bg-blue-600' : 'bg-white'
                    }`}
                    style={{
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.05,
                      shadowRadius: 2,
                      elevation: 1,
                    }}
                    activeOpacity={0.7}
                  >
                    <Text
                      className={`text-xs font-semibold ${
                        duration === day ? 'text-white' : 'text-gray-600'
                      }`}
                    >
                      {day}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text className="text-center text-gray-500 text-xs mt-3">
                Tap to select number of days
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Photos Section - Compact */}
      {tripMode === 'Days' && (
        <View className="mb-10">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Add photos by day
          </Text>
          {renderDayCards()}
        </View>
              )}

    </ScrollView>
  );
});

export default CreateLucids; 
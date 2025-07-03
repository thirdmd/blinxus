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
import { Camera, Plus, X, ChevronRight, Navigation } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { activityTags, activityNames, ActivityKey } from '../../constants/activityTags';
import type { ActivityTag } from '../../constants/activityTags';
import PillTag from '../../components/PillTag';
import Button from '../../components/Button';
import { usePosts } from '../../store/PostsContext';
import { useThemeColors } from '../../hooks/useThemeColors';
import { getResponsiveDimensions, getTextStyles, rs } from '../../utils/responsive';

interface CreateRegularPostProps {
  navigation: {
    goBack: () => void;
  };
  onValidationChange: (isValid: boolean) => void;
}

const CreateRegularPost = forwardRef(({ navigation, onValidationChange }: CreateRegularPostProps, ref) => {
  const { addPost } = usePosts();
  const themeColors = useThemeColors();
  const responsiveDimensions = getResponsiveDimensions();
  const textStyles = getTextStyles();
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedActivity, setSelectedActivity] = useState<number | null>(null);
  const [postText, setPostText] = useState<string>('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

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
    if (selectedImages.length === 0) {
      Alert.alert(
        'Upload Images',
        'How many images would you like to upload?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: '1 Image', onPress: () => addImages(1) },
          { text: '2 Images', onPress: () => addImages(2) },
          { text: '3 Images', onPress: () => addImages(3) },
          { text: '4 Images', onPress: () => addImages(4) },
          { text: '5 Images', onPress: () => addImages(5) },
        ]
      );
    }
  };

  const addImages = (count: number) => {
    const { travelImages } = require('../../constants/mockImages');
    const newImages: string[] = [];
    for (let i = 0; i < count; i++) {
      newImages.push(travelImages[i % travelImages.length]);
    }
    setSelectedImages(newImages);
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleActivitySelect = (activityId: number) => {
    setSelectedActivity(activityId === selectedActivity ? null : activityId);
  };

  useImperativeHandle(ref, () => ({
    handleSubmit: handleCreatePost
  }), [selectedLocation, selectedActivity, postText, selectedImages]);

  useEffect(() => {
    const hasRequiredFields = selectedLocation.trim() !== '' && selectedImages.length > 0;
    onValidationChange(hasRequiredFields);
  }, [selectedLocation, selectedImages, onValidationChange]);

  const handleCreatePost = () => {
    if (!selectedLocation.trim() || selectedImages.length === 0) {
      return;
    }
    
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
        images: selectedImages,
        location: selectedLocation.trim(),
        activity: activityKey,
    });
    
      navigation.goBack();
  };

  return (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
      {/* Location */}
      <View style={{ paddingHorizontal: 20, paddingTop: 24, marginBottom: 20 }}>
        <TouchableOpacity
          onPress={handleLocationPress}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 12,
            paddingVertical: 10,
            borderRadius: 8,
            backgroundColor: themeColors.isDark 
              ? 'rgba(45, 45, 45, 1)' 
              : 'rgba(240, 240, 240, 1)',
            height: 44,
          }}
          activeOpacity={0.8}
        >
          <Text style={{ fontSize: 16, color: themeColors.textSecondary, marginRight: 10 }}>📍</Text>
          <Text style={{
            fontSize: 15,
            color: selectedLocation ? themeColors.text : themeColors.textSecondary,
            flex: 1,
            fontFamily: 'System',
            fontWeight: '400',
          }}>
            {selectedLocation || 'Add location'}
          </Text>
          {selectedLocation && (
            <ChevronRight size={16} color={themeColors.textSecondary} strokeWidth={1.5} />
          )}
        </TouchableOpacity>
      </View>

      {/* Photo */}
      <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
        {selectedImages.length > 0 ? (
          <View>
            {/* Multiple Images Grid */}
            {selectedImages.length === 1 ? (
              // Single image - full width
              <View style={{ position: 'relative' }}>
                <Image
                  source={{ uri: selectedImages[0] }}
                  style={{ 
                    width: '100%', 
                    height: 200, 
                    borderRadius: 12 
                  }}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  onPress={() => removeImage(0)}
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  activeOpacity={0.8}
                >
                  <X size={16} color="white" strokeWidth={2} />
                </TouchableOpacity>
              </View>
            ) : (
              // Multiple images grid layout
              <View>
                {selectedImages.length === 2 ? (
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    {selectedImages.map((image, index) => (
                      <View key={index} style={{ flex: 1, position: 'relative' }}>
                        <Image
                          source={{ uri: image }}
                          style={{ 
                            width: '100%', 
                            height: 150, 
                            borderRadius: 12 
                          }}
                          resizeMode="cover"
                        />
                        <TouchableOpacity
                          onPress={() => removeImage(index)}
                          style={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            width: 28,
                            height: 28,
                            borderRadius: 14,
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          activeOpacity={0.8}
                        >
                          <X size={16} color="white" strokeWidth={2} />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                ) : (
                  // 3+ images: main image on left, grid on right
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    {/* Main image */}
                    <View style={{ flex: 1, position: 'relative' }}>
                      <Image
                        source={{ uri: selectedImages[0] }}
                        style={{ 
                          width: '100%', 
                          height: 160, 
                          borderRadius: 12 
                        }}
                        resizeMode="cover"
                      />
                      <TouchableOpacity
                        onPress={() => removeImage(0)}
                        style={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          width: 28,
                          height: 28,
                          borderRadius: 14,
                          backgroundColor: 'rgba(0, 0, 0, 0.7)',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        activeOpacity={0.8}
                      >
                        <X size={16} color="white" strokeWidth={2} />
                      </TouchableOpacity>
                    </View>
                    
                    {/* Secondary images grid */}
                    <View style={{ flex: 1, gap: 8 }}>
                      {selectedImages.slice(1, 3).map((image, index) => (
                        <View key={index + 1} style={{ position: 'relative' }}>
                          <Image
                            source={{ uri: image }}
                            style={{ 
                              width: '100%', 
                              height: 76, 
                              borderRadius: 8 
                            }}
                            resizeMode="cover"
                          />
                          <TouchableOpacity
                            onPress={() => removeImage(index + 1)}
                            style={{
                              position: 'absolute',
                              top: 4,
                              right: 4,
                              width: 20,
                              height: 20,
                              borderRadius: 10,
                              backgroundColor: 'rgba(0, 0, 0, 0.7)',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            activeOpacity={0.8}
                          >
                            <X size={12} color="white" strokeWidth={2} />
                          </TouchableOpacity>
                          
                          {/* Show +N overlay for additional images */}
                          {index === 1 && selectedImages.length > 3 && (
                            <View style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              backgroundColor: 'rgba(0, 0, 0, 0.5)',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: 8
                            }}>
                              <Text style={{
                                color: 'white',
                                fontSize: 16,
                                fontWeight: '600',
                                fontFamily: 'System',
                              }}>
                                +{selectedImages.length - 3}
                              </Text>
                            </View>
                          )}
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            )}
          </View>
        ) : (
          <TouchableOpacity
            onPress={handleImagePicker}
            style={{
              height: 120,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: themeColors.isDark 
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(0, 0, 0, 0.08)',
              borderStyle: 'dashed',
              backgroundColor: themeColors.isDark 
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(0, 0, 0, 0.02)',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            activeOpacity={0.7}
          >
            <Camera size={28} color={themeColors.textSecondary} strokeWidth={1.5} />
            <Text style={{
              marginTop: 8,
              fontSize: 14,
              color: themeColors.textSecondary,
              fontFamily: 'System',
            }}>
              Add photos
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Text Input */}
      <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
        <TextInput
          style={{
            fontSize: 15,
            color: themeColors.text,
            fontFamily: 'System',
            minHeight: 80,
            textAlignVertical: 'top',
            backgroundColor: 'transparent',
          }}
          placeholder="Add a caption..."
          placeholderTextColor={themeColors.textSecondary}
          value={postText}
          onChangeText={setPostText}
          multiline
          maxLength={500}
        />
      </View>

      {/* Activity Selection */}
      <View style={{ paddingHorizontal: 20, marginBottom: 40 }}>
        <Text style={{ 
          fontSize: 16,
          fontWeight: '600',
          color: themeColors.text, 
          marginBottom: 4,
          fontFamily: 'System',
        }}>
          Activity
        </Text>
        <Text style={{
          fontSize: 13,
          color: themeColors.textSecondary,
          marginBottom: 16,
          fontFamily: 'System',
        }}>
          Optional - what did you do?
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
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

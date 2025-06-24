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
    const updatedImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(updatedImages);
  };

  const handleActivitySelect = (activityId: number) => {
    setSelectedActivity(activityId === selectedActivity ? null : activityId);
  };

  useImperativeHandle(ref, () => ({
    handleSubmit: handlePost
  }), [selectedLocation, postText, selectedImages, selectedActivity]);

  useEffect(() => {
    const isValid = selectedLocation.trim() && selectedImages.length > 0;
    onValidationChange(!!isValid);
  }, [selectedLocation, postText, selectedImages]);

  const handlePost = () => {
    if (!selectedLocation.trim() || selectedImages.length === 0) {
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
        images: selectedImages,
        location: selectedLocation.trim(),
        activity: activityKey,
    });
    
      // Close the modal and return to previous screen
      navigation.goBack();
    } catch (error) {
      // Error creating post
    }
  };

  return (
    <ScrollView style={{ flex: 1, paddingHorizontal: 24 }} showsVerticalScrollIndicator={false}>
      {/* Location */}
      <View style={{ marginBottom: 24 }}>
        <TouchableOpacity
          onPress={handleLocationPress}
          style={{
            backgroundColor: themeColors.backgroundSecondary,
            borderRadius: 16,
            padding: 16,
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: selectedLocation ? 2 : 0,
            borderColor: selectedLocation ? themeColors.text : 'transparent'
          }}
          activeOpacity={0.3}
        >
          <Navigation 
            size={16} 
            color={selectedLocation ? themeColors.text : themeColors.textSecondary} 
            strokeWidth={1.5} 
          />
          <Text style={{
            marginLeft: 12,
            flex: 1,
            ...textStyles.inputLabel,
            color: selectedLocation ? themeColors.text : themeColors.textSecondary,
            fontWeight: selectedLocation ? '400' : '300'
          }}>
            {selectedLocation || 'Add location'}
          </Text>
          <ChevronRight size={20} color={themeColors.textSecondary} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      {/* Photo - Now comes before text input */}
      <View style={{ marginBottom: 24 }}>
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
                    height: responsiveDimensions.createPost.singleImage.height, 
                    borderRadius: rs(16) 
                  }}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  onPress={() => removeImage(0)}
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  activeOpacity={0.8}
                >
                  <X size={18} color="white" />
                </TouchableOpacity>
              </View>
            ) : (
              // Multiple images grid layout
              <View>
                {selectedImages.length === 2 ? (
                  <View style={{ flexDirection: 'row', gap: rs(8) }}>
                    {selectedImages.map((image, index) => (
                      <View key={index} style={{ flex: 1, position: 'relative' }}>
                        <Image
                          source={{ uri: image }}
                          style={{ 
                            width: '100%', 
                            height: responsiveDimensions.createPost.doubleImage.height, 
                            borderRadius: rs(16) 
                          }}
                          resizeMode="cover"
                        />
                        <TouchableOpacity
                          onPress={() => removeImage(index)}
                          style={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            width: 32,
                            height: 32,
                            borderRadius: 16,
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          activeOpacity={0.8}
                        >
                          <X size={18} color="white" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                ) : (
                  // 3+ images: main image on left, grid on right
                  <View style={{ flexDirection: 'row', gap: rs(8) }}>
                    {/* Main image */}
                    <View style={{ flex: 1, position: 'relative' }}>
                      <Image
                        source={{ uri: selectedImages[0] }}
                        style={{ 
                          width: '100%', 
                          height: responsiveDimensions.createPost.mainImage.height, 
                          borderRadius: rs(16) 
                        }}
                        resizeMode="cover"
                      />
                      <TouchableOpacity
                        onPress={() => removeImage(0)}
                        style={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          width: 32,
                          height: 32,
                          borderRadius: 16,
                          backgroundColor: 'rgba(0, 0, 0, 0.7)',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        activeOpacity={0.8}
                      >
                        <X size={18} color="white" />
                      </TouchableOpacity>
                    </View>
                    
                    {/* Secondary images grid */}
                    <View style={{ flex: 1, gap: rs(8) }}>
                      {selectedImages.slice(1, 3).map((image, index) => (
                        <View key={index + 1} style={{ position: 'relative' }}>
                          <Image
                            source={{ uri: image }}
                            style={{ 
                              width: '100%', 
                              height: responsiveDimensions.createPost.secondaryImage.height, 
                              borderRadius: rs(12) 
                            }}
                            resizeMode="cover"
                          />
                          <TouchableOpacity
                            onPress={() => removeImage(index + 1)}
                            style={{
                              position: 'absolute',
                              top: 6,
                              right: 6,
                              width: 24,
                              height: 24,
                              borderRadius: 12,
                              backgroundColor: 'rgba(0, 0, 0, 0.7)',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            activeOpacity={0.8}
                          >
                            <X size={14} color="white" />
                          </TouchableOpacity>
                          
                          {/* Show +N overlay for additional images */}
                          {index === 1 && selectedImages.length > 3 && (
                            <View style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              backgroundColor: 'rgba(0, 0, 0, 0.6)',
                              borderRadius: rs(12),
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <Text style={{
                                color: 'white',
                                ...textStyles.userName,
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
          // Empty state - add photos
          <TouchableOpacity
            onPress={handleImagePicker}
            style={{
              height: responsiveDimensions.createPost.placeholder.height,
              backgroundColor: themeColors.backgroundSecondary,
              borderRadius: rs(16),
              borderWidth: 2,
              borderColor: themeColors.border,
              borderStyle: 'dashed',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            activeOpacity={0.7}
          >
            <Camera size={32} color={themeColors.textSecondary} strokeWidth={1.5} />
            <Text style={{
              marginTop: 12,
              ...textStyles.inputLabel,
              color: themeColors.textSecondary,
            }}>
              Add photos
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Text Input */}
      <View style={{ marginBottom: 24 }}>
        <TextInput
          style={{
            backgroundColor: themeColors.backgroundSecondary,
            borderRadius: 16,
            padding: 16,
            ...textStyles.inputLabel,
            color: themeColors.text,
            minHeight: 100,
            textAlignVertical: 'top'
          }}
          placeholder="Share your experience..."
          placeholderTextColor={themeColors.textSecondary}
          value={postText}
          onChangeText={setPostText}
          multiline
          maxLength={500}
        />
      </View>

      {/* Activity Selection */}
      <View style={{ marginBottom: 32 }}>
        <Text style={{ 
          ...textStyles.createLabel,
          color: themeColors.text, 
          marginBottom: 12 
        }}>
          Activity
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                     <View style={{ flexDirection: 'row', gap: 8, paddingRight: 24 }}>
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
        </ScrollView>
      </View>
    </ScrollView>
  );
});

export default CreateRegularPost; 

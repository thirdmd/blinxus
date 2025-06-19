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
import { colors } from '../../constants';
import { activityTags, activityNames, ActivityKey } from '../../constants/activityTags';
import type { ActivityTag } from '../../constants/activityTags';
import PillTag from '../../components/PillTag';
import Button from '../../components/Button';
import { usePosts } from '../../store/PostsContext';
import { useThemeColors } from '../../hooks/useThemeColors';

interface CreateRegularPostProps {
  navigation: {
    goBack: () => void;
  };
  onValidationChange: (isValid: boolean) => void;
}

const CreateRegularPost = forwardRef(({ navigation, onValidationChange }: CreateRegularPostProps, ref) => {
  const { addPost } = usePosts();
  const themeColors = useThemeColors();
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
    const newImages: string[] = [];
    for (let i = 0; i < count; i++) {
      newImages.push(`https://picsum.photos/800/600?random=${Date.now() + i}`);
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
    
      // Navigate to Home tab to show the new post, this will automatically close the Create screen
      (navigation as any).navigate('Home');
    } catch (error) {
      console.log('Error creating post:', error);
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
            fontSize: 16,
            color: selectedLocation ? themeColors.text : themeColors.textSecondary,
            fontWeight: selectedLocation ? 'normal' : '300'
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
                  style={{ width: '100%', height: 192, borderRadius: 16 }}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  onPress={() => removeImage(0)}
                  style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  activeOpacity={0.3}
                >
                  <X size={16} color="#ffffff" strokeWidth={2} />
                </TouchableOpacity>
              </View>
            ) : selectedImages.length === 2 ? (
              // Two images - side by side
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {selectedImages.map((image, index) => (
                  <View key={index} style={{ flex: 1, position: 'relative' }}>
                    <Image
                      source={{ uri: image }}
                      style={{ width: '100%', height: 192, borderRadius: 16 }}
                      resizeMode="cover"
                    />
                    <TouchableOpacity
                      onPress={() => removeImage(index)}
                      style={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      activeOpacity={0.3}
                    >
                      <X size={12} color="#ffffff" strokeWidth={2} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ) : (
              // Three or more images - grid layout
              <View>
                {/* First row - main image */}
                <View style={{ position: 'relative', marginBottom: 8 }}>
                  <Image
                    source={{ uri: selectedImages[0] }}
                    style={{ width: '100%', height: 160, borderRadius: 16 }}
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    onPress={() => removeImage(0)}
                    style={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    activeOpacity={0.3}
                  >
                    <X size={12} color="#ffffff" strokeWidth={2} />
                  </TouchableOpacity>
                </View>
                
                {/* Second row - remaining images */}
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {selectedImages.slice(1).map((image, index) => (
                    <View key={index + 1} style={{ flex: 1, position: 'relative' }}>
                      <Image
                        source={{ uri: image }}
                        style={{ width: '100%', height: 96, borderRadius: 12 }}
                        resizeMode="cover"
                      />
                      <TouchableOpacity
                        onPress={() => removeImage(index + 1)}
                        style={{
                          position: 'absolute',
                          top: 6,
                          right: 6,
                          width: 20,
                          height: 20,
                          borderRadius: 10,
                          backgroundColor: 'rgba(0, 0, 0, 0.7)',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        activeOpacity={0.3}
                      >
                        <X size={10} color="#ffffff" strokeWidth={2} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            )}
            
            {/* Image count indicator */}
            {selectedImages.length > 1 && (
              <View style={{
                position: 'absolute',
                bottom: 12,
                left: 12,
                paddingHorizontal: 8,
                paddingVertical: 4,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                borderRadius: 12
              }}>
                <Text style={{ color: '#ffffff', fontSize: 12, fontWeight: '500' }}>
                  {selectedImages.length} photos
                </Text>
              </View>
            )}
            
            {/* Clear all button */}
            <TouchableOpacity
              onPress={() => setSelectedImages([])}
              style={{
                marginTop: 12,
                alignSelf: 'center',
                paddingHorizontal: 16,
                paddingVertical: 8,
                backgroundColor: themeColors.backgroundSecondary,
                borderRadius: 20
              }}
              activeOpacity={0.3}
            >
              <Text style={{ color: themeColors.textSecondary, fontSize: 14, fontWeight: '300' }}>
                Clear all photos
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={handleImagePicker}
            style={{
              height: 128,
              backgroundColor: themeColors.backgroundSecondary,
              borderRadius: 16,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 2,
              borderStyle: 'dashed',
              borderColor: themeColors.border
            }}
            activeOpacity={0.3}
          >
            <Camera size={24} color={themeColors.textSecondary} strokeWidth={2} />
            <Text style={{ color: themeColors.textSecondary, fontSize: 14, fontWeight: '300', marginTop: 8 }}>Add photo</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Text Input - Now comes after photo */}
      <View style={{ marginBottom: 24 }}>
        <View style={{ backgroundColor: themeColors.backgroundSecondary, borderRadius: 16, padding: 16 }}>
          <TextInput
            value={postText}
            onChangeText={setPostText}
            placeholder="What's on your mind?"
            multiline
            numberOfLines={4}
            style={{
              fontSize: 16,
              color: themeColors.text,
              fontWeight: '300',
              height: 100,
              textAlignVertical: 'top',
            }}
            placeholderTextColor={themeColors.textSecondary}
          />
        </View>
      </View>

      {/* Activity Tags */}
      <View style={{ marginBottom: 32 }}>
        <Text style={{ fontSize: 16, fontWeight: 'normal', color: themeColors.text, marginBottom: 12 }}>Activity</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
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

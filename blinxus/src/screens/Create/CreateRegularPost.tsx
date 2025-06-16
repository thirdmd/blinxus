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

      {/* Text Input */}
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

      {/* Photo */}
      <View style={{ marginBottom: 24 }}>
        {selectedImage ? (
          <View style={{ position: 'relative' }}>
            <Image
              source={{ uri: selectedImage }}
              style={{ width: '100%', height: 192, borderRadius: 16 }}
              resizeMode="cover"
            />
            <TouchableOpacity
              onPress={() => setSelectedImage(null)}
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

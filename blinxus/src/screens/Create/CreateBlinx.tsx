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

interface CreateBlinxProps {
  navigation: {
    goBack: () => void;
  };
  onValidationChange: (isValid: boolean) => void;
}

const CreateBlinx = forwardRef(({ navigation, onValidationChange }: CreateBlinxProps, ref) => {
  const themeColors = useThemeColors();
  const responsiveDimensions = getResponsiveDimensions();
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedActivity, setSelectedActivity] = useState<number | null>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

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

  const handleImagePicker = () => {
    const { getRandomTravelImage } = require('../../constants/mockImages');
    setSelectedImages([getRandomTravelImage()]);
  };

  const handleActivitySelect = (activityId: number) => {
    setSelectedActivity(activityId === selectedActivity ? null : activityId);
  };

  useImperativeHandle(ref, () => ({
    handleSubmit: handleCreateBlinx
  }), [selectedLocation, selectedActivity, selectedImages]);

  useEffect(() => {
    const isValid = selectedLocation && selectedImages.length > 0;
    onValidationChange(!!isValid);
  }, [selectedLocation, selectedImages]);

  const handleCreateBlinx = () => {
    if (!selectedLocation || selectedImages.length === 0) {
      return;
    }
    
    // Create Blinx post
    
    // Close the modal and return to previous screen
    navigation.goBack();
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

      {/* Photo */}
      <View style={{ marginBottom: 24 }}>
        {selectedImages.length > 0 ? (
          <View>
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
              onPress={() => setSelectedImages([])}
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
              ...getTextStyles().inputLabel,
              color: themeColors.textSecondary,
            }}>
              Add photo
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Activity Selection */}
      <View style={{ marginBottom: 32 }}>
        <Text style={{ 
          ...getTextStyles().createLabel,
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

export default CreateBlinx; 
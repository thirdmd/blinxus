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
import { useThemeColors } from '../../hooks/useThemeColors';

interface CreateBlinxProps {
  navigation: {
    goBack: () => void;
  };
  onValidationChange: (isValid: boolean) => void;
}

const CreateBlinx = forwardRef(({ navigation, onValidationChange }: CreateBlinxProps, ref) => {
  const themeColors = useThemeColors();
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedActivity, setSelectedActivity] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);



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
    // For demo, add a random image
    if (!selectedImage) {
      setSelectedImage(`https://picsum.photos/400/400?random=${Date.now()}`);
    }
  };

  const handleActivitySelect = (activityId: number) => {
    setSelectedActivity(activityId === selectedActivity ? null : activityId);
  };

  useImperativeHandle(ref, () => ({
    handleSubmit: handleCreateBlinx
  }), [selectedLocation, selectedActivity, selectedImage]);

  useEffect(() => {
    const isValid = selectedLocation && selectedImage;
    onValidationChange(!!isValid);
  }, [selectedLocation, selectedImage]);

  const handleCreateBlinx = () => {
    if (!selectedLocation || !selectedImage) {
      return;
    }
    
    console.log('Creating Blinx...', {
      location: selectedLocation,
      activity: selectedActivity,
      photo: selectedImage,
    });
    
    // Navigate to Home tab (when Blinx posts are implemented), this will automatically close the Create screen
    (navigation as any).navigate('Home');
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
        <Text style={{ fontSize: 16, fontWeight: '300', color: themeColors.text, marginBottom: 12 }}>Activity</Text>
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

export default CreateBlinx; 
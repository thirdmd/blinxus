import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { Navigation, ChevronRight, Plus, Calendar, Image } from 'lucide-react-native';
import { colors } from '../../constants';
import { activityTags, ActivityKey } from '../../constants/activityTags';
import Button from '../../components/Button';
import { usePosts } from '../../store/PostsContext';
import { useThemeColors } from '../../hooks/useThemeColors';

interface CreateLucidsProps {
  navigation: {
    goBack: () => void;
  };
  onValidationChange: (isValid: boolean) => void;
}

const CreateLucids = forwardRef(({ navigation, onValidationChange }: CreateLucidsProps, ref) => {
  const { addPost } = usePosts();
  const themeColors = useThemeColors();
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [durationMode, setDurationMode] = useState<'days' | 'dates'>('days');
  const [duration, setDuration] = useState<number>(1);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [dayPhotos, setDayPhotos] = useState<{[key: number]: string[]}>({});
  
  const minDuration = 1;
  const maxDuration = 30;



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

  useImperativeHandle(ref, () => ({
    handleSubmit: handleCreateLucid
  }), [selectedLocation, duration, dayPhotos, durationMode, startDate, endDate]);

  useEffect(() => {
    // PROPER VALIDATION: Follow exact rules
    const hasLocation = selectedLocation.trim().length > 0;
    const totalDays = durationMode === 'dates' ? calculateDurationFromDates() : duration;
    
    // Check if ALL days have exactly 4 images each
    let allDaysHaveRequiredImages = true;
    let totalImages = 0;
    
    for (let day = 0; day < totalDays; day++) {
      const dayImages = dayPhotos[day];
      const dayImageCount = dayImages?.length || 0;
      totalImages += dayImageCount;
      
      // Each day must have exactly 4 images
      if (dayImageCount !== 4) {
        allDaysHaveRequiredImages = false;
      }
    }
    
    const isValid = hasLocation && allDaysHaveRequiredImages && totalImages >= 4;
    
    console.log('LUCIDS VALIDATION:', { 
      hasLocation, 
      totalDays, 
      allDaysHaveRequiredImages, 
      totalImages, 
      isValid, 
      dayPhotos 
    });
    onValidationChange(isValid);
  }, [selectedLocation, dayPhotos, duration, durationMode, startDate, endDate]);

  // Calculate duration from dates
  const calculateDurationFromDates = () => {
    if (startDate && endDate) {
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return Math.min(diffDays, maxDuration);
    }
    return 1;
  };

  // Handle date selection with more options
  const handleDateSelection = (type: 'start' | 'end') => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    const nextMonth = new Date(today);
    nextMonth.setDate(today.getDate() + 30);
    
    Alert.alert(
      `Select ${type} date`,
      'Choose a date:',
      [
        {
          text: `Today (${formatDate(today)})`,
          onPress: () => {
            if (type === 'start') {
              setStartDate(today);
            } else {
              setEndDate(today);
            }
          }
        },
        {
          text: `Tomorrow (${formatDate(tomorrow)})`,
          onPress: () => {
            if (type === 'start') {
              setStartDate(tomorrow);
            } else {
              setEndDate(tomorrow);
            }
          }
        },
        {
          text: `Next Week (${formatDate(nextWeek)})`,
          onPress: () => {
            if (type === 'start') {
              setStartDate(nextWeek);
            } else {
              setEndDate(nextWeek);
            }
          }
        },
        {
          text: `Next Month (${formatDate(nextMonth)})`,
          onPress: () => {
            if (type === 'start') {
              setStartDate(nextMonth);
            } else {
              setEndDate(nextMonth);
            }
          }
        },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Handle photo selection for a specific day
  const handleDayPhotoSelection = (dayIndex: number) => {
    console.log(`Photo selection for day ${dayIndex}`);
    console.log('Current dayPhotos state:', dayPhotos);
    
    // Check if photos already exist for this day
    if (dayPhotos[dayIndex]) {
      console.log(`Removing photos from day ${dayIndex}`);
      // If photos exist, remove them
      setDayPhotos(prev => {
        const updated = { ...prev };
        delete updated[dayIndex];
        console.log('Updated dayPhotos after removal:', updated);
        return updated;
      });
    } else {
      console.log(`Adding photos to day ${dayIndex}`);
      // Automatically add 4 photos without popup
      const timestamp = Date.now();
      const travelImages = [
        'https://cdn.pixabay.com/photo/2017/12/16/22/22/beach-3023488_960_720.jpg',
        'https://cdn.pixabay.com/photo/2019/07/25/17/09/lagoon-4360964_960_720.jpg',
        'https://cdn.pixabay.com/photo/2018/08/14/13/23/ocean-3605547_960_720.jpg',
        'https://cdn.pixabay.com/photo/2016/08/11/23/48/mountains-1587287_960_720.jpg',
        'https://cdn.pixabay.com/photo/2018/01/09/03/49/the-natural-scenery-3070808_960_720.jpg',
        'https://cdn.pixabay.com/photo/2017/02/01/13/52/monument-2031308_960_720.jpg',
        'https://cdn.pixabay.com/photo/2020/04/29/07/24/bamboo-5107425_960_720.jpg',
        'https://cdn.pixabay.com/photo/2021/01/04/10/37/temple-5887585_960_720.jpg',
        'https://cdn.pixabay.com/photo/2017/12/09/08/18/pizza-3007395_960_720.jpg',
        'https://cdn.pixabay.com/photo/2019/10/06/10/03/amusement-park-4530231_960_720.jpg'
      ];
      const mockPhotos = [
        travelImages[(dayIndex * 4) % travelImages.length],
        travelImages[(dayIndex * 4 + 1) % travelImages.length],
        travelImages[(dayIndex * 4 + 2) % travelImages.length],
        travelImages[(dayIndex * 4 + 3) % travelImages.length],
      ];
      console.log('Generated mockPhotos:', mockPhotos);
      setDayPhotos(prev => {
        const updated = {
          ...prev,
          [dayIndex]: mockPhotos
        };
        console.log('Updated dayPhotos after adding:', updated);
        return updated;
      });
    }
  };

  const handleCreateLucid = () => {
    // No validation alerts here - button state should handle validation
    const finalDuration = durationMode === 'dates' ? calculateDurationFromDates() : duration;
    
    try {
      // Collect all actual uploaded images from all days
      const allImages: string[] = [];
      
      // Ensure we collect images from all days in the correct order
      for (let day = 0; day < finalDuration; day++) {
        const dayImages = dayPhotos[day];
        if (dayImages && dayImages.length > 0) {
          allImages.push(...dayImages);
        }
      }
      
      console.log(`Creating Lucid post with ${allImages.length} images from ${finalDuration} days`);
      console.log('dayPhotos state:', dayPhotos);
      console.log('allImages array:', allImages);
      
      addPost({
        authorId: 'current_user',
        authorName: 'Third Camacho',
        authorNationalityFlag: '🇵🇭',
        type: 'lucid',
        title: selectedLocation.trim(), // Use destination as exact title
        content: undefined, // No content needed, title is enough
        images: allImages, // Use actual uploaded images, not generated ones
        location: selectedLocation.trim(),
        // For now, no specific activity - can be added later
        activity: undefined,
    });
    
    // Navigate to Home tab to show the new post, this will automatically close the Create screen
    (navigation as any).navigate('Home');
    } catch (error) {
      console.log('Error creating Lucid:', error);
    }
  };

  return (
    <ScrollView style={{ flex: 1, paddingHorizontal: 24, paddingTop: 8 }} showsVerticalScrollIndicator={false}>
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
            borderColor: selectedLocation ? themeColors.text : 'transparent',
          }}
          activeOpacity={0.7}
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
            fontWeight: '400',
          }}>
            {selectedLocation || 'Destination'}
          </Text>
          <ChevronRight size={20} color={themeColors.textSecondary} strokeWidth={1.5} />
        </TouchableOpacity>
      </View>

      {/* Duration Mode Selection */}
      <View style={{ marginBottom: 24 }}>
        <Text style={{ fontSize: 16, fontWeight: '400', color: themeColors.text, marginBottom: 12 }}>
          Duration
        </Text>
        
        {/* Mode Toggle */}
        <View style={{ flexDirection: 'row', marginBottom: 16, backgroundColor: themeColors.backgroundSecondary, borderRadius: 12, padding: 4 }}>
          <TouchableOpacity
            onPress={() => setDurationMode('days')}
            style={{
              flex: 1,
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderRadius: 8,
              backgroundColor: durationMode === 'days' ? themeColors.background : 'transparent',
              alignItems: 'center',
            }}
            activeOpacity={0.7}
          >
            <Text style={{
              color: durationMode === 'days' ? themeColors.text : themeColors.textSecondary,
              fontWeight: '500',
            }}>
              Days
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setDurationMode('dates')}
            style={{
              flex: 1,
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderRadius: 8,
              backgroundColor: durationMode === 'dates' ? themeColors.background : 'transparent',
              alignItems: 'center',
            }}
            activeOpacity={0.7}
          >
            <Text style={{
              color: durationMode === 'dates' ? themeColors.text : themeColors.textSecondary,
              fontWeight: '500',
            }}>
              Dates
            </Text>
          </TouchableOpacity>
        </View>

        {/* Duration Input */}
        {durationMode === 'days' ? (
          <View style={{ backgroundColor: themeColors.backgroundSecondary, borderRadius: 16, padding: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 18, fontWeight: '400', color: themeColors.text }}>
                {duration} days
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity
                  onPress={() => duration > minDuration && setDuration(duration - 1)}
                  style={{
                    backgroundColor: themeColors.background,
                    borderRadius: 8,
                    padding: 8,
                    marginRight: 8,
                    opacity: duration > minDuration ? 1 : 0.5,
                  }}
                >
                  <Text style={{ fontSize: 16, color: themeColors.text, fontWeight: 'bold' }}>-</Text>
                </TouchableOpacity>
                
                <TextInput
                  value={duration.toString()}
                  onChangeText={(text) => {
                    // Allow empty string for editing
                    if (text === '') {
                      return;
                    }
                    
                    const num = parseInt(text);
                    // Only update if it's a valid number within range
                    if (!isNaN(num) && num >= minDuration && num <= maxDuration) {
                      setDuration(num);
                    }
                  }}
                  onBlur={() => {
                    // If field is empty on blur, reset to minimum
                    if (duration < minDuration || isNaN(duration)) {
                      setDuration(minDuration);
                    }
                  }}
                  style={{
                    backgroundColor: themeColors.background,
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    textAlign: 'center',
                    fontSize: 16,
                    color: themeColors.text,
                    fontWeight: '400',
                    minWidth: 50,
                    marginRight: 8,
                  }}
                  keyboardType="numeric"
                  maxLength={2}
                  selectTextOnFocus={true}
                />
                
                <TouchableOpacity
                  onPress={() => duration < maxDuration && setDuration(duration + 1)}
                  style={{
                    backgroundColor: themeColors.background,
                    borderRadius: 8,
                    padding: 8,
                    opacity: duration < maxDuration ? 1 : 0.5,
                  }}
                >
                  <Text style={{ fontSize: 16, color: themeColors.text, fontWeight: 'bold' }}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          <View style={{ backgroundColor: themeColors.backgroundSecondary, borderRadius: 16, padding: 16 }}>
            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
              <TouchableOpacity
                onPress={() => handleDateSelection('start')}
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: themeColors.background,
                  borderRadius: 12,
                  padding: 12,
                }}
                activeOpacity={0.7}
              >
                <Calendar size={16} color={themeColors.textSecondary} strokeWidth={1.5} />
                <Text style={{ 
                  marginLeft: 8, 
                  color: startDate ? themeColors.text : themeColors.textSecondary,
                  fontSize: 14,
                  fontWeight: '400',
                }}>
                  {startDate ? formatDate(startDate) : 'Start date'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => handleDateSelection('end')}
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: themeColors.background,
                  borderRadius: 12,
                  padding: 12,
                }}
                activeOpacity={0.7}
              >
                <Calendar size={16} color={themeColors.textSecondary} strokeWidth={1.5} />
                <Text style={{ 
                  marginLeft: 8, 
                  color: endDate ? themeColors.text : themeColors.textSecondary,
                  fontSize: 14,
                  fontWeight: '400',
                }}>
                  {endDate ? formatDate(endDate) : 'End date'}
                </Text>
              </TouchableOpacity>
            </View>
            
            {startDate && endDate && (
              <Text style={{ 
                textAlign: 'center', 
                color: themeColors.textSecondary, 
                fontSize: 14,
                fontWeight: '400',
              }}>
                Duration: {calculateDurationFromDates()} days
              </Text>
            )}
          </View>
        )}
      </View>

      {/* Days Preview */}
      <View style={{ marginBottom: 32 }}>
        <Text style={{ fontSize: 16, fontWeight: '400', color: themeColors.text, marginBottom: 12 }}>
          Days
        </Text>
        <View>
          {Array.from({ length: durationMode === 'dates' ? calculateDurationFromDates() : duration }, (_, i) => (
            <View key={i} style={{
              backgroundColor: themeColors.backgroundSecondary,
              borderRadius: 16,
              padding: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 8,
            }}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: themeColors.text, fontWeight: '400' }}>
                  Day {i + 1}
                  {durationMode === 'dates' && startDate && (
                    <Text style={{ color: themeColors.textSecondary, fontSize: 14 }}>
                      {' '}• {formatDate(new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000))}
                    </Text>
                  )}
                </Text>
                {dayPhotos[i] && (
                  <Text style={{ color: themeColors.textSecondary, fontSize: 12, marginTop: 2 }}>
                    {dayPhotos[i].length} photos added
                  </Text>
                )}
              </View>
              <TouchableOpacity 
                onPress={() => handleDayPhotoSelection(i)}
                style={{
                  backgroundColor: dayPhotos[i] ? themeColors.cobalt : themeColors.backgroundTertiary,
                  borderRadius: 20,
                  padding: 8,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
                activeOpacity={0.7}
              >
                {dayPhotos[i] ? (
                  <>
                    <Image size={14} color={colors.white} strokeWidth={1.5} />
                    <Text style={{ 
                      color: colors.white, 
                      fontSize: 12, 
                      marginLeft: 4,
                      fontWeight: '500'
                    }}>
                      {dayPhotos[i].length}
                    </Text>
                  </>
                ) : (
                  <Plus size={16} color={themeColors.textSecondary} strokeWidth={1.5} />
                )}
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
});

export default CreateLucids; 
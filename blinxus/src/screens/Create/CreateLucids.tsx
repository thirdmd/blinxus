import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Image,
} from 'react-native';
import { Navigation, ChevronRight, Plus, Calendar, X } from 'lucide-react-native';
import { LucidPhotoManager } from '../../types/userData/posts_data';
import { colors } from '../../constants/colors';
import { activityTags, ActivityKey } from '../../constants/activityTags';
import Button from '../../components/Button';
import { usePosts } from '../../store/PostsContext';
import { useThemeColors } from '../../hooks/useThemeColors';
import { getResponsiveDimensions, getTextStyles, rs } from '../../utils/responsive';

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
  const MIN_IMAGES_PER_DAY = 3;
  const MAX_IMAGES_PER_DAY = 4;

  const handleLocationPress = () => {
    Alert.prompt(
      'Destination',
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

  // Calculate duration from date range
  const calculateDurationFromDates = (): number => {
    if (!startDate || !endDate) return 1;
    const timeDiff = endDate.getTime() - startDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // +1 to include both start and end days
    return Math.max(1, Math.min(daysDiff, maxDuration));
  };

  // Centralized duration calculation
  const getCurrentDuration = (): number => {
    return durationMode === 'dates' ? calculateDurationFromDates() : duration;
  };

  // Update duration when switching from dates to days mode
  useEffect(() => {
    if (durationMode === 'days' && startDate && endDate) {
      const calculatedDuration = calculateDurationFromDates();
      setDuration(calculatedDuration);
    }
  }, [durationMode, startDate, endDate]);

  // Update dates when changing duration in days mode
  useEffect(() => {
    if (durationMode === 'days' && duration > 1) {
      const today = new Date();
      const endDateCalculated = new Date(today);
      endDateCalculated.setDate(today.getDate() + duration - 1);
      setStartDate(today);
      setEndDate(endDateCalculated);
    }
  }, [duration, durationMode]);

  useEffect(() => {
    const finalDuration = getCurrentDuration();
    
    // Check if all days have the required number of images (3-4 per day)
    let allDaysValid = true;
    for (let day = 0; day < finalDuration; day++) {
      const dayImageCount = dayPhotos[day]?.length || 0;
      if (dayImageCount < MIN_IMAGES_PER_DAY || dayImageCount > MAX_IMAGES_PER_DAY) {
        allDaysValid = false;
        break;
      }
    }
    
    const isValid = selectedLocation.trim() !== '' && allDaysValid;
    onValidationChange(isValid);
  }, [selectedLocation, duration, dayPhotos, durationMode, startDate, endDate, onValidationChange]);

  // Handle date selection with preset options
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
              // Auto-set end date to tomorrow if not set
              if (!endDate) {
                setEndDate(tomorrow);
              }
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
              // Auto-set end date to day after tomorrow if not set
              if (!endDate) {
                const dayAfterTomorrow = new Date(tomorrow);
                dayAfterTomorrow.setDate(tomorrow.getDate() + 1);
                setEndDate(dayAfterTomorrow);
              }
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
              // Auto-set end date to week after if not set
              if (!endDate) {
                const weekAfter = new Date(nextWeek);
                weekAfter.setDate(nextWeek.getDate() + 7);
                setEndDate(weekAfter);
              }
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
              // Auto-set end date to month after if not set
              if (!endDate) {
                const monthAfter = new Date(nextMonth);
                monthAfter.setDate(nextMonth.getDate() + 30);
                setEndDate(monthAfter);
              }
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

  const handleDurationChange = (increment: boolean) => {
    setDuration(prev => {
      const newDuration = increment ? prev + 1 : prev - 1;
      return Math.max(minDuration, Math.min(newDuration, maxDuration));
    });
  };

  const handleAddPhoto = (dayIndex: number) => {
    const currentCount = dayPhotos[dayIndex]?.length || 0;
    
    if (currentCount >= MAX_IMAGES_PER_DAY) {
      Alert.alert(
        'Maximum Photos Reached',
        `You can only add up to ${MAX_IMAGES_PER_DAY} photos per day.`,
        [{ text: 'OK' }]
      );
      return;
    }
    
    const { getRandomTravelImage } = require('../../constants/mockImages');
    const newImage = getRandomTravelImage();
    
    setDayPhotos(prev => ({
      ...prev,
      [dayIndex]: [...(prev[dayIndex] || []), newImage]
    }));
  };

  const handleRemovePhoto = (dayIndex: number, photoIndex: number) => {
      setDayPhotos(prev => ({
        ...prev,
      [dayIndex]: prev[dayIndex]?.filter((_, index) => index !== photoIndex) || []
    }));
  };

  const getPhotoValidationText = (dayIndex: number) => {
    const currentCount = dayPhotos[dayIndex]?.length || 0;
    
    if (currentCount === 0) {
      return `Add 3-4 photos`;
    } else if (currentCount >= MIN_IMAGES_PER_DAY && currentCount <= MAX_IMAGES_PER_DAY) {
      return `${currentCount}/4 photos`;
    } else if (currentCount < MIN_IMAGES_PER_DAY) {
      return `${currentCount}/4 photos`;
    } else {
      return `Add 3-4 photos`;
    }
  };

  const getPhotoValidationColor = (dayIndex: number) => {
    const currentCount = dayPhotos[dayIndex]?.length || 0;
    
    if (currentCount >= MIN_IMAGES_PER_DAY && currentCount <= MAX_IMAGES_PER_DAY) {
      return themeColors.cobalt; // Valid state
    } else {
      return themeColors.textSecondary; // Invalid state
    }
  };

  const handleCreateLucid = () => {
    const finalDuration = getCurrentDuration();
    
    try {
      // Create centralized lucid data structure
      const lucidData = LucidPhotoManager.createLucidPostData(
        finalDuration,
        durationMode,
        dayPhotos,
        startDate || undefined,
        endDate || undefined
      );
      
      // Generate flat array for backward compatibility
      const allImages = LucidPhotoManager.dayPhotosToFlatArray(dayPhotos);
      
      addPost({
        authorId: 'current_user',
        authorName: 'Third Camacho',
        authorNationalityFlag: '🇵🇭',
        type: 'lucid',
        title: selectedLocation.trim(),
        content: undefined,
        images: allImages, // Flat array for backward compatibility
        lucidData, // Centralized day-by-day structure
        location: selectedLocation.trim(),
        activity: undefined,
    });
    
      navigation.goBack();
    } catch (error) {
      // Error handling for Lucid creation
    }
  };

  return (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
      {/* Destination */}
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
          <Text style={{ fontSize: 16, color: themeColors.textSecondary, marginRight: 10 }}>🌍</Text>
          <Text style={{
            fontSize: 15,
            color: selectedLocation ? themeColors.text : themeColors.textSecondary,
            flex: 1,
            fontFamily: 'System',
            fontWeight: '400',
          }}>
            {selectedLocation || 'Where did you go?'}
          </Text>
          {selectedLocation && (
            <ChevronRight size={16} color={themeColors.textSecondary} strokeWidth={1.5} />
          )}
        </TouchableOpacity>
      </View>

      {/* Duration Mode Selection */}
      <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
        {/* Mode Toggle */}
        <View style={{ 
          flexDirection: 'row', 
          marginBottom: 16, 
          backgroundColor: themeColors.isDark 
            ? 'rgba(255, 255, 255, 0.08)'
            : 'rgba(0, 0, 0, 0.05)', 
          borderRadius: 8, 
          padding: 2 
        }}>
          <TouchableOpacity
            onPress={() => setDurationMode('days')}
            style={{
              flex: 1,
              paddingVertical: 6,
              paddingHorizontal: 12,
              borderRadius: 6,
              backgroundColor: durationMode === 'days' ? themeColors.background : 'transparent',
              alignItems: 'center',
            }}
            activeOpacity={0.7}
          >
            <Text style={{
              color: durationMode === 'days' ? themeColors.text : themeColors.textSecondary,
              fontWeight: durationMode === 'days' ? '600' : '400',
              fontSize: 13,
              fontFamily: 'System',
            }}>
              Days
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setDurationMode('dates')}
            style={{
              flex: 1,
              paddingVertical: 6,
              paddingHorizontal: 12,
              borderRadius: 6,
              backgroundColor: durationMode === 'dates' ? themeColors.background : 'transparent',
              alignItems: 'center',
            }}
            activeOpacity={0.7}
          >
            <Text style={{
              color: durationMode === 'dates' ? themeColors.text : themeColors.textSecondary,
              fontWeight: durationMode === 'dates' ? '600' : '400',
              fontSize: 13,
              fontFamily: 'System',
            }}>
              Dates
            </Text>
          </TouchableOpacity>
        </View>

        {/* Duration Input */}
        {durationMode === 'days' ? (
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            backgroundColor: themeColors.isDark 
              ? 'rgba(255, 255, 255, 0.08)'
              : 'rgba(0, 0, 0, 0.05)',
            borderRadius: 8,
            padding: 2
          }}>
                <TouchableOpacity
              onPress={() => handleDurationChange(false)}
              disabled={duration <= minDuration}
                  style={{
                width: 32,
                height: 32,
                borderRadius: 6,
                backgroundColor: duration > minDuration ? themeColors.background : 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
                  }}
              activeOpacity={0.7}
                >
                  <Text style={{ 
                fontSize: 16,
                color: duration > minDuration ? themeColors.text : themeColors.textSecondary,
                fontWeight: '600',
                  }}>
                    -
                  </Text>
                </TouchableOpacity>
                
            <Text style={{
              flex: 1,
                    textAlign: 'center',
              fontSize: 15,
                    color: themeColors.text,
              fontWeight: '500',
              fontFamily: 'System',
            }}>
              {duration} {duration === 1 ? 'day' : 'days'}
            </Text>
                
                <TouchableOpacity
              onPress={() => handleDurationChange(true)}
              disabled={duration >= maxDuration}
                  style={{
                width: 32,
                height: 32,
                borderRadius: 6,
                backgroundColor: duration < maxDuration ? themeColors.background : 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
                  }}
              activeOpacity={0.7}
                >
                  <Text style={{ 
                fontSize: 16,
                color: duration < maxDuration ? themeColors.text : themeColors.textSecondary,
                fontWeight: '600',
                  }}>
                    +
                  </Text>
                </TouchableOpacity>
          </View>
        ) : (
          <View style={{ flexDirection: 'row', gap: 6 }}>
              <TouchableOpacity
                onPress={() => handleDateSelection('start')}
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                backgroundColor: themeColors.isDark 
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(0, 0, 0, 0.05)',
                borderRadius: 8,
                padding: 10,
                }}
                activeOpacity={0.7}
              >
              <Calendar size={14} color={themeColors.textSecondary} strokeWidth={1.5} />
                <Text style={{ 
                marginLeft: 6, 
                  color: startDate ? themeColors.text : themeColors.textSecondary,
                fontSize: 13,
                fontFamily: 'System',
                }}>
                {startDate ? formatDate(startDate) : 'Start'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => handleDateSelection('end')}
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                backgroundColor: themeColors.isDark 
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(0, 0, 0, 0.05)',
                borderRadius: 8,
                padding: 10,
                }}
                activeOpacity={0.7}
              >
              <Calendar size={14} color={themeColors.textSecondary} strokeWidth={1.5} />
              <Text style={{ 
                marginLeft: 6, 
                color: endDate ? themeColors.text : themeColors.textSecondary,
                fontSize: 13,
                fontFamily: 'System',
              }}>
                {endDate ? formatDate(endDate) : 'End'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Day-by-Day Photos */}
      <View style={{ paddingHorizontal: 20, marginBottom: 40 }}>

        {Array.from({ length: getCurrentDuration() }, (_, index) => (
          <View key={index} style={{ 
            marginBottom: 12,
            borderRadius: 8,
            backgroundColor: themeColors.isDark 
              ? 'rgba(255, 255, 255, 0.03)'
              : 'rgba(0, 0, 0, 0.02)',
            borderWidth: 0.5,
            borderColor: themeColors.isDark 
              ? 'rgba(255, 255, 255, 0.08)'
              : 'rgba(0, 0, 0, 0.05)',
            padding: 12,
          }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: dayPhotos[index] && dayPhotos[index].length > 0 ? 10 : 0,
            }}>
              <Text style={{
                fontSize: 14,
                fontWeight: '500',
                color: themeColors.text,
                fontFamily: 'System',
              }}>
                Day {index + 1}
                    </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={{
                  fontSize: 11,
                  color: getPhotoValidationColor(index),
                  fontFamily: 'System',
                }}>
                  {getPhotoValidationText(index)}
                </Text>
              <TouchableOpacity 
                  onPress={() => handleAddPhoto(index)}
                  disabled={(dayPhotos[index]?.length || 0) >= MAX_IMAGES_PER_DAY}
                style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: (dayPhotos[index]?.length || 0) < MAX_IMAGES_PER_DAY 
                      ? themeColors.cobalt 
                      : themeColors.isDark 
                        ? 'rgba(255, 255, 255, 0.1)'
                        : 'rgba(0, 0, 0, 0.1)',
                  alignItems: 'center',
                    justifyContent: 'center',
                }}
                activeOpacity={0.7}
              >
                  <Plus 
                    size={12} 
                    color={(dayPhotos[index]?.length || 0) < MAX_IMAGES_PER_DAY ? '#ffffff' : themeColors.textSecondary} 
                    strokeWidth={2} 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {dayPhotos[index] && dayPhotos[index].length > 0 ? (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                {dayPhotos[index].map((photo, photoIndex) => (
                  <View key={photoIndex} style={{ position: 'relative' }}>
                    <Image
                      source={{ uri: photo }}
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: 6,
                      }}
                      resizeMode="cover"
                    />
                    <TouchableOpacity
                      onPress={() => handleRemovePhoto(index, photoIndex)}
                      style={{
                        position: 'absolute',
                        top: -6,
                        right: -6,
                        width: 18,
                        height: 18,
                        borderRadius: 9,
                        backgroundColor: themeColors.background,
                        borderWidth: 1,
                        borderColor: themeColors.border,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      activeOpacity={0.8}
                    >
                      <X size={8} color={themeColors.text} strokeWidth={2} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
            ) : (
              <View style={{
                height: 40,
                borderRadius: 6,
                borderWidth: 1,
                borderColor: themeColors.isDark 
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(0, 0, 0, 0.05)',
                borderStyle: 'dashed',
                backgroundColor: themeColors.isDark 
                  ? 'rgba(255, 255, 255, 0.01)'
                  : 'rgba(0, 0, 0, 0.005)',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Text style={{
                  fontSize: 11,
                  color: themeColors.textSecondary,
                  fontFamily: 'System',
                }}>
                  No photos yet
                </Text>
              </View>
            )}
          </View>
        ))}
      </View>


    </ScrollView>
  );
});

export default CreateLucids; 
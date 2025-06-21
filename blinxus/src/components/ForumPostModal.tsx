import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from 'react-native';
import { X, MapPin, Search } from 'lucide-react-native';
import { useThemeColors } from '../hooks/useThemeColors';
import { Country, SubLocation } from '../constants/placesData';

// Forum categories
export const FORUM_CATEGORIES = [
  { id: 'question', label: 'Question', emoji: '🤔', color: '#8B5CF6' },
  { id: 'tip', label: 'Tip', emoji: '💡', color: '#10B981' },
  { id: 'recommendation', label: 'Recommendation', emoji: '🏆', color: '#F59E0B' },
  { id: 'general', label: 'General', emoji: '💬', color: '#6B7280' },
] as const;

// Activity tags (subset of main activity tags for forum context)
export const FORUM_ACTIVITY_TAGS = [
  { id: 'food', label: 'Food', emoji: '🍽️' },
  { id: 'beach', label: 'Beach', emoji: '🏖️' },
  { id: 'culture', label: 'Culture', emoji: '🏛️' },
  { id: 'adventure', label: 'Adventure', emoji: '🏔️' },
  { id: 'nightlife', label: 'Nightlife', emoji: '🌃' },
  { id: 'shopping', label: 'Shopping', emoji: '🛍️' },
  { id: 'transport', label: 'Transport', emoji: '🚗' },
  { id: 'accommodation', label: 'Stay', emoji: '🏨' },
] as const;

export type ForumCategoryId = typeof FORUM_CATEGORIES[number]['id'];
export type ForumActivityId = typeof FORUM_ACTIVITY_TAGS[number]['id'];

interface ForumPostModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (post: {
    content: string;
    category: ForumCategoryId;
    activityTags: ForumActivityId[];
    locationId: string;
  }) => void;
  country: Country;
  defaultLocation?: string;
}

const ForumPostModal: React.FC<ForumPostModalProps> = ({
  visible,
  onClose,
  onSubmit,
  country,
  defaultLocation = 'All',
}) => {
  const themeColors = useThemeColors();
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ForumCategoryId>('question');
  const [selectedActivityTags, setSelectedActivityTags] = useState<ForumActivityId[]>([]);
  const [selectedLocation, setSelectedLocation] = useState(defaultLocation);
  const [locationSearch, setLocationSearch] = useState('');
  const [showLocationSearch, setShowLocationSearch] = useState(false);

  const handleSubmit = () => {
    if (!content.trim()) return;

    // Find the actual location ID
    const location = country.subLocations.find(loc => loc.name === selectedLocation);
    const locationId = location?.id || country.subLocations[0]?.id || '';

    onSubmit({
      content: content.trim(),
      category: selectedCategory,
      activityTags: selectedActivityTags,
      locationId,
    });

    // Reset form
    setContent('');
    setSelectedCategory('question');
    setSelectedActivityTags([]);
    onClose();
  };

  const toggleActivityTag = (tagId: ForumActivityId) => {
    setSelectedActivityTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const selectedCategoryData = FORUM_CATEGORIES.find(cat => cat.id === selectedCategory);

  // Filter locations based on search
  const filteredLocations = useMemo(() => {
    const allOptions = [
      { id: 'all', name: 'General', isGeneral: true, alternateNames: [] as string[] },
      ...country.subLocations.map(loc => ({ ...loc, isGeneral: false }))
    ];

    if (!locationSearch.trim()) {
      return allOptions;
    }

    return allOptions.filter(location => 
      location.name.toLowerCase().includes(locationSearch.toLowerCase()) ||
      (location.alternateNames && location.alternateNames.some((alt: string) => 
        alt.toLowerCase().includes(locationSearch.toLowerCase())
      ))
    );
  }, [country.subLocations, locationSearch]);

  const handleLocationSelect = (locationName: string) => {
    setSelectedLocation(locationName);
    setShowLocationSearch(false);
    setLocationSearch('');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={{
          flex: 1,
          backgroundColor: themeColors.background,
        }}>
          {/* Header */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingVertical: 16,
            borderBottomWidth: 0.5,
            borderBottomColor: themeColors.isDark 
              ? 'rgba(255, 255, 255, 0.1)'
              : 'rgba(0, 0, 0, 0.1)',
          }}>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={themeColors.text} strokeWidth={2} />
            </TouchableOpacity>

            <Text style={{
              fontSize: 17,
              fontWeight: '600',
              color: themeColors.text,
              fontFamily: 'System',
            }}>
              New Discussion
            </Text>

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={!content.trim()}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                backgroundColor: content.trim() 
                  ? selectedCategoryData?.color || '#3B82F6'
                  : themeColors.isDark 
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(0, 0, 0, 0.1)',
              }}
            >
              <Text style={{
                color: content.trim() ? 'white' : themeColors.textSecondary,
                fontSize: 15,
                fontWeight: '600',
                fontFamily: 'System',
              }}>
                Post
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            {/* Location Selection - Moved to Top */}
            <View style={{ paddingHorizontal: 20, paddingTop: 20, marginBottom: 20 }}>
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: themeColors.text,
                marginBottom: 12,
                fontFamily: 'System',
              }}>
                Location
              </Text>

              {/* Location Search Bar */}
              <TouchableOpacity
                onPress={() => setShowLocationSearch(true)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderRadius: 12,
                  backgroundColor: themeColors.isDark 
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'rgba(0, 0, 0, 0.05)',
                  borderWidth: 1,
                  borderColor: themeColors.isDark 
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(0, 0, 0, 0.08)',
                }}
              >
                <MapPin size={16} color={themeColors.textSecondary} />
                <Text style={{
                  fontSize: 15,
                  color: selectedLocation === 'All' ? themeColors.textSecondary : themeColors.text,
                  marginLeft: 8,
                  flex: 1,
                  fontFamily: 'System',
                }}>
                  {selectedLocation === 'All' ? 'Select location...' : selectedLocation}
                </Text>
                <Search size={16} color={themeColors.textSecondary} />
              </TouchableOpacity>

              {/* Location Search Modal */}
              {showLocationSearch && (
                <View style={{
                  position: 'absolute',
                  top: 70,
                  left: 20,
                  right: 20,
                  backgroundColor: themeColors.background,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: themeColors.isDark 
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(0, 0, 0, 0.08)',
                  zIndex: 1000,
                  maxHeight: 200,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 12,
                  elevation: 8,
                }}>
                  {/* Search Input */}
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: themeColors.isDark 
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'rgba(0, 0, 0, 0.05)',
                  }}>
                    <Search size={16} color={themeColors.textSecondary} />
                    <TextInput
                      value={locationSearch}
                      onChangeText={setLocationSearch}
                      placeholder="Search locations..."
                      placeholderTextColor={themeColors.textSecondary}
                      style={{
                        fontSize: 15,
                        color: themeColors.text,
                        marginLeft: 8,
                        flex: 1,
                        fontFamily: 'System',
                      }}
                      autoFocus
                    />
                    <TouchableOpacity
                      onPress={() => {
                        setShowLocationSearch(false);
                        setLocationSearch('');
                      }}
                    >
                      <X size={16} color={themeColors.textSecondary} />
                    </TouchableOpacity>
                  </View>

                  {/* Location Results */}
                  <FlatList
                    data={filteredLocations}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => handleLocationSelect(item.name)}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          paddingHorizontal: 16,
                          paddingVertical: 12,
                          backgroundColor: selectedLocation === item.name
                            ? themeColors.isDark 
                              ? 'rgba(139, 92, 246, 0.2)'
                              : 'rgba(139, 92, 246, 0.1)'
                            : 'transparent',
                        }}
                      >
                        <MapPin size={14} color={themeColors.textSecondary} />
                        <Text style={{
                          fontSize: 15,
                          color: themeColors.text,
                          marginLeft: 8,
                          fontFamily: 'System',
                          fontWeight: selectedLocation === item.name ? '600' : '400',
                        }}>
                          {item.name}
                        </Text>
                        {item.isGeneral && (
                          <Text style={{
                            fontSize: 12,
                            color: themeColors.textSecondary,
                            marginLeft: 8,
                            fontFamily: 'System',
                          }}>
                            (All locations)
                          </Text>
                        )}
                      </TouchableOpacity>
                    )}
                    style={{ maxHeight: 120 }}
                  />
                </View>
              )}
            </View>

            {/* Content Input */}
            <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
              <TextInput
                value={content}
                onChangeText={setContent}
                placeholder={`What's on your mind about ${country.name}?`}
                placeholderTextColor={themeColors.textSecondary}
                multiline
                textAlignVertical="top"
                style={{
                  fontSize: 16,
                  color: themeColors.text,
                  fontFamily: 'System',
                  minHeight: 120,
                  lineHeight: 22,
                }}
                autoFocus={!showLocationSearch}
              />
            </View>

            {/* Category Selection */}
            <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: themeColors.text,
                marginBottom: 12,
                fontFamily: 'System',
              }}>
                Category
              </Text>

              <View style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 8,
              }}>
                {FORUM_CATEGORIES.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    onPress={() => setSelectedCategory(category.id)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 20,
                      backgroundColor: selectedCategory === category.id
                        ? category.color
                        : themeColors.isDark 
                          ? 'rgba(255, 255, 255, 0.08)'
                          : 'rgba(0, 0, 0, 0.05)',
                    }}
                  >
                    <Text style={{ fontSize: 14, marginRight: 4 }}>
                      {category.emoji}
                    </Text>
                    <Text style={{
                      fontSize: 14,
                      fontWeight: '500',
                      color: selectedCategory === category.id 
                        ? 'white' 
                        : themeColors.text,
                      fontFamily: 'System',
                    }}>
                      {category.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Activity Tags (Optional) */}
            <View style={{ paddingHorizontal: 20, marginBottom: 40 }}>
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: themeColors.text,
                marginBottom: 4,
                fontFamily: 'System',
              }}>
                Related to
              </Text>
              <Text style={{
                fontSize: 13,
                color: themeColors.textSecondary,
                marginBottom: 12,
                fontFamily: 'System',
              }}>
                Optional - helps others find your post
              </Text>

              <View style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 8,
              }}>
                {FORUM_ACTIVITY_TAGS.map((tag) => (
                  <TouchableOpacity
                    key={tag.id}
                    onPress={() => toggleActivityTag(tag.id)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 20,
                      backgroundColor: selectedActivityTags.includes(tag.id)
                        ? '#3B82F6'
                        : themeColors.isDark 
                          ? 'rgba(255, 255, 255, 0.08)'
                          : 'rgba(0, 0, 0, 0.05)',
                    }}
                  >
                    <Text style={{ fontSize: 14, marginRight: 4 }}>
                      {tag.emoji}
                    </Text>
                    <Text style={{
                      fontSize: 14,
                      fontWeight: '500',
                      color: selectedActivityTags.includes(tag.id) 
                        ? 'white' 
                        : themeColors.text,
                      fontFamily: 'System',
                    }}>
                      {tag.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>


          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ForumPostModal; 
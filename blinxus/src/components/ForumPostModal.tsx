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
import { X, Search, Send } from 'lucide-react-native';
import { useThemeColors } from '../hooks/useThemeColors';
import { Country, SubLocation } from '../constants/placesData';
import { FORUM_ACTIVITY_TAGS as IMPORTED_FORUM_ACTIVITY_TAGS } from '../screens/Pods/components/Forum/forumTypes';
import { getForumTagsByCategory, hasCustomForumTags } from '../screens/Pods/components/Forum/countryForumTags';

// Forum categories
export const FORUM_CATEGORIES = [
  { id: 'question', label: 'Question', emoji: '🤔', color: '#3B82F6' },
  { id: 'tip', label: 'Tip', emoji: '💡', color: '#10B981' },
  { id: 'recommendation', label: 'Recommendation', emoji: '🏆', color: '#F59E0B' },
  { id: 'general', label: 'General', emoji: '💬', color: '#6B7280' },
  { id: 'meetup', label: 'Meetup', emoji: '👥', color: '#8B5CF6' },
  { id: 'alert', label: 'Alert', emoji: '⚠️', color: '#EF4444' },
] as const;

// Use the activity tags from forum types to avoid duplicates
const FORUM_ACTIVITY_TAGS = IMPORTED_FORUM_ACTIVITY_TAGS;

export type ForumCategoryId = typeof FORUM_CATEGORIES[number]['id'];
export type ForumActivityId = typeof IMPORTED_FORUM_ACTIVITY_TAGS[number]['id'];

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

  // Get country-specific tags
  const getCountryTags = (category: 'activity' | 'accommodation' | 'transport' | 'food' | 'culture') => {
    if (hasCustomForumTags(country.id)) {
      return getForumTagsByCategory(country.id, category);
    }
    // Fallback to generic tags if country not found
    return FORUM_ACTIVITY_TAGS.filter(tag => tag.category === category);
  };

  const handleSubmit = () => {
    if (!content.trim()) return;

    // Handle location ID properly
    let locationId: string;
    
    if (selectedLocation === 'General' || selectedLocation === 'All') {
      // For "All"/"General", use 'All' as the location ID
      locationId = 'All';
    } else {
      // Find the specific location and format the ID correctly
      const location = country.subLocations.find(loc => loc.name === selectedLocation);
      if (location) {
        // Use the proper format: countryId-locationId
        locationId = `${country.id}-${location.id}`;
      } else {
        // Fallback to 'All' if location not found
        locationId = 'All';
      }
    }

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
                flexDirection: 'row',
                alignItems: 'center',
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
                marginRight: 6,
              }}>
                Post
              </Text>
              <Send 
                size={14} 
                color={content.trim() ? 'white' : themeColors.textSecondary} 
                strokeWidth={2}
              />
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
                <Text style={{ fontSize: 16, color: themeColors.textSecondary, marginRight: 8 }}>📍</Text>
                <Text style={{
                  fontSize: 15,
                  color: selectedLocation === 'All' ? themeColors.textSecondary : themeColors.text,
                  flex: 1,
                  fontFamily: 'System',
                }}>
                  {selectedLocation === 'All' ? `Select location in ${country.name}` : selectedLocation}
                </Text>
                <Search size={16} color={themeColors.textSecondary} />
              </TouchableOpacity>


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

            {/* Activity Tags (Optional) - Organized by Categories */}
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
                marginBottom: 20,
                fontFamily: 'System',
              }}>
                Optional - helps others find your post
              </Text>

              {/* Activities */}
              <View style={{ marginBottom: 24 }}>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: themeColors.text,
                  marginBottom: 12,
                  fontFamily: 'System',
                }}>
                  🎯 Activities
                </Text>
                <View style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 8,
                }}>
                  {getCountryTags('activity').map((tag) => (
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

              {/* Accommodation */}
              <View style={{ marginBottom: 24 }}>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: themeColors.text,
                  marginBottom: 12,
                  fontFamily: 'System',
                }}>
                  🏨 Accommodation
                </Text>
                <View style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 8,
                }}>
                  {getCountryTags('accommodation').map((tag) => (
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

              {/* Transport */}
              <View style={{ marginBottom: 24 }}>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: themeColors.text,
                  marginBottom: 12,
                  fontFamily: 'System',
                }}>
                  🚗 Transport
                </Text>
                <View style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 8,
                }}>
                  {getCountryTags('transport').map((tag) => (
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

              {/* Food */}
              <View style={{ marginBottom: 24 }}>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: themeColors.text,
                  marginBottom: 12,
                  fontFamily: 'System',
                }}>
                  🍽️ Food & Drinks
                </Text>
                <View style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 8,
                }}>
                  {getCountryTags('food').map((tag) => (
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

              {/* Culture */}
              <View style={{ marginBottom: 24 }}>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: themeColors.text,
                  marginBottom: 12,
                  fontFamily: 'System',
                }}>
                  🎭 Culture
                </Text>
                <View style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 8,
                }}>
                  {getCountryTags('culture').map((tag) => (
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
            </View>


          </ScrollView>
        </View>
      </KeyboardAvoidingView>

      {/* Location Search Modal - Separate to avoid VirtualizedList nesting */}
      <Modal
        visible={showLocationSearch}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => {
          setShowLocationSearch(false);
          setLocationSearch('');
        }}
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
            <TouchableOpacity onPress={() => {
              setShowLocationSearch(false);
              setLocationSearch('');
            }}>
              <X size={24} color={themeColors.text} strokeWidth={2} />
            </TouchableOpacity>

            <Text style={{
              fontSize: 17,
              fontWeight: '600',
              color: themeColors.text,
              fontFamily: 'System',
            }}>
              Select Location
            </Text>

            <View style={{ width: 24 }} />
          </View>

          {/* Search Input */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: themeColors.isDark 
              ? 'rgba(255, 255, 255, 0.1)'
              : 'rgba(0, 0, 0, 0.05)',
          }}>
            <Search size={16} color={themeColors.textSecondary} />
            <TextInput
              value={locationSearch}
              onChangeText={setLocationSearch}
              placeholder={`Search locations in ${country.name}...`}
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
          </View>

          {/* Location Results */}
          <ScrollView style={{ flex: 1 }}>
            {filteredLocations.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => handleLocationSelect(item.name)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 20,
                  paddingVertical: 16,
                  backgroundColor: selectedLocation === item.name
                    ? themeColors.isDark 
                      ? 'rgba(139, 92, 246, 0.2)'
                      : 'rgba(139, 92, 246, 0.1)'
                    : 'transparent',
                }}
              >
                <Text style={{ fontSize: 16, color: themeColors.textSecondary, marginRight: 12 }}>📍</Text>
                <Text style={{
                  fontSize: 16,
                  color: themeColors.text,
                  fontFamily: 'System',
                  fontWeight: selectedLocation === item.name ? '600' : '400',
                  flex: 1,
                }}>
                  {item.name}
                </Text>
                {item.isGeneral && (
                  <Text style={{
                    fontSize: 14,
                    color: themeColors.textSecondary,
                    fontFamily: 'System',
                  }}>
                    (All locations)
                  </Text>
                )}
                {selectedLocation === item.name && (
                  <Text style={{
                    fontSize: 18,
                    color: '#3B82F6',
                    marginLeft: 8,
                  }}>
                    ✓
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </Modal>
  );
};

export default ForumPostModal; 
import React, { useState, useMemo, useEffect } from 'react';
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
import FilterPill from './FilterPill';
import { Country, SubLocation } from '../constants/placesData';
import { 
  FORUM_ACTIVITY_TAGS, 
  FORUM_CATEGORIES, 
  ForumCategory 
} from '../screens/Pods/components/Forum/forumTypes';
import { getForumTagsByCategory, hasCustomForumTags } from '../screens/Pods/components/Forum/countryForumTags';

export type ForumCategoryId = ForumCategory['id'];
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
  const [selectedCategory, setSelectedCategory] = useState<ForumCategoryId>('general');
  const [selectedActivityTags, setSelectedActivityTags] = useState<ForumActivityId[]>([]);
  const [selectedLocation, setSelectedLocation] = useState(defaultLocation);
  const [locationSearch, setLocationSearch] = useState('');
  const [showLocationSearch, setShowLocationSearch] = useState(false);

  // ADDED: Sync selectedLocation with defaultLocation when it changes
  useEffect(() => {
    setSelectedLocation(defaultLocation);
  }, [defaultLocation]);

  // ADDED: Reset form when modal opens
  useEffect(() => {
    if (visible) {
      setContent('');
      setSelectedCategory('general');
      setSelectedActivityTags([]);
      setSelectedLocation(defaultLocation);
      setLocationSearch('');
      setShowLocationSearch(false);
    }
  }, [visible, defaultLocation]);

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
    
    // VALIDATION: For global feed (blank defaultLocation), require location selection
    if (defaultLocation === '' && selectedLocation === '') {
      return; // Prevent submission when location is required but not selected
    }
    
    // VALIDATION: When in "All" tab, require specific location selection
    if (defaultLocation === 'All' && selectedLocation === 'All') {
      return; // Prevent submission when location is required but not selected
    }

    // FIXED: Handle location ID properly for both global feed and country-specific forums
    let locationId: string;
    
    if (selectedLocation === 'General' || selectedLocation === 'All') {
      // For "All"/"General", use 'All' as the location ID
      locationId = 'All';
    } else if (selectedLocation === '') {
      // For global feed with no selection, this shouldn't happen due to validation above
      locationId = 'All';
    } else {
      // For global feed, return the full location string as-is (e.g., "Bangkok, Thailand")
      // For country-specific forums, find the location ID
      if (country.id === 'global') {
        // Global feed: return the selected location as-is for parsing in GlobalFeed
        locationId = selectedLocation;
      } else {
        // Country-specific forum: find the actual location ID
        const location = country.subLocations.find(loc => loc.name === selectedLocation);
        if (location) {
          locationId = location.id; // Use actual location ID for country forums
        } else {
          // Fallback to 'All' if location not found
          locationId = 'All';
        }
      }
    }

    const postData = {
      content: content.trim(),
      category: selectedCategory,
      activityTags: [...selectedActivityTags], // Create a copy to prevent state mutation
      locationId,
    };

    // FIXED: Call onSubmit first, then close modal
    onSubmit(postData);
    onClose();
    
    // FIXED: Reset form state after modal closes
    // This prevents the form from clearing before submission
    setTimeout(() => {
      setContent('');
      setSelectedCategory('general');
      setSelectedActivityTags([]);
      setSelectedLocation(defaultLocation);
    }, 200);
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
    const allOptions = [];
    
    // Only add "General" option if this is not a global feed (country.id !== 'global')
    if (country.id !== 'global') {
      allOptions.push({ 
        id: 'all', 
        name: 'General', 
        isGeneral: true, 
        alternateNames: [] as string[],
        displayName: country.name // Show country name instead of 'General' in search results
      });
    }
    
    // Add all sub-locations
    allOptions.push(...country.subLocations.map(loc => ({ 
      ...loc, 
      isGeneral: false,
      displayName: loc.name // Regular locations show their name
    })));

    if (!locationSearch.trim()) {
      return allOptions;
    }

    return allOptions.filter(location => 
      location.name.toLowerCase().includes(locationSearch.toLowerCase()) ||
      (location.alternateNames && location.alternateNames.some((alt: string) => 
        alt.toLowerCase().includes(locationSearch.toLowerCase())
      ))
    );
  }, [country.subLocations, country.name, country.id, locationSearch]);

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
              disabled={!content.trim() || (defaultLocation === 'All' && selectedLocation === 'All') || (defaultLocation === '' && selectedLocation === '')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                backgroundColor: (content.trim() && !(defaultLocation === 'All' && selectedLocation === 'All') && !(defaultLocation === '' && selectedLocation === ''))
                  ? selectedCategoryData?.color || '#3B82F6'
                  : themeColors.isDark 
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(0, 0, 0, 0.1)',
              }}
            >
              <Text style={{
                color: (content.trim() && !(defaultLocation === 'All' && selectedLocation === 'All') && !(defaultLocation === '' && selectedLocation === '')) ? 'white' : themeColors.textSecondary,
                fontSize: 15,
                fontWeight: '600',
                fontFamily: 'System',
                marginRight: 6,
              }}>
                Post
              </Text>
              <Send 
                size={14} 
                color={(content.trim() && !(defaultLocation === 'All' && selectedLocation === 'All') && !(defaultLocation === '' && selectedLocation === '')) ? 'white' : themeColors.textSecondary} 
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
                  color: (selectedLocation === 'All' || selectedLocation === '') ? themeColors.textSecondary : themeColors.text,
                  flex: 1,
                  fontFamily: 'System',
                }}>
                  {selectedLocation === '' 
                    ? 'Select location' // For global feed with blank default
                    : selectedLocation === 'All' || selectedLocation === 'General' 
                      ? selectedLocation === 'General' 
                        ? country.name  // Show country name when General is selected
                        : `Select location in ${country.name}` 
                      : selectedLocation
                  }
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
                Tags
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
                  Activities
                </Text>
                <View style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 8,
                }}>
                  {getCountryTags('activity').map((tag) => (
                    <FilterPill
                      key={tag.id}
                      label={tag.label}
                      emoji={tag.emoji}
                      variant="tag"
                      size="medium"
                      isSelected={selectedActivityTags.includes(tag.id)}
                      onPress={() => toggleActivityTag(tag.id)}
                    />
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
                  Accommodation
                </Text>
                <View style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 8,
                }}>
                  {getCountryTags('accommodation').map((tag) => (
                    <FilterPill
                      key={tag.id}
                      label={tag.label}
                      emoji={tag.emoji}
                      variant="tag"
                      size="medium"
                      isSelected={selectedActivityTags.includes(tag.id)}
                      onPress={() => toggleActivityTag(tag.id)}
                    />
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
                  Transport
                </Text>
                <View style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 8,
                }}>
                  {getCountryTags('transport').map((tag) => (
                    <FilterPill
                      key={tag.id}
                      label={tag.label}
                      emoji={tag.emoji}
                      variant="tag"
                      size="medium"
                      isSelected={selectedActivityTags.includes(tag.id)}
                      onPress={() => toggleActivityTag(tag.id)}
                    />
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
                  Food & Drinks
                </Text>
                <View style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 8,
                }}>
                  {getCountryTags('food').map((tag) => (
                    <FilterPill
                      key={tag.id}
                      label={tag.label}
                      emoji={tag.emoji}
                      variant="tag"
                      size="medium"
                      isSelected={selectedActivityTags.includes(tag.id)}
                      onPress={() => toggleActivityTag(tag.id)}
                    />
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
                  Culture
                </Text>
                <View style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 8,
                }}>
                  {getCountryTags('culture').map((tag) => (
                    <FilterPill
                      key={tag.id}
                      label={tag.label}
                      emoji={tag.emoji}
                      variant="tag"
                      size="medium"
                      isSelected={selectedActivityTags.includes(tag.id)}
                      onPress={() => toggleActivityTag(tag.id)}
                    />
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
                  {item.isGeneral ? item.displayName : item.name}
                </Text>
                {item.isGeneral && (
                  <Text style={{
                    fontSize: 14,
                    color: themeColors.textSecondary,
                    fontFamily: 'System',
                  }}>
                    General
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
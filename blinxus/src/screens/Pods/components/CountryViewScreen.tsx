import React, { useState, useRef, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  StatusBar,
} from 'react-native';
import { ChevronLeft, Map, Users, MessageCircle, MapPin } from 'lucide-react-native';
import { 
  PodThemeConfig, 
  PodTabType, 
} from '../../../types/structures/podsUIStructure';
import { Country, SubLocation, placesData } from '../../../constants/placesData';
import { 
  ForumPost,
  LocationFilter,
  getLocationFilters,
  filterPostsByLocation,
  getPostLocationDisplay,
  generateMockForumPosts,
  getContinentNameByCountry,
  getEmptyStateMessage,
} from '../../../utils/forumLocationLogic';
import ForumPostModal, { FORUM_CATEGORIES, FORUM_ACTIVITY_TAGS } from '../../../components/ForumPostModal';
import { useThemeColors } from '../../../hooks/useThemeColors';

interface CountryViewScreenProps {
  country: Country;
  activeTab: PodTabType;
  onTabChange: (tab: PodTabType) => void;
  onLocationPress: (location: SubLocation) => void;
  onBack: () => void;
  theme: PodThemeConfig;
  postingService?: any;
}

const { width } = Dimensions.get('window');

const CountryViewScreen: React.FC<CountryViewScreenProps> = ({
  country,
  activeTab,
  onTabChange,
  onLocationPress,
  onBack,
  theme,
}) => {
  const themeColors = useThemeColors();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [selectedLocationFilter, setSelectedLocationFilter] = useState<LocationFilter>('All');
  const [showPostModal, setShowPostModal] = useState(false);
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);
  
  // Generate consistent member count based on country ID
  const memberCount = Math.floor((country.id.charCodeAt(0) * country.id.charCodeAt(country.id.length - 1) * 37) % 5000 + 100);
  const postsCount = Math.floor(memberCount * 0.65); // Roughly 65% of members have posts
  
  // Get continent name using the utility function
  const continentName = getContinentNameByCountry(country);
  
  // Generate location filter tabs using the utility function
  const locationTabs = useMemo(() => getLocationFilters(country), [country]);
  
  // Initialize forum posts
  useMemo(() => {
    if (forumPosts.length === 0) {
      setForumPosts(generateMockForumPosts(country));
    }
  }, [country, forumPosts.length]);

  // Filter posts based on selected location filter
  const filteredPosts = useMemo(() => 
    filterPostsByLocation(forumPosts, selectedLocationFilter, country), 
    [forumPosts, selectedLocationFilter, country]
  );

  const handleMapPress = () => {
    // TODO: Open maps with country location
    console.log('Open maps for:', country.name);
  };

  const handleCreatePost = (newPost: {
    content: string;
    category: 'question' | 'tip' | 'recommendation' | 'general';
    activityTags: string[];
    locationId: string;
  }) => {
    const post: ForumPost = {
      id: `user-post-${Date.now()}`,
      authorId: 'current-user',
      authorName: 'You',
      authorInitials: 'YU',
      authorColor: '#3B82F6',
      content: newPost.content,
      locationId: newPost.locationId,
      countryId: country.id,
      timestamp: 'now',
      replyCount: 0,
      likes: 0,
      isLiked: false,
      category: newPost.category,
      activityTags: newPost.activityTags,
    };

    setForumPosts(prev => [post, ...prev]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: themeColors.background }}>
      <StatusBar 
        barStyle={themeColors.isDark ? "light-content" : "dark-content"} 
        backgroundColor={themeColors.background}
      />
      <ScrollView 
        style={{ flex: 1 }} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Header Area with Back Button and Content */}
        <View
          style={{
            backgroundColor: themeColors.isDark 
              ? '#1A2332'
              : '#F8F9FA',
            borderBottomWidth: 0.2,
            borderBottomColor: themeColors.isDark 
              ? 'rgba(255, 255, 255, 0.1)'
              : 'rgba(0, 0, 0, 0.05)',
          }}
        >
          {/* Back Button */}
          <View 
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 8,
              paddingHorizontal: 12,
            }}
          >
            <TouchableOpacity 
              onPress={onBack}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}
              activeOpacity={0.7}
            >
              <ChevronLeft size={20} color={themeColors.text} strokeWidth={2} />
              <Text style={{
                color: themeColors.textSecondary,
                fontSize: 14,
                fontWeight: '600',
                marginLeft: 4,
                fontFamily: 'System',
              }}>
                {continentName}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Country Info */}
          <TouchableOpacity
            onPress={handleMapPress}
            activeOpacity={0.9}
            style={{
              paddingHorizontal: 20,
              paddingTop: 10,
              paddingBottom: 12,
              justifyContent: 'flex-end',
            }}
          >


          {/* Country Name and Stats */}
          <View>
            <Text style={{
              color: themeColors.text,
              fontSize: 32,
              fontWeight: '800',
              letterSpacing: -1,
              fontFamily: 'System',
              marginBottom: 8,
            }}>
              {country.name}
            </Text>

            {/* Stats Row */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Users size={16} color={themeColors.textSecondary} strokeWidth={2} />
                <Text style={{
                  color: themeColors.textSecondary,
                  fontSize: 14,
                  fontWeight: '600',
                  marginLeft: 6,
                  fontFamily: 'System',
                }}>
                  {(memberCount / 1000).toFixed(1)}M members
                </Text>
            </View>
          </View>
        </TouchableOpacity>
        </View>

        {/* Location Filter Tabs - Minimalist Design */}
        <View style={{ marginTop: 20, marginBottom: 20 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 20,
              gap: 24,
            }}
          >
            {locationTabs.map((tab, index) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setSelectedLocationFilter(tab)}
                style={{
                  paddingVertical: 8,
                  alignItems: 'center',
                  position: 'relative',
                }}
                activeOpacity={0.7}
              >
                <Text style={{
                  color: selectedLocationFilter === tab 
                    ? themeColors.text 
                    : themeColors.textSecondary,
                  fontSize: 15,
                  fontWeight: selectedLocationFilter === tab ? '600' : '400',
                  fontFamily: 'System',
                  letterSpacing: -0.2,
                }}>
                  {tab}
                </Text>
                
                {/* Active indicator dot */}
                {selectedLocationFilter === tab && (
                  <View style={{
                    width: 4,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: theme.colors.primary,
                    marginTop: 4,
                  }} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Tab Navigation - Modern Minimalist */}
        <View style={{ 
          marginHorizontal: 20,
          marginBottom: 24,
          marginTop: 8,
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 0,
          }}>
            {['Forum', 'Explore', 'Activities'].map((tab, index) => (
              <TouchableOpacity
                key={tab}
                onPress={() => onTabChange(tab as PodTabType)}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  paddingHorizontal: 4,
                  alignItems: 'center',
                  position: 'relative',
                }}
                activeOpacity={0.7}
              >
                <Text style={{
                  fontSize: 15,
                  fontWeight: activeTab === tab ? '600' : '400',
                  color: activeTab === tab 
                    ? themeColors.text
                    : themeColors.textSecondary,
                  fontFamily: 'System',
                  letterSpacing: -0.2,
                }}>
                  {tab}
                </Text>
                
                {/* Active indicator line */}
                {activeTab === tab && (
                  <View style={{
                    position: 'absolute',
                    bottom: 0,
                    left: '25%',
                    right: '25%',
                    height: 2,
                    backgroundColor: theme.colors.primary,
                    borderRadius: 1,
                  }} />
                )}
              </TouchableOpacity>
            ))}
          </View>
          
          {/* Subtle bottom border */}
          <View style={{
            height: 0.5,
            backgroundColor: themeColors.isDark 
              ? 'rgba(255, 255, 255, 0.06)'
              : 'rgba(0, 0, 0, 0.04)',
            marginTop: 0,
          }} />
        </View>

        {/* Content Area */}
        {activeTab === 'Forum' && (
          <View style={{ marginHorizontal: 20 }}>
            {/* Create Post Button */}
            <TouchableOpacity
              style={{
                backgroundColor: themeColors.isDark 
                  ? 'rgba(255, 255, 255, 0.05)'
                  : 'rgba(0, 0, 0, 0.02)',
                borderRadius: 12,
                padding: 16,
                marginBottom: 20,
                borderWidth: 1,
                borderColor: themeColors.isDark 
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(0, 0, 0, 0.06)',
              }}
              activeOpacity={0.7}
              onPress={() => setShowPostModal(true)}
            >
              <Text style={{
                color: themeColors.textSecondary,
                fontSize: 16,
                fontFamily: 'System',
              }}>
                What's on your mind about {country.name}?
              </Text>
            </TouchableOpacity>

            {/* Dynamic Forum Posts */}
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <View key={post.id} style={{
                  backgroundColor: themeColors.background,
                  borderRadius: 12,
                    padding: 16,
                  marginBottom: 16,
                  borderWidth: 1,
                    borderColor: themeColors.isDark 
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'rgba(0, 0, 0, 0.06)',
                }}>
                  {/* Category and Activity Tags */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 6 }}>
                    {/* Category Tag */}
                    {(() => {
                      const categoryData = FORUM_CATEGORIES.find(cat => cat.id === post.category);
                      return categoryData ? (
                        <View style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          paddingHorizontal: 8,
                          paddingVertical: 4,
                          borderRadius: 12,
                          backgroundColor: categoryData.color,
                        }}>
                          <Text style={{ fontSize: 12, marginRight: 3 }}>{categoryData.emoji}</Text>
                    <Text style={{
                            fontSize: 12,
                            fontWeight: '600',
                            color: 'white',
                      fontFamily: 'System',
                    }}>
                            {categoryData.label}
                    </Text>
                  </View>
                      ) : null;
                    })()}
                    
                    {/* Activity Tags */}
                    {post.activityTags.map((tagId) => {
                      const tagData = FORUM_ACTIVITY_TAGS.find(tag => tag.id === tagId);
                      return tagData ? (
                        <View key={tagId} style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                          borderRadius: 12,
                          backgroundColor: themeColors.isDark 
                            ? 'rgba(255, 255, 255, 0.1)'
                            : 'rgba(0, 0, 0, 0.08)',
                        }}>
                          <Text style={{ fontSize: 12, marginRight: 3 }}>{tagData.emoji}</Text>
                          <Text style={{
                            fontSize: 12,
                            fontWeight: '500',
                            color: themeColors.text,
                            fontFamily: 'System',
                          }}>
                            {tagData.label}
                          </Text>
                        </View>
                      ) : null;
                    })}
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                    <View style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      backgroundColor: post.authorColor,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 12,
                    }}>
                      <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                        {post.authorInitials}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{
                        color: themeColors.text,
                        fontSize: 15,
                        fontWeight: '600',
                        fontFamily: 'System',
                      }}>
                        {post.authorName}
                      </Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                        <MapPin size={12} color={themeColors.textSecondary} />
                        <Text style={{
                          color: themeColors.textSecondary,
                          fontSize: 12,
                          marginLeft: 4,
                          fontFamily: 'System',
                        }}>
                          {getPostLocationDisplay(post, country)} • {post.timestamp}
                        </Text>
                      </View>
                    </View>
                  </View>
                  
                  <Text style={{
                    color: themeColors.text,
                    fontSize: 16,
                    lineHeight: 22,
                    fontFamily: 'System',
                    marginBottom: 12,
                  }}>
                    {post.content}
                  </Text>
                  
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginRight: 20 }}>
                      <MessageCircle size={16} color={themeColors.textSecondary} />
                      <Text style={{
                        color: themeColors.textSecondary,
                        fontSize: 14,
                        marginLeft: 6,
                        fontFamily: 'System',
                      }}>
                        {post.replyCount} replies
                      </Text>
                </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : (
              <View style={{
                alignItems: 'center',
                paddingVertical: 40,
              }}>
                <MessageCircle size={48} color={themeColors.textSecondary} strokeWidth={1} />
                <Text style={{
                  color: themeColors.textSecondary,
                  fontSize: 16,
                  fontWeight: '500',
                  marginTop: 16,
                  fontFamily: 'System',
                }}>
                  {getEmptyStateMessage(selectedLocationFilter).title}
                </Text>
                <Text style={{
                  color: themeColors.textSecondary,
                  fontSize: 14,
                  marginTop: 4,
                  textAlign: 'center',
                  fontFamily: 'System',
                }}>
                  {getEmptyStateMessage(selectedLocationFilter).subtitle}
                </Text>
              </View>
              )}
            </View>
          )}

        {/* Other tab content */}
        {activeTab === 'Explore' && (
          <View style={{ 
            alignItems: 'center', 
            paddingVertical: 40,
            marginHorizontal: 20,
          }}>
              <Text style={{
                color: themeColors.textSecondary,
                fontSize: 16,
                fontFamily: 'System',
              }}>
              Explore content coming soon
              </Text>
            </View>
          )}

        {activeTab === 'Activities' && (
          <View style={{ 
            alignItems: 'center', 
            paddingVertical: 40,
            marginHorizontal: 20,
          }}>
            <Text style={{
              color: themeColors.textSecondary,
              fontSize: 16,
              fontFamily: 'System',
            }}>
              Activities content coming soon
            </Text>
        </View>
        )}
      </ScrollView>
      
      {/* Forum Post Modal */}
      <ForumPostModal
        visible={showPostModal}
        onClose={() => setShowPostModal(false)}
        onSubmit={handleCreatePost}
        country={country}
        defaultLocation={selectedLocationFilter === 'All' ? 'All' : selectedLocationFilter}
      />
    </View>
  );
};

export default CountryViewScreen; 
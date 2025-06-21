import React, { useState, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';

import { Search, MapPin, Globe, ChevronRight, TrendingUp, Sparkles, Users, Plus } from 'lucide-react-native';
import { PodThemeConfig } from '../../../types/structures/podsUIStructure';
import { placesData, Country, Continent } from '../../../constants/placesData';
import { useThemeColors } from '../../../hooks/useThemeColors';

const { width: screenWidth } = Dimensions.get('window');

interface ContinentListScreenProps {
  theme: PodThemeConfig;
  onCountryPress: (country: Country) => void;
}

// Separate component for country card to properly use hooks
const CountryCard: React.FC<{
  country: Country;
  index: number;
  theme: PodThemeConfig;
  themeColors: any;
  onPress: (country: Country) => void;
  userJoinedPods: Set<string>;
  onJoinPod: (countryId: string) => void;
}> = ({ country, index, theme, themeColors, onPress, userJoinedPods, onJoinPod }) => {
  const isPopular = country.subLocations.length > 15;
  const isUserJoined = userJoinedPods.has(country.id);
  const memberCount = Math.floor(Math.random() * 5000 + 100); // Mock member count, will come from Firebase
  const cardAnimation = useRef(new Animated.Value(0)).current;
  const scaleAnimation = useRef(new Animated.Value(1)).current;
  
  React.useEffect(() => {
    Animated.timing(cardAnimation, {
      toValue: 1,
      duration: 400,
      delay: index * 60,
      useNativeDriver: true,
    }).start();
  }, [cardAnimation, index]);

  const handlePressIn = () => {
    Animated.spring(scaleAnimation, {
      toValue: 0.98,
      useNativeDriver: true,
      speed: 50,
      bounciness: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnimation, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 10,
    }).start();
  };
  
  return (
    <Animated.View style={{
      opacity: cardAnimation,
      transform: [
        {
          translateY: cardAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [30, 0],
          })
        },
        { scale: scaleAnimation }
      ]
    }}>
      <TouchableOpacity
        onPress={() => onPress(country)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={{
          marginBottom: 8,
          marginHorizontal: 20,
          borderRadius: 18,
          overflow: 'hidden',
          height: 88,
          position: 'relative',
        }}
        activeOpacity={1}
      >
        {/* Frosted Background Layer */}
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: themeColors.isDark 
            ? 'rgba(26, 35, 50, 0.7)'
            : 'rgba(255, 255, 255, 0.75)',
          borderRadius: 18,
          borderWidth: 0.5,
          borderColor: themeColors.isDark 
            ? 'rgba(255, 255, 255, 0.06)' 
            : 'rgba(0, 0, 0, 0.03)',
        }} />
        
        {/* Subtle gradient overlay */}
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: themeColors.isDark 
            ? 'rgba(40, 40, 40, 0.03)' 
            : 'rgba(240, 240, 240, 0.03)',
          borderRadius: 18,
        }} />

        {/* Popular Badge Glow Effect */}
        {isPopular && (
          <View style={{
            position: 'absolute',
            right: -40,
            top: -40,
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: theme.colors.primary,
            opacity: 0.06,
          }} />
        )}

        {/* Content */}
        <View style={{ 
          flex: 1,
          paddingHorizontal: 20,
          paddingVertical: 18,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <View style={{ flex: 1, marginRight: 12 }}>
            {/* Country Name */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Text 
                style={{ 
                  color: themeColors.text,
                  fontSize: 20,
                  fontWeight: '700',
                  letterSpacing: -0.6,
                  fontFamily: 'System',
                  lineHeight: 24,
                }}
                numberOfLines={1}
              >
                {country.name}
              </Text>
              
              {/* Join Button */}
              {!isUserJoined && (
                <TouchableOpacity
                  onPress={() => onJoinPod(country.id)}
                  style={{
                    marginLeft: 8,
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                    borderRadius: 10,
                    backgroundColor: theme.colors.primary,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={{
                    color: 'white',
                    fontSize: 9,
                    fontWeight: '700',
                    fontFamily: 'System',
                    letterSpacing: 0.2,
                    textTransform: 'uppercase',
                  }}>
                    Join
                  </Text>
                </TouchableOpacity>
              )}
              
              {/* Popular Badge */}
              {isPopular && (
                <View style={{
                  marginLeft: isUserJoined ? 10 : 8,
                  backgroundColor: themeColors.isDark 
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(0, 0, 0, 0.06)',
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  borderRadius: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                  <Sparkles size={10} color={theme.colors.primary} strokeWidth={3} />
                  <Text style={{
                    color: theme.colors.primary,
                    fontSize: 10,
                    fontWeight: '700',
                    marginLeft: 4,
                    fontFamily: 'System',
                    letterSpacing: 0.4,
                    textTransform: 'uppercase',
                  }}>
                    Hot
                  </Text>
                </View>
              )}
            </View>
            
            {/* Stats */}
            <View style={{ 
              flexDirection: 'row', 
              alignItems: 'center',
              opacity: 0.7,
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  backgroundColor: themeColors.isDark 
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'rgba(0, 0, 0, 0.04)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 6,
                }}>
                  <Users 
                    size={10} 
                    color={theme.colors.textSecondary} 
                    strokeWidth={2.5}
                  />
                </View>
                <Text 
                  style={{ 
                    color: theme.colors.textSecondary,
                    fontSize: 13,
                    fontWeight: '500',
                    fontFamily: 'System',
                    letterSpacing: -0.1,
                  }}
                >
                  {memberCount.toLocaleString()} members
                </Text>
              </View>
              
              <View style={{
                width: 3,
                height: 3,
                borderRadius: 1.5,
                backgroundColor: theme.colors.textSecondary,
                marginHorizontal: 10,
                opacity: 0.3,
              }} />
              
              <Text style={{
                color: theme.colors.textSecondary,
                fontSize: 13,
                fontWeight: '500',
                fontFamily: 'System',
                letterSpacing: -0.1,
              }}>
                {Math.floor(Math.random() * 500 + 50)}K posts
              </Text>
            </View>
          </View>

          {/* Arrow Button */}
          <View style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: themeColors.isDark 
              ? 'rgba(255, 255, 255, 0.06)'
              : 'rgba(0, 0, 0, 0.03)',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <ChevronRight 
              size={18} 
              color={theme.colors.textSecondary} 
              strokeWidth={2.5}
            />
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const ContinentListScreen: React.FC<ContinentListScreenProps> = ({
  theme,
  onCountryPress,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeContinent, setActiveContinent] = useState(0);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const searchAnimation = useRef(new Animated.Value(0)).current;
  const tabScrollRef = useRef<ScrollView>(null);

  const themeColors = useThemeColors();

  // Memoize tabs to prevent re-rendering
  const allTabs = useMemo(() => [
    { id: 'for-you', name: 'For You' },
    ...placesData
  ], []);

  // User membership state (ready for multi-user implementation)
  const [userJoinedPods, setUserJoinedPods] = useState<Set<string>>(new Set());
  // Track recently joined pods (won't be sorted until page reload/navigation)
  const [recentlyJoinedPods, setRecentlyJoinedPods] = useState<Set<string>>(new Set());
  
  // Mock current user ID (ready for Firebase integration)
  const currentUserId = "third_camacho"; // This will come from auth context later

  // Clear recently joined pods when switching tabs (so they move to top when returning)
  React.useEffect(() => {
    // Clear recently joined when active continent changes
    // This allows joined countries to move to top when switching tabs
    setRecentlyJoinedPods(new Set());
  }, [activeContinent]);

  // Simple tab change handler
  const handleContinentChange = React.useCallback((index: number) => {
    setActiveContinent(index);
    setSearchQuery(''); // Clear search when switching continents
  }, []);
  
  // Join pod function (ready for Firebase implementation)
  const handleJoinPod = async (countryId: string) => {
    try {
      // Future Firebase implementation:
      // await firestore().collection('userPods').doc(currentUserId).update({
      //   joinedPods: firestore.FieldValue.arrayUnion(countryId)
      // });
      
      // Update local state - add to both joined and recently joined
      setUserJoinedPods(prev => new Set([...prev, countryId]));
      setRecentlyJoinedPods(prev => new Set([...prev, countryId]));
      
      // TODO: Also update pod member count in Firebase
      // await firestore().collection('pods').doc(countryId).update({
      //   memberCount: firestore.FieldValue.increment(1),
      //   members: firestore.FieldValue.arrayUnion(currentUserId)
      // });
      
    } catch (error) {
      console.error('Error joining pod:', error);
    }
  };

  // Search expand/collapse functions
  const expandSearch = () => {
    setIsSearchExpanded(true);
    Animated.timing(searchAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const collapseSearch = () => {
    if (searchQuery === '') {
      setIsSearchExpanded(false);
      Animated.timing(searchAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  // Filter countries based on search and active continent
  const filteredCountries = useMemo(() => {
    let countries = [];
    
    // For You tab - show trending pods from all continents
    if (activeContinent === 0) {
      // Get all countries from all continents
      const allCountries = placesData.reduce((acc, continent) => {
        return [...acc, ...continent.countries];
      }, [] as Country[]);
      
      // Featured countries for For You section (all should now be "hot" with 15+ destinations)
      const featuredCountryIds = ['ph', 'jp', 'kr', 'id', 'us', 'ch'];
      
      // Filter for trending countries (popular ones) or featured countries
      countries = allCountries.filter(country => 
        country.subLocations.length > 15 || featuredCountryIds.includes(country.id)
      );
      
      // Sort: Hot countries (15+ destinations) first, then featured countries
      countries.sort((a, b) => {
        const aIsHot = a.subLocations.length > 15;
        const bIsHot = b.subLocations.length > 15;
        
        if (aIsHot && !bIsHot) return -1;
        if (!aIsHot && bIsHot) return 1;
        
        // If both are hot or both are featured, sort by destination count (descending)
        return b.subLocations.length - a.subLocations.length;
      });
    } else {
      // Regular continent view
      const continent = placesData[activeContinent - 1]; // Subtract 1 because "For You" is index 0
      if (!continent) return [];
      countries = continent.countries;
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      countries = countries.filter(country =>
        country.name.toLowerCase().includes(query) ||
        country.subLocations.some(loc => 
          loc.name.toLowerCase().includes(query)
        )
      );
    }

    // Final sorting: 
    // 1. Joined countries first (but exclude recently joined to prevent instant reordering)
    // 2. For "For You" tab: Hot countries (15+ destinations) before featured countries
    // 3. Within same category: by destination count (descending)
    return countries.sort((a, b) => {
      const aJoined = userJoinedPods.has(a.id) && !recentlyJoinedPods.has(a.id);
      const bJoined = userJoinedPods.has(b.id) && !recentlyJoinedPods.has(b.id);
      
      // Joined countries always come first
      if (aJoined && !bJoined) return -1;
      if (!aJoined && bJoined) return 1;
      
      // If both have same join status, maintain the existing order
      // (For You tab already sorted by hot/featured, other tabs keep original order)
      return 0;
    });
  }, [searchQuery, activeContinent, userJoinedPods]);

  const renderCountryCard = ({ item: country, index }: { item: Country; index: number }) => {
    return (
      <CountryCard
        country={country}
        index={index}
        theme={theme}
        themeColors={themeColors}
        onPress={onCountryPress}
        userJoinedPods={userJoinedPods}
        onJoinPod={handleJoinPod}
      />
    );
  };

  const renderContinentTab = React.useCallback((continent: Continent | { id: string; name: string }, index: number) => {
    const isActive = activeContinent === index;
    
    return (
      <TouchableOpacity
        key={continent.id}
        onPress={() => handleContinentChange(index)}
        style={{
          paddingHorizontal: 16,
          paddingVertical: 10,
          backgroundColor: isActive 
            ? theme.colors.primary 
            : 'transparent',
          borderRadius: 20,
          marginRight: 8,
          borderWidth: isActive ? 0 : 1,
          borderColor: themeColors.isDark 
            ? 'rgba(255, 255, 255, 0.08)' 
            : 'rgba(0, 0, 0, 0.05)',
        }}
        activeOpacity={0.7}
      >
        <Text 
          style={{ 
            color: isActive ? '#FFFFFF' : theme.colors.textSecondary,
            fontSize: 14,
            fontWeight: isActive ? '700' : '500',
            fontFamily: 'System',
            letterSpacing: -0.1,
          }}
        >
          {continent.name}
        </Text>
      </TouchableOpacity>
    );
  }, [activeContinent, theme.colors.primary, theme.colors.textSecondary, themeColors.isDark, handleContinentChange]);

  // Header animations
  const headerTranslate = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [0, -40],
    extrapolate: 'clamp',
  });

  const ListEmptyComponent = () => (
    <View style={{ 
      paddingTop: 80, 
      alignItems: 'center', 
      paddingHorizontal: 40 
    }}>
      <View style={{
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: themeColors.isDark 
          ? 'rgba(26, 35, 50, 0.4)'
          : 'rgba(248, 249, 250, 0.7)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
      }}>
        <Search size={28} color={themeColors.textSecondary} strokeWidth={1.5} />
      </View>
      <Text style={{ 
        color: themeColors.text, 
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 8,
        letterSpacing: -0.5,
        fontFamily: 'System',
      }}>
        No results found
      </Text>
      <Text style={{ 
        color: themeColors.textSecondary, 
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
        fontWeight: '400',
        fontFamily: 'System',
        letterSpacing: -0.1,
      }}>
        Try searching with different keywords or explore another continent
      </Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: themeColors.background }}>
      {/* Fixed Header Section */}
      <Animated.View style={{ 
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 4,
        transform: [{ translateY: headerTranslate }],
      }}>
        {/* Header with Title and Search */}
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: 20,
        }}>
          {/* Title Section */}
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              <Text 
                style={{ 
                  color: themeColors.text,
                  fontSize: 36,
                  fontWeight: '800',
                  letterSpacing: -1.5,
                  fontFamily: 'System',
                  lineHeight: 40,
                }}
              >
                Pods
              </Text>
              <View style={{
                marginLeft: 10,
                backgroundColor: theme.colors.primary,
                width: 8,
                height: 8,
                borderRadius: 4,
              }} />
            </View>
            <Text 
              style={{ 
                color: themeColors.textSecondary,
                fontSize: 15,
                fontWeight: '400',
                letterSpacing: -0.2,
                fontFamily: 'System',
                lineHeight: 20,
              }}
            >
              Communities by Destination
            </Text>
          </View>

          {/* Compact Search */}
          <Animated.View style={{
            width: searchAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [40, 200],
            }),
            height: 40,
            position: 'relative',
          }}>
            {/* Search Background */}
            <View style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: themeColors.isDark 
                ? 'rgba(26, 35, 50, 0.7)'
                : 'rgba(248, 249, 250, 0.8)',
              borderRadius: 20,
              borderWidth: 0.5,
              borderColor: themeColors.isDark 
                ? 'rgba(255, 255, 255, 0.06)' 
                : 'rgba(0, 0, 0, 0.03)',
            }} />
            
            {!isSearchExpanded ? (
              // Search Icon Button
              <TouchableOpacity
                onPress={expandSearch}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                activeOpacity={0.7}
              >
                <Search 
                  size={18} 
                  color={themeColors.textSecondary} 
                  strokeWidth={2} 
                />
              </TouchableOpacity>
            ) : (
              // Expanded Search Input
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 14,
                height: 40,
              }}>
                <Search 
                  size={16} 
                  color={themeColors.textSecondary} 
                  strokeWidth={2} 
                />
                <TextInput
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder={activeContinent === 0 ? "Search trending..." : "Search..."}
                  placeholderTextColor={themeColors.textSecondary}
                  style={{
                    flex: 1,
                    marginLeft: 8,
                    fontSize: 14,
                    color: themeColors.text,
                    fontWeight: '400',
                    fontFamily: 'System',
                  }}
                  autoFocus
                  returnKeyType="search"
                  onBlur={collapseSearch}
                  clearButtonMode="while-editing"
                />
              </View>
            )}
          </Animated.View>
        </View>
      </Animated.View>

      {/* Fixed Continent Tabs */}
      <View style={{ marginBottom: 12 }}>
        <ScrollView
          ref={tabScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
          }}
          style={{ 
            flexGrow: 0,
          }}
          scrollsToTop={false}
          automaticallyAdjustContentInsets={false}
          keyboardShouldPersistTaps="handled"
        >
          {allTabs.map((continent, index) => renderContinentTab(continent, index))}
        </ScrollView>
      </View>

      {/* Fixed Active Continent Info */}
      <View style={{
        marginHorizontal: 20,
        marginBottom: 12,
      }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <View style={{
            width: 4,
            height: 4,
            borderRadius: 2,
            backgroundColor: theme.colors.primary,
            marginRight: 8,
          }} />
          <Text style={{
            fontSize: 11,
            color: themeColors.textSecondary,
            fontWeight: '600',
            fontFamily: 'System',
            textTransform: 'uppercase',
            letterSpacing: 0.6,
          }}>
            {activeContinent === 0 
              ? `For You • ${filteredCountries.length} Trending` 
              : `${placesData[activeContinent - 1].name} • ${filteredCountries.length} Countries`
            }
          </Text>
        </View>
      </View>

      {/* Countries List */}
      <FlatList
        data={filteredCountries}
        renderItem={renderCountryCard}
        ListEmptyComponent={ListEmptyComponent}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ 
          paddingBottom: 30,
          flexGrow: 1 
        }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        // Performance optimizations
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
        removeClippedSubviews={true}
        getItemLayout={(data, index) => ({
          length: 96, // 88px height + 8px margin
          offset: 96 * index,
          index,
        })}
      />
    </View>
  );
};

export default ContinentListScreen;
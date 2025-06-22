import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Animated,
  Dimensions,
  ScrollView,
  Modal,
  StatusBar,
} from 'react-native';

import { Search, Globe, ChevronRight, TrendingUp, Sparkles, Users, Plus, X, ArrowLeft, Bell, BellOff } from 'lucide-react-native';
import { PodThemeConfig } from '../../../types/structures/podsUIStructure';
import { placesData, Country, Continent } from '../../../constants/placesData';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { useJoinedPods } from '../../../store/JoinedPodsContext';

const { width: screenWidth } = Dimensions.get('window');

interface ContinentListScreenProps {
  theme: PodThemeConfig;
  onCountryPress: (country: Country) => void;
  initialActiveContinent?: number;
  onTabChange?: (tabIndex: number) => void;
  onDoubleTabPress?: () => void;
  resetKey?: number;
}

// Separate component for country card to properly use hooks
const CountryCard: React.FC<{
  country: Country;
  index: number;
  theme: PodThemeConfig;
  themeColors: any;
  onPress: (country: Country) => void;
  isPodJoined: (podId: string) => boolean;
  onJoinPod: (countryId: string) => void;
}> = ({ country, index, theme, themeColors, onPress, isPodJoined, onJoinPod }) => {
  const isPopular = country.subLocations.length > 15;
  const isUserJoined = isPodJoined(country.id);
  // Generate consistent member count based on country ID (won't change on re-renders)
  const memberCount = Math.floor((country.id.charCodeAt(0) * country.id.charCodeAt(country.id.length - 1) * 37) % 5000 + 100);
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
                  <Sparkles size={10} color="#FF4500" strokeWidth={3} />
                    <Text style={{ 
                    color: "#FF4500",
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
  initialActiveContinent = 0,
  onTabChange,
  onDoubleTabPress,
  resetKey = 0,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeContinent, setActiveContinent] = useState(initialActiveContinent);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isJoinedPodsVisible, setIsJoinedPodsVisible] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const searchAnimation = useRef(new Animated.Value(0)).current;
  const slideAnimation = useRef(new Animated.Value(-screenWidth * 0.75)).current;
  const overlayAnimation = useRef(new Animated.Value(0)).current;
  const tabScrollRef = useRef<FlatList>(null);
  const flatListRef = useRef<FlatList>(null);

  const themeColors = useThemeColors();

  // Use JoinedPodsContext for session persistence
  const { 
    joinPod, 
    isPodJoined, 
    joinedPods,
    togglePodNotifications,
    isPodNotificationsEnabled 
  } = useJoinedPods();

  // Memoize tabs to prevent re-rendering
  const allTabs = useMemo(() => [
    { id: 'for-you', name: 'For You' },
    ...placesData
  ], []);

  // Track recently joined pods (won't be sorted until screen reset)
  const [recentlyJoinedPods, setRecentlyJoinedPods] = useState<Set<string>>(new Set());

  // Update active continent when initialActiveContinent changes (for proper back navigation)
  useEffect(() => {
    setActiveContinent(initialActiveContinent);
  }, [initialActiveContinent]);

  // Reset screen completely when resetKey changes (from double-tap)
  useEffect(() => {
    if (resetKey > 0) {
      // Full screen reset - clear all temporary states
      setActiveContinent(0);
      setSearchQuery('');
      setIsSearchExpanded(false);
      setIsJoinedPodsVisible(false);
      setRecentlyJoinedPods(new Set()); // Clear recently joined - joined countries will move to top
      
      // Reset scroll positions
      if (flatListRef.current) {
        flatListRef.current.scrollToOffset({ offset: 0, animated: true });
      }
      if (tabScrollRef.current) {
        tabScrollRef.current.scrollToOffset({ offset: 0, animated: true });
      }
    }
  }, [resetKey]);

  // Persist active continent when it changes
  useEffect(() => {
    if (onTabChange) {
      onTabChange(activeContinent);
    }
  }, [activeContinent]);

  // Clear recently joined pods when switching tabs (so they move to top when returning)
  React.useEffect(() => {
    // Clear recently joined when active continent changes
    // This allows joined countries to move to top when switching tabs
    setRecentlyJoinedPods(new Set());
  }, [activeContinent]);

  // Enhanced tab change handler with state persistence
  const handleContinentChange = React.useCallback((index: number) => {
    setActiveContinent(index);
    setSearchQuery(''); // Clear search when switching continents
    
    // Scroll to top when changing tabs
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  }, []);

  // Double-tap handler for "For You" tab reset
  const handleDoubleTabPress = React.useCallback(() => {
    if (onDoubleTabPress) {
      onDoubleTabPress();
    }
    
    // Reset to "For You" tab and scroll to top
    setActiveContinent(0);
    setSearchQuery('');
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: true });
    }
    
    // Scroll tabs to beginning
          if (tabScrollRef.current) {
        tabScrollRef.current.scrollToOffset({ offset: 0, animated: true });
      }
  }, [onDoubleTabPress]);
  
  // Enhanced join pod function with session persistence using context
  const handleJoinPod = async (countryId: string) => {
    try {
      // Use context function for session persistence
      joinPod(countryId);
      
      // Add to recently joined for UI sorting
      setRecentlyJoinedPods(prev => new Set([...prev, countryId]));
      
    } catch (error) {
      console.error('Error joining pod:', error);
    }
  };

  // Show/Hide Joined Pods Modal
  const showJoinedPods = () => {
    setIsJoinedPodsVisible(true);
    Animated.parallel([
      Animated.timing(slideAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(overlayAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const hideJoinedPods = () => {
    Animated.parallel([
      Animated.timing(slideAnimation, {
        toValue: -screenWidth * 0.75,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(overlayAnimation, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsJoinedPodsVisible(false);
    });
  };

  const hideJoinedPodsAndNavigate = (country: Country) => {
    Animated.parallel([
      Animated.timing(slideAnimation, {
        toValue: -screenWidth * 0.75,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(overlayAnimation, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsJoinedPodsVisible(false);
      // Wait for React to finish state updates before navigating
      setTimeout(() => {
        onCountryPress(country);
      }, 100);
    });
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

  // Define regional groupings for MVP countries
  const regionalGroups = useMemo(() => ({
    'asia': {
      'Southeast Asia (SEA)': ['ph', 'sg', 'th', 'id', 'my', 'vn', 'kh'],
      'East Asia': ['jp', 'kr', 'tw', 'hk', 'cn'],
      'South Asia': ['mv'],
      'West Asia / Middle East': ['ae', 'sa', 'tr']
    },
    'europe': {
      'Western Europe': ['fr', 'nl', 'gb', 'de', 'ch', 'at'],
      'Southern Europe': ['it', 'es', 'pt', 'gr'],
      'Eastern & Central Europe': ['pl', 'cz'],
      'Nordic Countries': ['is', 'no', 'se', 'dk', 'fi'],
      'Microstates': ['mc']
    },
    'north-america': {
      'North America': ['us', 'ca', 'mx']
    },
    'south-america': {
      'South America': ['br', 'ar', 'pe']
    },
    'africa': {
      'Africa': ['za', 'eg', 'ke', 'ma']
    },
    'oceania': {
      'Oceania / Pacific': ['au', 'nz']
    }
  }), []);

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

    // Enhanced search filter - now searches all places in pods
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      countries = countries.filter(country => {
        // Search country name
        if (country.name.toLowerCase().includes(query)) {
          return true;
        }
        
        // Search all sub-locations (cities, regions, landmarks)
        const hasMatchingLocation = country.subLocations.some(loc => {
          // Search location name
          if (loc.name.toLowerCase().includes(query)) {
            return true;
          }
          
          // Search alternate names if available
          if (loc.alternateNames && loc.alternateNames.some((alt: string) => 
            alt.toLowerCase().includes(query)
          )) {
            return true;
          }
          
          return false;
        });
        
        return hasMatchingLocation;
      });
    }

    // Final sorting: 
    // 1. Joined countries first (but exclude recently joined to prevent instant reordering)
    // 2. For "For You" tab: Hot countries (15+ destinations) before featured countries
    // 3. Within same category: by destination count (descending)
    return countries.sort((a, b) => {
      const aJoined = isPodJoined(a.id) && !recentlyJoinedPods.has(a.id);
      const bJoined = isPodJoined(b.id) && !recentlyJoinedPods.has(b.id);
      
      // Joined countries always come first
      if (aJoined && !bJoined) return -1;
      if (!aJoined && bJoined) return 1;
      
      // If both have same join status, maintain the existing order
      // (For You tab already sorted by hot/featured, other tabs keep original order)
      return 0;
    });
  }, [searchQuery, activeContinent, isPodJoined, recentlyJoinedPods]);

  // Get joined countries for the modal
  const joinedCountries = useMemo(() => {
    const allCountries = placesData.reduce((acc, continent) => {
      return [...acc, ...continent.countries];
    }, [] as Country[]);
    
    return allCountries.filter(country => isPodJoined(country.id));
  }, [isPodJoined]);

  // Helper function to get regional group for a country
  const getRegionalGroup = (country: Country, continentId: string): string | null => {
    const groups = regionalGroups[continentId as keyof typeof regionalGroups];
    if (!groups) return null;
    
    for (const [groupName, countryIds] of Object.entries(groups)) {
      if (countryIds.includes(country.id)) {
        return groupName;
      }
    }
    return null;
  };

  // Create grouped countries data for rendering with headers
  const groupedCountries = useMemo(() => {
    if (activeContinent === 0 || searchQuery) {
      // For "For You" tab or when searching, don't show groups
      return filteredCountries.map(country => ({ type: 'country' as const, country }));
    }

    const continent = placesData[activeContinent - 1];
    if (!continent) return [];

    const groups = regionalGroups[continent.id as keyof typeof regionalGroups];
    if (!groups) {
      // No regional groups defined, show countries normally
      return filteredCountries.map(country => ({ type: 'country' as const, country }));
    }

    const result: Array<{ type: 'header' | 'country'; groupName?: string; country?: Country }> = [];
    
    Object.entries(groups).forEach(([groupName, countryIds]) => {
      const groupCountries = filteredCountries.filter(country => countryIds.includes(country.id));
      
      if (groupCountries.length > 0) {
        // Add group header
        result.push({ type: 'header', groupName });
        
        // Add countries in this group
        groupCountries.forEach(country => {
          result.push({ type: 'country', country });
        });
      }
    });

    return result;
  }, [filteredCountries, activeContinent, searchQuery, regionalGroups]);

  // Enhanced renderJoinedPodItem with notification toggle
  const renderJoinedPodItem = ({ item: country, index }: { item: Country; index: number }) => {
    // Generate consistent member count based on country ID (won't change on re-renders)
    const memberCount = Math.floor((country.id.charCodeAt(0) * country.id.charCodeAt(country.id.length - 1) * 37) % 5000 + 100);
    const continent = placesData.find(cont => cont.countries.some(c => c.id === country.id));
    const notificationsEnabled = isPodNotificationsEnabled(country.id);
    
    return (
      <View
        style={{
          marginBottom: 12,
          marginHorizontal: 16,
          borderRadius: 16,
          overflow: 'hidden',
          backgroundColor: themeColors.isDark 
            ? 'rgba(26, 35, 50, 0.6)'
            : 'rgba(255, 255, 255, 0.8)',
          borderWidth: 0.5,
          borderColor: themeColors.isDark 
            ? 'rgba(255, 255, 255, 0.06)' 
            : 'rgba(0, 0, 0, 0.03)',
        }}
      >
        <View style={{
          paddingHorizontal: 16,
          paddingVertical: 14,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
            <TouchableOpacity
              onPress={() => hideJoinedPodsAndNavigate(country)}
              style={{ flex: 1 }}
              activeOpacity={0.7}
            >
              <Text style={{
                color: themeColors.text,
                fontSize: 16,
                fontWeight: '700',
                fontFamily: 'System',
                letterSpacing: -0.3,
              }}>
                {country.name}
              </Text>
            </TouchableOpacity>
            
            {/* Enhanced Notification Toggle - More obvious it's pressable */}
            <TouchableOpacity
              onPress={() => togglePodNotifications(country.id)}
              style={{
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 12,
                backgroundColor: notificationsEnabled 
                  ? theme.colors.primary + '15' 
                  : themeColors.isDark 
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'rgba(0, 0, 0, 0.04)',
                flexDirection: 'row',
                alignItems: 'center',
              }}
              activeOpacity={0.7}
            >
              {notificationsEnabled ? (
                <Bell 
                  size={12} 
                  color={theme.colors.primary} 
                  strokeWidth={2.5}
                />
              ) : (
                <BellOff 
                  size={12} 
                  color={themeColors.textSecondary} 
                  strokeWidth={2.5}
                />
              )}
              <Text style={{
                color: notificationsEnabled ? theme.colors.primary : themeColors.textSecondary,
                fontSize: 10,
                fontWeight: '600',
                fontFamily: 'System',
                marginLeft: 4,
              }}>
                {notificationsEnabled ? 'ON' : 'OFF'}
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <Text style={{
              color: themeColors.textSecondary,
              fontSize: 12,
              fontWeight: '500',
              fontFamily: 'System',
            }}>
              {continent?.name || 'Unknown'}
            </Text>
            <View style={{
              width: 2,
              height: 2,
              borderRadius: 1,
              backgroundColor: themeColors.textSecondary,
              marginHorizontal: 8,
              opacity: 0.5,
            }} />
            <Text style={{
              color: themeColors.textSecondary,
              fontSize: 12,
              fontWeight: '500',
              fontFamily: 'System',
            }}>
              {memberCount.toLocaleString()} members
            </Text>
          </View>
          
          <Text style={{
            color: themeColors.textSecondary,
            fontSize: 11,
            fontWeight: '400',
            fontFamily: 'System',
            opacity: 0.7,
          }}>
            {country.subLocations.length} destinations
          </Text>
        </View>
      </View>
    );
  };

  const renderCountryCard = ({ item: country, index }: { item: Country; index: number }) => {
    return (
      <CountryCard
        country={country}
        index={index}
        theme={theme}
        themeColors={themeColors}
        onPress={onCountryPress}
        isPodJoined={isPodJoined}
        onJoinPod={handleJoinPod}
      />
    );
  };

  // Render function for grouped items (headers + countries)
  const renderGroupedItem = ({ item, index }: { item: any; index: number }) => {
    if (item.type === 'header') {
      return (
        <View style={{
          marginHorizontal: 20,
          marginTop: index === 0 ? 0 : 16,
          marginBottom: 8,
        }}>
          <Text style={{
            color: themeColors.textSecondary,
            fontSize: 11,
            fontWeight: '600',
            fontFamily: 'System',
            textTransform: 'uppercase',
            letterSpacing: 0.8,
            opacity: 0.7,
          }}>
            {item.groupName}
          </Text>
        </View>
      );
    } else {
      // Calculate the country index for animations (excluding headers)
      const countryIndex = groupedCountries.slice(0, index).filter(i => i.type === 'country').length;
      return (
        <CountryCard
          country={item.country}
          index={countryIndex}
          theme={theme}
          themeColors={themeColors}
          onPress={onCountryPress}
          isPodJoined={isPodJoined}
          onJoinPod={handleJoinPod}
        />
      );
    }
  };

  // Enhanced renderContinentTab with double-tap detection
  const renderContinentTab = React.useCallback((continent: Continent | { id: string; name: string }, index: number) => {
    const isActive = activeContinent === index;
    
    return (
      <TouchableOpacity
        onPress={() => {
          if (index === 0 && activeContinent === 0) {
            // Double-tap "For You" tab - trigger double-tap handler
            handleDoubleTabPress();
          } else {
            handleContinentChange(index);
          }
        }}
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
            ? 'rgba(255, 255, 255, 0.15)' 
            : 'rgba(0, 0, 0, 0.12)',
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
  }, [activeContinent, theme.colors.primary, theme.colors.textSecondary, themeColors.isDark, handleContinentChange, handleDoubleTabPress]);

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
      <StatusBar 
        barStyle={themeColors.isDark ? "light-content" : "dark-content"} 
        backgroundColor={themeColors.background}
      />
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
              <TouchableOpacity
                onPress={showJoinedPods}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 4,
                  paddingRight: 8,
                }}
                activeOpacity={0.7}
              >
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
                
                {/* Joined count indicator */}
                {joinedCountries.length > 0 && (
                  <View style={{
                    marginLeft: 6,
                    minWidth: 20,
                    height: 20,
                    borderRadius: 10,
                    backgroundColor: theme.colors.primary,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 6,
                  }}>
                    <Text style={{
                      color: 'white',
                      fontSize: 10,
                      fontWeight: '700',
                      fontFamily: 'System',
                    }}>
                      {joinedCountries.length}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
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

      {/* Fixed Continent Tabs - Replace ScrollView with horizontal FlatList */}
      <View style={{ marginBottom: 12 }}>
        <FlatList
          ref={tabScrollRef}
          data={allTabs}
          renderItem={({ item: continent, index }) => renderContinentTab(continent, index)}
          keyExtractor={(item, index) => `tab-${index}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
          }}
          style={{ 
            flexGrow: 0,
          }}
          scrollsToTop={false}
          keyboardShouldPersistTaps="handled"
        />
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

      {/* Countries List with ref for scroll control */}
      <FlatList
        ref={flatListRef}
        data={groupedCountries}
        renderItem={renderGroupedItem}
        ListEmptyComponent={ListEmptyComponent}
        keyExtractor={(item, index) => item.type === 'header' ? `header-${item.groupName}` : `country-${item.country?.id}`}
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
        // Remove getItemLayout since we have variable heights now (headers vs countries)
      />

      {/* Joined Pods Modal */}
      <Modal
        visible={isJoinedPodsVisible}
        transparent
        animationType="none"
        onRequestClose={hideJoinedPods}
      >
        {/* Overlay */}
        <Animated.View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          opacity: overlayAnimation,
        }}>
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={hideJoinedPods}
          />
        </Animated.View>

        {/* Slide-in Panel */}
        <Animated.View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: screenWidth * 0.75,
          backgroundColor: themeColors.background,
          transform: [{ translateX: slideAnimation }],
          shadowColor: '#000',
          shadowOffset: { width: 2, height: 0 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 5,
        }}>
          {/* Header */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingTop: 60,
            paddingBottom: 20,
            borderBottomWidth: 0.5,
            borderBottomColor: themeColors.isDark 
              ? 'rgba(255, 255, 255, 0.06)' 
              : 'rgba(0, 0, 0, 0.03)',
          }}>
            <View style={{ flex: 1 }}>
              <Text style={{
                color: themeColors.text,
                fontSize: 24,
                fontWeight: '800',
                fontFamily: 'System',
                letterSpacing: -0.8,
                marginBottom: 2,
              }}>
                My Pods
              </Text>
              <Text style={{
                color: themeColors.textSecondary,
                fontSize: 13,
                fontWeight: '400',
                fontFamily: 'System',
                letterSpacing: -0.1,
              }}>
                {joinedCountries.length === 0 
                  ? 'No joined communities yet' 
                  : `${joinedCountries.length} joined ${joinedCountries.length === 1 ? 'community' : 'communities'}`
                }
              </Text>
            </View>
            
            <TouchableOpacity
              onPress={hideJoinedPods}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: themeColors.isDark 
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(0, 0, 0, 0.04)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              activeOpacity={0.7}
            >
              <X size={18} color={themeColors.textSecondary} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          {joinedCountries.length === 0 ? (
            <View style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 40,
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
                <Users size={32} color={themeColors.textSecondary} strokeWidth={1.5} />
              </View>
              <Text style={{
                color: themeColors.text,
                fontSize: 18,
                fontWeight: '700',
                fontFamily: 'System',
                letterSpacing: -0.4,
                marginBottom: 8,
                textAlign: 'center',
              }}>
                No Communities Yet
              </Text>
              <Text style={{
                color: themeColors.textSecondary,
                fontSize: 14,
                fontWeight: '400',
                fontFamily: 'System',
                letterSpacing: -0.1,
                textAlign: 'center',
                lineHeight: 20,
              }}>
                Start exploring and join communities that match your interests
              </Text>
            </View>
          ) : (
            <FlatList
              data={joinedCountries}
              renderItem={renderJoinedPodItem}
              keyExtractor={(item) => `joined-${item.id}`}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingTop: 20,
                paddingBottom: 40,
              }}
              // Performance optimizations
              initialNumToRender={8}
              maxToRenderPerBatch={8}
              windowSize={8}
              removeClippedSubviews={true}
            />
          )}
        </Animated.View>
      </Modal>
    </View>
  );
};

export default ContinentListScreen;
// Refactored CountryViewScreen - Clean, focused, and scalable

import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  StatusBar,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { ChevronLeft, Map, Users, Bell, BellRing, UserPlus, UserMinus, Search, X } from 'lucide-react-native';
import { 
  PodThemeConfig, 
  PodTabType, 
} from '../../../types/structures/podsUIStructure';
import { Country, SubLocation } from '../../../constants/placesData';
import { ForumPostsList } from './Forum/ForumPostsList';
import { LocationFilter } from './Forum/forumTypes';
import { ForumAPI } from './Forum/forumAPI';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { useJoinedPods } from '../../../store/JoinedPodsContext';

interface CountryViewScreenProps {
  country: Country;
  activeTab: PodTabType;
  onTabChange: (tab: PodTabType) => void;
  onLocationPress: (location: SubLocation) => void;
  onBack: () => void;
  theme: PodThemeConfig;
}

export interface CountryViewScreenRef {
  scrollToTop: () => void;
}

const { width } = Dimensions.get('window');

const CountryViewScreen = forwardRef<CountryViewScreenRef, CountryViewScreenProps>(({
  country,
  activeTab,
  onTabChange,
  onLocationPress,
  onBack,
  theme,
}, ref) => {
  const themeColors = useThemeColors();
  const scrollY = useRef(new Animated.Value(0)).current;
  
  // Forum-specific state
  const [selectedLocationFilter, setSelectedLocationFilter] = useState<LocationFilter>('All');
  
  // Scroll ref for the main content area
  const forumScrollRef = useRef<any>(null);
  
  // ADDED: Search functionality state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchAnimation = useRef(new Animated.Value(0)).current;
  
  // Join/Leave functionality using global context
  const { 
    joinPod, 
    leavePod, 
    isPodJoined, 
    togglePodNotifications, 
    isPodNotificationsEnabled 
  } = useJoinedPods();
  
  const isJoined = isPodJoined(country.id);
  const hasNotifications = isPodNotificationsEnabled(country.id);
  
  const handleJoinLeave = () => {
    if (isJoined) {
      leavePod(country.id);
    } else {
      joinPod(country.id);
    }
  };
  
  const handleNotifications = () => {
    togglePodNotifications(country.id);
  };
  
  // Header color consistency
  const headerColor = themeColors.background;
  
  // Generate member count (consistent based on country ID)
  const memberCount = Math.floor((country.id.charCodeAt(0) * country.id.charCodeAt(country.id.length - 1) * 37) % 5000 + 100);
  
  // Get continent name for breadcrumb
  const getContinentName = (country: Country): string => {
    // This would typically come from your data structure
    // For now, return a default based on common knowledge
    const continentMap: Record<string, string> = {
      'japan': 'Asia',
      'france': 'Europe',
      'brazil': 'South America',
      'egypt': 'Africa',
      'australia': 'Oceania',
    };
    return continentMap[country.id.toLowerCase()] || 'Explore';
  };

  const continentName = getContinentName(country);
  
  // Get location filter tabs
  const locationTabs = ForumAPI.getLocationFilters(country);

  // ADDED: Search functionality
  const expandSearch = () => {
    setIsSearchExpanded(true);
    Animated.timing(searchAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const collapseSearch = () => {
    // RADICAL FIX: Always allow collapse, clear search, dismiss keyboard
    setSearchQuery(''); // Clear the search
    setIsSearchExpanded(false);
    Keyboard.dismiss(); // Dismiss keyboard
    Animated.timing(searchAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  // ADDED: Filter location tabs based on search
  const filteredLocationTabs = React.useMemo(() => {
    if (!searchQuery.trim()) return locationTabs;
    
    const query = searchQuery.toLowerCase();
    return locationTabs.filter(tab => 
      tab.toLowerCase().includes(query) ||
      // Also search in sublocation alternate names if available
      (tab !== 'All' && country.subLocations.some(loc => 
        loc.name.toLowerCase() === tab.toLowerCase() && 
        loc.alternateNames?.some((alt: string) => alt.toLowerCase().includes(query))
      ))
    );
  }, [locationTabs, searchQuery, country.subLocations]);

  const handleMapPress = () => {
    // TODO: Open maps with country location
    // Open maps for country
  };

  // Expose scroll function to parent
  useImperativeHandle(ref, () => ({
    scrollToTop: () => {
      if (forumScrollRef.current?.scrollToTop) {
        forumScrollRef.current.scrollToTop();
      }
    }
  }), []);

  return (
    <TouchableWithoutFeedback onPress={() => {
      // RADICAL FIX: Dismiss keyboard and collapse search on tap outside
      if (isSearchExpanded) {
        collapseSearch();
      } else {
        Keyboard.dismiss();
      }
    }}>
      <View style={{ flex: 1, backgroundColor: themeColors.background }}>
        {/* Header Section */}
        <View
          style={{
            backgroundColor: headerColor,
            borderBottomWidth: 0.2,
            borderBottomColor: themeColors.isDark 
              ? 'rgba(255, 255, 255, 0.1)'
              : 'rgba(0, 0, 0, 0.05)',
          }}
        >
          <StatusBar 
            barStyle={themeColors.isDark ? "light-content" : "dark-content"} 
            backgroundColor={headerColor}
            translucent={false}
          />
          
          {/* Navigation Bar */}
          <View 
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
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
            
            {/* Join/Leave and Notification Controls */}
            <View style={{ flexDirection: 'row', gap: 12 }}>
              {isJoined && (
                <TouchableOpacity
                  onPress={handleNotifications}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 16,
                    backgroundColor: themeColors.isDark 
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'rgba(0, 0, 0, 0.05)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  activeOpacity={0.7}
                >
                  {hasNotifications ? (
                    <BellRing size={16} color={theme.colors.primary} strokeWidth={2} />
                  ) : (
                    <Bell size={16} color={themeColors.textSecondary} strokeWidth={2} />
                  )}
                </TouchableOpacity>
              )}
              
              <TouchableOpacity
                onPress={handleJoinLeave}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 6,
                  borderRadius: 16,
                  backgroundColor: isJoined 
                    ? themeColors.isDark ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.1)'
                    : theme.colors.primary,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 4,
                }}
                activeOpacity={0.7}
              >
                {isJoined ? (
                  <UserMinus size={14} color="#EF4444" strokeWidth={2} />
                ) : (
                  <UserPlus size={14} color="white" strokeWidth={2} />
                )}
                <Text style={{
                  color: isJoined ? '#EF4444' : 'white',
                  fontSize: 13,
                  fontWeight: '600',
                  fontFamily: 'System',
                }}>
                  {isJoined ? 'Leave' : 'Join'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Country Info */}
          <TouchableOpacity
            onPress={handleMapPress}
            activeOpacity={0.9}
            style={{
              paddingHorizontal: 20,
              paddingTop: 10,
              paddingBottom: 12,
            }}
          >
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
          </TouchableOpacity>
        </View>

        {/* Location Filter Tabs with Search */}
        <View style={{ marginTop: 20, marginBottom: 20 }}>
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center',
          }}>
            {/* ADDED: Search Icon Button */}
            <View style={{ paddingLeft: 20, paddingRight: 8 }}>
              {!isSearchExpanded ? (
                <TouchableOpacity
                  onPress={expandSearch}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: themeColors.isDark 
                      ? 'rgba(255, 255, 255, 0.08)'
                      : 'rgba(0, 0, 0, 0.05)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1,
                    borderColor: themeColors.isDark 
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'rgba(0, 0, 0, 0.08)',
                  }}
                  activeOpacity={0.7}
                >
                  <Search 
                    size={16} 
                    color={themeColors.textSecondary} 
                    strokeWidth={2} 
                  />
                </TouchableOpacity>
              ) : (
                <Animated.View style={{
                  width: searchAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [36, 160],
                  }),
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: themeColors.isDark 
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'rgba(0, 0, 0, 0.05)',
                  borderWidth: 1,
                  borderColor: themeColors.isDark 
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(0, 0, 0, 0.08)',
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 12,
                }}>
                  <Search 
                    size={14} 
                    color={themeColors.textSecondary} 
                    strokeWidth={2} 
                  />
                  <TextInput
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Search locations..."
                    placeholderTextColor={themeColors.textSecondary}
                    style={{
                      flex: 1,
                      marginLeft: 8,
                      marginRight: 8,
                      fontSize: 14,
                      color: themeColors.text,
                      fontFamily: 'System',
                    }}
                    autoFocus
                    returnKeyType="search"
                    clearButtonMode="never"
                  />
                  <TouchableOpacity
                    onPress={collapseSearch}
                    style={{
                      width: 24,
                      height: 24,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 4,
                    }}
                    activeOpacity={0.7}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <X 
                      size={14} 
                      color={themeColors.textSecondary} 
                      strokeWidth={2} 
                    />
                  </TouchableOpacity>
                </Animated.View>
              )}
            </View>
            
            {/* Location Tabs */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingRight: 20,
                gap: 6,
              }}
              style={{ flex: 1 }}
            >
              {filteredLocationTabs.map((tab) => (
                <TouchableOpacity
                  key={tab}
                  onPress={() => setSelectedLocationFilter(tab)}
                  style={{
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 20,
                    minHeight: 36,
                    // Border-only style like continent tabs
                    backgroundColor: selectedLocationFilter === tab 
                      ? theme.colors.primary 
                      : 'transparent',
                    borderWidth: selectedLocationFilter === tab ? 0 : 1,
                    borderColor: themeColors.isDark 
                      ? 'rgba(255, 255, 255, 0.15)' 
                      : 'rgba(0, 0, 0, 0.12)',
                    // Enhanced shadow for selected state
                    ...(selectedLocationFilter === tab && {
                      shadowColor: theme.colors.primary,
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.25,
                      shadowRadius: 4,
                      elevation: 3,
                    }),
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={{
                    color: selectedLocationFilter === tab 
                      ? '#FFFFFF'
                      : theme.colors.textSecondary,
                    fontSize: 14,
                    fontWeight: selectedLocationFilter === tab ? '700' : '500',
                    fontFamily: 'System',
                    letterSpacing: -0.1,
                  }}>
                    {tab}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Tab Navigation */}
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
            {['Forum', 'Explore', 'Activities'].map((tab) => (
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
          
          <View style={{
            height: 0.5,
            backgroundColor: themeColors.isDark 
              ? 'rgba(255, 255, 255, 0.06)'
              : 'rgba(0, 0, 0, 0.04)',
            marginTop: 0,
          }} />
        </View>

      {/* Content Area - Now Clean and Modular */}
      {activeTab === 'Forum' && (
        <ForumPostsList
          ref={forumScrollRef}
          country={country}
          selectedLocationFilter={selectedLocationFilter}
          onLocationFilterChange={setSelectedLocationFilter}
        />
      )}

      {activeTab === 'Explore' && (
        <View style={{ 
          flex: 1,
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
          flex: 1,
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
    </View>
    </TouchableWithoutFeedback>
  );
});

export default CountryViewScreen; 
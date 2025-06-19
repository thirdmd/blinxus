import React, { useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { ChevronLeft, ArrowUpRight, MapPin, Calendar, Users } from 'lucide-react-native';
import { 
  PodThemeConfig, 
  PodTabType, 
  allPodTabs 
} from '../../../types/structures/podsUIStructure';
import { Country, SubLocation } from '../../../constants/placesData';
import { PodsPostingService } from '../../../utils/podsPostingLogic';
import { activityTags, activityColors, ActivityKey, activityNames } from '../../../constants/activityTags';

interface CountryViewScreenProps {
  country: Country;
  activeTab: PodTabType;
  onTabChange: (tab: PodTabType) => void;
  onLocationPress: (location: SubLocation) => void;
  onBack: () => void;
  theme: PodThemeConfig;
  postingService: PodsPostingService;
}

const { width } = Dimensions.get('window');

const CountryViewScreen: React.FC<CountryViewScreenProps> = ({
  country,
  activeTab,
  onTabChange,
  onLocationPress,
  onBack,
  theme,
  postingService,
}) => {
  const scrollY = useRef(new Animated.Value(0)).current;
  
  const getActivityColor = (activityType: ActivityKey): string => {
    return activityColors[activityType] || '#0047AB';
  };

  // Beautiful header with parallax
  const headerTranslate = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -30],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.8],
    extrapolate: 'clamp',
  });

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* Fixed Back Button */}
      <View style={{
        position: 'absolute',
        top: 20,
        left: 24,
        zIndex: 10,
      }}>
        <TouchableOpacity 
          onPress={onBack}
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: theme.colors.background + 'E0',
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
          }}
          activeOpacity={0.8}
        >
                          <ChevronLeft size={20} color={theme.colors.text} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <Animated.ScrollView 
        style={{ flex: 1 }} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* Enhanced Header with Stats */}
        <Animated.View style={{
          paddingTop: 100,
          paddingBottom: 40,
          paddingHorizontal: 24,
          transform: [{ translateY: headerTranslate }],
          opacity: headerOpacity,
        }}>
          <View style={{ 
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 16,
          }}>
            <MapPin size={16} color={theme.colors.textSecondary} strokeWidth={2} />
            <Text style={{ 
              color: theme.colors.textSecondary,
              fontSize: 14,
              fontWeight: '600',
              letterSpacing: 1,
              textTransform: 'uppercase',
              marginLeft: 8,
              opacity: 0.7,
            }}>
              Country
            </Text>
          </View>
          
          <Text style={{ 
            color: theme.colors.text,
            fontSize: 48,
            fontWeight: '700',
            letterSpacing: -2,
            lineHeight: 52,
            marginBottom: 20,
          }}>
            {country.name}
          </Text>

          {/* Quick Stats Cards */}
          <View style={{ 
            flexDirection: 'row', 
            gap: 12,
            marginBottom: 24,
          }}>
            <View style={{
              flex: 1,
              backgroundColor: theme.colors.backgroundSecondary,
              borderRadius: 16,
              padding: 16,
              borderWidth: 1,
              borderColor: theme.colors.border + '30',
            }}>
              <Text style={{
                color: theme.colors.text,
                fontSize: 24,
                fontWeight: '800',
                marginBottom: 4,
              }}>
                {country.subLocations.length}
              </Text>
              <Text style={{
                color: theme.colors.textSecondary,
                fontSize: 13,
                fontWeight: '600',
              }}>
                Destinations
              </Text>
            </View>
            
            <View style={{
              flex: 1,
              backgroundColor: theme.colors.backgroundSecondary,
              borderRadius: 16,
              padding: 16,
              borderWidth: 1,
              borderColor: theme.colors.border + '30',
            }}>
              <Text style={{
                color: theme.colors.text,
                fontSize: 24,
                fontWeight: '800',
                marginBottom: 4,
              }}>
                {[...new Set(country.subLocations.flatMap(loc => loc.popularActivities))].length}
              </Text>
              <Text style={{
                color: theme.colors.textSecondary,
                fontSize: 13,
                fontWeight: '600',
              }}>
                Activities
              </Text>
            </View>
          </View>
          
          <Text style={{ 
            color: theme.colors.textSecondary,
            fontSize: 16,
            fontWeight: '500',
            lineHeight: 24,
            opacity: 0.8,
          }}>
            Explore amazing places and unique experiences in {country.name}
          </Text>
        </Animated.View>

        {/* Modern Tab Selector */}
        <View style={{ 
          paddingHorizontal: 24,
          paddingBottom: 32,
        }}>
          <View style={{ 
            flexDirection: 'row',
            backgroundColor: theme.colors.backgroundSecondary,
            borderRadius: 16,
            padding: 4,
            borderWidth: 1,
            borderColor: theme.colors.border + '20',
          }}>
            <TouchableOpacity
              onPress={() => onTabChange('Highlights')}
              style={{
                flex: 1,
                paddingVertical: 12,
                paddingHorizontal: 20,
                borderRadius: 12,
                backgroundColor: activeTab === 'Highlights' ? theme.colors.text : 'transparent',
                alignItems: 'center',
              }}
              activeOpacity={0.8}
            >
              <Text style={{
                fontSize: 15,
                fontWeight: '600',
                color: activeTab === 'Highlights' ? theme.colors.background : theme.colors.textSecondary,
              }}>
                Places ({country.subLocations.length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onTabChange('Activities')}
              style={{
                flex: 1,
                paddingVertical: 12,
                paddingHorizontal: 20,
                borderRadius: 12,
                backgroundColor: activeTab === 'Activities' ? theme.colors.text : 'transparent',
                alignItems: 'center',
              }}
              activeOpacity={0.8}
            >
              <Text style={{
                fontSize: 15,
                fontWeight: '600',
                color: activeTab === 'Activities' ? theme.colors.background : theme.colors.textSecondary,
              }}>
                Activities ({[...new Set(country.subLocations.flatMap(loc => loc.popularActivities))].length})
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        {activeTab === 'Highlights' ? (
          // Enhanced Destination Cards
          <View style={{ paddingHorizontal: 24, gap: 16 }}>
            {country.subLocations.map((location, index) => (
              <TouchableOpacity
                key={location.id}
                onPress={() => onLocationPress(location)}
                activeOpacity={0.8}
                style={{
                  backgroundColor: theme.colors.backgroundSecondary,
                  borderRadius: 20,
                  padding: 20,
                  borderWidth: 1,
                  borderColor: theme.colors.border + '20',
                  shadowColor: theme.colors.text,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 8,
                  elevation: 2,
                }}
              >
                {/* Header with number and arrow */}
                <View style={{ 
                  flexDirection: 'row', 
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 16,
                }}>
                  <View style={{ 
                    flexDirection: 'row', 
                    alignItems: 'center',
                    flex: 1,
                  }}>
                    <View style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: theme.colors.text,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 12,
                    }}>
                      <Text style={{ 
                        color: theme.colors.background,
                        fontSize: 14,
                        fontWeight: '700',
                      }}>
                        {index + 1}
                      </Text>
                    </View>
                    
                    <Text style={{ 
                      color: theme.colors.text,
                      fontSize: 22,
                      fontWeight: '700',
                      letterSpacing: -0.5,
                      flex: 1,
                    }}>
                      {location.name}
                    </Text>
                  </View>
                  
                  <View style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: theme.colors.background,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1,
                    borderColor: theme.colors.border + '30',
                  }}>
                    <ArrowUpRight 
                      size={16} 
                      color={theme.colors.text} 
                      strokeWidth={2}
                    />
                  </View>
                </View>
                
                <Text style={{ 
                  color: theme.colors.textSecondary,
                  fontSize: 15,
                  lineHeight: 22,
                  marginBottom: 16,
                  opacity: 0.8,
                }}>
                  {location.description}
                </Text>
                
                {/* Activity Pills with original colors */}
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {location.popularActivities.slice(0, 4).map((activityKey) => {
                    const activityColor = activityColors[activityKey as ActivityKey];
                    const activityName = activityNames[activityKey as ActivityKey];
                    
                    return (
                      <View
                        key={activityKey}
                        style={{
                          paddingHorizontal: 12,
                          paddingVertical: 6,
                          borderRadius: 12,
                          backgroundColor: activityColor + '15',
                          borderWidth: 1,
                          borderColor: activityColor + '30',
                        }}
                      >
                        <Text style={{
                          color: activityColor,
                          fontSize: 12,
                          fontWeight: '600',
                        }}>
                          {activityName || activityKey}
                        </Text>
                      </View>
                    );
                  })}
                  {location.popularActivities.length > 4 && (
                    <View style={{
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 12,
                      backgroundColor: theme.colors.background,
                      borderWidth: 1,
                      borderColor: theme.colors.border + '40',
                    }}>
                      <Text style={{
                        color: theme.colors.textSecondary,
                        fontSize: 12,
                        fontWeight: '600',
                      }}>
                        +{location.popularActivities.length - 4}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          // Enhanced Activities Grid
          <View style={{ paddingHorizontal: 24 }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
              {activityTags.map((activity) => {
                const activityKey = activity.name.toLowerCase() as ActivityKey;
                const count = country.subLocations.filter(loc => 
                  loc.popularActivities.includes(activityKey)
                ).length;
                
                if (count === 0) return null;
                
                return (
                  <TouchableOpacity
                    key={activity.name}
                    style={{
                      width: (width - 80) / 2,
                      minHeight: 120,
                      borderRadius: 20,
                      backgroundColor: theme.colors.backgroundSecondary,
                      borderWidth: 2,
                      borderColor: activity.color + '30',
                      padding: 20,
                      justifyContent: 'space-between',
                      shadowColor: activity.color,
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.1,
                      shadowRadius: 12,
                      elevation: 3,
                    }}
                    activeOpacity={0.8}
                  >
                    {/* Activity Header */}
                    <View>
                      <View style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: activity.color + '15',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 12,
                      }}>
                        <View style={{
                          width: 16,
                          height: 16,
                          borderRadius: 8,
                          backgroundColor: activity.color,
                        }} />
                      </View>
                      
                      <Text style={{
                        fontSize: 18,
                        fontWeight: '700',
                        color: theme.colors.text,
                        marginBottom: 6,
                        letterSpacing: -0.5,
                      }}>
                        {activity.name}
                      </Text>
                      
                      <Text style={{
                        fontSize: 13,
                        color: theme.colors.textSecondary,
                        fontWeight: '600',
                      }}>
                        {count} {count === 1 ? 'place' : 'places'}
                      </Text>
                    </View>
                    
                    {/* Visual Indicator */}
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: 16,
                    }}>
                      <View style={{
                        flex: 1,
                        height: 3,
                        backgroundColor: activity.color + '20',
                        borderRadius: 2,
                        marginRight: 12,
                      }}>
                        <View style={{
                          width: `${Math.min((count / Math.max(...activityTags.map(a => {
                            const key = a.name.toLowerCase() as ActivityKey;
                            return country.subLocations.filter(loc => 
                              loc.popularActivities.includes(key)
                            ).length;
                          }))) * 100, 100)}%`,
                          height: '100%',
                          backgroundColor: activity.color,
                          borderRadius: 2,
                        }} />
                      </View>
                      
                      <ArrowUpRight 
                        size={16} 
                        color={activity.color} 
                        strokeWidth={2}
                      />
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}
      </Animated.ScrollView>
    </View>
  );
};

export default CountryViewScreen;
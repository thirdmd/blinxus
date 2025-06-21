import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { ChevronLeft, Map, Users, MessageCircle, MapPin } from 'lucide-react-native';
import { 
  PodThemeConfig, 
  PodTabType, 
} from '../../../types/structures/podsUIStructure';
import { Country, SubLocation, placesData } from '../../../constants/placesData';
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
  const [selectedLocationFilter, setSelectedLocationFilter] = useState<string>('All');
  
  // Generate consistent member count based on country ID
  const memberCount = Math.floor((country.id.charCodeAt(0) * country.id.charCodeAt(country.id.length - 1) * 37) % 5000 + 100);
  const postsCount = Math.floor(memberCount * 0.65); // Roughly 65% of members have posts
  
  // Find which continent this country belongs to
  const continentName = placesData.find(continent => 
    continent.countries.some(c => c.id === country.id)
  )?.name || 'Unknown';
  
  // Get all locations for this country
  const allLocations = country.subLocations || [];
  
  // Create location filter tabs (All + first few locations)
  const locationTabs = [
    'All',
    ...allLocations.slice(0, 5).map(loc => loc.name),
    ...(allLocations.length > 5 ? ['More'] : [])
  ];

  // Filter locations based on selected tab
  const filteredLocations = selectedLocationFilter === 'All' 
    ? allLocations 
    : allLocations.filter(loc => loc.name === selectedLocationFilter);

  const handleMapPress = () => {
    // TODO: Open maps with country location
    console.log('Open maps for:', country.name);
  };

  return (
    <View style={{ flex: 1, backgroundColor: themeColors.background }}>
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
              ? 'rgba(26, 35, 50, 0.8)'
              : 'rgba(248, 249, 250, 0.9)',
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

        {/* Location Filter Tabs */}
        <View style={{ marginTop: 20, marginBottom: 20 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 20,
            }}
          >
            {locationTabs.map((tab, index) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setSelectedLocationFilter(tab)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  backgroundColor: selectedLocationFilter === tab 
                    ? theme.colors.primary 
                    : themeColors.isDark 
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'rgba(0, 0, 0, 0.05)',
                  borderRadius: 20,
                  marginRight: 8,
                }}
                activeOpacity={0.7}
              >
                <Text style={{
                  color: selectedLocationFilter === tab 
                    ? 'white' 
                    : themeColors.textSecondary,
                  fontSize: 14,
                  fontWeight: selectedLocationFilter === tab ? '600' : '500',
                  fontFamily: 'System',
                }}>
                  {tab}
                </Text>
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
              onPress={() => {
                // TODO: Open create post modal
                console.log('Create post in forum');
              }}
            >
              <Text style={{
                color: themeColors.textSecondary,
                fontSize: 16,
                fontFamily: 'System',
              }}>
                What's on your mind about {country.name}?
              </Text>
            </TouchableOpacity>

            {/* Mock Forum Posts */}
            {selectedLocationFilter === 'All' && (
              <>
                {/* Manila Post */}
                <View style={{
                  backgroundColor: themeColors.background,
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 16,
                  borderWidth: 1,
                  borderColor: themeColors.isDark 
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'rgba(0, 0, 0, 0.06)',
                }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                    <View style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      backgroundColor: theme.colors.primary,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 12,
                    }}>
                      <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>M</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{
                        color: themeColors.text,
                        fontSize: 15,
                        fontWeight: '600',
                        fontFamily: 'System',
                      }}>
                        Maria Santos
                      </Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                        <MapPin size={12} color={themeColors.textSecondary} />
                        <Text style={{
                          color: themeColors.textSecondary,
                          fontSize: 12,
                          marginLeft: 4,
                          fontFamily: 'System',
                        }}>
                          Manila • 2h ago
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
                    Best coffee shops in Makati? Looking for a good place to work remotely with reliable wifi and great ambiance. Any recommendations?
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
                        12 replies
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Cebu Post */}
                <View style={{
                  backgroundColor: themeColors.background,
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 16,
                  borderWidth: 1,
                  borderColor: themeColors.isDark 
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'rgba(0, 0, 0, 0.06)',
                }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                    <View style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      backgroundColor: '#10B981',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 12,
                    }}>
                      <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>J</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{
                        color: themeColors.text,
                        fontSize: 15,
                        fontWeight: '600',
                        fontFamily: 'System',
                      }}>
                        Juan dela Cruz
                      </Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                        <MapPin size={12} color={themeColors.textSecondary} />
                        <Text style={{
                          color: themeColors.textSecondary,
                          fontSize: 12,
                          marginLeft: 4,
                          fontFamily: 'System',
                        }}>
                          Cebu • 4h ago
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
                    Planning a weekend trip to Oslob for whale shark watching. What's the best time to visit and any tips for first-timers?
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
                        8 replies
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}

            {/* Manila-specific posts */}
            {selectedLocationFilter === 'Manila' && (
              <View style={{
                backgroundColor: themeColors.background,
                borderRadius: 12,
                padding: 16,
                marginBottom: 16,
                borderWidth: 1,
                borderColor: themeColors.isDark 
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(0, 0, 0, 0.06)',
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                  <View style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: theme.colors.primary,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                  }}>
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>M</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{
                      color: themeColors.text,
                      fontSize: 15,
                      fontWeight: '600',
                      fontFamily: 'System',
                    }}>
                      Maria Santos
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                      <MapPin size={12} color={themeColors.textSecondary} />
                      <Text style={{
                        color: themeColors.textSecondary,
                        fontSize: 12,
                        marginLeft: 4,
                        fontFamily: 'System',
                      }}>
                        Manila • 2h ago
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
                  Best coffee shops in Makati? Looking for a good place to work remotely with reliable wifi and great ambiance. Any recommendations?
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
                      12 replies
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Palawan-specific posts */}
            {selectedLocationFilter === 'Palawan' && (
              <View style={{
                backgroundColor: themeColors.background,
                borderRadius: 12,
                padding: 16,
                marginBottom: 16,
                borderWidth: 1,
                borderColor: themeColors.isDark 
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(0, 0, 0, 0.06)',
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                  <View style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: '#F59E0B',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                  }}>
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>A</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{
                      color: themeColors.text,
                      fontSize: 15,
                      fontWeight: '600',
                      fontFamily: 'System',
                    }}>
                      Anna Reyes
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                      <MapPin size={12} color={themeColors.textSecondary} />
                      <Text style={{
                        color: themeColors.textSecondary,
                        fontSize: 12,
                        marginLeft: 4,
                        fontFamily: 'System',
                      }}>
                        Palawan • 1h ago
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
                  El Nido vs Coron - which one should I visit first? I have 5 days and want to make the most of my Palawan trip!
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
                      15 replies
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Empty state for other filters */}
            {!['All', 'Manila', 'Palawan'].includes(selectedLocationFilter) && (
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
                  No discussions yet
                </Text>
                <Text style={{
                  color: themeColors.textSecondary,
                  fontSize: 14,
                  marginTop: 4,
                  textAlign: 'center',
                  fontFamily: 'System',
                }}>
                  Be the first to start a conversation in {selectedLocationFilter}
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
    </View>
  );
};

export default CountryViewScreen; 
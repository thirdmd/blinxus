import React, { useState, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  SectionList,
  Animated,
} from 'react-native';

// Create animated SectionList component with proper typing
const AnimatedSectionList = Animated.createAnimatedComponent(SectionList<Country, {title: string, data: Country[]}>);
import { Search, MapPinned, Plane } from 'lucide-react-native';
import { PodThemeConfig } from '../../../types/structures/podsUIStructure';
import { placesData, Country } from '../../../constants/placesData';

interface ContinentListScreenProps {
  theme: PodThemeConfig;
  onCountryPress: (country: Country) => void;
}

const ContinentListScreen: React.FC<ContinentListScreenProps> = ({
  theme,
  onCountryPress,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const scrollY = useRef(new Animated.Value(0)).current;

  // Prepare sections for SectionList
  const sections = useMemo(() => {
    if (!searchQuery) {
      return placesData.map(continent => ({
        title: continent.name,
        data: continent.countries
      }));
    }

    const query = searchQuery.toLowerCase();
    return placesData
      .map(continent => ({
        title: continent.name,
        data: continent.countries.filter(country =>
          country.name.toLowerCase().includes(query) ||
          country.subLocations.some(loc => 
            loc.name.toLowerCase().includes(query)
          )
        )
      }))
      .filter(section => section.data.length > 0);
  }, [searchQuery]);

  // Color palette for countries based on index
  const getCountryGradient = (index: number) => {
    const gradients = [
      ['#667eea', '#764ba2'],
      ['#f093fb', '#f5576c'],
      ['#4facfe', '#00f2fe'],
      ['#fa709a', '#fee140'],
      ['#30cfd0', '#330867'],
      ['#a8edea', '#fed6e3'],
      ['#ffecd2', '#fcb69f'],
      ['#ff9a9e', '#fecfef'],
    ];
    return gradients[index % gradients.length];
  };

  const renderCountry = ({ item: country, index }: { item: Country; index: number }) => {
    const [gradient1, gradient2] = getCountryGradient(index);
    
    return (
      <TouchableOpacity
        onPress={() => onCountryPress(country)}
        style={{
          marginHorizontal: 20,
          marginBottom: 12,
          borderRadius: 20,
          overflow: 'hidden',
          backgroundColor: theme.colors.backgroundSecondary,
          shadowColor: gradient1,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 5,
        }}
        activeOpacity={0.9}
      >
        {/* Gradient Background */}
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          backgroundColor: gradient1,
        }} />
        
        <View style={{ 
          paddingHorizontal: 20,
          paddingVertical: 18,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                <Text 
                  style={{ 
                    color: theme.colors.text,
                    fontSize: 20,
                    fontWeight: '700',
                    letterSpacing: -0.5,
                  }}
                >
                  {country.name}
                </Text>
                {country.subLocations.length > 20 && (
                  <View style={{
                    marginLeft: 8,
                    backgroundColor: gradient1 + '20',
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 8,
                  }}>
                    <Text style={{ 
                      color: gradient1, 
                      fontSize: 11, 
                      fontWeight: '700' 
                    }}>
                      HOT
                    </Text>
                  </View>
                )}
              </View>
              
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ fontSize: 14 }}>📍</Text>
                  <Text 
                    style={{ 
                      color: theme.colors.textSecondary,
                      fontSize: 14,
                      marginLeft: 4,
                    }}
                  >
                    {country.subLocations.length} places
                  </Text>
                </View>
                <Text 
                  style={{ 
                    color: theme.colors.textSecondary,
                    fontSize: 13,
                    flex: 1,
                  }}
                  numberOfLines={1}
                >
                  {country.subLocations.slice(0, 3).map(loc => loc.name).join(' • ')}
                </Text>
              </View>
            </View>
            
            <View style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: gradient1 + '15',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: 12,
            }}>
              <Plane 
                size={20} 
                color={gradient1} 
                strokeWidth={2}
                style={{ transform: [{ rotate: '45deg' }] }}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSectionHeader = ({ section }: { section: { title: string } }) => (
    <View 
      style={{ 
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 12,
        backgroundColor: theme.colors.background,
      }}
    >
      <Text 
        style={{ 
          color: theme.colors.text,
          fontSize: 28,
          fontWeight: '800',
          letterSpacing: -0.5,
        }}
      >
        {section.title}
      </Text>
    </View>
  );

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

  const ListHeaderComponent = () => (
    <Animated.View style={{ 
      backgroundColor: theme.colors.background,
      opacity: headerOpacity
    }}>
      {/* Pods Header with Animation */}
      <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
        <View style={{ marginBottom: 24 }}>
          <Text 
            style={{ 
              color: theme.colors.text,
              fontSize: 56,
              fontWeight: '900',
              letterSpacing: -3,
              marginBottom: -4,
            }}
          >
            Pods
          </Text>
          <Text 
            style={{ 
              color: theme.colors.textSecondary,
              fontSize: 18,
              fontWeight: '500',
              opacity: 0.8
            }}
          >
            Your gateway to the world
          </Text>
        </View>
        
        {/* Beautiful Search Bar */}
        <View
          style={{ 
            backgroundColor: theme.colors.backgroundSecondary,
            borderRadius: 24,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
            height: 56,
            marginBottom: 8,
            borderWidth: 2,
            borderColor: theme.colors.border + '10',
          }}
        >
          <View style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: theme.colors.background,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Search size={18} color={theme.colors.text} strokeWidth={2.5} />
          </View>
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Where to?"
            placeholderTextColor={theme.colors.textSecondary + '60'}
            style={{
              flex: 1,
              marginLeft: 12,
              fontSize: 18,
              color: theme.colors.text,
              fontWeight: '500',
            }}
            clearButtonMode="while-editing"
            returnKeyType="search"
            autoCorrect={false}
          />
        </View>
      </View>

      {/* Floating Stats */}
      <View style={{ 
        flexDirection: 'row', 
        paddingHorizontal: 20, 
        paddingVertical: 20,
        gap: 12 
      }}>
        <View style={{ 
          flex: 1,
          height: 80,
          borderRadius: 20,
          backgroundColor: theme.colors.text,
          padding: 16,
          justifyContent: 'center',
        }}>
          <Text style={{ 
            color: theme.colors.background, 
            fontSize: 28, 
            fontWeight: '800',
            marginBottom: 2,
          }}>
            {placesData.reduce((acc, cont) => acc + cont.countries.length, 0)}
          </Text>
          <Text style={{ 
            color: theme.colors.background, 
            fontSize: 13,
            opacity: 0.8,
            fontWeight: '600',
          }}>
            Countries
          </Text>
        </View>
        <View style={{ 
          flex: 1,
          height: 80,
          borderRadius: 20,
          backgroundColor: theme.colors.backgroundSecondary,
          borderWidth: 2,
          borderColor: theme.colors.border + '20',
          padding: 16,
          justifyContent: 'center',
        }}>
          <Text style={{ 
            color: theme.colors.text, 
            fontSize: 28, 
            fontWeight: '800',
            marginBottom: 2,
          }}>
            {placesData.reduce((acc, cont) => 
              acc + cont.countries.reduce((subAcc, country) => 
                subAcc + country.subLocations.length, 0
              ), 0
            )}
          </Text>
          <Text style={{ 
            color: theme.colors.textSecondary, 
            fontSize: 13,
            fontWeight: '600',
          }}>
            Destinations
          </Text>
        </View>
      </View>
    </Animated.View>
  );

  const ListEmptyComponent = () => (
    <View style={{ paddingTop: 80, alignItems: 'center', paddingHorizontal: 40 }}>
      <Text style={{ fontSize: 80, marginBottom: 20 }}>✈️</Text>
      <Text style={{ 
        color: theme.colors.text, 
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 8,
        letterSpacing: -0.5,
      }}>
        Nothing found
      </Text>
      <Text style={{ 
        color: theme.colors.textSecondary, 
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
      }}>
        Try searching for a different destination or browse all locations
      </Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <AnimatedSectionList
        sections={sections}
        renderItem={renderCountry}
        renderSectionHeader={renderSectionHeader}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={ListEmptyComponent}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ 
          paddingBottom: 40,
          flexGrow: 1 
        }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        // Performance
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
        removeClippedSubviews={true}
      />
    </View>
  );
};

export default ContinentListScreen;
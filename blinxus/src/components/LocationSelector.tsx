// LocationSelector Component - Centralized Location Selection
// ✅ Uses placesData for all location options
// ✅ Reusable across Create Post, Create Lucids, and Forum
// ✅ Consistent UI with ForumPostModal
// ✅ Backend ready and scalable

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
} from 'react-native';
import { Search, X, ChevronRight } from 'lucide-react-native';
import { useThemeColors } from '../hooks/useThemeColors';
import { placesData, getLocationByName } from '../constants/placesData';
import LocationDisplayHelper, { LocationDisplayOption } from '../utils/locationDisplayHelper';

interface LocationSelectorProps {
  selectedLocation: string;
  onLocationSelect: (location: string) => void;
  placeholder?: string;
  showCountryInResults?: boolean;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  selectedLocation,
  onLocationSelect,
  placeholder = 'Add location',
  showCountryInResults = false,
}) => {
  const themeColors = useThemeColors();
  const [showLocationSearch, setShowLocationSearch] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');

  // CENTRALIZED: Get filtered locations using LocationDisplayHelper
  const filteredLocations = useMemo(() => {
    return LocationDisplayHelper.filterLocations(locationSearch, showCountryInResults);
  }, [locationSearch, showCountryInResults]);

  const handleLocationSelect = (locationName: string) => {
    onLocationSelect(locationName);
    setShowLocationSearch(false);
    setLocationSearch('');
  };

  const openLocationSearch = () => {
    setShowLocationSearch(true);
    setLocationSearch('');
  };

  return (
    <>
      {/* Location Input Button */}
      <TouchableOpacity
        onPress={openLocationSearch}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 12,
          paddingVertical: 10,
          borderRadius: 8,
          backgroundColor: themeColors.isDark 
            ? 'rgba(45, 45, 45, 1)' 
            : 'rgba(240, 240, 240, 1)',
          height: 44,
        }}
        activeOpacity={0.8}
      >
        <Text style={{ fontSize: 16, color: themeColors.textSecondary, marginRight: 10 }}>📍</Text>
        <Text style={{
          fontSize: 15,
          color: selectedLocation ? themeColors.text : themeColors.textSecondary,
          flex: 1,
          fontFamily: 'System',
          fontWeight: '400',
        }}>
          {selectedLocation || placeholder}
        </Text>
        {selectedLocation && (
          <ChevronRight size={16} color={themeColors.textSecondary} strokeWidth={1.5} />
        )}
      </TouchableOpacity>

      {/* Location Search Modal - Same as ForumPostModal */}
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
              placeholder="Search locations worldwide..."
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
            {filteredLocations.map((item: LocationDisplayOption) => (
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
                  {item.displayName}
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
    </>
  );
};

export default LocationSelector; 
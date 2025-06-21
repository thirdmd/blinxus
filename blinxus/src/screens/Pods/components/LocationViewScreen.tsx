import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { ChevronLeft, Plus } from 'lucide-react-native';
import { 
  PodThemeConfig, 
  PodTabType, 
  allPodTabs 
} from '../../../types/structures/podsUIStructure';
import { SubLocation, Country } from '../../../constants/placesData';
import { PodsPostingService } from '../../../utils/podsPostingLogic';
import { activityTags, ActivityKey } from '../../../constants/activityTags';

interface LocationViewScreenProps {
  location: SubLocation;
  country: Country;
  activeTab: PodTabType;
  onTabChange: (tab: PodTabType) => void;
  onBack: () => void;
  theme: PodThemeConfig;
  postingService: PodsPostingService;
}

const LocationViewScreen: React.FC<LocationViewScreenProps> = ({
  location,
  country,
  activeTab,
  onTabChange,
  onBack,
  theme,
  postingService,
}) => {
  // Removed content functions for now - keeping file structure for future use

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* Back Button - Top Left Corner */}
      <TouchableOpacity 
        onPress={onBack}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 10,
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 8,
          paddingHorizontal: 12,
        }}
        activeOpacity={0.7}
      >
        <ChevronLeft size={20} color={theme.colors.text} />
        <Text style={{
          color: theme.colors.textSecondary,
          fontSize: 14,
          fontWeight: '600',
          marginLeft: 4,
          fontFamily: 'System',
        }}>
          {country?.name}
        </Text>
      </TouchableOpacity>

      {/* Content - Removed for now */}
      <View style={{ 
        flex: 1, 
        paddingHorizontal: 20, 
        paddingVertical: 60, 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <Text style={{
          color: theme.colors.textSecondary,
          fontSize: 16,
          fontFamily: 'System',
        }}>
          Location content coming soon...
        </Text>
      </View>
    </View>
  );
};

export default LocationViewScreen; 
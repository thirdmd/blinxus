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
  const renderTabBar = () => (
    <View style={{ backgroundColor: theme.colors.background }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-2">
        <View className="flex-row">
          {allPodTabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              className={`py-4 px-3 ${activeTab === tab ? 'border-b-2 border-blue-500' : ''}`}
              onPress={() => onTabChange(tab)}
            >
              <Text className={`text-sm font-medium ${
                activeTab === tab ? 'text-blue-500' : 'text-gray-500'
              }`}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  const renderActivityPills = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View className="flex-row space-x-1">
        {location.popularActivities.map((activity, idx) => {
          const activityTag = activityTags.find(tag => {
            const activityMap: { [key: string]: string } = {
              'Aquatics': 'aquatics',
              'Outdoors': 'outdoors',
              'City': 'city',
              'Food': 'food',
              'Heritage': 'heritage',
              'Cultural': 'cultural',
              'Wellness': 'wellness',
              'Thrill': 'thrill',
              'Amusements': 'amusements',
            };
            return activityMap[tag.name] === activity;
          });
          
          return (
            <View 
              key={idx}
              className="px-2 py-1"
              style={{ backgroundColor: activityTag?.color || '#708090' }}
            >
              <Text className="text-xs text-white font-medium">
                {activityTag?.name || activity}
              </Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );

  const renderHighlightsTab = () => {
    // Get posts for this location from the posting service
    const locationPosts = postingService.getPostsForLocation(location.id);
    
    return (
      <View>
        {/* Quick Info */}
        <View style={{ backgroundColor: theme.colors.backgroundSecondary }} className="p-4 rounded-2xl mb-6">
          <Text style={{ color: theme.colors.text }} className="font-medium mb-2">
            About {location.name}
          </Text>
          <Text style={{ color: theme.colors.textSecondary }} className="text-sm mb-3">
            {location.description}
          </Text>
          <View className="grid grid-cols-2 gap-2">
            <View style={{ backgroundColor: theme.colors.background }} className="p-2 rounded-lg">
              <Text style={{ color: theme.colors.textSecondary }} className="text-xs font-medium">
                Best time to visit
              </Text>
              <Text style={{ color: theme.colors.text }} className="text-sm">
                {location.bestTimeToVisit}
              </Text>
            </View>
            <View style={{ backgroundColor: theme.colors.background }} className="p-2 rounded-lg">
              <Text style={{ color: theme.colors.textSecondary }} className="text-xs font-medium">
                Posts
              </Text>
              <Text style={{ color: theme.colors.text }} className="text-sm">
                {locationPosts.length}
              </Text>
            </View>
          </View>
        </View>
        
        {/* Recent Posts */}
        <Text style={{ color: theme.colors.text }} className="font-medium text-lg mb-4">
          Recent Posts
        </Text>
        
        {locationPosts.length === 0 ? (
          <View className="items-center py-8">
            <Text style={{ color: theme.colors.textSecondary }} className="text-center mb-4">
              No posts yet for {location.name}
            </Text>
            <TouchableOpacity className="bg-blue-500 px-4 py-2 rounded-2xl flex-row items-center">
              <Plus size={16} color="#FFFFFF" />
              <Text className="text-white text-sm ml-1 font-medium">Create First Post</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <Text style={{ color: theme.colors.textSecondary }} className="text-center">
              {locationPosts.length} posts found (integration with PostsContext needed)
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderOtherTabs = () => (
    <View className="flex-1 items-center justify-center py-20">
      <Text style={{ color: theme.colors.textSecondary }} className="text-lg text-center">
        {activeTab} content coming soon
      </Text>
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Highlights':
        return renderHighlightsTab();
      default:
        return renderOtherTabs();
    }
  };

  return (
    <>
      {/* Header */}
      <View style={{ backgroundColor: theme.colors.background }} className="px-4 py-4 border-b border-gray-200">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity 
            onPress={onBack}
            className="w-10 h-10 -ml-2 items-center justify-center"
          >
                            <ChevronLeft size={20} color={theme.colors.text} />
          </TouchableOpacity>
          <View className="ml-2">
            <Text style={{ color: theme.colors.textSecondary }} className="text-sm">
              Asia &gt; {country?.name}
            </Text>
            <Text style={{ color: theme.colors.text }} className="text-xl font-semibold">
              {location.name}
            </Text>
          </View>
        </View>
        
        {/* Activity Pills */}
        {renderActivityPills()}
      </View>

      {/* Tab Bar */}
      {renderTabBar()}

      {/* Tab Content */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-4">
          {renderTabContent()}
        </View>
      </ScrollView>
    </>
  );
};

export default LocationViewScreen; 
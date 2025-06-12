import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, FlatList, NativeSyntheticEvent, NativeScrollEvent, Animated } from 'react-native';
import { activityTags, ActivityKey, activityNames } from '../../constants/activityTags';
import PillTag from '../../components/PillTag';
import { useNavigation } from '@react-navigation/native';
import { usePosts } from '../../store/PostsContext';
import { mapPostToCardProps } from '../../types/structures/posts_structure';
import PostCard from '../../components/PostCard';
import { useScrollContext } from '../../contexts/ScrollContext';

export default function ExploreScreen() {
  const navigation = useNavigation();
  const { posts } = usePosts();
  const { exploreScrollRef } = useScrollContext();
  const [headerVisible, setHeaderVisible] = useState(true);
  const [fabVisible, setFabVisible] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<ActivityKey | 'all'>('all');
  const lastScrollY = useRef(0);
  const fabAnimatedValue = useRef(new Animated.Value(1)).current;

  const cardPropsArray = posts.map(post => mapPostToCardProps(post));

  // Filter posts based on selected activity
  const filteredPosts = selectedFilter === 'all' 
    ? cardPropsArray 
    : cardPropsArray.filter(post => post.activity === selectedFilter);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    
    if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
      // Scrolling down
      setHeaderVisible(false);
      if (fabVisible) {
        setFabVisible(false);
        Animated.timing(fabAnimatedValue, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
    } else {
      // Scrolling up
      setHeaderVisible(true);
      if (!fabVisible) {
        setFabVisible(true);
        Animated.timing(fabAnimatedValue, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
    }
    
    lastScrollY.current = currentScrollY;
  };

  // Handle filter selection
  const handleFilterSelect = (activityKey: ActivityKey | 'all') => {
    setSelectedFilter(activityKey);
  };

  // Create activity key mapping for filter functionality
  const createActivityKeyMap = () => {
    const activityKeyMap: { [key: string]: ActivityKey } = {
      'Aquatics': 'aquatics',
      'Outdoors': 'outdoors', 
      'City': 'city',
      'Food': 'food',
      'Stays': 'stays',
      'Heritage': 'heritage',
      'Wellness': 'wellness',
      'Amusements': 'amusements',
      'Cultural': 'cultural',
      'Special Experiences': 'special',
      'Thrill': 'thrill',
    };
    return activityKeyMap;
  };

  const activityKeyMap = createActivityKeyMap();
  
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Title Header Layer */}
      {headerVisible && (
        <View className="bg-white py-3 px-4">
          <Text className="text-2xl font-bold text-gray-800">Blinxus</Text>
        </View>
      )}

      {/* Pills Layer */}
      <View className="bg-white p-4">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row">
            {/* All Filter Pill */}
            <View 
              className="mr-2"
              style={{
                transform: [{ scale: selectedFilter === 'all' ? 1.05 : 1 }]
              }}
            >
              <PillTag
                label="All"
                color="#E5E7EB" // Light gray color for "All"
                onPress={() => handleFilterSelect('all')}
                alwaysFullColor={true}
              />
            </View>
            {activityTags.map((tag, index) => {
              const activityKey = activityKeyMap[tag.name];
              return (
                <View 
                  key={tag.id} 
                  className="mr-2"
                  style={{
                    transform: [{ scale: selectedFilter === activityKey ? 1.05 : 1 }]
                  }}
                >
                  <PillTag
                    label={tag.name}
                    color={tag.color}
                    onPress={() => handleFilterSelect(activityKey)}
                    alwaysFullColor={true}
                  />
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
      
      {/* Posts Feed */}
      <FlatList
        ref={exploreScrollRef}
        data={filteredPosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PostCard {...item} />}
        className="flex-1"
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        bounces={false}
      />

      {/* Floating Action Button - Fixed position to bottom right corner */}
      <Animated.View
        style={{
          position: 'absolute',
          bottom: 24,
          right: 24,
          opacity: fabAnimatedValue,
          transform: [
            {
              scale: fabAnimatedValue,
            },
          ],
        }}
      >
        <TouchableOpacity
          className="w-16 h-16 rounded-full bg-blue-600 justify-center items-center shadow-lg"
          style={{
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
          }}
          onPress={() => navigation.navigate('CreatePost' as never)}
        >
          <Text className="text-white text-2xl font-bold">+</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

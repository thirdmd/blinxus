import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, FlatList, NativeSyntheticEvent, NativeScrollEvent, Animated, StatusBar, TextInput } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { Search, ArrowLeft } from 'lucide-react-native';
import { activityTags, ActivityKey, activityNames } from '../../constants/activityTags';
import PillTag from '../../components/PillTag';
import { useNavigation } from '@react-navigation/native';
import { usePosts } from '../../store/PostsContext';
import { mapPostToCardProps, PostCardProps } from '../../types/structures/posts_structure';
import PostCard from '../../components/PostCard';
import MediaGridItem from '../../components/MediaGridItem';
import MasonryList from '../../components/MasonryList';
import FullPostView from '../../components/FullPostView';
import { useScrollContext } from '../../contexts/ScrollContext';

export default function ExploreScreen() {
  const navigation = useNavigation();
  const { posts } = usePosts();
  const { exploreScrollRef } = useScrollContext();
  const [headerVisible, setHeaderVisible] = useState(true);
  const [fabVisible, setFabVisible] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<ActivityKey | 'all'>('all');
  const [isMediaMode, setIsMediaMode] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PostCardProps | null>(null);
  const [showFullPost, setShowFullPost] = useState(false);
  const lastScrollY = useRef(0);
  const fabAnimatedValue = useRef(new Animated.Value(1)).current;

  const cardPropsArray = posts.map(post => mapPostToCardProps(post));

  // Filter posts based on selected activity
  const filteredPosts = selectedFilter === 'all' 
    ? cardPropsArray 
    : cardPropsArray.filter(post => post.activity === selectedFilter);

  // Filter posts that have images for media mode
  const postsWithImages = filteredPosts.filter(post => post.images && post.images.length > 0);

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
    } else if (currentScrollY <= 10 || (lastScrollY.current - currentScrollY > 50)) {
      // Scrolling up - show if at top (<=10) OR scrolled up significantly (>50px)
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

  // Handle swipe gesture
  const onGestureEvent = (event: any) => {
    const { translationX, state } = event.nativeEvent;
    
    if (state === State.END) {
      if (translationX > 50 && !isMediaMode) {
        // Swipe right - switch to media mode
        setIsMediaMode(true);
      } else if (translationX < -50 && isMediaMode && !showFullPost) {
        // Swipe left - switch back to normal mode
        setIsMediaMode(false);
      }
    }
  };

  // Handle media item press
  const handleMediaItemPress = (post: PostCardProps) => {
    setSelectedPost(post);
    setShowFullPost(true);
  };

  // Handle back from full post
  const handleBackFromFullPost = () => {
    setShowFullPost(false);
    setSelectedPost(null);
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

  // Render media grid item
  const renderMediaItem = (item: PostCardProps, index: number, columnWidth: number) => {
    const aspectRatio = 1.2 + Math.random() * 0.8; // Random aspect ratios between 1.2 and 2.0
    
    return (
      <MediaGridItem
        id={item.id}
        imageUri={item.images![0]}
        username={item.authorName}
        location={item.location}
        activityColor={item.activityColor}
        onPress={() => handleMediaItemPress(item)}
        columnWidth={columnWidth}
        aspectRatio={aspectRatio}
      />
    );
  };

  // Show full post view
  if (showFullPost && selectedPost) {
    const exploreHeaderComponent = (
      <View className="px-4 py-6">
        <Text className="text-2xl font-bold text-gray-800 mb-4">Explore</Text>
        <MasonryList
          data={postsWithImages.filter(p => p.id !== selectedPost.id)}
          renderItem={renderMediaItem}
          columns={2}
          spacing={12}
        />
      </View>
    );

    return (
      <FullPostView
        post={selectedPost}
        onBack={handleBackFromFullPost}
        bottomComponent={exploreHeaderComponent}
      />
    );
  }
  
  return (
    <PanGestureHandler onGestureEvent={onGestureEvent}>
      <SafeAreaView className="flex-1 bg-white">
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        
        {/* Header */}
        {headerVisible && (
          <View className="bg-white py-3 px-4">
            {isMediaMode ? (
              // Search bar for media mode
              <View className="flex-row items-center">
                <TouchableOpacity 
                  onPress={() => setIsMediaMode(false)}
                  className="mr-3"
                >
                  <ArrowLeft size={24} color="#1F2937" />
                </TouchableOpacity>
                <View className="flex-1 flex-row items-center bg-gray-100 rounded-full px-4 py-2">
                  <Search size={20} color="#9CA3AF" />
                  <TextInput
                    placeholder="Search places..."
                    className="flex-1 ml-2 text-gray-800"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>
            ) : (
              // Normal title with toggle button
              <View className="flex-row items-center justify-between">
                <Text className="text-2xl font-bold text-gray-800">Blinxus</Text>
                <TouchableOpacity
                  onPress={() => setIsMediaMode(true)}
                  className="px-3 py-1 bg-blue-100 rounded-full"
                >
                  <Text className="text-blue-600 text-sm font-medium">Media</Text>
                </TouchableOpacity>
              </View>
            )}
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
        
        {/* Content Area */}
        {isMediaMode ? (
          // Media Grid View
          <MasonryList
            data={postsWithImages}
            renderItem={renderMediaItem}
            columns={2}
            spacing={12}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        ) : (
          // Normal Posts Feed
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
        )}

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
    </PanGestureHandler>
  );
}

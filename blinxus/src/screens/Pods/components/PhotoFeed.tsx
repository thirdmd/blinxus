// PhotoFeed Component - Centralized Visual Content for Pods
// ✅ Uses same MediaGridItem as ExploreScreen & Profile Library
// ✅ Same scroll position preservation logic
// ✅ Same fullscreen integration via useFullscreenManager
// ✅ Filters posts by location from centralized placesData
// ✅ Backend ready and scalable

import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { Camera } from 'lucide-react-native';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { usePosts } from '../../../store/PostsContext';
import { mapPostToCardProps, PostCardProps } from '../../../types/structures/posts_structure';
import MediaGridItem from '../../../components/MediaGridItem';
import FullscreenView from '../../../components/FullscreenView';
import useFullscreenManager from '../../../hooks/useFullscreenManager';
import { Country } from '../../../constants/placesData';
import { LocationFilter } from './Forum/forumTypes';
import { getResponsiveDimensions, ri, rs } from '../../../utils/responsive';

const responsiveDimensions = getResponsiveDimensions();

interface PhotoFeedProps {
  country: Country;
  selectedLocationFilter: LocationFilter;
}

const PhotoFeed: React.FC<PhotoFeedProps> = ({
  country,
  selectedLocationFilter,
}) => {
  const themeColors = useThemeColors();
  const { posts } = usePosts();
  
  // Centralized fullscreen management - EXACT same as ExploreScreen & Library
  const fullscreenManager = useFullscreenManager();
  
  // Scroll position tracking - EXACT same as ExploreScreen media mode & Library recent tab
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollPositionRef = useRef(0); // Use ref for immediate access
  const scrollRef = useRef<ScrollView>(null);
  
  // App bar state management - EXACT same as Library
  const [scrollY, setScrollY] = useState(0);
  const [appBarOpacity, setAppBarOpacity] = useState(1);
  const [appBarBlur, setAppBarBlur] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);

  // Filter posts by location - CENTRALIZED logic using placesData
  const filteredPosts = useMemo(() => {
    // Get all posts with images (Create Posts & Lucids)
    const postsWithImages = posts
      .filter(post => post.images && post.images.length > 0)
      .map(post => mapPostToCardProps(post));

    // Filter by location using centralized logic
    if (selectedLocationFilter === 'All') {
      // Show all posts from this country
      return postsWithImages.filter(post => {
        if (!post.location) return false;
        
        // Check if post location matches country or any sublocation
        if (post.location === country.name) return true;
        
        // Check if location matches any sublocation in this country
        return country.subLocations.some(sublocation => 
          post.location === sublocation.name ||
          post.location === `${sublocation.name}, ${country.name}` ||
          post.location.toLowerCase().includes(sublocation.name.toLowerCase())
        );
      });
    } else {
      // Show posts from specific location
      return postsWithImages.filter(post => {
        if (!post.location) return false;
        
        // Direct match with selected location
        if (post.location === selectedLocationFilter) return true;
        
        // Match with "Location, Country" format
        if (post.location === `${selectedLocationFilter}, ${country.name}`) return true;
        
        // Partial match for location name
        return post.location.toLowerCase().includes(selectedLocationFilter.toLowerCase());
      });
    }
  }, [posts, country, selectedLocationFilter]);

  // Enhanced scroll handler - EXACT same as Library Recent tab
  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    setScrollY(currentScrollY);
    
    // Calculate dynamic app bar opacity and blur based on scroll
    const scrollThreshold = 100;
    const opacity = Math.max(0.3, 1 - (currentScrollY / scrollThreshold));
    const shouldBlur = currentScrollY > 50;
    
    setAppBarOpacity(opacity);
    setAppBarBlur(shouldBlur);
    
    // Update both state and ref for immediate access - EXACT like Library
    setScrollPosition(currentScrollY);
    scrollPositionRef.current = currentScrollY;
    
    // Smooth header visibility logic
    if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
      // Scrolling down - fade out header
      setHeaderVisible(false);
    } else if (currentScrollY <= 20) {
      // At top - show header
      setHeaderVisible(true);
    } else if (currentScrollY < lastScrollY.current - 50) {
      // Scrolling up significantly - show header
      setHeaderVisible(true);
    }
    
    lastScrollY.current = currentScrollY;
  }, []);

  // Handle post press - EXACT same as ExploreScreen media mode & Library
  const handlePostPress = useCallback((post: PostCardProps) => {
    // Store current scroll position before entering fullscreen - EXACT like Library
    const currentOffset = scrollPositionRef.current;
    setScrollPosition(currentOffset);
    
    // Use centralized fullscreen manager - EXACT same integration
    fullscreenManager.handlePostPress(post, filteredPosts, {
      screenName: 'PhotoFeed',
      feedContext: 'photos',
      scrollPosition: currentOffset,
      setScrollPosition: setScrollPosition,
      scrollRef: scrollRef
    });
  }, [filteredPosts, fullscreenManager]);

  // RADICAL FIX: Only show fullscreen when phase is 'active' - prevents render conflicts
  if (fullscreenManager.phase === 'active' && fullscreenManager.currentConfig) {
    return (
      <FullscreenView
        visible={fullscreenManager.isFullscreen}
        posts={filteredPosts}
        selectedPostIndex={fullscreenManager.selectedPostIndex}
        animationValues={fullscreenManager.animationValues}
        config={fullscreenManager.currentConfig}
        onBack={fullscreenManager.exitFullscreen}
        onLucidPress={fullscreenManager.handleLucidPress}
      />
    );
  }

  // Empty state
  if (filteredPosts.length === 0) {
    return (
      <View style={{ 
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'flex-start', 
        paddingHorizontal: 32,
        paddingTop: 120 // Position content lower to match Library tabs
      }}>
        <View style={{ 
          width: 80, 
          height: 80, 
          backgroundColor: themeColors.backgroundSecondary, 
          borderRadius: 40, 
          alignItems: 'center', 
          justifyContent: 'center', 
          marginBottom: 24 
        }}>
          <Camera size={32} color={themeColors.textSecondary} strokeWidth={1.5} />
        </View>
        <Text style={{ 
          fontSize: 18, 
          fontWeight: '400', 
          color: themeColors.text, 
          marginBottom: 12, 
          textAlign: 'center' 
        }}>
          No photos yet
        </Text>
        <Text style={{ 
          color: themeColors.textSecondary, 
          textAlign: 'center', 
          lineHeight: 24, 
          fontWeight: '300' 
        }}>
          {selectedLocationFilter === 'All' 
            ? `Photos from ${country.name} will appear here.`
            : `Photos from ${selectedLocationFilter} will appear here.`
          }
        </Text>
      </View>
    );
  }

  // Main grid view - EXACT same as ExploreScreen media mode & Library recent tab
  return (
    <ScrollView 
      ref={scrollRef}
      showsVerticalScrollIndicator={false}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      bounces={true}
      removeClippedSubviews={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={{ 
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        paddingBottom: 32 
      }}>
        {filteredPosts.map((post) => (
          <MediaGridItem
            key={post.id}
            imageUri={post.images![0]}
            isLucid={post.type === 'lucid'}
            onPress={() => handlePostPress(post)}
          />
        ))}
      </View>
    </ScrollView>
  );
};

export default PhotoFeed; 
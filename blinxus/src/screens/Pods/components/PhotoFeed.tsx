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
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { usePosts } from '../../../store/PostsContext';
import { mapPostToCardProps, PostCardProps } from '../../../types/structures/posts_structure';
import MediaGridItem from '../../../components/MediaGridItem';
import { ImmersiveNavigation } from '../../../utils/immersiveNavigation';
import { Country, resolveLocationForNavigation, getSubSubLocationByName, getParentSubLocation } from '../../../constants/placesData';
import { LocationFilter } from './Forum/forumTypes';
import { getResponsiveDimensions, ri, rs } from '../../../utils/responsive';

const responsiveDimensions = getResponsiveDimensions();

interface PhotoFeedProps {
  country: Country;
  selectedLocationFilter: LocationFilter;
  navigation?: NavigationProp<ParamListBase>;
}

const PhotoFeed: React.FC<PhotoFeedProps> = ({
  country,
  selectedLocationFilter,
  navigation,
}) => {
  const themeColors = useThemeColors();
  const { posts } = usePosts();
  

  
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
        const matchesSubLocation = country.subLocations.some(sublocation => {
          // Direct sublocation match
          if (post.location === sublocation.name ||
              post.location === `${sublocation.name}, ${country.name}` ||
              post.location.toLowerCase().includes(sublocation.name.toLowerCase())) {
            return true;
          }
          
          // NEW: Check if post location is a subsublocation that belongs to this sublocation
          if (sublocation.subSubLocations) {
            return sublocation.subSubLocations.some(subSubLocation => 
              post.location === subSubLocation.name ||
              post.location === `${subSubLocation.name}, ${sublocation.name}` ||
              post.location.toLowerCase().includes(subSubLocation.name.toLowerCase())
            );
          }
          
          return false;
        });
        
        return matchesSubLocation;
      });
    } else {
      // Show posts from specific location (sublocation or subsublocation)
      return postsWithImages.filter(post => {
        if (!post.location) return false;
        
        // Direct match with selected location
        if (post.location === selectedLocationFilter) return true;
        
        // Match with "Location, Country" format
        if (post.location === `${selectedLocationFilter}, ${country.name}`) return true;
        
        // NEW: Handle subsublocation posts
        // Check if the selected filter is a sublocation and the post is from a subsublocation within it
        const selectedSubLocation = country.subLocations.find(loc => loc.name === selectedLocationFilter);
        if (selectedSubLocation && selectedSubLocation.subSubLocations) {
          // Check if the post location is any subsublocation within the selected sublocation
          const isSubSubLocationPost = selectedSubLocation.subSubLocations.some(subSubLocation =>
            post.location === subSubLocation.name ||
            post.location === `${subSubLocation.name}, ${selectedSubLocation.name}` ||
            post.location.toLowerCase().includes(subSubLocation.name.toLowerCase())
          );
          
          if (isSubSubLocationPost) return true;
        }
        
        // NEW: Handle case where selected filter might be a subsublocation name
        // Check if any sublocation has a subsublocation matching the filter
        const matchingSubLocation = country.subLocations.find(sublocation => {
          if (!sublocation.subSubLocations) return false;
          
          return sublocation.subSubLocations.some(subSubLocation => {
            return subSubLocation.name === selectedLocationFilter ||
                   subSubLocation.alternateNames.some(altName => altName === selectedLocationFilter);
          });
        });
        
        if (matchingSubLocation) {
          // If selectedLocationFilter is a subsublocation name, show posts from both:
          // 1. The subsublocation itself
          // 2. The parent sublocation
          return post.location === selectedLocationFilter ||
                 post.location === matchingSubLocation.name ||
                 post.location.toLowerCase().includes(selectedLocationFilter.toLowerCase()) ||
                 post.location.toLowerCase().includes(matchingSubLocation.name.toLowerCase());
        }
        
        // Partial match for location name (fallback)
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

  // Handle post press - Using immersive navigation
  const handlePostPress = useCallback((post: PostCardProps) => {
    if (navigation) {
      // Use immersive navigation for TikTok-style experience
      ImmersiveNavigation.navigateFromPostInList(navigation, filteredPosts, post, 'Photos');
    }
  }, [filteredPosts, navigation]);



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
import { Country, SubLocation, placesData } from '../constants/placesData';
import { ForumPost } from '../screens/Pods/components/Forum/forumTypes';

// Location filter type
export type LocationFilter = 'All' | string; // 'All' or specific location name

// Get all available location filters for a country
export const getLocationFilters = (country: Country): string[] => {
  const baseFilters = ['All'];
  const locationNames = country.subLocations.slice(0, 5).map(loc => loc.name);
  
  if (country.subLocations.length > 5) {
    return [...baseFilters, ...locationNames, 'More'];
  }
  
  return [...baseFilters, ...locationNames];
};

// Get location by ID
export const getLocationById = (locationId: string, country: Country): SubLocation | null => {
  return country.subLocations.find(loc => loc.id === locationId) || null;
};

// Get location by name
export const getLocationByName = (locationName: string, country: Country): SubLocation | null => {
  return country.subLocations.find(loc => loc.name === locationName) || null;
};

// Filter posts based on selected location filter
export const filterPostsByLocation = (
  posts: ForumPost[], 
  locationFilter: LocationFilter, 
  country: Country
): ForumPost[] => {
  if (locationFilter === 'All') {
    // Return all posts for this country
    return posts.filter(post => post.countryId === country.id);
  }
  
  // Find the specific location
  const location = getLocationByName(locationFilter, country);
  if (!location) {
    return [];
  }
  
  // Return posts for this specific location
  return posts.filter(post => post.locationId === location.id);
};

// Get location display name for a post
export const getPostLocationDisplay = (post: ForumPost, country: Country): string => {
  const location = getLocationById(post.locationId, country);
  return location ? location.name : 'Unknown Location';
};

// Check if a post belongs to a specific location filter
export const postMatchesLocationFilter = (
  post: ForumPost, 
  locationFilter: LocationFilter, 
  country: Country
): boolean => {
  if (locationFilter === 'All') {
    return post.countryId === country.id;
  }
  
  const location = getLocationByName(locationFilter, country);
  if (!location) {
    return false;
  }
  
  return post.locationId === location.id;
};

// Get continent name for a country
export const getContinentNameByCountry = (country: Country): string => {
  const continent = placesData.find(continent => 
    continent.countries.some(c => c.id === country.id)
  );
  return continent?.name || 'Unknown';
};

// Check if location filter is valid for a country
export const isValidLocationFilter = (filter: string, country: Country): boolean => {
  if (filter === 'All') return true;
  return country.subLocations.some(loc => loc.name === filter);
};

// Get empty state message for a location filter
export const getEmptyStateMessage = (locationFilter: LocationFilter): { title: string; subtitle: string } => {
  if (locationFilter === 'All') {
    return {
      title: 'No discussions yet',
      subtitle: 'Be the first to start a conversation'
    };
  }
  
  return {
    title: 'No discussions yet',
    subtitle: `Be the first to start a conversation in ${locationFilter}`
  };
};

/**
 * Centralized Forum Tag Display Logic
 * Handles how forum tags should be displayed across all pods components
 */
export const ForumTagsDisplay = {
  /**
   * Get all activity tags for display (no limit)
   * @param activityTags Array of tag IDs
   * @param forumActivityTags Available forum activity tags
   * @param maxTags Optional maximum number of tags to show (default: unlimited)
   * @returns Array of tag data for display
   */
  getTagsForDisplay: (
    activityTags: string[], 
    forumActivityTags: any[], 
    maxTags?: number
  ) => {
    const validTags = activityTags
      .map(tagId => forumActivityTags.find(tag => tag.id === tagId))
      .filter(Boolean);
    
    return maxTags ? validTags.slice(0, maxTags) : validTags;
  },

  /**
   * Check if tags should be scrollable horizontally
   * @param tagsCount Number of tags
   * @returns boolean indicating if horizontal scroll should be enabled
   */
  shouldEnableHorizontalScroll: (tagsCount: number) => {
    return tagsCount > 2; // Enable scroll when more than 2 tags
  },

  /**
   * Get tag display configuration for different contexts
   */
  getDisplayConfig: (context: 'card' | 'detail' | 'compact') => {
    switch (context) {
      case 'card':
        return {
          showAllTags: true,
          enableHorizontalScroll: true,
          maxTagsBeforeScroll: 2
        };
      case 'detail':
        return {
          showAllTags: true,
          enableHorizontalScroll: true,
          maxTagsBeforeScroll: 3
        };
      case 'compact':
        return {
          showAllTags: true,
          enableHorizontalScroll: true,
          maxTagsBeforeScroll: 1
        };
      default:
        return {
          showAllTags: true,
          enableHorizontalScroll: true,
          maxTagsBeforeScroll: 2
        };
    }
  }
}; 
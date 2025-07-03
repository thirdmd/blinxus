// src/utils/locationNavigation.ts
// Centralized Location Navigation - Backend Ready & Future Proof

import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { Animated, Alert } from 'react-native';
import { 
  createSlideInRightAnimation, 
  createSlideOutRightAnimation, 
  ANIMATION_DURATIONS, 
  ANIMATION_EASINGS 
} from './animations';
import { placesData, Country, SubLocation, getCountryByLocationId, getLocationByName, resolveLocationForNavigation } from '../constants/placesData';
import { ForumPost, ForumLocation } from '../screens/Pods/components/Forum/forumTypes';

export interface LocationNavigationConfig {
  locationId?: string;
  locationName: string;
  countryId?: string;
  countryName?: string;
  fromScreen: string;
  scrollPosition?: number;
  scrollRef?: React.RefObject<any>;
  additionalParams?: Record<string, any>;
}

export interface LocationNavigationContext {
  fromFeed?: boolean;
  previousScreen?: string;
  scrollPosition?: number;
  navigationTimestamp?: number;
}

export interface LocationNavigationHandlers {
  handleForumPostLocation: (config: {
    post: ForumPost;
    location: ForumLocation;
  }) => void;
}

export interface LocationNavigationOptions {
  initialTab?: 'Forum' | 'PhotoFeed';
  showAlert?: boolean;
  debugMode?: boolean;
}

/**
 * CENTRALIZED LOCATION NAVIGATION SYSTEM
 * 
 * This utility provides a unified way to navigate to locations across the entire app.
 * It handles both SubLocations and Countries automatically, ensuring consistent behavior.
 * 
 * Features:
 * - Automatic resolution of SubLocations vs Countries
 * - Consistent navigation parameters
 * - Error handling with user feedback
 * - Debug logging for development
 * - Backend-friendly structure for future API integration
 */
export class LocationNavigation {
  // Parse location data and determine navigation destination
  static parseLocationData(location: ForumLocation, post: ForumPost): {
    targetCountry: Country | null;
    targetLocation: SubLocation | null;
    navigationMode: 'country' | 'location' | 'global';
  } {
    // Handle global posts
    if (location.countryId === 'global' || location.type === 'global') {
      return {
        targetCountry: null,
        targetLocation: null,
        navigationMode: 'global'
      };
    }

    // Find the country
    let targetCountry: Country | null = null;
    
    // First try to find by countryId
    if (location.countryId) {
      targetCountry = placesData
        .flatMap(continent => continent.countries)
        .find(country => country.id === location.countryId) || null;
    }
    
    // If not found, try to find by location ID using utility
    if (!targetCountry) {
      targetCountry = getCountryByLocationId(location.id);
    }
    
    // If still not found, try by location name
    if (!targetCountry && location.name) {
      const foundLocation = getLocationByName(location.name);
      if (foundLocation) {
        targetCountry = getCountryByLocationId(foundLocation.id);
      }
    }

    if (!targetCountry) {
      return {
        targetCountry: null,
        targetLocation: null,
        navigationMode: 'global'
      };
    }

    // Find the specific location within the country
    let targetLocation: SubLocation | null = null;
    
    // Handle "All" or country-level posts
    if (location.id === 'All' || location.name === targetCountry.name) {
      return {
        targetCountry,
        targetLocation: null,
        navigationMode: 'country'
      };
    }
    
    // Find specific location
    targetLocation = targetCountry.subLocations.find(subLoc => 
      subLoc.id === location.id || 
      subLoc.name === location.name ||
      subLoc.name === location.name.split('-').pop()
    ) || null;

    return {
      targetCountry,
      targetLocation,
      navigationMode: targetLocation ? 'location' : 'country'
    };
  }

  // Create navigation handlers for a specific screen
  static createHandlersForScreen(
    navigation: NavigationProp<ParamListBase>, 
    screenName: string
  ): LocationNavigationHandlers {
    const handleForumPostLocation = async (config: {
      post: ForumPost;
      location: ForumLocation;
    }) => {
      try {
        const { post, location } = config;
        
        // Parse location data
        const { targetCountry, targetLocation, navigationMode } = this.parseLocationData(location, post);
        
        // Handle global posts - don't navigate anywhere
        if (navigationMode === 'global') {
          return;
        }
        
        // Handle cases where we can't find the country
        if (!targetCountry) {
          console.warn('Could not find country for location:', location);
          return;
        }

        // Create navigation context
        const navigationContext: LocationNavigationContext = {
          fromFeed: screenName === 'GlobalFeed',
          previousScreen: screenName,
          navigationTimestamp: Date.now()
        };

        // Navigate to Pods with specific parameters
        // This will trigger the pods navigation system to show the country view
        navigation.navigate('Pods', {
          initialCountry: targetCountry.id,
          initialLocation: targetLocation?.id || 'All',
          navigationContext,
          autoNavigateToCountry: true,
          targetLocationFilter: targetLocation?.name || 'All',
          autoSelectLocationTab: true // Flag to auto-select the specific location tab
        });

      } catch (error) {
        console.error('Error navigating to location:', error);
      }
    };

    return {
      handleForumPostLocation
    };
  }

  // Helper method to get display name for a location
  static getLocationDisplayName(location: ForumLocation): string {
    // Clean up location names (remove country ID prefixes, etc.)
    let displayName = location.name;
    
    if (displayName.includes('-')) {
      displayName = displayName.split('-').pop() || displayName;
    }
    
    return displayName;
  }

  // Check if location is navigable (not global)
  static isLocationNavigable(location: ForumLocation): boolean {
    return location.countryId !== 'global' && location.type !== 'global';
  }

  /**
   * Navigate to a location in the Pods system
   * @param navigation - React Navigation instance
   * @param locationName - Name of the location (SubLocation or Country)
   * @param options - Navigation options
   */
  static navigateToLocation(
    navigation: any, 
    locationName: string, 
    options: LocationNavigationOptions = {}
  ): boolean {
    const { 
      initialTab = 'Forum',
      showAlert = true,
      debugMode = __DEV__
    } = options;

    if (!locationName) {
      if (debugMode) {
        console.warn('[LOCATION NAVIGATION] No location name provided');
      }
      return false;
    }

    // Use unified location resolver
    const resolved = resolveLocationForNavigation(locationName);
    
    if (resolved.type === 'sublocation' && resolved.location && resolved.country) {
      // Navigate to specific sublocation
      navigation.navigate('Pods', {
        initialCountry: resolved.country.id,
        initialLocation: resolved.location.id,
        autoNavigateToCountry: true,
        targetLocationFilter: resolved.location.name,
        autoSelectLocationTab: true,
        initialTab: initialTab
      });
      
      if (debugMode) {
        console.log(`[LOCATION NAVIGATION] Navigated to SubLocation: ${resolved.location.name} in ${resolved.country.name}`);
      }
      return true;
      
    } else if (resolved.type === 'country' && resolved.country) {
      // Navigate to country-level
      navigation.navigate('Pods', {
        initialCountry: resolved.country.id,
        initialLocation: 'All',
        autoNavigateToCountry: true,
        targetLocationFilter: 'All',
        autoSelectLocationTab: true,
        initialTab: initialTab
      });
      
      if (debugMode) {
        console.log(`[LOCATION NAVIGATION] Navigated to Country: ${resolved.country.name}`);
      }
      return true;
      
    } else {
      // Location not found
      if (debugMode) {
        console.warn(`[LOCATION NAVIGATION] Could not resolve location: "${locationName}"`);
      }
      
      if (showAlert) {
        Alert.alert(
          'Location Not Found',
          `Sorry, we couldn't find "${locationName}" in our travel database. This location might need to be added to our system.`,
          [{ text: 'OK' }]
        );
      }
      return false;
    }
  }

  /**
   * Navigate to PhotoFeed for a specific location
   * @param navigation - React Navigation instance
   * @param locationName - Name of the location
   */
  static navigateToPhotoFeed(navigation: any, locationName: string): boolean {
    return this.navigateToLocation(navigation, locationName, {
      initialTab: 'PhotoFeed'
    });
  }

  /**
   * Navigate to Forum for a specific location
   * @param navigation - React Navigation instance
   * @param locationName - Name of the location
   */
  static navigateToForum(navigation: any, locationName: string): boolean {
    return this.navigateToLocation(navigation, locationName, {
      initialTab: 'Forum'
    });
  }

  /**
   * Check if a location exists in the system
   * @param locationName - Name of the location to check
   * @returns boolean indicating if location exists
   */
  static isLocationValid(locationName: string): boolean {
    const resolved = resolveLocationForNavigation(locationName);
    return resolved.type !== null;
  }

  /**
   * Get location info for debugging or display purposes
   * @param locationName - Name of the location
   * @returns location information object
   */
  static getLocationInfo(locationName: string) {
    return resolveLocationForNavigation(locationName);
  }
}

// Export convenience functions for direct use
export const navigateToLocation = LocationNavigation.navigateToLocation;
export const navigateToPhotoFeed = LocationNavigation.navigateToPhotoFeed;
export const navigateToForum = LocationNavigation.navigateToForum;
export const isLocationValid = LocationNavigation.isLocationValid;

export default LocationNavigation; 
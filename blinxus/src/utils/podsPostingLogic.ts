import { 
  SubLocation, 
  Country, 
  Continent,
  getLocationByName,
  getLocationById,
  getCountryByLocationId,
  getContinentByLocationId,
  searchLocations
} from '../constants/placesData';
import { ActivityKey } from '../constants/activityTags';

// Interface for post location data
export interface PostLocationData {
  locationId: string;
  locationName: string;
  countryId: string;
  countryName: string;
  continentId: string;
  continentName: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

// Interface for creating a new post
export interface CreatePostData {
  id: string;
  authorId: string;
  content: string;
  images?: string[];
  activityType: ActivityKey;
  locationInput: string; // What the user typed (e.g., "elyu", "La Union", "Manila")
  createdAt: Date;
  tags?: string[];
}

// Interface for a processed post ready for Pods
export interface ProcessedPostForPods extends CreatePostData {
  locationData: PostLocationData;
  isLocationVerified: boolean;
  suggestedLocations?: SubLocation[]; // If location couldn't be matched exactly
}

// Interface for Post-Pod relationship
export interface PostPodRelationship {
  postId: string;
  locationId: string;
  countryId: string;
  continentId: string;
  activityType: ActivityKey;
  createdAt: Date;
}

// Main class for handling post-to-Pod logic
export class PodsPostingService {
  private static instance: PodsPostingService;
  private postPodRelationships: Map<string, PostPodRelationship> = new Map();

  private constructor() {}

  public static getInstance(): PodsPostingService {
    if (!PodsPostingService.instance) {
      PodsPostingService.instance = new PodsPostingService();
    }
    return PodsPostingService.instance;
  }

  /**
   * Process a post and determine which Pod(s) it should belong to
   */
  public processPostForPods(postData: CreatePostData): ProcessedPostForPods {
    const locationMatch = this.matchLocationFromInput(postData.locationInput);
    
    if (locationMatch.exact) {
      // Exact match found
      const location = locationMatch.exact;
      const country = getCountryByLocationId(location.id);
      const continent = getContinentByLocationId(location.id);

      if (!country || !continent) {
        throw new Error(`Invalid location hierarchy for ${location.name}`);
      }

      const locationData: PostLocationData = {
        locationId: location.id,
        locationName: location.name,
        countryId: country.id,
        countryName: country.name,
        continentId: continent.id,
        continentName: continent.name,
        coordinates: location.coordinates,
      };

      // Create the relationship
      const relationship: PostPodRelationship = {
        postId: postData.id,
        locationId: location.id,
        countryId: country.id,
        continentId: continent.id,
        activityType: postData.activityType,
        createdAt: postData.createdAt,
      };

      this.postPodRelationships.set(postData.id, relationship);

      return {
        ...postData,
        locationData,
        isLocationVerified: true,
      };
    } else {
      // No exact match - provide suggestions
      const processedPost: ProcessedPostForPods = {
        ...postData,
        locationData: {
          locationId: '',
          locationName: postData.locationInput,
          countryId: '',
          countryName: '',
          continentId: '',
          continentName: '',
        },
        isLocationVerified: false,
        suggestedLocations: locationMatch.suggestions,
      };

      return processedPost;
    }
  }

  /**
   * Match location input to actual location data
   */
  private matchLocationFromInput(input: string): {
    exact: SubLocation | null;
    suggestions: SubLocation[];
  } {
    // First try exact match by name or alternate names
    const exactMatch = getLocationByName(input);
    if (exactMatch) {
      return {
        exact: exactMatch,
        suggestions: [],
      };
    }

    // If no exact match, search for similar locations
    const suggestions = searchLocations(input).slice(0, 5); // Limit to 5 suggestions

    return {
      exact: null,
      suggestions,
    };
  }

  /**
   * Get all posts for a specific location Pod
   */
  public getPostsForLocation(locationId: string): string[] {
    const postIds: string[] = [];
    
    this.postPodRelationships.forEach((relationship, postId) => {
      if (relationship.locationId === locationId) {
        postIds.push(postId);
      }
    });

    return postIds.sort((a, b) => {
      const relationshipA = this.postPodRelationships.get(a);
      const relationshipB = this.postPodRelationships.get(b);
      
      if (!relationshipA || !relationshipB) return 0;
      
      // Sort by creation date, newest first
      return relationshipB.createdAt.getTime() - relationshipA.createdAt.getTime();
    });
  }

  /**
   * Get all posts for a specific country Pod
   */
  public getPostsForCountry(countryId: string): string[] {
    const postIds: string[] = [];
    
    this.postPodRelationships.forEach((relationship, postId) => {
      if (relationship.countryId === countryId) {
        postIds.push(postId);
      }
    });

    return postIds.sort((a, b) => {
      const relationshipA = this.postPodRelationships.get(a);
      const relationshipB = this.postPodRelationships.get(b);
      
      if (!relationshipA || !relationshipB) return 0;
      
      return relationshipB.createdAt.getTime() - relationshipA.createdAt.getTime();
    });
  }

  /**
   * Get all posts for a specific continent Pod
   */
  public getPostsForContinent(continentId: string): string[] {
    const postIds: string[] = [];
    
    this.postPodRelationships.forEach((relationship, postId) => {
      if (relationship.continentId === continentId) {
        postIds.push(postId);
      }
    });

    return postIds.sort((a, b) => {
      const relationshipA = this.postPodRelationships.get(a);
      const relationshipB = this.postPodRelationships.get(b);
      
      if (!relationshipA || !relationshipB) return 0;
      
      return relationshipB.createdAt.getTime() - relationshipA.createdAt.getTime();
    });
  }

  /**
   * Get posts filtered by activity type for a location
   */
  public getPostsForLocationByActivity(locationId: string, activityType: ActivityKey): string[] {
    const postIds: string[] = [];
    
    this.postPodRelationships.forEach((relationship, postId) => {
      if (relationship.locationId === locationId && relationship.activityType === activityType) {
        postIds.push(postId);
      }
    });

    return postIds.sort((a, b) => {
      const relationshipA = this.postPodRelationships.get(a);
      const relationshipB = this.postPodRelationships.get(b);
      
      if (!relationshipA || !relationshipB) return 0;
      
      return relationshipB.createdAt.getTime() - relationshipA.createdAt.getTime();
    });
  }

  /**
   * Get community stats for a location
   */
  public getLocationStats(locationId: string): {
    postCount: number;
    uniqueAuthors: number;
    popularActivities: ActivityKey[];
    recentActivity: Date | null;
  } {
    const posts = this.getPostsForLocation(locationId);
    const relationships = posts.map(id => this.postPodRelationships.get(id)).filter(Boolean);
    
    const uniqueAuthors = new Set<string>();
    const activityCounts = new Map<ActivityKey, number>();
    let mostRecentActivity: Date | null = null;

    relationships.forEach(relationship => {
      if (relationship) {
        // Note: We don't have authorId in relationship, would need to get from post data
        // For now, just count activities
        const currentCount = activityCounts.get(relationship.activityType) || 0;
        activityCounts.set(relationship.activityType, currentCount + 1);
        
        if (!mostRecentActivity || relationship.createdAt > mostRecentActivity) {
          mostRecentActivity = relationship.createdAt;
        }
      }
    });

    // Sort activities by frequency
    const popularActivities = Array.from(activityCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5) // Top 5 activities
      .map(([activity]) => activity);

    return {
      postCount: posts.length,
      uniqueAuthors: uniqueAuthors.size,
      popularActivities,
      recentActivity: mostRecentActivity,
    };
  }

  /**
   * Update post location after user confirms suggestion
   */
  public updatePostLocation(postId: string, confirmedLocation: SubLocation): boolean {
    const country = getCountryByLocationId(confirmedLocation.id);
    const continent = getContinentByLocationId(confirmedLocation.id);

    if (!country || !continent) {
      return false;
    }

    const existingRelationship = this.postPodRelationships.get(postId);
    if (!existingRelationship) {
      return false;
    }

    // Update the relationship
    const updatedRelationship: PostPodRelationship = {
      ...existingRelationship,
      locationId: confirmedLocation.id,
      countryId: country.id,
      continentId: continent.id,
    };

    this.postPodRelationships.set(postId, updatedRelationship);
    return true;
  }

  /**
   * Remove a post from all Pods
   */
  public removePostFromPods(postId: string): boolean {
    return this.postPodRelationships.delete(postId);
  }

  /**
   * Get post's location data
   */
  public getPostLocationData(postId: string): PostPodRelationship | null {
    return this.postPodRelationships.get(postId) || null;
  }

  /**
   * Batch process multiple posts (useful for initialization)
   */
  public batchProcessPosts(posts: CreatePostData[]): ProcessedPostForPods[] {
    return posts.map(post => this.processPostForPods(post));
  }

  /**
   * Get trending locations based on recent post activity
   */
  public getTrendingLocations(limit: number = 10): {
    locationId: string;
    postCount: number;
    recentPosts: number; // Posts in last 7 days
  }[] {
    const locationCounts = new Map<string, { total: number; recent: number }>();
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    this.postPodRelationships.forEach(relationship => {
      const existing = locationCounts.get(relationship.locationId) || { total: 0, recent: 0 };
      existing.total += 1;
      
      if (relationship.createdAt > sevenDaysAgo) {
        existing.recent += 1;
      }
      
      locationCounts.set(relationship.locationId, existing);
    });

    return Array.from(locationCounts.entries())
      .map(([locationId, counts]) => ({
        locationId,
        postCount: counts.total,
        recentPosts: counts.recent,
      }))
      .sort((a, b) => {
        // Sort by recent activity first, then total posts
        if (b.recentPosts !== a.recentPosts) {
          return b.recentPosts - a.recentPosts;
        }
        return b.postCount - a.postCount;
      })
      .slice(0, limit);
  }

  /**
   * Export data for persistence
   */
  public exportData(): PostPodRelationship[] {
    return Array.from(this.postPodRelationships.values());
  }

  /**
   * Import data from persistence
   */
  public importData(relationships: PostPodRelationship[]): void {
    this.postPodRelationships.clear();
    relationships.forEach(relationship => {
      this.postPodRelationships.set(relationship.postId, relationship);
    });
  }

  /**
   * Clear all data (useful for testing)
   */
  public clearData(): void {
    this.postPodRelationships.clear();
  }
}

// Utility functions for external use
export const podsService = PodsPostingService.getInstance();

/**
 * Helper function to validate location input before creating post
 */
export const validateLocationInput = (input: string): {
  isValid: boolean;
  suggestions: SubLocation[];
  exactMatch?: SubLocation;
} => {
  const exactMatch = getLocationByName(input);
  
  if (exactMatch) {
    return {
      isValid: true,
      suggestions: [],
      exactMatch,
    };
  }

  const suggestions = searchLocations(input).slice(0, 5);
  
  return {
    isValid: suggestions.length > 0,
    suggestions,
  };
};

/**
 * Helper function to format location display name
 */
export const formatLocationDisplay = (locationData: PostLocationData): string => {
  if (locationData.locationName && locationData.countryName) {
    return `${locationData.locationName}, ${locationData.countryName}`;
  }
  return locationData.locationName || 'Unknown Location';
};

/**
 * Helper function to get all locations in a country for autocomplete
 */
export const getLocationSuggestionsForCountry = (countryId: string): SubLocation[] => {
  const country = getCountryByLocationId(countryId);
  return country ? country.subLocations : [];
};

// Default export
export default PodsPostingService; 
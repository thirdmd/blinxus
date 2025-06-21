import { Country, SubLocation, placesData } from '../constants/placesData';

// Forum post interface
export interface ForumPost {
  id: string;
  authorId: string;
  authorName: string;
  authorInitials: string;
  authorColor: string;
  content: string;
  locationId: string; // ID of the specific location (sublocation)
  countryId: string;  // ID of the country
  timestamp: string;
  replyCount: number;
  likes: number;
  isLiked: boolean;
  category: 'question' | 'tip' | 'recommendation' | 'general';
  activityTags: string[];
}

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

// Generate mock forum posts for a country
export const generateMockForumPosts = (country: Country): ForumPost[] => {
  const posts: ForumPost[] = [];
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];
  
  // Sample posts for different locations
  const samplePosts = [
    {
      authorName: 'Maria Santos',
      authorInitials: 'MS',
      content: 'Best coffee shops in the area? Looking for a good place to work remotely with reliable wifi and great ambiance. Any recommendations?',
      replyCount: 12,
      category: 'question' as const,
      activityTags: ['food'],
    },
    {
      authorName: 'Juan dela Cruz', 
      authorInitials: 'JC',
      content: 'Planning a weekend trip here. What\'s the best time to visit and any tips for first-timers?',
      replyCount: 8,
      category: 'question' as const,
      activityTags: ['general'],
    },
    {
      authorName: 'Anna Reyes',
      authorInitials: 'AR', 
      content: 'Looking for budget-friendly accommodations with good reviews. Any hidden gems you can recommend?',
      replyCount: 15,
      category: 'recommendation' as const,
      activityTags: ['accommodation'],
    },
    {
      authorName: 'Carlos Mendoza',
      authorInitials: 'CM',
      content: 'What are the must-try local dishes here? I\'m a foodie and want to experience authentic flavors!',
      replyCount: 23,
      category: 'question' as const,
      activityTags: ['food'],
    },
    {
      authorName: 'Sofia Garcia',
      authorInitials: 'SG',
      content: 'Transportation tips? What\'s the best way to get around and explore different spots?',
      replyCount: 6,
      category: 'tip' as const,
      activityTags: ['transport'],
    },
  ];
  
  // Generate posts for each location in the country
  country.subLocations.forEach((location, locationIndex) => {
    // Generate 1-3 posts per location
    const postsForLocation = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < postsForLocation; i++) {
      const postTemplate = samplePosts[(locationIndex + i) % samplePosts.length];
      const hoursAgo = Math.floor(Math.random() * 24) + 1;
      
      posts.push({
        id: `${location.id}-post-${i}`,
        authorId: `user-${locationIndex}-${i}`,
        authorName: postTemplate.authorName,
        authorInitials: postTemplate.authorInitials,
        authorColor: colors[(locationIndex + i) % colors.length],
        content: postTemplate.content,
        locationId: location.id,
        countryId: country.id,
        timestamp: `${hoursAgo}h ago`,
        replyCount: postTemplate.replyCount + Math.floor(Math.random() * 10),
        likes: Math.floor(Math.random() * 50),
        isLiked: Math.random() > 0.7,
        category: postTemplate.category,
        activityTags: postTemplate.activityTags,
      });
    }
  });
  
  // Sort posts by timestamp (most recent first)
  return posts.sort((a, b) => {
    const aHours = parseInt(a.timestamp.replace('h ago', ''));
    const bHours = parseInt(b.timestamp.replace('h ago', ''));
    return aHours - bHours;
  });
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
// Backend-ready API layer for Forum functionality
// This will be easily replaceable with real API calls

import { 
  ForumPost, 
  ForumUser,
  ForumLocation,
  CreateForumPostRequest, 
  CreateForumPostResponse,
  GetForumPostsRequest,
  GetForumPostsResponse,
  UpdatePostInteractionRequest,
  UpdatePostInteractionResponse,
  FORUM_CATEGORIES,
  FORUM_ACTIVITY_TAGS
} from './forumTypes';
import { Country, placesData } from '../../../../constants/placesData';
import { usersDatabase, getCurrentUser } from '../../../../types/userData/users_data';

// Mock users database - includes current user integration
const MOCK_USERS: ForumUser[] = [
  // Current user - Third Camacho
  {
    id: 'current_user',
    username: getCurrentUser().username,
    displayName: getCurrentUser().displayName,
    avatarUrl: getCurrentUser().profileImage,
    initials: 'TC',
    color: '#3B82F6',
    nationalityFlag: getCurrentUser().nationalityFlag,
    isVerified: true,
    memberSince: '2023-01-15'
  },
  {
    id: 'user-1',
    username: 'wanderlust_alex',
    displayName: 'Alex Chen',
    avatarUrl: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400',
    initials: 'AC',
    color: '#3B82F6',
    nationalityFlag: '🇨🇳',
    isVerified: true,
    memberSince: '2023-01-15'
  },
  {
    id: 'user-2',
    username: 'backpacker_sarah',
    displayName: 'Sarah Johnson',
    avatarUrl: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=400',
    initials: 'SJ',
    color: '#10B981',
    nationalityFlag: '🇺🇸',
    isVerified: false,
    memberSince: '2023-06-22'
  },
  {
    id: 'user-3',
    username: 'local_guide_miguel',
    displayName: 'Miguel Rodriguez',
    avatarUrl: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
    initials: 'MR',
    color: '#F59E0B',
    nationalityFlag: '🇪🇸',
    isVerified: true,
    memberSince: '2022-03-10'
  },
  {
    id: 'user-4',
    username: 'solo_traveler_jenny',
    displayName: 'Jenny Kim',
    avatarUrl: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    initials: 'JK',
    color: '#8B5CF6',
    nationalityFlag: '🇰🇷',
    isVerified: false,
    memberSince: '2023-09-05'
  },
  {
    id: 'user-5',
    username: 'photography_dan',
    displayName: 'Daniel Smith',
    avatarUrl: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400',
    initials: 'DS',
    color: '#EF4444',
    nationalityFlag: '🇬🇧',
    isVerified: true,
    memberSince: '2022-11-18'
  },
  {
    id: 'user-6',
    username: 'adventurer_maya',
    displayName: 'Maya Patel',
    avatarUrl: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    initials: 'MP',
    color: '#06B6D4',
    nationalityFlag: '🇮🇳',
    isVerified: false,
    memberSince: '2023-04-12'
  },
  {
    id: 'user-7',
    username: 'foodie_carlo',
    displayName: 'Carlo Rossi',
    avatarUrl: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=400',
    initials: 'CR',
    color: '#84CC16',
    nationalityFlag: '🇮🇹',
    isVerified: true,
    memberSince: '2022-08-30'
  },
  {
    id: 'user-8',
    username: 'beach_lover_anna',
    displayName: 'Anna Schmidt',
    avatarUrl: 'https://images.pexels.com/photos/1024311/pexels-photo-1024311.jpeg?auto=compress&cs=tinysrgb&w=400',
    initials: 'AS',
    color: '#F472B6',
    nationalityFlag: '🇩🇪',
    isVerified: false,
    memberSince: '2023-07-18'
  }
];

// Mock locations database
const generateLocationsForCountry = (country: Country): ForumLocation[] => {
  const locations: ForumLocation[] = [
    {
      id: country.id,
      name: country.name,
      type: 'country',
      countryId: country.id
    }
  ];

  // Add sub-locations with just the location name (no country prefix)
  country.subLocations?.forEach(subLocation => {
    locations.push({
      id: `${country.id}-${subLocation.id}`,
      name: subLocation.name, // Just the location name, e.g., "Osaka" not "jp-osaka"
      type: 'city',
      countryId: country.id
    });
  });

  return locations;
};

// Simple counter for unique IDs
let postIdCounter = 1;

// Stable mock posts generator - no randomness for consistent UI
const generateMockPosts = (country: Country, count: number = 15): ForumPost[] => {
  const locations = generateLocationsForCountry(country);
  const posts: ForumPost[] = [];

  // Stable predefined posts - no randomness
  const stablePosts = [
    {
      content: "Just arrived in {location}! Any recommendations for the best local food spots? Looking for authentic experiences, not tourist traps 🍜",
      category: 'question' as const,
      tags: ['restaurants', 'local-cuisine', 'street-food'],
      authorIndex: 0,
      locationIndex: 0,
      daysAgo: 2,
      likes: 23,
      replies: 8
    },
    {
      content: "The sunrise at {location} was absolutely breathtaking today! Woke up at 5 AM and it was totally worth it. The golden hour lighting is pure magic ✨",
      category: 'general' as const,
      tags: ['sightseeing', 'photography', 'hiking'],
      authorIndex: 1,
      locationIndex: 1,
      daysAgo: 1,
      likes: 45,
      replies: 12
    },
    {
      content: "Anyone know good basketball courts in {location}? Looking to join pickup games and meet some local ballers! 🏀",
      category: 'question' as const,
      tags: ['sports', 'basketball', 'locals'],
      authorIndex: 2,
      locationIndex: 2,
      daysAgo: 3,
      likes: 17,
      replies: 5
    },
    {
      content: "Pro tip: taxi drivers near the central station will try to overcharge you. Use the local ride-hailing app instead - way cheaper and safer! 🚕",
      category: 'tip' as const,
      tags: ['local-transport', 'money-saving', 'safety'],
      authorIndex: 3,
      locationIndex: 0,
      daysAgo: 5,
      likes: 67,
      replies: 15
    },
    {
      content: "The local food scene in {location} is amazing! Found some incredible restaurants with authentic cuisine. The flavors here are unforgettable! 🍽️",
      category: 'recommendation' as const,
      tags: ['restaurants', 'local-cuisine', 'food-markets'],
      authorIndex: 4,
      locationIndex: 1,
      daysAgo: 4,
      likes: 89,
      replies: 23
    },
    {
      content: "Planning a hiking trip this weekend around {location} - anyone interested? It's moderate difficulty with amazing views! 🥾",
      category: 'meetup' as const,
      tags: ['hiking', 'outdoors', 'views'],
      authorIndex: 5,
      locationIndex: 2,
      daysAgo: 1,
      likes: 34,
      replies: 18
    },
    {
      content: "Photographers of {location}! Where are the best spots for architectural and street photography? Looking for those hidden gems 📸",
      category: 'question' as const,
      tags: ['photography', 'architecture', 'sightseeing'],
      authorIndex: 6,
      locationIndex: 0,
      daysAgo: 6,
      likes: 28,
      replies: 9
    },
    {
      content: "The people in {location} are incredibly warm and welcoming! Had the most amazing conversations at local coffee shops. Don't be shy - just say hello! ☕",
      category: 'general' as const,
      tags: ['culture', 'locals', 'cafes'],
      authorIndex: 7,
      locationIndex: 1,
      daysAgo: 3,
      likes: 52,
      replies: 14
    },
    {
      content: "First time in {location} and I'm blown away! The blend of modern city life and traditional culture is incredible. Any must-see spots I shouldn't miss?",
      category: 'question' as const,
      tags: ['culture', 'sightseeing', 'recommendations'],
      authorIndex: 0,
      locationIndex: 2,
      daysAgo: 7,
      likes: 41,
      replies: 16
    },
    {
      content: "The views from {location} are absolutely breathtaking! Spent the whole day exploring and taking photos. This place has such incredible natural beauty! 📸✨",
      category: 'general' as const,
      tags: ['views', 'photography', 'outdoors'],
      authorIndex: 1,
      locationIndex: 0,
      daysAgo: 2,
      likes: 73,
      replies: 11
    },
    {
      content: "Looking for accommodation recommendations in {location}? Found this amazing boutique hotel that's Instagram-worthy but not overpriced!",
      category: 'recommendation' as const,
      tags: ['accommodation', 'budget-friendly', 'instagram'],
      authorIndex: 2,
      locationIndex: 1,
      daysAgo: 8,
      likes: 36,
      replies: 7
    },
    {
      content: "The local markets in {location} are a sensory overload in the best way! So many unique spices, handmade crafts, and friendly vendors 🛍️",
      category: 'general' as const,
      tags: ['markets', 'shopping', 'culture'],
      authorIndex: 3,
      locationIndex: 2,
      daysAgo: 4,
      likes: 58,
      replies: 19
    },
    {
      content: "Transportation hack for {location}: get the local bus card at any convenience store. Way cheaper than tourist options and you'll feel like a local!",
      category: 'tip' as const,
      tags: ['local-transport', 'money-saving', 'local-tips'],
      authorIndex: 4,
      locationIndex: 0,
      daysAgo: 9,
      likes: 94,
      replies: 24
    },
    {
      content: "Museums in {location} are world-class! Spent the whole day at the history museum and learned so much about the region. Highly recommend! 🏛️",
      category: 'recommendation' as const,
      tags: ['museums', 'history', 'culture'],
      authorIndex: 5,
      locationIndex: 1,
      daysAgo: 6,
      likes: 42,
      replies: 13
    },
    {
      content: "Rainy day activities in {location}? Looking for indoor options that aren't just shopping malls. Coffee roasters? Art galleries? Hidden gems? ☔",
      category: 'question' as const,
      tags: ['indoor-activities', 'coffee', 'art', 'rainy-day'],
      authorIndex: 6,
      locationIndex: 2,
      daysAgo: 5,
      likes: 31,
      replies: 8
    }
  ];

  // Get non-current users
  const nonCurrentUsers = MOCK_USERS.filter(user => user.id !== 'current_user');
  
  for (let i = 0; i < Math.min(count, stablePosts.length); i++) {
    const template = stablePosts[i];
    
    // Use stable, predictable user and location selection
    const selectedUser = nonCurrentUsers[template.authorIndex % nonCurrentUsers.length];
    const selectedLocation = locations[template.locationIndex % locations.length];

    posts.push({
      id: `stable-post-${country.id}-${i + 1}`,
      authorId: selectedUser.id,
      author: selectedUser,
      content: template.content.replace('{location}', selectedLocation.name),
      
      locationId: selectedLocation.id,
      location: selectedLocation,
      countryId: country.id,
      category: template.category,
      activityTags: template.tags,
      
      likes: template.likes,
      dislikes: 0,
      replyCount: template.replies,
      viewCount: template.likes * 3 + 25,
      bookmarkCount: Math.floor(template.likes / 4),
      
      isLiked: false,
      isDisliked: false,
      isBookmarked: false,
      isFollowing: false,
      
      createdAt: new Date(Date.now() - (template.daysAgo * 24 * 60 * 60 * 1000)).toISOString(),
      updatedAt: new Date(Date.now() - (template.daysAgo * 24 * 60 * 60 * 1000)).toISOString(),
      lastActivityAt: new Date(Date.now() - (template.daysAgo * 12 * 60 * 60 * 1000)).toISOString(),
      
      status: 'active',
      isPinned: false,
      isLocked: false,
      
      metadata: {
        editCount: 0,
        reportCount: 0
      }
    });
  }

  return posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// API Configuration
const API_CONFIG = {
  baseUrl: 'https://api.blinxus.com', // Will be replaced with environment variable
  timeout: 10000,
  retryAttempts: 3
};

// Utility function to simulate API delay
const simulateApiDelay = (ms: number = 150) => 
  new Promise<void>(resolve => setTimeout(resolve, ms)); // Fast but smooth loading

// Error handling utility
const handleApiError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

// Helper function to find country by ID from placesData
const findCountryById = (countryId: string): Country | null => {
  for (const continent of placesData) {
    const country = continent.countries.find(c => c.id === countryId);
    if (country) return country;
  }
  return null;
};

// API Methods - Currently mock, easily replaceable with real API calls
export class ForumAPI {
  private static posts: Map<string, ForumPost[]> = new Map();
  private static userPosts: Map<string, ForumPost[]> = new Map(); // Separate storage for user posts
  private static globalFeed: ForumPost[] = []; // NEW: Global feed cache
  private static isPreloaded: boolean = false;
  private static isGlobalFeedInitialized: boolean = false;

  // NEW: Initialize global feed with posts from all countries
  private static initializeGlobalFeed() {
    if (this.isGlobalFeedInitialized) return;
    
    // Import all countries from placesData
    const { placesData } = require('../../../../constants/placesData');
    const allCountries = placesData.flatMap((continent: any) => continent.countries);
    
    // Generate posts for all countries and add to global feed
    allCountries.forEach((country: any) => {
      const countryPosts = generateMockPosts(country, 8); // Fewer posts per country for global feed
      this.globalFeed.push(...countryPosts);
    });
    
    // Sort global feed by creation date (most recent first)
    this.globalFeed.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    this.isGlobalFeedInitialized = true;
  }

  // NEW: Get global feed posts (all posts from all countries)
  static async getGlobalFeedPosts(params: {
    page?: number;
    limit?: number;
    searchQuery?: string;
    sortBy?: 'recent' | 'popular' | 'trending';
  } = {}): Promise<GetForumPostsResponse> {
    try {
      // Initialize global feed if not done
      this.initializeGlobalFeed();
      
      await simulateApiDelay(100);

      // Combine global feed with all user posts from all countries
      let allPosts = [...this.globalFeed];
      
      // Add all user posts from all countries to global feed
      for (const [countryId, userPosts] of this.userPosts.entries()) {
        allPosts.unshift(...userPosts); // User posts always at top
      }

      // Apply search filter
      if (params.searchQuery) {
        const query = params.searchQuery.toLowerCase();
        allPosts = allPosts.filter(post => 
          post.content.toLowerCase().includes(query) ||
          post.author.displayName.toLowerCase().includes(query) ||
          post.location.name.toLowerCase().includes(query)
        );
      }

      // Apply sorting
      const sortBy = params.sortBy || 'recent';
      allPosts = allPosts.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;

        switch (sortBy) {
          case 'popular':
            return (b.likes + b.replyCount) - (a.likes + a.replyCount);
          case 'trending':
            return b.viewCount - a.viewCount;
          case 'recent':
          default:
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
      });

      // Apply pagination
      const page = params.page || 1;
      const limit = params.limit || 15;
      const startIndex = (page - 1) * limit;
      const paginatedPosts = allPosts.slice(startIndex, startIndex + limit);

      return {
        success: true,
        posts: paginatedPosts,
        totalCount: allPosts.length,
        hasMore: startIndex + limit < allPosts.length,
        nextPage: startIndex + limit < allPosts.length ? page + 1 : undefined
      };

    } catch (error) {
      return {
        success: false,
        posts: [],
        totalCount: 0,
        hasMore: false,
        error: handleApiError(error)
      };
    }
  }

  // RADICAL FIX: Preload all posts for instant access
  private static preloadAllPosts() {
    if (this.isPreloaded) return;
    
    // Preload posts for major countries
    const majorCountries = ['jp', 'ph', 'th', 'sg', 'my', 'vn', 'id'];
    majorCountries.forEach(countryId => {
      const actualCountry = findCountryById(countryId);
      if (actualCountry && !this.posts.has(countryId)) {
        this.posts.set(countryId, generateMockPosts(actualCountry, 15));
      }
    });
    
    this.isPreloaded = true;
  }

  // GET /api/forum/posts
  static async getPosts(params: GetForumPostsRequest): Promise<GetForumPostsResponse> {
    try {
      // FAST: Preload posts + tiny delay for smooth loading animation
      this.preloadAllPosts();
      await simulateApiDelay(100); // Just enough for smooth loading animation

      // For real API, this would be:
      // const response = await fetch(`${API_CONFIG.baseUrl}/api/forum/posts`, {
      //   method: 'GET',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(params)
      // });
      // const data = await response.json();

      const cacheKey = params.countryId;
      
      // Only generate posts if not cached - stable posts now
      if (!this.posts.has(cacheKey)) {
        // Find the actual country data using helper function
        const actualCountry = findCountryById(params.countryId);
        if (actualCountry) {
          this.posts.set(cacheKey, generateMockPosts(actualCountry, 15));
        } else {
          // Fallback to mock if country not found
          const mockCountry: Country = { 
            id: params.countryId, 
            name: 'Unknown Country', 
            alternateNames: [],
            continentId: 'unknown',
            subLocations: []
          };
          this.posts.set(cacheKey, generateMockPosts(mockCountry, 15));
        }
      }

      let posts = this.posts.get(cacheKey) || [];
      const userPosts = this.userPosts.get(cacheKey) || [];
      
      // Combine mock posts with user posts - user posts always stay at top
      posts = [...userPosts, ...posts];

      // Apply filters
      if (params.locationId && params.locationId !== 'All') {
        // FIXED: Improved location filtering to handle multiple formats
        const locationFilter = params.locationId;
        posts = posts.filter(post => {
          // Direct match with locationId
          if (post.locationId === locationFilter) return true;
          
          // Match with location name
          if (post.location.name === locationFilter) return true;
          
          // Handle legacy format (countryId-locationId)
          if (post.locationId.includes('-')) {
            const locationPart = post.locationId.split('-').pop();
            if (locationPart === locationFilter) return true;
          }
          
          // Handle case where locationFilter is a location name and post.locationId is also a name
          if (post.locationId === locationFilter) return true;
          
          return false;
        });
      }

      if (params.category) {
        posts = posts.filter(post => post.category === params.category);
      }

      if (params.activityTags && params.activityTags.length > 0) {
        posts = posts.filter(post => 
          params.activityTags!.some(tag => post.activityTags.includes(tag))
        );
      }

      if (params.searchQuery) {
        const query = params.searchQuery.toLowerCase();
        posts = posts.filter(post => 
          post.content.toLowerCase().includes(query) ||
          post.author.displayName.toLowerCase().includes(query)
        );
      }

      // Apply sorting
      const sortBy = params.sortBy || 'recent';
      posts = posts.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;

        switch (sortBy) {
          case 'popular':
            return (b.likes + b.replyCount) - (a.likes + a.replyCount);
          case 'trending':
            return b.viewCount - a.viewCount;
          case 'oldest':
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          case 'recent':
          default:
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
      });

      // Apply pagination
      const page = params.page || 1;
      const limit = params.limit || 10;
      const startIndex = (page - 1) * limit;
      const paginatedPosts = posts.slice(startIndex, startIndex + limit);

      return {
        success: true,
        posts: paginatedPosts,
        totalCount: posts.length,
        hasMore: startIndex + limit < posts.length,
        nextPage: startIndex + limit < posts.length ? page + 1 : undefined
      };

    } catch (error) {
      return {
        success: false,
        posts: [],
        totalCount: 0,
        hasMore: false,
        error: handleApiError(error)
      };
    }
  }

  // POST /api/forum/posts
  static async createPost(data: CreateForumPostRequest): Promise<CreateForumPostResponse> {
    try {
      await simulateApiDelay(200); // Fast post creation with smooth feedback

      // For real API, this would be:
      // const formData = new FormData();
      // Object.entries(data).forEach(([key, value]) => {
      //   if (key === 'images' && value) {
      //     value.forEach((file, index) => formData.append(`images[${index}]`, file));
      //   } else if (Array.isArray(value)) {
      //     formData.append(key, JSON.stringify(value));
      //   } else {
      //     formData.append(key, value);
      //   }
      // });
      // const response = await fetch(`${API_CONFIG.baseUrl}/api/forum/posts`, {
      //   method: 'POST',
      //   body: formData
      // });

      // Mock implementation - use current user data
      const currentUser = MOCK_USERS.find(user => user.id === 'current_user')!;
      const newPost: ForumPost = {
        id: `user-post-${Date.now()}`,
        authorId: 'current_user',
        author: currentUser,
        title: data.title,
        content: data.content,
        
        locationId: data.locationId,
        location: {
          id: data.locationId,
          name: data.locationId === 'All' 
            ? (findCountryById(data.countryId)?.name || data.countryId) 
            : data.locationId,
          type: 'city',
          countryId: data.countryId
        },
        countryId: data.countryId,
        category: data.category,
        activityTags: data.activityTags,
        
        likes: 0,
        dislikes: 0,
        replyCount: 0,
        viewCount: 1,
        bookmarkCount: 0,
        
        isLiked: false,
        isDisliked: false,
        isBookmarked: false,
        isFollowing: false,
        
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastActivityAt: new Date().toISOString(),
        
        status: 'active',
        isPinned: false,
        isLocked: false,
        
        metadata: {
          editCount: 0,
          reportCount: 0
        }
      };

      // Add to user posts database (separate from mock posts)
      const cacheKey = data.countryId;
      const userPosts = this.userPosts.get(cacheKey) || [];
      userPosts.unshift(newPost);
      this.userPosts.set(cacheKey, userPosts);

      // NEW: Also add to global feed for centralized access
      this.globalFeed.unshift(newPost);

      return {
        success: true,
        post: newPost
      };

    } catch (error) {
      return {
        success: false,
        error: handleApiError(error)
      };
    }
  }

  // PUT /api/forum/posts/:id/interactions
  static async updatePostInteraction(data: UpdatePostInteractionRequest): Promise<UpdatePostInteractionResponse> {
    try {
      await simulateApiDelay(50); // Fast interactions with smooth feedback

      // For real API:
      // const response = await fetch(`${API_CONFIG.baseUrl}/api/forum/posts/${data.postId}/interactions`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ action: data.action })
      // });

      // Mock implementation - find and update post in both storage locations
      // First check user posts
      for (const [countryId, userPosts] of this.userPosts.entries()) {
        const postIndex = userPosts.findIndex(p => p.id === data.postId);
        if (postIndex !== -1) {
          const post = userPosts[postIndex];
          
          switch (data.action) {
            case 'like':
              post.likes += 1;
              post.isLiked = true;
              if (post.isDisliked) {
                post.dislikes -= 1;
                post.isDisliked = false;
              }
              break;
            case 'unlike':
              post.likes = Math.max(0, post.likes - 1);
              post.isLiked = false;
              break;
            case 'dislike':
              post.dislikes += 1;
              post.isDisliked = true;
              if (post.isLiked) {
                post.likes -= 1;
                post.isLiked = false;
              }
              break;
            case 'undislike':
              post.dislikes = Math.max(0, post.dislikes - 1);
              post.isDisliked = false;
              break;
            case 'bookmark':
              post.bookmarkCount += 1;
              post.isBookmarked = true;
              break;
            case 'unbookmark':
              post.bookmarkCount = Math.max(0, post.bookmarkCount - 1);
              post.isBookmarked = false;
              break;
            case 'follow':
              post.isFollowing = true;
              break;
            case 'unfollow':
              post.isFollowing = false;
              break;
          }

          userPosts[postIndex] = post;
          this.userPosts.set(countryId, userPosts);

          return {
            success: true,
            post: {
              id: post.id,
              likes: post.likes,
              dislikes: post.dislikes,
              bookmarkCount: post.bookmarkCount,
              isLiked: post.isLiked,
              isDisliked: post.isDisliked,
              isBookmarked: post.isBookmarked,
              isFollowing: post.isFollowing
            }
          };
        }
      }

      // Also check mock posts if not found in user posts
      for (const [countryId, posts] of this.posts.entries()) {
        const postIndex = posts.findIndex(p => p.id === data.postId);
        if (postIndex !== -1) {
          const post = posts[postIndex];
          
          switch (data.action) {
            case 'like':
              post.likes += 1;
              post.isLiked = true;
              if (post.isDisliked) {
                post.dislikes -= 1;
                post.isDisliked = false;
              }
              break;
            case 'unlike':
              post.likes = Math.max(0, post.likes - 1);
              post.isLiked = false;
              break;
            case 'dislike':
              post.dislikes += 1;
              post.isDisliked = true;
              if (post.isLiked) {
                post.likes -= 1;
                post.isLiked = false;
              }
              break;
            case 'undislike':
              post.dislikes = Math.max(0, post.dislikes - 1);
              post.isDisliked = false;
              break;
            case 'bookmark':
              post.bookmarkCount += 1;
              post.isBookmarked = true;
              break;
            case 'unbookmark':
              post.bookmarkCount = Math.max(0, post.bookmarkCount - 1);
              post.isBookmarked = false;
              break;
            case 'follow':
              post.isFollowing = true;
              break;
            case 'unfollow':
              post.isFollowing = false;
              break;
          }

          posts[postIndex] = post;
          this.posts.set(countryId, posts);

          return {
            success: true,
            post: {
              id: post.id,
              likes: post.likes,
              dislikes: post.dislikes,
              bookmarkCount: post.bookmarkCount,
              isLiked: post.isLiked,
              isDisliked: post.isDisliked,
              isBookmarked: post.isBookmarked,
              isFollowing: post.isFollowing
            }
          };
        }
      }

      return {
        success: false,
        error: 'Post not found'
      };

    } catch (error) {
      return {
        success: false,
        error: handleApiError(error)
      };
    }
  }

  // Utility method to clear cache (useful for testing)
  static clearCache() {
    this.posts.clear();
    this.userPosts.clear();
  }

  // Method to get location filters for a country (mock)
  static getLocationFilters(country: Country): string[] {
    const filters = ['All'];
    
    if (country.subLocations) {
      filters.push(...country.subLocations.map(loc => loc.name));
    }
    
    return filters;
  }
} 
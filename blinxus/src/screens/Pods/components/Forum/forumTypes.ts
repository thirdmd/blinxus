// Backend-ready TypeScript interfaces for Forum functionality

export interface ForumUser {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  initials: string;
  color: string;
  nationalityFlag?: string;
  isVerified?: boolean;
  memberSince: string;
}

export interface ForumLocation {
  id: string;
  name: string;
  type: 'country' | 'city' | 'region' | 'landmark' | 'global';
  countryId: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface ForumCategory {
  id: 'question' | 'tip' | 'recommendation' | 'general' | 'meetup' | 'alert';
  label: string;
  emoji: string;
  color: string;
  description: string;
}

export interface ForumActivityTag {
  id: string;
  label: string;
  emoji: string;
  category: 'activity' | 'accommodation' | 'transport' | 'food' | 'culture';
}

export interface ForumPost {
  id: string;
  authorId: string;
  author: ForumUser;
  title?: string;
  content: string;
  
  // Location & Categorization
  locationId: string;
  location: ForumLocation;
  countryId: string;
  category: ForumCategory['id'];
  activityTags: string[];
  
  // Engagement
  likes: number;
  dislikes: number;
  replyCount: number;
  viewCount: number;
  bookmarkCount: number;
  
  // User interactions
  isLiked: boolean;
  isDisliked: boolean;
  isBookmarked: boolean;
  isFollowing: boolean;
  
  // Media
  images?: string[];
  videos?: string[];
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  lastActivityAt: string;
  
  // Status
  status: 'active' | 'archived' | 'deleted' | 'flagged';
  isPinned: boolean;
  isLocked: boolean;
  
  // Metadata
  metadata?: {
    editCount: number;
    reportCount: number;
    moderatorNotes?: string;
  };
}

export interface ForumReply {
  id: string;
  postId: string;
  authorId: string;
  author: ForumUser;
  content: string;
  parentReplyId?: string; // For nested replies
  
  // Engagement
  likes: number;
  dislikes: number;
  
  // User interactions
  isLiked: boolean;
  isDisliked: boolean;
  
  // Media
  images?: string[];
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  
  // Status
  status: 'active' | 'deleted' | 'flagged';
  
  // Nested replies
  replies?: ForumReply[];
  replyToAuthor?: ForumUser;
}

// API Request/Response types
export interface CreateForumPostRequest {
  title?: string;
  content: string;
  locationId: string;
  countryId: string;
  category: ForumCategory['id'];
  activityTags: string[];
  images?: File[];
}

export interface CreateForumPostResponse {
  success: boolean;
  post?: ForumPost;
  error?: string;
}

export interface GetForumPostsRequest {
  countryId: string;
  locationId?: string;
  category?: ForumCategory['id'];
  activityTags?: string[];
  sortBy?: 'recent' | 'popular' | 'trending' | 'oldest';
  page?: number;
  limit?: number;
  searchQuery?: string;
}

export interface GetForumPostsResponse {
  success: boolean;
  posts: ForumPost[];
  totalCount: number;
  hasMore: boolean;
  nextPage?: number;
  error?: string;
}

export interface UpdatePostInteractionRequest {
  postId: string;
  action: 'like' | 'unlike' | 'dislike' | 'undislike' | 'bookmark' | 'unbookmark' | 'follow' | 'unfollow';
}

export interface UpdatePostInteractionResponse {
  success: boolean;
  post?: Partial<ForumPost>;
  error?: string;
}

// Filter and Sort types
export type LocationFilter = 'All' | string; // string will be location names
export type CategoryFilter = 'All' | ForumCategory['id'];
export type SortOption = 'recent' | 'popular' | 'trending' | 'oldest';
export type TimeFilter = 'all' | 'today' | 'week' | 'month' | 'year';

export interface ForumFilters {
  location: LocationFilter;
  category: CategoryFilter;
  sortBy: SortOption;
  timeFilter: TimeFilter;
  activityTags: string[];
  searchQuery: string;
}

// UI State types
export interface ForumUIState {
  isLoading: boolean;
  isLoadingMore: boolean;
  isRefreshing: boolean;
  error: string | null;
  hasMore: boolean;
  currentPage: number;
  selectedPost: ForumPost | null;
  showCreateModal: boolean;
  showFilters: boolean;
}

// Hook return types
export interface UseForumPostsReturn {
  posts: ForumPost[];
  uiState: ForumUIState;
  filters: ForumFilters;
  actions: {
    loadPosts: () => Promise<void>;
    loadMorePosts: () => Promise<void>;
    refreshPosts: () => Promise<void>;
    createPost: (data: CreateForumPostRequest) => Promise<boolean>;
    updatePostInteraction: (postId: string, action: UpdatePostInteractionRequest['action']) => Promise<void>;
    updateFilters: (newFilters: Partial<ForumFilters>) => void;
    setSelectedPost: (post: ForumPost | null) => void;
    setShowCreateModal: (show: boolean) => void;
    setShowFilters: (show: boolean) => void;
  };
}

// Constants for categories and tags
export const FORUM_CATEGORIES: ForumCategory[] = [
  { id: 'general', label: 'General', emoji: '💬', color: '#6B7280', description: 'General discussion' },
  { id: 'question', label: 'Question', emoji: '🤔', color: '#3B82F6', description: 'Ask for advice or help' },
  { id: 'tip', label: 'Tip', emoji: '💡', color: '#10B981', description: 'Share helpful tips' },
  { id: 'recommendation', label: 'Recommendation', emoji: '⭐', color: '#F59E0B', description: 'Recommend places or activities' },
  { id: 'meetup', label: 'Meetup', emoji: '👥', color: '#8B5CF6', description: 'Organize meetups' },
  { id: 'alert', label: 'Alert', emoji: '⚠️', color: '#EF4444', description: 'Important alerts or warnings' },
];

export const FORUM_ACTIVITY_TAGS: ForumActivityTag[] = [
  // Activities
  { id: 'hiking', label: 'Hiking', emoji: '🥾', category: 'activity' },
  { id: 'views', label: 'Views', emoji: '👀', category: 'activity' },
  { id: 'photography', label: 'Photography', emoji: '📸', category: 'activity' },
  { id: 'nightlife', label: 'Nightlife', emoji: '🌃', category: 'activity' },
  { id: 'shopping', label: 'Shopping', emoji: '🛍️', category: 'activity' },
  { id: 'museums', label: 'Museums', emoji: '🏛️', category: 'activity' },
  { id: 'roadtrip', label: 'Roadtrip', emoji: '🚗', category: 'activity' },
  { id: 'beaches', label: 'Beaches', emoji: '🏖️', category: 'activity' },
  { id: 'diving', label: 'Diving', emoji: '🤿', category: 'activity' },
  { id: 'surfing', label: 'Surfing', emoji: '🏄', category: 'activity' },
  { id: 'wellness', label: 'Wellness', emoji: '🧘', category: 'activity' },
  { id: 'sports', label: 'Sports', emoji: '⚽', category: 'activity' },
  { id: 'outdoors', label: 'Outdoors', emoji: '🌲', category: 'activity' },
  { id: 'backpacking', label: 'Backpacking', emoji: '🎒', category: 'activity' },
  { id: 'theme-parks', label: 'Theme Parks', emoji: '🎢', category: 'activity' },
  { id: 'partying', label: 'Partying', emoji: '🎉', category: 'activity' },
  { id: 'city', label: 'City', emoji: '🏙️', category: 'activity' },
  { id: 'island-hopping', label: 'Island Hopping', emoji: '🏝️', category: 'activity' },
  { id: 'waterfalls', label: 'Waterfalls', emoji: '💦', category: 'activity' },
  { id: 'casinos', label: 'Casinos', emoji: '🎰', category: 'activity' },
  { id: 'animals', label: 'Animals', emoji: '🦁', category: 'activity' },
  { id: 'marine-life', label: 'Marine Life', emoji: '🐬', category: 'activity' },
  { id: 'plants', label: 'Plants', emoji: '🌱', category: 'activity' },
  { id: 'gym', label: 'Gym', emoji: '🦾', category: 'activity' },
  { id: 'attractions', label: 'Attractions', emoji: '🎡', category: 'activity' },
  
  // Accommodation
  { id: 'hotels', label: 'Hotels', emoji: '🏨', category: 'accommodation' },
  { id: 'hostels', label: 'Hostels', emoji: '🏠', category: 'accommodation' },
  { id: 'airbnb', label: 'Airbnb', emoji: '🏡', category: 'accommodation' },
  { id: 'camping-acc', label: 'Camping', emoji: '⛺', category: 'accommodation' },
  { id: 'resorts', label: 'Resorts', emoji: '🏖️', category: 'accommodation' },
  
  // Transport
  { id: 'flights', label: 'Flights', emoji: '✈️', category: 'transport' },
  { id: 'trains', label: 'Trains', emoji: '🚄', category: 'transport' },
  { id: 'buses', label: 'Buses', emoji: '🚌', category: 'transport' },
  { id: 'car-rental', label: 'Car Rental', emoji: '🚗', category: 'transport' },
  { id: 'local-transport', label: 'Local Transport', emoji: '🚇', category: 'transport' },
  { id: 'ferries', label: 'Ferries', emoji: '⛴️', category: 'transport' },
  { id: 'motorcycles', label: 'Motorcycles', emoji: '🏍️', category: 'transport' },
  { id: 'taxis', label: 'Taxis & Rideshare', emoji: '🚕', category: 'transport' },
  { id: 'cruise-ships', label: 'Cruise Ships', emoji: '🚢', category: 'transport' },
  { id: 'e-scooters', label: 'E-scooters', emoji: '🛴', category: 'transport' },
  
  // Food & Drinks
  { id: 'restaurants', label: 'Restaurants', emoji: '🍽️', category: 'food' },
  { id: 'street-food', label: 'Street Food', emoji: '🌮', category: 'food' },
  { id: 'cafes', label: 'Cafes', emoji: '☕', category: 'food' },
  { id: 'bars', label: 'Bars', emoji: '🍺', category: 'food' },
  { id: 'local-cuisine', label: 'Local Cuisine', emoji: '🍜', category: 'food' },
  { id: 'food-markets', label: 'Food Markets', emoji: '🏪', category: 'food' },
  { id: 'desserts', label: 'Desserts', emoji: '🍰', category: 'food' },
  
  // Culture
  { id: 'music', label: 'Music & Concerts', emoji: '🎵', category: 'culture' },
  { id: 'architecture', label: 'Architecture', emoji: '🏛️', category: 'culture' },
  { id: 'traditions', label: 'Traditions', emoji: '🎭', category: 'culture' },
  { id: 'local-markets', label: 'Local Markets', emoji: '🏪', category: 'culture' },
  { id: 'theater', label: 'Theater', emoji: '🎭', category: 'culture' },
]; 
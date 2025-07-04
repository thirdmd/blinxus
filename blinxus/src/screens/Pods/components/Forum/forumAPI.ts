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
import { Country, placesData, getLocationByName, getLocationById } from '../../../../constants/placesData';
import { usersDatabase, getCurrentUser } from '../../../../types/userData/users_data';

// Mock users database - includes current user integration + 40 diverse users
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
  },
  {
    id: 'user-9',
    username: 'digital_nomad_kai',
    displayName: 'Kai Nakamura',
    avatarUrl: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400',
    initials: 'KN',
    color: '#F97316',
    nationalityFlag: '🇯🇵',
    isVerified: true,
    memberSince: '2022-12-03'
  },
  {
    id: 'user-10',
    username: 'culture_hunter_sofia',
    displayName: 'Sofia Petrov',
    avatarUrl: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
    initials: 'SP',
    color: '#A855F7',
    nationalityFlag: '🇷🇺',
    isVerified: false,
    memberSince: '2023-05-14'
  },
  {
    id: 'user-11',
    username: 'extreme_sports_tom',
    displayName: 'Tom Anderson',
    avatarUrl: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    initials: 'TA',
    color: '#DC2626',
    nationalityFlag: '🇦🇺',
    isVerified: true,
    memberSince: '2022-09-21'
  },
  {
    id: 'user-12',
    username: 'luxury_traveler_emma',
    displayName: 'Emma Williams',
    avatarUrl: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=400',
    initials: 'EW',
    color: '#059669',
    nationalityFlag: '🇨🇦',
    isVerified: true,
    memberSince: '2023-02-08'
  },
  {
    id: 'user-13',
    username: 'street_artist_luis',
    displayName: 'Luis Morales',
    avatarUrl: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=400',
    initials: 'LM',
    color: '#7C3AED',
    nationalityFlag: '🇲🇽',
    isVerified: false,
    memberSince: '2023-03-20'
  },
  {
    id: 'user-14',
    username: 'volunteer_teacher_zara',
    displayName: 'Zara Ahmed',
    avatarUrl: 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=400',
    initials: 'ZA',
    color: '#059669',
    nationalityFlag: '🇪🇬',
    isVerified: true,
    memberSince: '2022-10-15'
  },
  {
    id: 'user-15',
    username: 'eco_warrior_finn',
    displayName: 'Finn Larsen',
    avatarUrl: 'https://images.pexels.com/photos/1484794/pexels-photo-1484794.jpeg?auto=compress&cs=tinysrgb&w=400',
    initials: 'FL',
    color: '#16A34A',
    nationalityFlag: '🇳🇴',
    isVerified: false,
    memberSince: '2023-08-01'
  },
  {
    id: 'user-16',
    username: 'music_festival_nina',
    displayName: 'Nina Kowalski',
    avatarUrl: 'https://images.pexels.com/photos/1310522/pexels-photo-1310522.jpeg?auto=compress&cs=tinysrgb&w=400',
    initials: 'NK',
    color: '#DB2777',
    nationalityFlag: '🇵🇱',
    isVerified: true,
    memberSince: '2022-07-12'
  },
  {
    id: 'user-17',
    username: 'language_lover_raj',
    displayName: 'Raj Sharma',
    avatarUrl: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=400',
    initials: 'RS',
    color: '#EA580C',
    nationalityFlag: '🇮🇳',
    isVerified: false,
    memberSince: '2023-01-30'
  },
  {
    id: 'user-18',
    username: 'sunrise_hiker_bella',
    displayName: 'Bella Thompson',
    avatarUrl: 'https://images.pexels.com/photos/1391498/pexels-photo-1391498.jpeg?auto=compress&cs=tinysrgb&w=400',
    initials: 'BT',
    color: '#DC2626',
    nationalityFlag: '🇳🇿',
    isVerified: true,
    memberSince: '2022-05-08'
  },
  {
    id: 'user-19',
    username: 'cooking_grandma_yuki',
    displayName: 'Yuki Tanaka',
    avatarUrl: 'https://images.pexels.com/photos/1382731/pexels-photo-1382731.jpeg?auto=compress&cs=tinysrgb&w=400',
    initials: 'YT',
    color: '#7C2D12',
    nationalityFlag: '🇯🇵',
    isVerified: true,
    memberSince: '2022-04-25'
  },
  // NEW USERS 20-40 - More diversity!
  {
    id: 'user-20',
    username: 'budget_explorer_hassan',
    displayName: 'Hassan Al-Rashid',
    avatarUrl: 'https://images.pexels.com/photos/1121796/pexels-photo-1121796.jpeg?auto=compress&cs=tinysrgb&w=400',
    initials: 'HR',
    color: '#0891B2',
    nationalityFlag: '🇦🇪',
    isVerified: false,
    memberSince: '2023-10-12'
  },
  {
    id: 'user-21',
    username: 'wildlife_photographer_lea',
    displayName: 'Lea Andersson',
    avatarUrl: 'https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&w=400',
    initials: 'LA',
    color: '#15803D',
    nationalityFlag: '🇸🇪',
    isVerified: true,
    memberSince: '2022-06-14'
  },
  {
    id: 'user-22',
    username: 'festival_chaser_carlos',
    displayName: 'Carlos Mendoza',
    avatarUrl: 'https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=400',
    initials: 'CM',
    color: '#DC2626',
    nationalityFlag: '🇦🇷',
    isVerified: false,
    memberSince: '2023-03-22'
  },
  {
    id: 'user-23',
    username: 'temple_seeker_priya',
    displayName: 'Priya Gupta',
    avatarUrl: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    initials: 'PG',
    color: '#7C3AED',
    nationalityFlag: '🇮🇳',
    isVerified: true,
    memberSince: '2022-09-08'
  },
  {
    id: 'user-24',
    username: 'mountain_climber_erik',
    displayName: 'Erik Hansen',
    avatarUrl: 'https://images.pexels.com/photos/1484794/pexels-photo-1484794.jpeg?auto=compress&cs=tinysrgb&w=400',
    initials: 'EH',
    color: '#059669',
    nationalityFlag: '🇩🇰',
    isVerified: false,
    memberSince: '2023-05-18'
  },
  {
    id: 'user-25',
    username: 'coffee_connoisseur_mia',
    displayName: 'Mia Rodriguez',
    avatarUrl: 'https://images.pexels.com/photos/1310522/pexels-photo-1310522.jpeg?auto=compress&cs=tinysrgb&w=400',
    initials: 'MR',
    color: '#92400E',
    nationalityFlag: '🇨🇴',
    isVerified: true,
    memberSince: '2022-11-03'
  },
  {
    id: 'user-26',
    username: 'backpacker_olaf',
    displayName: 'Olaf Johansson',
    avatarUrl: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400',
    initials: 'OJ',
    color: '#1E40AF',
    nationalityFlag: '🇫🇮',
    isVerified: false,
    memberSince: '2023-07-25'
  },
  {
    id: 'user-27',
    username: 'diving_expert_marina',
    displayName: 'Marina Popović',
    avatarUrl: 'https://images.pexels.com/photos/1024311/pexels-photo-1024311.jpeg?auto=compress&cs=tinysrgb&w=400',
    initials: 'MP',
    color: '#0369A1',
    nationalityFlag: '🇭🇷',
    isVerified: true,
    memberSince: '2022-04-17'
  },
  {
    id: 'user-28',
    username: 'history_buff_ahmed',
    displayName: 'Ahmed Hassan',
    avatarUrl: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
    initials: 'AH',
    color: '#B45309',
    nationalityFlag: '🇹🇳',
    isVerified: false,
    memberSince: '2023-01-09'
  },
  {
    id: 'user-29',
    username: 'yoga_teacher_sage',
    displayName: 'Sage Martinez',
    avatarUrl: 'https://images.pexels.com/photos/1391498/pexels-photo-1391498.jpeg?auto=compress&cs=tinysrgb&w=400',
    initials: 'SM',
    color: '#059669',
    nationalityFlag: '🇺🇸',
    isVerified: true,
    memberSince: '2022-08-12'
  },
  {
    id: 'user-30',
    username: 'night_owl_viktor',
    displayName: 'Viktor Petrov',
    avatarUrl: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    initials: 'VP',
    color: '#7C2D12',
    nationalityFlag: '🇧🇬',
    isVerified: false,
    memberSince: '2023-09-14'
  },
  {
    id: 'user-31',
    username: 'surf_instructor_kaia',
    displayName: 'Kaia Silva',
    avatarUrl: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=400',
    initials: 'KS',
    color: '#0891B2',
    nationalityFlag: '🇧🇷',
    isVerified: true,
    memberSince: '2022-12-20'
  },
  {
    id: 'user-32',
    username: 'architect_giovanni',
    displayName: 'Giovanni Bianchi',
    avatarUrl: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=400',
    initials: 'GB',
    color: '#DC2626',
    nationalityFlag: '🇮🇹',
    isVerified: false,
    memberSince: '2023-02-28'
  },
  {
    id: 'user-33',
    username: 'chef_camille',
    displayName: 'Camille Dubois',
    avatarUrl: 'https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&w=400',
    initials: 'CD',
    color: '#B45309',
    nationalityFlag: '🇫🇷',
    isVerified: true,
    memberSince: '2022-05-11'
  },
  {
    id: 'user-34',
    username: 'trekking_guide_pemba',
    displayName: 'Pemba Sherpa',
    avatarUrl: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400',
    initials: 'PS',
    color: '#059669',
    nationalityFlag: '🇳🇵',
    isVerified: true,
    memberSince: '2022-03-15'
  },
  {
    id: 'user-35',
    username: 'wine_enthusiast_lucia',
    displayName: 'Lucia Fernandez',
    avatarUrl: 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=400',
    initials: 'LF',
    color: '#7C2D12',
    nationalityFlag: '🇪🇸',
    isVerified: false,
    memberSince: '2023-06-07'
  },
  {
    id: 'user-36',
    username: 'tech_nomad_jin',
    displayName: 'Jin Watanabe',
    avatarUrl: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400',
    initials: 'JW',
    color: '#1E40AF',
    nationalityFlag: '🇯🇵',
    isVerified: true,
    memberSince: '2022-10-30'
  },
  {
    id: 'user-37',
    username: 'cultural_dancer_aisha',
    displayName: 'Aisha Okafor',
    avatarUrl: 'https://images.pexels.com/photos/1382731/pexels-photo-1382731.jpeg?auto=compress&cs=tinysrgb&w=400',
    initials: 'AO',
    color: '#DC2626',
    nationalityFlag: '🇳🇬',
    isVerified: false,
    memberSince: '2023-08-23'
  },
  {
    id: 'user-38',
    username: 'wellness_coach_david',
    displayName: 'David Kim',
    avatarUrl: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=400',
    initials: 'DK',
    color: '#059669',
    nationalityFlag: '🇰🇷',
    isVerified: true,
    memberSince: '2022-07-19'
  },
  {
    id: 'user-39',
    username: 'foodie_blogger_elena',
    displayName: 'Elena Kozlov',
    avatarUrl: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
    initials: 'EK',
    color: '#F59E0B',
    nationalityFlag: '🇷🇺',
    isVerified: false,
    memberSince: '2023-04-02'
  },
  {
    id: 'user-40',
    username: 'adventure_seeker_max',
    displayName: 'Max O\'Connor',
    avatarUrl: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=400',
    initials: 'MO',
    color: '#7C3AED',
    nationalityFlag: '🇮🇪',
    isVerified: true,
    memberSince: '2022-09-26'
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

// MASSIVE collection of 80+ UNIQUE post templates - NO DUPLICATES!
const createUniquePostTemplates = () => {
  return [
    // TIP CATEGORY - Budget & Money Saving
    { content: "Pro tip: Download the local transport app in {location} and get a weekly pass! Saved me 40% compared to daily tickets 🚇💰", category: 'tip' as const, tags: ['local-transport', 'buses', 'trains'], daysAgo: 1, likes: 167, replies: 41 },
    { content: "Budget hack for {location}: Shop at local markets in the morning for fresh produce at half the price! Meet friendly vendors too 🥕🛒", category: 'tip' as const, tags: ['food-markets', 'local-markets', 'local-cuisine'], daysAgo: 2, likes: 89, replies: 23 },
    { content: "Free walking tours in {location} are incredible! Book online the night before and don't forget to tip your guide 🚶‍♀️✨", category: 'tip' as const, tags: ['attractions', 'city', 'architecture'], daysAgo: 3, likes: 134, replies: 28 },
    { content: "Coworking spaces in {location} often have day passes for $10-15! Way better than cafe hopping all day ☕💻", category: 'tip' as const, tags: ['cafes', 'local-transport', 'city'], daysAgo: 4, likes: 76, replies: 19 },
    { content: "Hostel kitchens in {location} are perfect for cooking! Bring spices from home to make budget meals tasty 🍳🧄", category: 'tip' as const, tags: ['hostels', 'local-cuisine', 'food-markets'], daysAgo: 5, likes: 92, replies: 31 },

    // MEETUP CATEGORY - Events & Social
    { content: "Bungee jumping adventure in {location} this Saturday! Who's brave enough to take the 150m plunge with me? 🪂😱", category: 'meetup' as const, tags: ['outdoors', 'sports', 'attractions'], daysAgo: 1, likes: 78, replies: 29 },
    { content: "Traditional festival happening in {location} next weekend! Let's experience authentic culture, music and dance together 🎭🎪", category: 'meetup' as const, tags: ['music', 'traditions', 'theater'], daysAgo: 2, likes: 112, replies: 45 },
    { content: "Karaoke night at the best spot in {location}! Private rooms, unlimited songs, who wants to sing their heart out? 🎤🎵", category: 'meetup' as const, tags: ['music', 'nightlife', 'partying'], daysAgo: 3, likes: 56, replies: 24 },
    { content: "Beach cleanup volunteer event in {location} tomorrow morning! Let's protect this beautiful coastline together 🏖️♻️", category: 'meetup' as const, tags: ['beaches', 'outdoors', 'plants'], daysAgo: 4, likes: 134, replies: 52 },
    { content: "Sunset photography walk in {location} this evening! Bring your camera and let's capture golden hour magic 📸🌅", category: 'meetup' as const, tags: ['photography', 'views', 'city'], daysAgo: 5, likes: 89, replies: 33 },

    // QUESTION CATEGORY - Seeking Advice
    { content: "Best authentic street food spots in {location}? Looking for places where locals actually eat, not tourist traps! 🌮🍜", category: 'question' as const, tags: ['street-food', 'local-cuisine', 'restaurants'], daysAgo: 1, likes: 45, replies: 67 },
    { content: "Rock climbing routes for intermediate level in {location}? Need good rental gear nearby too 🧗‍♂️⛰️", category: 'question' as const, tags: ['sports', 'outdoors', 'attractions'], daysAgo: 2, likes: 34, replies: 18 },
    { content: "Night photography spots in {location}? Want those epic cityscape shots with neon lights and urban vibes 🌃📷", category: 'question' as const, tags: ['photography', 'nightlife', 'city'], daysAgo: 3, likes: 67, replies: 22 },
    { content: "Safe neighborhoods for solo female travelers in {location}? First time here and want local insights 👩‍🦰🛡️", category: 'question' as const, tags: ['city', 'local-transport', 'hostels'], daysAgo: 4, likes: 156, replies: 89 },
    { content: "Coffee shops with reliable WiFi in {location}? Digital nomad needing productive workspace with good pastries ☕💻", category: 'question' as const, tags: ['cafes', 'city', 'desserts'], daysAgo: 5, likes: 38, replies: 14 },

    // GENERAL CATEGORY - Experiences & Stories
    { content: "Conquered the epic hiking trail in {location} today! 8 hours through jungle, waterfalls, and stunning viewpoints 🥾🌿", category: 'general' as const, tags: ['hiking', 'waterfalls', 'views'], daysAgo: 1, likes: 156, replies: 42 },
    { content: "Golden hour photography session in {location} was absolutely magical! The light painted everything in warm gold ✨📸", category: 'general' as const, tags: ['photography', 'views', 'city'], daysAgo: 2, likes: 203, replies: 37 },
    { content: "Temple ceremony experience in {location} left me speechless! Monks shared ancient wisdom and peaceful energy 🙏⛩️", category: 'general' as const, tags: ['traditions', 'architecture', 'museums'], daysAgo: 3, likes: 134, replies: 28 },
    { content: "Underground nightclub in {location} was insane! Best DJs, incredible crowd, danced until sunrise 🎵🕺", category: 'general' as const, tags: ['nightlife', 'music', 'partying'], daysAgo: 4, likes: 98, replies: 31 },
    { content: "Surfing lessons in {location} exceeded expectations! Caught my first wave and the instructor was amazing 🏄‍♂️🌊", category: 'general' as const, tags: ['surfing', 'beaches', 'sports'], daysAgo: 5, likes: 87, replies: 26 },

    // RECOMMENDATION CATEGORY - Must-Visit Places
    { content: "Hidden ramen shop in {location} serves the most incredible tonkotsu broth! Only $4 and worth every penny 🍜💫", category: 'recommendation' as const, tags: ['restaurants', 'local-cuisine', 'street-food'], daysAgo: 1, likes: 127, replies: 34 },
    { content: "Street art district in {location} is absolutely mind-blowing! Every wall tells a story through vibrant murals 🎨🖼️", category: 'recommendation' as const, tags: ['city', 'architecture', 'traditions'], daysAgo: 2, likes: 91, replies: 22 },
    { content: "Archaeological museum in {location} houses incredible ancient artifacts! Spent entire afternoon learning history 🏛️📚", category: 'recommendation' as const, tags: ['museums', 'architecture', 'traditions'], daysAgo: 3, likes: 73, replies: 15 },
    { content: "Traditional spa treatments in {location} are life-changing! Ancient healing techniques in serene environment 💆‍♀️🌸", category: 'recommendation' as const, tags: ['wellness', 'traditions', 'attractions'], daysAgo: 4, likes: 93, replies: 17 },
    { content: "Yoga retreat center in {location} offers perfect spiritual escape! Meditation, healthy food, nature immersion 🧘‍♀️🍃", category: 'recommendation' as const, tags: ['wellness', 'outdoors', 'plants'], daysAgo: 5, likes: 108, replies: 25 },

    // ALERT CATEGORY - Important Updates
    { content: "🚨 Heavy monsoon warning for {location} this week! Flash floods possible, avoid low-lying areas ⛈️🌧️", category: 'alert' as const, tags: ['outdoors', 'local-transport', 'city'], daysAgo: 1, likes: 234, replies: 67 },
    { content: "⚠️ Transport strike in {location} tomorrow! No buses or trains running, plan alternative routes 🚌❌", category: 'alert' as const, tags: ['local-transport', 'buses', 'trains'], daysAgo: 2, likes: 189, replies: 45 },
    { content: "🎪 Major festival crowds expected in {location} this weekend! Book accommodation now, watch belongings 👥🎭", category: 'alert' as const, tags: ['traditions', 'music', 'hotels'], daysAgo: 3, likes: 156, replies: 38 },
    { content: "⚡ Power outages scheduled in {location} Thursday 2-6pm! Charge devices, plan indoor activities 🔌💡", category: 'alert' as const, tags: ['city', 'cafes', 'hotels'], daysAgo: 4, likes: 98, replies: 23 },
    { content: "🌡️ Extreme heat wave hitting {location}! Stay hydrated, seek shade, avoid midday outdoor activities ☀️💧", category: 'alert' as const, tags: ['outdoors', 'beaches', 'wellness'], daysAgo: 5, likes: 167, replies: 42 },

    // MORE UNIQUE CONTENT - Different Activities
    { content: "Scuba diving certification in {location} opens underwater paradise! Coral reefs teeming with tropical fish 🤿🐠", category: 'general' as const, tags: ['diving', 'marine-life', 'beaches'], daysAgo: 1, likes: 145, replies: 29 },
    { content: "Traditional cooking class with grandmother in {location}! 50 years of secret recipes shared with love 👵🍳", category: 'recommendation' as const, tags: ['local-cuisine', 'traditions', 'restaurants'], daysAgo: 2, likes: 124, replies: 33 },
    { content: "Mountain biking trails in {location}? Looking for challenging routes through scenic countryside 🚵‍♂️🏔️", category: 'question' as const, tags: ['sports', 'outdoors', 'hiking'], daysAgo: 3, likes: 52, replies: 19 },
    { content: "Language exchange café in {location} every Tuesday! Practice English while learning local language 🗣️📚", category: 'meetup' as const, tags: ['cafes', 'traditions', 'city'], daysAgo: 4, likes: 87, replies: 24 },
    { content: "Download offline maps before exploring {location}! Cell service spotty in remote areas 📱🗺️", category: 'tip' as const, tags: ['outdoors', 'hiking', 'backpacking'], daysAgo: 5, likes: 78, replies: 16 },

    // WILDLIFE & NATURE
    { content: "Wildlife sanctuary in {location} protects endangered species! Educational tour supports conservation efforts 🐘🌿", category: 'recommendation' as const, tags: ['animals', 'plants', 'attractions'], daysAgo: 1, likes: 142, replies: 35 },
    { content: "Bird watching tours at dawn in {location}? Want to spot rare tropical species in natural habitat 🦜🌅", category: 'question' as const, tags: ['animals', 'outdoors', 'photography'], daysAgo: 2, likes: 63, replies: 17 },
    { content: "National park camping permits for {location}? Planning multi-day trek through pristine wilderness 🏕️🥾", category: 'question' as const, tags: ['camping-acc', 'hiking', 'outdoors'], daysAgo: 3, likes: 71, replies: 22 },
    { content: "Butterfly sanctuary in {location} houses hundreds of colorful species! Kids love the interactive experience 🦋👶", category: 'recommendation' as const, tags: ['animals', 'attractions', 'plants'], daysAgo: 4, likes: 89, replies: 18 },
    { content: "Eco-lodge stays in {location} offer sustainable luxury! Solar power, organic food, carbon-neutral travel 🌱🏨", category: 'recommendation' as const, tags: ['resorts', 'plants', 'wellness'], daysAgo: 5, likes: 113, replies: 26 },

    // WATER ACTIVITIES
    { content: "Whitewater rafting season begins in {location}! Grade 4 rapids for experienced adventurers only 🚣‍♂️💨", category: 'alert' as const, tags: ['sports', 'outdoors', 'waterfalls'], daysAgo: 1, likes: 156, replies: 41 },
    { content: "Kayaking through mangroves in {location} reveals hidden ecosystem! Guided tours include snorkeling 🛶🐟", category: 'recommendation' as const, tags: ['marine-life', 'outdoors', 'plants'], daysAgo: 2, likes: 98, replies: 27 },
    { content: "Best beaches for swimming in {location}? Avoiding strong currents and looking for calm waters 🏊‍♀️🌊", category: 'question' as const, tags: ['beaches', 'marine-life', 'surfing'], daysAgo: 3, likes: 67, replies: 34 },
    { content: "Fishing charter trips from {location}? Want to catch dinner and learn local techniques 🎣🐠", category: 'question' as const, tags: ['marine-life', 'local-cuisine', 'beaches'], daysAgo: 4, likes: 45, replies: 21 },
    { content: "Sunset sailing cruise in {location} includes dinner and live music! Romantic evening on calm waters ⛵🌅", category: 'recommendation' as const, tags: ['marine-life', 'music', 'restaurants'], daysAgo: 5, likes: 134, replies: 39 },

    // URBAN EXPLORATION
    { content: "Rooftop bars in {location} offer stunning city views! Happy hour prices make sunset drinks affordable 🍸🏙️", category: 'recommendation' as const, tags: ['bars', 'city', 'views'], daysAgo: 1, likes: 112, replies: 28 },
    { content: "Underground tunnels tour in {location} reveals hidden city history! Advance booking required 🚇📜", category: 'tip' as const, tags: ['museums', 'architecture', 'local-transport'], daysAgo: 2, likes: 87, replies: 19 },
    { content: "Food truck festivals in {location} happen every Friday! Local chefs serve fusion cuisine 🚚🍜", category: 'meetup' as const, tags: ['street-food', 'local-cuisine', 'music'], daysAgo: 3, likes: 93, replies: 31 },
    { content: "Architecture walking tours in {location} showcase colonial and modern buildings! Free on weekends 🏛️🚶‍♂️", category: 'tip' as const, tags: ['architecture', 'museums', 'city'], daysAgo: 4, likes: 76, replies: 15 },
    { content: "Public transportation tips for {location}? Rush hour schedules and payment methods confusing 🚌⏰", category: 'question' as const, tags: ['local-transport', 'buses', 'trains'], daysAgo: 5, likes: 54, replies: 43 },

    // CULTURAL EXPERIENCES
    { content: "Traditional textile workshop in {location} teaches ancient weaving techniques! Take home handmade souvenirs 🧵🎨", category: 'recommendation' as const, tags: ['traditions', 'shopping', 'local-markets'], daysAgo: 1, likes: 89, replies: 22 },
    { content: "Religious ceremony etiquette in {location}? Want to participate respectfully in local traditions 🙏⛩️", category: 'question' as const, tags: ['traditions', 'architecture', 'museums'], daysAgo: 2, likes: 123, replies: 56 },
    { content: "Folk dance performances in {location} every Saturday evening! Community center hosts cultural shows 💃🎭", category: 'meetup' as const, tags: ['music', 'traditions', 'theater'], daysAgo: 3, likes: 67, replies: 18 },
    { content: "Local artisan markets in {location} support indigenous communities! Unique handcrafted jewelry and pottery 🏺💍", category: 'recommendation' as const, tags: ['local-markets', 'shopping', 'traditions'], daysAgo: 4, likes: 145, replies: 37 },
    { content: "Traditional music lessons available in {location}? Want to learn indigenous instruments during visit 🎵🥁", category: 'question' as const, tags: ['music', 'traditions', 'theater'], daysAgo: 5, likes: 78, replies: 24 },

    // FOOD & CULINARY
    { content: "Midnight food markets in {location} come alive after 11pm! Best street food when locals finish work 🌙🍢", category: 'tip' as const, tags: ['street-food', 'food-markets', 'nightlife'], daysAgo: 1, likes: 167, replies: 45 },
    { content: "Spice plantation tours in {location} include tasting sessions! Learn how cardamom and cinnamon grow 🌿🧄", category: 'recommendation' as const, tags: ['plants', 'local-cuisine', 'attractions'], daysAgo: 2, likes: 92, replies: 26 },
    { content: "Vegetarian-friendly restaurants in {location}? Plant-based traveler seeking delicious local options 🥬🍽️", category: 'question' as const, tags: ['restaurants', 'local-cuisine', 'wellness'], daysAgo: 3, likes: 56, replies: 38 },
    { content: "Wine tasting tours through vineyards near {location}! Transportation included in full-day package 🍷🍇", category: 'recommendation' as const, tags: ['bars', 'local-transport', 'attractions'], daysAgo: 4, likes: 134, replies: 29 },
    { content: "Cooking competition for travelers in {location} next month! Teams prepare traditional dishes for judges 👨‍🍳🏆", category: 'meetup' as const, tags: ['local-cuisine', 'traditions', 'restaurants'], daysAgo: 5, likes: 89, replies: 33 },

    // WELLNESS & HEALTH
    { content: "Meditation retreats in mountain temples near {location} offer 7-day programs! Digital detox included 🧘‍♂️📵", category: 'recommendation' as const, tags: ['wellness', 'traditions', 'architecture'], daysAgo: 1, likes: 156, replies: 41 },
    { content: "Traditional healing practices in {location}? Interested in acupuncture and herbal medicine treatments 💉🌿", category: 'question' as const, tags: ['wellness', 'traditions', 'plants'], daysAgo: 2, likes: 78, replies: 27 },
    { content: "Hot springs locations near {location}? Perfect for relaxing sore muscles after long hikes ♨️🏔️", category: 'question' as const, tags: ['wellness', 'hiking', 'attractions'], daysAgo: 3, likes: 112, replies: 35 },
    { content: "Fitness classes on the beach in {location} every morning! Yoga, pilates, and cardio with ocean views 🏋️‍♀️🏖️", category: 'meetup' as const, tags: ['wellness', 'beaches', 'gym'], daysAgo: 4, likes: 93, replies: 22 },
    { content: "Thermal baths in {location} use natural mineral water! Ancient Romans built first facilities here ♨️🏛️", category: 'recommendation' as const, tags: ['wellness', 'architecture', 'museums'], daysAgo: 5, likes: 134, replies: 28 },

    // BUDGET TRAVEL
    { content: "Couchsurfing hosts in {location} offer local insights! Better than hotels for cultural immersion 🛏️🌍", category: 'tip' as const, tags: ['airbnb', 'traditions', 'city'], daysAgo: 1, likes: 89, replies: 34 },
    { content: "Free museum days in {location} happen first Sunday monthly! Save money while exploring culture 🏛️💰", category: 'tip' as const, tags: ['museums', 'architecture', 'traditions'], daysAgo: 2, likes: 76, replies: 18 },
    { content: "Hitchhiking safety tips for {location}? Planning overland adventure on shoestring budget 👍🚗", category: 'question' as const, tags: ['car-rental', 'backpacking', 'outdoors'], daysAgo: 3, likes: 45, replies: 52 },
    { content: "Work exchange programs in {location}? Teaching English or farm work for accommodation 🏫🚜", category: 'question' as const, tags: ['hostels', 'plants', 'traditions'], daysAgo: 4, likes: 67, replies: 29 },
    { content: "Camping equipment rental in {location} much cheaper than buying! Tents, sleeping bags, cooking gear 🏕️⛺", category: 'tip' as const, tags: ['camping-acc', 'outdoors', 'hiking'], daysAgo: 5, likes: 92, replies: 21 }
  ];
};

// Generate posts with GUARANTEED unique content per country and location
const generateMockPosts = (country: Country, count: number = 15): ForumPost[] => {
  const locations = generateLocationsForCountry(country);
  const posts: ForumPost[] = [];
  const allTemplates = createUniquePostTemplates();
  
  // Get non-current users
  const nonCurrentUsers = MOCK_USERS.filter(user => user.id !== 'current_user');
  
  // STEP 1: Ensure EVERY location gets AT LEAST 1 post
  const usedTemplateIndices = new Set<number>();
  
  locations.forEach((location, locationIndex) => {
    // Use different template for each location
    const templateIndex = (country.id.charCodeAt(0) + locationIndex * 13) % allTemplates.length;
    const template = allTemplates[templateIndex];
    usedTemplateIndices.add(templateIndex);
    
    // Different user for each location
    const userIndex = (country.id.charCodeAt(1) + locationIndex * 7) % nonCurrentUsers.length;
    const selectedUser = nonCurrentUsers[userIndex];

    posts.push({
      id: `location-post-${country.id}-${location.id}-${postIdCounter++}`,
      authorId: selectedUser.id,
      author: selectedUser,
      content: template.content.replace('{location}', location.name),
      
      locationId: location.id,
      location: location,
      countryId: country.id,
      category: template.category,
      activityTags: template.tags,
      
      likes: template.likes + (locationIndex * 5), // Slight variation
      dislikes: 0,
      replyCount: template.replies + (locationIndex * 2),
      viewCount: (template.likes + (locationIndex * 5)) * 3 + 25,
      bookmarkCount: Math.floor((template.likes + (locationIndex * 5)) / 4),
      
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
  });

  // STEP 2: Fill remaining posts with unused templates for variety
  const remainingCount = count - locations.length;
  if (remainingCount > 0) {
    // Get unused templates
    const unusedTemplates = allTemplates.filter((_, index) => !usedTemplateIndices.has(index));
    
    for (let i = 0; i < remainingCount && i < unusedTemplates.length; i++) {
      const template = unusedTemplates[i];
      
      // Random location selection for variety
      const randomLocationIndex = (country.id.charCodeAt(0) + i * 11) % locations.length;
      const selectedLocation = locations[randomLocationIndex];
      
      // Different user selection
      const userIndex = (country.id.charCodeAt(1) + i * 17) % nonCurrentUsers.length;
      const selectedUser = nonCurrentUsers[userIndex];

      posts.push({
        id: `extra-post-${country.id}-${i + 1}-${postIdCounter++}`,
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
  }

  return posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// Generate extra diverse posts for global feed with COMPLETELY different templates
const generateDiverseGlobalPosts = (country: Country, count: number = 5): ForumPost[] => {
  const posts: ForumPost[] = [];
  const locations = generateLocationsForCountry(country);
  
  // COMPLETELY DIFFERENT templates from main collection - NO overlap!
  const globalOnlyTemplates = [
    { content: "Drone photography session over {location} captured stunning aerial views! Need special permits but worth the paperwork 🚁📸", category: 'general' as const, tags: ['photography', 'views', 'city'], daysAgo: 1, likes: 145, replies: 32 },
    { content: "Cryptocurrency payments accepted in {location}? Looking for bitcoin-friendly businesses and ATMs 💰₿", category: 'question' as const, tags: ['shopping', 'city', 'cafes'], daysAgo: 2, likes: 78, replies: 19 },
    { content: "Medical tourism options in {location}? Researching dental work and surgery procedures here 🦷🏥", category: 'question' as const, tags: ['wellness', 'city', 'hotels'], daysAgo: 3, likes: 67, replies: 28 },
    { content: "Expat community meetup in {location} every third Thursday! Networking, job opportunities, and local insights 👥💼", category: 'meetup' as const, tags: ['city', 'cafes', 'traditions'], daysAgo: 4, likes: 89, replies: 41 },
    { content: "Seasonal fruit harvesting jobs in {location}! Work visa sponsorship available for backpackers 🍓👷‍♂️", category: 'tip' as const, tags: ['plants', 'backpacking', 'local-cuisine'], daysAgo: 5, likes: 134, replies: 55 },
    { content: "⚠️ Jellyfish season warning for {location} beaches! Purple flags posted, swim at designated safe areas only 🪼🏊‍♀️", category: 'alert' as const, tags: ['beaches', 'marine-life', 'surfing'], daysAgo: 1, likes: 234, replies: 67 },
    { content: "Retirement planning seminars in {location} for digital nomads! Tax optimization and residency advice 📊🏖️", category: 'recommendation' as const, tags: ['beaches', 'city', 'cafes'], daysAgo: 2, likes: 92, replies: 24 },
    { content: "Underground cave exploration in {location} requires advanced booking! Helmet and gear provided by guides 🕳️⛑️", category: 'recommendation' as const, tags: ['outdoors', 'attractions', 'hiking'], daysAgo: 3, likes: 123, replies: 35 },
    { content: "Traditional medicine workshops in {location}? Want to learn about herbal remedies and ancient healing 🌿💊", category: 'question' as const, tags: ['wellness', 'traditions', 'plants'], daysAgo: 4, likes: 76, replies: 22 },
    { content: "Motorcycle touring routes through {location} mountains! Epic scenery but challenging for beginners 🏍️⛰️", category: 'general' as const, tags: ['motorcycles', 'views', 'outdoors'], daysAgo: 5, likes: 156, replies: 38 }
  ];
  
  // Get non-current users
  const nonCurrentUsers = MOCK_USERS.filter(user => user.id !== 'current_user');
  
  // Use different starting point for global posts to ensure variety
  const globalOffset = country.id.charCodeAt(0) + country.id.charCodeAt(country.id.length - 1);
  
  for (let i = 0; i < Math.min(count, globalOnlyTemplates.length); i++) {
    const template = globalOnlyTemplates[i];
    
    // COMPLETELY DIFFERENT user selection pattern for global posts
    const randomUserIndex = (globalOffset + i * 19) % nonCurrentUsers.length;
    const randomUser = nonCurrentUsers[randomUserIndex];
    
    // RANDOM location selection with different seed
    const randomLocationIndex = (globalOffset + i * 23) % locations.length;
    const randomLocation = locations[randomLocationIndex];
    
    // RANDOM time variation for natural spread
    const randomDaysAgo = ((globalOffset + i * 7) % 7) + 1;

    posts.push({
      id: `global-unique-${country.id}-${i + 1}-${postIdCounter++}`,
      authorId: randomUser.id,
      author: randomUser,
      content: template.content.replace('{location}', randomLocation.name),
      
      locationId: randomLocation.id,
      location: randomLocation,
      countryId: country.id,
      category: template.category,
      activityTags: template.tags,
      
      likes: template.likes + ((globalOffset + i * 3) % 50), // Varied engagement
      dislikes: 0,
      replyCount: template.replies + ((globalOffset + i * 5) % 20),
      viewCount: (template.likes + ((globalOffset + i * 3) % 50)) * 3 + 25,
      bookmarkCount: Math.floor((template.likes + ((globalOffset + i * 3) % 50)) / 4),
      
      isLiked: false,
      isDisliked: false,
      isBookmarked: false,
      isFollowing: false,
      
      createdAt: new Date(Date.now() - (randomDaysAgo * 24 * 60 * 60 * 1000)).toISOString(),
      updatedAt: new Date(Date.now() - (randomDaysAgo * 24 * 60 * 60 * 1000)).toISOString(),
      lastActivityAt: new Date(Date.now() - (randomDaysAgo * 12 * 60 * 60 * 1000)).toISOString(),
      
      status: 'active',
      isPinned: false,
      isLocked: false,
      
      metadata: {
        editCount: 0,
        reportCount: 0
      }
    });
  }

  return posts;
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
      // Mix regular posts with diverse posts for maximum variety
      const regularPosts = generateMockPosts(country, 4); // Fewer regular posts
      const diversePosts = generateDiverseGlobalPosts(country, 4); // Add diverse posts
      this.globalFeed.push(...regularPosts, ...diversePosts);
    });
    
    // SUPER AGGRESSIVE SHUFFLING FOR BALANCED CONTENT!
    // Shuffle multiple times to completely randomize categories
    for (let round = 0; round < 5; round++) {
      for (let i = this.globalFeed.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.globalFeed[i], this.globalFeed[j]] = [this.globalFeed[j], this.globalFeed[i]];
      }
    }
    
    // CATEGORY BALANCING: Manually redistribute to ensure variety every 10 posts
    const balancedFeed: ForumPost[] = [];
    const categories = ['general', 'recommendation', 'tip', 'question', 'meetup', 'alert'];
    const postsByCategory = new Map<string, ForumPost[]>();
    
    // Group posts by category
    categories.forEach(cat => postsByCategory.set(cat, []));
    this.globalFeed.forEach(post => {
      const category = post.category;
      if (postsByCategory.has(category)) {
        postsByCategory.get(category)!.push(post);
      } else {
        postsByCategory.get('general')!.push(post); // fallback
      }
    });
    
    // Shuffle each category separately
    postsByCategory.forEach(posts => {
      for (let i = posts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [posts[i], posts[j]] = [posts[j], posts[i]];
      }
    });
    
    // BALANCED DISTRIBUTION: Take turns from each category
    const maxLength = Math.max(...Array.from(postsByCategory.values()).map(arr => arr.length));
    for (let i = 0; i < maxLength; i++) {
      categories.forEach(category => {
        const categoryPosts = postsByCategory.get(category)!;
        if (categoryPosts.length > i) {
          balancedFeed.push(categoryPosts[i]);
        }
      });
    }
    
    // Final shuffle to avoid predictable patterns but keep distribution
    const chunks: ForumPost[][] = [];
    for (let i = 0; i < balancedFeed.length; i += 12) {
      chunks.push(balancedFeed.slice(i, i + 12));
    }
    
    // Shuffle within each chunk to maintain variety
    chunks.forEach(chunk => {
      for (let i = chunk.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [chunk[i], chunk[j]] = [chunk[j], chunk[i]];
      }
    });
    
    this.globalFeed = chunks.flat();
    
    this.isGlobalFeedInitialized = true;
  }

  // NEW: Get global feed posts (all posts from all countries)
  static async getGlobalFeedPosts(params: {
    page?: number;
    limit?: number;
    searchQuery?: string;
    sortBy?: 'recent' | 'popular' | 'trending';
    category?: string;
    activityTags?: string[];
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

      // Remove any potential duplicates by ID (safety check)
      const seenIds = new Set<string>();
      allPosts = allPosts.filter(post => {
        if (seenIds.has(post.id)) {
          return false; // Skip duplicate
        }
        seenIds.add(post.id);
        return true;
      });

      // Apply filters
      if (params.searchQuery) {
        const query = params.searchQuery.toLowerCase();
        allPosts = allPosts.filter(post => 
          post.content.toLowerCase().includes(query) ||
          post.author.displayName.toLowerCase().includes(query) ||
          post.location.name.toLowerCase().includes(query)
        );
      }

      if (params.category && params.category !== 'All') {
        allPosts = allPosts.filter(post => post.category === params.category);
      }

      if (params.activityTags && params.activityTags.length > 0) {
        allPosts = allPosts.filter(post => 
          params.activityTags!.some(tag => post.activityTags.includes(tag))
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

      // ENHANCED: Improved location filtering for centralized posting logic
      if (params.locationId && params.locationId !== 'All') {
        const locationFilter = params.locationId;
        posts = posts.filter(post => {
          // Direct match with locationId (most common case)
          if (post.locationId === locationFilter) return true;
          
          // Match with location name (for name-based filtering)
          if (post.location.name === locationFilter) return true;
          
          // Handle legacy format (countryId-locationId)
          if (post.locationId.includes('-')) {
            const locationPart = post.locationId.split('-').pop();
            if (locationPart === locationFilter) return true;
          }
          
          // Handle case where filter is location name and we need to find by name
          const filterLocation = getLocationByName(locationFilter);
          if (filterLocation && post.locationId === filterLocation.id) return true;
          
          // Handle case where post locationId is a name but filter is an ID
          if (post.locationId === locationFilter) return true;
          
          return false;
        });
      } else if (params.locationId === 'All') {
        // For "All" filter, show ALL posts in this country (including specific locations)
        // This ensures posts created in specific cities are visible in the country's "All" view
        // Posts are already filtered by country, so no additional filtering needed
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
      
      // FIXED: Properly handle location data structure for consistent filtering
      let locationData: { id: string; name: string; type: 'country' | 'city' | 'region' | 'landmark' | 'global'; countryId: string };
      
      // Handle Global Feed specific posts (Global Feed Only Logic)
      if (data.countryId === 'global' && data.locationId === 'global-all') {
        // For Global posts, use special global location data
        locationData = {
          id: 'global-all',
          name: 'Global',
          type: 'global' as const,
          countryId: 'global'
        };
      } else if (data.locationId === 'All' || data.locationId === '') {
        // For "All" location, use country as location
        const country = findCountryById(data.countryId);
        locationData = {
          id: 'All',
          name: country?.name || data.countryId,
          type: 'country' as const,
          countryId: data.countryId
        };
      } else {
        // For specific locations, properly structure the data
        // First check if locationId is actually a location name from placesData
        let actualLocation = getLocationById(data.locationId) || getLocationByName(data.locationId);
        
        if (actualLocation) {
          // Found exact location in placesData
          locationData = {
            id: actualLocation.id,
            name: actualLocation.name,
            type: 'city' as const,
            countryId: data.countryId
          };
        } else {
          // Location not found in placesData, use as-is (might be a custom location)
          locationData = {
            id: data.locationId,
            name: data.locationId,
            type: 'city' as const,
            countryId: data.countryId
          };
        }
      }

      const newPost: ForumPost = {
        id: `user-post-${Date.now()}`,
        authorId: 'current_user',
        author: currentUser,
        title: data.title,
        content: data.content,
        
        locationId: locationData.id,
        location: locationData,
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

      // FIXED: Handle global posts differently - Global Feed Only Logic
      if (data.countryId === 'global') {
        // Global posts only go to global feed, NOT to any country-specific feeds
        const existingIndex = this.globalFeed.findIndex(post => post.id === newPost.id);
        if (existingIndex === -1) {
          this.globalFeed.unshift(newPost);
        }
      } else {
        // Regular country/location posts - add to both country-specific and global feeds
        const cacheKey = data.countryId;
        const userPosts = this.userPosts.get(cacheKey) || [];
        userPosts.unshift(newPost);
        this.userPosts.set(cacheKey, userPosts);

        // Also add to global feed for centralized access (check for duplicates)
        const existingIndex = this.globalFeed.findIndex(post => post.id === newPost.id);
        if (existingIndex === -1) {
          this.globalFeed.unshift(newPost);
        }
      }

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

          // Also update in global feed if it exists there
          const globalPostIndex = this.globalFeed.findIndex(p => p.id === data.postId);
          if (globalPostIndex !== -1) {
            this.globalFeed[globalPostIndex] = post;
          }

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

          // Also update in global feed if it exists there
          const globalPostIndex = this.globalFeed.findIndex(p => p.id === data.postId);
          if (globalPostIndex !== -1) {
            this.globalFeed[globalPostIndex] = post;
          }

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
    this.globalFeed = [];
    this.isPreloaded = false;
    this.isGlobalFeedInitialized = false;
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
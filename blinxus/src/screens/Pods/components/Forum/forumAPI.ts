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

  // Much more diverse and interesting posts!
  const stablePosts = [
    // FOOD & DINING
    {
      content: "Just discovered this incredible hole-in-the-wall ramen shop in {location}! The broth is so rich and flavorful, and it's only $3! Line was crazy but totally worth the wait 🍜✨",
      category: 'recommendation' as const,
      tags: ['restaurants', 'local-cuisine', 'street-food', 'budget-friendly'],
      daysAgo: 1,
      likes: 127,
      replies: 34
    },
    {
      content: "Foodie alert! Found the best local market in {location} with the most amazing fresh produce and spices. The vendors are so friendly and will let you try everything! 🥭🌶️",
      category: 'tip' as const,
      tags: ['food-markets', 'local-cuisine', 'shopping'],
      daysAgo: 3,
      likes: 89,
      replies: 18
    },
    {
      content: "Anyone know where to get authentic street food in {location}? Looking for those places only locals know about, not the touristy spots! 🌮",
      category: 'question' as const,
      tags: ['street-food', 'locals', 'authentic'],
      daysAgo: 2,
      likes: 45,
      replies: 23
    },

    // ADVENTURE & OUTDOORS
    {
      content: "Just finished the most epic hiking trail near {location}! 6 hours of pure adventure with waterfalls, caves, and breathtaking views. Bring good boots and lots of water! 🥾⛰️",
      category: 'general' as const,
      tags: ['hiking', 'outdoors', 'adventure', 'views'],
      daysAgo: 1,
      likes: 156,
      replies: 42
    },
    {
      content: "Adrenaline junkies! Who wants to go bungee jumping in {location} this weekend? Found this sick spot with a 200m drop over a canyon! 🪂",
      category: 'meetup' as const,
      tags: ['extreme-sports', 'adrenaline', 'meetup'],
      daysAgo: 4,
      likes: 78,
      replies: 29
    },
    {
      content: "Rock climbing spots in {location}? I'm intermediate level looking for some challenging routes with good safety equipment rental nearby 🧗‍♂️",
      category: 'question' as const,
      tags: ['rock-climbing', 'outdoors', 'sports'],
      daysAgo: 5,
      likes: 34,
      replies: 16
    },

    // PHOTOGRAPHY & ARTS
    {
      content: "Golden hour magic in {location}! Spent 3 hours at this viewpoint and got the most incredible shots. The light here is absolutely unreal! 📸🌅",
      category: 'general' as const,
      tags: ['photography', 'sunrise', 'views', 'golden-hour'],
      daysAgo: 2,
      likes: 203,
      replies: 37
    },
    {
      content: "Street art scene in {location} is insane! Found this amazing mural district with the most creative graffiti and local artists selling their work 🎨",
      category: 'recommendation' as const,
      tags: ['street-art', 'culture', 'art', 'creative'],
      daysAgo: 6,
      likes: 91,
      replies: 22
    },
    {
      content: "Photographers! Best spots for night photography in {location}? Looking for cityscapes, neon lights, and those moody urban vibes 🌃📷",
      category: 'question' as const,
      tags: ['photography', 'night-photography', 'cityscape'],
      daysAgo: 3,
      likes: 67,
      replies: 19
    },

    // CULTURE & HERITAGE
    {
      content: "Mind blown by the traditional temple ceremony in {location} today! The monks were so welcoming and explained the whole ritual. Such a spiritual experience 🙏",
      category: 'general' as const,
      tags: ['culture', 'temples', 'spiritual', 'traditions'],
      daysAgo: 1,
      likes: 134,
      replies: 28
    },
    {
      content: "Local festival happening in {location} next weekend! Traditional music, dance, and food. Anyone want to experience authentic culture together? 🎭🎪",
      category: 'meetup' as const,
      tags: ['festivals', 'culture', 'music', 'dance'],
      daysAgo: 7,
      likes: 112,
      replies: 45
    },
    {
      content: "History buffs! The museum in {location} has the most incredible artifacts and the stories behind them are fascinating. Spent 4 hours there! 🏛️",
      category: 'recommendation' as const,
      tags: ['museums', 'history', 'culture', 'artifacts'],
      daysAgo: 4,
      likes: 73,
      replies: 15
    },

    // NIGHTLIFE & ENTERTAINMENT
    {
      content: "The nightlife in {location} is absolutely wild! Found this underground club with the best DJs and the most welcoming crowd. Dancing until 5am! 🎵🕺",
      category: 'general' as const,
      tags: ['nightlife', 'clubs', 'music', 'dancing'],
      daysAgo: 2,
      likes: 98,
      replies: 31
    },
    {
      content: "Karaoke night anyone? Found this amazing spot in {location} with private rooms and an incredible song selection. Let's sing our hearts out! 🎤",
      category: 'meetup' as const,
      tags: ['karaoke', 'entertainment', 'meetup', 'music'],
      daysAgo: 5,
      likes: 56,
      replies: 24
    },

    // SPORTS & FITNESS
    {
      content: "Basketball courts in {location}? Looking to join some pickup games and meet local players. I'm decent at shooting but need to work on defense! 🏀",
      category: 'question' as const,
      tags: ['basketball', 'sports', 'locals', 'fitness'],
      daysAgo: 3,
      likes: 42,
      replies: 18
    },
    {
      content: "Surf's up in {location}! Waves are perfect today and there's a great surf school that rents boards. Beginners welcome! 🏄‍♂️🌊",
      category: 'general' as const,
      tags: ['surfing', 'water-sports', 'lessons', 'beach'],
      daysAgo: 1,
      likes: 87,
      replies: 26
    },

    // BUDGET TRAVEL & TIPS
    {
      content: "Budget hack for {location}: buy groceries at the local market and cook at your hostel. Saved like $20/day and met so many cool people in the kitchen! 💰",
      category: 'tip' as const,
      tags: ['budget-travel', 'money-saving', 'hostels', 'cooking'],
      daysAgo: 4,
      likes: 145,
      replies: 33
    },
    {
      content: "Free walking tour in {location} was incredible! The guide knew all the hidden spots and local stories. Tip: bring water and comfortable shoes! 🚶‍♀️",
      category: 'tip' as const,
      tags: ['free-activities', 'walking-tours', 'budget-friendly'],
      daysAgo: 6,
      likes: 79,
      replies: 21
    },

    // LUXURY & WELLNESS
    {
      content: "Treating myself to the spa in {location} and OMG! The traditional massage technique here is life-changing. Expensive but so worth it for the experience ✨💆‍♀️",
      category: 'recommendation' as const,
      tags: ['spa', 'wellness', 'massage', 'luxury'],
      daysAgo: 2,
      likes: 93,
      replies: 17
    },
    {
      content: "Yoga retreat in {location} was exactly what my soul needed. Amazing instructors, healthy food, and the most peaceful setting. Highly recommend! 🧘‍♀️",
      category: 'recommendation' as const,
      tags: ['yoga', 'wellness', 'retreat', 'meditation'],
      daysAgo: 8,
      likes: 108,
      replies: 25
    },

    // DIGITAL NOMAD & WORK
    {
      content: "Digital nomads! Found the perfect coworking space in {location} with super fast wifi, great coffee, and a community of remote workers. Productivity level 💯",
      category: 'tip' as const,
      tags: ['coworking', 'wifi', 'digital-nomad', 'productivity'],
      daysAgo: 3,
      likes: 76,
      replies: 22
    },
    {
      content: "Coffee shop with the best wifi in {location}? Need a quiet spot to work on my laptop for a few hours. Bonus points if they have good pastries! ☕💻",
      category: 'question' as const,
      tags: ['coffee-shops', 'wifi', 'work-friendly'],
      daysAgo: 2,
      likes: 38,
      replies: 14
    },

    // TRANSPORTATION & LOGISTICS
    {
      content: "Pro tip for {location}: download the local transport app and get a weekly pass. Way cheaper than daily tickets and works on buses, trains, and metro! 🚇",
      category: 'tip' as const,
      tags: ['local-transport', 'money-saving', 'apps'],
      daysAgo: 5,
      likes: 167,
      replies: 41
    },
    {
      content: "Motorbike rental in {location}? Looking for a reliable place with good bikes and fair prices. Want to explore the countryside this weekend! 🏍️",
      category: 'question' as const,
      tags: ['motorbike-rental', 'transportation', 'countryside'],
      daysAgo: 4,
      likes: 52,
      replies: 19
    },

    // ACCOMMODATION & STAYS
    {
      content: "Staying at this incredible boutique hotel in {location}! The design is so unique and the staff treats you like family. Worth every penny! 🏨✨",
      category: 'recommendation' as const,
      tags: ['hotels', 'boutique', 'design', 'service'],
      daysAgo: 1,
      likes: 84,
      replies: 16
    },
    {
      content: "Hostel recommendations in {location}? Looking for clean, safe, and social vibes. Want to meet other travelers and make new friends! 🎒",
      category: 'question' as const,
      tags: ['hostels', 'budget-friendly', 'social'],
      daysAgo: 6,
      likes: 47,
      replies: 28
    },

    // SHOPPING & MARKETS
    {
      content: "Vintage shopping paradise in {location}! Found this district with amazing thrift stores and local designers. Got the coolest jacket ever! 👕🛍️",
      category: 'recommendation' as const,
      tags: ['shopping', 'vintage', 'thrift', 'fashion'],
      daysAgo: 3,
      likes: 71,
      replies: 20
    },
    {
      content: "Night market in {location} is absolutely incredible! The energy, the food, the handmade crafts - it's like a festival every night! 🌃🛒",
      category: 'general' as const,
      tags: ['night-markets', 'crafts', 'atmosphere'],
      daysAgo: 2,
      likes: 119,
      replies: 35
    },

    // SOLO TRAVEL & SAFETY
    {
      content: "Solo female traveler here! {location} feels super safe and the locals are incredibly helpful. Had amazing conversations with strangers everywhere! 👩‍🦰",
      category: 'general' as const,
      tags: ['solo-travel', 'safety', 'female-travel', 'locals'],
      daysAgo: 4,
      likes: 156,
      replies: 43
    },
    {
      content: "Safety tips for {location}? First time traveling alone here and want to make sure I'm being smart about it. Any areas to avoid at night? 🛡️",
      category: 'question' as const,
      tags: ['safety', 'solo-travel', 'travel-tips'],
      daysAgo: 7,
      likes: 89,
      replies: 52
    }
  ];

  // Get non-current users
  const nonCurrentUsers = MOCK_USERS.filter(user => user.id !== 'current_user');
  
  for (let i = 0; i < Math.min(count, stablePosts.length); i++) {
    const template = stablePosts[i];
    
    // DIVERSE USERS: Use country ID to create different user patterns per country
    // This way same post index gets different users in different countries
    const userSeed = country.id.charCodeAt(0) + i * 7; // Different seed per country + post
    const selectedUser = nonCurrentUsers[userSeed % nonCurrentUsers.length];
    
    // DIVERSE LOCATIONS: Also vary location selection per country
    const locationSeed = country.id.charCodeAt(country.id.length - 1) + i * 3;
    const selectedLocation = locations[locationSeed % locations.length];

    posts.push({
      id: `stable-post-${country.id}-${i + 1}-${postIdCounter++}`,
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

// Generate extra diverse posts for global feed
const generateDiverseGlobalPosts = (country: Country, count: number = 5): ForumPost[] => {
  const posts: ForumPost[] = [];
  const locations = generateLocationsForCountry(country);
  
  // Extra diverse post templates with different categories
  const extraDiversePosts = [
    {
      content: "Street art scene in {location} is absolutely mind-blowing! Found this incredible mural district that tells the whole city's history through art 🎨",
      category: 'general' as const,
      tags: ['street-art', 'murals', 'culture', 'history'],
      daysAgo: 2,
      likes: 134,
      replies: 28
    },
    {
      content: "Coworking spaces in {location}? Digital nomad looking for reliable WiFi and good coffee. Bonus points for rooftop views! ☕💻",
      category: 'question' as const,
      tags: ['coworking', 'digital-nomad', 'wifi', 'coffee'],
      daysAgo: 1,
      likes: 67,
      replies: 15
    },
    {
      content: "Volunteering opportunity in {location}! Teaching English to local kids, such a rewarding experience. They taught me more than I taught them! 🌟",
      category: 'general' as const,
      tags: ['volunteering', 'teaching', 'community', 'kids'],
      daysAgo: 4,
      likes: 203,
      replies: 45
    },
    {
      content: "Sustainable travel tips for {location}? Want to minimize my environmental impact while exploring this beautiful place 🌱",
      category: 'question' as const,
      tags: ['sustainable-travel', 'eco-friendly', 'environment'],
      daysAgo: 3,
      likes: 89,
      replies: 31
    },
    {
      content: "Music festival in {location} was INCREDIBLE! The lineup, the vibes, the local bands - everything was perfect. Can't wait for next year! 🎵🎪",
      category: 'general' as const,
      tags: ['music-festival', 'concerts', 'local-bands', 'vibes'],
      daysAgo: 6,
      likes: 178,
      replies: 52
    },
    {
      content: "Learning the local language in {location}! Any good language exchange meetups or conversation groups? Want to practice with natives 🗣️",
      category: 'question' as const,
      tags: ['language-learning', 'meetups', 'conversation', 'locals'],
      daysAgo: 5,
      likes: 92,
      replies: 38
    },
    {
      content: "Sunrise hike in {location} - absolutely magical! The view from the top made the 4AM wake-up call totally worth it 🌅⛰️",
      category: 'recommendation' as const,
      tags: ['hiking', 'sunrise', 'mountains', 'early-morning'],
      daysAgo: 1,
      likes: 156,
      replies: 24
    },
    {
      content: "Local cooking class in {location}! Learned to make traditional dishes from a grandmother who's been cooking for 50 years 👵🍳",
      category: 'recommendation' as const,
      tags: ['cooking-class', 'traditional-food', 'grandmother', 'authentic'],
      daysAgo: 7,
      likes: 124,
      replies: 33
    }
  ];

  // Get non-current users
  const nonCurrentUsers = MOCK_USERS.filter(user => user.id !== 'current_user');
  
  // GLOBAL FEED SPECIAL: Use pure randomization for maximum diversity
  for (let i = 0; i < Math.min(count, extraDiversePosts.length); i++) {
    const template = extraDiversePosts[i];
    
    // COMPLETELY RANDOM user selection for global feed
    const randomUser = nonCurrentUsers[Math.floor(Math.random() * nonCurrentUsers.length)];
    
    // COMPLETELY RANDOM location selection
    const randomLocation = locations[Math.floor(Math.random() * locations.length)];
    
    // RANDOM time variation for more natural spread
    const randomDaysAgo = Math.floor(Math.random() * 7) + 1;

    posts.push({
      id: `global-diverse-${country.id}-${i + 1}-${postIdCounter++}`,
      authorId: randomUser.id,
      author: randomUser,
      content: template.content.replace('{location}', randomLocation.name),
      
      locationId: randomLocation.id,
      location: randomLocation,
      countryId: country.id,
      category: template.category,
      activityTags: template.tags,
      
      likes: template.likes + Math.floor(Math.random() * 50), // Random like variation
      dislikes: 0,
      replyCount: template.replies + Math.floor(Math.random() * 20), // Random reply variation
      viewCount: (template.likes + Math.floor(Math.random() * 50)) * 3 + 25,
      bookmarkCount: Math.floor((template.likes + Math.floor(Math.random() * 50)) / 4),
      
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
    
    // SHUFFLE THE GLOBAL FEED TO MIX EVERYTHING UP!
    // This ensures diverse categories and users are mixed together
    for (let i = this.globalFeed.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.globalFeed[i], this.globalFeed[j]] = [this.globalFeed[j], this.globalFeed[i]];
    }
    
    // Sort global feed by creation date (most recent first) - but keep some randomness
    this.globalFeed.sort((a, b) => {
      // Add some randomness to the sorting to mix things up more
      const randomFactor = (Math.random() - 0.5) * 0.1; // Small random factor
      const timeDiff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return timeDiff + (randomFactor * 86400000); // Add up to 2.4 hours of randomness
    });
    
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
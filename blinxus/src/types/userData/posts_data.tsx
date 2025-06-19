import { ActivityKey } from '../../constants/activityTags';

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorNationalityFlag?: string;
  authorProfileImage?: string;
  type: 'regular' | 'lucid';
  content?: string;
  title?: string;
  images?: string[];
  device?: string;
  location: string; // REQUIRED
  activity?: ActivityKey; // OPTIONAL
  timestamp: string;
  timeAgo: string;
  likes: number;
  comments: number;
  isEdited?: boolean; // Track if post has been edited
  editAttempts?: number; // Track number of edit attempts for activity/location (deprecated)
  locationEditCount?: number; // Track location edit attempts separately
  activityEditCount?: number; // Track activity edit attempts separately
}

// Initial sample data to test the system
export const initialPostsData: Post[] = [
  // Aquatics - Regular Post
  {
    id: '1',
    authorId: 'user123',
    authorName: 'Aria Nakamura',
    authorNationalityFlag: '🇯🇵',
    authorProfileImage: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop',
    type: 'regular',
    content: 'Found paradise today! The crystal clear waters of El Nido are absolutely breathtaking. Island hopping through hidden lagoons and secret beaches - this place never fails to amaze me! 🏝️✨',
    images: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop'
    ],
    device: 'iPhone 16 ProMax',
    location: 'El Nido, Palawan',
    activity: 'aquatics',
    timestamp: '2025-01-09T08:30:00Z',
    timeAgo: '2h',
    likes: 438,
    comments: 32
  },
  // Outdoors - Regular Post
  {
    id: '2',
    authorId: 'user456',
    authorName: 'Miguel Santos',
    authorNationalityFlag: '🇧🇷',
    authorProfileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    type: 'regular',
    content: 'Sunrise hike at Mount Pulag was absolutely incredible! The sea of clouds below and the golden light hitting the peaks - nature at its finest. The 4am wake up call was totally worth it! 🌄⛰️',
    images: [
      'https://images.unsplash.com/photo-1464822759844-d150baec0494?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop'
    ],
    device: 'Samsung Galaxy S24 Ultra',
    location: 'Mount Pulag, Benguet',
    activity: 'outdoors',
    timestamp: '2025-01-09T05:15:00Z',
    timeAgo: '5h',
    likes: 291,
    comments: 47
  },
  // Wellness - Regular Post
  {
    id: '3',
    authorId: 'user101',
    authorName: 'Carlos Rodriguez',
    authorNationalityFlag: '🇲🇽',
    authorProfileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    type: 'regular',
    content: 'Beach yoga session at sunset in Boracay was pure bliss! The sound of waves, warm sand beneath my feet, and this incredible orange sky - exactly what my soul needed. Namaste! 🧘‍♂️🌅',
    images: ['https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop'],
    location: 'Boracay, Aklan',
    activity: 'wellness',
    timestamp: '2025-01-08T18:30:00Z',
    timeAgo: '1d',
    likes: 203,
    comments: 15
  },
  // Heritage - Regular Post
  {
    id: '4',
    authorId: 'user202',
    authorName: 'Alfonso Rivera',
    authorNationalityFlag: '🇵🇭',
    authorProfileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    type: 'regular',
    content: 'Standing before the 2000-year-old Banaue Rice Terraces - a true wonder of the world! The engineering and artistry of our ancestors is mind-blowing. These "stairways to heaven" are living proof of Filipino ingenuity! 🏞️🇵🇭',
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1464822759844-d150baec0494?w=800&h=600&fit=crop'
    ],
    location: 'Banaue, Ifugao',
    activity: 'heritage',
    timestamp: '2025-01-08T14:20:00Z',
    timeAgo: '1d',
    likes: 89,
    comments: 12
  },
  // Aquatics - Lucid Post
  {
    id: '5',
    authorId: 'current_user',
    authorName: 'Third Camacho',
    authorNationalityFlag: '🇵🇭',
    type: 'lucid',
    title: 'Siargao Island',
    content: 'Surfing paradise found! Siargao\'s world-class waves and laid-back island vibes have completely stolen my heart. From Cloud 9 breaks to hidden surf spots, this place is pure magic! 🏄‍♂️🌊',
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop'
    ],
    location: 'Siargao Island, Philippines',
    activity: 'aquatics',
    timestamp: '2025-01-07T16:45:00Z',
    timeAgo: '2d',
    likes: 324,
    comments: 28
  },
  // Cultural - Lucid Post
  {
    id: '6',
    authorId: 'user303',
    authorName: 'Isabella Chen',
    authorNationalityFlag: '🇨🇳',
    authorProfileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    type: 'lucid',
    title: 'Kyoto',
    content: 'Lost in the timeless beauty of Kyoto! Walking through bamboo forests, ancient temples, and traditional streets feels like stepping into a living museum. The cherry blossoms are the perfect finishing touch! 🌸⛩️',
    images: [
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&h=600&fit=crop'
    ],
    location: 'Kyoto, Japan',
    activity: 'cultural',
    timestamp: '2025-01-06T12:30:00Z',
    timeAgo: '3d',
    likes: 267,
    comments: 19
  },
  // City - Regular Post
  {
    id: '7',
    authorId: 'user404',
    authorName: 'Emma Thompson',
    authorNationalityFlag: '🇬🇧',
    authorProfileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
    type: 'regular',
    content: 'BGC never fails to impress! The modern skyline, world-class restaurants, and vibrant nightlife make this the perfect urban playground. Manila\'s business district has such incredible energy! 🏙️✨',
    images: ['https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop'],
    location: 'BGC, Taguig',
    activity: 'city',
    timestamp: '2025-01-06T10:15:00Z',
    timeAgo: '3d',
    likes: 156,
    comments: 23
  },
  // Food - Regular Post
  {
    id: '8',
    authorId: 'user505',
    authorName: 'Marco Rossi',
    authorNationalityFlag: '🇮🇹',
    authorProfileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
    type: 'regular',
    content: 'Food heaven at Mercato Centrale! From authentic Italian pasta to Filipino street food classics - this place has it all. The fusion of flavors and cultures in one market is absolutely incredible! 🍝🌮',
    images: [
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop'
    ],
    location: 'Mercato Centrale, BGC',
    activity: 'food',
    timestamp: '2025-01-05T19:30:00Z',
    timeAgo: '4d',
    likes: 189,
    comments: 31
  },
  // Stays - Regular Post
  {
    id: '9',
    authorId: 'user606',
    authorName: 'Sophie Martin',
    authorNationalityFlag: '🇫🇷',
    authorProfileImage: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop',
    type: 'regular',
    content: 'Living the dream at Amanpulo! This private island resort is pure luxury - overwater villas, pristine beaches, and service that\'s simply out of this world. Sometimes you just need to treat yourself! 🏝️🥂',
    images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop'],
    location: 'Amanpulo, Palawan',
    activity: 'stays',
    timestamp: '2025-01-05T08:45:00Z',
    timeAgo: '4d',
    likes: 312,
    comments: 18
  },
  // Amusements - Regular Post
  {
    id: '10',
    authorId: 'user707',
    authorName: 'Jake Wilson',
    authorNationalityFlag: '🇺🇸',
    authorProfileImage: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=800&h=600&fit=crop',
    type: 'regular',
    content: 'Reliving my childhood at Enchanted Kingdom! The roller coasters, carnival games, and that magical atmosphere never gets old. Sometimes you just need to embrace your inner kid! 🎢🎠',
    images: ['https://images.unsplash.com/photo-1594736797933-d0e3e8b08f2d?w=800&h=600&fit=crop'],
    location: 'Enchanted Kingdom, Laguna',
    activity: 'amusements',
    timestamp: '2025-01-04T15:20:00Z',
    timeAgo: '5d',
    likes: 234,
    comments: 42
  },
  // Special Experiences - Lucid Post
  {
    id: '11',
    authorId: 'user808',
    authorName: 'Yuki Tanaka',
    authorNationalityFlag: '🇯🇵',
    authorProfileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&face=top',
    type: 'lucid',
    title: 'Northern Lights',
    content: 'Witnessing the Aurora Borealis in Iceland was absolutely life-changing! Dancing green lights across the Arctic sky - nature\'s most spectacular light show. No photo can capture how magical this moment truly was! 🌌💚',
    images: [
      'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop'
    ],
    location: 'Iceland',
    activity: 'special',
    timestamp: '2025-01-04T02:30:00Z',
    timeAgo: '5d',
    likes: 567,
    comments: 89
  },
  // Thrill - Regular Post
  {
    id: '12',
    authorId: 'user909',
    authorName: 'Alex Rodriguez',
    authorNationalityFlag: '🇨🇴',
    authorProfileImage: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&h=400&fit=crop',
    type: 'regular',
    content: 'Adrenaline rush at Danao Adventure Park! Zip-lining through the jungle canopy and bungee jumping over crystal clear waters - Bohol knows how to get your heart racing! Pure thrill seeker paradise! 🪂⚡',
    images: ['https://images.unsplash.com/photo-1464822759844-d150baec0494?w=800&h=600&fit=crop'],
    location: 'Danao, Bohol',
    activity: 'thrill',
    timestamp: '2025-01-03T14:10:00Z',
    timeAgo: '6d',
    likes: 178,
    comments: 25
  },
  // Third Camacho - Outdoors Regular Post
  {
    id: '13',
    authorId: 'current_user',
    authorName: 'Third Camacho',
    authorNationalityFlag: '🇵🇭',
    type: 'regular',
    content: 'Conquered Mount Apo at sunrise! Philippines\' highest peak at 2,954 meters - the journey was tough but this view is absolutely worth every step. Standing on top of the world right here in Mindanao! 🏔️🇵🇭',
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop'
    ],
    device: 'iPhone 16 ProMax',
    location: 'Mount Apo, Davao',
    activity: 'outdoors',
    timestamp: '2025-01-03T06:00:00Z',
    timeAgo: '6d',
    likes: 892,
    comments: 67
  },
  // Third Camacho - Cultural Lucid Post
  {
    id: '14',
    authorId: 'current_user',
    authorName: 'Third Camacho',
    authorNationalityFlag: '🇵🇭',
    type: 'lucid',
    title: 'Vigan Heritage',
    content: 'Walking through Vigan feels like traveling back in time! These cobblestone streets and Spanish colonial houses have witnessed 500 years of history. UNESCO got it right - this place is pure cultural treasure! 🏛️✨',
    images: [
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1464822759844-d150baec0494?w=800&h=600&fit=crop'
    ],
    location: 'Vigan, Ilocos Sur',
    activity: 'heritage',
    timestamp: '2025-01-02T15:30:00Z',
    timeAgo: '1w',
    likes: 645,
    comments: 43
  },
  // Third Camacho - Food Regular Post
  {
    id: '15',
    authorId: 'current_user',
    authorName: 'Third Camacho',
    authorNationalityFlag: '🇵🇭',
    type: 'regular',
    content: 'Cebu lechon experience level: LEGENDARY! 🐷🔥 This crispy skin, tender meat perfection at CNT Lechon is hands down the best I\'ve ever tasted. No wonder they call Cebu the lechon capital of the Philippines!',
    images: [
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800&h=600&fit=crop'
    ],
    device: 'iPhone 16 ProMax',
    location: 'Cebu City, Cebu',
    activity: 'food',
    timestamp: '2025-01-01T18:45:00Z',
    timeAgo: '1w',
    likes: 1247,
    comments: 89
  },
  // Third Camacho - Wellness Lucid Post
  {
    id: '16',
    authorId: 'current_user',
    authorName: 'Third Camacho',
    authorNationalityFlag: '🇵🇭',
    type: 'lucid',
    title: 'Bataan Meditation',
    content: 'Found my zen at the historic Mount Samat! Meditating where heroes once stood, surrounded by lush mountains and peaceful silence. Sometimes the best therapy is just being present in nature\'s embrace. 🧘‍♂️🌿',
    images: [
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
    ],
    location: 'Mount Samat, Bataan',
    activity: 'wellness',
    timestamp: '2024-12-31T07:15:00Z',
    timeAgo: '1w',
    likes: 534,
    comments: 32
  },
  // Third Camacho - City Regular Post
  {
    id: '17',
    authorId: 'current_user',
    authorName: 'Third Camacho',
    authorNationalityFlag: '🇵🇭',
    type: 'regular',
    content: 'Makati skyline hits different at golden hour! From Ayala Triangle to the towering skyscrapers, this concrete jungle has its own kind of beauty. The energy here is infectious - pure Manila vibes! 🏙️⚡',
    images: [
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop'
    ],
    device: 'iPhone 16 ProMax',
    location: 'Makati City, Metro Manila',
    activity: 'city',
    timestamp: '2024-12-30T17:30:00Z',
    timeAgo: '1w',
    likes: 723,
    comments: 45
  }
];

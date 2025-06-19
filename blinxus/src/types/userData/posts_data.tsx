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
    authorName: 'Jessica Martinez',
    authorNationalityFlag: '🇪🇸',
    authorProfileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=400&q=80',
    type: 'regular',
    content: 'Found paradise today! The crystal clear waters of El Nido are absolutely breathtaking. Island hopping through hidden lagoons and secret beaches - this place never fails to amaze me! 🏝️✨',
    images: [
      'https://picsum.photos/800/600?random=1',
      'https://picsum.photos/800/600?random=11',
      'https://picsum.photos/800/600?random=21'
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
      'https://picsum.photos/800/600?random=2',
      'https://picsum.photos/800/600?random=12'
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
    images: ['https://picsum.photos/800/600?random=3'],
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
      'https://picsum.photos/800/600?random=4',
      'https://picsum.photos/800/600?random=14',
      'https://picsum.photos/800/600?random=24',
      'https://picsum.photos/800/600?random=34'
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
      'https://picsum.photos/800/600?random=100',
      'https://picsum.photos/800/600?random=101',
      'https://picsum.photos/800/600?random=102'
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
      'https://picsum.photos/800/600?random=200',
      'https://picsum.photos/800/600?random=201',
      'https://picsum.photos/800/600?random=202'
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
    images: ['https://picsum.photos/800/600?random=7'],
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
      'https://picsum.photos/800/600?random=8',
      'https://picsum.photos/800/600?random=18',
      'https://picsum.photos/800/600?random=28',
      'https://picsum.photos/800/600?random=38',
      'https://picsum.photos/800/600?random=48'
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
    images: ['https://picsum.photos/800/600?random=9'],
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
    authorProfileImage: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=400&fit=crop',
    type: 'regular',
    content: 'Reliving my childhood at Enchanted Kingdom! The roller coasters, carnival games, and that magical atmosphere never gets old. Sometimes you just need to embrace your inner kid! 🎢🎠',
    images: ['https://picsum.photos/800/600?random=10'],
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
      'https://picsum.photos/800/600?random=300',
      'https://picsum.photos/800/600?random=301',
      'https://picsum.photos/800/600?random=302'
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
    images: ['https://picsum.photos/800/600?random=12'],
    location: 'Danao, Bohol',
    activity: 'thrill',
    timestamp: '2025-01-03T14:10:00Z',
    timeAgo: '6d',
    likes: 178,
    comments: 25
  }
];

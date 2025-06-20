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
    authorProfileImage: 'https://cdn.pixabay.com/photo/2016/11/29/13/14/attractive-1869761_960_720.jpg',
    type: 'regular',
    content: 'Found paradise today! The crystal clear waters of El Nido are absolutely breathtaking. Island hopping through hidden lagoons and secret beaches - this place never fails to amaze me! 🏝️✨',
    images: [
      'https://cdn.pixabay.com/photo/2017/12/16/22/22/beach-3023488_960_720.jpg',
      'https://cdn.pixabay.com/photo/2019/07/25/17/09/lagoon-4360964_960_720.jpg',
      'https://cdn.pixabay.com/photo/2018/08/14/13/23/ocean-3605547_960_720.jpg'
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
    authorProfileImage: 'https://cdn.pixabay.com/photo/2016/11/21/12/42/beard-1845166_960_720.jpg',
    type: 'regular',
    content: 'Sunrise hike at Mount Pulag was absolutely incredible! The sea of clouds below and the golden light hitting the peaks - nature at its finest. The 4am wake up call was totally worth it! 🌄⛰️',
    images: [
      'https://cdn.pixabay.com/photo/2016/08/11/23/48/mountains-1587287_960_720.jpg',
      'https://cdn.pixabay.com/photo/2018/01/09/03/49/the-natural-scenery-3070808_960_720.jpg'
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
    authorProfileImage: 'https://cdn.pixabay.com/photo/2018/04/27/03/50/portrait-3353699_960_720.jpg',
    type: 'regular',
    content: 'Beach yoga session at sunset in Boracay was pure bliss! The sound of waves, warm sand beneath my feet, and this incredible orange sky - exactly what my soul needed. Namaste! 🧘‍♂️🌅',
    images: ['https://cdn.pixabay.com/photo/2017/08/06/12/06/people-2592247_960_720.jpg'],
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
    authorProfileImage: 'https://cdn.pixabay.com/photo/2016/11/18/19/07/happy-1836445_960_720.jpg',
    type: 'regular',
    content: 'Standing before the 2000-year-old Banaue Rice Terraces - a true wonder of the world! The engineering and artistry of our ancestors is mind-blowing. These "stairways to heaven" are living proof of Filipino ingenuity! 🏞️🇵🇭',
    images: [
      'https://cdn.pixabay.com/photo/2018/01/09/03/49/the-natural-scenery-3070808_960_720.jpg',
      'https://cdn.pixabay.com/photo/2016/08/11/23/48/mountains-1587287_960_720.jpg',
      'https://cdn.pixabay.com/photo/2017/02/01/13/52/monument-2031308_960_720.jpg',
      'https://cdn.pixabay.com/photo/2018/08/14/13/23/ocean-3605547_960_720.jpg'
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
      'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=800'
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
    authorProfileImage: 'https://cdn.pixabay.com/photo/2017/05/03/21/13/girl-2282612_960_720.jpg',
    type: 'lucid',
    title: 'Kyoto',
    content: 'Lost in the timeless beauty of Kyoto! Walking through bamboo forests, ancient temples, and traditional streets feels like stepping into a living museum. The cherry blossoms are the perfect finishing touch! 🌸⛩️',
    images: [
      'https://cdn.pixabay.com/photo/2020/04/29/07/24/bamboo-5107425_960_720.jpg',
      'https://cdn.pixabay.com/photo/2021/01/04/10/37/temple-5887585_960_720.jpg',
      'https://cdn.pixabay.com/photo/2020/03/20/10/47/cherry-blossoms-4950193_960_720.jpg'
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
    authorProfileImage: 'https://cdn.pixabay.com/photo/2018/01/21/14/16/woman-3096664_960_720.jpg',
    type: 'regular',
    content: 'BGC never fails to impress! The modern skyline, world-class restaurants, and vibrant nightlife make this the perfect urban playground. Manila\'s business district has such incredible energy! 🏙️✨',
    images: ['https://cdn.pixabay.com/photo/2016/11/23/15/48/audience-1853662_960_720.jpg'],
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
    authorProfileImage: 'https://cdn.pixabay.com/photo/2016/11/21/14/53/man-1845814_960_720.jpg',
    type: 'regular',
    content: 'Food heaven at Mercato Centrale! From authentic Italian pasta to Filipino street food classics - this place has it all. The fusion of flavors and cultures in one market is absolutely incredible! 🍝🌮',
    images: [
      'https://cdn.pixabay.com/photo/2017/12/09/08/18/pizza-3007395_960_720.jpg',
      'https://cdn.pixabay.com/photo/2017/05/07/08/56/pancakes-2291908_960_720.jpg',
      'https://cdn.pixabay.com/photo/2014/10/23/18/05/burger-500054_960_720.jpg',
      'https://cdn.pixabay.com/photo/2017/01/26/02/06/platter-2009590_960_720.jpg',
      'https://cdn.pixabay.com/photo/2016/03/05/19/02/hamburger-1238246_960_720.jpg'
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
    authorProfileImage: 'https://cdn.pixabay.com/photo/2017/08/01/08/29/woman-2563491_960_720.jpg',
    type: 'regular',
    content: 'Living the dream at Amanpulo! This private island resort is pure luxury - overwater villas, pristine beaches, and service that\'s simply out of this world. Sometimes you just need to treat yourself! 🏝️🥂',
    images: ['https://cdn.pixabay.com/photo/2018/08/14/13/23/ocean-3605547_960_720.jpg'],
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
    authorProfileImage: 'https://cdn.pixabay.com/photo/2015/07/20/12/57/ambassador-852766_960_720.jpg',
    type: 'regular',
    content: 'Reliving my childhood at Enchanted Kingdom! The roller coasters, carnival games, and that magical atmosphere never gets old. Sometimes you just need to embrace your inner kid! 🎢🎠',
    images: ['https://cdn.pixabay.com/photo/2019/10/06/10/03/amusement-park-4530231_960_720.jpg'],
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
    authorProfileImage: 'https://cdn.pixabay.com/photo/2016/11/29/20/22/girl-1871104_960_720.jpg',
    type: 'lucid',
    title: 'Northern Lights',
    content: 'Witnessing the Aurora Borealis in Iceland was absolutely life-changing! Dancing green lights across the Arctic sky - nature\'s most spectacular light show. No photo can capture how magical this moment truly was! 🌌💚',
    images: [
      'https://cdn.pixabay.com/photo/2016/01/08/11/57/butterfly-1127666_960_720.jpg',
      'https://cdn.pixabay.com/photo/2018/01/09/03/49/the-natural-scenery-3070808_960_720.jpg',
      'https://cdn.pixabay.com/photo/2016/08/11/23/48/mountains-1587287_960_720.jpg'
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
    authorProfileImage: 'https://cdn.pixabay.com/photo/2018/02/16/14/38/portrait-3157821_960_720.jpg',
    type: 'regular',
    content: 'Adrenaline rush at Danao Adventure Park! Zip-lining through the jungle canopy and bungee jumping over crystal clear waters - Bohol knows how to get your heart racing! Pure thrill seeker paradise! 🪂⚡',
    images: ['https://cdn.pixabay.com/photo/2018/08/14/13/23/ocean-3605547_960_720.jpg'],
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
      'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/346529/pexels-photo-346529.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    device: 'iPhone 16 ProMax',
    location: 'Mount Apo, Davao',
    activity: 'outdoors',
    timestamp: '2025-01-03T06:00:00Z',
    timeAgo: '6d',
    likes: 892,
    comments: 67
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
      'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    device: 'iPhone 16 ProMax',
    location: 'Cebu City, Cebu',
    activity: 'food',
    timestamp: '2025-01-01T18:45:00Z',
    timeAgo: '1w',
    likes: 1247,
    comments: 89
  }
];

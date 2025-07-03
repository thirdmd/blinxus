import { ActivityKey } from '../../constants/activityTags';

// Centralized Lucid Photo Management Utilities
export class LucidPhotoManager {
  /**
   * Converts day-by-day photos to flat array for backward compatibility
   */
  static dayPhotosToFlatArray(dayPhotos: { [dayIndex: number]: string[] }): string[] {
    const flatArray: string[] = [];
    const sortedDays = Object.keys(dayPhotos).sort((a, b) => parseInt(a) - parseInt(b));
    
    sortedDays.forEach(dayIndex => {
      const dayImages = dayPhotos[parseInt(dayIndex)] || [];
      flatArray.push(...dayImages);
    });
    
    return flatArray;
  }

  /**
   * Converts flat array to day-by-day structure (for migration/fallback)
   */
  static flatArrayToDayPhotos(images: string[], imagesPerDay: number = 4): { [dayIndex: number]: string[] } {
    const dayPhotos: { [dayIndex: number]: string[] } = {};
    
    for (let i = 0; i < images.length; i += imagesPerDay) {
      const dayIndex = Math.floor(i / imagesPerDay);
      dayPhotos[dayIndex] = images.slice(i, i + imagesPerDay);
    }
    
    return dayPhotos;
  }

  /**
   * Gets the total number of images across all days
   */
  static getTotalImageCount(dayPhotos: { [dayIndex: number]: string[] }): number {
    return Object.values(dayPhotos).reduce((total, dayImages) => total + dayImages.length, 0);
  }

  /**
   * Validates if all days have the required number of images (3-4 per day)
   */
  static validateDayPhotos(dayPhotos: { [dayIndex: number]: string[] }, duration: number, minPerDay: number = 3, maxPerDay: number = 4): boolean {
    for (let day = 0; day < duration; day++) {
      const dayImageCount = dayPhotos[day]?.length || 0;
      if (dayImageCount < minPerDay || dayImageCount > maxPerDay) {
        return false;
      }
    }
    return true;
  }

  /**
   * Gets images for a specific day (0-indexed)
   */
  static getDayImages(dayPhotos: { [dayIndex: number]: string[] }, dayIndex: number): string[] {
    return dayPhotos[dayIndex] || [];
  }

  /**
   * Creates a lucid post data structure
   */
  static createLucidPostData(
    duration: number,
    durationMode: 'days' | 'dates',
    dayPhotos: { [dayIndex: number]: string[] },
    startDate?: Date,
    endDate?: Date
  ) {
    return {
      duration,
      durationMode,
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
      dayPhotos,
    };
  }
}

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
  // Lucid-specific fields for day-by-day photo structure
  lucidData?: {
    duration: number; // Number of days
    durationMode: 'days' | 'dates';
    startDate?: string; // ISO date string
    endDate?: string; // ISO date string
    dayPhotos: { [dayIndex: number]: string[] }; // Day-by-day photos: { 0: ['img1', 'img2'], 1: ['img3', 'img4'] }
  };
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
  // City - Regular Post (MOVED TO TOP)
  {
    id: '7',
    authorId: 'user404',
    authorName: 'Emma Thompson',
    authorNationalityFlag: '🇬🇧',
    authorProfileImage: 'https://cdn.pixabay.com/photo/2018/01/21/14/16/woman-3096664_960_720.jpg',
    type: 'regular',
    content: 'BGC never fails to impress! The modern skyline, world-class restaurants, and vibrant nightlife make this the perfect urban playground. Manila\'s business district has such incredible energy! 🏙️✨',
    images: [
      'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2422915/pexels-photo-2422915.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/3244513/pexels-photo-3244513.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1134166/pexels-photo-1134166.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    location: 'BGC, Taguig',
    activity: 'city',
    timestamp: '2025-01-06T10:15:00Z',
    timeAgo: '3d',
    likes: 156,
    comments: 23
  },
  // Food - Regular Post (MOVED TO TOP)
  {
    id: '8',
    authorId: 'user505',
    authorName: 'Marco Rossi',
    authorNationalityFlag: '🇮🇹',
    authorProfileImage: 'https://cdn.pixabay.com/photo/2016/11/21/14/53/man-1845814_960_720.jpg',
    type: 'regular',
    content: 'Food heaven at Mercato Centrale! From authentic Italian pasta to Filipino street food classics - this place has it all. The fusion of flavors and cultures in one market is absolutely incredible! 🍝🌮',
    images: [
      'https://images.pexels.com/photos/2437299/pexels-photo-2437299.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    location: 'Mercato Centrale, BGC',
    activity: 'food',
    timestamp: '2025-01-05T19:30:00Z',
    timeAgo: '4d',
    likes: 189,
    comments: 31
  },
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
      'https://images.pexels.com/photos/1612461/pexels-photo-1612461.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=800'
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
      'https://images.pexels.com/photos/346529/pexels-photo-346529.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    device: 'Samsung Galaxy S24 Ultra',
    location: 'Mount Pulag, Benguet',
    activity: 'outdoors',
    timestamp: '2025-01-09T05:15:00Z',
    timeAgo: '5h',
    likes: 291,
    comments: 47
  },
  // Food - Regular Post
  {
    id: '3',
    authorId: 'user101',
    authorName: 'Carlos Rodriguez',
    authorNationalityFlag: '🇲🇽',
    authorProfileImage: 'https://cdn.pixabay.com/photo/2018/04/27/03/50/portrait-3353699_960_720.jpg',
    type: 'regular',
    content: 'Amazing grilled steak dinner in Boracay! This beachside restaurant serves the most perfectly cooked ribeye with local herbs and spices. The combination of great food and ocean views is unbeatable! 🥩🔥',
    images: ['https://images.pexels.com/photos/65175/pexels-photo-65175.jpeg?auto=compress&cs=tinysrgb&w=800'],
    location: 'Boracay, Aklan',
    activity: 'food',
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
      'https://images.pexels.com/photos/1320686/pexels-photo-1320686.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/460621/pexels-photo-460621.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/386009/pexels-photo-386009.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    location: 'Banaue, Ifugao',
    activity: 'heritage',
    timestamp: '2025-01-08T14:20:00Z',
    timeAgo: '1d',
    likes: 89,
    comments: 12
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
      'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1007427/pexels-photo-1007427.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    lucidData: {
      duration: 1,
      durationMode: 'days',
      dayPhotos: {
        0: [
          'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1007427/pexels-photo-1007427.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg?auto=compress&cs=tinysrgb&w=800'
        ]
      }
    },
    location: 'Kyoto, Japan',
    activity: 'cultural',
    timestamp: '2025-01-06T12:30:00Z',
    timeAgo: '3d',
    likes: 267,
    comments: 19
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
    images: [
      'https://images.pexels.com/photos/2422265/pexels-photo-2422265.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1660995/pexels-photo-1660995.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
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
    images: ['https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=800'],
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
      'https://images.pexels.com/photos/1450372/pexels-photo-1450372.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2356045/pexels-photo-2356045.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg?auto=compress&cs=tinysrgb&w=800'
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
    images: ['https://images.pexels.com/photos/2422497/pexels-photo-2422497.jpeg?auto=compress&cs=tinysrgb&w=800'],
    location: 'Danao, Bohol',
    activity: 'thrill',
    timestamp: '2025-01-03T14:10:00Z',
    timeAgo: '6d',
    likes: 178,
    comments: 25
  },

  // === THIRD CAMACHO'S POSTS ===
  
  // Aquatics - Regular Post (Third's first aquatics post)
  {
    id: '13',
    authorId: 'current_user',
    authorName: 'Third Camacho',
    authorNationalityFlag: '🇵🇭',
    authorProfileImage: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=400',
    type: 'regular',
    content: 'First time diving in Batangas and it was absolutely incredible! The coral reefs here are pristine and the marine life is so diverse. Saw my first sea turtle today! 🐢🤿',
    images: [
      'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1366630/pexels-photo-1366630.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    device: 'iPhone 16 ProMax',
    location: 'Anilao, Batangas',
    activity: 'aquatics',
    timestamp: '2025-01-02T14:30:00Z',
    timeAgo: '7d',
    likes: 156,
    comments: 28
  },

  // Aquatics - Lucid Post (Third's second aquatics post)
  {
    id: '14',
    authorId: 'current_user',
    authorName: 'Third Camacho',
    authorNationalityFlag: '🇵🇭',
    authorProfileImage: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=400',
    type: 'lucid',
    title: 'Siargao Surfing',
    content: 'Cloud 9 delivered everything I dreamed of and more! From sunrise sessions to late afternoon barrels, this place is pure surfing paradise. The local surf community here is so welcoming! 🏄‍♂️🌊',
    images: [
      'https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2422265/pexels-photo-2422265.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1660995/pexels-photo-1660995.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1450372/pexels-photo-1450372.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2356045/pexels-photo-2356045.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2422497/pexels-photo-2422497.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    location: 'Cloud 9, Siargao',
    activity: 'aquatics',
    timestamp: '2025-01-01T16:45:00Z',
    timeAgo: '8d',
    likes: 342,
    comments: 67
  },

  // Thrill - Regular Post (Third's second thrill post)
  {
    id: '15',
    authorId: 'current_user',
    authorName: 'Third Camacho',
    authorNationalityFlag: '🇵🇭',
    authorProfileImage: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=400',
    type: 'regular',
    content: 'Canyoneering in Kawasan Falls was the perfect mix of adrenaline and natural beauty! Jumping off cliffs into crystal blue pools never gets old. My heart is still racing! ⚡🏞️',
    images: [
      'https://images.pexels.com/photos/346529/pexels-photo-346529.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    device: 'iPhone 16 ProMax',
    location: 'Kawasan Falls, Cebu',
    activity: 'thrill',
    timestamp: '2024-12-30T11:20:00Z',
    timeAgo: '10d',
    likes: 289,
    comments: 43
  },

  // Wellness - Regular Post (Third's second wellness post)
  {
    id: '16',
    authorId: 'current_user',
    authorName: 'Third Camacho',
    authorNationalityFlag: '🇵🇭',
    authorProfileImage: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=800',
    type: 'regular',
    content: 'Morning meditation at Taal Lake was exactly what my soul needed. The mist rising from the water and the complete silence... pure tranquility. Starting 2025 with mindfulness! 🧘‍♂️✨',
    images: ['https://images.pexels.com/photos/1624497/pexels-photo-1624497.jpeg?auto=compress&cs=tinysrgb&w=800'],
    location: 'Taal Lake, Batangas',
    activity: 'wellness',
    timestamp: '2024-12-29T06:15:00Z',
    timeAgo: '11d',
    likes: 198,
    comments: 31
  },

  // Heritage - Lucid Post (Third's second heritage post)
  {
    id: '17',
    authorId: 'current_user',
    authorName: 'Third Camacho',
    authorNationalityFlag: '🇵🇭',
    authorProfileImage: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=400',
    type: 'lucid',
    title: 'Vigan Heritage',
    content: 'Walking through Vigan feels like time travel! Every cobblestone street tells a story of our Spanish colonial past. The preserved architecture is absolutely stunning and makes me so proud of our heritage! 🏛️🇵🇭',
    images: [
      'https://images.pexels.com/photos/1366909/pexels-photo-1366909.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/460621/pexels-photo-460621.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/386009/pexels-photo-386009.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1007427/pexels-photo-1007427.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1366910/pexels-photo-1366910.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1366911/pexels-photo-1366911.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    location: 'Vigan, Ilocos Sur',
    activity: 'heritage',
    timestamp: '2024-12-28T15:30:00Z',
    timeAgo: '12d',
    likes: 445,
    comments: 89
  },

  // Cultural - Regular Post (Third's second cultural post)
  {
    id: '18',
    authorId: 'current_user',
    authorName: 'Third Camacho',
    authorNationalityFlag: '🇵🇭',
    authorProfileImage: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=400',
    type: 'regular',
    content: 'Sinulog Festival was an explosion of colors, music, and pure Filipino joy! Dancing in the streets with thousands of people celebrating our culture - this is what community feels like! 🎭🎉',
    images: [
      'https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1612461/pexels-photo-1612461.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    device: 'iPhone 16 ProMax',
    location: 'Cebu City, Cebu',
    activity: 'cultural',
    timestamp: '2024-12-27T18:45:00Z',
    timeAgo: '13d',
    likes: 523,
    comments: 102
  },

  // === 11 NEW MOCK USERS - ONE POST PER ACTIVITY CATEGORY ===

  // Aquatics - Regular Post (UNDERWATER DIVING)
  {
    id: '19',
    authorId: 'user1001',
    authorName: 'Marina Santos',
    authorNationalityFlag: '🇵🇭',
    authorProfileImage: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400',
    type: 'regular',
    content: 'Freediving in Apo Island was absolutely magical! Swimming alongside sea turtles in their natural habitat - this is what pure freedom feels like. The underwater world here is pristine! 🐢💙',
    images: ['https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=800'],
    device: 'Samsung Galaxy S24',
    location: 'Apo Island, Negros Oriental',
    activity: 'aquatics',
    timestamp: '2024-12-26T09:15:00Z',
    timeAgo: '14d',
    likes: 278,
    comments: 45
  },

  // Outdoors - Regular Post (SNOWY MOUNTAINS)
  {
    id: '20',
    authorId: 'user1002',
    authorName: 'Trek Mendoza',
    authorNationalityFlag: '🇵🇭',
    authorProfileImage: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=400',
    type: 'regular',
    content: 'Mount Apo summit achieved! 3 days of challenging trails but the view from the Philippines\' highest peak is absolutely worth every step. Feeling on top of the world! 🏔️⛰️',
    images: [
      'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1366957/pexels-photo-1366957.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    device: 'iPhone 15 Pro',
    location: 'Mount Apo, Davao',
    activity: 'outdoors',
    timestamp: '2024-12-25T16:30:00Z',
    timeAgo: '15d',
    likes: 423,
    comments: 78
  },

  // City - Regular Post (SCANDINAVIAN CITY)
  {
    id: '21',
    authorId: 'user1003',
    authorName: 'Urban Explorer',
    authorNationalityFlag: '🇸🇬',
    authorProfileImage: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
    type: 'regular',
    content: 'Singapore\'s skyline never fails to amaze me! The blend of futuristic architecture and lush greenery makes this city truly unique. Garden City vibes! 🏙️🌿',
    images: [
      'https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1388031/pexels-photo-1388031.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1388032/pexels-photo-1388032.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    device: 'Google Pixel 8',
    location: 'Marina Bay, Singapore',
    activity: 'city',
    timestamp: '2024-12-24T20:45:00Z',
    timeAgo: '16d',
    likes: 356,
    comments: 52
  },

  // Food - Regular Post (ASIAN CUISINE)
  {
    id: '22',
    authorId: 'user1004',
    authorName: 'Chef Isabella',
    authorNationalityFlag: '🇮🇹',
    authorProfileImage: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    type: 'regular',
    content: 'Discovering authentic ramen in Tokyo\'s hidden alleyways! This tiny shop serves the most incredible tonkotsu broth I\'ve ever tasted. Food is truly the universal language! 🍜❤️',
    images: [
      'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    device: 'iPhone 14 Pro Max',
    location: 'Shibuya, Tokyo',
    activity: 'food',
    timestamp: '2024-12-23T19:20:00Z',
    timeAgo: '17d',
    likes: 467,
    comments: 89
  },

  // Stays - Regular Post (DESERT GLAMPING)
  {
    id: '23',
    authorId: 'user1005',
    authorName: 'Luxury Traveler',
    authorNationalityFlag: '🇦🇪',
    authorProfileImage: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400',
    type: 'regular',
    content: 'Waking up to this view in the Maldives! Our overwater villa is pure paradise - crystal clear waters as far as the eye can see. Sometimes you just need to treat yourself! 🏝️✨',
    images: ['https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=800'],
    location: 'Maldives',
    activity: 'stays',
    timestamp: '2024-12-22T07:30:00Z',
    timeAgo: '18d',
    likes: 612,
    comments: 94
  },

  // Heritage - Regular Post (AFRICAN WILDLIFE)
  {
    id: '24',
    authorId: 'user1006',
    authorName: 'History Buff',
    authorNationalityFlag: '🇬🇷',
    authorProfileImage: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    type: 'regular',
    content: 'Standing before the Parthenon in Athens - 2,500 years of history right before my eyes! The ancient Greeks\' architectural mastery still leaves me speechless. History comes alive here! 🏛️🇬🇷',
    images: [
      'https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1320686/pexels-photo-1320686.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1320687/pexels-photo-1320687.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    device: 'Canon EOS R5',
    location: 'Acropolis, Athens',
    activity: 'heritage',
    timestamp: '2024-12-21T14:15:00Z',
    timeAgo: '19d',
    likes: 389,
    comments: 67
  },

  // Wellness - Regular Post (FOREST RETREAT)
  {
    id: '25',
    authorId: 'user1007',
    authorName: 'Zen Seeker',
    authorNationalityFlag: '🇮🇳',
    authorProfileImage: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=400',
    type: 'regular',
    content: 'Sunrise yoga in Rishikesh, the yoga capital of the world! The Ganges flowing beside me and the Himalayas in the distance - this is where inner peace truly begins. Namaste! 🧘‍♀️🕉️',
    images: ['https://images.pexels.com/photos/1366630/pexels-photo-1366630.jpeg?auto=compress&cs=tinysrgb&w=800'],
    location: 'Rishikesh, India',
    activity: 'wellness',
    timestamp: '2024-12-20T06:45:00Z',
    timeAgo: '20d',
    likes: 445,
    comments: 73
  },

  // Amusements - Regular Post (EXTREME SPORTS)
  {
    id: '26',
    authorId: 'user1008',
    authorName: 'Fun Seeker',
    authorNationalityFlag: '🇺🇸',
    authorProfileImage: 'https://images.pexels.com/photos/1024311/pexels-photo-1024311.jpeg?auto=compress&cs=tinysrgb&w=400',
    type: 'regular',
    content: 'Disneyland magic never gets old! Riding Space Mountain and feeling like a kid again. The happiest place on earth really lives up to its name! 🎢✨',
    images: [
      'https://images.pexels.com/photos/1612461/pexels-photo-1612461.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1612462/pexels-photo-1612462.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    device: 'iPhone 15',
    location: 'Disneyland, California',
    activity: 'amusements',
    timestamp: '2024-12-19T15:30:00Z',
    timeAgo: '21d',
    likes: 567,
    comments: 128
  },

  // Cultural - Regular Post (ARCTIC LANDSCAPE)
  {
    id: '27',
    authorId: 'user1009',
    authorName: 'Culture Lover',
    authorNationalityFlag: '🇯🇵',
    authorProfileImage: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400',
    type: 'regular',
    content: 'Tea ceremony in Kyoto was a beautiful lesson in mindfulness and tradition. Every movement has meaning, every moment is sacred. Japanese culture is truly an art form! 🍵🌸',
    images: [
      'https://images.pexels.com/photos/1366909/pexels-photo-1366909.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1366910/pexels-photo-1366910.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1366911/pexels-photo-1366911.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    device: 'Sony A7IV',
    location: 'Kyoto, Japan',
    activity: 'cultural',
    timestamp: '2024-12-18T11:20:00Z',
    timeAgo: '22d',
    likes: 334,
    comments: 56
  },

  // Special Experiences - Regular Post (VOLCANIC LANDSCAPE)
  {
    id: '28',
    authorId: 'user1010',
    authorName: 'Adventure Soul',
    authorNationalityFlag: '🇮🇸',
    authorProfileImage: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=400',
    type: 'regular',
    content: 'Swimming in the Blue Lagoon under the Northern Lights! This geothermal spa in Iceland is pure magic - warm waters, otherworldly landscapes, and dancing auroras above. Unforgettable! 🌌♨️',
    images: [
      'https://images.pexels.com/photos/1624497/pexels-photo-1624497.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1624498/pexels-photo-1624498.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    location: 'Blue Lagoon, Iceland',
    activity: 'special',
    timestamp: '2024-12-17T22:00:00Z',
    timeAgo: '23d',
    likes: 789,
    comments: 145
  },

  // Thrill - Regular Post (SKYDIVING)
  {
    id: '29',
    authorId: 'user1011',
    authorName: 'Adrenaline Junkie',
    authorNationalityFlag: '🇳🇿',
    authorProfileImage: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
    type: 'regular',
    content: 'Bungee jumping off Kawarau Gorge Bridge in Queenstown! 43 meters of pure adrenaline and the most incredible rush. New Zealand really is the adventure capital of the world! 🪂⚡',
    images: ['https://images.pexels.com/photos/1612459/pexels-photo-1612459.jpeg?auto=compress&cs=tinysrgb&w=800'],
    device: 'GoPro Hero 12',
    location: 'Queenstown, New Zealand',
    activity: 'thrill',
    timestamp: '2024-12-16T13:45:00Z',
    timeAgo: '24d',
    likes: 623,
    comments: 97
  }


];

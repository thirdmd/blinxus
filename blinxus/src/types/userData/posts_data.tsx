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
  {
    id: '1',
    authorId: 'user123',
    authorName: 'Jessica Martinez',
    authorNationalityFlag: '🇪🇸',
    type: 'regular',
    content: 'Found paradise today! The crystal clear waters are absolutely breathtaking. The island hopping tour took us to secret lagoons and hidden beaches.',
    images: ['https://picsum.photos/400/600?random=1'],
    device: 'iPhone 16 ProMax',
    location: 'El Nido, Palawan',
    activity: 'aquatics',
    timestamp: '2025-01-09T08:30:00Z',
    timeAgo: '2h',
    likes: 438,
    comments: 32
  },
  {
    id: '2',
    authorId: 'user456',
    authorName: 'Miguel Santos',
    authorNationalityFlag: '🇧🇷',
    type: 'regular',
    content: 'Sunrise at the sea of clouds! Worth every step of the challenging trek. Mount Pulag never disappoints with its breathtaking views.',
    images: ['https://picsum.photos/400/600?random=2'],
    device: 'Samsung Galaxy S24 Ultra',
    location: 'Mount Pulag, Benguet',
    activity: 'outdoors',
    timestamp: '2025-01-09T05:15:00Z',
    timeAgo: '5h',
    likes: 291,
    comments: 47
  },
  {
    id: '3',
    authorId: 'user789',
    authorName: 'Maria Santos',
    authorNationalityFlag: '🇰🇷',
    type: 'regular',
    content: 'Amazing street food tour in Binondo! The dumplings and noodles were incredible. This place has so much history and flavor. Walking through the narrow streets, I discovered authentic Chinese restaurants that have been serving families for generations. The pork buns were steaming hot and the noodle soup was perfectly seasoned with traditional spices and herbs.',
    location: 'Binondo, Manila',
    // NO activity - this will show colorless location pill
    timestamp: '2025-01-09T03:00:00Z',
    timeAgo: '7h',
    likes: 156,
    comments: 23
  },
  {
    id: '4',
    authorId: 'user101',
    authorName: 'Carlos Rodriguez',
    authorNationalityFlag: '🇲🇽',
    type: 'regular',
    content: 'Beach vibes and sunset magic! Perfect end to an amazing day exploring this beautiful island.',
    images: ['https://picsum.photos/400/600?random=3'],
    location: 'Boracay, Aklan',
    activity: 'wellness',
    timestamp: '2025-01-08T18:30:00Z',
    timeAgo: '1d',
    likes: 203,
    comments: 15
  },
  {
    id: '5',
    authorId: 'user202',
    authorName: 'Alfonso Rivera',
    authorNationalityFlag: '🇵🇭',
    type: 'regular',
    content: 'Just finished an incredible hiking adventure through the rice terraces of Banaue. The ancient engineering of these terraces is absolutely mind-blowing and the views are spectacular. Every step revealed new perspectives of this UNESCO World Heritage site. The local Ifugao people shared stories about their ancestors who built these terraces over two thousand years ago using only hand tools.',
    location: 'Banaue, Ifugao',
    activity: 'outdoors',
    timestamp: '2025-01-08T14:20:00Z',
    timeAgo: '1d',
    likes: 89,
    comments: 12
  }
];

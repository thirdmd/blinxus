export interface User {
  id: string;
  username: string;
  displayName: string;
  profileImage?: string;
  nationalityFlag?: string;
  country?: string;
  bio?: string;
  followers?: number;
  following?: number;
  languages?: string[];
  interests?: Array<{ icon: string; label: string; }>;
  food?: Array<{ icon: string; label: string; }>;
  isVerified?: boolean;
  memberSince?: string;
  age?: number;
}

// Centralized users database - single source of truth
export const usersDatabase: Record<string, User> = {
  // Current user
  'current_user': {
    id: 'current_user',
    username: 'thirdcamachomd',
    displayName: 'Third Camacho',
    profileImage: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=400',
    nationalityFlag: '🇵🇭',
    country: 'Philippines',
    bio: 'water boi 🏀',
    followers: 2,
    following: 2,
    languages: ['English', 'Filipino'],
    interests: [
      { icon: '🏖️', label: 'Beach' },
      { icon: '🏔️', label: 'Mountains' },
      { icon: '🏀', label: 'Basketball' },
    ],
    food: [
      { icon: '🥩', label: 'Steak' },
      { icon: '🍔', label: 'Burger' },
      { icon: '🍦', label: 'Ice Cream' },
    ],
    age: 25,
    isVerified: true,
    memberSince: '2023-01-15'
  },
  
  // Other users
  'user123': {
    id: 'user123',
    username: '@aria_n',
    displayName: 'Aria Nakamura',
    profileImage: 'https://cdn.pixabay.com/photo/2016/11/29/13/14/attractive-1869761_960_720.jpg',
    nationalityFlag: '🇯🇵',
    country: 'Japan',
    isVerified: true,
    memberSince: '2022-08-10'
  },
  
  'user456': {
    id: 'user456',
    username: '@miguel_br',
    displayName: 'Miguel Santos',
    profileImage: 'https://cdn.pixabay.com/photo/2016/11/21/12/42/beard-1845166_960_720.jpg',
    nationalityFlag: '🇧🇷',
    country: 'Brazil',
    isVerified: false,
    memberSince: '2023-02-15'
  },
  
  'user101': {
    id: 'user101',
    username: '@carlos_mx',
    displayName: 'Carlos Rodriguez',
    profileImage: 'https://cdn.pixabay.com/photo/2018/04/27/03/50/portrait-3353699_960_720.jpg',
    nationalityFlag: '🇲🇽',
    country: 'Mexico',
    isVerified: true,
    memberSince: '2022-12-05'
  },
  
  'user202': {
    id: 'user202',
    username: '@alfonso_ph',
    displayName: 'Alfonso Rivera',
    profileImage: 'https://cdn.pixabay.com/photo/2016/11/18/19/07/happy-1836445_960_720.jpg',
    nationalityFlag: '🇵🇭',
    country: 'Philippines',
    isVerified: false,
    memberSince: '2023-05-20'
  },
  
  'user303': {
    id: 'user303',
    username: '@isabella_c',
    displayName: 'Isabella Chen',
    profileImage: 'https://cdn.pixabay.com/photo/2017/05/03/21/13/girl-2282612_960_720.jpg',
    nationalityFlag: '🇨🇳',
    country: 'China',
    isVerified: true,
    memberSince: '2022-09-30'
  },
  
  'user404': {
    id: 'user404',
    username: '@emma_uk',
    displayName: 'Emma Thompson',
    profileImage: 'https://cdn.pixabay.com/photo/2018/01/21/14/16/woman-3096664_960_720.jpg',
    nationalityFlag: '🇬🇧',
    country: 'United Kingdom',
    isVerified: false,
    memberSince: '2023-01-08'
  },
  
  'user505': {
    id: 'user505',
    username: '@marco_it',
    displayName: 'Marco Rossi',
    profileImage: 'https://cdn.pixabay.com/photo/2016/11/21/14/53/man-1845814_960_720.jpg',
    nationalityFlag: '🇮🇹',
    country: 'Italy',
    isVerified: true,
    memberSince: '2022-07-12'
  },
  
  'user606': {
    id: 'user606',
    username: '@sophie_fr',
    displayName: 'Sophie Martin',
    profileImage: 'https://cdn.pixabay.com/photo/2017/08/01/08/29/woman-2563491_960_720.jpg',
    nationalityFlag: '🇫🇷',
    country: 'France',
    isVerified: true,
    memberSince: '2022-11-25'
  },
  
  'user707': {
    id: 'user707',
    username: '@jake_us',
    displayName: 'Jake Wilson',
    profileImage: 'https://cdn.pixabay.com/photo/2015/07/20/12/57/ambassador-852766_960_720.jpg',
    nationalityFlag: '🇺🇸',
    country: 'United States',
    isVerified: false,
    memberSince: '2023-03-18'
  },
  
  'user808': {
    id: 'user808',
    username: '@yuki_jp',
    displayName: 'Yuki Tanaka',
    profileImage: 'https://cdn.pixabay.com/photo/2016/11/29/20/22/girl-1871104_960_720.jpg',
    nationalityFlag: '🇯🇵',
    country: 'Japan',
    isVerified: true,
    memberSince: '2022-06-14'
  },
  
  'user909': {
    id: 'user909',
    username: '@alex_co',
    displayName: 'Alex Rodriguez',
    profileImage: 'https://cdn.pixabay.com/photo/2018/02/16/14/38/portrait-3157821_960_720.jpg',
    nationalityFlag: '🇨🇴',
    country: 'Colombia',
    isVerified: false,
    memberSince: '2023-04-22'
  }
};

// Helper functions for user operations
export const getUserById = (userId: string): User | null => {
  return usersDatabase[userId] || null;
};

export const getCurrentUser = (): User => {
  return usersDatabase['current_user'];
};

export const updateUserProfile = (userId: string, updates: Partial<User>): boolean => {
  if (usersDatabase[userId]) {
    usersDatabase[userId] = { ...usersDatabase[userId], ...updates };
    return true;
  }
  return false;
};

// For backward compatibility with existing profile_data.tsx
export const profileData = getCurrentUser(); 
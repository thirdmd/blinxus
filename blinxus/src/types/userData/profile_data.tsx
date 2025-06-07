// src/types/userData/profile_data.tsx

export interface Interest {
    icon: string;
    label: string;
  }
  
  export interface FoodItem {
    icon: string;
    label: string;
  }
  
  export interface ProfileDataType {
    name: string;
    age: number;
    nationalityFlag: string;
    country: string;
    username: string;
    bio: string;
    followers: number;
    following: number;
    profileImage: string;
    languages: string[];
    interests: Interest[];
    food: FoodItem[];
  }
  
  export const profileData: ProfileDataType = {
    name: 'Third Camacho',
    age: 25,
    nationalityFlag: '🇵🇭',      // Philippine flag
    country: 'Philippines',
    username: '@3rd',
    bio: 'water boi 🏀',
    followers: 2,
    following: 2,
    profileImage: 'https://via.placeholder.com/300x400',
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
  };
  
  export interface PostType {
    id: number;
    image: string;
    location: string;
  }
  
  export const posts: PostType[] = [
    { id: 1, image: 'https://via.placeholder.com/150', location: 'Boracay Beach' },
    { id: 2, image: 'https://via.placeholder.com/150', location: 'Manila Sunset' },
    { id: 3, image: 'https://via.placeholder.com/150', location: 'Palawan Paradise' },
    { id: 4, image: 'https://via.placeholder.com/150', location: 'Office Vibes' },
    { id: 5, image: 'https://via.placeholder.com/150', location: 'Team Meeting' },
    { id: 6, image: 'https://via.placeholder.com/150', location: 'Weekend Trip' },
  ];
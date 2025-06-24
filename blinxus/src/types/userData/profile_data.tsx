// src/types/userData/profile_data.tsx
// DEPRECATED: Use users_data.tsx for new implementations
// This file is kept for backward compatibility

import { getCurrentUser } from './users_data';

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
  
  // Get current user data from centralized database
  const currentUser = getCurrentUser();
  
  export const profileData: ProfileDataType = {
    name: currentUser.displayName,
    age: currentUser.age || 25,
    nationalityFlag: currentUser.nationalityFlag || '🇵🇭',
    country: currentUser.country || 'Philippines',
    username: currentUser.username,
    bio: currentUser.bio || 'water boi 🏀',
    followers: currentUser.followers || 2,
    following: currentUser.following || 2,
    profileImage: currentUser.profileImage || '',
    languages: currentUser.languages || ['English', 'Filipino'],
    interests: currentUser.interests || [
      { icon: '🏖️', label: 'Beach' },
      { icon: '🏔️', label: 'Mountains' },
      { icon: '🏀', label: 'Basketball' },
    ],
    food: currentUser.food || [
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
    { id: 1, image: 'https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=800', location: 'Boracay Beach' },
    { id: 2, image: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=800', location: 'Manila Sunset' },
    { id: 3, image: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=800', location: 'Palawan Paradise' },
    { id: 4, image: 'https://images.pexels.com/photos/346529/pexels-photo-346529.jpeg?auto=compress&cs=tinysrgb&w=800', location: 'Rice Terraces' },
    { id: 5, image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800', location: 'Island Hopping' },
    { id: 6, image: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=800', location: 'Heritage Site' },
  ];
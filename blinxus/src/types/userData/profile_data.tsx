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
    profileImage: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=400',
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
    { id: 1, image: 'https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=800', location: 'Boracay Beach' },
    { id: 2, image: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=800', location: 'Manila Sunset' },
    { id: 3, image: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=800', location: 'Palawan Paradise' },
    { id: 4, image: 'https://images.pexels.com/photos/346529/pexels-photo-346529.jpeg?auto=compress&cs=tinysrgb&w=800', location: 'Rice Terraces' },
    { id: 5, image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800', location: 'Island Hopping' },
    { id: 6, image: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=800', location: 'Heritage Site' },
  ];
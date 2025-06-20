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
    { id: 1, image: 'https://cdn.pixabay.com/photo/2017/12/16/22/22/beach-3023488_960_720.jpg', location: 'Boracay Beach' },
    { id: 2, image: 'https://cdn.pixabay.com/photo/2016/08/11/23/48/mountains-1587287_960_720.jpg', location: 'Manila Sunset' },
    { id: 3, image: 'https://cdn.pixabay.com/photo/2019/07/25/17/09/lagoon-4360964_960_720.jpg', location: 'Palawan Paradise' },
    { id: 4, image: 'https://cdn.pixabay.com/photo/2018/01/09/03/49/the-natural-scenery-3070808_960_720.jpg', location: 'Rice Terraces' },
    { id: 5, image: 'https://cdn.pixabay.com/photo/2018/08/14/13/23/ocean-3605547_960_720.jpg', location: 'Island Hopping' },
    { id: 6, image: 'https://cdn.pixabay.com/photo/2017/02/01/13/52/monument-2031308_960_720.jpg', location: 'Heritage Site' },
  ];
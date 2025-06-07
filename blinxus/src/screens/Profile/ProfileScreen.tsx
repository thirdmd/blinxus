import React, { useState } from 'react';
import ProfileStructure from '../../types/structures/profile_structure';
import { profileData, posts } from '../../types/userData/profile_data';

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState<'feed' | 'lucids' | 'posts'>('feed');

  // Debug logging
  console.log('ProfileScreen - profileData:', profileData);
  console.log('ProfileScreen - posts:', posts);

  // Temporary hardcoded data for testing
  const testProfileData = {
    name: 'Third Camacho',
    age: 25,
    nationalityFlag: '🇵🇭',
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

  const testPosts = [
    { id: 1, image: 'https://via.placeholder.com/150', location: 'Boracay Beach' },
    { id: 2, image: 'https://via.placeholder.com/150', location: 'Manila Sunset' },
    { id: 3, image: 'https://via.placeholder.com/150', location: 'Palawan Paradise' },
    { id: 4, image: 'https://via.placeholder.com/150', location: 'Office Vibes' },
    { id: 5, image: 'https://via.placeholder.com/150', location: 'Team Meeting' },
    { id: 6, image: 'https://via.placeholder.com/150', location: 'Weekend Trip' },
  ];

  return (
    <ProfileStructure
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      profileData={profileData || testProfileData}
      posts={posts || testPosts}
    />
  );
} 
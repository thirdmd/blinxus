import React, { useState } from 'react';
import ProfileStructure from '../../types/structures/profile_structure';
import { profileData } from '../../types/userData/profile_data';
import { usePosts } from '../../store/PostsContext';

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState<'feed' | 'lucids' | 'posts'>('feed');
  const { posts } = usePosts();

  // Debug logging
  console.log('ProfileScreen - profileData:', profileData);
  console.log('ProfileScreen - posts:', posts);

  return (
    <ProfileStructure
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      profileData={profileData}
      posts={posts}
    />
  );
} 
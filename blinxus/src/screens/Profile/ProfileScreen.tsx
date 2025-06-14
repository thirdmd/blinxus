import React, { useState } from 'react';
import ProfileStructure from '../../types/structures/profile_structure';
import { profileData } from '../../types/userData/profile_data';
import { usePosts } from '../../store/PostsContext';
import ProfileSettings from '../Settings/profile_settings';

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState<'feed' | 'lucids' | 'posts'>('feed');
  const [showSettings, setShowSettings] = useState(false);
  const { posts } = usePosts();

  // Debug logging
  console.log('ProfileScreen - profileData:', profileData);
  console.log('ProfileScreen - posts:', posts);

  // Show settings screen if showSettings is true
  if (showSettings) {
    return <ProfileSettings onBackPress={() => setShowSettings(false)} />;
  }

  return (
    <ProfileStructure
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      profileData={profileData}
      posts={posts}
      onSettingsPress={() => setShowSettings(true)}
    />
  );
} 
import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import ProfileStructure from '../../types/structures/profile_structure';
import { profileData } from '../../types/userData/profile_data';
import { usePosts } from '../../store/PostsContext';
import ProfileSettings from '../Settings/profile_settings';
import { useScrollContext } from '../../contexts/ScrollContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

export interface ProfileScreenRef {
  resetToTop: () => void;
}

const ProfileScreen = forwardRef<ProfileScreenRef>((props, ref) => {
  const [showSettings, setShowSettings] = useState(false);
  const { posts } = usePosts();
  const { profileScrollRef } = useScrollContext();
  const navigation = useNavigation();
  
  // Create a ref to hold the reset function from ProfileStructure
  const profileStructureResetRef = useRef<(() => void) | null>(null);
  
  // Track if this is a fresh navigation (from post click)
  const isNavigatingFromPost = useRef(false);
  
  // Create a reset function that can be called externally
  const resetToTop = () => {
    // Reset settings state
    setShowSettings(false);
    // Call ProfileStructure's reset function if available
    if (profileStructureResetRef.current) {
      profileStructureResetRef.current();
    } else {
      // Fallback: reset scroll manually
      setTimeout(() => {
        if (profileScrollRef?.current) {
          profileScrollRef.current.scrollTo({ y: 0, animated: true });
        }
      }, 100);
    }
  };

  // Expose reset function to parent via ref
  useImperativeHandle(ref, () => ({
    resetToTop
  }));

  // Auto-reset to top when navigating to Profile from post
  useFocusEffect(
    React.useCallback(() => {
      // Always reset to top when Profile screen is focused
      // This ensures clicking profile names/pictures always goes to top
      resetToTop();
    }, [])
  );

  // Debug logging
  console.log('ProfileScreen - profileData:', profileData);
  console.log('ProfileScreen - posts:', posts);

  // Show settings screen if showSettings is true
  if (showSettings) {
    return <ProfileSettings onBackPress={() => setShowSettings(false)} />;
  }

  return (
    <ProfileStructure
      profileData={profileData}
      posts={posts}
      onSettingsPress={() => setShowSettings(true)}
      scrollRef={profileScrollRef}
      onResetToTop={profileStructureResetRef}
    />
  );
});

export default ProfileScreen; 
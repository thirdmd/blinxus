import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import ProfileStructure from '../../types/structures/profile_structure';
import { profileData } from '../../types/userData/profile_data';
import { usePosts } from '../../store/PostsContext';
import ProfileSettings from '../Settings/profile_settings';
import Library from './Library';
import { useScrollContext } from '../../contexts/ScrollContext';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';

export interface ProfileScreenRef {
  resetToTop: () => void;
}

const ProfileScreen = forwardRef<ProfileScreenRef>((props, ref) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'lucids' | 'posts'>('feed');
  const [showSettings, setShowSettings] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const { posts } = usePosts();
  const { profileScrollRef } = useScrollContext();
  const navigation = useNavigation();
  const route = useRoute();
  
  // Create a ref to hold the reset function from ProfileStructure
  const profileStructureResetRef = useRef<(() => void) | null>(null);
  
  // Track if this is a fresh navigation (from PostCard click)
  const isNavigatingFromPostCard = useRef(false);
  
  // Create a reset function that can be called externally
  const resetToTop = () => {
    // Reset settings state
    setShowSettings(false);
    // Call ProfileStructure's reset function if available
    if (profileStructureResetRef.current) {
      profileStructureResetRef.current();
    } else {
      // Fallback: reset states manually
      setActiveTab('feed');
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

  // Auto-reset to top when navigating to Profile from PostCard
  useFocusEffect(
    React.useCallback(() => {
      // Check if we should show Library (coming from LucidFullscreen)
      const params = route.params as any;
      if (params?.showLibrary) {
        setShowLibrary(true);
        // Clear the parameter to prevent it from persisting
        (navigation as any).setParams({ showLibrary: undefined });
      } else {
        // Always reset to top when Profile screen is focused normally
        // This ensures clicking profile names/pictures always goes to top
        resetToTop();
      }
    }, [route.params])
  );

  // Debug logging
  console.log('ProfileScreen - profileData:', profileData);
  console.log('ProfileScreen - posts:', posts);

  // Show library screen if showLibrary is true
  if (showLibrary) {
    return <Library onBackPress={() => setShowLibrary(false)} />;
  }

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
      scrollRef={profileScrollRef}
      onResetToTop={profileStructureResetRef}
    />
  );
});

export default ProfileScreen; 
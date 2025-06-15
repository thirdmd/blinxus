// src/types/structures/profile_structure.tsx

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { ProfileDataType } from '../userData/profile_data';
import { Post } from '../userData/posts_data';
import { mapPostToCardProps } from './posts_structure';
import PostCard from '../../components/PostCard';
import { useNavigation } from '@react-navigation/native';
import { Plus, Settings, Bookmark, ChevronLeft } from 'lucide-react-native';
import Library from '../../screens/Profile/Library';

const { width } = Dimensions.get('window');

interface Props {
  activeTab: 'feed' | 'lucids' | 'posts';
  setActiveTab: React.Dispatch<React.SetStateAction<'feed' | 'lucids' | 'posts'>>;
  profileData: ProfileDataType;
  posts: Post[];
  onSettingsPress: () => void;
  scrollRef?: React.RefObject<ScrollView | null>;
  onResetToTop?: React.MutableRefObject<(() => void) | null>;
}

export default function ProfileStructure({
  activeTab,
  setActiveTab,
  profileData,
  posts,
  onSettingsPress,
  scrollRef,
  onResetToTop,
}: Props) {
  const navigation = useNavigation();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedPostIndex, setSelectedPostIndex] = useState(0);
  const [showLibrary, setShowLibrary] = useState(false);
  const localScrollViewRef = useRef<ScrollView>(null);
  // Use the scrollRef from props (for double tap functionality) or fallback to local ref
  const scrollViewRef = scrollRef || localScrollViewRef;
  
  // Internal reset function that handles all ProfileStructure states
  const handleResetToTop = () => {
    // Reset all internal states
    setIsFullscreen(false);
    setShowLibrary(false);
    setActiveTab('feed');
    // Scroll to top after states are reset
    setTimeout(() => {
      if (scrollViewRef?.current) {
        scrollViewRef.current.scrollTo({ y: 0, animated: true });
      }
    }, 100);
  };
  
  // Expose the reset function to parent component
  React.useEffect(() => {
    if (onResetToTop) {
      // Replace the parent's reset function with our internal one
      onResetToTop.current = handleResetToTop;
    }
  }, [onResetToTop]);
  
  // Debug logging
  console.log('ProfileStructure - profileData received:', profileData);
  console.log('ProfileStructure - profileData.profileImage:', profileData?.profileImage);

  // Get filtered posts for current user with media (for Feed tab)
  const userMediaPosts = (posts || []).filter(post => 
    post.authorName === profileData?.name && 
    post.images && 
    post.images.length > 0
  );

  // Better social media icon components
  const FacebookIcon = () => (
    <View className="w-8 h-8 bg-blue-600 rounded-lg items-center justify-center">
      <Text className="text-white text-lg font-bold">f</Text>
    </View>
  );

  const InstagramIcon = () => (
    <View className="w-8 h-8 rounded-lg items-center justify-center relative" style={{ backgroundColor: '#E1306C' }}>
      {/* Instagram camera outline - rounded square like the real logo */}
      <View className="w-5 h-5 rounded border-2 border-white items-center justify-center">
        {/* Camera lens - circle */}
        <View className="w-2.5 h-2.5 rounded-full border-2 border-white" />
      </View>
      {/* Camera flash - small dot in top right */}
      <View className="absolute top-1.5 right-1.5 w-1 h-1 rounded-full bg-white" />
    </View>
  );

  const YouTubeIcon = () => (
    <View className="w-8 h-8 bg-red-600 rounded-lg items-center justify-center">
      <View 
        style={{
          width: 0,
          height: 0,
          borderLeftWidth: 6,
          borderRightWidth: 0,
          borderTopWidth: 4,
          borderBottomWidth: 4,
          borderLeftColor: '#FFFFFF',
          borderRightColor: 'transparent',
          borderTopColor: 'transparent',
          borderBottomColor: 'transparent',
          marginLeft: 2,
        }}
      />
    </View>
  );

  const TikTokIcon = () => {
    // Helper to draw the musical note (stem + rounded hook)
    const Note = ({ color, offsetX, offsetY }: { color: string; offsetX: number; offsetY: number }) => (
      <View style={{ position: 'absolute', left: 10 + offsetX, top: 6 + offsetY }}>
        {/* Stem */}
        <View style={{ width: 3, height: 16, backgroundColor: color, borderRadius: 1.5 }} />
        {/* Hook */}
        <View style={{
          width: 10,
          height: 10,
          borderWidth: 3,
          borderColor: color,
          borderLeftColor: 'transparent',
          borderBottomColor: 'transparent',
          borderRadius: 16,
          position: 'absolute',
          left: 3,
          top: 2,
        }} />
      </View>
    );

    return (
      <View className="w-8 h-8 bg-black rounded-lg items-center justify-center relative" style={{ overflow: 'hidden' }}>
        {/* Cyan shadow */}
        <Note color="#25F4EE" offsetX={-1.5} offsetY={-1.5} />
        {/* Pink shadow */}
        <Note color="#FE2C55" offsetX={1.5} offsetY={1.5} />
        {/* Main white note */}
        <Note color="#FFFFFF" offsetX={0} offsetY={0} />
      </View>
    );
  };

  // Show library screen if showLibrary is true
  if (showLibrary) {
    return <Library onBackPress={() => setShowLibrary(false)} />;
  }

  // If in fullscreen mode, show fullscreen view
  if (isFullscreen && activeTab === 'feed') {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        
        {/* Back Button Header */}
        <View className="px-6 pt-4 pb-4">
          <TouchableOpacity
            onPress={() => setIsFullscreen(false)}
            className="w-10 h-10 -ml-2 items-center justify-center"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <ChevronLeft size={24} color="#000000" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Fullscreen Posts List */}
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {userMediaPosts.map((post) => {
            const postCardProps = mapPostToCardProps(post);
            return (
              <PostCard key={post.id} {...postCardProps} />
            );
          })}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView 
        ref={scrollViewRef}
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
          autoscrollToTopThreshold: 0,
        }}
      >
        {/* Header Bar - Minimal design */}
        <View className="flex-row justify-between items-center px-6 pt-4 pb-2">
          <Text className="text-xl font-normal text-black">
            {profileData?.username || '@username'}
          </Text>
          <View className="flex-row items-center">
            {/* Create Button - More Intuitive */}
            <TouchableOpacity
              onPress={() => navigation.navigate('CreatePost' as never)}
              className="w-10 h-10 items-center justify-center mr-3 bg-gray-100 rounded-xl border border-gray-200"
              activeOpacity={0.3}
            >
              <Plus size={18} color="#000000" strokeWidth={2} />
            </TouchableOpacity>
            
            {/* Library Button */}
            <TouchableOpacity
              onPress={() => setShowLibrary(true)}
              className="w-10 h-10 items-center justify-center mr-3"
              activeOpacity={0.3}
            >
              <Bookmark size={20} color="#000000" strokeWidth={1.8} />
            </TouchableOpacity>
            
            {/* Settings Button - More Appropriate */}
            <TouchableOpacity
              className="w-10 h-10 items-center justify-center"
              activeOpacity={0.3}
              onPress={onSettingsPress}
            >
              <Settings size={20} color="#000000" strokeWidth={1.8} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Picture - Clean square with rounded edges */}
        <View className="mt-12 items-center">
          <View className="w-48 h-48 rounded-2xl overflow-hidden bg-gray-200">
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=400&fit=crop' }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
        </View>

        {/* Name & Flag - Minimal typography */}
        <View className="mt-8 items-center">
          <Text className="text-2xl text-black">
            <Text className="font-medium">{profileData?.name || 'Loading'}</Text>
            <Text className="font-light"> {profileData?.nationalityFlag || '🏳️'}</Text>
          </Text>
        </View>

        {/* Location - Subtle */}
        <View className="mt-2 items-center">
          <Text className="text-sm text-gray-500 font-light">{profileData?.country || 'Location'}</Text>
        </View>

        {/* Social Media Icons - Ultra minimal */}
        <View className="mt-10 flex-row justify-center items-center">
          <TouchableOpacity className="mx-3" activeOpacity={0.3}>
            <FacebookIcon />
          </TouchableOpacity>
          
          <TouchableOpacity className="mx-3" activeOpacity={0.3}>
            <InstagramIcon />
          </TouchableOpacity>
          
          <TouchableOpacity className="mx-3" activeOpacity={0.3}>
            <YouTubeIcon />
          </TouchableOpacity>
          
          <TouchableOpacity className="mx-3" activeOpacity={0.3}>
            <TikTokIcon />
          </TouchableOpacity>
        </View>

        {/* Interests Section - Clean tags */}
        <View className="mt-16 px-6">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-lg font-normal text-black">Interests</Text>
            <TouchableOpacity activeOpacity={0.3}>
              <Text className="text-sm text-gray-400 font-light">Edit</Text>
            </TouchableOpacity>
          </View>
          
          <View className="flex-row flex-wrap gap-2">
            {(profileData?.interests || []).map((interest, index) => (
              <View
                key={index}
                className="border border-gray-200 px-4 py-2 rounded-full flex-row items-center"
              >
                <Text className="text-sm mr-2">{interest.icon}</Text>
                <Text className="text-sm font-light text-black">
                  {interest.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Tabs - Ultra minimal */}
        <View className="flex-row mt-6 px-6">
          <TouchableOpacity
            className="flex-1 py-4"
            onPress={() => setActiveTab('feed')}
            activeOpacity={0.3}
          >
            <Text
              className={`text-center text-base ${
                activeTab === 'feed' ? 'text-black font-medium' : 'text-gray-400 font-light'
              }`}
            >
              Feed
            </Text>
            {activeTab === 'feed' && (
              <View className="h-0.5 bg-black mt-4" />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 py-4"
            onPress={() => setActiveTab('lucids')}
            activeOpacity={0.3}
          >
            <Text
              className={`text-center text-base ${
                activeTab === 'lucids' ? 'text-black font-medium' : 'text-gray-400 font-light'
              }`}
            >
              Lucids
            </Text>
            {activeTab === 'lucids' && (
              <View className="h-0.5 bg-black mt-4" />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 py-4"
            onPress={() => setActiveTab('posts')}
            activeOpacity={0.3}
          >
            <Text
              className={`text-center text-base ${
                activeTab === 'posts' ? 'text-black font-medium' : 'text-gray-400 font-light'
              }`}
            >
              Posts
            </Text>
            {activeTab === 'posts' && (
              <View className="h-0.5 bg-black mt-4" />
            )}
          </TouchableOpacity>
        </View>

        {/* Content based on active tab */}
        {activeTab === 'posts' ? (
          // Posts Tab - Clean list view
          <View className="pt-8">
            {(() => {
              const userPosts = (posts || []).filter(post => post.authorName === profileData?.name);
              
              if (userPosts.length === 0) {
                // Empty state - minimal
                return (
                  <View className="flex-1 justify-center items-center py-20">
                    <Text className="text-sm text-gray-400 font-light">
                      All your Posts
                    </Text>
                  </View>
                );
              }
              
              return userPosts.map((post) => {
                const postCardProps = mapPostToCardProps(post);
                return (
                  <PostCard key={post.id} {...postCardProps} />
                );
              });
            })()}
          </View>
        ) : (
          // Feed and Lucids Tabs - Clean grid
          <View className="pt-8 px-6">
            {(() => {
              const filteredPosts = (posts || []).filter(post => {
                const isCurrentUser = post.authorName === profileData?.name;
                if (!isCurrentUser) return false;
                
                if (activeTab === 'feed') {
                  return post.images && post.images.length > 0;
                } else if (activeTab === 'lucids') {
                  return post.type === 'lucid' && post.images && post.images.length > 0;
                }
                return false;
              });

              if (filteredPosts.length === 0) {
                // Empty state - minimal
                let emptyMessage = '';
                if (activeTab === 'feed') {
                  emptyMessage = 'All your Media Uploads';
                } else if (activeTab === 'lucids') {
                  emptyMessage = 'Your Immersive Albums';
                }
                
                return (
                  <View className="flex-1 justify-center items-center py-20">
                    <Text className="text-sm text-gray-400 font-light">
                      {emptyMessage}
                    </Text>
                  </View>
                );
              }

              return (
                <View className="flex-row flex-wrap -mx-0.5 pb-8">
                  {filteredPosts.map((post) => (
                    <TouchableOpacity
                      key={post.id}
                      className="px-0.5 mb-1"
                      style={{ width: width / 3 - 16 }}
                      onPress={() => {
                        if (activeTab === 'feed') {
                          const postIndex = userMediaPosts.findIndex(p => p.id === post.id);
                          setSelectedPostIndex(postIndex >= 0 ? postIndex : 0);
                          setIsFullscreen(true);
                        }
                      }}
                      activeOpacity={0.8}
                    >
                      <Image
                        source={{ uri: post.images![0] }}
                        className="w-full aspect-square bg-gray-100"
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              );
            })()}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

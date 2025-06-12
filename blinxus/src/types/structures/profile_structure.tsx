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

const { width } = Dimensions.get('window');

interface Props {
  activeTab: 'feed' | 'lucids' | 'posts';
  setActiveTab: React.Dispatch<React.SetStateAction<'feed' | 'lucids' | 'posts'>>;
  profileData: ProfileDataType;
  posts: Post[];
}

export default function ProfileStructure({
  activeTab,
  setActiveTab,
  profileData,
  posts,
}: Props) {
  const navigation = useNavigation();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedPostIndex, setSelectedPostIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Debug logging
  console.log('ProfileStructure - profileData received:', profileData);
  console.log('ProfileStructure - profileData.profileImage:', profileData?.profileImage);

  // Get filtered posts for current user with media (for Feed tab)
  const userMediaPosts = (posts || []).filter(post => 
    post.authorName === profileData?.name && 
    post.images && 
    post.images.length > 0
  );

  // If in fullscreen mode, show fullscreen view
  if (isFullscreen && activeTab === 'feed') {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        
        {/* Back Button Header */}
        <View className="flex-row items-center justify-between px-4 py-3 bg-white">
          <TouchableOpacity
            onPress={() => setIsFullscreen(false)}
            className="flex-row items-center"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text className="text-gray-600 text-lg">←</Text>
          </TouchableOpacity>
          <View className="w-12" />
          <View className="w-12" />
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
        {/* Header Bar with Username and Buttons - Added create button */}
        <View className="flex-row justify-between items-center px-4 py-4 bg-white">
          <Text className="text-2xl font-semibold text-gray-900">
            {profileData?.username || '@username'}
          </Text>
          <View className="flex-row items-center space-x-4">
            {/* Create Button - Modern square design */}
            <TouchableOpacity
              onPress={() => navigation.navigate('CreatePost' as never)}
              className="w-11 h-11 rounded-2xl bg-blue-600 items-center justify-center"
              style={{
                shadowColor: '#0047AB',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.12,
                shadowRadius: 6,
                elevation: 3,
              }}
              activeOpacity={0.8}
            >
              <Text className="text-white text-lg font-semibold">+</Text>
            </TouchableOpacity>
            
            {/* Menu Button - Enlarged and modernized */}
            <TouchableOpacity
              className="w-11 h-11 items-center justify-center"
              activeOpacity={0.7}
            >
              <Text className="text-gray-700 text-3xl">☰</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Picture - Large Square with Smooth Edges */}
        <View className="mt-8 items-center">
          <View className="w-64 h-64 rounded-3xl overflow-hidden bg-gray-200">
            <Image
              source={{ uri: profileData?.profileImage || 'https://via.placeholder.com/300x300' }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
        </View>

        {/* Name (Bold), Age (Not Bold) & Nationality Flag */}
        <View className="mt-6 items-center">
          <Text className="text-3xl text-gray-900">
            <Text className="font-bold">{profileData?.name || 'Loading'}</Text>
            <Text className="font-normal">, {profileData?.age || '0'}</Text>
            <Text> {profileData?.nationalityFlag || '🏳️'}</Text>
          </Text>
        </View>

        {/* Country/Location */}
        <View className="mt-2 items-center">
          <Text className="text-base text-gray-600">{profileData?.country || 'Location'}</Text>
        </View>

        {/* Social Media Icons Row - Smooth Rounded Icons with Spacing */}
        <View className="mt-8 flex-row justify-center items-center">
          {/* Facebook */}
          <TouchableOpacity className="mx-2">
            <View className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center">
              <Text className="text-white text-xl font-bold">f</Text>
            </View>
          </TouchableOpacity>
          
          {/* Instagram */}
          <TouchableOpacity className="mx-2">
            <View className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ 
                    backgroundColor: '#E1306C' // Instagram pink color
                  }}>
              <View className="w-5 h-5 rounded-full border-2 border-white" />
            </View>
          </TouchableOpacity>
          
          {/* TikTok */}
          <TouchableOpacity className="mx-2">
            <View className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center">
              <Text className="text-white text-xl font-bold">♪</Text>
            </View>
          </TouchableOpacity>
          
          {/* LinkedIn */}
          <TouchableOpacity className="mx-2">
            <View className="w-14 h-14 rounded-2xl bg-blue-700 flex items-center justify-center">
              <Text className="text-white text-base font-bold">in</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Interests Section */}
        <View className="mt-12 px-6">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-xl font-bold text-gray-900">Interests</Text>
            <Text className="text-base text-gray-400">Edit</Text>
          </View>
          
          <View className="flex-row flex-wrap gap-3">
            {(profileData?.interests || []).map((interest, index) => {
              // Color palette matching the reference design
              const colors = [
                'bg-pink-100', 'bg-orange-100', 'bg-yellow-100', 
                'bg-purple-100', 'bg-red-100', 'bg-orange-200'
              ];
              const textColors = [
                'text-pink-700', 'text-orange-700', 'text-yellow-700',
                'text-purple-700', 'text-red-700', 'text-orange-800'
              ];
              
              return (
                <View
                  key={index}
                  className={`${colors[index % colors.length]} px-4 py-3 rounded-full flex-row items-center`}
                >
                  <Text className="text-base mr-2">{interest.icon}</Text>
                  <Text className={`text-sm font-medium ${textColors[index % textColors.length]}`}>
                    {interest.label}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Tabs (Feed, Lucids, Posts) - Removed divider line and borders for cleaner look */}
        <View className="flex-row bg-white mt-12 px-6">
          <TouchableOpacity
            className={`flex-1 py-4 ${
              activeTab === 'feed' ? '' : ''
            }`}
            onPress={() => setActiveTab('feed')}
          >
            <Text
              className={`text-center font-semibold text-lg ${
                activeTab === 'feed' ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              Feed
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-4 ${
              activeTab === 'lucids' ? '' : ''
            }`}
            onPress={() => setActiveTab('lucids')}
          >
            <Text
              className={`text-center font-semibold text-lg ${
                activeTab === 'lucids' ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              Lucids
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-4 ${
              activeTab === 'posts' ? '' : ''
            }`}
            onPress={() => setActiveTab('posts')}
          >
            <Text
              className={`text-center font-semibold text-lg ${
                activeTab === 'posts' ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              Posts
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content based on active tab */}
        {activeTab === 'posts' ? (
          // Posts Tab - All posts in scroll view (like Twitter feed)
          <View className="bg-white pt-4">
            {(posts || [])
              .filter(post => post.authorName === profileData?.name) // Only current user's posts
              .map((post) => {
                const postCardProps = mapPostToCardProps(post);
                return (
                  <PostCard key={post.id} {...postCardProps} />
                );
              })}
          </View>
        ) : (
          // Feed and Lucids Tabs - Grid view
          <View className="bg-white pt-4 px-6">
            <View className="flex-row flex-wrap -mx-1">
              {(posts || [])
                .filter(post => {
                  // First filter: Only current user's posts
                  const isCurrentUser = post.authorName === profileData?.name;
                  if (!isCurrentUser) return false;
                  
                  if (activeTab === 'feed') {
                    // Feed: Only posts with media (photos/videos)
                    return post.images && post.images.length > 0;
                  } else if (activeTab === 'lucids') {
                    // Lucids: Only lucid posts with media (when we implement lucids)
                    return post.type === 'lucid' && post.images && post.images.length > 0;
                  }
                  return false;
                })
                .map((post) => (
                  <TouchableOpacity
                    key={post.id}
                    className="px-1 mb-2"
                    style={{ width: width / 3 - 16 }}
                    onPress={() => {
                      // Navigate to fullscreen view for Feed tab only
                      if (activeTab === 'feed') {
                        const postIndex = userMediaPosts.findIndex(p => p.id === post.id);
                        setSelectedPostIndex(postIndex >= 0 ? postIndex : 0);
                        setIsFullscreen(true);
                      }
                    }}
                  >
                    <Image
                      source={{ uri: post.images![0] }}
                      className="w-full aspect-square bg-gray-200 rounded-xl"
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
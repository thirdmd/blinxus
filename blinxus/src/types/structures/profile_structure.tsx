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
import TravelFeedCard from '../../components/TravelFeedCard';
import MediaGridItem from '../../components/MediaGridItem';
import { useNavigation } from '@react-navigation/native';
import { Plus, Settings, Bookmark, ChevronLeft, Album } from 'lucide-react-native';
import Library from '../../screens/Profile/Library';
import { useThemeColors } from '../../hooks/useThemeColors';
import { getResponsiveDimensions, getTypographyScale, getSpacingScale, ri, rs, rf, RESPONSIVE_SCREEN } from '../../utils/responsive';

const { width, height: screenHeight } = RESPONSIVE_SCREEN;
const responsiveDimensions = getResponsiveDimensions();
const typography = getTypographyScale();
const spacing = getSpacingScale();

interface Props {
  profileData: ProfileDataType;
  posts: Post[];
  onSettingsPress: () => void;
  scrollRef?: React.RefObject<ScrollView | null>;
  onResetToTop?: React.MutableRefObject<(() => void) | null>;
}

export default function ProfileStructure({
  profileData,
  posts,
  onSettingsPress,
  scrollRef,
  onResetToTop,
}: Props) {
  const navigation = useNavigation();
  const themeColors = useThemeColors();
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

  // If in fullscreen mode, show TravelFeedCard view
  if (isFullscreen) {
    const filteredPosts = (posts || []).filter(post => {
      const isCurrentUser = post.authorName === profileData?.name;
      if (!isCurrentUser) return false;
      return post.images && post.images.length > 0;
    });

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
        <StatusBar 
          barStyle={themeColors.isDark ? "light-content" : "dark-content"} 
          backgroundColor={themeColors.background} 
        />
        
        {/* Back Button Header */}
        <View style={{ 
          position: 'absolute', 
          top: 50, 
          left: 16, 
          zIndex: 1000,
          width: 32, 
          height: 32, 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: themeColors.isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)',
          borderWidth: 0.5,
          borderColor: themeColors.isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)',
          borderRadius: 16
        }}>
          <TouchableOpacity
            onPress={() => setIsFullscreen(false)}
            style={{ 
              width: 32, 
              height: 32, 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <ChevronLeft size={20} color="white" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        {/* TravelFeedCard ScrollView */}
        <ScrollView 
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          decelerationRate="normal"
          contentOffset={{ x: 0, y: selectedPostIndex * (screenHeight - 180) }}
        >
          {filteredPosts.map((post, index) => {
            const postCardProps = mapPostToCardProps(post);
            return (
              <TravelFeedCard 
                key={post.id} 
                {...postCardProps} 
                onDetailsPress={() => {}}
                isVisible={true}
              />
            );
          })}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
      <StatusBar 
        barStyle={themeColors.isDark ? "light-content" : "dark-content"} 
        backgroundColor={themeColors.background} 
      />
      <ScrollView 
        ref={scrollViewRef}
        style={{ flex: 1, backgroundColor: themeColors.background }}
        showsVerticalScrollIndicator={false}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
          autoscrollToTopThreshold: 0,
        }}
      >
        {/* Header Bar - Minimal design */}
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          paddingHorizontal: 24, 
          paddingTop: 16, 
          paddingBottom: 8 
        }}>
          <Text style={{ 
            fontSize: 20, 
            fontWeight: '400', 
            color: themeColors.text 
          }}>
            {profileData?.username || '@username'}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {/* Library Button */}
            <TouchableOpacity
              onPress={() => setShowLibrary(true)}
              style={{ 
                width: 40, 
                height: 40, 
                alignItems: 'center', 
                justifyContent: 'center', 
                marginRight: 12 
              }}
              activeOpacity={0.3}
            >
              <Bookmark size={20} color={themeColors.text} strokeWidth={1.8} />
            </TouchableOpacity>
            
            {/* Settings Button - More Appropriate */}
            <TouchableOpacity
              style={{ 
                width: 40, 
                height: 40, 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}
              activeOpacity={0.3}
              onPress={onSettingsPress}
            >
              <Settings size={20} color={themeColors.text} strokeWidth={1.8} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Picture - Clean square with rounded edges */}
        <View style={{ marginTop: 48, alignItems: 'center' }}>
          <View style={{ 
            width: 192, 
            height: 192, 
            borderRadius: 16, 
            overflow: 'hidden', 
            backgroundColor: themeColors.backgroundSecondary 
          }}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=400&fit=crop' }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
          </View>
        </View>

        {/* Name & Flag - Minimal typography */}
        <View style={{ marginTop: 32, alignItems: 'center' }}>
          <Text style={{ fontSize: 24, color: themeColors.text }}>
            <Text style={{ fontWeight: '500' }}>{profileData?.name || 'Loading'}</Text>
            <Text style={{ fontWeight: '300' }}> {profileData?.nationalityFlag || '🏳️'}</Text>
          </Text>
        </View>

        {/* Location - Subtle */}
        <View style={{ marginTop: 8, alignItems: 'center' }}>
          <Text style={{ 
            fontSize: 14, 
            color: themeColors.textSecondary, 
            fontWeight: '300' 
          }}>
            {profileData?.country || 'Location'}
          </Text>
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
        <View style={{ marginTop: 64, paddingHorizontal: 24 }}>
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: 24 
          }}>
            <Text style={{ 
              fontSize: 18, 
              fontWeight: '400', 
              color: themeColors.text 
            }}>
              Interests
            </Text>
            <TouchableOpacity activeOpacity={0.3}>
              <Text style={{ 
                fontSize: 14, 
                color: themeColors.textSecondary, 
                fontWeight: '300' 
              }}>
                Edit
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={{ 
            flexDirection: 'row', 
            flexWrap: 'wrap', 
            gap: 8 
          }}>
            {(profileData?.interests || []).map((interest, index) => (
              <View
                key={index}
                style={{ 
                  borderWidth: 1, 
                  borderColor: themeColors.border, 
                  paddingHorizontal: 16, 
                  paddingVertical: 8, 
                  borderRadius: 20, 
                  flexDirection: 'row', 
                  alignItems: 'center' 
                }}
              >
                <Text style={{ fontSize: 14, marginRight: 8 }}>{interest.icon}</Text>
                <Text style={{ 
                  fontSize: 14, 
                  fontWeight: '300', 
                  color: themeColors.text 
                }}>
                  {interest.label}
                </Text>
              </View>
            ))}
          </View>
        </View>



        {/* Media Grid - Edge to edge with smooth corners */}
        <View style={{ paddingTop: 32 }}>
          {(() => {
            const filteredPosts = (posts || []).filter(post => {
              const isCurrentUser = post.authorName === profileData?.name;
              if (!isCurrentUser) return false;
              return post.images && post.images.length > 0;
            });

            if (filteredPosts.length === 0) {
              // Empty state - minimal
              return (
                <View style={{ 
                  flex: 1, 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  paddingVertical: 80,
                  paddingHorizontal: 24
                }}>
                  <Text style={{ 
                    fontSize: 14, 
                    color: themeColors.textSecondary, 
                    fontWeight: '300' 
                  }}>
                    All your Media Uploads
                  </Text>
                </View>
              );
            }

            return (
              <View style={{ 
                flexDirection: 'row', 
                flexWrap: 'wrap', 
                paddingBottom: 32 
              }}>
                {filteredPosts.map((post) => (
                  <TouchableOpacity
                    key={post.id}
                    style={{ 
                      width: width / 3,
                      aspectRatio: 4/5,
                      padding: 1
                    }}
                    onPress={() => {
                      // Set selected post for TravelFeedCard view
                      const postIndex = filteredPosts.findIndex(p => p.id === post.id);
                      setSelectedPostIndex(postIndex >= 0 ? postIndex : 0);
                      setIsFullscreen(true);
                    }}
                    activeOpacity={0.8}
                  >
                    <View style={{ position: 'relative', flex: 1 }}>
                      <Image
                        source={{ uri: post.images![0] }}
                        style={{ 
                          width: '100%', 
                          height: '100%',
                          borderRadius: 8,
                          backgroundColor: themeColors.backgroundSecondary 
                        }}
                        resizeMode="cover"
                      />
                      
                      {/* Lucid Indicator Icon */}
                      {post.type === 'lucid' && (
                        <View style={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          width: 24,
                          height: 24,
                          borderRadius: 12,
                          backgroundColor: '#0047AB',
                          alignItems: 'center',
                          justifyContent: 'center',
                          shadowColor: '#000',
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.25,
                          shadowRadius: 4,
                          elevation: 3
                        }}>
                          <Album size={14} color="white" strokeWidth={2.5} />
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            );
          })()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

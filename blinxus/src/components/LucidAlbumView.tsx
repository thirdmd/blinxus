import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Image, Dimensions, StatusBar } from 'react-native';
import { ChevronLeft, Send, Heart, MessageCircle, X, Grid3X3, Map } from 'lucide-react-native';
import { PostCardProps } from '../types/structures/posts_structure';
import { usePosts } from '../store/PostsContext';
import { useSavedPosts } from '../store/SavedPostsContext';
import { useThemeColors } from '../hooks/useThemeColors';

const { width, height } = Dimensions.get('window');

interface LucidAlbumData {
  title: string;
  days: string[][];
  allPhotos: string[];
  location: string;
  authorName: string;
  authorNationalityFlag?: string;
  timeAgo: string;
  likes: number;
  comments: number;
  activityColor?: string;
}

interface LucidAlbumViewProps {
  post: PostCardProps;
  onBack: () => void;
  initialIndex?: number;
}

const LucidAlbumView: React.FC<LucidAlbumViewProps> = ({ 
  post, 
  onBack, 
  initialIndex = 0 
}) => {
  const { likePost, unlikePost, addComment } = usePosts();
  const { savePost, unsavePost, isPostSaved } = useSavedPosts();
  const themeColors = useThemeColors();
  
  const [showMap, setShowMap] = useState(false);
  const [appBarOpacity, setAppBarOpacity] = useState(1);
  const [appBarTransform, setAppBarTransform] = useState(0);
  const [showPhotoDetail, setShowPhotoDetail] = useState<string | null>(null);
  const [showGridView, setShowGridView] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  
  const scrollRef = useRef<ScrollView>(null);
  const lastScrollY = useRef(0);

  // Convert post data to album format - organize images by days (4 per day)
  const organizeDays = (images: string[]): string[][] => {
    const days: string[][] = [];
    const imagesPerDay = 4;
    
    for (let i = 0; i < images.length; i += imagesPerDay) {
      days.push(images.slice(i, i + imagesPerDay));
    }
    
    return days;
  };
  
  const albumData: LucidAlbumData = {
    title: post.title || post.location, // Use title field directly, fallback to location
    days: post.images ? organizeDays(post.images) : [[]],
    allPhotos: post.images || [],
    location: post.location,
    authorName: post.authorName,
    authorNationalityFlag: post.authorNationalityFlag,
    timeAgo: post.timeAgo,
    likes: post.likes,
    comments: post.comments,
    activityColor: post.activityColor
  };

  const dayCount = albumData.days.length;
  const photoCount = albumData.allPhotos.length;
  const dayLabel = dayCount === 1 ? 'Day Trip' : `${dayCount} days`;
  const momentLabel = photoCount === 1 ? '1 moment' : `${photoCount} moments`;

  const handleScroll = useCallback((event: any) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    const scrollDelta = currentScrollY - lastScrollY.current;
    
    if (currentScrollY <= 0) {
      setAppBarOpacity(1);
      setAppBarTransform(0);
    } else {
      if (scrollDelta > 0) {
        // Scrolling down
        setAppBarTransform(-100);
        setAppBarOpacity(0);
      } else if (scrollDelta < 0) {
        // Scrolling up
        setAppBarTransform(0);
        setAppBarOpacity(1);
      }
    }
    
    lastScrollY.current = currentScrollY;
  }, []);

  const handleLike = () => {
    if (isLiked) {
      unlikePost(post.id);
      setIsLiked(false);
    } else {
      likePost(post.id);
      setIsLiked(true);
    }
  };

  const handleComment = () => {
    addComment(post.id);
  };

  const handleSave = () => {
    if (isPostSaved(post.id)) {
      unsavePost(post.id);
    } else {
      savePost(post.id);
    }
  };

  if (showPhotoDetail) {
    return (
      <PhotoDetailView 
        photoPath={showPhotoDetail} 
        location={albumData.location}
        onClose={() => setShowPhotoDetail(null)}
        onLike={handleLike}
        onComment={handleComment}
        onSave={handleSave}
        isLiked={isLiked}
        isSaved={isPostSaved(post.id)}
        themeColors={themeColors}
      />
    );
  }

  if (showGridView) {
    return (
      <AlbumGridView 
        album={albumData} 
        onBack={() => setShowGridView(false)}
        onPhotoSelect={setShowPhotoDetail}
        themeColors={themeColors}
      />
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
      <StatusBar 
        barStyle={themeColors.isDark ? "light-content" : "dark-content"} 
        backgroundColor={themeColors.background} 
      />
      
      {/* Custom App Bar */}
      <View 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          transform: [{ translateY: appBarTransform }],
          opacity: appBarOpacity,
        }}
      >
        <View style={{
          backgroundColor: themeColors.isDark ? 'rgba(11, 20, 38, 0.7)' : 'rgba(255, 255, 255, 0.7)',
          paddingHorizontal: 16,
          paddingVertical: 12,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 50
        }}>
          <TouchableOpacity onPress={onBack} style={{ padding: 8, marginLeft: -8 }}>
            <ChevronLeft size={24} color={themeColors.text} />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setShowMap(!showMap)}
            style={{ padding: 8 }}
          >
            {showMap ? (
              <Grid3X3 size={20} color={themeColors.text} />
            ) : (
              <Map size={20} color={themeColors.text} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView 
        ref={scrollRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {showMap ? <SpaceView /> : <StoryView />}
      </ScrollView>
    </SafeAreaView>
  );

  function StoryView() {
    return (
      <View style={{ paddingBottom: 32 }}>
        {/* Header */}
        <View style={{ paddingTop: 96, paddingHorizontal: 24, paddingBottom: 24 }}>
          <Text style={{ 
            fontSize: 28, 
            fontWeight: '500', 
            color: themeColors.text, 
            letterSpacing: -0.5 
          }}>
            {albumData.title}
          </Text>
          <TouchableOpacity 
            onPress={() => setShowGridView(true)}
            style={{ marginTop: 8 }}
          >
            <Text style={{ color: themeColors.textSecondary, fontSize: 16, fontWeight: '300' }}>
              {dayLabel} · {momentLabel}
            </Text>
          </TouchableOpacity>
          
          {/* Author info */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 16 }}>
            <Text style={{ color: themeColors.text, fontWeight: 'normal' }}>{albumData.authorName}</Text>
            {albumData.authorNationalityFlag && (
              <Text style={{ marginLeft: 8, color: themeColors.text, fontWeight: '300' }}>{albumData.authorNationalityFlag}</Text>
            )}
            <Text style={{ marginLeft: 8, color: themeColors.textSecondary, fontWeight: '300' }}>• {albumData.timeAgo}</Text>
          </View>
        </View>

        {/* Days Sections */}
        {albumData.days.map((photos, dayIndex) => (
          <DaySection 
            key={dayIndex} 
            dayIndex={dayIndex} 
            photos={photos} 
            showDayLabel={albumData.days.length > 1}
            location={albumData.location}
            activityColor={albumData.activityColor}
            onPhotoClick={setShowPhotoDetail}
            themeColors={themeColors}
          />
        ))}
      </View>
    );
  }

  function SpaceView() {
    return (
      <View style={{ 
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: themeColors.backgroundSecondary, 
        height: height - 200 
      }}>
        <Text style={{ fontSize: 18, color: themeColors.textSecondary }}>SpaceView Coming Soon</Text>
      </View>
    );
  }
};

// Day Section Component
const DaySection: React.FC<{
  dayIndex: number;
  photos: string[];
  showDayLabel: boolean;
  location: string;
  activityColor?: string;
  onPhotoClick: (photo: string) => void;
  themeColors: any;
}> = ({ dayIndex, photos, showDayLabel, location, activityColor, onPhotoClick, themeColors }) => {
  return (
    <View style={{ marginBottom: 32 }}>
      {showDayLabel && (
        <View style={{ paddingHorizontal: 24, marginBottom: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: '500', color: themeColors.text }}>
            Day {dayIndex + 1}
          </Text>
        </View>
      )}
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24 }}
        style={{ height: 280 }}
      >
        {photos.map((photo, photoIndex) => (
          <PhotoCard
            key={photoIndex}
            photoPath={photo}
            location={location}
            activityColor={activityColor}
            onClick={() => onPhotoClick(photo)}
            themeColors={themeColors}
          />
        ))}
      </ScrollView>
    </View>
  );
};

// Photo Card Component
const PhotoCard: React.FC<{
  photoPath: string;
  location: string;
  activityColor?: string;
  onClick: () => void;
  themeColors: any;
}> = ({ photoPath, location, activityColor, onClick, themeColors }) => {
  return (
    <TouchableOpacity 
      onPress={onClick}
      style={{ marginRight: 16, width: width * 0.7 }}
      activeOpacity={0.9}
    >
      <View style={{ height: '100%', flexDirection: 'column' }}>
        <View style={{ flex: 1, borderRadius: 12, overflow: 'hidden' }}>
          <Image 
            source={{ uri: photoPath }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
          <Text style={{ fontSize: 16, marginRight: 2 }}>📍</Text>
          <Text style={{ marginLeft: 2, fontSize: 14, color: themeColors.textSecondary, fontWeight: '300' }}>{location}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Photo Detail Component
const PhotoDetailView: React.FC<{
  photoPath: string;
  location: string;
  onClose: () => void;
  onLike: () => void;
  onComment: () => void;
  onSave: () => void;
  isLiked: boolean;
  isSaved: boolean;
  themeColors: any;
}> = ({ photoPath, location, onClose, onLike, onComment, onSave, isLiked, isSaved, themeColors }) => {
  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 50 }}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="transparent" 
      />
      
      {/* Frosted Background Image */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        <Image 
          source={{ uri: photoPath }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
          blurRadius={8}
        />
        <View style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          backgroundColor: 'rgba(0, 0, 0, 0.15)' 
        }} />
      </View>
      
      {/* App Bar */}
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 16,
        paddingTop: 50
      }}>
        <TouchableOpacity 
          onPress={onClose}
          style={{
            padding: 8,
          }}
        >
          <ChevronLeft size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Photo - Pure Fullscreen */}
      <View style={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <Image 
          source={{ uri: photoPath }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

// Action Button Component
const ActionButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  themeColors: any;
}> = ({ icon, label, onPress, themeColors }) => {
  return (
    <TouchableOpacity onPress={onPress} style={{ flexDirection: 'column', alignItems: 'center' }}>
      <View style={{ width: 24, height: 24 }}>{icon}</View>
      <Text style={{ fontSize: 12, marginTop: 4, color: themeColors.text, fontWeight: '300' }}>{label}</Text>
    </TouchableOpacity>
  );
};

// Album Grid View Component
const AlbumGridView: React.FC<{
  album: LucidAlbumData;
  onBack: () => void;
  onPhotoSelect: (photo: string) => void;
  themeColors: any;
}> = ({ album, onBack, onPhotoSelect, themeColors }) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
      <StatusBar 
        barStyle={themeColors.isDark ? "light-content" : "dark-content"} 
        backgroundColor={themeColors.background} 
      />
      
      {/* App Bar */}
      <View style={{ 
        backgroundColor: themeColors.background, 
        paddingHorizontal: 16, 
        paddingVertical: 12, 
        flexDirection: 'row', 
        alignItems: 'center', 
        borderBottomWidth: 1, 
        borderBottomColor: themeColors.border 
      }}>
        <TouchableOpacity onPress={onBack} style={{ padding: 8, marginLeft: -8 }}>
          <ChevronLeft size={24} color={themeColors.text} />
        </TouchableOpacity>
        <Text style={{ marginLeft: 8, fontSize: 18, fontWeight: '500', color: themeColors.text }}>{album.title}</Text>
      </View>
      
      {/* Grid */}
      <ScrollView style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', padding: 4 }}>
          {album.allPhotos.map((photo, index) => (
            <TouchableOpacity 
              key={index}
              onPress={() => onPhotoSelect(photo)}
              style={{ width: '33.33%', padding: 2 }}
              activeOpacity={0.9}
            >
              <View style={{ aspectRatio: 1, backgroundColor: themeColors.backgroundSecondary, overflow: 'hidden' }}>
                <Image 
                  source={{ uri: photo }}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LucidAlbumView; 
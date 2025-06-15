import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Image, Dimensions, StatusBar } from 'react-native';
import { ChevronLeft, MapPin, Share2, Heart, MessageCircle, Bookmark, X, Grid3X3 } from 'lucide-react-native';
import { PostCardProps } from '../types/structures/posts_structure';
import { usePosts } from '../store/PostsContext';
import { useSavedPosts } from '../store/SavedPostsContext';

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
      />
    );
  }

  if (showGridView) {
    return (
      <AlbumGridView 
        album={albumData} 
        onBack={() => setShowGridView(false)}
        onPhotoSelect={setShowPhotoDetail}
      />
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Custom App Bar */}
      <View 
        className="absolute top-0 left-0 right-0 z-50"
        style={{
          transform: [{ translateY: appBarTransform }],
          opacity: appBarOpacity,
        }}
      >
        <View className="bg-white/70 px-4 py-3 flex-row items-center justify-between"
              style={{ paddingTop: 50 }}>
          <TouchableOpacity onPress={onBack} className="p-2 -ml-2">
            <ChevronLeft size={24} color="#1F2937" />
          </TouchableOpacity>
          <View className="flex-row items-center gap-2">
            <TouchableOpacity 
              onPress={() => setShowMap(!showMap)}
              className="p-2"
            >
              {showMap ? (
                <Grid3X3 size={20} color="#1F2937" />
              ) : (
                <MapPin size={20} color="#1F2937" />
              )}
            </TouchableOpacity>
            <TouchableOpacity className="p-2">
              <Share2 size={20} color="#1F2937" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView 
        ref={scrollRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        {showMap ? <SpaceView /> : <StoryView />}
      </ScrollView>
    </SafeAreaView>
  );

  function StoryView() {
    return (
      <View className="pb-8">
        {/* Header */}
        <View className="pt-24 px-6 pb-6">
          <Text className="text-3xl font-bold text-gray-800 tracking-tight">
            {albumData.title}
          </Text>
          <TouchableOpacity 
            onPress={() => setShowGridView(true)}
            className="mt-2"
          >
            <Text className="text-gray-600 text-base">
              {dayLabel} · {momentLabel}
            </Text>
          </TouchableOpacity>
          
          {/* Author info */}
          <View className="flex-row items-center mt-4">
            <Text className="text-gray-700 font-medium">{albumData.authorName}</Text>
            {albumData.authorNationalityFlag && (
              <Text className="ml-2">{albumData.authorNationalityFlag}</Text>
            )}
            <Text className="ml-2 text-gray-500">• {albumData.timeAgo}</Text>
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
          />
        ))}
      </View>
    );
  }

  function SpaceView() {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100" style={{ height: height - 200 }}>
        <Text className="text-lg text-gray-600">SpaceView Coming Soon</Text>
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
}> = ({ dayIndex, photos, showDayLabel, location, activityColor, onPhotoClick }) => {
  return (
    <View className="mb-8">
      {showDayLabel && (
        <View className="px-6 py-4 flex-row items-center">
          <Text className="text-2xl font-bold text-gray-800">Day {dayIndex + 1}</Text>
          <View className="ml-3 h-px w-16 bg-gray-200" />
        </View>
      )}
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        className="h-96"
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        {photos.map((photo, index) => (
          <PhotoCard 
            key={index} 
            photoPath={photo} 
            location={location}
            activityColor={activityColor}
            onClick={() => onPhotoClick(photo)}
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
}> = ({ photoPath, location, activityColor, onClick }) => {
  return (
    <TouchableOpacity 
      onPress={onClick}
      className="mr-4"
      style={{ width: width * 0.7 }}
      activeOpacity={0.9}
    >
      <View className="h-full flex-col">
        <View className="flex-1 rounded-xl overflow-hidden">
          <Image 
            source={{ uri: photoPath }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
        <View className="flex-row items-center mt-3">
          <MapPin size={16} color="#6B7280" />
          <Text className="ml-1 text-sm text-gray-600">{location}</Text>
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
}> = ({ photoPath, location, onClose, onLike, onComment, onSave, isLiked, isSaved }) => {
  return (
    <View className="absolute inset-0 bg-white z-50">
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {/* App Bar */}
      <View className="absolute top-0 left-0 right-0 z-10 flex-row items-center justify-between p-4"
            style={{ paddingTop: 50 }}>
        <TouchableOpacity 
          onPress={onClose}
          className="p-2 bg-white rounded-full"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
          }}
        >
          <X size={16} color="#1F2937" />
        </TouchableOpacity>
        <TouchableOpacity 
          className="p-3 bg-white rounded-full"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
          }}
        >
          <Share2 size={20} color="#1F2937" />
        </TouchableOpacity>
      </View>

      {/* Photo */}
      <View className="h-full w-full flex items-center justify-center bg-black">
        <Image 
          source={{ uri: photoPath }}
          className="w-full h-full"
          resizeMode="contain"
        />
      </View>

      {/* Bottom Actions */}
      <View className="absolute bottom-0 left-0 right-0 p-6"
            style={{
              backgroundColor: 'rgba(0,0,0,0.7)'
            }}>
        <View className="flex-row items-center mb-4">
          <MapPin size={16} color="#FFFFFF" />
          <Text className="ml-1 text-sm text-white opacity-90">{location}</Text>
        </View>
        
        <View className="flex-row items-center justify-between">
          <View className="flex-row gap-6">
            <ActionButton 
              icon={<Heart size={24} color="#FFFFFF" fill={isLiked ? "#EF4444" : "none"} />} 
              label="Like" 
              onPress={onLike}
            />
            <ActionButton 
              icon={<MessageCircle size={24} color="#FFFFFF" />} 
              label="Comment" 
              onPress={onComment}
            />
            <ActionButton 
              icon={<Bookmark size={24} color="#FFFFFF" fill={isSaved ? "#0047AB" : "none"} />} 
              label="Save" 
              onPress={onSave}
            />
          </View>
          
          <TouchableOpacity className="bg-white px-6 py-3 rounded-lg">
            <Text className="text-gray-800 font-medium">Add to Blinx</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// Action Button Component
const ActionButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}> = ({ icon, label, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} className="flex-col items-center">
      <View className="w-6 h-6">{icon}</View>
      <Text className="text-xs mt-1 text-white">{label}</Text>
    </TouchableOpacity>
  );
};

// Album Grid View Component
const AlbumGridView: React.FC<{
  album: LucidAlbumData;
  onBack: () => void;
  onPhotoSelect: (photo: string) => void;
}> = ({ album, onBack, onPhotoSelect }) => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* App Bar */}
      <View className="bg-white px-4 py-3 flex-row items-center border-b border-gray-100">
        <TouchableOpacity onPress={onBack} className="p-2 -ml-2">
          <ChevronLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text className="ml-2 text-lg font-semibold text-gray-800">{album.title}</Text>
      </View>
      
      {/* Grid */}
      <ScrollView className="flex-1">
        <View className="flex-row flex-wrap p-1">
          {album.allPhotos.map((photo, index) => (
            <TouchableOpacity 
              key={index}
              onPress={() => onPhotoSelect(photo)}
              className="w-1/3 p-0.5"
              activeOpacity={0.9}
            >
              <View className="aspect-square bg-gray-200 overflow-hidden">
                <Image 
                  source={{ uri: photo }}
                  className="w-full h-full"
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
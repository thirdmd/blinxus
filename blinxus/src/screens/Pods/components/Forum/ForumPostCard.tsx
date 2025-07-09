// Individual Forum Post Card Component - Ultra-responsive & optimized

import React, { useCallback, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { 
  MessageCircle, 
  Heart, 
  Bookmark, 
  MoreHorizontal,
  ThumbsDown,
  Send
} from 'lucide-react-native';
import { ForumPost, ForumLocation, FORUM_CATEGORIES, FORUM_ACTIVITY_TAGS } from './forumTypes';
import { useThemeColors } from '../../../../hooks/useThemeColors';
import { getTextStyles } from '../../../../utils/responsive';
import { ForumTagsDisplay } from '../../../../utils/forumLocationLogic';
import { useLikedPosts } from '../../../../store/LikedPostsContext';
import { useSavedPosts } from '../../../../store/SavedPostsContext';
import { useComments } from '../../../../store/CommentsContext';
import { ri } from '../../../../utils/responsive';

interface ForumPostCardProps {
  post: ForumPost;
  // Handlers passed by parent lists; kept optional so card compiles even if it handles these actions internally
  onLike?: (postId: string) => void;
  onBookmark?: (postId: string) => void;
  onReply?: (postId: string) => void;
  // onLike, onBookmark etc. are no longer needed as the card will handle its own state
  onDislike?: (postId: string) => void;
  onShare?: (postId: string) => void;
  onMore?: (postId: string) => void;
  onAuthorPress?: (authorId: string) => void;
  onTagPress?: (tagId: string) => void;
  onCategoryPress?: (categoryId: string) => void;
  onLocationPress?: (post: ForumPost, location: ForumLocation) => void;
  onCommentIconPress?: () => void; // Add this prop
  compact?: boolean;
}

const { width } = Dimensions.get('window');

export const ForumPostCard: React.FC<ForumPostCardProps> = React.memo(({
  post,
  onLike,
  onDislike,
  onShare,
  onMore,
  onAuthorPress,
  onTagPress,
  onCategoryPress,
  onLocationPress,
  onCommentIconPress, // Add this to destructuring
  compact = false
}) => {
  const themeColors = useThemeColors();
  const textStyles = getTextStyles();
  const navigation = useNavigation();

  // THE FIX: Get interaction state directly from the centralized contexts
  const { isPostLiked, likePost, unlikePost } = useLikedPosts();
  const { isPostSaved, savePost, unsavePost } = useSavedPosts();
  const { getCommentCountForPost, comments } = useComments();

  // NEW: local state to keep an up-to-date like counter that starts at 0 and increments on the first like to show "1".
  const [likesCount, setLikesCount] = useState(post.likes);

  // Keep local count in sync if the post prop updates externally
  useEffect(() => {
    setLikesCount(post.likes);
  }, [post.likes]);

  // Derive the up-to-date state from the contexts
  const isLiked = isPostLiked(post.id);
  const isSaved = isPostSaved(post.id);
  const commentCount = comments.hasOwnProperty(post.id)
    ? getCommentCountForPost(post.id)
    : post.replyCount;


  // Centralized handlers that update the contexts
  const handleLike = useCallback(() => {
    if (isLiked) {
      unlikePost(post.id);
      setLikesCount(prev => Math.max(prev - 1, 0));
    } else {
      likePost(post.id);
      setLikesCount(prev => prev + 1);
    }
    // Propagate to parent list (e.g. ForumPostsList) if a callback was provided
    onLike?.(post.id);
  }, [isLiked, post.id, likePost, unlikePost, onLike]);

  const handleBookmark = useCallback(() => {
    if (isSaved) {
      unsavePost(post.id);
    } else {
      savePost(post.id);
    }
  }, [isSaved, post.id, savePost, unsavePost]);

  const handleDislike = useCallback(() => onDislike?.(post.id), [onDislike, post.id]);
  const handleShare = useCallback(() => onShare?.(post.id), [onShare, post.id]);
  const handleMore = useCallback(() => onMore?.(post.id), [onMore, post.id]);
  const handleAuthorPress = useCallback(() => onAuthorPress?.(post.authorId), [onAuthorPress, post.authorId]);
  const handleLocationPress = useCallback(() => onLocationPress?.(post, post.location), [onLocationPress, post]);
  const handleNavigateToComments = useCallback(() => {
    // @ts-ignore
    navigation.navigate('ForumComments', { post });
  }, [navigation, post]);

  // Get category data
  const categoryData = FORUM_CATEGORIES.find(cat => cat.id === post.category);

  // Format timestamp
  const formatTimestamp = (timestamp: string): string => {
    const now = new Date();
    const postDate = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks}w`;
    
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths}mo`;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={handleNavigateToComments} // Navigate to comments on card press
    >
      <View 
        style={{
          backgroundColor: themeColors.background,
          borderRadius: 16,
          padding: compact ? 8 : 8,
          marginBottom: compact ? 8 : 7.5,
          marginHorizontal: 8,
          borderWidth: 1,
          borderColor: themeColors.isDark 
            ? 'rgba(255,255,255,0.35)'
            : 'rgba(0, 0, 0, 0.12)',
          // Allow flexible height based on content
          minHeight: compact ? 120 : 160,
        }}
      >
        {/* Category and Activity Tags */}
        <ScrollView 
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 12 }}
          contentContainerStyle={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            gap: 6,
            paddingRight: 20,
          }}
          // ULTRA-RESPONSIVE: Optimize horizontal scroll
          removeClippedSubviews={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Category Tag */}
          {categoryData && (
            <TouchableOpacity
              onPress={(e) => { e.stopPropagation(); onCategoryPress?.(post.category)}}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 12,
                backgroundColor: categoryData.color,
              }}
              activeOpacity={0.8}
              hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
            >
              <Text style={{ fontSize: 12, marginRight: 3 }}>
                {categoryData.emoji}
              </Text>
              <Text style={{
                fontSize: 12,
                fontWeight: '600',
                color: 'white',
                fontFamily: 'System',
              }}>
                {categoryData.label}
              </Text>
            </TouchableOpacity>
          )}
          
          {/* Activity Tags - Show ALL tags with horizontal scrolling */}
          {ForumTagsDisplay.getTagsForDisplay(post.activityTags, FORUM_ACTIVITY_TAGS).map((tagData) => (
            <TouchableOpacity
              key={tagData.id}
              onPress={(e) => { e.stopPropagation(); onTagPress?.(tagData.id) }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 12,
                backgroundColor: themeColors.isDark 
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'rgba(0, 0, 0, 0.08)',
              }}
              activeOpacity={0.8}
              hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
            >
              <Text style={{ fontSize: 12, marginRight: 3 }}>
                {tagData.emoji}
              </Text>
              <Text style={{
                fontSize: 12,
                fontWeight: '500',
                color: themeColors.text,
                fontFamily: 'System',
              }}>
                {tagData.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Author Info */}
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'flex-start', // Align to top to control vertical position manually
          justifyContent: 'space-between',
          marginBottom: 12 
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            {/* Author Profile Picture - Clickable */}
            <TouchableOpacity
              onPress={(e) => { e.stopPropagation(); handleAuthorPress()}}
              activeOpacity={0.8}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              {post.author.avatarUrl ? (
                <Image
                  source={{ uri: post.author.avatarUrl }}
                  style={{
                    width: compact ? 32 : 36,
                    height: compact ? 32 : 36,
                    borderRadius: (compact ? 32 : 36) / 2,
                    marginRight: 12,
                  }}
                />
              ) : (
                <View style={{
                  width: compact ? 32 : 36,
                  height: compact ? 32 : 36,
                  borderRadius: (compact ? 32 : 36) / 2,
                  backgroundColor: post.author.color,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12,
                }}>
                  <Text style={{ 
                    color: 'white', 
                    ...textStyles.caption,
                    fontWeight: '600',
                  }}>
                    {post.author.initials}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            
            {/* Author Info Container */}
            <View style={{ flex: 1 }}>
              {/* Author Name - Clickable */}
              <TouchableOpacity
                onPress={(e) => { e.stopPropagation(); handleAuthorPress()}}
                activeOpacity={0.8}
                hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
                style={{ alignSelf: 'flex-start' }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{
                    ...textStyles.forumAuthor,
                    color: themeColors.text,
                    marginRight: 4,
                  }}>
                    {post.author.displayName}
                  </Text>
                  {post.author.nationalityFlag && (
                    <Text style={{ fontSize: 12, marginRight: 4 }}>
                      {post.author.nationalityFlag}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
              
              {/* Location and Timestamp - Location clickable for navigation */}
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3 }}>
                {/* Location - Distinctive clickable design */}
                {post.location.countryId !== 'global' && post.location.type !== 'global' && onLocationPress ? (
                  <TouchableOpacity
                    onPress={(e) => { e.stopPropagation(); handleLocationPress()}}
                    activeOpacity={0.7}
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                    style={{ alignSelf: 'flex-start' }}
                  >
                    <View style={{
                      paddingLeft: 7,
                      paddingRight: 10,
                      paddingVertical: 3,
                      borderRadius: 16,
                      backgroundColor: themeColors.isDark 
                        ? 'rgba(59, 130, 246, 0.12)'
                        : 'rgba(59, 130, 246, 0.06)',
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderWidth: themeColors.isDark ? 0.8 : 0.6,
                      borderColor: themeColors.isDark 
                        ? 'rgba(59, 130, 246, 0.35)'
                        : 'rgba(59, 130, 246, 0.25)',
                      shadowColor: '#3B82F6',
                      shadowOffset: { width: 0, height: 0.5 },
                      shadowOpacity: themeColors.isDark ? 0.2 : 0.1,
                      shadowRadius: 2,
                      elevation: 1,
                      // CENTRALIZED: Add minimum touch area for consistency
                      minWidth: 60,
                      minHeight: 24,
                    }}>
                      <Text style={{ 
                        fontSize: 13, 
                        marginRight: 3,
                      }}>📍</Text>
                      <Text style={{
                        fontSize: 13,
                        color: themeColors.isDark 
                          ? '#B0B0B0' 
                          : 'rgba(0, 0, 0, 0.6)',
                        fontWeight: '500',
                        fontFamily: 'System',
                        letterSpacing: -0.1,
                      }}>
                        {post.location.name.split('-').pop() || post.location.name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <View style={{
                    paddingLeft: 7,
                    paddingRight: 10,
                    paddingVertical: 3,
                    borderRadius: 16,
                    backgroundColor: themeColors.isDark 
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(0, 0, 0, 0.02)',
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderWidth: themeColors.isDark ? 0.6 : 0.4,
                    borderColor: themeColors.isDark 
                      ? 'rgba(255, 255, 255, 0.12)'
                      : 'rgba(0, 0, 0, 0.08)',
                    alignSelf: 'flex-start',
                  }}>
                    <Text style={{ 
                      fontSize: 13, 
                      color: themeColors.textSecondary, 
                      marginRight: 3,
                      opacity: themeColors.isDark ? 0.8 : 0.6,
                    }}>📍</Text>
                    <Text style={{
                      fontSize: 13,
                      color: themeColors.isDark 
                        ? '#B0B0B0' 
                        : 'rgba(0, 0, 0, 0.5)',
                      fontWeight: '400',
                      fontFamily: 'System',
                      letterSpacing: -0.1,
                    }}>
                      {post.location.name.split('-').pop() || post.location.name}
                    </Text>
                  </View>
                )}
                
                {/* Timestamp */}
                <Text style={{
                  ...textStyles.forumMeta,
                  color: themeColors.textSecondary,
                  marginLeft: 8,
                }}>
                  {formatTimestamp(post.createdAt)}
                </Text>
              </View>
            </View>
          </View>

          {/* More options - Separate touchable area */}
          <TouchableOpacity
            onPress={(e) => { e.stopPropagation(); handleMore()}}
            style={{
              padding: 8,
              borderRadius: 12,
              marginLeft: 4,
              marginTop: 2, // Nudge down to align with author name
            }}
            activeOpacity={0.8}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <MoreHorizontal size={18} color={themeColors.textSecondary} />
          </TouchableOpacity>
        </View>
        
        {/* Post Content - Reverted to smaller font size */}
        <Text style={{
          ...textStyles.forumContent,
          color: themeColors.text,
          marginBottom: compact ? 12 : 16,
          // Allow content to expand naturally
          flexShrink: 1,
        }}>
          {post.content}
        </Text>
        
        {/* ULTRA-RESPONSIVE: Engagement Bar - Reduced spacing */}
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: compact ? 12 : 14,
          marginTop: 4,
        }}>
          {/* Left side - Interactions with reduced spacing */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            {/* Like button */}
            <TouchableOpacity 
              onPress={(e) => { e.stopPropagation(); handleLike()}}
              style={{ 
                flexDirection: 'row', 
                alignItems: 'center',
                paddingVertical: 2,
                paddingHorizontal: 2,
              }}
              activeOpacity={0.8}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Heart 
                size={ri(19)} 
                color={isLiked ? '#EF4444' : themeColors.textSecondary}
                fill={isLiked ? '#EF4444' : 'none'}
                strokeWidth={2}
              />
              {likesCount > 0 && (
                <Text style={{
                  ...textStyles.caption,
                  color: isLiked ? '#EF4444' : themeColors.textSecondary,
                  marginLeft: 4,
                  fontWeight: isLiked ? '600' : '500',
                }}>
                  {likesCount}
                </Text>
              )}
            </TouchableOpacity>

            {/* Reply button */}
            <TouchableOpacity 
              onPress={(e) => { 
                e.stopPropagation(); 
                if (onCommentIconPress) {
                  onCommentIconPress();
                } else {
                  handleNavigateToComments();
                }
              }}
              style={{ 
                flexDirection: 'row', 
                alignItems: 'center',
                paddingVertical: 2,
                paddingHorizontal: 2,
              }}
              activeOpacity={0.8}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <MessageCircle size={ri(19)} color={themeColors.textSecondary} strokeWidth={2} />
              {commentCount > 0 && (
                <Text style={{
                  ...textStyles.caption,
                  color: themeColors.textSecondary,
                  marginLeft: 4,
                  fontWeight: '500',
                }}>
                  {commentCount}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Right side - Actions with reduced spacing */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            {/* Share button - MOVED to be before Bookmark */}
            {onShare && (
              <TouchableOpacity 
                onPress={(e) => { e.stopPropagation(); handleShare()}}
                style={{
                  paddingVertical: 2,
                  paddingHorizontal: 2,
                }}
                activeOpacity={0.8}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Send size={ri(19)} color={themeColors.textSecondary} strokeWidth={2} />
              </TouchableOpacity>
            )}

            {/* Bookmark button */}
            <TouchableOpacity 
              onPress={(e) => { e.stopPropagation(); handleBookmark()}}
              style={{
                paddingVertical: 2,
                paddingHorizontal: 2,
              }}
              activeOpacity={0.8}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Bookmark 
                size={ri(19)} 
                color={isSaved ? '#F59E0B' : themeColors.textSecondary}
                fill={isSaved ? '#F59E0B' : 'none'}
                strokeWidth={2}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});

ForumPostCard.displayName = 'ForumPostCard';
// Individual Forum Post Card Component - Ultra-responsive & optimized

import React, { useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
} from 'react-native';
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

interface ForumPostCardProps {
  post: ForumPost;
  onLike: (postId: string) => void;
  onDislike?: (postId: string) => void;
  onBookmark: (postId: string) => void;
  onReply?: (postId: string) => void;
  onShare?: (postId: string) => void;
  onMore?: (postId: string) => void;
  onAuthorPress?: (authorId: string) => void;
  onTagPress?: (tagId: string) => void;
  onCategoryPress?: (categoryId: string) => void;
  onLocationPress?: (post: ForumPost, location: ForumLocation) => void;
  compact?: boolean;
}

const { width } = Dimensions.get('window');

export const ForumPostCard: React.FC<ForumPostCardProps> = React.memo(({
  post,
  onLike,
  onDislike,
  onBookmark,
  onReply,
  onShare,
  onMore,
  onAuthorPress,
  onTagPress,
  onCategoryPress,
  onLocationPress,
  compact = false
}) => {
  const themeColors = useThemeColors();
  const textStyles = getTextStyles();

  // ULTRA-RESPONSIVE: Memoized handlers to prevent re-renders
  const handleLike = useCallback(() => onLike(post.id), [onLike, post.id]);
  const handleDislike = useCallback(() => onDislike?.(post.id), [onDislike, post.id]);
  const handleBookmark = useCallback(() => onBookmark(post.id), [onBookmark, post.id]);
  const handleReply = useCallback(() => onReply?.(post.id), [onReply, post.id]);
  const handleShare = useCallback(() => onShare?.(post.id), [onShare, post.id]);
  const handleMore = useCallback(() => onMore?.(post.id), [onMore, post.id]);
  const handleAuthorPress = useCallback(() => onAuthorPress?.(post.authorId), [onAuthorPress, post.authorId]);
  const handleLocationPress = useCallback(() => onLocationPress?.(post, post.location), [onLocationPress, post]);

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
    <View 
      style={{
        backgroundColor: themeColors.background,
        borderRadius: 16,
        padding: compact ? 8 : 8,
        marginBottom: compact ? 8 : 7.5,
        marginHorizontal: 8,
        borderWidth: 1,
        borderColor: themeColors.isDark 
          ? 'rgba(255, 255, 255, 0.15)'
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
            onPress={() => onCategoryPress?.(post.category)}
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
            onPress={() => onTagPress?.(tagData.id)}
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
        alignItems: 'center', 
        marginBottom: 12 
      }}>
        {/* Author Profile Picture - Clickable */}
        <TouchableOpacity
          onPress={handleAuthorPress}
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
            onPress={handleAuthorPress}
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
                onPress={handleLocationPress}
                activeOpacity={0.7}
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
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
                }}>
                  <Text style={{ 
                    fontSize: 13, 
                    marginRight: 3,
                  }}>📍</Text>
                  <Text style={{
                    fontSize: 13,
                    color: themeColors.isDark 
                      ? 'rgba(139, 184, 255, 0.9)' 
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
                    ? 'rgba(255, 255, 255, 0.75)' 
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

        {/* More options - Separate touchable area */}
        <TouchableOpacity
          onPress={handleMore}
          style={{
            padding: 8,
            borderRadius: 12,
            marginLeft: 4,
          }}
          activeOpacity={0.8}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <MoreHorizontal size={18} color={themeColors.textSecondary} />
        </TouchableOpacity>
      </View>
      
      {/* Post Content - Reverted to smaller font size */}
      <Text style={{
        fontSize: compact ? 14 : 15,
        color: themeColors.text,
        lineHeight: compact ? 20 : 22,
        marginBottom: compact ? 12 : 16,
        fontFamily: 'System',
        fontWeight: '400',
        letterSpacing: -0.1,
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
            onPress={handleLike}
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
              size={18} 
              color={post.isLiked ? '#EF4444' : themeColors.textSecondary}
              fill={post.isLiked ? '#EF4444' : 'none'}
              strokeWidth={2}
            />
            {post.likes > 0 && (
              <Text style={{
                ...textStyles.caption,
                color: post.isLiked ? '#EF4444' : themeColors.textSecondary,
                marginLeft: 4,
                fontWeight: post.isLiked ? '600' : '500',
              }}>
                {post.likes}
              </Text>
            )}
          </TouchableOpacity>

          {/* Dislike button (optional) */}
          {onDislike && (
            <TouchableOpacity 
              onPress={handleDislike}
              style={{ 
                flexDirection: 'row', 
                alignItems: 'center',
                paddingVertical: 2,
                paddingHorizontal: 2,
              }}
              activeOpacity={0.8}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <ThumbsDown 
                size={18} 
                color={post.isDisliked ? '#EF4444' : themeColors.textSecondary}
                fill={post.isDisliked ? '#EF4444' : 'none'}
                strokeWidth={2}
              />
            </TouchableOpacity>
          )}

          {/* Reply button */}
          <TouchableOpacity 
            onPress={handleReply}
            style={{ 
              flexDirection: 'row', 
              alignItems: 'center',
              paddingVertical: 2,
              paddingHorizontal: 2,
            }}
            activeOpacity={0.8}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <MessageCircle size={18} color={themeColors.textSecondary} strokeWidth={2} />
            {post.replyCount > 0 && (
              <Text style={{
                ...textStyles.caption,
                color: themeColors.textSecondary,
                marginLeft: 4,
                fontWeight: '500',
              }}>
                {post.replyCount}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Right side - Actions with reduced spacing */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          {/* Bookmark button */}
          <TouchableOpacity 
            onPress={handleBookmark}
            style={{
              paddingVertical: 2,
              paddingHorizontal: 2,
            }}
            activeOpacity={0.8}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Bookmark 
              size={18} 
              color={post.isBookmarked ? '#F59E0B' : themeColors.textSecondary}
              fill={post.isBookmarked ? '#F59E0B' : 'none'}
              strokeWidth={2}
            />
          </TouchableOpacity>

          {/* Share button */}
          {onShare && (
            <TouchableOpacity 
              onPress={handleShare}
              style={{
                paddingVertical: 2,
                paddingHorizontal: 2,
              }}
              activeOpacity={0.8}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Send size={18} color={themeColors.textSecondary} strokeWidth={2} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
});

ForumPostCard.displayName = 'ForumPostCard';
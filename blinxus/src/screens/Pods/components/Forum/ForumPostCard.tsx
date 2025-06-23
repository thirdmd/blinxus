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
import { ForumPost, FORUM_CATEGORIES, FORUM_ACTIVITY_TAGS } from './forumTypes';
import { useThemeColors } from '../../../../hooks/useThemeColors';

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
  compact = false
}) => {
  const themeColors = useThemeColors();

  // ULTRA-RESPONSIVE: Memoized handlers to prevent re-renders
  const handleLike = useCallback(() => onLike(post.id), [onLike, post.id]);
  const handleDislike = useCallback(() => onDislike?.(post.id), [onDislike, post.id]);
  const handleBookmark = useCallback(() => onBookmark(post.id), [onBookmark, post.id]);
  const handleReply = useCallback(() => onReply?.(post.id), [onReply, post.id]);
  const handleShare = useCallback(() => onShare?.(post.id), [onShare, post.id]);
  const handleMore = useCallback(() => onMore?.(post.id), [onMore, post.id]);
  const handleAuthorPress = useCallback(() => onAuthorPress?.(post.authorId), [onAuthorPress, post.authorId]);

  // Get category data
  const categoryData = FORUM_CATEGORIES.find(cat => cat.id === post.category);

  // Format timestamp
  const formatTimestamp = (timestamp: string): string => {
    const now = new Date();
    const postDate = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'now';
    if (diffInHours < 24) return `${diffInHours}h`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d`;
    return `${Math.floor(diffInHours / 168)}w`;
  };

  return (
    <View 
      style={{
        backgroundColor: themeColors.background,
        borderRadius: 12,
        padding: compact ? 12 : 16,
        marginBottom: compact ? 12 : 16,
        borderWidth: 1,
        borderColor: themeColors.isDark 
          ? 'rgba(255, 255, 255, 0.08)'
          : 'rgba(0, 0, 0, 0.06)',
        // Add subtle shadow for depth
        shadowColor: themeColors.isDark ? '#000' : '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: themeColors.isDark ? 0.3 : 0.05,
        shadowRadius: 3,
        elevation: 2,
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
        
        {/* Activity Tags */}
        {post.activityTags.slice(0, compact ? 2 : 3).map((tagId) => {
          const tagData = FORUM_ACTIVITY_TAGS.find(tag => tag.id === tagId);
          return tagData ? (
            <TouchableOpacity
              key={tagId}
              onPress={() => onTagPress?.(tagId)}
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
          ) : null;
        })}
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
                fontSize: compact ? 14 : 16, 
                fontWeight: '600',
                fontFamily: 'System',
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
                color: themeColors.text,
                fontSize: compact ? 14 : 15,
                fontWeight: '600',
                fontFamily: 'System',
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
          
          {/* Location and Timestamp - Not Clickable */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
            <Text style={{ fontSize: 14, color: themeColors.textSecondary, marginRight: 4 }}>📍</Text>
            <Text style={{
              color: themeColors.textSecondary,
              fontSize: 14,
              fontFamily: 'System',
              fontWeight: '500',
            }}>
              {post.location.name.split('-').pop() || post.location.name} • {formatTimestamp(post.createdAt)}
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
      
      {/* Post Content */}
      <Text style={{
        color: themeColors.text,
        fontSize: compact ? 15 : 16,
        lineHeight: compact ? 20 : 22,
        fontFamily: 'System',
        marginBottom: 12,
      }}>
        {post.content}
      </Text>
      
      {/* ULTRA-RESPONSIVE: Engagement Bar */}
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 12,
        borderTopWidth: 0.5,
        borderTopColor: themeColors.isDark 
          ? 'rgba(255, 255, 255, 0.06)'
          : 'rgba(0, 0, 0, 0.04)',
      }}>
        {/* Left side - Interactions */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
          {/* Like button */}
          <TouchableOpacity 
            onPress={handleLike}
            style={{ 
              flexDirection: 'row', 
              alignItems: 'center',
              paddingVertical: 4,
              paddingHorizontal: 4,
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
                color: post.isLiked ? '#EF4444' : themeColors.textSecondary,
                fontSize: 14,
                marginLeft: 6,
                fontFamily: 'System',
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
                paddingVertical: 4,
                paddingHorizontal: 4,
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
              paddingVertical: 4,
              paddingHorizontal: 4,
            }}
            activeOpacity={0.8}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <MessageCircle size={18} color={themeColors.textSecondary} strokeWidth={2} />
            {post.replyCount > 0 && (
              <Text style={{
                color: themeColors.textSecondary,
                fontSize: 14,
                marginLeft: 6,
                fontFamily: 'System',
                fontWeight: '500',
              }}>
                {post.replyCount}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Right side - Actions */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          {/* Bookmark button */}
          <TouchableOpacity 
            onPress={handleBookmark}
            style={{
              paddingVertical: 4,
              paddingHorizontal: 4,
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
                paddingVertical: 4,
                paddingHorizontal: 4,
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
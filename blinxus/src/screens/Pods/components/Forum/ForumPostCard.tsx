// Individual Forum Post Card Component - Clean & Modern

import React from 'react';
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

export const ForumPostCard: React.FC<ForumPostCardProps> = ({
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
            activeOpacity={0.7}
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
              activeOpacity={0.7}
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
      <TouchableOpacity
        onPress={() => onAuthorPress?.(post.authorId)}
        style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          marginBottom: 12 
        }}
        activeOpacity={0.7}
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
        
        <View style={{ flex: 1 }}>
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

        {/* More options */}
        <TouchableOpacity
          onPress={() => onMore?.(post.id)}
          style={{
            padding: 4,
            borderRadius: 8,
          }}
          activeOpacity={0.7}
        >
          <MoreHorizontal size={18} color={themeColors.textSecondary} />
        </TouchableOpacity>
      </TouchableOpacity>
      
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
      
      {/* Engagement Bar */}
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 8,
        borderTopWidth: 0.5,
        borderTopColor: themeColors.isDark 
          ? 'rgba(255, 255, 255, 0.06)'
          : 'rgba(0, 0, 0, 0.04)',
      }}>
        {/* Left side - Interactions */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          {/* Like button */}
          <TouchableOpacity 
            onPress={() => onLike(post.id)}
            style={{ flexDirection: 'row', alignItems: 'center' }}
            activeOpacity={0.7}
          >
            <Heart 
              size={16} 
              color={post.isLiked ? '#EF4444' : themeColors.textSecondary}
              fill={post.isLiked ? '#EF4444' : 'none'}
            />
            {post.likes > 0 && (
              <Text style={{
                color: post.isLiked ? '#EF4444' : themeColors.textSecondary,
                fontSize: 14,
                marginLeft: 6,
                fontFamily: 'System',
                fontWeight: post.isLiked ? '600' : '400',
              }}>
                {post.likes}
              </Text>
            )}
          </TouchableOpacity>

          {/* Dislike button (optional) */}
          {onDislike && (
            <TouchableOpacity 
              onPress={() => onDislike(post.id)}
              style={{ flexDirection: 'row', alignItems: 'center' }}
              activeOpacity={0.7}
            >
              <ThumbsDown 
                size={16} 
                color={post.isDisliked ? '#EF4444' : themeColors.textSecondary}
                fill={post.isDisliked ? '#EF4444' : 'none'}
              />
            </TouchableOpacity>
          )}

          {/* Reply button */}
          <TouchableOpacity 
            onPress={() => onReply?.(post.id)}
            style={{ flexDirection: 'row', alignItems: 'center' }}
            activeOpacity={0.7}
          >
            <MessageCircle size={16} color={themeColors.textSecondary} />
            {post.replyCount > 0 && (
              <Text style={{
                color: themeColors.textSecondary,
                fontSize: 14,
                marginLeft: 6,
                fontFamily: 'System',
              }}>
                {post.replyCount}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Right side - Actions */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          {/* Bookmark button */}
          <TouchableOpacity 
            onPress={() => onBookmark(post.id)}
            activeOpacity={0.7}
          >
            <Bookmark 
              size={16} 
              color={post.isBookmarked ? '#F59E0B' : themeColors.textSecondary}
              fill={post.isBookmarked ? '#F59E0B' : 'none'}
            />
          </TouchableOpacity>

          {/* Share button - now using Send (paper plane) */}
          {onShare && (
            <TouchableOpacity 
              onPress={() => onShare(post.id)}
              activeOpacity={0.7}
            >
              <Send size={16} color={themeColors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}; 
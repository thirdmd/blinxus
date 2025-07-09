// blinxus/src/screens/Pods/components/Forum/ForumCommentsScreen.tsx
import React, { useState, useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  FlatList,
  Image,
  ScrollView,
  Keyboard,
  Pressable, // Import Pressable
  Alert, // Import Alert
} from 'react-native';
import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import { useHeaderHeight } from '@react-navigation/elements';
import { useSettings } from '../../../../contexts/SettingsContext';
import { ChevronLeft, Send, Heart, MessageCircle, Bookmark, X } from 'lucide-react-native';
import { useThemeColors } from '../../../../hooks/useThemeColors';
import { ForumPost, ForumReply, ForumUser } from './forumTypes';
import { getTextStyles, rf, ri } from '../../../../utils/responsive';
import { ForumTagsDisplay } from '../../../../utils/forumLocationLogic';
import { getCurrentUser } from '../../../../types/userData/users_data';
import { useComments } from '../../../../store/CommentsContext';
import { useLikedPosts } from '../../../../store/LikedPostsContext';
import { useSavedPosts } from '../../../../store/SavedPostsContext';
import { ForumPostCard } from './ForumPostCard';

type ForumCommentsScreenRouteProp = RouteProp<{ ForumComments: { post: ForumPost } }, 'ForumComments'>;

// Individual Comment Component
const CommentItem: React.FC<{ 
    comment: ForumReply; 
    post: ForumPost;
    currentUserId: string;
    level: number;
    onReply: (comment: ForumReply) => void;
    onLike: (commentId: string) => void;
    onDelete: (commentId: string) => void;
}> = React.memo(({ comment, post, currentUserId, level, onReply, onLike, onDelete }) => {
    const themeColors = useThemeColors();
    const textStyles = useMemo(getTextStyles, []);

    const isPostAuthor = comment.author.id === post.author.id;
    const textColor = themeColors.text;
    const textSecondaryColor = themeColors.textSecondary;

    const handleLike = () => {
        onLike(comment.id);
    };

    const formatTimestamp = (timestamp: string): string => {
        const now = new Date();
        const commentDate = new Date(timestamp);
        const diffSeconds = Math.floor((now.getTime() - commentDate.getTime()) / 1000);

        if (diffSeconds < 60) return `${diffSeconds}s`;
        const diffMinutes = Math.floor(diffSeconds / 60);
        if (diffMinutes < 60) return `${diffMinutes}m`;
        const diffHours = Math.floor(diffMinutes / 60);
        if (diffHours < 24) return `${diffHours}h`;
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays}d`;
    };

    const handleLongPress = () => {
        if (comment.author.id === currentUserId) {
            Alert.alert(
                "Delete Comment",
                "Are you sure you want to delete this comment?",
                [
                    { text: "Cancel", style: "cancel" },
                    { text: "Delete", style: "destructive", onPress: () => onDelete(comment.id) }
                ]
            );
        }
    };

    return (
        <Pressable onLongPress={handleLongPress}>
            <View style={{ marginLeft: level * 20, flexDirection: 'row', paddingHorizontal: 16, paddingTop: 16 }}>
                {(() => { const avatarSize = ri(36); return (
                    <Image source={{ uri: comment.author.avatarUrl }} style={{ width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2, marginRight: 12, marginTop: 4 }} />
                ); })()}
                
                <View style={{ flex: 1, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: themeColors.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }}>
                    <View style={{ 
                        backgroundColor: themeColors.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 16,
                    }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', flexShrink: 1 }}>
                                <Text style={{ ...textStyles.forumAuthor, color: textColor, marginRight: 4 }}>{comment.author.displayName}</Text>
                                {comment.author.nationalityFlag && (
                                    <Text style={{ fontSize: 12, marginRight: 6 }}>{comment.author.nationalityFlag}</Text>
                                )}
                                {isPostAuthor && (
                                    <View style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 }}>
                                        <Text style={{ color: '#3B82F6', fontSize: 10, fontWeight: '600' }}>Author</Text>
                                    </View>
                                )}
                            </View>
                            <Text style={{ ...textStyles.forumMeta, color: textSecondaryColor, marginLeft: 8 }}>
                                {formatTimestamp(comment.createdAt)}
                            </Text>
                        </View>
                        
                        <Text style={{ ...textStyles.forumContent, color: textColor, lineHeight: 20 }}>
                            {comment.replyToAuthor && (
                                <Text style={{ color: '#3B82F6', fontWeight: '500' }}>
                                    @{comment.replyToAuthor.displayName}{' '}
                                </Text>
                            )}
                            {comment.content}
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, paddingTop: 8, paddingLeft: 12 }}>
                        <TouchableOpacity onPress={handleLike} style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Heart
                                size={16}
                                color={comment.isLiked ? '#EF4444' : textSecondaryColor}
                                fill={comment.isLiked ? '#EF4444' : 'none'}
                                strokeWidth={2}
                            />
                            {comment.likes > 0 && (
                                <Text style={{ ...textStyles.forumMeta, color: comment.isLiked ? '#EF4444' : textSecondaryColor, marginLeft: 6 }}>
                                    {comment.likes}
                                </Text>
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => onReply(comment)}>
                            <Text style={{ ...textStyles.forumMeta, fontWeight: '500', color: textSecondaryColor }}>
                                Reply
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Pressable>
    );
});


// Main Screen Component
const ForumCommentsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<ForumCommentsScreenRouteProp>();
  const { post: initialPost } = route.params;
  const themeColors = useThemeColors();
  const textStyles = useMemo(getTextStyles, []);
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState<ForumReply | null>(null);
  const commentInputRef = useRef<TextInput>(null);

  const handleFocusCommentInput = () => {
      commentInputRef.current?.focus();
  };
  
  // Centralized State
  const { getCommentsForPost, addComment, likeComment, getCommentCountForPost, deleteComment } = useComments();
  const { isPostLiked, likePost, unlikePost } = useLikedPosts();
  const { isPostSaved, savePost, unsavePost } = useSavedPosts();

  const [post, setPost] = useState<ForumPost>(() => ({
    ...initialPost,
    isLiked: isPostLiked(initialPost.id),
    isBookmarked: isPostSaved(initialPost.id)
  }));
  const postComments = getCommentsForPost(post.id);
  const currentUser = getCurrentUser();

  const handlePostInteraction = (action: 'like' | 'bookmark') => {
    switch(action) {
        case 'like':
            const newLikedState = !post.isLiked;
            setPost((p) => ({ ...p, isLiked: newLikedState, likes: p.likes + (newLikedState ? 1 : -1) }));
            if (newLikedState) likePost(post.id);
            else unlikePost(post.id);
            break;
        case 'bookmark':
            const newBookmarkedState = !post.isBookmarked;
            setPost((p) => ({ ...p, isBookmarked: newBookmarkedState }));
            if (newBookmarkedState) savePost(post.id);
            else unsavePost(post.id);
            break;
    }
  }

  const handlePostComment = useCallback(() => {
    if (commentText.trim() === '') return;
    
    const author: ForumUser = {
        id: currentUser.id,
        username: currentUser.username,
        displayName: currentUser.displayName,
        avatarUrl: currentUser.profileImage,
        initials: currentUser.displayName.substring(0, 2).toUpperCase(),
        color: '#0047AB',
        nationalityFlag: currentUser.nationalityFlag,
        memberSince: currentUser.memberSince || new Date().toISOString(),
    };

    addComment(post.id, commentText.trim(), author, replyingTo?.id);
    setPost((prev) => ({...prev, replyCount: prev.replyCount + 1}));
    setReplyingTo(null);
    setCommentText('');
  }, [commentText, post.id, currentUser, addComment, replyingTo]);

  const handleDeleteComment = (commentId: string) => {
      deleteComment(post.id, commentId);
  };

  const renderHeader = () => (
    <>
        <ForumPostCard 
            post={post}
            compact={true}
            onShare={() => {}}
            onMore={() => {}}
            onAuthorPress={() => {}}
            onTagPress={() => {}}
            onCategoryPress={() => {}}
            onLocationPress={() => {}}
            onCommentIconPress={handleFocusCommentInput}
        />
        <Text style={{fontSize: rf(13), fontWeight: '600', color: themeColors.text, paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8}}>
            Comments ({getCommentCountForPost(post.id)})
        </Text>
    </>
  )

  const handleReply = (comment: ForumReply) => {
    setReplyingTo(comment);
    commentInputRef.current?.focus();
  };

  const handleLikeComment = (commentId: string) => {
    likeComment(post.id, commentId);
  };

  const renderComment = (comment: ForumReply, level: number) => {
      return (
          <React.Fragment key={comment.id}>
              <CommentItem
                  comment={comment}
                  post={post}
                  currentUserId={currentUser.id}
                  level={level}
                  onReply={handleReply}
                  onLike={handleLikeComment}
                  onDelete={handleDeleteComment}
              />
              {comment.replies && comment.replies.map(reply => renderComment(reply, level + 1))}
          </React.Fragment>
      );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 10,
            paddingVertical: 8,
            height: 52,
        }}>
            <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
                <ChevronLeft size={24} color={themeColors.text} />
            </TouchableOpacity>
        </View>

        <FlatList
          data={postComments}
          renderItem={({ item }) => renderComment(item, 0)}
          keyExtractor={item => item.id}
          ListHeaderComponent={ <View> {renderHeader()} </View> }
          style={{ flex: 1 }}
        />
        
        <View style={{
            flexDirection: 'column', // Changed to column for stacking
            paddingHorizontal: 8,
            paddingTop: 8,
            paddingBottom: Platform.OS === 'ios' ? 8 : 4,
            borderTopWidth: 1,
            borderTopColor: themeColors.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
            backgroundColor: themeColors.background
        }}>
            {replyingTo && (
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: 8,
                    paddingBottom: 4,
                }}>
                    <Text style={{...textStyles.caption, color: themeColors.textSecondary}}>
                        Replying to {replyingTo.author.displayName}
                    </Text>
                    <TouchableOpacity onPress={() => setReplyingTo(null)}>
                        <X size={16} color={themeColors.textSecondary} />
                    </TouchableOpacity>
                </View>
            )}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextInput
                    ref={commentInputRef}
                    style={{
                    flex: 1,
                    minHeight: 40,
                    backgroundColor: themeColors.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                    borderRadius: 20,
                    paddingHorizontal: 16,
                    paddingTop: Platform.OS === 'ios' ? 12 : 10,
                    paddingBottom: Platform.OS === 'ios' ? 12 : 10,
                    color: themeColors.text,
                    marginRight: 8,
                    }}
                    placeholder="Add a comment..."
                    placeholderTextColor={themeColors.isDark ? '#9CA3AF' : '#6B7280'}
                    value={commentText}
                    onChangeText={setCommentText}
                    multiline
                />
                <TouchableOpacity
                    onPress={handlePostComment}
                    disabled={commentText.trim().length === 0}
                    style={{ paddingHorizontal: 12, paddingVertical: 8 }}
                >
                    <Send 
                        size={24} 
                        color={commentText.trim().length > 0 ? themeColors.cobaltLight : themeColors.textSecondary} 
                    />
                </TouchableOpacity>
            </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ForumCommentsScreen; 
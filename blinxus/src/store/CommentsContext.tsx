import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';
import { ForumReply, ForumUser } from '../screens/Pods/components/Forum/forumTypes';

// This will store comments for all posts in a single object for efficient lookup.
// The key is the postId, and the value is an array of comments for that post.
type CommentsStore = Record<string, ForumReply[]>;

// Recursive helper to count all nested replies
const countAllReplies = (comments: ForumReply[]): number => {
    let count = comments.length;
    for (const comment of comments) {
        if (comment.replies) {
            count += countAllReplies(comment.replies);
        }
    }
    return count;
};

interface CommentsContextType {
  comments: CommentsStore;
  getCommentsForPost: (postId: string) => ForumReply[];
  getCommentCountForPost: (postId: string) => number;
  addComment: (postId: string, content: string, author: ForumUser, parentReplyId?: string) => void;
  likeComment: (postId: string, commentId: string) => void;
  deleteComment: (postId: string, commentId: string) => void;
}

const CommentsContext = createContext<CommentsContextType | undefined>(undefined);

// Recursive function to add a reply to a nested structure
const addReplyToComment = (comments: ForumReply[], parentReplyId: string, newReply: ForumReply): ForumReply[] => {
    return comments.map(comment => {
        if (comment.id === parentReplyId) {
            return {
                ...comment,
                replies: [newReply, ...(comment.replies || [])]
            };
        }
        if (comment.replies) {
            return {
                ...comment,
                replies: addReplyToComment(comment.replies, parentReplyId, newReply)
            };
        }
        return comment;
    });
};

const deleteCommentRecursive = (comments: ForumReply[], commentId: string): ForumReply[] => {
    // Filter out the comment to be deleted at the current level
    const filteredComments = comments.filter(comment => comment.id !== commentId);

    // If a comment was removed, we're done at this level. If not, check replies.
    if (filteredComments.length < comments.length) {
        return filteredComments;
    }

    // Recursively process replies for each comment
    return comments.map(comment => {
        if (comment.replies) {
            return {
                ...comment,
                replies: deleteCommentRecursive(comment.replies, commentId)
            };
        }
        return comment;
    });
};


export const CommentsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [comments, setComments] = useState<CommentsStore>({});

  const getCommentsForPost = useCallback((postId: string): ForumReply[] => {
    return comments[postId] || [];
  }, [comments]);

  const getCommentCountForPost = useCallback((postId: string): number => {
      const postComments = comments[postId] || [];
      return countAllReplies(postComments);
  }, [comments]);

  const addComment = useCallback((postId: string, content: string, author: ForumUser, parentReplyId?: string) => {
    const newComment: ForumReply = {
      id: `reply-${Date.now()}`,
      postId,
      authorId: author.id,
      author,
      content,
      parentReplyId,
      likes: 0,
      dislikes: 0,
      isLiked: false,
      isDisliked: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active',
      replies: []
    };

    setComments(prev => {
        const postComments = prev[postId] || [];
        let updatedComments;

        if (parentReplyId) {
            // It's a nested reply
            updatedComments = addReplyToComment(postComments, parentReplyId, newComment);
        } else {
            // It's a top-level comment
            updatedComments = [newComment, ...postComments];
        }
        
        return {
            ...prev,
            [postId]: updatedComments,
        };
    });
  }, []);

  const likeComment = useCallback((postId: string, commentId: string) => {
        const likeCommentRecursive = (commentList: ForumReply[]): ForumReply[] => {
            return commentList.map(comment => {
                if (comment.id === commentId) {
                    return { ...comment, isLiked: !comment.isLiked, likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1 };
                }
                if (comment.replies) {
                    return { ...comment, replies: likeCommentRecursive(comment.replies) };
                }
                return comment;
            });
        };

        setComments(prevComments => ({
            ...prevComments,
            [postId]: likeCommentRecursive(prevComments[postId] || [])
        }));
    }, []);

  const deleteComment = useCallback((postId: string, commentId: string) => {
        setComments(prevComments => {
            const postComments = prevComments[postId] || [];
            const updatedComments = deleteCommentRecursive(postComments, commentId);
            return {
                ...prevComments,
                [postId]: updatedComments
            };
        });
    }, []);

  const value = useMemo(() => ({
        comments,
        getCommentsForPost,
        getCommentCountForPost,
        addComment,
        likeComment,
        deleteComment,
    }), [comments, getCommentsForPost, getCommentCountForPost, addComment, likeComment, deleteComment]);

  return (
    <CommentsContext.Provider value={value}>
      {children}
    </CommentsContext.Provider>
  );
};

export const useComments = () => {
  const context = useContext(CommentsContext);
  if (context === undefined) {
    throw new Error('useComments must be used within a CommentsProvider');
  }
  return context;
}; 
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LikedPost {
  postId: string;
  likedAt: string; // ISO timestamp when the post was liked
}

interface LikedPostsContextType {
  likedPostIds: string[];
  likedPosts: LikedPost[];
  likePost: (postId: string) => void;
  unlikePost: (postId: string) => void;
  isPostLiked: (postId: string) => boolean;
}

const LikedPostsContext = createContext<LikedPostsContextType | undefined>(undefined);

export const LikedPostsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [likedPosts, setLikedPosts] = useState<LikedPost[]>([]);
  
  // Keep likedPostIds for backward compatibility
  const likedPostIds = likedPosts.map(liked => liked.postId);

  const likePost = (postId: string) => {
    setLikedPosts(prev => {
      if (!prev.some(liked => liked.postId === postId)) {
        return [...prev, { postId, likedAt: new Date().toISOString() }];
      }
      return prev;
    });
  };

  const unlikePost = (postId: string) => {
    setLikedPosts(prev => prev.filter(liked => liked.postId !== postId));
  };

  const isPostLiked = (postId: string) => {
    return likedPosts.some(liked => liked.postId === postId);
  };

  return (
    <LikedPostsContext.Provider value={{ likedPostIds, likedPosts, likePost, unlikePost, isPostLiked }}>
      {children}
    </LikedPostsContext.Provider>
  );
};

export const useLikedPosts = () => {
  const context = useContext(LikedPostsContext);
  if (context === undefined) {
    throw new Error('useLikedPosts must be used within a LikedPostsProvider');
  }
  return context;
}; 
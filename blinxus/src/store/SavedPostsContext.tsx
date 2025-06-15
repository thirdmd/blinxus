import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SavedPost {
  postId: string;
  savedAt: string; // ISO timestamp when the post was saved
}

interface SavedPostsContextType {
  savedPostIds: string[];
  savedPosts: SavedPost[];
  savePost: (postId: string) => void;
  unsavePost: (postId: string) => void;
  isPostSaved: (postId: string) => boolean;
}

const SavedPostsContext = createContext<SavedPostsContextType | undefined>(undefined);

export const SavedPostsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [savedPosts, setSavedPosts] = useState<SavedPost[]>([]);
  
  // Keep savedPostIds for backward compatibility
  const savedPostIds = savedPosts.map(saved => saved.postId);

  const savePost = (postId: string) => {
    setSavedPosts(prev => {
      if (!prev.some(saved => saved.postId === postId)) {
        return [...prev, { postId, savedAt: new Date().toISOString() }];
      }
      return prev;
    });
  };

  const unsavePost = (postId: string) => {
    setSavedPosts(prev => prev.filter(saved => saved.postId !== postId));
  };

  const isPostSaved = (postId: string) => {
    return savedPosts.some(saved => saved.postId === postId);
  };

  return (
    <SavedPostsContext.Provider value={{ savedPostIds, savedPosts, savePost, unsavePost, isPostSaved }}>
      {children}
    </SavedPostsContext.Provider>
  );
};

export const useSavedPosts = () => {
  const context = useContext(SavedPostsContext);
  if (context === undefined) {
    throw new Error('useSavedPosts must be used within a SavedPostsProvider');
  }
  return context;
}; 
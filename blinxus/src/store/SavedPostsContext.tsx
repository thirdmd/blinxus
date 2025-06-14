import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SavedPostsContextType {
  savedPostIds: string[];
  savePost: (postId: string) => void;
  unsavePost: (postId: string) => void;
  isPostSaved: (postId: string) => boolean;
}

const SavedPostsContext = createContext<SavedPostsContextType | undefined>(undefined);

export const SavedPostsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [savedPostIds, setSavedPostIds] = useState<string[]>([]);

  const savePost = (postId: string) => {
    setSavedPostIds(prev => {
      if (!prev.includes(postId)) {
        return [...prev, postId];
      }
      return prev;
    });
  };

  const unsavePost = (postId: string) => {
    setSavedPostIds(prev => prev.filter(id => id !== postId));
  };

  const isPostSaved = (postId: string) => {
    return savedPostIds.includes(postId);
  };

  return (
    <SavedPostsContext.Provider value={{ savedPostIds, savePost, unsavePost, isPostSaved }}>
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
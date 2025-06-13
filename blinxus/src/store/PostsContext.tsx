import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Post, initialPostsData } from '../types/userData/posts_data';
import { ActivityKey } from '../constants/activityTags';

interface PostsContextType {
  posts: Post[];
  addPost: (post: Omit<Post, 'id' | 'timestamp' | 'timeAgo' | 'likes' | 'comments'>) => void;
  deletePost: (postId: string) => void;
  editPost: (postId: string, updates: { content?: string; location?: string; activity?: ActivityKey }) => void;
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

export const PostsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>(initialPostsData);

  const addPost = (newPostData: Omit<Post, 'id' | 'timestamp' | 'timeAgo' | 'likes' | 'comments'>) => {
    const newPost: Post = {
      ...newPostData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      timeAgo: 'now',
      likes: 0,
      comments: 0,
    };
    
    setPosts(prevPosts => [newPost, ...prevPosts]); // Add to beginning of array
  };

  const deletePost = (postId: string) => {
    setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
  };

  const editPost = (postId: string, updates: { content?: string; location?: string; activity?: ActivityKey }) => {
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          const currentAttempts = post.editAttempts || 0;
          
          // Check if trying to edit location or activity after first attempt
          const isLocationOrActivityEdit = updates.location !== undefined || updates.activity !== undefined;
          
          if (isLocationOrActivityEdit && currentAttempts >= 1) {
            // Don't allow location/activity changes after first edit
            return {
              ...post,
              content: updates.content !== undefined ? updates.content : post.content,
              isEdited: true
            };
          }
          
          // Allow the edit and increment attempts if location/activity is being changed
          return {
            ...post,
            ...updates,
            isEdited: true,
            editAttempts: isLocationOrActivityEdit ? currentAttempts + 1 : currentAttempts
          };
        }
        return post;
      })
    );
  };

  return (
    <PostsContext.Provider value={{ posts, addPost, deletePost, editPost }}>
      {children}
    </PostsContext.Provider>
  );
};

export const usePosts = () => {
  const context = useContext(PostsContext);
  if (context === undefined) {
    throw new Error('usePosts must be used within a PostsProvider');
  }
  return context;
}; 
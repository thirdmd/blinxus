import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Post, initialPostsData } from '../types/userData/posts_data';
import { ActivityKey } from '../constants/activityTags';

interface PostsContextType {
  posts: Post[];
  addPost: (post: Omit<Post, 'id' | 'timestamp' | 'timeAgo' | 'likes' | 'comments'>) => void;
  deletePost: (postId: string) => void;
  editPost: (postId: string, updates: { content?: string; location?: string; activity?: ActivityKey }) => void;
  likePost: (postId: string) => void;
  unlikePost: (postId: string) => void;
  addComment: (postId: string) => void;
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
          // Track location and activity edits separately
          const locationEditCount = post.locationEditCount || 0;
          const activityEditCount = post.activityEditCount || 0;
          
          // Check what's being edited
          const isLocationEdit = updates.location !== undefined;
          const isActivityEdit = updates.activity !== undefined;
          
          // Check if location edit is allowed (if trying to edit location)
          const canEditLocation = !isLocationEdit || locationEditCount < 1;
          
          // Check if activity edit is allowed (if trying to edit activity)
          const canEditActivity = !isActivityEdit || activityEditCount < 1;
          
          // If trying to edit something that's already been edited, don't allow it
          if (!canEditLocation || !canEditActivity) {
            return post; // Return unchanged post
          }
          
          // Allow the edit and increment appropriate counters
          return {
            ...post,
            ...updates,
            isEdited: true,
            locationEditCount: isLocationEdit ? locationEditCount + 1 : locationEditCount,
            activityEditCount: isActivityEdit ? activityEditCount + 1 : activityEditCount
          };
        }
        return post;
      })
    );
  };

  const likePost = (postId: string) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { ...post, likes: post.likes + 1 }
          : post
      )
    );
  };

  const unlikePost = (postId: string) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { ...post, likes: Math.max(0, post.likes - 1) }
          : post
      )
    );
  };

  const addComment = (postId: string) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { ...post, comments: post.comments + 1 }
          : post
      )
    );
  };

  return (
    <PostsContext.Provider value={{ posts, addPost, deletePost, editPost, likePost, unlikePost, addComment }}>
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
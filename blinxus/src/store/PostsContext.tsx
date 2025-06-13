import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Post, initialPostsData } from '../types/userData/posts_data';

interface PostsContextType {
  posts: Post[];
  addPost: (post: Omit<Post, 'id' | 'timestamp' | 'timeAgo' | 'likes' | 'comments'>) => void;
  deletePost: (postId: string) => void;
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

  return (
    <PostsContext.Provider value={{ posts, addPost, deletePost }}>
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
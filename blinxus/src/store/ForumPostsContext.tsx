import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { ForumPost } from '../screens/Pods/components/Forum/forumTypes';

interface PostsContextType {
    posts: ForumPost[];
    setPosts: (posts: ForumPost[]) => void;
    addPosts: (newPosts: ForumPost[]) => void;
    updatePost: (postId: string, updates: Partial<ForumPost>) => void;
    likePost: (postId: string) => void;
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

export const PostsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [posts, setPosts] = useState<ForumPost[]>([]);

    const addPosts = useCallback((newPosts: ForumPost[]) => {
        setPosts(prevPosts => {
            const existingIds = new Set(prevPosts.map(p => p.id));
            const uniqueNewPosts = newPosts.filter(p => !existingIds.has(p.id));
            return [...prevPosts, ...uniqueNewPosts];
        });
    }, []);

    const updatePost = useCallback((postId: string, updates: Partial<ForumPost>) => {
        setPosts(prevPosts =>
            prevPosts.map(p => (p.id === postId ? { ...p, ...updates } : p))
        );
    }, []);

    const likePost = useCallback((postId: string) => {
        setPosts(prevPosts =>
            prevPosts.map(p => {
                if (p.id === postId) {
                    const isLiked = !p.isLiked;
                    const likes = p.likes + (isLiked ? 1 : -1);
                    return { ...p, isLiked, likes };
                }
                return p;
            })
        );
    }, []);

    const value = {
        posts,
        setPosts,
        addPosts,
        updatePost,
        likePost,
    };

    return (
        <PostsContext.Provider value={value}>
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
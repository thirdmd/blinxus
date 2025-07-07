import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { PostCardProps } from '../types/structures/posts_structure';

/**
 * Simple navigation helper for immersive feed experience
 * Provides the exact TikTok-style fullscreen experience from ExploreScreen
 */
export class ImmersiveNavigation {
  /**
   * Navigate to immersive feed with TikTok-style experience
   * @param navigation - React Navigation navigation object
   * @param posts - Array of posts to display
   * @param selectedPost - The post that was pressed
   * @param title - Optional title for the screen
   */
  static navigateToImmersiveFeed(
    navigation: NavigationProp<ParamListBase>,
    posts: PostCardProps[],
    selectedPost: PostCardProps,
    title: string = 'Feed'
  ): void {
    try {
      // Find the index of the selected post
      const initialIndex = posts.findIndex(post => post.id === selectedPost.id);
      
      // Navigate to immersive feed screen
      navigation.navigate('ImmersiveFeed', {
        posts,
        initialIndex: Math.max(0, initialIndex),
        title
      });
    } catch (error) {
      console.warn('Failed to navigate to immersive feed:', error);
    }
  }

  /**
   * Navigate from a specific post in a list
   * @param navigation - React Navigation navigation object
   * @param allPosts - All posts in the current context
   * @param selectedPost - The specific post that was pressed
   * @param title - Optional title for the screen
   */
  static navigateFromPostInList(
    navigation: NavigationProp<ParamListBase>,
    allPosts: PostCardProps[],
    selectedPost: PostCardProps,
    title: string = 'Feed'
  ): void {
    this.navigateToImmersiveFeed(navigation, allPosts, selectedPost, title);
  }
} 
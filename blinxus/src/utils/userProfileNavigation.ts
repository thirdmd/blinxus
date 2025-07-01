// src/utils/userProfileNavigation.ts
// Centralized User Profile Navigation - Backend Ready & Future Proof

import { NavigationProp, ParamListBase } from '@react-navigation/native';

export interface UserProfileNavigationConfig {
  userId?: string;
  username: string;
  fromScreen: string;
  scrollPosition?: number;
  scrollRef?: React.RefObject<any>;
  additionalParams?: Record<string, any>;
}

export interface UserNavigationContext {
  fromFeed: boolean;
  previousScreen: string;
  userId?: string;
  scrollPosition?: number;
  [key: string]: any;
}

export class UserProfileNavigation {
  
  /**
   * Navigate to any user's profile with consistent behavior
   * Handles both current user and other users (backend ready)
   */
  static navigateToUserProfile(
    navigation: NavigationProp<ParamListBase>,
    config: UserProfileNavigationConfig
  ): void {
    const { userId, username, fromScreen, scrollPosition, scrollRef, additionalParams } = config;
    
    // Determine if this is the current user or another user
    const isCurrentUser = username === 'Third Camacho' || userId === 'current_user';
    
    if (isCurrentUser) {
      // Navigate to current user's Profile screen
      (navigation as any).navigate('Profile', {
        fromFeed: true,
        previousScreen: fromScreen,
        scrollPosition: scrollPosition,
        ...additionalParams
      });
    } else {
      // For now, show alert for mock users (no backend yet)
      // TODO: Replace with actual UserProfile navigation when backend is ready
      const Alert = require('react-native').Alert;
      Alert.alert(
        'Profile Unavailable',
        `${username}'s profile will be available when user accounts are implemented.`,
        [{ text: 'OK', style: 'default' }]
      );
      
      // Future implementation (uncomment when UserProfile screen exists):
      // (navigation as any).navigate('UserProfile', {
      //   userId: userId || username,
      //   username: username,
      //   fromFeed: true,
      //   previousScreen: fromScreen,
      //   scrollPosition: scrollPosition,
      //   ...additionalParams
      // });
    }
  }

  /**
   * Get standardized navigation context for user profile screens
   */
  static getNavigationContext(route: any): UserNavigationContext {
    const params = route.params || {};
    return {
      fromFeed: params.fromFeed || false,
      previousScreen: params.previousScreen || 'Unknown',
      userId: params.userId,
      scrollPosition: params.scrollPosition,
      ...params
    };
  }

  /**
   * Handle back navigation from user profile with scroll position restoration
   */
  static handleBackNavigation(
    navigation: NavigationProp<ParamListBase>,
    context: UserNavigationContext,
    scrollRef?: React.RefObject<any>
  ): void {
    if (context.fromFeed && context.previousScreen) {
      // Use existing NavigationManager for consistent back behavior
      const { NavigationManager } = require('./navigationManager');
      NavigationManager.goBack({
        navigation: navigation as any,
        previousScreen: context.previousScreen,
        scrollPosition: context.scrollPosition,
        scrollRef: scrollRef
      });
    } else {
      // Fallback to simple back navigation
      (navigation as any).goBack();
    }
  }

  /**
   * Create reusable profile press handler for any component
   * This is the main function components will import and use
   */
  static createProfilePressHandler(
    navigation: NavigationProp<ParamListBase>,
    fromScreen: string
  ) {
    return (config: {
      userId?: string;
      username: string;
      scrollPosition?: number;
      scrollRef?: React.RefObject<any>;
      additionalParams?: Record<string, any>;
    }) => {
      UserProfileNavigation.navigateToUserProfile(navigation, {
        ...config,
        fromScreen
      });
    };
  }

  /**
   * Validate if user profile navigation is possible
   */
  static canNavigateToProfile(username?: string, userId?: string): boolean {
    return Boolean(username || userId);
  }

  /**
   * Get user display info for navigation
   */
  static getUserDisplayInfo(user: {
    id?: string;
    username?: string;
    authorName?: string;
    authorId?: string;
  }) {
    return {
      userId: user.id || user.authorId,
      username: user.username || user.authorName || 'Unknown User'
    };
  }

  /**
   * Create profile navigation handlers for specific screen types
   */
  static createHandlersForScreen(
    navigation: NavigationProp<ParamListBase>,
    screenName: string
  ) {
    const handleProfilePress = this.createProfilePressHandler(navigation, screenName);
    
    return {
      // For TravelFeedCard posts
      handleTravelFeedProfile: (post: {
        authorId?: string;
        authorName: string;
        scrollPosition?: number;
        scrollRef?: React.RefObject<any>;
      }) => {
        handleProfilePress({
          userId: post.authorId,
          username: post.authorName,
          scrollPosition: post.scrollPosition,
          scrollRef: post.scrollRef
        });
      },

      // For ForumPostCard posts  
      handleForumPostProfile: (post: {
        authorId: string;
        author: { displayName: string };
        scrollPosition?: number;
        scrollRef?: React.RefObject<any>;
      }) => {
        handleProfilePress({
          userId: post.authorId,
          username: post.author.displayName,
          scrollPosition: post.scrollPosition,
          scrollRef: post.scrollRef
        });
      },

      // Generic handler for any user
      handleUserProfile: (user: {
        id?: string;
        username?: string;
        name?: string;
        scrollPosition?: number;
        scrollRef?: React.RefObject<any>;
      }) => {
        const userInfo = this.getUserDisplayInfo({
          id: user.id,
          username: user.username || user.name
        });
        
        handleProfilePress({
          userId: userInfo.userId,
          username: userInfo.username,
          scrollPosition: user.scrollPosition,
          scrollRef: user.scrollRef
        });
      }
    };
  }
}

export default UserProfileNavigation; 
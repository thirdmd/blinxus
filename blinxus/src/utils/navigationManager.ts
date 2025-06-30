import { NavigationProp, ParamListBase } from '@react-navigation/native';

export interface BackNavigationConfig {
  navigation: NavigationProp<ParamListBase>;
  previousScreen?: string;
  scrollPosition?: number;
  scrollRef?: React.RefObject<any>;
  customHandler?: () => void;
}

export class NavigationManager {
  // Centralized back navigation with consistent behavior
  static goBack(config: BackNavigationConfig) {
    const { navigation, previousScreen, scrollPosition, scrollRef, customHandler } = config;

    // If custom handler is provided, use it
    if (customHandler) {
      customHandler();
      return;
    }

    // Handle scroll position restoration if provided
    if (scrollRef?.current && scrollPosition !== undefined) {
      setTimeout(() => {
        if (scrollRef.current?.scrollTo) {
          scrollRef.current.scrollTo({ y: scrollPosition, animated: false });
        } else if (scrollRef.current?.scrollToOffset) {
          scrollRef.current.scrollToOffset({ offset: scrollPosition, animated: false });
        }
      }, 100);
    }

    // Navigate based on previous screen context
    if (previousScreen) {
      switch (previousScreen) {
        case 'Explore':
          (navigation as any).navigate('MainTabs', { screen: 'Home' });
          break;
        case 'Forum':
          (navigation as any).navigate('MainTabs', { screen: 'Pods' });
          break;
        case 'Library':
          // For Library, just goBack since it's within the Profile screen
          if (navigation.canGoBack()) {
            navigation.goBack();
          }
          break;
        case 'PostDetail':
          // For post detail, use generic goBack since it's a modal/overlay
          if (navigation.canGoBack()) {
            navigation.goBack();
          }
          break;
        default:
          // Fallback to generic goBack
          if (navigation.canGoBack()) {
            navigation.goBack();
          }
          break;
      }
    } else {
      // Default back behavior
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    }
  }

  // Specific navigation patterns
  static goBackToFeed(navigation: NavigationProp<ParamListBase>, feedType: 'explore' | 'profile' | 'pods') {
    switch (feedType) {
      case 'explore':
        (navigation as any).navigate('MainTabs', { screen: 'Home' });
        break;
      case 'profile':
        (navigation as any).navigate('MainTabs', { screen: 'Profile' });
        break;
      case 'pods':
        (navigation as any).navigate('MainTabs', { screen: 'Pods' });
        break;
    }
  }

  // Navigate to profile with context
  static navigateToProfile(
    navigation: NavigationProp<ParamListBase>, 
    fromScreen: string, 
    authorName?: string
  ) {
    if (authorName === 'Third Camacho') {
      // Navigate to current user's profile
      (navigation as any).navigate('Profile', { 
        fromFeed: true,
        previousScreen: fromScreen 
      });
    } else {
      // Navigate to other user's profile (future implementation)
      // (navigation as any).navigate('UserProfile', { 
      //   userId: authorId,
      //   fromFeed: true,
      //   previousScreen: fromScreen 
      // });
    }
  }

  // Clear navigation params
  static clearNavigationParams(navigation: NavigationProp<ParamListBase>) {
    (navigation as any).setParams({ 
      fromFeed: false, 
      previousScreen: undefined 
    });
  }
}

export default NavigationManager; 
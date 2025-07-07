import './global.css';
import React, { useRef, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, FlatList, StatusBar, Image, LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from './blinxus/src/constants/colors';
import { Home, Users2, UserCircle, Bell, Plus } from 'lucide-react-native';
import ScrollContext, { useScrollContext } from './blinxus/src/contexts/ScrollContext';
import { useThemeColors } from './blinxus/src/hooks/useThemeColors';
import { getResponsiveDimensions, getTypographyScale, ri, rs, rf } from './blinxus/src/utils/responsive';
import { getCurrentUser } from './blinxus/src/types/userData/users_data';

// Suppress the specific warning about text strings outside <Text>
LogBox.ignoreLogs(['Text strings must be rendered within a <Text> component']);

// Import screens
import ExploreScreen, { ExploreScreenRef } from './blinxus/src/screens/Explore/ExploreScreen';
import ProfileScreen, { ProfileScreenRef } from './blinxus/src/screens/Profile/ProfileScreen';
import PodsMainScreen, { PodsMainScreenRef } from './blinxus/src/screens/Pods/PodsMainScreen';
import CreatePost from './blinxus/src/screens/Create/CreatePost';
import NotificationsScreen from './blinxus/src/screens/NotificationsScreen';
import LucidFullscreen from './blinxus/src/screens/LucidFullscreen';
import SplashScreen from './blinxus/src/screens/SplashScreen';
import ImmersiveFeedScreen from './blinxus/src/screens/ImmersiveFeed/ImmersiveFeedScreen';
import ProfileViewScreen from './blinxus/src/screens/Profile/ProfileViewScreen';
import LocationViewScreen from './blinxus/src/screens/Pods/LocationViewScreen';

// Import context
import { PostsProvider } from './blinxus/src/store/PostsContext';
import { SavedPostsProvider } from './blinxus/src/store/SavedPostsContext';
import { LikedPostsProvider } from './blinxus/src/store/LikedPostsContext';
import { JoinedPodsProvider } from './blinxus/src/store/JoinedPodsContext';
import { ThemeProvider } from './blinxus/src/contexts/ThemeContext';
import { SettingsProvider } from './blinxus/src/contexts/SettingsContext';

// Create navigators
const Tab = createBottomTabNavigator();
const RootStack = createStackNavigator();

// Profile Tab Icon - Shows actual user profile picture
function ProfileTabIcon({ color, focused }: { color: string; focused: boolean }) {
  const currentUser = getCurrentUser();
  const iconSize = ri(26); // Increased from 24 to 28
  
  return (
    <View style={{
      width: iconSize,
      height: iconSize,
      borderRadius: iconSize / 2,
      borderWidth: focused ? 2.5 : 2.0, // Made 0.5px thicker (was 2.0 : 1.5)
      borderColor: color,
      overflow: 'hidden',
    }}>
      {currentUser.profileImage ? (
        <Image
          source={{ uri: currentUser.profileImage }}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: iconSize / 2,
          }}
        />
      ) : (
        <View style={{
          width: '100%',
          height: '100%',
          backgroundColor: color,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: iconSize / 2,
        }}>
          <Text style={{
            color: 'white',
            fontSize: ri(10),
            fontWeight: '600',
            fontFamily: 'System',
          }}>
            {currentUser.displayName.charAt(0).toUpperCase()}
          </Text>
        </View>
      )}
    </View>
  );
}

// Subtle Square Create Icon Component - Conditional colors based on current screen
function SubtleCreateIcon({ color, size, focused, isOnExploreScreen }: { color: string; size: number; focused: boolean; isOnExploreScreen: boolean }) {
  // Use white colors only when on Explore screen (dark mode), otherwise use original blue theme
  const borderColor = isOnExploreScreen ? '#FFFFFF' : '#0047AB';
  const backgroundColor = isOnExploreScreen 
    ? (focused ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.06)')
    : (focused ? 'rgba(0, 71, 171, 0.12)' : 'rgba(0, 71, 171, 0.06)');
  const iconColor = isOnExploreScreen ? '#FFFFFF' : '#0047AB';
  
  return (
    <View style={{
      width: size,
      height: size,
      borderRadius: size * 0.25, // Subtle rounded square
      borderWidth: focused ? 1.9 : 2, // Keep original thickness for Create
      borderColor: borderColor,
      backgroundColor: backgroundColor,
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* Minimal plus inside - Conditional color */}
      <View style={{
        width: size * 0.42,
        height: 1.5, // Keep thin
        backgroundColor: iconColor,
        borderRadius: 0.75,
      }} />
      <View style={{
        width: 1.5, // Keep thin
        height: size * 0.42,
        backgroundColor: iconColor,
        borderRadius: 0.75,
        position: 'absolute',
      }} />
    </View>
  );
}

// Tab Icons - Made 0.5px thicker except Create
function TabIcon({ name, color, focused, isOnExploreScreen }: { name: string; color: string; focused: boolean; isOnExploreScreen?: boolean }) {
  const iconSize = ri(21.5); // ALL icons same size
  const strokeWidth = focused ? 2 : 1.8; // Made 0.5px thicker (was 2.0 : 1.5)
  
  switch (name) {
    case 'Home':
      return <Home size={iconSize} color={color} strokeWidth={strokeWidth} />;
    case 'Pods':
      return <Users2 size={iconSize} color={color} strokeWidth={strokeWidth} />;
    case 'Create':
      return <SubtleCreateIcon color={color} size={iconSize} focused={focused} isOnExploreScreen={isOnExploreScreen || false} />;
    case 'Notifications':
      return <Bell size={iconSize} color={color} strokeWidth={strokeWidth} />;
    case 'Profile':
      return <ProfileTabIcon color={color} focused={focused} />;
    default:
      return <Home size={iconSize} color={color} strokeWidth={strokeWidth} />;
  }
}

// Wrapper components to avoid inline functions
const ExploreScreenWithRef = React.memo(React.forwardRef<ExploreScreenRef>((props, ref) => {
  return <ExploreScreen ref={ref} />;
}));

const PodsScreenWithRef = React.memo(React.forwardRef<PodsMainScreenRef>((props, ref) => {
  return <PodsMainScreen ref={ref} />;
}));

const ProfileScreenWithRef = React.memo(React.forwardRef<ProfileScreenRef>((props, ref) => {
  return <ProfileScreen ref={ref} />;
}));

const EmptyComponent = () => null;

// Tab Navigator
function TabNavigator() {
  const themeColors = useThemeColors();
  const responsiveDimensions = getResponsiveDimensions();
  const typography = getTypographyScale();
  const exploreScrollRef = useRef<FlatList>(null);
  const podsScrollRef = useRef<ScrollView>(null);
  const profileScrollRef = useRef<ScrollView>(null);
  const exploreScreenRef = useRef<ExploreScreenRef>(null);
  const podsScreenRef = useRef<PodsMainScreenRef>(null);
  const profileScreenRef = useRef<ProfileScreenRef>(null);
  
  // Double tap detection
  const lastTapRef = useRef<{ [key: string]: number }>({});
  
  // Track the previously active tab
  const previousTabRef = useRef<string>('Home');
  
  const handleTabPress = (routeName: string, navigation: any, isFocused: boolean) => {
    const now = Date.now();
    const lastTap = lastTapRef.current[routeName] || 0;
    const isDoubleTap = now - lastTap < 300; // Double tap detected (within 300ms)
    
    // Special handling for Create button - FIXED: Always navigate immediately
    if (routeName === 'Create') {
      navigation.navigate('CreatePost');
      lastTapRef.current[routeName] = now;
      return;
    }
    
    if (isFocused) {
      // SAME SCREEN: Single press = reset, Double press = refresh
      switch (routeName) {
        case 'Home':
          if (isDoubleTap) {
            // 🚀 RADICAL FIX: Double tap with direct transition (no grid flicker)
            if (exploreScreenRef.current) {
              const inFullscreenMode = exploreScreenRef.current.isInFullscreenMode();
              
              if (inFullscreenMode) {
                // FROM FULLSCREEN: Use direct reset (bypasses grid view completely)
                exploreScreenRef.current.directResetFromFullscreen();
              } else {
                // FROM GRID/NORMAL: Use regular reset
                exploreScreenRef.current.resetToAll();
              }
            }
          } else {
            // Single tap: Check current mode priority - fullscreen > grid > normal
            if (exploreScreenRef.current) {
              const inFullscreenMode = exploreScreenRef.current.isInFullscreenMode();
              const inMediaMode = exploreScreenRef.current.isInMediaMode();
              
              if (inFullscreenMode) {
                // In fullscreen mode: just exit fullscreen, return to grid mode with same scroll position
                exploreScreenRef.current.exitFullscreenOnly();
              } else if (inMediaMode) {
                // In grid mode: just scroll to top, don't exit grid mode
                exploreScreenRef.current.scrollToTopInMediaMode();
              } else {
                // In normal mode: reset to all (existing behavior)
                exploreScreenRef.current.resetToAll();
              }
            }
          }
          break;
          
        case 'Pods':
          if (isDoubleTap) {
            // Double tap: Full reset (reset everything)
            if (podsScreenRef.current) {
              podsScreenRef.current.resetToTop();
            }
          } else {
            // Single tap: Just scroll to top of current page (no reset)
            if (podsScreenRef.current) {
              podsScreenRef.current.scrollToTop();
            }
          }
          break;
          
        case 'Notifications':
          // Single tap: Reset notifications state
          navigation.navigate('Notifications');
          
          // Double tap: Additional refresh
          if (isDoubleTap) {
            // Additional refresh logic can go here if needed
          }
          break;
          
        case 'Profile':
          // When already on Profile screen (isFocused = true):
          // Single tap: Scroll to top (NEW FUNCTIONALITY)
          // Double tap: Scroll to top (same as single tap)
          if (profileScreenRef.current) {
            profileScreenRef.current.scrollToTop(); // Use new scrollToTop function
          }
          // Clear any feed navigation params and navigate to Profile tab
          navigation.navigate('Profile', { 
            fromFeed: false, 
            previousScreen: undefined 
          });
          break;
      }
    } else {
      // DIFFERENT SCREEN: Single press = just change screen, Double press = change + reset
      if (isDoubleTap) {
        // Double tap: Change screen + Reset
        switch (routeName) {
          case 'Home':
            navigation.navigate('Home');
            setTimeout(() => {
              if (exploreScreenRef.current) {
                const inFullscreenMode = exploreScreenRef.current.isInFullscreenMode();
                
                if (inFullscreenMode) {
                  // FROM FULLSCREEN: Use direct reset (bypasses grid view completely)
                  exploreScreenRef.current.directResetFromFullscreen();
                } else {
                  // FROM GRID/NORMAL: Use regular reset
                  exploreScreenRef.current.resetToAll();
                }
              }
            }, 50);
            break;
            
          case 'Pods':
            navigation.navigate('Pods');
            setTimeout(() => {
              if (podsScreenRef.current) {
                podsScreenRef.current.resetToTop();
              }
            }, 50);
            break;
            
          case 'Notifications':
            navigation.navigate('Notifications');
            break;
            
          case 'Profile':
            navigation.navigate('Profile', { 
              fromFeed: false, 
              previousScreen: undefined
            });
            // Only reset on double tap when coming from other screens
            if (isDoubleTap) {
              setTimeout(() => {
                if (profileScreenRef.current) {
                  profileScreenRef.current.resetToTop();
                }
              }, 50);
            }
            // Single tap: Just navigate, preserve scroll position (no reset)
            break;
        }
      }
      // Single tap: Just change screen (default navigation behavior, no reset)
      // Navigation will happen automatically via React Navigation
    }
    
    // Update the previous tab
    previousTabRef.current = routeName;
    lastTapRef.current[routeName] = now;
  };

  return (
    <ScrollContext.Provider value={{ exploreScrollRef, podsScrollRef, profileScrollRef }}>
      <Tab.Navigator
        screenOptions={({ route, navigation }) => {
          // FORCE NIGHT MODE for Explore screen (Home tab) only
          const isExploreScreen = route.name === 'Home';
          const navState = navigation.getState();
          const currentRoute = navState.routes[navState.index];
          const isCurrentlyOnExplore = currentRoute.name === 'Home';
          
          // Use BLACK theme colors only when on Explore screen (same as app's night mode)
          const navBarColors = isCurrentlyOnExplore ? {
            background: '#000000', // Pure black (same as app's dark theme)
            border: '#333333', // Dark gray borders (same as app's dark theme)
            text: '#FFFFFF', // White text
            textSecondary: '#B8B8B8', // Light gray text (same as app's dark theme)
          } : {
            background: themeColors.background,
            border: themeColors.border,
            text: themeColors.text,
            textSecondary: themeColors.textSecondary,
          };
          
          return {
            headerShown: false,
            tabBarIcon: ({ color, focused }) => {
              return <TabIcon name={route.name} color={color} focused={focused} isOnExploreScreen={isCurrentlyOnExplore} />;
            },
            tabBarStyle: {
              backgroundColor: navBarColors.background,
              borderTopColor: navBarColors.border,
              borderTopWidth: rs(1),
              height: responsiveDimensions.tabBar.height,
              paddingBottom: responsiveDimensions.tabBar.paddingBottom,
              paddingTop: responsiveDimensions.tabBar.paddingTop,
            },
            tabBarLabelStyle: {
              fontSize: rf(11),
              fontWeight: '500',
              marginTop: rs(2),
            },
            tabBarActiveTintColor: route.name === 'Create' ? '#0047AB' : navBarColors.text,
            tabBarInactiveTintColor: navBarColors.textSecondary,
            tabBarLabel: ({ focused }) => {
              if (route.name === 'Create') {
                return null; // Remove "Create" text
              }
              return !focused ? null : undefined;
            },
          };
        }}
        screenListeners={({ route, navigation }) => ({
          tabPress: (e) => {
            // FIXED: Prevent default for Create to handle navigation manually
            if (route.name === 'Create') {
              e.preventDefault();
              handleTabPress(route.name, navigation, false);
              return;
            }
            
            const isFocused = navigation.isFocused();
            handleTabPress(route.name, navigation, isFocused);
          },
        })}
      >
        <Tab.Screen 
          name="Home" 
          children={() => <ExploreScreenWithRef ref={exploreScreenRef} />} 
        />
        <Tab.Screen 
          name="Pods" 
          children={() => <PodsScreenWithRef ref={podsScreenRef} />} 
        />
        <Tab.Screen name="Create" component={EmptyComponent} />
        <Tab.Screen name="Notifications" component={NotificationsScreen} />
        <Tab.Screen 
          name="Profile" 
          children={() => <ProfileScreenWithRef ref={profileScreenRef} />} 
        />
      </Tab.Navigator>
    </ScrollContext.Provider>
  );
}

// Root Navigator
function RootNavigator() {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="MainTabs" component={TabNavigator} />
      <RootStack.Screen 
        name="CreatePost" 
        component={CreatePost}
        options={{
          presentation: 'modal',
          gestureEnabled: true,
        }}
      />
      <RootStack.Screen 
        name="LucidFullscreen" 
        component={LucidFullscreen}
        options={{
          presentation: 'modal',
          gestureEnabled: true,
        }}
      />
      <RootStack.Screen 
        name="ImmersiveFeed" 
        component={ImmersiveFeedScreen}
        options={{
          headerShown: false,
          gestureEnabled: true,
        }}
      />
      <RootStack.Screen 
        name="ProfileView" 
        component={ProfileViewScreen}
        options={{
          headerShown: false,
          gestureEnabled: true,
        }}
      />
      <RootStack.Screen 
        name="LocationView" 
        component={LocationViewScreen}
        options={{
          headerShown: false,
          gestureEnabled: true,
        }}
      />
    </RootStack.Navigator>
  );
}

// Main App Component
export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return (
      <ThemeProvider>
        <SplashScreen onFinish={handleSplashFinish} />
      </ThemeProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider> 
        <SettingsProvider>
          <PostsProvider>
            <SavedPostsProvider>
              <LikedPostsProvider>
                <JoinedPodsProvider>
                  <GestureHandlerRootView style={{ flex: 1 }}>
                    <NavigationContainer>
                      <RootNavigator />
                    </NavigationContainer>
                  </GestureHandlerRootView>
                </JoinedPodsProvider>
              </LikedPostsProvider>
            </SavedPostsProvider>
          </PostsProvider>
        </SettingsProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
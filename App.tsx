import './global.css';
import React, { useRef, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, FlatList, StatusBar, Image } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { colors } from './blinxus/src/constants/colors';
import { Home, Users2, UserCircle, Bell, Plus } from 'lucide-react-native';
import ScrollContext, { useScrollContext } from './blinxus/src/contexts/ScrollContext';
import { useThemeColors } from './blinxus/src/hooks/useThemeColors';
import { getResponsiveDimensions, getTypographyScale, ri, rs, rf } from './blinxus/src/utils/responsive';
import { getCurrentUser } from './blinxus/src/types/userData/users_data';


// Import screens
import ExploreScreen, { ExploreScreenRef } from './blinxus/src/screens/Explore/ExploreScreen';
import ProfileScreen, { ProfileScreenRef } from './blinxus/src/screens/Profile/ProfileScreen';
import PodsMainScreen, { PodsMainScreenRef } from './blinxus/src/screens/Pods/PodsMainScreen';
import CreatePost from './blinxus/src/screens/Create/CreatePost';
import NotificationsScreen from './blinxus/src/screens/NotificationsScreen';
import LucidFullscreen from './blinxus/src/screens/LucidFullscreen';
import SplashScreen from './blinxus/src/screens/SplashScreen';

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
  const iconSize = ri(29); // Increased from 24 to 28
  
  return (
    <View style={{
      width: iconSize,
      height: iconSize,
      borderRadius: iconSize / 2,
      borderWidth: focused ? 2.0 : 1.5, // Made thinner by 0.5px
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

// Subtle Square Create Icon Component
function SubtleCreateIcon({ color, size, focused }: { color: string; size: number; focused: boolean }) {
  return (
    <View style={{
      width: size,
      height: size,
      borderRadius: size * 0.25, // Subtle rounded square
      borderWidth: focused ? 1.5 : 1.2,
      borderColor: '#0047AB', // Always subtle cobalt blue
      backgroundColor: focused ? 'rgba(0, 71, 171, 0.12)' : 'rgba(0, 71, 171, 0.06)', // Very subtle blue tint
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* Minimal plus inside */}
      <View style={{
        width: size * 0.42,
        height: 1.5,
        backgroundColor: '#0047AB',
        borderRadius: 0.75,
      }} />
      <View style={{
        width: 1.5,
        height: size * 0.42,
        backgroundColor: '#0047AB',
        borderRadius: 0.75,
        position: 'absolute',
      }} />
    </View>
  );
}

// Tab Icons - Updated for 5 tabs
function TabIcon({ name, color, focused }: { name: string; color: string; focused: boolean }) {
  const iconSize = name === 'Create' ? ri(28) : ri(24);
  const strokeWidth = focused ? 2.0 : 1.5; // Made thinner by 0.5px
  
  switch (name) {
    case 'Home':
      return <Home size={iconSize} color={color} strokeWidth={strokeWidth} />;
    case 'Pods':
      return <Users2 size={iconSize} color={color} strokeWidth={strokeWidth} />;
    case 'Create':
      return <SubtleCreateIcon color={color} size={iconSize} focused={focused} />;
    case 'Notifications':
      return <Bell size={iconSize} color={color} strokeWidth={strokeWidth} />;
    case 'Profile':
      return <ProfileTabIcon color={color} focused={focused} />;
    default:
      return <Home size={iconSize} color={color} strokeWidth={strokeWidth} />;
  }
}

// Special Create Tab Button - Same size as other icons, subtle design
function CreateTabButton({ onPress, accessibilityState, navigation }: any) {
  const themeColors = useThemeColors();
  
  const handlePress = () => {
    navigation.navigate('CreatePost');
  };
  
  return (
    <TouchableOpacity
      onPress={handlePress}
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: rs(2), // Slight lift to align with other icons
      }}
      activeOpacity={0.8}
    >
      {/* Subtle square create icon - same size as other tab icons */}
      <View style={{
        width: ri(24), // Same size as other icons
        height: ri(24),
        borderRadius: ri(6), // Subtle rounded square
        borderWidth: 1.5,
        borderColor: '#0047AB', // Subtle cobalt blue border
        backgroundColor: 'rgba(0, 71, 171, 0.08)', // Very subtle blue tint
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* Minimal plus inside */}
        <View style={{
          width: ri(10),
          height: 1.5,
          backgroundColor: '#0047AB',
          borderRadius: 0.75,
        }} />
        <View style={{
          width: 1.5,
          height: ri(10),
          backgroundColor: '#0047AB',
          borderRadius: 0.75,
          position: 'absolute',
        }} />
      </View>
    </TouchableOpacity>
  );
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
        screenOptions={({ route, navigation }) => ({
          headerShown: false,
          tabBarIcon: ({ color, focused }) => {
            if (route.name === 'Create') {
              return null; // Custom button handles this
            }
            return <TabIcon name={route.name} color={color} focused={focused} />;
          },
          tabBarButton: route.name === 'Create' ? (props: any) => <CreateTabButton {...props} navigation={navigation} /> : undefined,
          tabBarStyle: {
            backgroundColor: themeColors.background,
            borderTopColor: themeColors.border,
            borderTopWidth: rs(1),
            height: responsiveDimensions.tabBar.height,
            paddingBottom: responsiveDimensions.tabBar.paddingBottom,
            paddingTop: responsiveDimensions.tabBar.paddingTop,
          },
          tabBarLabelStyle: {
            fontSize: rf(11),
            fontWeight: '500',
            marginTop: route.name === 'Create' ? rs(4) : rs(2),
          },
          tabBarActiveTintColor: route.name === 'Create' ? '#0047AB' : themeColors.text,
          tabBarInactiveTintColor: themeColors.textSecondary,
          tabBarLabel: ({ focused }) => {
            if (route.name === 'Create') {
              return (
                <Text style={{
                  fontSize: rf(11),
                  fontWeight: '500',
                  color: '#0047AB',
                  marginTop: rs(4)
                }}>
                  Create
                </Text>
              );
            }
            return !focused ? '' : undefined;
          },
        })}
        screenListeners={({ route, navigation }) => ({
          tabPress: (e) => {
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
  );
}
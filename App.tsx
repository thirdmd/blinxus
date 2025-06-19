import './global.css';
import React, { useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, FlatList, StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { colors } from './blinxus/src/constants';
import { Home, Users2, UserCircle, Bell, Plus } from 'lucide-react-native';
import ScrollContext from './blinxus/src/contexts/ScrollContext';
import { useThemeColors } from './blinxus/src/hooks/useThemeColors';
import { getResponsiveDimensions, getTypographyScale, ri, rs, rf } from './blinxus/src/utils/responsive';


// Import screens
import ExploreScreen, { ExploreScreenRef } from './blinxus/src/screens/Explore/ExploreScreen';
import ProfileScreen, { ProfileScreenRef } from './blinxus/src/screens/Profile/ProfileScreen';
import PodsMainScreen from './blinxus/src/screens/Pods/PodsMainScreen';
import CreatePost from './blinxus/src/screens/Create/CreatePost';
import NotificationsScreen from './blinxus/src/screens/NotificationsScreen';
import LucidFullscreen from './blinxus/src/screens/LucidFullscreen';

// Import context
import { PostsProvider } from './blinxus/src/store/PostsContext';
import { SavedPostsProvider } from './blinxus/src/store/SavedPostsContext';
import { LikedPostsProvider } from './blinxus/src/store/LikedPostsContext';
import { ThemeProvider } from './blinxus/src/contexts/ThemeContext';
import { SettingsProvider } from './blinxus/src/contexts/SettingsContext';

// Create navigators
const Tab = createBottomTabNavigator();
const RootStack = createStackNavigator();

// Tab Icons - Updated for 5 tabs
function TabIcon({ name, color, focused }: { name: string; color: string; focused: boolean }) {
  const iconSize = name === 'Create' ? ri(28) : ri(24);
  const strokeWidth = focused ? 2 : 1.5;
  
  switch (name) {
    case 'Home':
      return <Home size={iconSize} color={color} strokeWidth={strokeWidth} />;
    case 'Pods':
      return <Users2 size={iconSize} color={color} strokeWidth={strokeWidth} />;
    case 'Create':
      return <Plus size={iconSize} color={color} strokeWidth={strokeWidth} />;
    case 'Notifications':
      return <Bell size={iconSize} color={color} strokeWidth={strokeWidth} />;
    case 'Profile':
      return <UserCircle size={iconSize} color={color} strokeWidth={strokeWidth} />;
    default:
      return <Home size={iconSize} color={color} strokeWidth={strokeWidth} />;
  }
}

// Special Create Tab Button
function CreateTabButton({ onPress, accessibilityState }: any) {
  const themeColors = useThemeColors();
  const responsiveDimensions = getResponsiveDimensions();
  const focused = accessibilityState?.selected;
  
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        top: rs(-8), // Slightly elevated
      }}
      activeOpacity={0.8}
    >
      <View style={{
        width: responsiveDimensions.fab.size,
        height: responsiveDimensions.fab.size,
        borderRadius: responsiveDimensions.fab.borderRadius,
        backgroundColor: '#0047AB', // Always cobalt blue
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: rs(4) },
        shadowOpacity: 0.3,
        shadowRadius: rs(8),
        elevation: responsiveDimensions.fab.elevation,
      }}>
        <Plus size={ri(24)} color="#FFFFFF" strokeWidth={2} />
      </View>
    </TouchableOpacity>
  );
}

// Tab Navigator
function TabNavigator() {
  const themeColors = useThemeColors();
  const responsiveDimensions = getResponsiveDimensions();
  const typography = getTypographyScale();
  const exploreScrollRef = useRef<FlatList>(null);
  const podsScrollRef = useRef<ScrollView>(null);
  const profileScrollRef = useRef<ScrollView>(null);
  const exploreScreenRef = useRef<ExploreScreenRef>(null);
  const profileScreenRef = useRef<ProfileScreenRef>(null);
  
  // Double tap detection
  const lastTapRef = useRef<{ [key: string]: number }>({});
  
  // Track the previously active tab
  const previousTabRef = useRef<string>('Home');
  
  const handleTabPress = (routeName: string, navigation: any) => {
    const now = Date.now();
    const lastTap = lastTapRef.current[routeName] || 0;
    
    // Check if we're coming from the Create tab to Home tab
    if (routeName === 'Home' && previousTabRef.current === 'Create') {
      // Automatically scroll to top when navigating from Create to Home
      setTimeout(() => {
        if (exploreScreenRef.current) {
          exploreScreenRef.current.resetToAll();
        }
      }, 100);
    }
    
    if (now - lastTap < 300) { // Double tap detected (within 300ms)
      // Scroll to top based on route
      switch (routeName) {
        case 'Home':
          // Reset to "All" tab and scroll to top
          if (exploreScreenRef.current) {
            exploreScreenRef.current.resetToAll();
          }
          break;
        case 'Pods':
          if (podsScrollRef.current) {
            podsScrollRef.current.scrollTo({ y: 0, animated: true });
          }
          break;
        case 'Profile':
          // For Profile, use the resetToTop function to handle all states
          if (profileScreenRef.current) {
            profileScreenRef.current.resetToTop();
          }
          // Also navigate to Profile tab (in case we're in Settings/Library)
          navigation.navigate('Profile');
          break;
      }
    }
    
    // Update the previous tab
    previousTabRef.current = routeName;
    lastTapRef.current[routeName] = now;
  };

  return (
    <ScrollContext.Provider value={{ exploreScrollRef, podsScrollRef, profileScrollRef }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color, focused }) => {
            if (route.name === 'Create') {
              return null; // Custom button handles this
            }
            return <TabIcon name={route.name} color={color} focused={focused} />;
          },
          tabBarButton: route.name === 'Create' ? CreateTabButton : undefined,
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
          tabPress: () => {
            handleTabPress(route.name, navigation);
          },
        })}
      >
        <Tab.Screen name="Home">
          {() => <ExploreScreen ref={exploreScreenRef} />}
        </Tab.Screen>
        <Tab.Screen name="Pods" component={PodsMainScreen} />
        <Tab.Screen name="Create" component={CreatePost} />
        <Tab.Screen name="Notifications" component={NotificationsScreen} />
        <Tab.Screen name="Profile">
          {() => <ProfileScreen ref={profileScreenRef} />}
        </Tab.Screen>
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
  return (
    <ThemeProvider>
      <SettingsProvider>
        <PostsProvider>
          <SavedPostsProvider>
            <LikedPostsProvider>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <NavigationContainer>
                  <RootNavigator />
                </NavigationContainer>
              </GestureHandlerRootView>
            </LikedPostsProvider>
          </SavedPostsProvider>
        </PostsProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
} 
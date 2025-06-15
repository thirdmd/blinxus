import './global.css';
import React, { useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, FlatList, StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { colors } from './blinxus/src/constants';
import { Home, Users2, UserCircle } from 'lucide-react-native';
import ScrollContext from './blinxus/src/contexts/ScrollContext';

// Import screens
import ExploreScreen, { ExploreScreenRef } from './blinxus/src/screens/Explore/ExploreScreen';
import ProfileScreen, { ProfileScreenRef } from './blinxus/src/screens/Profile/ProfileScreen';
import CreatePost from './blinxus/src/screens/Create/CreatePost';
import LucidFullscreen from './blinxus/src/screens/LucidFullscreen';

// Import context
import { PostsProvider } from './blinxus/src/store/PostsContext';
import { SavedPostsProvider } from './blinxus/src/store/SavedPostsContext';

// Create navigators
const Tab = createBottomTabNavigator();
const RootStack = createStackNavigator();

// Clean tab icons using Lucide icons

// Tab Icons
function TabIcon({ name, color }: { name: string; color: string }) {
  switch (name) {
    case 'Explore':
      return <Home size={24} color={color} strokeWidth={2} />;
    case 'Pods':
      return <Users2 size={24} color={color} strokeWidth={2} />;
    case 'Profile':
      return <UserCircle size={24} color={color} strokeWidth={2} />;
    default:
      return <Home size={24} color={color} strokeWidth={2} />;
  }
}

// Temporary Pods Screen
function PodsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View className="p-4 border-b border-gray-200">
        <Text className="text-2xl font-semibold text-gray-900">
          Pods
        </Text>
      </View>
      <View className="flex-1 justify-center items-center px-8">
        <Text className="text-lg text-gray-600 text-center mb-4">
          Location-based communities
        </Text>
        <Text className="text-base text-gray-600 text-center">
          Connect with travelers in specific destinations
        </Text>
      </View>
    </SafeAreaView>
  );
}

// Tab Navigator
function TabNavigator() {
  const exploreScrollRef = useRef<FlatList>(null);
  const podsScrollRef = useRef<ScrollView>(null);
  const profileScrollRef = useRef<ScrollView>(null);
  const exploreScreenRef = useRef<ExploreScreenRef>(null);
  const profileScreenRef = useRef<ProfileScreenRef>(null);
  
  // Double tap detection
  const lastTapRef = useRef<{ [key: string]: number }>({});
  
  const handleTabPress = (routeName: string, navigation: any) => {
    const now = Date.now();
    const lastTap = lastTapRef.current[routeName] || 0;
    
    if (now - lastTap < 300) { // Double tap detected (within 300ms)
      // Scroll to top based on route
      switch (routeName) {
        case 'Explore':
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
    
    lastTapRef.current[routeName] = now;
  };

  return (
    <ScrollContext.Provider value={{ exploreScrollRef, podsScrollRef, profileScrollRef }}>
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color }) => (
          <TabIcon name={route.name} color={color} />
        ),
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.borderGray,
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        tabBarActiveTintColor: '#000000',
        tabBarInactiveTintColor: colors.mediumGray,
        tabBarLabel: ({ focused }) => !focused ? '' : undefined,
      })}
        screenListeners={({ route, navigation }) => ({
          tabPress: () => {
            handleTabPress(route.name, navigation);
          },
        })}
    >
      <Tab.Screen name="Explore">
        {() => <ExploreScreen ref={exploreScreenRef} />}
      </Tab.Screen>
      <Tab.Screen name="Pods" component={PodsScreen} />
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
  return (
    <PostsProvider>
      <SavedPostsProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </GestureHandlerRootView>
      </SavedPostsProvider>
    </PostsProvider>
  );
} 
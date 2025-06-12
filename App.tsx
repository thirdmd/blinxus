import './global.css';
import React, { useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, FlatList, StatusBar } from 'react-native';
import { colors } from './blinxus/src/constants';
import { Home } from 'lucide-react-native';
import ScrollContext from './blinxus/src/contexts/ScrollContext';

// Import screens
import ExploreScreen from './blinxus/src/screens/Explore/ExploreScreen';
import ProfileScreen from './blinxus/src/screens/Profile/ProfileScreen';
import CreatePost from './blinxus/src/screens/Create/CreatePost';

// Import context
import { PostsProvider } from './blinxus/src/store/PostsContext';

// Create navigators
const Tab = createBottomTabNavigator();
const RootStack = createStackNavigator();

// Custom Profile Icon Component - Circular with user silhouette
function ProfileIcon({ color }: { color: string }) {
  return (
    <View 
      style={{
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: color,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
      }}
    >
      {/* Head circle */}
      <View 
        style={{
          width: 6,
          height: 6,
          borderRadius: 3,
          borderWidth: 1.5,
          borderColor: color,
          backgroundColor: 'transparent',
          marginTop: 2,
        }}
      />
      {/* Body shape */}
      <View 
        style={{
          width: 12,
          height: 8,
          borderTopLeftRadius: 6,
          borderTopRightRadius: 6,
          borderWidth: 1.5,
          borderColor: color,
          backgroundColor: 'transparent',
          marginTop: 1,
          borderBottomWidth: 0,
        }}
      />
    </View>
  );
}

// Custom Pods Icon Component - Three people side by side
function PodsIcon({ color }: { color: string }) {
  return (
    <View 
      style={{
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Three people side by side */}
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center' }}>
        {/* Left person */}
        <View style={{ alignItems: 'center', marginRight: -1 }}>
          <View 
            style={{
              width: 5,
              height: 5,
              borderRadius: 2.5,
              borderWidth: 1.5,
              borderColor: color,
              backgroundColor: 'transparent',
            }}
          />
          <View 
            style={{
              width: 7,
              height: 5,
              borderTopLeftRadius: 3.5,
              borderTopRightRadius: 3.5,
              borderWidth: 1.5,
              borderColor: color,
              backgroundColor: 'transparent',
              borderBottomWidth: 0,
              marginTop: 0.5,
            }}
          />
        </View>

        {/* Center person (larger) */}
        <View style={{ alignItems: 'center', zIndex: 1 }}>
          <View 
            style={{
              width: 6,
              height: 6,
              borderRadius: 3,
              borderWidth: 1.5,
              borderColor: color,
              backgroundColor: 'transparent',
            }}
          />
          <View 
            style={{
              width: 8,
              height: 6,
              borderTopLeftRadius: 4,
              borderTopRightRadius: 4,
              borderWidth: 1.5,
              borderColor: color,
              backgroundColor: 'transparent',
              borderBottomWidth: 0,
              marginTop: 0.5,
            }}
          />
        </View>

        {/* Right person */}
        <View style={{ alignItems: 'center', marginLeft: -1 }}>
          <View 
            style={{
              width: 5,
              height: 5,
              borderRadius: 2.5,
              borderWidth: 1.5,
              borderColor: color,
              backgroundColor: 'transparent',
            }}
          />
          <View 
            style={{
              width: 7,
              height: 5,
              borderTopLeftRadius: 3.5,
              borderTopRightRadius: 3.5,
              borderWidth: 1.5,
              borderColor: color,
              backgroundColor: 'transparent',
              borderBottomWidth: 0,
              marginTop: 0.5,
            }}
          />
        </View>
      </View>
    </View>
  );
}

// Tab Icons
function TabIcon({ name, color }: { name: string; color: string }) {
  switch (name) {
    case 'Explore':
      return <Home size={24} color={color} />;
    case 'Pods':
      return <PodsIcon color={color} />;
    case 'Profile':
      return <ProfileIcon color={color} />;
    default:
      return <Home size={24} color={color} />;
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
  
  // Double tap detection
  const lastTapRef = useRef<{ [key: string]: number }>({});
  
  const handleTabPress = (routeName: string) => {
    const now = Date.now();
    const lastTap = lastTapRef.current[routeName] || 0;
    
    if (now - lastTap < 300) { // Double tap detected (within 300ms)
      // Scroll to top based on route
      switch (routeName) {
        case 'Explore':
          if (exploreScrollRef.current) {
            exploreScrollRef.current.scrollToOffset({ offset: 0, animated: true });
          }
          break;
        case 'Pods':
          if (podsScrollRef.current) {
            podsScrollRef.current.scrollTo({ y: 0, animated: true });
          }
          break;
        case 'Profile':
          if (profileScrollRef.current) {
            profileScrollRef.current.scrollTo({ y: 0, animated: true });
          }
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
          tabBarActiveTintColor: colors.cobalt,
          tabBarInactiveTintColor: colors.mediumGray,
        })}
        screenListeners={({ route }) => ({
          tabPress: () => {
            handleTabPress(route.name);
          },
        })}
      >
        <Tab.Screen name="Explore" component={ExploreScreen} />
        <Tab.Screen name="Pods" component={PodsScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
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
    </RootStack.Navigator>
  );
}

// Main App Component
export default function App() {
  return (
    <PostsProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </PostsProvider>
  );
} 
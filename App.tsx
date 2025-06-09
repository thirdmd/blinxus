import './global.css';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { colors } from './blinxus/src/constants';

// Import screens
import ExploreScreen from './blinxus/src/screens/Explore/ExploreScreen';
import ProfileScreen from './blinxus/src/screens/Profile/ProfileScreen';
import CreatePost from './blinxus/src/screens/Create/CreatePost';

// Import context
import { PostsProvider } from './blinxus/src/store/PostsContext';

// Create navigators
const Tab = createBottomTabNavigator();
const RootStack = createStackNavigator();

// Tab Icons
function TabIcon({ name, color }: { name: string; color: string }) {
  const iconMap: { [key: string]: string } = {
    Explore: '🧭',
    Pods: '🌍',
    Profile: '👤'
  };
  
  return (
    <Text style={{ fontSize: 24, color }}>{iconMap[name] || '○'}</Text>
  );
}

// Temporary Pods Screen
function PodsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
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
  return (
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
    >
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Pods" component={PodsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
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
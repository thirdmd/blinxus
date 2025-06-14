import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import Library from './Library/library';

interface Props {
  onBackPress?: () => void;
}

export default function ProfileSettings({ onBackPress }: Props = {}) {
  const [showLibrary, setShowLibrary] = useState(false);

  const handleMenuItemPress = (item: string) => {
    if (item === 'signout') {
      // Handle sign out
      console.log('Signing out...');
      // You can add sign out logic here later
      // For example: logout(), clearUserData(), navigate to login screen, etc.
    } else if (item === 'library') {
      // Show Library screen
      setShowLibrary(true);
    } else {
      // Handle navigation to different settings screens
      console.log(`Navigating to ${item}`);
      // You can add navigation logic here later
    }
  };

  const settingsItems = [
    {
      id: 'library',
      title: 'Library',
      icon: '💾',
      subtitle: 'Saved posts and bookmarks'
    },
    {
      id: 'account',
      title: 'Account',
      icon: '⚙️',
      subtitle: 'Manage your account settings'
    },
    {
      id: 'privacy',
      title: 'Privacy',
      icon: '🔐',
      subtitle: 'Privacy and security settings'
    },
    {
      id: 'activity',
      title: 'Activity',
      icon: '📈',
      subtitle: 'View your activity and statistics'
    },
    {
      id: 'blocked',
      title: 'Blocked',
      icon: '🚫',
      subtitle: 'Manage blocked users'
    },
    {
      id: 'signout',
      title: 'Sign Out',
      icon: '🚪',
      subtitle: 'Sign out of your account'
    }
  ];

  // Show library screen if showLibrary is true
  if (showLibrary) {
    return <Library onBackPress={() => setShowLibrary(false)} />;
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4 bg-white border-b border-gray-100">
        <TouchableOpacity
          onPress={onBackPress}
          className="w-10 h-10 items-center justify-center"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text className="text-gray-600 text-2xl">←</Text>
        </TouchableOpacity>
        
        <Text className="text-xl font-semibold text-gray-900">Settings</Text>
        
        <View className="w-10" />
      </View>

      {/* Settings List */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 py-6">
          {settingsItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => handleMenuItemPress(item.id)}
              className="flex-row items-center py-4 px-2"
              activeOpacity={0.7}
            >
              {/* Icon Container */}
              <View className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center mr-4">
                <Text className="text-xl">{item.icon}</Text>
              </View>
              
              {/* Text Content */}
              <View className="flex-1">
                <Text className="text-lg font-medium text-gray-900 mb-1">
                  {item.title}
                </Text>
                <Text className="text-sm text-gray-500">
                  {item.subtitle}
                </Text>
              </View>
              
              {/* Arrow */}
              <Text className="text-gray-400 text-lg">→</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

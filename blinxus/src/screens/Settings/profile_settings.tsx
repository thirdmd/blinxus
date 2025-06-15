import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { 
  ChevronLeft, 
  User, 
  Shield, 
  BarChart3, 
  UserX, 
  LogOut 
} from 'lucide-react-native';

interface Props {
  onBackPress?: () => void;
}

export default function ProfileSettings({ onBackPress }: Props = {}) {
  const handleMenuItemPress = (item: string) => {
    if (item === 'signout') {
      // Handle sign out
      console.log('Signing out...');
      // You can add sign out logic here later
      // For example: logout(), clearUserData(), navigate to login screen, etc.
    } else {
      // Handle navigation to different settings screens
      console.log(`Navigating to ${item}`);
      // You can add navigation logic here later
    }
  };

  const settingsItems = [
    {
      id: 'account',
      title: 'Account',
      subtitle: 'Manage your account settings'
    },
    {
      id: 'privacy',
      title: 'Privacy',
      subtitle: 'Privacy and security settings'
    },
    {
      id: 'activity',
      title: 'Activity',
      subtitle: 'View your activity and statistics'
    },
    {
      id: 'blocked',
      title: 'Blocked',
      subtitle: 'Manage blocked users'
    },
    {
      id: 'signout',
      title: 'Sign Out',
      subtitle: 'Sign out of your account'
    }
  ];

  const getIcon = (id: string) => {
    switch (id) {
      case 'account': return <User size={20} color="#000000" strokeWidth={2} />;
      case 'privacy': return <Shield size={20} color="#000000" strokeWidth={2} />;
      case 'activity': return <BarChart3 size={20} color="#000000" strokeWidth={2} />;
      case 'blocked': return <UserX size={20} color="#000000" strokeWidth={2} />;
      case 'signout': return <LogOut size={20} color="#dc2626" strokeWidth={2} />;
      default: return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View className="px-6 pt-4 pb-8">
        <TouchableOpacity
          onPress={onBackPress}
          className="w-10 h-10 -ml-2 items-center justify-center"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ChevronLeft size={24} color="#000000" strokeWidth={2} />
        </TouchableOpacity>
        
        <Text className="text-2xl font-normal text-black mt-8">Settings</Text>
      </View>

      {/* Settings List */}
      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="px-6">
          {settingsItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => handleMenuItemPress(item.id)}
              className="flex-row items-center py-5"
              activeOpacity={0.3}
            >
              {/* Icon */}
              <View className="w-6 h-6 mr-4">
                {getIcon(item.id)}
              </View>
              
              {/* Text Content */}
              <View className="flex-1">
                <Text className={`text-base ${item.id === 'signout' ? 'text-black' : 'text-black'}`}>
                  {item.title}
                </Text>
                {item.id !== 'signout' && (
                  <Text className="text-sm text-gray-400 mt-0.5">
                    {item.subtitle}
                  </Text>
                )}
              </View>
              
              {/* Arrow */}
              <View className="w-4 h-4 items-center justify-center">
                <View className="w-2 h-2 border-t border-r border-gray-300 rotate-45" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
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
  LogOut,
  Moon
} from 'lucide-react-native';
import { useThemeColors } from '../../hooks/useThemeColors';
import { ThemeToggle } from '../../components/ThemeToggle';

interface Props {
  onBackPress?: () => void;
}

export default function ProfileSettings({ onBackPress }: Props = {}) {
  const themeColors = useThemeColors();
  
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
      id: 'theme',
      title: 'Theme',
      subtitle: 'Switch between light and dark mode'
    },
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
      case 'theme': return <Moon size={20} color={themeColors.text} strokeWidth={2} />;
      case 'account': return <User size={20} color={themeColors.text} strokeWidth={2} />;
      case 'privacy': return <Shield size={20} color={themeColors.text} strokeWidth={2} />;
      case 'activity': return <BarChart3 size={20} color={themeColors.text} strokeWidth={2} />;
      case 'blocked': return <UserX size={20} color={themeColors.text} strokeWidth={2} />;
      case 'signout': return <LogOut size={20} color="#dc2626" strokeWidth={2} />;
      default: return null;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
      <StatusBar 
        barStyle={themeColors.isDark ? "light-content" : "dark-content"} 
        backgroundColor={themeColors.background} 
      />
      
      {/* Header */}
      <View style={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 32 }}>
        <TouchableOpacity
          onPress={onBackPress}
          style={{ 
            width: 40, 
            height: 40, 
            marginLeft: -8, 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ChevronLeft size={24} color={themeColors.text} strokeWidth={2} />
        </TouchableOpacity>
        
        <Text style={{ 
          fontSize: 24, 
          fontWeight: '400', 
          color: themeColors.text, 
          marginTop: 32 
        }}>
          Settings
        </Text>
      </View>

      {/* Settings List */}
      <ScrollView 
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View style={{ paddingHorizontal: 24 }}>
          {settingsItems.map((item, index) => (
            <View key={item.id}>
              {item.id === 'theme' ? (
                // Special handling for theme toggle
                <View style={{ 
                  flexDirection: 'row', 
                  alignItems: 'center', 
                  paddingVertical: 20 
                }}>
                  {/* Icon */}
                  <View style={{ width: 24, height: 24, marginRight: 16 }}>
                    {getIcon(item.id)}
                  </View>
                  
                  {/* Text Content */}
                  <View style={{ flex: 1 }}>
                    <Text style={{ 
                      fontSize: 16, 
                      color: themeColors.text 
                    }}>
                      {item.title}
                    </Text>
                    <Text style={{ 
                      fontSize: 14, 
                      color: themeColors.textSecondary, 
                      marginTop: 2 
                    }}>
                      {item.subtitle}
                    </Text>
                  </View>
                  
                  {/* Theme Toggle */}
                  <ThemeToggle showLabel={false} size="small" />
                </View>
              ) : (
                // Regular menu items
                <TouchableOpacity
                  onPress={() => handleMenuItemPress(item.id)}
                  style={{ 
                    flexDirection: 'row', 
                    alignItems: 'center', 
                    paddingVertical: 20 
                  }}
                  activeOpacity={0.3}
                >
                  {/* Icon */}
                  <View style={{ width: 24, height: 24, marginRight: 16 }}>
                    {getIcon(item.id)}
                  </View>
                  
                  {/* Text Content */}
                  <View style={{ flex: 1 }}>
                    <Text style={{ 
                      fontSize: 16, 
                      color: themeColors.text 
                    }}>
                      {item.title}
                    </Text>
                    {item.id !== 'signout' && (
                      <Text style={{ 
                        fontSize: 14, 
                        color: themeColors.textSecondary, 
                        marginTop: 2 
                      }}>
                        {item.subtitle}
                      </Text>
                    )}
                  </View>
                  
                  {/* Arrow */}
                  <View style={{ 
                    width: 16, 
                    height: 16, 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    <View style={{ 
                      width: 8, 
                      height: 8, 
                      borderTopWidth: 1, 
                      borderRightWidth: 1, 
                      borderColor: themeColors.textSecondary, 
                      transform: [{ rotate: '45deg' }] 
                    }} />
                  </View>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
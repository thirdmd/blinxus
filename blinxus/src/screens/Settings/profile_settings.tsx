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
  Moon,
  Smartphone
} from 'lucide-react-native';
import { useThemeColors } from '../../hooks/useThemeColors';
import { ThemeToggle } from '../../components/ThemeToggle';
import { useSettings } from '../../contexts/SettingsContext';
import SettingsToggle from '../../components/SettingsToggle';
import { getResponsiveDimensions, getTextStyles, rs } from '../../utils/responsive';

interface Props {
  onBackPress?: () => void;
}

export default function ProfileSettings({ onBackPress }: Props = {}) {
  const themeColors = useThemeColors();
  const { isImmersiveFeedEnabled, setImmersiveFeedEnabled } = useSettings();
  const responsiveDimensions = getResponsiveDimensions();
  const textStyles = getTextStyles();
  
  const handleMenuItemPress = (item: string) => {
    if (item === 'signout') {
      // Handle sign out
      // Sign out user
      // You can add sign out logic here later
      // For example: logout(), clearUserData(), navigate to login screen, etc.
    } else {
      // Handle navigation to different settings screens
      // Navigate to settings item
      // You can add navigation logic here later
    }
  };

  const settingsItems = [
    {
      id: 'immersive-feed',
      title: 'Immersive Feed',
      subtitle: 'Full-screen photo-focused experience'
    },
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
    const iconSize = responsiveDimensions.settings.iconSize;
    switch (id) {
      case 'theme': return <Moon size={iconSize} color={themeColors.text} strokeWidth={2} />;
      case 'immersive-feed': return <Smartphone size={iconSize} color={themeColors.text} strokeWidth={2} />;
      case 'account': return <User size={iconSize} color={themeColors.text} strokeWidth={2} />;
      case 'privacy': return <Shield size={iconSize} color={themeColors.text} strokeWidth={2} />;
      case 'activity': return <BarChart3 size={iconSize} color={themeColors.text} strokeWidth={2} />;
      case 'blocked': return <UserX size={iconSize} color={themeColors.text} strokeWidth={2} />;
      case 'signout': return <LogOut size={iconSize} color="#dc2626" strokeWidth={2} />;
      default: return null;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
      <StatusBar 
        barStyle={themeColors.isDark ? "light-content" : "dark-content"} 
        backgroundColor={themeColors.background} 
      />
      
      {/* Header - App Bar Style - Minimalist */}
      <View style={{ 
        height: responsiveDimensions.appBar.height,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16
      }}>
        <TouchableOpacity
          onPress={onBackPress}
          style={{ 
            width: 40, 
            height: 40, 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ChevronLeft size={24} color={themeColors.text} strokeWidth={2} />
        </TouchableOpacity>
        
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ 
            ...textStyles.settingsTitle,
            color: themeColors.text
          }}>
            Settings
          </Text>
        </View>
        
        {/* Spacer to balance the back button */}
        <View style={{ width: 40 }} />
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
                  paddingVertical: responsiveDimensions.settings.itemPadding 
                }}>
                  {/* Icon */}
                  <View style={{ 
                    width: responsiveDimensions.settings.iconContainer.width, 
                    height: responsiveDimensions.settings.iconContainer.height, 
                    marginRight: rs(16) 
                  }}>
                    {getIcon(item.id)}
                  </View>
                  
                  {/* Text Content */}
                  <View style={{ flex: 1 }}>
                    <Text style={{ 
                      ...textStyles.settingsItem,
                      color: themeColors.text 
                    }}>
                      {item.title}
                    </Text>
                    <Text style={{ 
                      ...textStyles.settingsSubtitle,
                      color: themeColors.textSecondary, 
                      marginTop: 2 
                    }}>
                      {item.subtitle}
                    </Text>
                  </View>
                  
                  {/* Theme Toggle */}
                  <ThemeToggle showLabel={false} size="small" />
                </View>
              ) : item.id === 'immersive-feed' ? (
                // Special handling for immersive feed toggle
                <View style={{ 
                  flexDirection: 'row', 
                  alignItems: 'center', 
                  paddingVertical: responsiveDimensions.settings.itemPadding 
                }}>
                  {/* Icon */}
                  <View style={{ 
                    width: responsiveDimensions.settings.iconContainer.width, 
                    height: responsiveDimensions.settings.iconContainer.height, 
                    marginRight: rs(16) 
                  }}>
                    {getIcon(item.id)}
                  </View>
                  
                  {/* Text Content */}
                  <View style={{ flex: 1 }}>
                    <Text style={{ 
                      ...textStyles.settingsItem,
                      color: themeColors.text 
                    }}>
                      {item.title}
                    </Text>
                    <Text style={{ 
                      ...textStyles.settingsSubtitle,
                      color: themeColors.textSecondary, 
                      marginTop: 2 
                    }}>
                      {item.subtitle}
                    </Text>
                  </View>
                  
                  {/* Immersive Feed Toggle */}
                  <SettingsToggle 
                    enabled={isImmersiveFeedEnabled} 
                    onToggle={setImmersiveFeedEnabled}
                    size="small"
                  />
                </View>
              ) : (
                // Regular menu items
                <TouchableOpacity
                  onPress={() => handleMenuItemPress(item.id)}
                  style={{ 
                    flexDirection: 'row', 
                    alignItems: 'center', 
                    paddingVertical: responsiveDimensions.settings.itemPadding 
                  }}
                  activeOpacity={0.7}
                >
                  {/* Icon */}
                  <View style={{ 
                    width: responsiveDimensions.settings.iconContainer.width, 
                    height: responsiveDimensions.settings.iconContainer.height, 
                    marginRight: rs(16) 
                  }}>
                    {getIcon(item.id)}
                  </View>
                  
                  {/* Text Content */}
                  <View style={{ flex: 1 }}>
                    <Text style={{ 
                      ...textStyles.settingsItem,
                      color: item.id === 'signout' ? '#dc2626' : themeColors.text 
                    }}>
                      {item.title}
                    </Text>
                    <Text style={{ 
                      ...textStyles.settingsSubtitle,
                      color: themeColors.textSecondary, 
                      marginTop: 2 
                    }}>
                      {item.subtitle}
                    </Text>
                  </View>
                  
                  {/* Arrow (except for sign out) */}
                  {item.id !== 'signout' && (
                    <View style={{ marginLeft: rs(8) }}>
                      <ChevronLeft 
                        size={responsiveDimensions.settings.arrowSize} 
                        color={themeColors.textSecondary} 
                        style={{ transform: [{ rotate: '180deg' }] }}
                        strokeWidth={2}
                      />
                    </View>
                  )}
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
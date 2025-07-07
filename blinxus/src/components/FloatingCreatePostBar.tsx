import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { MessageCircle } from 'lucide-react-native';
import { useThemeColors } from '../hooks/useThemeColors';
import { getCurrentUser } from '../types/userData/users_data';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface FloatingCreatePostBarProps {
  onPress: () => void;
  placeholder?: string;
}

const FloatingCreatePostBar: React.FC<FloatingCreatePostBarProps> = ({
  onPress,
  placeholder = "What's on your mind?"
}) => {
  const themeColors = useThemeColors();
  const currentUser = getCurrentUser();
  const insets = useSafeAreaInsets();

  return (
    <View style={{
      position: 'absolute',
      bottom: 0, // Adjusted to make it flush with the bottom navigation bar
      left: 0,
      right: 0,
      backgroundColor: themeColors.background,
      borderTopWidth: 0.5,
      borderTopColor: themeColors.border,
      paddingHorizontal: 16,
      paddingVertical: 12,
      // Add shadow for better visibility
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: -2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 5,
    }}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}>
        {/* User Profile Picture */}
        {currentUser.profileImage ? (
          <Image
            source={{ uri: currentUser.profileImage }}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              marginRight: 12,
            }}
          />
        ) : (
          <View style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: themeColors.isDark 
              ? 'rgba(255, 255, 255, 0.1)' 
              : 'rgba(0, 0, 0, 0.1)',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
          }}>
            <Text style={{
              color: themeColors.text,
              fontSize: 14,
              fontWeight: '600',
              fontFamily: 'System',
            }}>
              {currentUser.displayName.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}

        {/* Create Post Input */}
        <TouchableOpacity
          onPress={onPress}
          style={{
            flex: 1,
            backgroundColor: themeColors.isDark 
              ? 'rgba(45, 45, 45, 1)' 
              : 'rgba(240, 240, 240, 1)',
            borderRadius: 8, // Soft rectangle edges - matching Explore search bar
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 10,
            height: 32, // Exact same height as Explore search bar
          }}
          activeOpacity={0.8}
        >
          <MessageCircle size={16} color={themeColors.textSecondary} strokeWidth={2} />
          <Text style={{
            flex: 1,
            marginLeft: 8,
            fontSize: 14,
            color: themeColors.textSecondary,
            fontWeight: '400',
            fontFamily: 'System',
          }}>
            {placeholder}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FloatingCreatePostBar; 
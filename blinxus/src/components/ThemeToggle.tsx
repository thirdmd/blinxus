import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { Moon, Sun } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useThemeColors } from '../hooks/useThemeColors';

interface ThemeToggleProps {
  showLabel?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  showLabel = true, 
  size = 'medium' 
}) => {
  const { isDark, toggleTheme } = useTheme();
  const themeColors = useThemeColors();
  
  const iconSize = size === 'small' ? 20 : size === 'large' ? 28 : 24;
  const buttonSize = size === 'small' ? 40 : size === 'large' ? 56 : 48;
  
  return (
    <TouchableOpacity
      onPress={toggleTheme}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: themeColors.backgroundSecondary,
        paddingHorizontal: showLabel ? 16 : 0,
        paddingVertical: showLabel ? 12 : 0,
        borderRadius: showLabel ? 12 : buttonSize / 2,
        width: showLabel ? undefined : buttonSize,
        height: showLabel ? undefined : buttonSize,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: themeColors.border,
      }}
      activeOpacity={0.7}
    >
      {isDark ? (
        <Sun size={iconSize} color={themeColors.text} strokeWidth={2} />
      ) : (
        <Moon size={iconSize} color={themeColors.text} strokeWidth={2} />
      )}
      
      {showLabel && (
        <Text
          style={{
            marginLeft: 8,
            fontSize: 16,
            fontWeight: '500',
            color: themeColors.text,
          }}
        >
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </Text>
      )}
    </TouchableOpacity>
  );
}; 
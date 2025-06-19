import React from 'react';
import { View, Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { colors } from '../constants';
import { useThemeColors } from '../hooks/useThemeColors';
import { rs, rf } from '../utils/responsive';

interface PillTagProps {
  label: string;
  color: string;
  onPress?: () => void;
  selected?: boolean;
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  alwaysFullColor?: boolean;
  isCreatePage?: boolean;
}

export default function PillTag({
  label,
  color,
  onPress,
  selected = false,
  size = 'medium',
  style,
  alwaysFullColor = false,
  isCreatePage = false,
}: PillTagProps) {
  const themeColors = useThemeColors();

  const getContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: rs(8),
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'flex-start',
    };

    // Size styles
    const sizeStyles = {
      small: { paddingHorizontal: rs(4), paddingVertical: rs(2) },
      medium: { paddingHorizontal: rs(6), paddingVertical: rs(2.5) },
      large: { paddingHorizontal: rs(8), paddingVertical: rs(3) },
    };

    // Special handling for colorless pills (All, Snow)
    const isColorlessPill = color === '#E5E7EB' || color === colors.activities.snow || color === themeColors.backgroundSecondary;
    
    if (isColorlessPill) {
      // Colorless pills: adapt to theme
      return {
        ...baseStyle,
        ...sizeStyles[size],
        backgroundColor: themeColors.backgroundSecondary,
        borderWidth: selected ? rs(1.5) : rs(0.5),
        borderColor: themeColors.text,
        ...style,
      };
    }

    // For colored pills: implement alternate color styling when alwaysFullColor is true
    if (alwaysFullColor) {
      if (selected) {
        // Selected: theme background with colored text and bold border
        return {
          ...baseStyle,
          ...sizeStyles[size],
          backgroundColor: themeColors.backgroundSecondary,
          borderWidth: rs(1.5), // Bold border when selected
          borderColor: color,
          ...style,
        };
      } else {
        // Unselected: colored background with white text
        return {
          ...baseStyle,
          ...sizeStyles[size],
          backgroundColor: color,
          borderWidth: rs(0.5),
          borderColor: color,
          ...style,
        };
      }
    }

    // Original logic for other cases (create page, etc.)
    const keepFullColor = [
      '#C62828', // adventure
      '#5C4033', // historical
      '#FFD700', // special
    ].includes(color);
    
    const backgroundColor = (selected || (alwaysFullColor && keepFullColor))
      ? color 
      : isCreatePage ? `${color}80` : `${color}60`;

    return {
      ...baseStyle,
      ...sizeStyles[size],
      backgroundColor,
      borderWidth: rs(0.5),
      borderColor: color,
      ...style,
    };
  };

  const getTextStyle = (): TextStyle => {
    const baseTextStyle: TextStyle = {
      fontWeight: 'normal',
    };

    // Size text styles
    const sizeTextStyles = {
      small: { fontSize: rf(12) },
      medium: { fontSize: rf(14) },
      large: { fontSize: rf(16) },
    };

    // Text color and weight logic
    const getTextColor = () => {
      // Colorless pills use theme text color
      if (color === '#E5E7EB' || color === colors.activities.snow || color === themeColors.backgroundSecondary) {
        return themeColors.text;
      }
      
      // For colored pills with alwaysFullColor (ExploreScreen)
      if (alwaysFullColor) {
        if (selected) {
          // Selected: colored text on theme background
          return color;
        } else {
          // Unselected: white text on colored background
          return '#FFFFFF';
        }
      }
      
      // Default: white text for all other cases
      return '#FFFFFF';
    };

    // Make text bold when selected
    const getFontWeight = () => {
      // Colorless pills: make text bold when selected to match border thickness
      if ((color === '#E5E7EB' || color === colors.activities.snow || color === themeColors.backgroundSecondary) && selected) {
        return '600'; // Semi-bold for colorless pills when selected
      }
      
      if (alwaysFullColor && selected) {
        return '600'; // Semi-bold for better readability when colored text on white
      }
      return 'normal';
    };

    return {
      ...baseTextStyle,
      ...sizeTextStyles[size],
      color: getTextColor(),
      fontWeight: getFontWeight(),
    };
  };

  if (onPress) {
    return (
      <TouchableOpacity
        style={getContainerStyle()}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Text style={getTextStyle()}>{label}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={getContainerStyle()}>
      <Text style={getTextStyle()}>{label}</Text>
    </View>
  );
} 
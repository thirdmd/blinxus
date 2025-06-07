import React from 'react';
import { View, Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { colors } from '../constants';

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
  const getContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'flex-start',
    };

    // Size styles
    const sizeStyles = {
      small: { paddingHorizontal: 8, paddingVertical: 4 },
      medium: { paddingHorizontal: 12, paddingVertical: 6 },
      large: { paddingHorizontal: 16, paddingVertical: 8 },
    };

    // Background color logic
    const keepFullColor = [
      '#C62828', // adventure
      '#5C4033', // historical
      '#FFD700', // special
    ].includes(color);
    
    const backgroundColor = (selected || (alwaysFullColor && keepFullColor))
      ? color 
      : alwaysFullColor 
      ? `${color}E6` // 90% opacity for most colors when alwaysFullColor
      : isCreatePage ? `${color}80` : `${color}60`; // Use 60% opacity when not selected AND not alwaysFullColor

    // Special handling for white/snow activities
    const specialStyle = color === colors.activities.snow 
      ? {
          backgroundColor: (selected || alwaysFullColor) ? colors.activities.snow : `${colors.activities.snow}40`,
          borderWidth: 1,
          borderColor: (selected || alwaysFullColor) ? colors.cobalt : colors.borderGray,
        }
      : {
          backgroundColor,
        };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...specialStyle,
      ...style,
    };
  };

  const getTextStyle = (): TextStyle => {
    const baseTextStyle: TextStyle = {
      fontWeight: '500',
    };

    // Size text styles
    const sizeTextStyles = {
      small: { fontSize: 12 },
      medium: { fontSize: 14 },
      large: { fontSize: 16 },
    };

    // Text color logic - ensure readability
    const getTextColor = () => {
      if (color === colors.activities.snow) {
        return colors.richBlack;
      }
      
      // For all other colors, use white text
      return colors.white;
    };

    return {
      ...baseTextStyle,
      ...sizeTextStyles[size],
      color: getTextColor(),
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
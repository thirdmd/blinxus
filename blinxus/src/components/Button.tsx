import React from 'react';
import { TouchableOpacity, Text, ViewStyle, TextStyle } from 'react-native';
import { colors } from '../constants';
import { rs, rf } from '../utils/responsive';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  style?: ViewStyle;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  style,
}: ButtonProps) {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: rs(20),
      alignItems: 'center',
      justifyContent: 'center',
    };

    // Size styles
    const sizeStyles = {
      small: { paddingHorizontal: rs(16), paddingVertical: rs(8) },
      medium: { paddingHorizontal: rs(24), paddingVertical: rs(12) },
      large: { paddingHorizontal: rs(32), paddingVertical: rs(16) },
    };

    // Variant styles
    const variantStyles = {
      primary: {
        backgroundColor: disabled ? colors.subtleGray : colors.cobalt,
      },
      secondary: {
        backgroundColor: disabled ? colors.subtleGray : colors.lightGrayBg,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: rs(1),
        borderColor: disabled ? colors.borderGray : colors.cobalt,
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...style,
    };
  };

  const getTextStyle = (): TextStyle => {
    const baseTextStyle: TextStyle = {
      fontWeight: '600',
    };

    // Size text styles
    const sizeTextStyles = {
      small: { fontSize: rf(14) },
      medium: { fontSize: rf(16) },
      large: { fontSize: rf(18) },
    };

    // Variant text styles
    const variantTextStyles = {
      primary: {
        color: disabled ? colors.mediumGray : colors.white,
      },
      secondary: {
        color: disabled ? colors.mediumGray : colors.richBlack,
      },
      outline: {
        color: disabled ? colors.mediumGray : colors.cobalt,
      },
    };

    return {
      ...baseTextStyle,
      ...sizeTextStyles[size],
      ...variantTextStyles[variant],
    };
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={getTextStyle()}>{title}</Text>
    </TouchableOpacity>
  );
} 


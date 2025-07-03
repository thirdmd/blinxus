import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { useThemeColors } from '../hooks/useThemeColors';
import { FORUM_ACTIVITY_TAGS } from '../screens/Pods/components/Forum/forumTypes';

export interface FilterPillProps {
  label: string;
  emoji?: string;
  color?: string;
  isSelected?: boolean;
  onPress?: () => void;
  onRemove?: () => void;
  size?: 'small' | 'medium' | 'large';
  variant?: 'filter' | 'tag' | 'category';
  tagId?: string; // For automatic emoji lookup
}

// Helper function to get emoji for activity tags
const getEmojiForTag = (tagId: string): string => {
  const tag = FORUM_ACTIVITY_TAGS.find(t => t.id === tagId);
  return tag?.emoji || '';
};

const FilterPill: React.FC<FilterPillProps> = ({
  label,
  emoji,
  color,
  isSelected = false,
  onPress,
  onRemove,
  size = 'medium',
  variant = 'filter',
  tagId
}) => {
  const themeColors = useThemeColors();

  // Consistent sizing based on size prop - smaller, sleeker pills
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingHorizontal: 8,
          paddingVertical: 3,
          borderRadius: 12,
          fontSize: 12,
          minHeight: 22,
        };
      case 'medium':
        return {
          paddingHorizontal: 10,
          paddingVertical: 4,
          borderRadius: 14,
          fontSize: 13,
          minHeight: 26,
        };
      case 'large':
        return {
          paddingHorizontal: 12,
          paddingVertical: 5,
          borderRadius: 16,
          fontSize: 14,
          minHeight: 30,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  // Get background color based on variant and state
  const getBackgroundColor = () => {
    if (isSelected) {
      return color || '#3B82F6'; // Blue for selected
    }
    
    if (variant === 'category' && color) {
      return color; // Use provided color for categories
    }
    
    // Default unselected background
    return themeColors.isDark 
      ? 'rgba(255, 255, 255, 0.08)'
      : 'rgba(0, 0, 0, 0.05)';
  };

  // Get text color based on state
  const getTextColor = () => {
    if (isSelected || (variant === 'category' && color)) {
      return '#FFFFFF';
    }
    return themeColors.text;
  };

  // Get border style for unselected state
  const getBorderStyle = () => {
    if (isSelected || (variant === 'category' && color)) {
      return {
        borderWidth: 0,
      };
    }
    
    return {
      borderWidth: 0.5,
      borderColor: themeColors.isDark 
        ? 'rgba(255, 255, 255, 0.08)' 
        : 'rgba(0, 0, 0, 0.06)',
    };
  };

  // Determine which emoji to use
  const displayEmoji = emoji || (tagId ? getEmojiForTag(tagId) : '');

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: getBackgroundColor(),
          paddingHorizontal: sizeStyles.paddingHorizontal,
          paddingVertical: sizeStyles.paddingVertical,
          borderRadius: sizeStyles.borderRadius,
          minHeight: sizeStyles.minHeight,
        },
        getBorderStyle()
      ]}
      activeOpacity={0.7}
    >
      {displayEmoji && (
        <Text style={{ 
          fontSize: sizeStyles.fontSize, 
          marginRight: 4 
        }}>
          {displayEmoji}
        </Text>
      )}
      <Text style={{
        color: getTextColor(),
        fontSize: sizeStyles.fontSize,
        fontWeight: isSelected ? '600' : '500',
        fontFamily: 'System',
        letterSpacing: -0.1,
      }}>
        {label}
      </Text>
      {onRemove && (
        <Text style={{ 
          color: getTextColor(), 
          fontSize: sizeStyles.fontSize + 1,
          marginLeft: 4,
          fontWeight: '400'
        }}>
          ×
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default FilterPill; 
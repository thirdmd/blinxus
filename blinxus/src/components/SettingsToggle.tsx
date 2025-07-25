import React from 'react';
import { TouchableOpacity, Animated } from 'react-native';
import { useThemeColors } from '../hooks/useThemeColors';
import { rs } from '../utils/responsive';

interface SettingsToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  size?: 'small' | 'medium';
}

const SettingsToggle: React.FC<SettingsToggleProps> = ({
  enabled,
  onToggle,
  size = 'medium'
}) => {
  const themeColors = useThemeColors();
  
  const toggleWidth = size === 'small' ? rs(44) : rs(50);
  const toggleHeight = size === 'small' ? rs(24) : rs(28);
  const knobSize = size === 'small' ? rs(18) : rs(22);
  
  const handlePress = () => {
    onToggle(!enabled);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={{
        width: toggleWidth,
        height: toggleHeight,
        borderRadius: toggleHeight / 2,
        backgroundColor: enabled ? themeColors.cobalt : themeColors.border,
        justifyContent: 'center',
        paddingHorizontal: rs(2),
      }}
      activeOpacity={0.7}
    >
      <Animated.View
        style={{
          width: knobSize,
          height: knobSize,
          borderRadius: knobSize / 2,
          backgroundColor: 'white',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: rs(2) },
          shadowOpacity: 0.2,
          shadowRadius: rs(2),
          elevation: 3,
          transform: [
            {
              translateX: enabled ? toggleWidth - knobSize - rs(4) : rs(2)
            }
          ]
        }}
      />
    </TouchableOpacity>
  );
};

export default SettingsToggle; 
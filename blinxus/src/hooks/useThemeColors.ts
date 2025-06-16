import { useTheme } from '../contexts/ThemeContext';
import { colors } from '../constants/colors';

export const useThemeColors = () => {
  const { isDark } = useTheme();
  
  return {
    // Background colors
    background: isDark ? colors.dark.background : colors.light.background,
    backgroundSecondary: isDark ? colors.dark.backgroundSecondary : colors.light.backgroundSecondary,
    backgroundTertiary: isDark ? colors.dark.backgroundTertiary : colors.light.backgroundSecondary,
    
    // Text colors
    text: isDark ? colors.dark.text : colors.light.text,
    textSecondary: isDark ? colors.dark.textSecondary : colors.light.textSecondary,
    textTertiary: isDark ? colors.dark.textTertiary : colors.light.textSecondary,
    
    // Border colors
    border: isDark ? colors.dark.border : colors.light.border,
    subtle: isDark ? colors.dark.subtle : colors.light.subtle,
    
    // Keep original colors for backward compatibility
    cobalt: colors.cobalt,
    cobaltLight: colors.cobaltLight,
    cobaltBg: colors.cobaltBg,
    activities: colors.activities,
    
    // Theme state
    isDark,
  };
}; 
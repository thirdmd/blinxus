import { useThemeColors } from './useThemeColors';

export const useFullscreenTheme = (isFullscreen: boolean = false) => {
  const originalThemeColors = useThemeColors();
  
  if (isFullscreen) {
    // Return dark theme colors for fullscreen mode
    return {
      ...originalThemeColors,
      isDark: true,
      background: '#000000',
      backgroundSecondary: '#1A1A1A',
      backgroundTertiary: '#2A2A2A',
      text: '#FFFFFF',
      textSecondary: '#A0A0A0',
      textTertiary: '#808080',
      border: '#333333',
      subtle: '#404040',
    };
  }
  
  // Return original theme colors for normal browsing
  return originalThemeColors;
}; 
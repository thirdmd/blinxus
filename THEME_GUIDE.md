# Night Mode Theme Guide

## Overview
Your app now has a beautiful night mode with dark night blue colors, just like in the image you shared! 🌙

## How to Use

### 1. Toggle Theme
- Go to **Profile** → **Settings** 
- You'll see a "Theme" option at the top with a toggle button
- Tap the moon/sun icon to switch between light and dark mode

### 2. Theme Colors
The dark theme uses these beautiful dark night blue colors:
- **Main Background**: `#0B1426` (Very dark navy blue)
- **Secondary Background**: `#1A2332` (Slightly lighter navy blue)
- **Tertiary Background**: `#243040` (Medium navy blue)
- **Text**: White and light blue-gray colors

### 3. For Developers - How to Use in Components

#### Import the hook:
```typescript
import { useThemeColors } from '../hooks/useThemeColors';
```

#### Use in your component:
```typescript
function MyComponent() {
  const themeColors = useThemeColors();
  
  return (
    <View style={{ backgroundColor: themeColors.background }}>
      <Text style={{ color: themeColors.text }}>
        Hello World!
      </Text>
    </View>
  );
}
```

#### Available Colors:
- `themeColors.background` - Main background
- `themeColors.backgroundSecondary` - Cards, sections
- `themeColors.backgroundTertiary` - Elevated elements
- `themeColors.text` - Primary text
- `themeColors.textSecondary` - Secondary text
- `themeColors.textTertiary` - Muted text
- `themeColors.border` - Borders
- `themeColors.subtle` - Subtle elements
- `themeColors.isDark` - Boolean to check if dark mode

### 4. Theme Toggle Component
You can add the theme toggle anywhere:
```typescript
import { ThemeToggle } from '../components/ThemeToggle';

// With label
<ThemeToggle showLabel={true} size="medium" />

// Icon only
<ThemeToggle showLabel={false} size="small" />
```

## Features
- ✅ Automatic system theme detection
- ✅ Manual theme switching
- ✅ Theme preference saved locally
- ✅ Beautiful dark night blue colors
- ✅ Smooth transitions
- ✅ StatusBar automatically adjusts

## Next Steps
To add theme support to more screens:
1. Import `useThemeColors` hook
2. Replace hardcoded colors with theme colors
3. Update StatusBar to use `themeColors.isDark`

Enjoy your beautiful night mode! 🌙✨ 
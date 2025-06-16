export const colors = {
  // Primary Colors
  cobalt: '#0047AB',
  cobaltLight: '#3B82F6',
  cobaltBg: 'rgba(0, 71, 171, 0.1)',
  
  // Light Theme
  light: {
    // Backgrounds
    background: '#FFFFFF',
    backgroundSecondary: '#F8F9FA',
    
    // Text Colors
    text: '#1A1A1A',
    textSecondary: '#6B7280',
    
    // Borders & Lines
    border: '#E5E7EB',
    subtle: '#F3F4F6',
  },
  
  // Dark Theme - Dark Night Blue like in the image
  dark: {
    // Backgrounds - Dark night blue gradient
    background: '#0B1426',        // Very dark navy blue (main background)
    backgroundSecondary: '#1A2332',      // Slightly lighter navy blue (cards, sections)
    backgroundTertiary: '#243040',       // Medium navy blue (elevated elements)
    
    // Text Colors
    text: '#FFFFFF',        // White text
    textSecondary: '#B8C5D1',      // Light blue-gray text
    textTertiary: '#8A9BA8',       // Muted blue-gray text
    
    // Borders & Lines
    border: '#2A3441',         // Dark blue-gray borders
    subtle: '#1F2937',         // Subtle dark blue
  },
  
  // Legacy colors (for backward compatibility)
  white: '#FFFFFF',
  lightGrayBg: '#F8F9FA',
  richBlack: '#1A1A1A',
  mediumGray: '#6B7280',
  borderGray: '#E5E7EB',
  subtleGray: '#F3F4F6',
  
  // Activity Tag Colors (deep, obvious, and accurate colors)
  activities: {
    adventure: '#D30000',       // Specific Red - exact red shade requested
    attractions: '#FF6F61',     // Electric Coral - keep this one
    cultural: '#D2691E',        // Chocolate/Saddle Brown - warm brown, distinct from historical
    culinary: '#800020',        // Burgundy - DEEP burgundy wine color
    historical: '#8B4513',      // Saddle Brown - OBVIOUSLY brown now
    mountains: '#228B22',       // Forest Green - OBVIOUSLY green now
    snow: '#FFFFFF',            // White with thin black border
    special: '#FFD700',         // Gold - keep this one
    stays: '#0047AB',           // Cobalt Blue - using the main cobalt color
    urban: '#708090',           // Slate Blue - keep this one
    water: '#00BCD4',           // Cyan Blue - keep this one
    wellness: '#9370DB',        // Medium Slate Blue/True Lavender
  }
} as const; 

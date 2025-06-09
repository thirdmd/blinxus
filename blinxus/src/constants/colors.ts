export const colors = {
  // Primary Colors
  cobalt: '#0047AB',
  cobaltLight: '#3B82F6',
  cobaltBg: 'rgba(0, 71, 171, 0.1)',
  
  // Backgrounds
  white: '#FFFFFF',
  lightGrayBg: '#F8F9FA',
  
  // Text Colors
  richBlack: '#1A1A1A',
  mediumGray: '#6B7280',
  
  // Borders & Lines
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

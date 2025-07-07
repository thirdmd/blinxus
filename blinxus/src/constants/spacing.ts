// Centralized spacing constants for consistent UI across the app
export const SPACING = {
  // Filter tags spacing
  FILTER_TAGS_TO_POSTS: 8, // Space between filter tags and forum posts
  
  // FloatingCreatePostBar spacing
  FLATLIST_BOTTOM_PADDING: 10, // Bottom padding for FlatLists to accommodate FloatingCreatePostBar height (paddingVertical 24 + input height 32 + border 0.5)
  
  // Other common spacings
  SECTION_MARGIN: 16,
  CARD_MARGIN: 12,
  CONTENT_PADDING: 20,
} as const; 
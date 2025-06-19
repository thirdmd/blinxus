import { useState, useEffect, useCallback } from 'react';
import { Dimensions } from 'react-native';

export type Orientation = 'portrait' | 'landscape';

export const useOrientation = (onOrientationChange?: (orientation: Orientation) => void) => {
  const [orientation, setOrientation] = useState<Orientation>(() => {
    const { width, height } = Dimensions.get('window');
    return width > height ? 'landscape' : 'portrait';
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      const { width, height } = window;
      const newOrientation = width > height ? 'landscape' : 'portrait';
      setOrientation(newOrientation);
      
      // Only call the callback if provided (for TravelFeedCard specific usage)
      if (onOrientationChange) {
        onOrientationChange(newOrientation);
      }
    });

    return () => subscription?.remove();
  }, [onOrientationChange]);

  return orientation;
}; 
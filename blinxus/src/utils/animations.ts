import { Animated, Easing, Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Animation constants for consistent timing across the app
export const ANIMATION_DURATIONS = {
  fast: 200,
  medium: 300,
  slow: 500,
  ultraFast: 150,
  lightning: 120, // Ultra-smooth 60fps page transitions
  instant: 80, // Instant feel with smooth animation for tabs
} as const;

export const ANIMATION_EASINGS = {
  easeOut: Easing.out(Easing.cubic),
  easeIn: Easing.in(Easing.cubic),
  easeInOut: Easing.inOut(Easing.cubic),
  spring: Easing.elastic(1.3),
  bounce: Easing.bounce,
} as const;

// Instagram-like expand animation for feed items
export const createExpandAnimation = (
  scaleValue: Animated.Value,
  opacityValue: Animated.Value,
  options?: {
    duration?: number;
    easing?: any;
    onComplete?: () => void;
  }
) => {
  const { duration = ANIMATION_DURATIONS.medium, easing = ANIMATION_EASINGS.easeOut, onComplete } = options || {};
  
  return Animated.parallel([
    Animated.timing(scaleValue, {
      toValue: 1,
      duration,
      easing,
      useNativeDriver: true,
    }),
    Animated.timing(opacityValue, {
      toValue: 1,
      duration: duration * 0.8, // Opacity animates slightly faster
      easing,
      useNativeDriver: true,
    }),
  ]);
};

// Instagram-like collapse animation for feed items
export const createCollapseAnimation = (
  scaleValue: Animated.Value,
  opacityValue: Animated.Value,
  options?: {
    duration?: number;
    easing?: any;
    onComplete?: () => void;
  }
) => {
  const { duration = ANIMATION_DURATIONS.fast, easing = ANIMATION_EASINGS.easeIn, onComplete } = options || {};
  
  return Animated.parallel([
    Animated.timing(scaleValue, {
      toValue: 0.95,
      duration,
      easing,
      useNativeDriver: true,
    }),
    Animated.timing(opacityValue, {
      toValue: 0,
      duration: duration * 0.6, // Opacity fades faster
      easing,
      useNativeDriver: true,
    }),
  ]);
};

// Smooth slide in from right (for screens/modals)
export const createSlideInRightAnimation = (
  translateXValue: Animated.Value,
  options?: {
    duration?: number;
    easing?: any;
    onComplete?: () => void;
  }
) => {
  const { duration = ANIMATION_DURATIONS.medium, easing = ANIMATION_EASINGS.easeOut, onComplete } = options || {};
  
  return Animated.timing(translateXValue, {
    toValue: 0,
    duration,
    easing,
    useNativeDriver: true,
  });
};

// Smooth slide out to right (for screens/modals)
export const createSlideOutRightAnimation = (
  translateXValue: Animated.Value,
  options?: {
    duration?: number;
    easing?: any;
    onComplete?: () => void;
  }
) => {
  const { duration = ANIMATION_DURATIONS.fast, easing = ANIMATION_EASINGS.easeIn, onComplete } = options || {};
  
  return Animated.timing(translateXValue, {
    toValue: screenWidth,
    duration,
    easing,
    useNativeDriver: true,
  });
};

// Smooth slide in from bottom (for modals/sheets)
export const createSlideInBottomAnimation = (
  translateYValue: Animated.Value,
  options?: {
    duration?: number;
    easing?: any;
    onComplete?: () => void;
  }
) => {
  const { duration = ANIMATION_DURATIONS.medium, easing = ANIMATION_EASINGS.easeOut, onComplete } = options || {};
  
  return Animated.timing(translateYValue, {
    toValue: 0,
    duration,
    easing,
    useNativeDriver: true,
  });
};

// Smooth slide out to bottom (for modals/sheets)
export const createSlideOutBottomAnimation = (
  translateYValue: Animated.Value,
  options?: {
    duration?: number;
    easing?: any;
    onComplete?: () => void;
  }
) => {
  const { duration = ANIMATION_DURATIONS.fast, easing = ANIMATION_EASINGS.easeIn, onComplete } = options || {};
  
  return Animated.timing(translateYValue, {
    toValue: screenHeight,
    duration,
    easing,
    useNativeDriver: true,
  });
};

// Fade in animation
export const createFadeInAnimation = (
  opacityValue: Animated.Value,
  options?: {
    duration?: number;
    easing?: any;
    onComplete?: () => void;
  }
) => {
  const { duration = ANIMATION_DURATIONS.medium, easing = ANIMATION_EASINGS.easeOut, onComplete } = options || {};
  
  return Animated.timing(opacityValue, {
    toValue: 1,
    duration,
    easing,
    useNativeDriver: true,
  });
};

// Fade out animation
export const createFadeOutAnimation = (
  opacityValue: Animated.Value,
  options?: {
    duration?: number;
    easing?: any;
    onComplete?: () => void;
  }
) => {
  const { duration = ANIMATION_DURATIONS.fast, easing = ANIMATION_EASINGS.easeIn, onComplete } = options || {};
  
  return Animated.timing(opacityValue, {
    toValue: 0,
    duration,
    easing,
    useNativeDriver: true,
  });
};

// Scale bounce animation (for button presses)
export const createScaleBounceAnimation = (
  scaleValue: Animated.Value,
  options?: {
    duration?: number;
    scale?: number;
    onComplete?: () => void;
  }
) => {
  const { duration = ANIMATION_DURATIONS.ultraFast, scale = 0.95, onComplete } = options || {};
  
  return Animated.sequence([
    Animated.timing(scaleValue, {
      toValue: scale,
      duration: duration / 2,
      easing: ANIMATION_EASINGS.easeOut,
      useNativeDriver: true,
    }),
    Animated.timing(scaleValue, {
      toValue: 1,
      duration: duration / 2,
      easing: ANIMATION_EASINGS.easeOut,
      useNativeDriver: true,
    }),
  ]);
};

// Combined Instagram-like feed item animation (expand with fade and scale)
export const createFeedItemExpandAnimation = (
  scaleValue: Animated.Value,
  opacityValue: Animated.Value,
  backgroundOpacityValue?: Animated.Value,
  options?: {
    duration?: number;
    onComplete?: () => void;
  }
) => {
  const { duration = ANIMATION_DURATIONS.medium, onComplete } = options || {};
  
  // Start from small scale and transparent
  scaleValue.setValue(0.8);
  opacityValue.setValue(0);
  if (backgroundOpacityValue) backgroundOpacityValue.setValue(0);
  
  const animations = [
    Animated.timing(scaleValue, {
      toValue: 1,
      duration,
      easing: ANIMATION_EASINGS.easeOut,
      useNativeDriver: true,
    }),
    Animated.timing(opacityValue, {
      toValue: 1,
      duration: duration * 0.8,
      easing: ANIMATION_EASINGS.easeOut,
      useNativeDriver: true,
    }),
  ];
  
  if (backgroundOpacityValue) {
    animations.push(
      Animated.timing(backgroundOpacityValue, {
        toValue: 0.9,
        duration: duration * 0.6,
        easing: ANIMATION_EASINGS.easeOut,
        useNativeDriver: true,
      })
    );
  }
  
  return Animated.parallel(animations);
};

// Combined Instagram-like feed item collapse animation
export const createFeedItemCollapseAnimation = (
  scaleValue: Animated.Value,
  opacityValue: Animated.Value,
  backgroundOpacityValue?: Animated.Value,
  options?: {
    duration?: number;
    onComplete?: () => void;
  }
) => {
  const { duration = ANIMATION_DURATIONS.fast, onComplete } = options || {};
  
  const animations = [
    Animated.timing(scaleValue, {
      toValue: 0.8,
      duration,
      easing: ANIMATION_EASINGS.easeIn,
      useNativeDriver: true,
    }),
    Animated.timing(opacityValue, {
      toValue: 0,
      duration: duration * 0.6,
      easing: ANIMATION_EASINGS.easeIn,
      useNativeDriver: true,
    }),
  ];
  
  if (backgroundOpacityValue) {
    animations.push(
      Animated.timing(backgroundOpacityValue, {
        toValue: 0,
        duration: duration * 0.4,
        easing: ANIMATION_EASINGS.easeIn,
        useNativeDriver: true,
      })
    );
  }
  
  return Animated.parallel(animations);
};

// Utility function to run animation with callback
export const runAnimation = (
  animation: Animated.CompositeAnimation,
  onComplete?: () => void
) => {
  animation.start((finished) => {
    if (finished && onComplete) {
      onComplete();
    }
  });
};

// Utility function to create initial animation values
export const createAnimationValues = () => ({
  scale: new Animated.Value(1),
  opacity: new Animated.Value(1),
  translateX: new Animated.Value(0),
  translateY: new Animated.Value(0),
  backgroundOpacity: new Animated.Value(0),
});

// Pre-configured animation sets for common use cases
export const FEED_ANIMATIONS = {
  expand: (values: ReturnType<typeof createAnimationValues>, onComplete?: () => void) =>
    createFeedItemExpandAnimation(values.scale, values.opacity, values.backgroundOpacity, { onComplete }),
  collapse: (values: ReturnType<typeof createAnimationValues>, onComplete?: () => void) =>
    createFeedItemCollapseAnimation(values.scale, values.opacity, values.backgroundOpacity, { onComplete }),
};

export const SCREEN_ANIMATIONS = {
  slideInRight: (values: ReturnType<typeof createAnimationValues>, onComplete?: () => void) =>
    createSlideInRightAnimation(values.translateX, { onComplete }),
  slideOutRight: (values: ReturnType<typeof createAnimationValues>, onComplete?: () => void) =>
    createSlideOutRightAnimation(values.translateX, { onComplete }),
  slideInBottom: (values: ReturnType<typeof createAnimationValues>, onComplete?: () => void) =>
    createSlideInBottomAnimation(values.translateY, { onComplete }),
  slideOutBottom: (values: ReturnType<typeof createAnimationValues>, onComplete?: () => void) =>
    createSlideOutBottomAnimation(values.translateY, { onComplete }),
  fadeIn: (values: ReturnType<typeof createAnimationValues>, onComplete?: () => void) =>
    createFadeInAnimation(values.opacity, { onComplete }),
  fadeOut: (values: ReturnType<typeof createAnimationValues>, onComplete?: () => void) =>
    createFadeOutAnimation(values.opacity, { onComplete }),
};

export const BUTTON_ANIMATIONS = {
  scaleBounce: (values: ReturnType<typeof createAnimationValues>, onComplete?: () => void) =>
    createScaleBounceAnimation(values.scale, { onComplete }),
};

// Profile Settings slide animations - stable and smooth with proper easing
export const createSettingsSlideInAnimation = (
  translateXValue: Animated.Value,
  backgroundTranslateXValue?: Animated.Value,
  options?: {
    onComplete?: () => void;
  }
) => {
  const { onComplete } = options || {};
  
  const animations = [
    Animated.timing(translateXValue, {
      toValue: 0,
      duration: 250, // Slightly longer for stability
      easing: ANIMATION_EASINGS.easeOut, // Smooth easing for stable text
      useNativeDriver: true,
    })
  ];

  // Add subtle parallax effect for background screen with same easing
  if (backgroundTranslateXValue) {
    animations.push(
      Animated.timing(backgroundTranslateXValue, {
        toValue: -screenWidth * 0.2, // Reduced parallax for stability
        duration: 250,
        easing: ANIMATION_EASINGS.easeOut, // Consistent easing
        useNativeDriver: true,
      })
    );
  }

  return Animated.parallel(animations);
};

export const createSettingsSlideOutAnimation = (
  translateXValue: Animated.Value,
  backgroundTranslateXValue?: Animated.Value,
  options?: {
    onComplete?: () => void;
  }
) => {
  const { onComplete } = options || {};
  
  const animations = [
    Animated.timing(translateXValue, {
      toValue: screenWidth,
      duration: 200, // Slightly faster exit for responsiveness
      easing: ANIMATION_EASINGS.easeIn, // Smooth easing for stable exit
      useNativeDriver: true,
    })
  ];

  // Return background to original position with same easing
  if (backgroundTranslateXValue) {
    animations.push(
      Animated.timing(backgroundTranslateXValue, {
        toValue: 0,
        duration: 200,
        easing: ANIMATION_EASINGS.easeIn, // Consistent easing
        useNativeDriver: true,
      })
    );
  }

  return Animated.parallel(animations);
};

// Profile Library slide animations - stable and smooth with proper easing
export const createLibrarySlideInAnimation = (
  translateXValue: Animated.Value,
  backgroundTranslateXValue?: Animated.Value,
  options?: {
    onComplete?: () => void;
  }
) => {
  const { onComplete } = options || {};
  
  const animations = [
    Animated.timing(translateXValue, {
      toValue: 0,
      duration: 250, // Slightly longer for stability
      easing: ANIMATION_EASINGS.easeOut, // Smooth easing for stable text
      useNativeDriver: true,
    })
  ];

  // Add subtle parallax effect for background screen with same easing
  if (backgroundTranslateXValue) {
    animations.push(
      Animated.timing(backgroundTranslateXValue, {
        toValue: -screenWidth * 0.2, // Reduced parallax for stability
        duration: 250,
        easing: ANIMATION_EASINGS.easeOut, // Consistent easing
        useNativeDriver: true,
      })
    );
  }

  return Animated.parallel(animations);
};

export const createLibrarySlideOutAnimation = (
  translateXValue: Animated.Value,
  backgroundTranslateXValue?: Animated.Value,
  options?: {
    onComplete?: () => void;
  }
) => {
  const { onComplete } = options || {};
  
  const animations = [
    Animated.timing(translateXValue, {
      toValue: screenWidth,
      duration: 200, // Slightly faster exit for responsiveness
      easing: ANIMATION_EASINGS.easeIn, // Smooth easing for stable exit
      useNativeDriver: true,
    })
  ];

  // Return background to original position with same easing
  if (backgroundTranslateXValue) {
    animations.push(
      Animated.timing(backgroundTranslateXValue, {
        toValue: 0,
        duration: 200,
        easing: ANIMATION_EASINGS.easeIn, // Consistent easing
        useNativeDriver: true,
      })
    );
  }

  return Animated.parallel(animations);
}; 

// Page Navigation Animations - for screen transitions
export const createPageSlideInAnimation = (
  translateXValue: Animated.Value,
  opacityValue?: Animated.Value,
  options?: {
    duration?: number;
    easing?: any;
    onComplete?: () => void;
  }
) => {
  const { duration = ANIMATION_DURATIONS.medium, easing = ANIMATION_EASINGS.easeOut, onComplete } = options || {};
  
  const animations = [
    Animated.timing(translateXValue, {
      toValue: 0,
      duration,
      easing,
      useNativeDriver: true,
    })
  ];

  if (opacityValue) {
    animations.push(
      Animated.timing(opacityValue, {
        toValue: 1,
        duration: duration * 0.8,
        easing,
        useNativeDriver: true,
      })
    );
  }

  return Animated.parallel(animations);
};

export const createPageSlideOutAnimation = (
  translateXValue: Animated.Value,
  opacityValue?: Animated.Value,
  options?: {
    duration?: number;
    easing?: any;
    direction?: 'left' | 'right';
    onComplete?: () => void;
  }
) => {
  const { 
    duration = ANIMATION_DURATIONS.medium, 
    easing = ANIMATION_EASINGS.easeIn, 
    direction = 'left',
    onComplete 
  } = options || {};
  
  const targetValue = direction === 'left' ? -screenWidth : screenWidth;
  
  const animations = [
    Animated.timing(translateXValue, {
      toValue: targetValue,
      duration,
      easing,
      useNativeDriver: true,
    })
  ];

  if (opacityValue) {
    animations.push(
      Animated.timing(opacityValue, {
        toValue: 0,
        duration: duration * 0.6,
        easing,
        useNativeDriver: true,
      })
    );
  }

  return Animated.parallel(animations);
};

// Combined page transition animation (for seamless navigation)
export const createPageTransitionAnimation = (
  outgoingTranslateX: Animated.Value,
  incomingTranslateX: Animated.Value,
  outgoingOpacity?: Animated.Value,
  incomingOpacity?: Animated.Value,
  options?: {
    duration?: number;
    easing?: any;
    direction?: 'forward' | 'backward';
    onComplete?: () => void;
  }
) => {
  const { 
    duration = ANIMATION_DURATIONS.medium, 
    easing = ANIMATION_EASINGS.easeInOut, 
    direction = 'forward',
    onComplete 
  } = options || {};
  
  // Forward: current screen slides left, new screen slides in from right
  // Backward: current screen slides right, previous screen slides in from left
  const outgoingTarget = direction === 'forward' ? -screenWidth : screenWidth;
  const incomingStart = direction === 'forward' ? screenWidth : -screenWidth;
  
  // Set initial position for incoming screen
  incomingTranslateX.setValue(incomingStart);
  if (incomingOpacity) {
    incomingOpacity.setValue(0);
  }
  
  const animations = [
    // Outgoing screen animation
    Animated.timing(outgoingTranslateX, {
      toValue: outgoingTarget,
      duration,
      easing,
      useNativeDriver: true,
    }),
    // Incoming screen animation
    Animated.timing(incomingTranslateX, {
      toValue: 0,
      duration,
      easing,
      useNativeDriver: true,
    })
  ];

  // Add opacity animations if provided
  if (outgoingOpacity) {
    animations.push(
      Animated.timing(outgoingOpacity, {
        toValue: 0,
        duration: duration * 0.6,
        easing,
        useNativeDriver: true,
      })
    );
  }

  if (incomingOpacity) {
    animations.push(
      Animated.timing(incomingOpacity, {
        toValue: 1,
        duration: duration * 0.8,
        easing,
        useNativeDriver: true,
      })
    );
  }

  return Animated.parallel(animations);
};
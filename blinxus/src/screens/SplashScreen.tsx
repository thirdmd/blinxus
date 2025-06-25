import React, { useEffect } from 'react';
import { View, Image, StatusBar } from 'react-native';
import { useThemeColors } from '../hooks/useThemeColors';
import { getResponsiveDimensions, ri, rs } from '../utils/responsive';

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const themeColors = useThemeColors();
  const responsiveDimensions = getResponsiveDimensions();

  useEffect(() => {
    // Show splash for 2 seconds then call onFinish
    const timer = setTimeout(() => {
      onFinish();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View style={{
      flex: 1,
      backgroundColor: themeColors.background,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <StatusBar 
        barStyle={themeColors.isDark ? "light-content" : "dark-content"} 
        backgroundColor={themeColors.background} 
      />
      
      <Image 
        source={require('../../../assets/splash.png')} 
        style={{ 
          width: ri(300), // Large splash image
          height: ri(300), // Square aspect
        }}
        resizeMode="contain"
      />
    </View>
  );
};

export default SplashScreen; 
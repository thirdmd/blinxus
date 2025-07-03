import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StatusBar,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { X, ArrowRight, Camera, Image as ImageIcon } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import CreateRegularPost from './CreateRegularPost';
import CreateLucids from './CreateLucids';
import { useThemeColors } from '../../hooks/useThemeColors';
import { getResponsiveDimensions, getTypographyScale, ri, rs, rf, RESPONSIVE_SCREEN } from '../../utils/responsive';

const { width } = RESPONSIVE_SCREEN;
const responsiveDimensions = getResponsiveDimensions();
const typography = getTypographyScale();

type PostType = 'Post' | 'Lucids';

interface TabButtonProps {
  title: string;
  icon: React.ReactNode;
  isActive: boolean;
  onPress: () => void;
  themeColors: any;
}

const TabButton: React.FC<TabButtonProps> = ({ title, icon, isActive, onPress, themeColors }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ 
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        backgroundColor: isActive 
          ? themeColors.isDark 
            ? 'rgba(255, 255, 255, 0.1)'
            : 'rgba(0, 0, 0, 0.08)'
          : 'transparent',
        marginRight: 8,
      }}
      activeOpacity={0.7}
      >
      {React.cloneElement(icon as React.ReactElement, { 
        size: 16, 
          color: isActive ? themeColors.text : themeColors.textSecondary,
          strokeWidth: 1.5
        } as any)}
        <Text style={{
        marginLeft: 6,
        fontSize: 15,
        fontWeight: isActive ? '600' : '400',
        color: isActive ? themeColors.text : themeColors.textSecondary,
        fontFamily: 'System',
        }}>
          {title}
        </Text>
    </TouchableOpacity>
  );
};

export default function CreatePost() {
  const navigation = useNavigation();
  const themeColors = useThemeColors();
  const [activeTab, setActiveTab] = useState<PostType>('Post');
  const childRef = useRef<any>(null);
  const [isValid, setIsValid] = useState(false);
  const [key, setKey] = useState(0); // Force re-render of child components
  const [shouldReset, setShouldReset] = useState(false);

  // Reset ONLY when we return from navigation
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // When we come back to this screen, reset everything
      setActiveTab('Post');
      setIsValid(false);
      setKey(prev => prev + 1);
      setShouldReset(false);
    });

    return unsubscribe;
  }, [navigation]);

  const handleValidationChange = (validationState: boolean) => {
    setIsValid(validationState);
  };

  const handleShare = () => {
    if (childRef.current && childRef.current.handleSubmit && isValid) {
      setShouldReset(true); // Mark that we should reset when we come back
      childRef.current.handleSubmit();
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Post':
        return <CreateRegularPost key={`post-${key}`} ref={childRef} navigation={navigation} onValidationChange={handleValidationChange} />;
      case 'Lucids':
        return <CreateLucids key={`lucids-${key}`} ref={childRef} navigation={navigation} onValidationChange={handleValidationChange} />;
      default:
        return <CreateRegularPost key={`post-${key}`} ref={childRef} navigation={navigation} onValidationChange={handleValidationChange} />;
    }
  };

  const getTabData = () => [
    {
      key: 'Post' as PostType,
      title: 'Post',
      icon: <Camera />
    },
    {
      key: 'Lucids' as PostType,
      title: 'Lucids',
      icon: <ImageIcon />
    }
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
      <StatusBar 
        barStyle={themeColors.isDark ? "light-content" : "dark-content"} 
        backgroundColor={themeColors.background} 
      />
      
      {/* Header */}
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        paddingHorizontal: 20,
        paddingVertical: 16,
      }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ 
            width: 40, 
            height: 40, 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}
          activeOpacity={0.7}
        >
          <X size={24} color={themeColors.text} strokeWidth={2} />
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={handleShare}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: isValid 
              ? themeColors.cobalt
              : themeColors.isDark 
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(0, 0, 0, 0.1)',
          }}
          activeOpacity={0.7}
          disabled={!isValid}
        >
          <ArrowRight 
            size={18} 
            color={isValid 
              ? '#ffffff'
              : themeColors.textSecondary
            } 
            strokeWidth={2} 
          />
        </TouchableOpacity>
      </View>

      {/* Tab Selection */}
      <View style={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          {getTabData().map((tab) => (
            <TabButton
              key={tab.key}
              title={tab.title}
              icon={tab.icon}
              isActive={activeTab === tab.key}
              onPress={() => setActiveTab(tab.key)}
              themeColors={themeColors}
            />
          ))}
        </View>
      </View>

      {/* Content Area */}
      <View style={{ flex: 1 }}>
          {renderContent()}
      </View>
    </SafeAreaView>
  );
}
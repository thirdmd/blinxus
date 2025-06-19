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
import { X, ArrowRight, Edit3, Zap, Camera } from 'lucide-react-native';
import { colors } from '../../constants';
import CreateRegularPost from './CreateRegularPost';
import CreateLucids from './CreateLucids';
import CreateBlinx from './CreateBlinx';
import { useThemeColors } from '../../hooks/useThemeColors';

const { width } = Dimensions.get('window');

type PostType = 'Post' | 'Blinx' | 'Lucids';

interface TabButtonProps {
  title: string;
  icon: React.ReactNode;
  isActive: boolean;
  onPress: () => void;
  themeColors: any;
}

function TabButton({ title, icon, isActive, onPress, themeColors }: TabButtonProps) {
  const scaleValue = useRef(new Animated.Value(isActive ? 1.15 : 0.95)).current;
  const underlineScale = useRef(new Animated.Value(isActive ? 1 : 0)).current;
  const opacityValue = useRef(new Animated.Value(isActive ? 1 : 0.6)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: isActive ? 1.15 : 0.95,
        useNativeDriver: true,
        tension: 200,
        friction: 6,
      }),
      Animated.spring(underlineScale, {
        toValue: isActive ? 1 : 0,
        useNativeDriver: true,
        tension: 250,
        friction: 7,
      }),
      Animated.spring(opacityValue, {
        toValue: isActive ? 1 : 0.6,
        useNativeDriver: true,
        tension: 300,
        friction: 8,
      }),
    ]).start();
  }, [isActive]);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ 
        flex: 1, 
        paddingVertical: 12, 
        paddingHorizontal: 4, 
        marginHorizontal: 4 
      }}
      activeOpacity={0.3}
    >
      <Animated.View 
        style={{ 
          alignItems: 'center',
          transform: [{ scale: scaleValue }],
          opacity: opacityValue 
        }}
      >
        {React.isValidElement(icon) && React.cloneElement(icon, {
          size: 18,
          color: isActive ? themeColors.text : themeColors.textSecondary,
          strokeWidth: 1.5
        } as any)}
        <Text style={{
          fontWeight: '300',
          fontSize: 14,
          marginTop: 6,
          color: isActive ? themeColors.text : themeColors.textSecondary
        }}>
          {title}
        </Text>
        <Animated.View 
          style={{
            width: 24,
            height: 2,
            backgroundColor: themeColors.text,
            marginTop: 8,
            borderRadius: 1,
            transform: [{ scaleX: underlineScale }]
          }}
        />
      </Animated.View>
    </TouchableOpacity>
  );
}

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
      case 'Blinx':
        return <CreateBlinx key={`blinx-${key}`} ref={childRef} navigation={navigation} onValidationChange={handleValidationChange} />;
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
      icon: <Edit3 />
    },
    {
      key: 'Blinx' as PostType,
      title: 'Blinx',
      icon: <Zap />
    },
    {
      key: 'Lucids' as PostType,
      title: 'Lucids',
      icon: <Camera />
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
        paddingHorizontal: 24, 
        paddingVertical: 16 
      }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ 
            width: 40, 
            height: 40, 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}
          activeOpacity={0.3}
        >
          <X size={24} color={themeColors.text} strokeWidth={2} />
        </TouchableOpacity>
        
        <View style={{ flex: 1 }} />
        
        <TouchableOpacity
          onPress={handleShare}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: isValid 
              ? (themeColors.isDark ? themeColors.text : '#000000')
              : themeColors.backgroundSecondary
          }}
          activeOpacity={0.3}
          disabled={!isValid}
        >
          <ArrowRight 
            size={18} 
            color={isValid 
              ? (themeColors.isDark ? themeColors.background : '#ffffff')
              : themeColors.textSecondary
            } 
            strokeWidth={2} 
          />
        </TouchableOpacity>
      </View>

      {/* Tab Selection */}
      <View style={{ paddingHorizontal: 24, paddingVertical: 16 }}>
        <View style={{ flexDirection: 'row' }}>
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
      <View style={{ 
        flex: 1, 
        backgroundColor: themeColors.background 
      }}>
        <View style={{ 
          backgroundColor: themeColors.background, 
          borderTopLeftRadius: 24, 
          borderTopRightRadius: 24, 
          flex: 1, 
          paddingTop: 24 
        }}>
          {renderContent()}
        </View>
      </View>
    </SafeAreaView>
  );
}
import React, { useState, useRef } from 'react';
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

const { width } = Dimensions.get('window');

type PostType = 'Post' | 'Blinx' | 'Lucids';

interface TabButtonProps {
  title: string;
  icon: React.ReactNode;
  isActive: boolean;
  onPress: () => void;
}

function TabButton({ title, icon, isActive, onPress }: TabButtonProps) {
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
      className="flex-1 py-3 px-1 mx-1"
      activeOpacity={0.3}
    >
      <Animated.View 
        className="items-center"
        style={{ 
          transform: [{ scale: scaleValue }],
          opacity: opacityValue 
        }}
      >
        {React.isValidElement(icon) && React.cloneElement(icon, {
          size: 18,
          color: isActive ? '#000000' : '#6B7280',
          strokeWidth: 1.5
        } as any)}
        <Text className={`font-light text-sm mt-1.5 ${
          isActive ? 'text-black' : 'text-gray-600'
        }`}>
          {title}
        </Text>
        <Animated.View 
          className="w-6 h-0.5 bg-black mt-2 rounded-full"
          style={{ transform: [{ scaleX: underlineScale }] }}
        />
      </Animated.View>
    </TouchableOpacity>
  );
}

export default function CreatePost() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<PostType>('Post');
  const childRef = useRef<any>(null);
  const [isValid, setIsValid] = useState(false);

  const handleValidationChange = (validationState: boolean) => {
    setIsValid(validationState);
  };

  const handleShare = () => {
    if (childRef.current && childRef.current.handleSubmit && isValid) {
      childRef.current.handleSubmit();
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Post':
        return <CreateRegularPost ref={childRef} navigation={navigation} onValidationChange={handleValidationChange} />;
      case 'Blinx':
        return <CreateBlinx ref={childRef} navigation={navigation} onValidationChange={handleValidationChange} />;
      case 'Lucids':
        return <CreateLucids ref={childRef} navigation={navigation} onValidationChange={handleValidationChange} />;
      default:
        return <CreateRegularPost ref={childRef} navigation={navigation} onValidationChange={handleValidationChange} />;
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
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 items-center justify-center"
          activeOpacity={0.3}
        >
          <X size={24} color="#000000" strokeWidth={2} />
        </TouchableOpacity>
        
        <View className="flex-1" />
        
        <TouchableOpacity
          onPress={handleShare}
          className={`w-10 h-10 rounded-full items-center justify-center ${
            isValid 
              ? 'bg-black' 
              : 'bg-gray-100'
          }`}
          activeOpacity={0.3}
          disabled={!isValid}
        >
          <ArrowRight 
            size={18} 
            color={isValid ? '#ffffff' : '#9CA3AF'} 
            strokeWidth={2} 
          />
        </TouchableOpacity>
      </View>

      {/* Tab Selection */}
      <View className="px-6 py-4">
        <View className="flex-row">
          {getTabData().map((tab) => (
            <TabButton
              key={tab.key}
              title={tab.title}
              icon={tab.icon}
              isActive={activeTab === tab.key}
              onPress={() => setActiveTab(tab.key)}
            />
          ))}
        </View>
      </View>

      {/* Content Area */}
      <View className="flex-1 bg-gray-50">
        <View className="bg-white rounded-t-3xl flex-1 pt-6">
          {renderContent()}
        </View>
      </View>
    </SafeAreaView>
  );
}
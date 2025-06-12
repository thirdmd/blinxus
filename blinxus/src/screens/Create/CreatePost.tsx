import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../constants';
import CreateRegularPost from './CreateRegularPost';
import CreateLucids from './CreateLucids';
import CreateBlinx from './CreateBlinx';

const { width } = Dimensions.get('window');

type PostType = 'Post' | 'Blinx' | 'Lucids';

interface TabButtonProps {
  title: string;
  isActive: boolean;
  onPress: () => void;
}

function TabButton({ title, isActive, onPress }: TabButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`px-8 py-4 rounded-full ${
        isActive ? 'bg-gray-900' : 'bg-gray-50'
      }`}
      style={{
        shadowColor: isActive ? '#000' : 'transparent',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isActive ? 0.08 : 0,
        shadowRadius: 8,
        elevation: isActive ? 2 : 0,
      }}
      activeOpacity={0.7}
    >
      <Text
        className={`font-semibold text-base ${
          isActive ? 'text-white' : 'text-gray-500'
        }`}
      >
        {title}
      </Text>
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

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header - More spacious and elegant */}
      <View className="flex-row items-center justify-between px-6 py-6">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-12 h-12 rounded-full bg-gray-50 items-center justify-center"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 1,
          }}
          activeOpacity={0.7}
        >
          <Text className="text-gray-600 text-lg">✕</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={handleShare}
          className={`w-12 h-12 rounded-full items-center justify-center ${
            isValid ? 'bg-blue-600' : 'bg-gray-300'
          }`}
          style={{
            shadowColor: isValid ? '#0047AB' : '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isValid ? 0.12 : 0.05,
            shadowRadius: 6,
            elevation: isValid ? 3 : 1,
          }}
          activeOpacity={0.8}
          disabled={!isValid}
        >
          <Text className={`text-lg font-semibold ${
            isValid ? 'text-white' : 'text-gray-500'
          }`}>→</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Navigation - More spacious and centered */}
      <View className="items-center py-8 px-6">
        <View className="flex-row space-x-4 bg-gray-50 p-2 rounded-full">
          <TabButton
            title="Post"
            isActive={activeTab === 'Post'}
            onPress={() => setActiveTab('Post')}
          />
          <TabButton
            title="Blinx"
            isActive={activeTab === 'Blinx'}
            onPress={() => setActiveTab('Blinx')}
          />
          <TabButton
            title="Lucids"
            isActive={activeTab === 'Lucids'}
            onPress={() => setActiveTab('Lucids')}
          />
        </View>
        
        {/* Subtle description for context */}
        <Text className="text-sm text-gray-400 mt-4 text-center">
          {activeTab === 'Post' && 'Share your travel moments'}
          {activeTab === 'Blinx' && 'Capture real-time stories'}
          {activeTab === 'Lucids' && 'Create immersive albums'}
        </Text>
      </View>

      {/* Content */}
      <View className="flex-1">
        {renderContent()}
      </View>
    </SafeAreaView>
  );
}
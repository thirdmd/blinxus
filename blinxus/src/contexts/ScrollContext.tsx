import React, { createContext, useContext } from 'react';
import { FlatList, ScrollView } from 'react-native';

// Create scroll context for double-tap functionality
const ScrollContext = createContext<{
  exploreScrollRef?: React.RefObject<FlatList | null>;
  podsScrollRef?: React.RefObject<ScrollView | null>;
  profileScrollRef?: React.RefObject<ScrollView | null>;
}>({});

export const useScrollContext = () => useContext(ScrollContext);
export default ScrollContext; 
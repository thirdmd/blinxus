import React, { useState, useEffect } from 'react';
import { View, ScrollView, Dimensions } from 'react-native';

interface MasonryListProps {
  data: any[];
  renderItem: (item: any, index: number, columnWidth: number) => React.ReactElement;
  columns?: number;
  spacing?: number;
  onRefresh?: () => void;
  refreshing?: boolean;
  ListHeaderComponent?: React.ReactElement;
  onScroll?: (event: any) => void;
  scrollEventThrottle?: number;
  contentContainerStyle?: any;
}

const MasonryList: React.FC<MasonryListProps> = ({
  data,
  renderItem,
  columns = 2,
  spacing = 12,
  onRefresh,
  refreshing,
  ListHeaderComponent,
  onScroll,
  scrollEventThrottle,
  contentContainerStyle,
}) => {
  const screenWidth = Dimensions.get('window').width;
  const columnWidth = (screenWidth - spacing * (columns + 1)) / columns;
  
  // Distribute items into columns
  const distributeItems = () => {
    const columnArrays: any[][] = Array.from({ length: columns }, () => []);
    const columnHeights = new Array(columns).fill(0);
    
    data.forEach((item, index) => {
      // Find the shortest column
      const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
      columnArrays[shortestColumnIndex].push({ item, index });
      
      // Estimate height based on aspect ratio if available
      const aspectRatio = item.images?.[0] ? 1.5 : 1; // Default aspect ratio
      columnHeights[shortestColumnIndex] += columnWidth / aspectRatio + 60; // Image height + metadata height
    });
    
    return columnArrays;
  };
  
  const columnArrays = distributeItems();
  
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      onScroll={onScroll}
      scrollEventThrottle={scrollEventThrottle}
      contentContainerStyle={contentContainerStyle}
    >
      {ListHeaderComponent}
      
      <View className="flex-row" style={{ paddingHorizontal: spacing / 2 }}>
        {columnArrays.map((columnItems, columnIndex) => (
          <View
            key={`column-${columnIndex}`}
            className="flex-1"
            style={{ paddingHorizontal: spacing / 2 }}
          >
            {columnItems.map(({ item, index }) => (
              <View key={item.id || index}>
                {renderItem(item, index, columnWidth)}
              </View>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default MasonryList; 
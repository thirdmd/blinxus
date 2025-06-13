import React, { useState, useEffect, useMemo } from 'react';
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
  bounces?: boolean;
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
  scrollEventThrottle = 32,
  contentContainerStyle,
  bounces = true,
}) => {
  const screenWidth = Dimensions.get('window').width;
  const columnWidth = (screenWidth - spacing * (columns + 1)) / columns;
  
  // Memoize the column distribution to prevent recalculation on every scroll
  const columnArrays = useMemo(() => {
    const arrays: any[][] = Array.from({ length: columns }, () => []);
    const columnHeights = new Array(columns).fill(0);
    
    data.forEach((item, index) => {
      // Find the shortest column
      const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
      arrays[shortestColumnIndex].push({ item, index });
      
      // Estimate height based on aspect ratio if available
      const aspectRatio = item.images?.[0] ? 1.5 : 1; // Default aspect ratio
      columnHeights[shortestColumnIndex] += columnWidth / aspectRatio + 60; // Image height + metadata height
    });
    
    return arrays;
  }, [data, columns, columnWidth]); // Only recalculate when data, columns, or columnWidth changes
  
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      onScroll={onScroll}
      scrollEventThrottle={scrollEventThrottle}
      contentContainerStyle={[
        { paddingBottom: 40 }, // Reduced padding for less space at bottom
        contentContainerStyle
      ]}
      bounces={bounces}
      overScrollMode="auto"
      removeClippedSubviews={true}
      scrollIndicatorInsets={{ right: 1 }}
      decelerationRate="normal"
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
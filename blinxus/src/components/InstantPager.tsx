import React, { forwardRef, useCallback } from 'react';
import PagerView, { PagerViewOnPageSelectedEvent } from 'react-native-pager-view';
import { StyleSheet, ViewStyle, View, Platform, StatusBar } from 'react-native';

/**
 * InstantPager: a vertical pager that jumps to pages instantly when swiped.
 */
type InstantPagerProps<ItemT> = {
  data: ItemT[];
  renderItem: ({ item, index }: { item: ItemT; index: number }) => React.ReactNode;
  keyExtractor: (item: ItemT, index: number) => string;
  initialPage?: number;
  onPageSelected?: (index: number) => void;
  style?: ViewStyle;
};

const InstantPager = forwardRef<PagerView, InstantPagerProps<any>>(
  (
    {
      data,
      renderItem,
      keyExtractor,
      initialPage = 0,
      onPageSelected,
      style,
    }: InstantPagerProps<any>,
    ref
  ) => {
    const handlePageSelected = useCallback(
      (e: PagerViewOnPageSelectedEvent) => {
        const pos = e.nativeEvent.position;
        onPageSelected?.(pos);
      },
      [onPageSelected]
    );

    return (
      <PagerView
        ref={ref}
        style={[styles.pager, style]}
        initialPage={initialPage}
        orientation="vertical"
        onPageSelected={handlePageSelected}
        scrollEnabled={true}
        overScrollMode="never"
      >
        {data.map((item, index) => (
          <View key={keyExtractor(item, index)} style={styles.page}>
            {renderItem({ item, index })}
          </View>
        ))}
      </PagerView>
    );
  }
);

const styles = StyleSheet.create({
  pager: { flex: 1 },
  page: { flex: 1 },
});

export default InstantPager; 
import { useState } from 'react';

// Generic filter hook for any type of tab/filter functionality
export function useFilterTabs<T extends string>(defaultFilter: T) {
  const [selectedFilter, setSelectedFilter] = useState<T>(defaultFilter);

  const handleFilterSelect = (filter: T) => {
    setSelectedFilter(filter);
  };

  return {
    selectedFilter,
    handleFilterSelect,
  };
}

// Specific hook for activity-based filtering (for posts)
export function useActivityFilter<T>(
  items: T[],
  getItemActivity: (item: T) => string | undefined,
  defaultFilter: string = 'all'
) {
  const { selectedFilter, handleFilterSelect } = useFilterTabs(defaultFilter);

  // Filter logic
  const filteredItems = selectedFilter === 'all' 
    ? items 
    : items.filter(item => getItemActivity(item) === selectedFilter);

  return {
    selectedFilter,
    handleFilterSelect,
    filteredItems,
  };
}

// For future use in Pods - tab navigation without filtering
export function useTabNavigation(defaultTab: string) {
  return useFilterTabs(defaultTab);
} 
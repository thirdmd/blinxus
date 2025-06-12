import React from 'react';
import { View, ScrollView } from 'react-native';
import PillTag from './PillTag';

interface FilterOption {
  id: string;
  label: string;
  color: string;
}

interface FilterPillsProps {
  options: FilterOption[];
  selectedFilter: string;
  onFilterSelect: (filterId: string) => void;
  showAllOption?: boolean;
  allOptionLabel?: string;
  allOptionColor?: string;
}

export default function FilterPills({
  options,
  selectedFilter,
  onFilterSelect,
  showAllOption = true,
  allOptionLabel = 'All',
  allOptionColor = '#E5E7EB'
}: FilterPillsProps) {
  return (
    <View className="bg-white p-4">
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row">
          {/* All Filter Pill */}
          {showAllOption && (
            <View 
              className="mr-2"
              style={{
                transform: [{ scale: selectedFilter === 'all' ? 1.05 : 1 }]
              }}
            >
              <PillTag
                label={allOptionLabel}
                color={allOptionColor}
                onPress={() => onFilterSelect('all')}
                alwaysFullColor={true}
              />
            </View>
          )}
          
          {/* Filter Options */}
          {options.map((option) => (
            <View 
              key={option.id} 
              className="mr-2"
              style={{
                transform: [{ scale: selectedFilter === option.id ? 1.05 : 1 }]
              }}
            >
              <PillTag
                label={option.label}
                color={option.color}
                onPress={() => onFilterSelect(option.id)}
                alwaysFullColor={true}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
} 
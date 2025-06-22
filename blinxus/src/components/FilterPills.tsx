import React from 'react';
import { View, ScrollView } from 'react-native';
import PillTag from './PillTag';
import { useThemeColors } from '../hooks/useThemeColors';

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
  const themeColors = useThemeColors();
  
  return (
    <View style={{ backgroundColor: themeColors.background, paddingVertical: 16, paddingHorizontal: 16 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row">
          {/* All Filter Pill */}
          {showAllOption && (
            <View 
              className="mr-3"
              style={{
                // More prominent indicator with subtle background and scale
                transform: [{ scale: selectedFilter === 'all' ? 1.08 : 1 }],
                backgroundColor: selectedFilter === 'all' 
                  ? `${themeColors.text}08`  // 3% opacity background highlight
                  : 'transparent',
                borderRadius: 20,
                paddingHorizontal: selectedFilter === 'all' ? 4 : 0,
                paddingVertical: 2,
                // Subtle shadow for selected state
                ...(selectedFilter === 'all' && {
                  shadowColor: themeColors.text,
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 2,
                  elevation: 2,
                })
              }}
            >
              <PillTag
                label={allOptionLabel}
                color={allOptionColor}
                onPress={() => onFilterSelect('all')}
                selected={selectedFilter === 'all'}
                alwaysFullColor={true}
              />
            </View>
          )}
          
          {/* Filter Options */}
          {options.map((option) => (
            <View 
              key={option.id} 
              className="mr-3"
              style={{
                // More prominent indicator with subtle background and scale
                transform: [{ scale: selectedFilter === option.id ? 1.08 : 1 }],
                backgroundColor: selectedFilter === option.id 
                  ? `${option.color}12`  // 7% opacity background highlight with pill color
                  : 'transparent',
                borderRadius: 20,
                paddingHorizontal: selectedFilter === option.id ? 4 : 0,
                paddingVertical: 2,
                // Subtle shadow for selected state
                ...(selectedFilter === option.id && {
                  shadowColor: option.color,
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.15,
                  shadowRadius: 3,
                  elevation: 2,
                })
              }}
            >
              <PillTag
                label={option.label}
                color={option.color}
                onPress={() => onFilterSelect(option.id)}
                selected={selectedFilter === option.id}
                alwaysFullColor={true}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
} 
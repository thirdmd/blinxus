import { colors } from './colors';

export const activityTags = [
  { id: 1, name: 'Aquatics', color: colors.activities.water },
  { id: 2, name: 'Outdoors', color: colors.activities.mountains },
  { id: 3, name: 'City', color: colors.activities.urban },
  { id: 6, name: 'Food', color: colors.activities.culinary },
  { id: 9, name: 'Stays', color: colors.activities.stays },
  { id: 8, name: 'Heritage', color: colors.activities.historical },
  { id: 7, name: 'Wellness', color: colors.activities.wellness },
  { id: 10, name: 'Amusements', color: colors.activities.attractions },
  { id: 4, name: 'Cultural', color: colors.activities.cultural },
  { id: 11, name: 'Special Experiences', color: colors.activities.special },
  { id: 5, name: 'Thrill', color: colors.activities.adventure },
] as const;

export type ActivityTag = typeof activityTags[number]; 
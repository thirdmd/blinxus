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

// Helper objects for easier access by key
export const activityColors = {
  thrill: colors.activities.adventure,
  amusements: colors.activities.attractions,
  cultural: colors.activities.cultural,
  food: colors.activities.culinary,
  heritage: colors.activities.historical,
  outdoors: colors.activities.mountains,
  special: colors.activities.special,
  stays: colors.activities.stays,
  city: colors.activities.urban,
  aquatics: colors.activities.water,
  wellness: colors.activities.wellness,
};

export const activityNames = {
  thrill: 'Thrill',
  amusements: 'Amusements',
  cultural: 'Cultural',
  food: 'Food',
  heritage: 'Heritage',
  outdoors: 'Outdoors',
  special: 'Special Experiences',
  stays: 'Stays',
  city: 'City',
  aquatics: 'Aquatics',
  wellness: 'Wellness',
};

export type ActivityKey = keyof typeof activityColors; 
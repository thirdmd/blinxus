export { colors } from './colors';
export { activityTags } from './activityTags';
export type { ActivityTag } from './activityTags';

// Places data for Pods
export { 
  placesData, 
  philippinesData, 
  asiaData,
  searchLocations,
  getLocationById,
  getLocationByName,
  getCountryByLocationId,
  getContinentByLocationId
} from './placesData';
export type { 
  Continent, 
  Country, 
  SubLocation, 
  BaseLocation 
} from './placesData'; 
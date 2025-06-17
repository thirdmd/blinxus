import { ActivityKey } from './activityTags';

// Base location interface
export interface BaseLocation {
  id: string;
  name: string;
  alternateNames: string[]; // For search functionality (e.g., "elyu" for "La Union")
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  description?: string;
  bestTimeToVisit?: string;
  knownFor?: string[];
}

// Sub-location interface (cities, towns, specific spots)
export interface SubLocation extends BaseLocation {
  parentId: string; // ID of parent location (country/region)
  popularActivities: ActivityKey[];
  averageStay?: string; // e.g., "2-3 days"
  difficulty?: 'easy' | 'moderate' | 'challenging';
  crowdLevel?: 'low' | 'moderate' | 'high';
  budgetLevel?: 'budget' | 'mid-range' | 'luxury';
}

// Country/Region interface
export interface Country extends BaseLocation {
  continentId: string;
  currency?: string;
  language?: string[];
  timezone?: string;
  subLocations: SubLocation[];
}

// Continent interface
export interface Continent extends BaseLocation {
  countries: Country[];
}

// Philippines data with comprehensive location coverage
export const philippinesData: Country = {
  id: 'ph',
  name: 'Philippines',
  alternateNames: ['PH', 'Pinas', 'Pilipinas', 'Philippine Islands'],
  continentId: 'asia',
  currency: 'PHP',
  language: ['Filipino', 'English'],
  timezone: 'GMT+8',
  description: 'A tropical archipelago of over 7,000 islands known for pristine beaches, rich culture, and warm hospitality.',
  coordinates: {
    latitude: 12.8797,
    longitude: 121.7740
  },
  subLocations: [
    {
      id: 'ph-manila',
      name: 'Manila',
      alternateNames: ['NCR', 'National Capital Region', 'Metro Manila', 'Maynila'],
      parentId: 'ph',
      popularActivities: ['city', 'heritage', 'food', 'cultural'],
      description: 'The bustling capital city of the Philippines, rich in history and culture.',
      bestTimeToVisit: 'December to May',
      knownFor: ['Intramuros', 'Rizal Park', 'Manila Bay Sunset', 'Street Food'],
      averageStay: '2-3 days',
      difficulty: 'easy',
      crowdLevel: 'high',
      budgetLevel: 'mid-range',
      coordinates: {
        latitude: 14.5995,
        longitude: 120.9842
      }
    },
    {
      id: 'ph-palawan',
      name: 'Palawan',
      alternateNames: ['Palawan Province', 'Last Frontier'],
      parentId: 'ph',
      popularActivities: ['aquatics', 'outdoors', 'wellness'],
      description: 'A pristine island province known as the "Last Frontier" of the Philippines.',
      bestTimeToVisit: 'November to May',
      knownFor: ['El Nido', 'Coron', 'Underground River', 'Island Hopping'],
      averageStay: '5-7 days',
      difficulty: 'moderate',
      crowdLevel: 'moderate',
      budgetLevel: 'mid-range',
      coordinates: {
        latitude: 9.8349,
        longitude: 118.7384
      }
    },
    {
      id: 'ph-boracay',
      name: 'Boracay',
      alternateNames: ['Bora', 'Boracay Island'],
      parentId: 'ph',
      popularActivities: ['aquatics', 'wellness', 'amusements'],
      description: 'World-famous island known for its powdery white sand beaches.',
      bestTimeToVisit: 'November to April',
      knownFor: ['White Beach', 'Kitesurfing', 'Sunset Sailing', 'Beach Parties'],
      averageStay: '3-4 days',
      difficulty: 'easy',
      crowdLevel: 'high',
      budgetLevel: 'mid-range',
      coordinates: {
        latitude: 11.9674,
        longitude: 121.9248
      }
    },
    {
      id: 'ph-siargao',
      name: 'Siargao',
      alternateNames: ['Siargao Island', 'Surfing Capital'],
      parentId: 'ph',
      popularActivities: ['aquatics', 'outdoors', 'wellness'],
      description: 'The surfing capital of the Philippines with laid-back island vibes.',
      bestTimeToVisit: 'March to October',
      knownFor: ['Cloud 9 Surf Break', 'Island Hopping', 'Coconut Trees', 'Magpupungko Pools'],
      averageStay: '4-5 days',
      difficulty: 'moderate',
      crowdLevel: 'moderate',
      budgetLevel: 'budget',
      coordinates: {
        latitude: 9.8601,
        longitude: 126.0619
      }
    },
    {
      id: 'ph-cebu',
      name: 'Cebu',
      alternateNames: ['Cebu City', 'Queen City of the South', 'Sugbu'],
      parentId: 'ph',
      popularActivities: ['heritage', 'food', 'thrill', 'aquatics'],
      description: 'Historical city in the Visayas region, gateway to many islands.',
      bestTimeToVisit: 'December to May',
      knownFor: ['Magellan\'s Cross', 'Lechon', 'Whale Shark Watching', 'Canyoneering'],
      averageStay: '3-4 days',
      difficulty: 'easy',
      crowdLevel: 'high',
      budgetLevel: 'mid-range',
      coordinates: {
        latitude: 10.3157,
        longitude: 123.8854
      }
    },
    {
      id: 'ph-bohol',
      name: 'Bohol',
      alternateNames: ['Bohol Province'],
      parentId: 'ph',
      popularActivities: ['outdoors', 'cultural', 'aquatics'],
      description: 'Island province famous for the Chocolate Hills and tarsiers.',
      bestTimeToVisit: 'November to April',
      knownFor: ['Chocolate Hills', 'Tarsier Sanctuary', 'Loboc River', 'Panglao Island'],
      averageStay: '3-4 days',
      difficulty: 'easy',
      crowdLevel: 'moderate',
      budgetLevel: 'mid-range',
      coordinates: {
        latitude: 9.8349,
        longitude: 124.1433
      }
    },
    {
      id: 'ph-la-union',
      name: 'La Union',
      alternateNames: ['LU', 'Elyu', 'Urbiztondo'],
      parentId: 'ph',
      popularActivities: ['aquatics', 'food', 'wellness'],
      description: 'Coastal province in northern Luzon known for surfing and local food.',
      bestTimeToVisit: 'October to March',
      knownFor: ['Surfing', 'Halo-halo', 'Grape Picking', 'Beach Resorts'],
      averageStay: '2-3 days',
      difficulty: 'easy',
      crowdLevel: 'moderate',
      budgetLevel: 'budget',
      coordinates: {
        latitude: 16.6159,
        longitude: 120.3209
      }
    },
    {
      id: 'ph-batangas',
      name: 'Batangas',
      alternateNames: ['Batangas Province', 'Bats'],
      parentId: 'ph',
      popularActivities: ['aquatics', 'heritage', 'food'],
      description: 'Southern Luzon province known for beaches and historical sites.',
      bestTimeToVisit: 'November to April',
      knownFor: ['Taal Volcano', 'Anilao Diving', 'Lomi', 'Beach Resorts'],
      averageStay: '2-3 days',
      difficulty: 'easy',
      crowdLevel: 'moderate',
      budgetLevel: 'budget',
      coordinates: {
        latitude: 13.7565,
        longitude: 121.0583
      }
    },
    {
      id: 'ph-ilocos',
      name: 'Ilocos',
      alternateNames: ['Ilocos Norte', 'Ilocos Sur', 'Ilocandia'],
      parentId: 'ph',
      popularActivities: ['heritage', 'cultural', 'food', 'outdoors'],
      description: 'Northwestern provinces known for Spanish colonial architecture.',
      bestTimeToVisit: 'November to February',
      knownFor: ['Vigan Heritage Village', 'Bangui Windmills', 'Empanada', 'Sand Dunes'],
      averageStay: '3-4 days',
      difficulty: 'easy',
      crowdLevel: 'moderate',
      budgetLevel: 'budget',
      coordinates: {
        latitude: 17.5895,
        longitude: 120.4501
      }
    },
    {
      id: 'ph-zambales',
      name: 'Zambales',
      alternateNames: ['Zambales Province', 'Subic', 'Iba'],
      parentId: 'ph',
      popularActivities: ['aquatics', 'outdoors', 'thrill'],
      description: 'Western Luzon province with pristine beaches and adventure activities.',
      bestTimeToVisit: 'December to May',
      knownFor: ['Anawangin Cove', 'Capones Island', 'Subic Bay', 'Beach Camping'],
      averageStay: '2-3 days',
      difficulty: 'moderate',
      crowdLevel: 'low',
      budgetLevel: 'budget',
      coordinates: {
        latitude: 15.0794,
        longitude: 119.9647
      }
    },
    {
      id: 'ph-davao',
      name: 'Davao',
      alternateNames: ['Davao City', 'Davao del Sur', 'Durian Capital'],
      parentId: 'ph',
      popularActivities: ['outdoors', 'food', 'cultural', 'thrill'],
      description: 'Major city in Mindanao known for Mount Apo and durian.',
      bestTimeToVisit: 'November to May',
      knownFor: ['Mount Apo', 'Durian', 'Philippine Eagle Center', 'Samal Island'],
      averageStay: '3-4 days',
      difficulty: 'moderate',
      crowdLevel: 'moderate',
      budgetLevel: 'mid-range',
      coordinates: {
        latitude: 7.1907,
        longitude: 125.4553
      }
    },
    {
      id: 'ph-baguio',
      name: 'Baguio',
      alternateNames: ['Baguio City', 'Summer Capital', 'City of Pines'],
      parentId: 'ph',
      popularActivities: ['outdoors', 'cultural', 'food', 'wellness'],
      description: 'Mountain city known for its cool climate and pine trees.',
      bestTimeToVisit: 'November to February',
      knownFor: ['Session Road', 'Burnham Park', 'Strawberry Picking', 'Cool Climate'],
      averageStay: '2-3 days',
      difficulty: 'easy',
      crowdLevel: 'high',
      budgetLevel: 'budget',
      coordinates: {
        latitude: 16.4023,
        longitude: 120.5960
      }
    }
  ]
};

// Europe Data
export const franceData: Country = {
  id: 'fr',
  name: 'France',
  alternateNames: ['FR', 'French Republic', 'République française'],
  continentId: 'europe',
  currency: 'EUR',
  language: ['French'],
  timezone: 'GMT+1',
  description: 'The country of romance, art, and culinary excellence.',
  coordinates: {
    latitude: 46.2276,
    longitude: 2.2137
  },
  subLocations: [
    {
      id: 'fr-paris',
      name: 'Paris',
      alternateNames: ['City of Light', 'City of Love', 'Paname'],
      parentId: 'fr',
      popularActivities: ['cultural', 'heritage', 'food', 'city'],
      description: 'The romantic capital city known for art, fashion, and cuisine.',
      bestTimeToVisit: 'April to June, September to October',
      knownFor: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame', 'Champs-Élysées'],
      averageStay: '4-5 days',
      difficulty: 'easy',
      crowdLevel: 'high',
      budgetLevel: 'luxury',
      coordinates: {
        latitude: 48.8566,
        longitude: 2.3522
      }
    }
  ]
};

// North America Data
export const usaData: Country = {
  id: 'us',
  name: 'United States',
  alternateNames: ['USA', 'US', 'America', 'United States of America'],
  continentId: 'north-america',
  currency: 'USD',
  language: ['English'],
  timezone: 'GMT-5 to GMT-10',
  description: 'Land of opportunity with diverse landscapes and vibrant cities.',
  coordinates: {
    latitude: 39.8283,
    longitude: -98.5795
  },
  subLocations: [
    {
      id: 'us-new-york',
      name: 'New York City',
      alternateNames: ['NYC', 'The Big Apple', 'Manhattan'],
      parentId: 'us',
      popularActivities: ['city', 'cultural', 'food', 'heritage'],
      description: 'The city that never sleeps, center of finance and culture.',
      bestTimeToVisit: 'April to June, September to November',
      knownFor: ['Statue of Liberty', 'Times Square', 'Central Park', 'Broadway'],
      averageStay: '4-6 days',
      difficulty: 'easy',
      crowdLevel: 'high',
      budgetLevel: 'luxury',
      coordinates: {
        latitude: 40.7128,
        longitude: -74.0060
      }
    }
  ]
};

// South America Data
export const brazilData: Country = {
  id: 'br',
  name: 'Brazil',
  alternateNames: ['BR', 'Brasil', 'Federative Republic of Brazil'],
  continentId: 'south-america',
  currency: 'BRL',
  language: ['Portuguese'],
  timezone: 'GMT-3 to GMT-5',
  description: 'Land of carnival, football, and Amazon rainforest.',
  coordinates: {
    latitude: -14.2350,
    longitude: -51.9253
  },
  subLocations: [
    {
      id: 'br-rio',
      name: 'Rio de Janeiro',
      alternateNames: ['Rio', 'Cidade Maravilhosa', 'Marvelous City'],
      parentId: 'br',
      popularActivities: ['aquatics', 'cultural', 'amusements', 'city'],
      description: 'Famous for its beaches, carnival, and Christ the Redeemer statue.',
      bestTimeToVisit: 'December to March',
      knownFor: ['Christ the Redeemer', 'Copacabana Beach', 'Carnival', 'Sugarloaf Mountain'],
      averageStay: '4-5 days',
      difficulty: 'easy',
      crowdLevel: 'high',
      budgetLevel: 'mid-range',
      coordinates: {
        latitude: -22.9068,
        longitude: -43.1729
      }
    }
  ]
};

// Africa Data
export const southAfricaData: Country = {
  id: 'za',
  name: 'South Africa',
  alternateNames: ['ZA', 'SA', 'Republic of South Africa'],
  continentId: 'africa',
  currency: 'ZAR',
  language: ['English', 'Afrikaans', 'Zulu'],
  timezone: 'GMT+2',
  description: 'Rainbow nation with diverse wildlife and stunning landscapes.',
  coordinates: {
    latitude: -30.5595,
    longitude: 22.9375
  },
  subLocations: [
    {
      id: 'za-cape-town',
      name: 'Cape Town',
      alternateNames: ['Mother City', 'Kaapstad', 'iKapa'],
      parentId: 'za',
      popularActivities: ['outdoors', 'cultural', 'food', 'heritage'],
      description: 'Beautiful coastal city with Table Mountain and wine regions.',
      bestTimeToVisit: 'November to March',
      knownFor: ['Table Mountain', 'V&A Waterfront', 'Wine Regions', 'Robben Island'],
      averageStay: '4-5 days',
      difficulty: 'easy',
      crowdLevel: 'moderate',
      budgetLevel: 'mid-range',
      coordinates: {
        latitude: -33.9249,
        longitude: 18.4241
      }
    }
  ]
};

// Australia/Oceania Data
export const australiaData: Country = {
  id: 'au',
  name: 'Australia',
  alternateNames: ['AU', 'Oz', 'Commonwealth of Australia'],
  continentId: 'oceania',
  currency: 'AUD',
  language: ['English'],
  timezone: 'GMT+8 to GMT+11',
  description: 'Land down under with unique wildlife and stunning coastlines.',
  coordinates: {
    latitude: -25.2744,
    longitude: 133.7751
  },
  subLocations: [
    {
      id: 'au-sydney',
      name: 'Sydney',
      alternateNames: ['Harbour City', 'Emerald City'],
      parentId: 'au',
      popularActivities: ['city', 'aquatics', 'cultural', 'outdoors'],
      description: 'Iconic harbor city with famous opera house and bridge.',
      bestTimeToVisit: 'September to November, March to May',
      knownFor: ['Sydney Opera House', 'Harbour Bridge', 'Bondi Beach', 'The Rocks'],
      averageStay: '4-5 days',
      difficulty: 'easy',
      crowdLevel: 'high',
      budgetLevel: 'luxury',
      coordinates: {
        latitude: -33.8688,
        longitude: 151.2093
      }
    }
  ]
};

// Antarctica Data (for completeness, though no typical tourism)
export const antarcticaCountryData: Country = {
  id: 'aq',
  name: 'Antarctica',
  alternateNames: ['Antarctic Continent', 'The White Continent'],
  continentId: 'antarctica',
  currency: 'N/A',
  language: ['International'],
  timezone: 'All time zones',
  description: 'The pristine white continent for extreme adventure seekers.',
  coordinates: {
    latitude: -82.8628,
    longitude: 135.0000
  },
  subLocations: [
    {
      id: 'aq-research-stations',
      name: 'Research Stations',
      alternateNames: ['Antarctic Bases', 'Scientific Stations'],
      parentId: 'aq',
      popularActivities: ['thrill', 'outdoors', 'special'],
      description: 'Extreme expedition destination for the most adventurous travelers.',
      bestTimeToVisit: 'November to February',
      knownFor: ['Penguins', 'Icebergs', 'Research Stations', 'Midnight Sun'],
      averageStay: '7-14 days',
      difficulty: 'challenging',
      crowdLevel: 'low',
      budgetLevel: 'luxury',
      coordinates: {
        latitude: -77.8419,
        longitude: 166.6863
      }
    }
  ]
};

// Asia continent data
export const asiaData: Continent = {
  id: 'asia',
  name: 'Asia',
  alternateNames: ['Asian Continent'],
  description: 'The largest and most diverse continent with rich cultures and stunning landscapes.',
  countries: [philippinesData]
};

// Europe continent data
export const europeData: Continent = {
  id: 'europe',
  name: 'Europe',
  alternateNames: ['European Continent'],
  description: 'Historic continent with rich cultural heritage and architectural marvels.',
  countries: [franceData]
};

// North America continent data
export const northAmericaData: Continent = {
  id: 'north-america',
  name: 'North America',
  alternateNames: ['North American Continent'],
  description: 'Diverse continent from arctic tundra to tropical beaches.',
  countries: [usaData]
};

// South America continent data
export const southAmericaData: Continent = {
  id: 'south-america',
  name: 'South America',
  alternateNames: ['South American Continent'],
  description: 'Vibrant continent with Amazon rainforest and Andes mountains.',
  countries: [brazilData]
};

// Africa continent data
export const africaData: Continent = {
  id: 'africa',
  name: 'Africa',
  alternateNames: ['African Continent'],
  description: 'Cradle of humanity with incredible wildlife and diverse cultures.',
  countries: [southAfricaData]
};

// Oceania continent data
export const oceaniaData: Continent = {
  id: 'oceania',
  name: 'Oceania',
  alternateNames: ['Australia & Oceania', 'Pacific Islands'],
  description: 'Island continent with unique ecosystems and laid-back culture.',
  countries: [australiaData]
};

// Antarctica continent data
export const antarcticaData: Continent = {
  id: 'antarctica',
  name: 'Antarctica',
  alternateNames: ['Antarctic Continent', 'The White Continent'],
  description: 'The final frontier for extreme adventure and scientific exploration.',
  countries: [antarcticaCountryData]
};

// Main places data structure with all continents
export const placesData: Continent[] = [
  asiaData,
  europeData,
  northAmericaData,
  southAmericaData,
  africaData,
  oceaniaData,
  antarcticaData
];

// Helper functions for location search and matching
export const searchLocations = (query: string): SubLocation[] => {
  const normalizedQuery = query.toLowerCase().trim();
  const results: SubLocation[] = [];
  
  placesData.forEach(continent => {
    continent.countries.forEach(country => {
      country.subLocations.forEach(location => {
        // Check main name
        if (location.name.toLowerCase().includes(normalizedQuery)) {
          results.push(location);
          return;
        }
        
        // Check alternate names
        if (location.alternateNames.some(altName => 
          altName.toLowerCase().includes(normalizedQuery)
        )) {
          results.push(location);
          return;
        }
        
        // Check known for tags
        if (location.knownFor?.some(tag => 
          tag.toLowerCase().includes(normalizedQuery)
        )) {
          results.push(location);
        }
      });
    });
  });
  
  return results;
};

export const getLocationById = (id: string): SubLocation | null => {
  for (const continent of placesData) {
    for (const country of continent.countries) {
      const location = country.subLocations.find(loc => loc.id === id);
      if (location) return location;
    }
  }
  return null;
};

export const getLocationByName = (name: string): SubLocation | null => {
  const normalizedName = name.toLowerCase().trim();
  
  for (const continent of placesData) {
    for (const country of continent.countries) {
      for (const location of country.subLocations) {
        // Check main name
        if (location.name.toLowerCase() === normalizedName) {
          return location;
        }
        
        // Check alternate names
        if (location.alternateNames.some(altName => 
          altName.toLowerCase() === normalizedName
        )) {
          return location;
        }
      }
    }
  }
  
  return null;
};

export const getCountryByLocationId = (locationId: string): Country | null => {
  for (const continent of placesData) {
    for (const country of continent.countries) {
      if (country.subLocations.some(loc => loc.id === locationId)) {
        return country;
      }
    }
  }
  return null;
};

export const getContinentByLocationId = (locationId: string): Continent | null => {
  for (const continent of placesData) {
    for (const country of continent.countries) {
      if (country.subLocations.some(loc => loc.id === locationId)) {
        return continent;
      }
    }
  }
  return null;
};

// All types and functions are exported above
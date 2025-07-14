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
  subSubLocations?: SubSubLocation[]; // NEW: Add support for sub-sub-locations
}

// NEW: Sub-sub-location interface (specific areas within a city/town)
export interface SubSubLocation extends BaseLocation {
  parentSubLocationId: string; // ID of parent sublocation
  popularActivities?: ActivityKey[];
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
      },
      subSubLocations: [
        {
          id: 'ph-manila-binondo',
          name: 'Binondo',
          alternateNames: ['Binondo District'],
          parentSubLocationId: 'ph-manila',
          popularActivities: ['food', 'cultural'],
          coordinates: {
            latitude: 14.5561,
            longitude: 120.9761
          }
        },
        {
          id: 'ph-manila-malate',
          name: 'Malate',
          alternateNames: ['Malate District'],
          parentSubLocationId: 'ph-manila',
          popularActivities: ['city', 'heritage'],
          coordinates: {
            latitude: 14.5777,
            longitude: 120.9811
          }
        }
      ]
    },
    {
      id: 'ph-palawan',
      name: 'Palawan',
      alternateNames: [''],
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
      },
      subSubLocations: [
        {
          id: 'ph-palawan-el-nido',
          name: 'El Nido',
          alternateNames: ['elnido', 'El Nido Palawan'],
          parentSubLocationId: 'ph-palawan',
          popularActivities: ['aquatics', 'outdoors', 'wellness'],
          coordinates: {
            latitude: 11.1949,
            longitude: 119.5089
          }
        },
        {
          id: 'ph-palawan-coron',
          name: 'Coron',
          alternateNames: ['Coron Island', 'Coron Palawan'],
          parentSubLocationId: 'ph-palawan',
          popularActivities: ['aquatics', 'outdoors', 'wellness'],
          coordinates: {
            latitude: 11.9989,
            longitude: 120.2043
          }
        }
      ]
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
      },
      subSubLocations: [
        {
          id: 'ph-boracay-white-beach',
          name: 'White Beach',
          alternateNames: ['White Beach District'],
          parentSubLocationId: 'ph-boracay',
          popularActivities: ['aquatics', 'wellness', 'amusements'],
          coordinates: {
            latitude: 11.9674,
            longitude: 121.9248
          }
        },
        {
          id: 'ph-boracay-kitesurfing',
          name: 'Kitesurfing',
          alternateNames: ['Kitesurfing District'],
          parentSubLocationId: 'ph-boracay',
          popularActivities: ['aquatics', 'wellness', 'amusements'],
          coordinates: {
            latitude: 11.9674,
            longitude: 121.9248
          }
        }
      ]
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
      },
      subSubLocations: [
        {
          id: 'ph-siargao-cloud-9',
          name: 'Cloud 9 Surf Break',
          alternateNames: ['Cloud 9 District'],
          parentSubLocationId: 'ph-siargao',
          popularActivities: ['aquatics', 'outdoors', 'wellness'],
          coordinates: {
            latitude: 9.8601,
            longitude: 126.0619
          }
        },
        {
          id: 'ph-siargao-island-hopping',
          name: 'Island Hopping',
          alternateNames: ['Island Hopping District'],
          parentSubLocationId: 'ph-siargao',
          popularActivities: ['aquatics', 'outdoors', 'wellness'],
          coordinates: {
            latitude: 9.8601,
            longitude: 126.0619
          }
        }
      ]
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
      },
      subSubLocations: [
        {
          id: 'ph-cebu-magellan-cross',
          name: 'Magellan\'s Cross',
          alternateNames: ['Magellan\'s Cross District'],
          parentSubLocationId: 'ph-cebu',
          popularActivities: ['heritage', 'cultural'],
          coordinates: {
            latitude: 10.3157,
            longitude: 123.8854
          }
        },
        {
          id: 'ph-cebu-lechon',
          name: 'Lechon',
          alternateNames: ['Lechon District'],
          parentSubLocationId: 'ph-cebu',
          popularActivities: ['food', 'cultural'],
          coordinates: {
            latitude: 10.3157,
            longitude: 123.8854
          }
        },
        {
          id: 'ph-cebu-whale-shark-watching',
          name: 'Whale Shark Watching',
          alternateNames: ['Whale Shark Watching District'],
          parentSubLocationId: 'ph-cebu',
          popularActivities: ['aquatics', 'cultural'],
          coordinates: {
            latitude: 10.3157,
            longitude: 123.8854
          }
        }
      ]
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
      },
      subSubLocations: [
        {
          id: 'ph-bohol-chocolate-hills',
          name: 'Chocolate Hills',
          alternateNames: ['Chocolate Hills District'],
          parentSubLocationId: 'ph-bohol',
          popularActivities: ['outdoors', 'cultural'],
          coordinates: {
            latitude: 9.8349,
            longitude: 124.1433
          }
        },
        {
          id: 'ph-bohol-tarsier-sanctuary',
          name: 'Tarsier Sanctuary',
          alternateNames: ['Tarsier Sanctuary District'],
          parentSubLocationId: 'ph-bohol',
          popularActivities: ['outdoors', 'cultural'],
          coordinates: {
            latitude: 9.8349,
            longitude: 124.1433
          }
        },
        {
          id: 'ph-bohol-loboc-river',
          name: 'Loboc River',
          alternateNames: ['Loboc River District'],
          parentSubLocationId: 'ph-bohol',
          popularActivities: ['aquatics', 'cultural'],
          coordinates: {
            latitude: 9.8349,
            longitude: 124.1433
          }
        }
      ]
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
      },
      subSubLocations: [
        {
          id: 'ph-la-union-surfing',
          name: 'Surfing',
          alternateNames: ['Surfing District'],
          parentSubLocationId: 'ph-la-union',
          popularActivities: ['aquatics', 'outdoors', 'wellness'],
          coordinates: {
            latitude: 16.6159,
            longitude: 120.3209
          }
        },
        {
          id: 'ph-la-union-halo-halo',
          name: 'Halo-halo',
          alternateNames: ['Halo-halo District'],
          parentSubLocationId: 'ph-la-union',
          popularActivities: ['food', 'cultural'],
          coordinates: {
            latitude: 16.6159,
            longitude: 120.3209
          }
        },
        {
          id: 'ph-la-union-grape-picking',
          name: 'Grape Picking',
          alternateNames: ['Grape Picking District'],
          parentSubLocationId: 'ph-la-union',
          popularActivities: ['food', 'cultural'],
          coordinates: {
            latitude: 16.6159,
            longitude: 120.3209
          }
        }
      ]
    },
    {
      id: 'ph-batangas',
      name: 'Batangas',
      alternateNames: ['Batangas Province', 'Btg'],
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
      },
      subSubLocations: [
        {
          id: 'ph-batangas-anilao',
          name: 'Anilao',
          alternateNames: ['Anilao Beach', 'Diving Capital'],
          parentSubLocationId: 'ph-batangas',
          popularActivities: ['aquatics', 'outdoors'],
          coordinates: {
            latitude: 13.7143,
            longitude: 120.9203
          }
        },
        {
          id: 'ph-batangas-nasugbu',
          name: 'Nasugbu',
          alternateNames: ['Nasugbu Beach'],
          parentSubLocationId: 'ph-batangas',
          popularActivities: ['aquatics', 'wellness'],
          coordinates: {
            latitude: 14.0722,
            longitude: 120.6320
          }
        },
        {
          id: 'ph-batangas-lipa',
          name: 'Lipa',
          alternateNames: ['Lipa City'],
          parentSubLocationId: 'ph-batangas',
          popularActivities: ['food', 'cultural', 'city'],
          coordinates: {
            latitude: 13.9414,
            longitude: 121.1647
          }
        }
      ]
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
      },
      subSubLocations: [
        {
          id: 'ph-ilocos-vigan-heritage-village',
          name: 'Vigan Heritage Village',
          alternateNames: ['Vigan District'],
          parentSubLocationId: 'ph-ilocos',
          popularActivities: ['heritage', 'cultural'],
          coordinates: {
            latitude: 17.5895,
            longitude: 120.4501
          }
        },
        {
          id: 'ph-ilocos-bangui-windmills',
          name: 'Bangui Windmills',
          alternateNames: ['Bangui District'],
          parentSubLocationId: 'ph-ilocos',
          popularActivities: ['heritage', 'cultural'],
          coordinates: {
            latitude: 17.5895,
            longitude: 120.4501
          }
        },
        {
          id: 'ph-ilocos-empanada',
          name: 'Empanada',
          alternateNames: ['Empanada District'],
          parentSubLocationId: 'ph-ilocos',
          popularActivities: ['food', 'cultural'],
          coordinates: {
            latitude: 17.5895,
            longitude: 120.4501
          }
        }
      ]
    },
    {
      id: 'ph-zambales',
      name: 'Zambales',
      alternateNames: ['Zambales Province', 'Subic','Zamba', 'Iba'],
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
      },
      subSubLocations: [
        {
          id: 'ph-zambales-anawangin-cove',
          name: 'Anawangin Cove',
          alternateNames: ['Anawangin Cove District'],
          parentSubLocationId: 'ph-zambales',
          popularActivities: ['aquatics', 'outdoors', 'wellness'],
          coordinates: {
            latitude: 15.0794,
            longitude: 119.9647
          }
        },
        {
          id: 'ph-zambales-capones-island',
          name: 'Capones Island',
          alternateNames: ['Capones Island District'],
          parentSubLocationId: 'ph-zambales',
          popularActivities: ['outdoors', 'heritage'],
          coordinates: {
            latitude: 15.0794,
            longitude: 119.9647
          }
        },
        {
          id: 'ph-zambales-subic-bay',
          name: 'Subic Bay',
          alternateNames: ['Subic Bay District'],
          parentSubLocationId: 'ph-zambales',
          popularActivities: ['outdoors', 'heritage'],
          coordinates: {
            latitude: 15.0794,
            longitude: 119.9647
          }
        }
      ]
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
      },
      subSubLocations: [
        {
          id: 'ph-davao-mount-apo',
          name: 'Mount Apo',
          alternateNames: ['Mount Apo District'],
          parentSubLocationId: 'ph-davao',
          popularActivities: ['outdoors', 'heritage'],
          coordinates: {
            latitude: 7.1907,
            longitude: 125.4553
          }
        },
        {
          id: 'ph-davao-durian',
          name: 'Durian',
          alternateNames: ['Durian District'],
          parentSubLocationId: 'ph-davao',
          popularActivities: ['food', 'cultural'],
          coordinates: {
            latitude: 7.1907,
            longitude: 125.4553
          }
        },
        {
          id: 'ph-davao-philippine-eagle-center',
          name: 'Philippine Eagle Center',
          alternateNames: ['Philippine Eagle Center District'],
          parentSubLocationId: 'ph-davao',
          popularActivities: ['cultural', 'outdoors'],
          coordinates: {
            latitude: 7.1907,
            longitude: 125.4553
          }
        }
      ]
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
      },
      subSubLocations: [
        {
          id: 'ph-baguio-session-road',
          name: 'Session Road',
          alternateNames: ['Session Road District'],
          parentSubLocationId: 'ph-baguio',
          popularActivities: ['outdoors', 'cultural'],
          coordinates: {
            latitude: 16.4023,
            longitude: 120.5960
          }
        },
        {
          id: 'ph-baguio-burnham-park',
          name: 'Burnham Park',
          alternateNames: ['Burnham Park District'],
          parentSubLocationId: 'ph-baguio',
          popularActivities: ['outdoors', 'cultural'],
          coordinates: {
            latitude: 16.4023,
            longitude: 120.5960
          }
        },
        {
          id: 'ph-baguio-strawberry-picking',
          name: 'Strawberry Picking',
          alternateNames: ['Strawberry Picking District'],
          parentSubLocationId: 'ph-baguio',
          popularActivities: ['food', 'cultural'],
          coordinates: {
            latitude: 16.4023,
            longitude: 120.5960
          }
        }
      ]
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
    },
    {
      id: 'us-los-angeles',
      name: 'Los Angeles',
      alternateNames: ['LA', 'LAX', 'City of Angels', 'Hollywood'],
      parentId: 'us',
      popularActivities: ['city', 'cultural', 'amusements'],
      description: 'Entertainment capital with beaches, Hollywood, and perfect weather.',
      bestTimeToVisit: 'March to May, September to November',
      knownFor: ['Hollywood', 'Beverly Hills', 'Santa Monica', 'Universal Studios'],
      averageStay: '4-5 days',
      difficulty: 'easy',
      crowdLevel: 'high',
      budgetLevel: 'luxury',
      coordinates: {
        latitude: 34.0522,
        longitude: -118.2437
      }
    },
    {
      id: 'us-las-vegas',
      name: 'Las Vegas',
      alternateNames: ['Vegas', 'Sin City', 'Entertainment Capital'],
      parentId: 'us',
      popularActivities: ['amusements', 'city', 'special'],
      description: 'Desert oasis known for casinos, shows, and vibrant nightlife.',
      bestTimeToVisit: 'March to May, September to November',
      knownFor: ['The Strip', 'Casinos', 'Shows', 'Grand Canyon nearby'],
      averageStay: '3-4 days',
      difficulty: 'easy',
      crowdLevel: 'high',
      budgetLevel: 'mid-range',
      coordinates: {
        latitude: 36.1699,
        longitude: -115.1398
      }
    },
    {
      id: 'us-miami',
      name: 'Miami',
      alternateNames: ['Magic City', 'South Beach'],
      parentId: 'us',
      popularActivities: ['aquatics', 'city', 'cultural'],
      description: 'Tropical paradise with art deco architecture and vibrant culture.',
      bestTimeToVisit: 'December to April',
      knownFor: ['South Beach', 'Art Deco District', 'Little Havana', 'Nightlife'],
      averageStay: '3-4 days',
      difficulty: 'easy',
      crowdLevel: 'high',
      budgetLevel: 'luxury',
      coordinates: {
        latitude: 25.7617,
        longitude: -80.1918
      }
    },
    {
      id: 'us-san-francisco',
      name: 'San Francisco',
      alternateNames: ['SF', 'SFO', 'The City', 'Fog City'],
      parentId: 'us',
      popularActivities: ['city', 'cultural', 'heritage'],
      description: 'Hilly city famous for Golden Gate Bridge and tech innovation.',
      bestTimeToVisit: 'September to November',
      knownFor: ['Golden Gate Bridge', 'Alcatraz', 'Cable Cars', 'Fishermans Wharf'],
      averageStay: '3-4 days',
      difficulty: 'moderate',
      crowdLevel: 'high',
      budgetLevel: 'luxury',
      coordinates: {
        latitude: 37.7749,
        longitude: -122.4194
      }
    },
    {
      id: 'us-chicago',
      name: 'Chicago',
      alternateNames: ['Chi-town', 'Windy City', 'Second City'],
      parentId: 'us',
      popularActivities: ['city', 'cultural', 'food'],
      description: 'Architectural marvel with deep-dish pizza and jazz heritage.',
      bestTimeToVisit: 'April to October',
      knownFor: ['Architecture', 'Deep Dish Pizza', 'Millennium Park', 'Navy Pier'],
      averageStay: '3-4 days',
      difficulty: 'easy',
      crowdLevel: 'moderate',
      budgetLevel: 'mid-range',
      coordinates: {
        latitude: 41.8781,
        longitude: -87.6298
      }
    },
    {
      id: 'us-washington-dc',
      name: 'Washington DC',
      alternateNames: ['DC', 'The Capital', 'District of Columbia'],
      parentId: 'us',
      popularActivities: ['heritage', 'cultural', 'city'],
      description: 'Nations capital with iconic monuments and world-class museums.',
      bestTimeToVisit: 'March to May, September to November',
      knownFor: ['White House', 'Capitol Building', 'Smithsonian', 'Lincoln Memorial'],
      averageStay: '2-3 days',
      difficulty: 'easy',
      crowdLevel: 'moderate',
      budgetLevel: 'mid-range',
      coordinates: {
        latitude: 38.9072,
        longitude: -77.0369
      }
    },
    {
      id: 'us-boston',
      name: 'Boston',
      alternateNames: ['Beantown', 'The Hub', 'Athens of America'],
      parentId: 'us',
      popularActivities: ['heritage', 'cultural', 'city'],
      description: 'Historic city with colonial charm and prestigious universities.',
      bestTimeToVisit: 'April to October',
      knownFor: ['Freedom Trail', 'Harvard', 'Boston Tea Party', 'Fenway Park'],
      averageStay: '2-3 days',
      difficulty: 'easy',
      crowdLevel: 'moderate',
      budgetLevel: 'mid-range',
      coordinates: {
        latitude: 42.3601,
        longitude: -71.0589
      }
    },
    {
      id: 'us-seattle',
      name: 'Seattle',
      alternateNames: ['Emerald City', 'Rain City', 'Coffee Capital'],
      parentId: 'us',
      popularActivities: ['city', 'cultural', 'food'],
      description: 'Pacific Northwest gem known for coffee culture and tech innovation.',
      bestTimeToVisit: 'June to September',
      knownFor: ['Space Needle', 'Pike Place Market', 'Coffee Culture', 'Mount Rainier'],
      averageStay: '2-3 days',
      difficulty: 'easy',
      crowdLevel: 'moderate',
      budgetLevel: 'mid-range',
      coordinates: {
        latitude: 47.6062,
        longitude: -122.3321
      }
    },
    {
      id: 'us-new-orleans',
      name: 'New Orleans',
      alternateNames: ['NOLA', 'The Big Easy', 'Crescent City'],
      parentId: 'us',
      popularActivities: ['cultural', 'food', 'heritage'],
      description: 'Vibrant city with unique culture, jazz music, and Creole cuisine.',
      bestTimeToVisit: 'February to May',
      knownFor: ['French Quarter', 'Jazz Music', 'Mardi Gras', 'Creole Cuisine'],
      averageStay: '2-3 days',
      difficulty: 'easy',
      crowdLevel: 'moderate',
      budgetLevel: 'mid-range',
      coordinates: {
        latitude: 29.9511,
        longitude: -90.0715
      }
    },
    {
      id: 'us-hawaii',
      name: 'Hawaii',
      alternateNames: ['Aloha State', 'Paradise', 'Hawaiian Islands'],
      parentId: 'us',
      popularActivities: ['aquatics', 'outdoors', 'wellness'],
      description: 'Tropical paradise with volcanic landscapes and pristine beaches.',
      bestTimeToVisit: 'April to June, September to November',
      knownFor: ['Waikiki Beach', 'Pearl Harbor', 'Volcanoes', 'Luau Culture'],
      averageStay: '5-7 days',
      difficulty: 'easy',
      crowdLevel: 'high',
      budgetLevel: 'luxury',
      coordinates: {
        latitude: 21.3099,
        longitude: -157.8581
      }
    },
    {
      id: 'us-orlando',
      name: 'Orlando',
      alternateNames: ['Theme Park Capital', 'O-Town'],
      parentId: 'us',
      popularActivities: ['amusements', 'city', 'special'],
      description: 'Family-friendly destination with world-famous theme parks.',
      bestTimeToVisit: 'March to May, September to November',
      knownFor: ['Disney World', 'Universal Studios', 'Theme Parks', 'Family Fun'],
      averageStay: '4-7 days',
      difficulty: 'easy',
      crowdLevel: 'high',
      budgetLevel: 'mid-range',
      coordinates: {
        latitude: 28.5383,
        longitude: -81.3792
      }
    },
    {
      id: 'us-nashville',
      name: 'Nashville',
      alternateNames: ['Music City', 'Athens of South'],
      parentId: 'us',
      popularActivities: ['cultural', 'heritage', 'city'],
      description: 'Country music capital with rich musical heritage.',
      bestTimeToVisit: 'April to October',
      knownFor: ['Country Music', 'Grand Ole Opry', 'Broadway Honky Tonks', 'Music Scene'],
      averageStay: '2-3 days',
      difficulty: 'easy',
      crowdLevel: 'moderate',
      budgetLevel: 'mid-range',
      coordinates: {
        latitude: 36.1627,
        longitude: -86.7816
      }
    },
    {
      id: 'us-austin',
      name: 'Austin',
      alternateNames: ['Live Music Capital', 'Weird City'],
      parentId: 'us',
      popularActivities: ['cultural', 'food', 'city'],
      description: 'Eclectic city known for live music, food trucks, and tech scene.',
      bestTimeToVisit: 'March to May, September to November',
      knownFor: ['SXSW', 'Live Music', 'Food Trucks', 'Keep Austin Weird'],
      averageStay: '2-3 days',
      difficulty: 'easy',
      crowdLevel: 'moderate',
      budgetLevel: 'mid-range',
      coordinates: {
        latitude: 30.2672,
        longitude: -97.7431
      }
    },
    {
      id: 'us-denver',
      name: 'Denver',
      alternateNames: ['Mile High City', 'Queen City of Plains'],
      parentId: 'us',
      popularActivities: ['outdoors', 'city', 'cultural'],
      description: 'Gateway to Rocky Mountains with outdoor adventures and craft beer.',
      bestTimeToVisit: 'April to October',
      knownFor: ['Rocky Mountains', 'Craft Beer', 'Outdoor Activities', 'Red Rocks'],
      averageStay: '2-3 days',
      difficulty: 'easy',
      crowdLevel: 'moderate',
      budgetLevel: 'mid-range',
      coordinates: {
        latitude: 39.7392,
        longitude: -104.9903
      }
    },
    {
      id: 'us-portland',
      name: 'Portland',
      alternateNames: ['PDX', 'City of Roses', 'Portlandia'],
      parentId: 'us',
      popularActivities: ['cultural', 'food', 'city'],
      description: 'Quirky city known for food scene, craft beer, and eco-consciousness.',
      bestTimeToVisit: 'June to September',
      knownFor: ['Food Trucks', 'Craft Beer', 'Powell\'s Books', 'Keep Portland Weird'],
      averageStay: '2-3 days',
      difficulty: 'easy',
      crowdLevel: 'moderate',
      budgetLevel: 'mid-range',
      coordinates: {
        latitude: 45.5152,
        longitude: -122.6784
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
  countries: [
    philippinesData,
    // Singapore
    {
      id: 'sg',
      name: 'Singapore',
      alternateNames: ['SG', 'Lion City', 'Garden City'],
      continentId: 'asia',
      currency: 'SGD',
      language: ['English', 'Mandarin', 'Malay', 'Tamil'],
      timezone: 'GMT+8',
      description: 'Modern city-state known for its cleanliness, food, and efficiency.',
      coordinates: { latitude: 1.3521, longitude: 103.8198 },
      subLocations: [
        {
          id: 'sg-singapore',
          name: 'Singapore City',
          alternateNames: ['Downtown', 'CBD', 'Marina Bay'],
          parentId: 'sg',
          popularActivities: ['city', 'food', 'cultural', 'amusements'],
          description: 'Futuristic city with amazing food and attractions.',
          bestTimeToVisit: 'February to April',
          knownFor: ['Marina Bay Sands', 'Gardens by the Bay', 'Hawker Centers', 'Sentosa'],
          averageStay: '3-4 days',
          difficulty: 'easy',
          crowdLevel: 'high',
          budgetLevel: 'luxury',
          coordinates: { latitude: 1.3521, longitude: 103.8198 }
        }
      ]
    },
    // Thailand
    {
      id: 'th',
      name: 'Thailand',
      alternateNames: ['TH', 'Land of Smiles', 'Siam'],
      continentId: 'asia',
      currency: 'THB',
      language: ['Thai'],
      timezone: 'GMT+7',
      description: 'Land of smiles with beautiful temples, beaches, and street food.',
      coordinates: { latitude: 15.8700, longitude: 100.9925 },
      subLocations: [
        {
          id: 'th-bangkok',
          name: 'Bangkok',
          alternateNames: ['BKK', 'Krung Thep', 'City of Angels'],
          parentId: 'th',
          popularActivities: ['city', 'cultural', 'food', 'heritage'],
          description: 'Vibrant capital with temples, markets, and street food.',
          bestTimeToVisit: 'November to March',
          knownFor: ['Grand Palace', 'Wat Pho', 'Floating Markets', 'Street Food'],
          averageStay: '3-4 days',
          difficulty: 'easy',
          crowdLevel: 'high',
          budgetLevel: 'budget',
          coordinates: { latitude: 13.7563, longitude: 100.5018 }
        },
        {
          id: 'th-phuket',
          name: 'Phuket',
          alternateNames: ['Pearl of Andaman', 'Phuket Island'],
          parentId: 'th',
          popularActivities: ['aquatics', 'wellness', 'amusements'],
          description: 'Thailand\'s largest island with beautiful beaches.',
          bestTimeToVisit: 'November to April',
          knownFor: ['Patong Beach', 'Phi Phi Islands', 'Big Buddha', 'Nightlife'],
          averageStay: '4-5 days',
          difficulty: 'easy',
          crowdLevel: 'high',
          budgetLevel: 'mid-range',
          coordinates: { latitude: 7.8804, longitude: 98.3923 }
        }
      ]
    },
    // Japan
    {
      id: 'jp',
      name: 'Japan',
      alternateNames: ['JP', 'Nippon', 'Land of Rising Sun'],
      continentId: 'asia',
      currency: 'JPY',
      language: ['Japanese'],
      timezone: 'GMT+9',
      description: 'Land of ancient traditions and modern innovation.',
      coordinates: { latitude: 36.2048, longitude: 138.2529 },
      subLocations: [
        {
          id: 'jp-tokyo',
          name: 'Tokyo',
          alternateNames: ['Capital', 'Edo', 'Greater Tokyo'],
          parentId: 'jp',
          popularActivities: ['city', 'cultural', 'food', 'amusements'],
          description: 'Ultra-modern capital with traditional touches.',
          bestTimeToVisit: 'March to May, September to November',
          knownFor: ['Shibuya Crossing', 'Tokyo Tower', 'Sushi', 'Anime Culture'],
          averageStay: '4-6 days',
          difficulty: 'moderate',
          crowdLevel: 'high',
          budgetLevel: 'luxury',
          coordinates: { latitude: 35.6762, longitude: 139.6503 }
        },
        {
          id: 'jp-osaka',
          name: 'Osaka',
          alternateNames: ['Kitchen of Japan', 'Osaka-fu'],
          parentId: 'jp',
          popularActivities: ['food', 'cultural', 'amusements'],
          description: 'Food capital of Japan with friendly locals.',
          bestTimeToVisit: 'March to May, September to November',
          knownFor: ['Takoyaki', 'Osaka Castle', 'Universal Studios', 'Street Food'],
          averageStay: '2-3 days',
          difficulty: 'moderate',
          crowdLevel: 'high',
          budgetLevel: 'mid-range',
          coordinates: { latitude: 34.6937, longitude: 135.5023 }
        },
        {
          id: 'jp-kyoto',
          name: 'Kyoto',
          alternateNames: ['Ancient Capital', 'City of Temples'],
          parentId: 'jp',
          popularActivities: ['heritage', 'cultural', 'wellness'],
          description: 'Former imperial capital with thousands of temples.',
          bestTimeToVisit: 'March to May, September to November',
          knownFor: ['Fushimi Inari', 'Bamboo Grove', 'Geishas', 'Traditional Gardens'],
          averageStay: '2-3 days',
          difficulty: 'easy',
          crowdLevel: 'high',
          budgetLevel: 'mid-range',
          coordinates: { latitude: 35.0116, longitude: 135.7681 }
        },
        {
          id: 'jp-hiroshima',
          name: 'Hiroshima',
          alternateNames: ['Peace City'],
          parentId: 'jp',
          popularActivities: ['heritage', 'cultural'],
          description: 'Historic city with powerful peace memorial.',
          bestTimeToVisit: 'March to May, September to November',
          knownFor: ['Peace Memorial', 'Atomic Bomb Dome', 'Miyajima Island'],
          averageStay: '1-2 days',
          difficulty: 'easy',
          crowdLevel: 'moderate',
          budgetLevel: 'mid-range',
          coordinates: { latitude: 34.3853, longitude: 132.4553 }
        },
        {
          id: 'jp-nara',
          name: 'Nara',
          alternateNames: ['Deer Park City'],
          parentId: 'jp',
          popularActivities: ['heritage', 'cultural', 'outdoors'],
          description: 'Ancient capital famous for free-roaming deer.',
          bestTimeToVisit: 'March to May, September to November',
          knownFor: ['Todaiji Temple', 'Nara Deer Park', 'Kasuga Taisha'],
          averageStay: '1 day',
          difficulty: 'easy',
          crowdLevel: 'moderate',
          budgetLevel: 'budget',
          coordinates: { latitude: 34.6851, longitude: 135.8048 }
        },
        {
          id: 'jp-hakone',
          name: 'Hakone',
          alternateNames: ['Mount Fuji Gateway'],
          parentId: 'jp',
          popularActivities: ['wellness', 'outdoors', 'cultural'],
          description: 'Mountain resort town with hot springs and Mount Fuji views.',
          bestTimeToVisit: 'March to May, September to November',
          knownFor: ['Hot Springs', 'Mount Fuji Views', 'Lake Ashi', 'Ryokan'],
          averageStay: '1-2 days',
          difficulty: 'easy',
          crowdLevel: 'moderate',
          budgetLevel: 'luxury',
          coordinates: { latitude: 35.2324, longitude: 139.1069 }
        },
        {
          id: 'jp-nikko',
          name: 'Nikko',
          alternateNames: ['UNESCO World Heritage'],
          parentId: 'jp',
          popularActivities: ['heritage', 'cultural', 'outdoors'],
          description: 'Sacred city with ornate shrines and natural beauty.',
          bestTimeToVisit: 'April to November',
          knownFor: ['Toshogu Shrine', 'Lake Chuzenji', 'Kegon Falls'],
          averageStay: '1-2 days',
          difficulty: 'easy',
          crowdLevel: 'moderate',
          budgetLevel: 'mid-range',
          coordinates: { latitude: 36.7581, longitude: 139.6040 }
        },
        {
          id: 'jp-kanazawa',
          name: 'Kanazawa',
          alternateNames: ['Gold Leaf City'],
          parentId: 'jp',
          popularActivities: ['cultural', 'heritage', 'food'],
          description: 'Historic city known for gold leaf and beautiful gardens.',
          bestTimeToVisit: 'March to May, September to November',
          knownFor: ['Kenrokuen Garden', 'Gold Leaf', 'Geisha Districts', 'Fresh Seafood'],
          averageStay: '1-2 days',
          difficulty: 'easy',
          crowdLevel: 'low',
          budgetLevel: 'mid-range',
          coordinates: { latitude: 36.5944, longitude: 136.6256 }
        },
        {
          id: 'jp-takayama',
          name: 'Takayama',
          alternateNames: ['Little Kyoto of Hida'],
          parentId: 'jp',
          popularActivities: ['heritage', 'cultural', 'food'],
          description: 'Historic mountain town with preserved Edo-period streets.',
          bestTimeToVisit: 'April to November',
          knownFor: ['Historic Streets', 'Sake Breweries', 'Hida Beef', 'Morning Markets'],
          averageStay: '1-2 days',
          difficulty: 'easy',
          crowdLevel: 'moderate',
          budgetLevel: 'mid-range',
          coordinates: { latitude: 36.1397, longitude: 137.2530 }
        },
        {
          id: 'jp-shirakawa-go',
          name: 'Shirakawa-go',
          alternateNames: ['Gassho-zukuri Village'],
          parentId: 'jp',
          popularActivities: ['heritage', 'cultural', 'outdoors'],
          description: 'UNESCO World Heritage village with traditional thatched houses.',
          bestTimeToVisit: 'April to November',
          knownFor: ['Gassho-zukuri Houses', 'Traditional Village', 'Mountain Views'],
          averageStay: '1 day',
          difficulty: 'easy',
          crowdLevel: 'moderate',
          budgetLevel: 'mid-range',
          coordinates: { latitude: 36.2576, longitude: 136.9062 }
        },
        {
          id: 'jp-mount-fuji',
          name: 'Mount Fuji',
          alternateNames: ['Fuji-san', 'Sacred Mountain'],
          parentId: 'jp',
          popularActivities: ['outdoors', 'heritage', 'wellness'],
          description: 'Japan\'s highest mountain and spiritual symbol.',
          bestTimeToVisit: 'July to September (climbing season)',
          knownFor: ['Mountain Climbing', 'Five Lakes', 'Sunrise Views', 'Spiritual Significance'],
          averageStay: '1-2 days',
          difficulty: 'challenging',
          crowdLevel: 'high',
          budgetLevel: 'mid-range',
          coordinates: { latitude: 35.3606, longitude: 138.7274 }
        },
        {
          id: 'jp-okinawa',
          name: 'Okinawa',
          alternateNames: ['Tropical Paradise', 'Ryukyu Islands'],
          parentId: 'jp',
          popularActivities: ['aquatics', 'wellness', 'cultural'],
          description: 'Tropical island chain with unique culture and pristine beaches.',
          bestTimeToVisit: 'April to June, October to December',
          knownFor: ['Pristine Beaches', 'Diving', 'Unique Culture', 'Longevity'],
          averageStay: '4-5 days',
          difficulty: 'easy',
          crowdLevel: 'moderate',
          budgetLevel: 'mid-range',
          coordinates: { latitude: 26.2124, longitude: 127.6792 }
        },
        {
          id: 'jp-yokohama',
          name: 'Yokohama',
          alternateNames: ['Port City'],
          parentId: 'jp',
          popularActivities: ['city', 'cultural', 'food'],
          description: 'Modern port city near Tokyo with international flair.',
          bestTimeToVisit: 'March to May, September to November',
          knownFor: ['Chinatown', 'Red Brick Warehouse', 'Ramen Museum', 'Cosmo World'],
          averageStay: '1-2 days',
          difficulty: 'easy',
          crowdLevel: 'moderate',
          budgetLevel: 'mid-range',
          coordinates: { latitude: 35.4437, longitude: 139.6380 }
        },
        {
          id: 'jp-kamakura',
          name: 'Kamakura',
          alternateNames: ['Ancient Capital', 'Great Buddha City'],
          parentId: 'jp',
          popularActivities: ['heritage', 'cultural', 'outdoors'],
          description: 'Historic coastal city with the famous Great Buddha.',
          bestTimeToVisit: 'March to May, September to November',
          knownFor: ['Great Buddha', 'Bamboo Forest', 'Historic Temples', 'Beach'],
          averageStay: '1 day',
          difficulty: 'easy',
          crowdLevel: 'moderate',
          budgetLevel: 'budget',
          coordinates: { latitude: 35.3193, longitude: 139.5519 }
        },
        {
          id: 'jp-nagoya',
          name: 'Nagoya',
          alternateNames: ['Castle City'],
          parentId: 'jp',
          popularActivities: ['city', 'cultural', 'food'],
          description: 'Industrial city with historic castle and unique local cuisine.',
          bestTimeToVisit: 'March to May, September to November',
          knownFor: ['Nagoya Castle', 'Atsuta Shrine', 'Miso Katsu', 'Toyota Museum'],
          averageStay: '1-2 days',
          difficulty: 'easy',
          crowdLevel: 'low',
          budgetLevel: 'mid-range',
          coordinates: { latitude: 35.1815, longitude: 136.9066 }
        },
        {
          id: 'jp-sendai',
          name: 'Sendai',
          alternateNames: ['City of Trees'],
          parentId: 'jp',
          popularActivities: ['city', 'cultural', 'food'],
          description: 'Northern city known for beef tongue and natural beauty.',
          bestTimeToVisit: 'March to May, September to November',
          knownFor: ['Beef Tongue', 'Tanabata Festival', 'Zuihoden Mausoleum'],
          averageStay: '1-2 days',
          difficulty: 'easy',
          crowdLevel: 'low',
          budgetLevel: 'mid-range',
          coordinates: { latitude: 38.2682, longitude: 140.8694 }
        }
      ]
    },
    // South Korea
    {
      id: 'kr',
      name: 'South Korea',
      alternateNames: ['KR', 'Korea', 'Republic of Korea'],
      continentId: 'asia',
      currency: 'KRW',
      language: ['Korean'],
      timezone: 'GMT+9',
      description: 'Land of K-pop, kimchi, and technological innovation.',
      coordinates: { latitude: 35.9078, longitude: 127.7669 },
      subLocations: [
        {
          id: 'kr-seoul',
          name: 'Seoul',
          alternateNames: ['Capital', 'Hanyang', 'Seoul Special City'],
          parentId: 'kr',
          popularActivities: ['city', 'cultural', 'food', 'amusements'],
          description: 'Dynamic capital of K-pop and Korean culture.',
          bestTimeToVisit: 'April to June, September to November',
          knownFor: ['Gangnam', 'Myeongdong', 'Korean BBQ', 'K-pop Culture'],
          averageStay: '4-5 days',
          difficulty: 'moderate',
          crowdLevel: 'high',
          budgetLevel: 'mid-range',
          coordinates: { latitude: 37.5665, longitude: 126.9780 }
        },
        {
          id: 'kr-busan',
          name: 'Busan',
          alternateNames: ['Coastal City', 'Summer Capital'],
          parentId: 'kr',
          popularActivities: ['aquatics', 'cultural', 'food'],
          description: 'Coastal city with beautiful beaches and fresh seafood.',
          bestTimeToVisit: 'May to October',
          knownFor: ['Haeundae Beach', 'Gamcheon Village', 'Fresh Seafood', 'Film Festival'],
          averageStay: '2-3 days',
          difficulty: 'easy',
          crowdLevel: 'moderate',
          budgetLevel: 'budget',
          coordinates: { latitude: 35.1796, longitude: 129.0756 }
        },
        {
          id: 'kr-jeju',
          name: 'Jeju Island',
          alternateNames: ['Jeju-do', 'Honeymoon Island'],
          parentId: 'kr',
          popularActivities: ['outdoors', 'wellness', 'aquatics'],
          description: 'Volcanic island paradise with beautiful nature.',
          bestTimeToVisit: 'April to June, September to November',
          knownFor: ['Hallasan Mountain', 'Seongsan Sunrise Peak', 'Beaches', 'Tangerines'],
          averageStay: '2-3 days',
          difficulty: 'easy',
          crowdLevel: 'moderate',
          budgetLevel: 'mid-range',
          coordinates: { latitude: 33.4996, longitude: 126.5312 }
        },
        {
          id: 'kr-gyeongju',
          name: 'Gyeongju',
          alternateNames: ['Ancient Capital', 'Museum Without Walls'],
          parentId: 'kr',
          popularActivities: ['heritage', 'cultural'],
          description: 'Ancient capital with UNESCO World Heritage sites.',
          bestTimeToVisit: 'April to June, September to November',
          knownFor: ['Bulguksa Temple', 'Seokguram Grotto', 'Tumuli Park', 'Traditional Architecture'],
          averageStay: '1-2 days',
          difficulty: 'easy',
          crowdLevel: 'moderate',
          budgetLevel: 'budget',
          coordinates: { latitude: 35.8562, longitude: 129.2247 }
        },
        {
          id: 'kr-incheon',
          name: 'Incheon',
          alternateNames: ['Gateway City', 'Port City'],
          parentId: 'kr',
          popularActivities: ['city', 'cultural', 'heritage'],
          description: 'Historic port city with international airport.',
          bestTimeToVisit: 'April to June, September to November',
          knownFor: ['Chinatown', 'Songdo', 'Incheon Bridge', 'Modern Architecture'],
          averageStay: '1-2 days',
          difficulty: 'easy',
          crowdLevel: 'low',
          budgetLevel: 'mid-range',
          coordinates: { latitude: 37.4563, longitude: 126.7052 }
        },
        {
          id: 'kr-daegu',
          name: 'Daegu',
          alternateNames: ['Textile City'],
          parentId: 'kr',
          popularActivities: ['city', 'cultural', 'food'],
          description: 'Traditional city known for textiles and local culture.',
          bestTimeToVisit: 'April to June, September to November',
          knownFor: ['Seomun Market', 'Apsan Park', 'Traditional Medicine', 'Local Cuisine'],
          averageStay: '1-2 days',
          difficulty: 'easy',
          crowdLevel: 'low',
          budgetLevel: 'budget',
          coordinates: { latitude: 35.8714, longitude: 128.6014 }
        },
        {
          id: 'kr-jeonju',
          name: 'Jeonju',
          alternateNames: ['Hanok Village', 'Food Capital'],
          parentId: 'kr',
          popularActivities: ['heritage', 'cultural', 'food'],
          description: 'Traditional city famous for hanok village and bibimbap.',
          bestTimeToVisit: 'April to June, September to November',
          knownFor: ['Hanok Village', 'Bibimbap', 'Traditional Architecture', 'Korean Paper'],
          averageStay: '1-2 days',
          difficulty: 'easy',
          crowdLevel: 'moderate',
          budgetLevel: 'budget',
          coordinates: { latitude: 35.8242, longitude: 127.1480 }
        },
        {
          id: 'kr-sokcho',
          name: 'Sokcho',
          alternateNames: ['Gateway to Seoraksan'],
          parentId: 'kr',
          popularActivities: ['outdoors', 'aquatics', 'food'],
          description: 'Coastal city near Seoraksan National Park.',
          bestTimeToVisit: 'April to October',
          knownFor: ['Seoraksan National Park', 'Fresh Seafood', 'Beach', 'Hiking'],
          averageStay: '2-3 days',
          difficulty: 'moderate',
          crowdLevel: 'moderate',
          budgetLevel: 'budget',
          coordinates: { latitude: 38.2070, longitude: 128.5918 }
        },
        {
          id: 'kr-andong',
          name: 'Andong',
          alternateNames: ['Traditional Culture City'],
          parentId: 'kr',
          popularActivities: ['heritage', 'cultural'],
          description: 'Historic city preserving traditional Korean culture.',
          bestTimeToVisit: 'April to June, September to November',
          knownFor: ['Hahoe Folk Village', 'Mask Dance', 'Traditional Culture', 'Confucian Academy'],
          averageStay: '1-2 days',
          difficulty: 'easy',
          crowdLevel: 'low',
          budgetLevel: 'budget',
          coordinates: { latitude: 36.5684, longitude: 128.7294 }
        },
        {
          id: 'kr-gangneung',
          name: 'Gangneung',
          alternateNames: ['Coffee City', 'Olympic City'],
          parentId: 'kr',
          popularActivities: ['aquatics', 'cultural', 'food'],
          description: 'Coastal city famous for coffee culture and beaches.',
          bestTimeToVisit: 'May to October',
          knownFor: ['Coffee Street', 'Beaches', 'Olympic Venues', 'Pine Forests'],
          averageStay: '1-2 days',
          difficulty: 'easy',
          crowdLevel: 'moderate',
          budgetLevel: 'budget',
          coordinates: { latitude: 37.7519, longitude: 128.8761 }
        },
        {
          id: 'kr-yeosu',
          name: 'Yeosu',
          alternateNames: ['Beautiful Water City'],
          parentId: 'kr',
          popularActivities: ['aquatics', 'cultural', 'food'],
          description: 'Scenic coastal city with beautiful islands.',
          bestTimeToVisit: 'April to October',
          knownFor: ['Yeosu Expo', 'Beautiful Islands', 'Seafood', 'Cable Car'],
          averageStay: '1-2 days',
          difficulty: 'easy',
          crowdLevel: 'moderate',
          budgetLevel: 'budget',
          coordinates: { latitude: 34.7604, longitude: 127.6622 }
        },
        {
          id: 'kr-suwon',
          name: 'Suwon',
          alternateNames: ['Fortress City'],
          parentId: 'kr',
          popularActivities: ['heritage', 'cultural'],
          description: 'Historic city with UNESCO World Heritage fortress.',
          bestTimeToVisit: 'April to June, September to November',
          knownFor: ['Hwaseong Fortress', 'Korean Folk Village', 'Traditional Architecture'],
          averageStay: '1 day',
          difficulty: 'easy',
          crowdLevel: 'moderate',
          budgetLevel: 'budget',
          coordinates: { latitude: 37.2636, longitude: 127.0286 }
        },
        {
          id: 'kr-chuncheon',
          name: 'Chuncheon',
          alternateNames: ['Lake City', 'Dakgalbi City'],
          parentId: 'kr',
          popularActivities: ['outdoors', 'food', 'cultural'],
          description: 'Lakeside city famous for dakgalbi (spicy chicken).',
          bestTimeToVisit: 'April to October',
          knownFor: ['Dakgalbi', 'Lake Activities', 'Nami Island nearby', 'Natural Beauty'],
          averageStay: '1-2 days',
          difficulty: 'easy',
          crowdLevel: 'moderate',
          budgetLevel: 'budget',
          coordinates: { latitude: 37.8813, longitude: 127.7298 }
        },
        {
          id: 'kr-gwangju',
          name: 'Gwangju',
          alternateNames: ['City of Light', 'Culture City'],
          parentId: 'kr',
          popularActivities: ['cultural', 'heritage', 'food'],
          description: 'Cultural city known for art and democratic movements.',
          bestTimeToVisit: 'April to June, September to November',
          knownFor: ['Art Museums', 'Democratic History', 'Traditional Markets', 'Cultural Events'],
          averageStay: '1-2 days',
          difficulty: 'easy',
          crowdLevel: 'low',
          budgetLevel: 'budget',
          coordinates: { latitude: 35.1595, longitude: 126.8526 }
        },
        {
          id: 'kr-pohang',
          name: 'Pohang',
          alternateNames: ['Steel City', 'Sunrise City'],
          parentId: 'kr',
          popularActivities: ['aquatics', 'cultural', 'heritage'],
          description: 'Industrial coastal city with beautiful sunrise views.',
          bestTimeToVisit: 'April to October',
          knownFor: ['Homigot Sunrise', 'Steel Industry', 'Beaches', 'Fresh Seafood'],
          averageStay: '1-2 days',
          difficulty: 'easy',
          crowdLevel: 'low',
          budgetLevel: 'budget',
          coordinates: { latitude: 36.0190, longitude: 129.3435 }
        }
      ]
    },
    // Indonesia
    {
      id: 'id',
      name: 'Indonesia',
      alternateNames: ['ID', 'Archipelago', 'Republic of Indonesia'],
      continentId: 'asia',
      currency: 'IDR',
      language: ['Indonesian'],
      timezone: 'GMT+7 to GMT+9',
      description: 'Largest archipelago with diverse cultures and stunning islands.',
      coordinates: { latitude: -0.7893, longitude: 113.9213 },
      subLocations: [
        {
          id: 'id-bali',
          name: 'Bali',
          alternateNames: ['Island of Gods', 'Bali Island'],
          parentId: 'id',
          popularActivities: ['aquatics', 'cultural', 'wellness', 'outdoors'],
          description: 'Hindu island paradise with temples and beaches.',
          bestTimeToVisit: 'April to September',
          knownFor: ['Ubud Rice Terraces', 'Tanah Lot Temple', 'Kuta Beach', 'Yoga Retreats'],
          averageStay: '5-7 days',
          difficulty: 'easy',
          crowdLevel: 'high',
          budgetLevel: 'mid-range',
          coordinates: { latitude: -8.3405, longitude: 115.0920 }
        },
        {
          id: 'id-jakarta',
          name: 'Jakarta',
          alternateNames: ['Capital', 'Big Durian'],
          parentId: 'id',
          popularActivities: ['city', 'cultural', 'food'],
          description: 'Bustling capital with modern skyscrapers and traditional markets.',
          bestTimeToVisit: 'May to September',
          knownFor: ['Monas Tower', 'Old Town Batavia', 'Street Food', 'Shopping Malls'],
          averageStay: '2-3 days',
          difficulty: 'moderate',
          crowdLevel: 'high',
          budgetLevel: 'budget',
          coordinates: { latitude: -6.2088, longitude: 106.8456 }
        },
        {
          id: 'id-yogyakarta',
          name: 'Yogyakarta',
          alternateNames: ['Jogja', 'Cultural Heart'],
          parentId: 'id',
          popularActivities: ['heritage', 'cultural', 'food'],
          description: 'Cultural center with ancient temples and royal heritage.',
          bestTimeToVisit: 'May to September',
          knownFor: ['Borobudur Temple', 'Prambanan', 'Sultan Palace', 'Batik Art'],
          averageStay: '2-3 days',
          difficulty: 'easy',
          crowdLevel: 'moderate',
          budgetLevel: 'budget',
          coordinates: { latitude: -7.7956, longitude: 110.3695 }
        },
        {
          id: 'id-lombok',
          name: 'Lombok',
          alternateNames: ['Next Bali', 'Island Paradise'],
          parentId: 'id',
          popularActivities: ['aquatics', 'outdoors', 'wellness'],
          description: 'Pristine island with stunning beaches and Mount Rinjani.',
          bestTimeToVisit: 'April to October',
          knownFor: ['Gili Islands', 'Mount Rinjani', 'Pink Beach', 'Surfing'],
          averageStay: '4-5 days',
          difficulty: 'moderate',
          crowdLevel: 'moderate',
          budgetLevel: 'budget',
          coordinates: { latitude: -8.6500, longitude: 116.3242 }
        },
        {
          id: 'id-komodo',
          name: 'Komodo National Park',
          alternateNames: ['Dragon Island', 'Komodo'],
          parentId: 'id',
          popularActivities: ['outdoors', 'aquatics', 'heritage'],
          description: 'Home to the famous Komodo dragons and pristine waters.',
          bestTimeToVisit: 'April to December',
          knownFor: ['Komodo Dragons', 'Pink Beach', 'Diving', 'Unique Wildlife'],
          averageStay: '3-4 days',
          difficulty: 'moderate',
          crowdLevel: 'moderate',
          budgetLevel: 'mid-range',
          coordinates: { latitude: -8.5500, longitude: 119.4883 }
        },
        {
          id: 'id-bandung',
          name: 'Bandung',
          alternateNames: ['Paris of Java', 'Flower City'],
          parentId: 'id',
          popularActivities: ['city', 'cultural', 'food', 'outdoors'],
          description: 'Cool highland city known for fashion and culinary scene.',
          bestTimeToVisit: 'March to September',
          knownFor: ['Factory Outlets', 'Tea Plantations', 'Art Deco Architecture', 'Street Food'],
          averageStay: '2-3 days',
          difficulty: 'easy',
          crowdLevel: 'moderate',
          budgetLevel: 'budget',
          coordinates: { latitude: -6.9175, longitude: 107.6191 }
        },
        {
          id: 'id-surabaya',
          name: 'Surabaya',
          alternateNames: ['City of Heroes', 'Shark City'],
          parentId: 'id',
          popularActivities: ['city', 'heritage', 'food'],
          description: 'Historic port city and gateway to East Java.',
          bestTimeToVisit: 'April to October',
          knownFor: ['Heroes Monument', 'House of Sampoerna', 'Traditional Markets', 'Local Cuisine'],
          averageStay: '1-2 days',
          difficulty: 'easy',
          crowdLevel: 'moderate',
          budgetLevel: 'budget',
          coordinates: { latitude: -7.2575, longitude: 112.7521 }
        },
        {
          id: 'id-malang',
          name: 'Malang',
          alternateNames: ['Apple City', 'Cool City'],
          parentId: 'id',
          popularActivities: ['city', 'cultural', 'outdoors'],
          description: 'Cool highland city with colonial architecture.',
          bestTimeToVisit: 'April to October',
          knownFor: ['Colonial Architecture', 'Apple Farms', 'Cool Climate', 'Coffee Culture'],
          averageStay: '1-2 days',
          difficulty: 'easy',
          crowdLevel: 'low',
          budgetLevel: 'budget',
          coordinates: { latitude: -7.9666, longitude: 112.6326 }
        },
        {
          id: 'id-solo',
          name: 'Solo (Surakarta)',
          alternateNames: ['Cultural City', 'Spirit of Java'],
          parentId: 'id',
          popularActivities: ['heritage', 'cultural', 'food'],
          description: 'Royal city preserving Javanese culture and traditions.',
          bestTimeToVisit: 'April to October',
          knownFor: ['Royal Palaces', 'Batik Art', 'Traditional Markets', 'Javanese Culture'],
          averageStay: '1-2 days',
          difficulty: 'easy',
          crowdLevel: 'low',
          budgetLevel: 'budget',
          coordinates: { latitude: -7.5755, longitude: 110.8243 }
        },
        {
          id: 'id-medan',
          name: 'Medan',
          alternateNames: ['Gateway to Sumatra'],
          parentId: 'id',
          popularActivities: ['city', 'cultural', 'food'],
          description: 'Largest city in Sumatra with diverse cultural influences.',
          bestTimeToVisit: 'June to September',
          knownFor: ['Maimun Palace', 'Great Mosque', 'Diverse Cuisine', 'Cultural Diversity'],
          averageStay: '1-2 days',
          difficulty: 'easy',
          crowdLevel: 'moderate',
          budgetLevel: 'budget',
          coordinates: { latitude: 3.5952, longitude: 98.6722 }
        },
        {
          id: 'id-toba',
          name: 'Lake Toba',
          alternateNames: ['Largest Volcanic Lake', 'Samosir Island'],
          parentId: 'id',
          popularActivities: ['outdoors', 'cultural', 'wellness'],
          description: 'Massive volcanic lake with Batak culture and traditions.',
          bestTimeToVisit: 'June to September',
          knownFor: ['Volcanic Lake', 'Batak Culture', 'Samosir Island', 'Traditional Villages'],
          averageStay: '2-3 days',
          difficulty: 'easy',
          crowdLevel: 'moderate',
          budgetLevel: 'budget',
          coordinates: { latitude: 2.6845, longitude: 98.8756 }
        },
        {
          id: 'id-bromo',
          name: 'Mount Bromo',
          alternateNames: ['Bromo Tengger Semeru', 'Volcanic Landscape'],
          parentId: 'id',
          popularActivities: ['outdoors', 'heritage'],
          description: 'Active volcano with stunning sunrise views and lunar landscape.',
          bestTimeToVisit: 'April to October',
          knownFor: ['Sunrise Views', 'Volcanic Landscape', 'Tengger People', 'Jeep Tours'],
          averageStay: '1-2 days',
          difficulty: 'moderate',
          crowdLevel: 'high',
          budgetLevel: 'budget',
          coordinates: { latitude: -7.9425, longitude: 112.9530 }
        },
        {
          id: 'id-flores',
          name: 'Flores',
          alternateNames: ['Flower Island'],
          parentId: 'id',
          popularActivities: ['outdoors', 'cultural', 'aquatics'],
          description: 'Volcanic island with colorful crater lakes and traditional villages.',
          bestTimeToVisit: 'April to December',
          knownFor: ['Kelimutu Lakes', 'Traditional Villages', 'Volcanic Landscape', 'Cultural Diversity'],
          averageStay: '3-4 days',
          difficulty: 'moderate',
          crowdLevel: 'low',
          budgetLevel: 'budget',
          coordinates: { latitude: -8.6573, longitude: 121.0794 }
        },
        {
          id: 'id-raja-ampat',
          name: 'Raja Ampat',
          alternateNames: ['Four Kings', 'Marine Paradise'],
          parentId: 'id',
          popularActivities: ['aquatics', 'outdoors'],
          description: 'Remote marine paradise with world\'s richest underwater biodiversity.',
          bestTimeToVisit: 'October to April',
          knownFor: ['World-class Diving', 'Marine Biodiversity', 'Remote Islands', 'Pristine Waters'],
          averageStay: '5-7 days',
          difficulty: 'challenging',
          crowdLevel: 'low',
          budgetLevel: 'luxury',
          coordinates: { latitude: -0.2315, longitude: 130.5256 }
        },
        {
          id: 'id-toraja',
          name: 'Toraja',
          alternateNames: ['Tana Toraja', 'Land of Heavenly Kings'],
          parentId: 'id',
          popularActivities: ['cultural', 'heritage', 'outdoors'],
          description: 'Highland region famous for unique funeral ceremonies and traditional houses.',
          bestTimeToVisit: 'April to October',
          knownFor: ['Funeral Ceremonies', 'Traditional Houses', 'Coffee Plantations', 'Unique Culture'],
          averageStay: '2-3 days',
          difficulty: 'moderate',
          crowdLevel: 'low',
          budgetLevel: 'budget',
          coordinates: { latitude: -2.9441, longitude: 119.8707 }
        }
      ]
    },
    // Malaysia
    {
      id: 'my',
      name: 'Malaysia',
      alternateNames: ['MY', 'Truly Asia'],
      continentId: 'asia',
      currency: 'MYR',
      language: ['Malay', 'English'],
      timezone: 'GMT+8',
      description: 'Multicultural nation with diverse food and modern cities.',
      coordinates: { latitude: 4.2105, longitude: 101.9758 },
      subLocations: [
        {
          id: 'my-kuala-lumpur',
          name: 'Kuala Lumpur',
          alternateNames: ['KL', 'Garden City of Lights'],
          parentId: 'my',
          popularActivities: ['city', 'food', 'cultural', 'amusements'],
          description: 'Modern capital with iconic twin towers.',
          bestTimeToVisit: 'May to July, December to February',
          knownFor: ['Petronas Towers', 'Batu Caves', 'Street Food', 'Shopping'],
          averageStay: '3-4 days',
          difficulty: 'easy',
          crowdLevel: 'moderate',
          budgetLevel: 'budget',
          coordinates: { latitude: 3.1390, longitude: 101.6869 }
        }
      ]
    },
    // Vietnam
    {
      id: 'vn',
      name: 'Vietnam',
      alternateNames: ['VN', 'Socialist Republic of Vietnam'],
      continentId: 'asia',
      currency: 'VND',
      language: ['Vietnamese'],
      timezone: 'GMT+7',
      description: 'Long coastal country with rich history and amazing food.',
      coordinates: { latitude: 14.0583, longitude: 108.2772 },
      subLocations: [
        {
          id: 'vn-ho-chi-minh',
          name: 'Ho Chi Minh City',
          alternateNames: ['Saigon', 'HCMC'],
          parentId: 'vn',
          popularActivities: ['city', 'heritage', 'food', 'cultural'],
          description: 'Bustling southern metropolis with French colonial charm.',
          bestTimeToVisit: 'December to April',
          knownFor: ['War Remnants Museum', 'Ben Thanh Market', 'Pho', 'Motorbike Tours'],
          averageStay: '2-3 days',
          difficulty: 'moderate',
          crowdLevel: 'high',
          budgetLevel: 'budget',
          coordinates: { latitude: 10.8231, longitude: 106.6297 }
        }
      ]
    },
    // Taiwan
    {
      id: 'tw',
      name: 'Taiwan',
      alternateNames: ['TW', 'Republic of China', 'Formosa', 'Chinese Taipei'],
      continentId: 'asia',
      currency: 'TWD',
      language: ['Mandarin Chinese', 'Taiwanese'],
      timezone: 'GMT+8',
      description: 'Beautiful island nation known for night markets, mountains, and technology.',
      coordinates: { latitude: 23.6978, longitude: 120.9605 },
      subLocations: [
        {
          id: 'tw-taipei',
          name: 'Taipei',
          alternateNames: ['Capital City', 'Taipei City'],
          parentId: 'tw',
          popularActivities: ['city', 'food', 'cultural', 'heritage'],
          description: 'Modern capital city famous for night markets and Taipei 101.',
          bestTimeToVisit: 'October to March',
          knownFor: ['Taipei 101', 'Night Markets', 'Bubble Tea', 'Hot Springs'],
          averageStay: '3-4 days',
          difficulty: 'easy',
          crowdLevel: 'high',
          budgetLevel: 'mid-range',
          coordinates: { latitude: 25.0330, longitude: 121.5654 }
        },
        {
          id: 'tw-taichung',
          name: 'Taichung',
          alternateNames: ['Central Taiwan', 'Cultural City'],
          parentId: 'tw',
          popularActivities: ['cultural', 'food', 'heritage'],
          description: 'Cultural hub with traditional temples and modern attractions.',
          bestTimeToVisit: 'October to April',
          knownFor: ['Rainbow Village', 'Fengjia Night Market', 'National Museum'],
          averageStay: '2-3 days',
          difficulty: 'easy',
          crowdLevel: 'moderate',
          budgetLevel: 'budget',
          coordinates: { latitude: 24.1477, longitude: 120.6736 }
        },
        {
          id: 'tw-kaohsiung',
          name: 'Kaohsiung',
          alternateNames: ['Southern Capital', 'Harbor City'],
          parentId: 'tw',
          popularActivities: ['city', 'heritage', 'aquatics'],
          description: 'Major port city with beautiful harbor and cultural sites.',
          bestTimeToVisit: 'November to March',
          knownFor: ['Love River', 'Dragon Tiger Pagodas', 'Pier-2 Art Center'],
          averageStay: '2-3 days',
          difficulty: 'easy',
          crowdLevel: 'moderate',
          budgetLevel: 'budget',
          coordinates: { latitude: 22.6273, longitude: 120.3014 }
        }
      ]
    },
    // Hong Kong
    {
      id: 'hk',
      name: 'Hong Kong',
      alternateNames: ['HK', 'Hong Kong SAR', 'Fragrant Harbor', 'Pearl of Orient'],
      continentId: 'asia',
      currency: 'HKD',
      language: ['Cantonese', 'English'],
      timezone: 'GMT+8',
      description: 'Dynamic financial hub with stunning skyline and rich cultural blend.',
      coordinates: { latitude: 22.3193, longitude: 114.1694 },
      subLocations: [
        {
          id: 'hk-central',
          name: 'Central Hong Kong',
          alternateNames: ['Central District', 'CBD', 'Financial District'],
          parentId: 'hk',
          popularActivities: ['city', 'cultural', 'food', 'heritage'],
          description: 'Heart of Hong Kong with iconic skyline and business district.',
          bestTimeToVisit: 'October to December',
          knownFor: ['Victoria Harbour', 'Peak Tram', 'IFC Tower', 'Star Ferry'],
          averageStay: '3-4 days',
          difficulty: 'easy',
          crowdLevel: 'high',
          budgetLevel: 'luxury',
          coordinates: { latitude: 22.2783, longitude: 114.1747 }
        },
        {
          id: 'hk-tsim-sha-tsui',
          name: 'Tsim Sha Tsui',
          alternateNames: ['TST', 'Kowloon Waterfront'],
          parentId: 'hk',
          popularActivities: ['cultural', 'food', 'heritage'],
          description: 'Cultural district with museums, shopping, and waterfront promenade.',
          bestTimeToVisit: 'October to December',
          knownFor: ['Avenue of Stars', 'Symphony of Lights', 'Space Museum', 'Shopping'],
          averageStay: '2-3 days',
          difficulty: 'easy',
          crowdLevel: 'high',
          budgetLevel: 'mid-range',
          coordinates: { latitude: 22.2987, longitude: 114.1719 }
        },
        {
          id: 'hk-lantau',
          name: 'Lantau Island',
          alternateNames: ['Big Buddha Island', 'Disneyland Island'],
          parentId: 'hk',
          popularActivities: ['cultural', 'amusements', 'heritage', 'outdoors'],
          description: 'Largest island with Big Buddha, Disneyland, and nature trails.',
          bestTimeToVisit: 'October to March',
          knownFor: ['Big Buddha', 'Hong Kong Disneyland', 'Po Lin Monastery', 'Cable Car'],
          averageStay: '1-2 days',
          difficulty: 'easy',
          crowdLevel: 'moderate',
          budgetLevel: 'mid-range',
          coordinates: { latitude: 22.2588, longitude: 113.9277 }
        }
      ]
    },
    // Cambodia
    {
      id: 'kh',
      name: 'Cambodia',
      alternateNames: ['KH', 'Kingdom of Cambodia', 'Kampuchea'],
      continentId: 'asia',
      currency: 'KHR',
      language: ['Khmer'],
      timezone: 'GMT+7',
      description: 'Ancient kingdom famous for Angkor Wat and rich cultural heritage.',
      coordinates: { latitude: 12.5657, longitude: 104.9910 },
      subLocations: [
        {
          id: 'kh-siem-reap',
          name: 'Siem Reap',
          alternateNames: ['Angkor', 'Temple City'],
          parentId: 'kh',
          popularActivities: ['heritage', 'cultural', 'outdoors'],
          description: 'Gateway to the magnificent Angkor temple complex.',
          bestTimeToVisit: 'November to March',
          knownFor: ['Angkor Wat', 'Angkor Thom', 'Ta Prohm', 'Bayon Temple'],
          averageStay: '3-4 days',
          difficulty: 'easy',
          crowdLevel: 'high',
          budgetLevel: 'budget',
          coordinates: { latitude: 13.3671, longitude: 103.8448 }
        }
      ]
    },
    // China
    {
      id: 'cn',
      name: 'China',
      alternateNames: ['CN', 'People\'s Republic of China', 'Middle Kingdom'],
      continentId: 'asia',
      currency: 'CNY',
      language: ['Mandarin'],
      timezone: 'GMT+8',
      description: 'Ancient civilization with modern cities and diverse landscapes.',
      coordinates: { latitude: 35.8617, longitude: 104.1954 },
      subLocations: [
        {
          id: 'cn-beijing',
          name: 'Beijing',
          alternateNames: ['Capital', 'Peking'],
          parentId: 'cn',
          popularActivities: ['heritage', 'cultural', 'city'],
          description: 'Capital city with imperial palaces and modern architecture.',
          bestTimeToVisit: 'April to June, September to November',
          knownFor: ['Great Wall', 'Forbidden City', 'Temple of Heaven', 'Tiananmen Square'],
          averageStay: '4-5 days',
          difficulty: 'moderate',
          crowdLevel: 'high',
          budgetLevel: 'mid-range',
          coordinates: { latitude: 39.9042, longitude: 116.4074 }
        }
      ]
    },
    // Maldives
    {
      id: 'mv',
      name: 'Maldives',
      alternateNames: ['MV', 'Republic of Maldives', 'Maldive Islands'],
      continentId: 'asia',
      currency: 'MVR',
      language: ['Dhivehi', 'English'],
      timezone: 'GMT+5',
      description: 'Tropical paradise with crystal clear waters and luxury resorts.',
      coordinates: { latitude: 3.2028, longitude: 73.2207 },
      subLocations: [
        {
          id: 'mv-male',
          name: 'Malé',
          alternateNames: ['Capital', 'Male Atoll'],
          parentId: 'mv',
          popularActivities: ['aquatics', 'wellness', 'thrill'],
          description: 'Capital city and gateway to resort islands.',
          bestTimeToVisit: 'November to April',
          knownFor: ['Overwater Bungalows', 'Coral Reefs', 'Diving', 'Luxury Resorts'],
          averageStay: '5-7 days',
          difficulty: 'easy',
          crowdLevel: 'moderate',
          budgetLevel: 'luxury',
          coordinates: { latitude: 4.1755, longitude: 73.5093 }
        }
      ]
    },
    // United Arab Emirates
    {
      id: 'ae',
      name: 'United Arab Emirates',
      alternateNames: ['UAE', 'Emirates'],
      continentId: 'asia',
      currency: 'AED',
      language: ['Arabic', 'English'],
      timezone: 'GMT+4',
      description: 'Modern desert nation with futuristic cities and luxury lifestyle.',
      coordinates: { latitude: 23.4241, longitude: 53.8478 },
      subLocations: [
        {
          id: 'ae-dubai',
          name: 'Dubai',
          alternateNames: ['City of Gold', 'Dubai Emirate'],
          parentId: 'ae',
          popularActivities: ['city', 'cultural', 'stays', 'amusements'],
          description: 'Ultra-modern city with world\'s tallest building and luxury shopping.',
          bestTimeToVisit: 'November to March',
          knownFor: ['Burj Khalifa', 'Dubai Mall', 'Palm Jumeirah', 'Gold Souk'],
          averageStay: '4-5 days',
          difficulty: 'easy',
          crowdLevel: 'high',
          budgetLevel: 'luxury',
          coordinates: { latitude: 25.2048, longitude: 55.2708 }
        }
      ]
    },
    // Saudi Arabia
    {
      id: 'sa',
      name: 'Saudi Arabia',
      alternateNames: ['SA', 'Kingdom of Saudi Arabia', 'KSA'],
      continentId: 'asia',
      currency: 'SAR',
      language: ['Arabic'],
      timezone: 'GMT+3',
      description: 'Historic kingdom with ancient sites and modern vision.',
      coordinates: { latitude: 23.8859, longitude: 45.0792 },
      subLocations: [
        {
          id: 'sa-riyadh',
          name: 'Riyadh',
          alternateNames: ['Capital', 'Ar-Riyadh'],
          parentId: 'sa',
          popularActivities: ['city', 'cultural', 'heritage'],
          description: 'Modern capital city with traditional Arabian culture.',
          bestTimeToVisit: 'November to March',
          knownFor: ['Kingdom Centre', 'Masmak Fortress', 'Al-Murabba Palace', 'Diriyah'],
          averageStay: '2-3 days',
          difficulty: 'moderate',
          crowdLevel: 'moderate',
          budgetLevel: 'mid-range',
          coordinates: { latitude: 24.7136, longitude: 46.6753 }
        }
      ]
    },
    // Turkey
    {
      id: 'tr',
      name: 'Turkey',
      alternateNames: ['TR', 'Türkiye', 'Republic of Turkey'],
      continentId: 'asia',
      currency: 'TRY',
      language: ['Turkish'],
      timezone: 'GMT+3',
      description: 'Transcontinental country bridging Europe and Asia with rich history.',
      coordinates: { latitude: 38.9637, longitude: 35.2433 },
      subLocations: [
        {
          id: 'tr-istanbul',
          name: 'Istanbul',
          alternateNames: ['Constantinople', 'Byzantium'],
          parentId: 'tr',
          popularActivities: ['heritage', 'cultural', 'food', 'city'],
          description: 'Historic city spanning two continents with Byzantine and Ottoman heritage.',
          bestTimeToVisit: 'April to June, September to November',
          knownFor: ['Hagia Sophia', 'Blue Mosque', 'Grand Bazaar', 'Bosphorus'],
          averageStay: '4-5 days',
          difficulty: 'easy',
          crowdLevel: 'high',
          budgetLevel: 'mid-range',
          coordinates: { latitude: 41.0082, longitude: 28.9784 }
        }
      ]
    }

  ]
};

// Europe continent data
export const europeData: Continent = {
  id: 'europe',
  name: 'Europe',
  alternateNames: ['European Continent'],
  description: 'Historic continent with rich cultural heritage and architectural marvels.',
  countries: [
    franceData,
    // Italy
    {
      id: 'it',
      name: 'Italy',
      alternateNames: ['IT', 'Italia', 'Boot'],
      continentId: 'europe',
      currency: 'EUR',
      language: ['Italian'],
      timezone: 'GMT+1',
      description: 'Land of art, history, and incredible cuisine.',
      coordinates: { latitude: 41.8719, longitude: 12.5674 },
      subLocations: [
        {
          id: 'it-rome',
          name: 'Rome',
          alternateNames: ['Eternal City', 'Roma'],
          parentId: 'it',
          popularActivities: ['heritage', 'cultural', 'food'],
          description: 'Ancient capital with incredible historical sites.',
          bestTimeToVisit: 'April to June, September to October',
          knownFor: ['Colosseum', 'Vatican City', 'Trevi Fountain', 'Roman Forum'],
          averageStay: '3-4 days',
          difficulty: 'easy',
          crowdLevel: 'high',
          budgetLevel: 'mid-range',
          coordinates: { latitude: 41.9028, longitude: 12.4964 }
        }
      ]
    },
    // Spain
    {
      id: 'es',
      name: 'Spain',
      alternateNames: ['ES', 'España', 'Kingdom of Spain'],
      continentId: 'europe',
      currency: 'EUR',
      language: ['Spanish'],
      timezone: 'GMT+1',
      description: 'Passionate country of flamenco, tapas, and stunning architecture.',
      coordinates: { latitude: 40.4637, longitude: -3.7492 },
      subLocations: [
        {
          id: 'es-barcelona',
          name: 'Barcelona',
          alternateNames: ['Barca', 'City of Gaudí'],
          parentId: 'es',
          popularActivities: ['cultural', 'heritage', 'food', 'aquatics'],
          description: 'Artistic city with unique architecture and Mediterranean beaches.',
          bestTimeToVisit: 'May to September',
          knownFor: ['Sagrada Familia', 'Park Güell', 'Las Ramblas', 'Tapas'],
          averageStay: '3-4 days',
          difficulty: 'easy',
          crowdLevel: 'high',
          budgetLevel: 'mid-range',
          coordinates: { latitude: 41.3851, longitude: 2.1734 }
        }
      ]
    },
    // United Kingdom
    {
      id: 'gb',
      name: 'United Kingdom',
      alternateNames: ['UK', 'Britain', 'Great Britain'],
      continentId: 'europe',
      currency: 'GBP',
      language: ['English'],
      timezone: 'GMT+0',
      description: 'Historic kingdom with royal heritage and modern culture.',
      coordinates: { latitude: 55.3781, longitude: -3.4360 },
      subLocations: [
        {
          id: 'gb-london',
          name: 'London',
          alternateNames: ['Big Smoke', 'The Capital'],
          parentId: 'gb',
          popularActivities: ['heritage', 'cultural', 'city', 'food'],
          description: 'Historic capital with royal palaces and modern attractions.',
          bestTimeToVisit: 'May to September',
          knownFor: ['Big Ben', 'Buckingham Palace', 'Tower Bridge', 'British Museum'],
          averageStay: '4-5 days',
          difficulty: 'easy',
          crowdLevel: 'high',
          budgetLevel: 'luxury',
          coordinates: { latitude: 51.5074, longitude: -0.1278 }
        }
      ]
    },
    // Netherlands
    {
      id: 'nl',
      name: 'Netherlands',
      alternateNames: ['NL', 'Holland', 'Kingdom of Netherlands'],
      continentId: 'europe',
      currency: 'EUR',
      language: ['Dutch'],
      timezone: 'GMT+1',
      description: 'Land of tulips, windmills, and canals.',
      coordinates: { latitude: 52.1326, longitude: 5.2913 },
      subLocations: [
        {
          id: 'nl-amsterdam',
          name: 'Amsterdam',
          alternateNames: ['Venice of North', 'Dam'],
          parentId: 'nl',
          popularActivities: ['cultural', 'heritage', 'city'],
          description: 'Canal city with rich history and vibrant culture.',
          bestTimeToVisit: 'April to October',
          knownFor: ['Canals', 'Anne Frank House', 'Van Gogh Museum', 'Red Light District'],
          averageStay: '2-3 days',
          difficulty: 'easy',
          crowdLevel: 'high',
          budgetLevel: 'mid-range',
          coordinates: { latitude: 52.3676, longitude: 4.9041 }
        }
      ]
    },
    // Germany
    {
      id: 'de',
      name: 'Germany',
      alternateNames: ['DE', 'Deutschland', 'Federal Republic of Germany'],
      continentId: 'europe',
      currency: 'EUR',
      language: ['German'],
      timezone: 'GMT+1',
      description: 'Land of castles, beer, and efficient engineering.',
      coordinates: { latitude: 51.1657, longitude: 10.4515 },
      subLocations: [
        {
          id: 'de-berlin',
          name: 'Berlin',
          alternateNames: ['Capital', 'City of Freedom'],
          parentId: 'de',
          popularActivities: ['heritage', 'cultural', 'city'],
          description: 'Historic capital with remnants of the Cold War.',
          bestTimeToVisit: 'May to September',
          knownFor: ['Brandenburg Gate', 'Berlin Wall', 'Museum Island', 'Oktoberfest'],
          averageStay: '3-4 days',
          difficulty: 'easy',
          crowdLevel: 'moderate',
          budgetLevel: 'mid-range',
          coordinates: { latitude: 52.5200, longitude: 13.4050 }
        }
      ]
    },
    // Switzerland
    {
      id: 'ch',
      name: 'Switzerland',
      alternateNames: ['CH', 'Swiss Confederation', 'Land of Alps'],
      continentId: 'europe',
      currency: 'CHF',
      language: ['German', 'French', 'Italian'],
      timezone: 'GMT+1',
      description: 'Alpine paradise with pristine mountains and lakes.',
      coordinates: { latitude: 46.8182, longitude: 8.2275 },
      subLocations: [
        {
          id: 'ch-zurich',
          name: 'Zurich',
          alternateNames: ['Financial Capital', 'Zürich'],
          parentId: 'ch',
          popularActivities: ['outdoors', 'cultural', 'city'],
          description: 'Financial hub with beautiful lake and mountain views.',
          bestTimeToVisit: 'May to September',
          knownFor: ['Lake Zurich', 'Swiss Alps', 'Chocolate', 'Luxury Shopping'],
          averageStay: '2-3 days',
          difficulty: 'easy',
          crowdLevel: 'moderate',
          budgetLevel: 'luxury',
          coordinates: { latitude: 47.3769, longitude: 8.5417 }
        }
      ]
    },
    // Iceland
    {
      id: 'is',
      name: 'Iceland',
      alternateNames: ['IS', 'Land of Fire and Ice'],
      continentId: 'europe',
      currency: 'ISK',
      language: ['Icelandic'],
      timezone: 'GMT+0',
      description: 'Nordic island nation with dramatic landscapes and natural wonders.',
      coordinates: { latitude: 64.9631, longitude: -19.0208 },
      subLocations: [
        {
          id: 'is-reykjavik',
          name: 'Reykjavik',
          alternateNames: ['Capital', 'Smoky Bay'],
          parentId: 'is',
          popularActivities: ['cultural', 'heritage', 'city', 'wellness'],
          description: 'Colorful capital with vibrant culture and northern lights.',
          bestTimeToVisit: 'June to August, September to March (Northern Lights)',
          knownFor: ['Northern Lights', 'Blue Lagoon', 'Hallgrimskirkja', 'Viking Heritage'],
          averageStay: '2-3 days',
          difficulty: 'easy',
          crowdLevel: 'moderate',
          budgetLevel: 'luxury',
          coordinates: { latitude: 64.1466, longitude: -21.9426 }
        },
        {
          id: 'is-golden-circle',
          name: 'Golden Circle',
          alternateNames: ['Classic Route', 'Tourist Route'],
          parentId: 'is',
          popularActivities: ['outdoors', 'wellness', 'heritage'],
          description: 'Famous tourist route with geysers, waterfalls, and national park.',
          bestTimeToVisit: 'May to September',
          knownFor: ['Geysir', 'Gullfoss Waterfall', 'Thingvellir National Park'],
          averageStay: '1-2 days',
          difficulty: 'easy',
          crowdLevel: 'high',
          budgetLevel: 'mid-range',
          coordinates: { latitude: 64.3078, longitude: -20.1222 }
        },
        {
          id: 'is-south-coast',
          name: 'South Coast',
          alternateNames: ['Ring Road South', 'Black Sand Beaches'],
          parentId: 'is',
          popularActivities: ['outdoors', 'heritage'],
          description: 'Dramatic coastline with black sand beaches and glaciers.',
          bestTimeToVisit: 'May to September',
          knownFor: ['Reynisfjara Beach', 'Skogafoss', 'Seljalandsfoss', 'Glacier Lagoon'],
          averageStay: '2-3 days',
          difficulty: 'moderate',
          crowdLevel: 'moderate',
          budgetLevel: 'mid-range',
          coordinates: { latitude: 63.5311, longitude: -19.0208 }
        }
      ]
    },
    // Austria
    {
      id: 'at',
      name: 'Austria',
      alternateNames: ['AT', 'Republic of Austria', 'Österreich'],
      continentId: 'europe',
      currency: 'EUR',
      language: ['German'],
      timezone: 'GMT+1',
      description: 'Alpine country famous for music, mountains, and imperial history.',
      coordinates: { latitude: 47.5162, longitude: 14.5501 },
      subLocations: [
        {
          id: 'at-vienna',
          name: 'Vienna',
          alternateNames: ['Wien', 'City of Music'],
          parentId: 'at',
          popularActivities: ['cultural', 'heritage', 'city'],
          description: 'Imperial capital with stunning architecture and musical heritage.',
          bestTimeToVisit: 'April to October',
          knownFor: ['Schönbrunn Palace', 'Vienna State Opera', 'Sachertorte', 'Coffee Houses'],
          averageStay: '3-4 days',
          difficulty: 'easy',
          crowdLevel: 'moderate',
          budgetLevel: 'mid-range',
          coordinates: { latitude: 48.2082, longitude: 16.3738 }
        }
      ]
    },
    // Portugal
    {
      id: 'pt',
      name: 'Portugal',
      alternateNames: ['PT', 'Portuguese Republic'],
      continentId: 'europe',
      currency: 'EUR',
      language: ['Portuguese'],
      timezone: 'GMT+0',
      description: 'Atlantic nation with stunning coastline and rich maritime history.',
      coordinates: { latitude: 39.3999, longitude: -8.2245 },
      subLocations: [
        {
          id: 'pt-lisbon',
          name: 'Lisbon',
          alternateNames: ['Lisboa', 'City of Seven Hills'],
          parentId: 'pt',
          popularActivities: ['cultural', 'heritage', 'city'],
          description: 'Colorful capital with historic trams and Fado music.',
          bestTimeToVisit: 'March to May, September to October',
          knownFor: ['Tram 28', 'Belém Tower', 'Pastéis de Nata', 'Fado Music'],
          averageStay: '3-4 days',
          difficulty: 'easy',
          crowdLevel: 'moderate',
          budgetLevel: 'mid-range',
          coordinates: { latitude: 38.7223, longitude: -9.1393 }
        }
      ]
    },
    // Greece
    {
      id: 'gr',
      name: 'Greece',
      alternateNames: ['GR', 'Hellenic Republic', 'Hellas'],
      continentId: 'europe',
      currency: 'EUR',
      language: ['Greek'],
      timezone: 'GMT+2',
      description: 'Cradle of democracy with ancient ruins and beautiful islands.',
      coordinates: { latitude: 39.0742, longitude: 21.8243 },
      subLocations: [
        {
          id: 'gr-athens',
          name: 'Athens',
          alternateNames: ['Athina', 'Cradle of Democracy'],
          parentId: 'gr',
          popularActivities: ['heritage', 'cultural', 'city'],
          description: 'Ancient capital with iconic Acropolis and rich history.',
          bestTimeToVisit: 'April to June, September to October',
          knownFor: ['Acropolis', 'Parthenon', 'Ancient Agora', 'National Archaeological Museum'],
          averageStay: '2-3 days',
          difficulty: 'easy',
          crowdLevel: 'high',
          budgetLevel: 'mid-range',
          coordinates: { latitude: 37.9838, longitude: 23.7275 }
        }
      ]
    },
    // Poland
    {
      id: 'pl',
      name: 'Poland',
      alternateNames: ['PL', 'Republic of Poland', 'Polska'],
      continentId: 'europe',
      currency: 'PLN',
      language: ['Polish'],
      timezone: 'GMT+1',
      description: 'Central European country with medieval towns and rich history.',
      coordinates: { latitude: 51.9194, longitude: 19.1451 },
      subLocations: [
        {
          id: 'pl-krakow',
          name: 'Kraków',
          alternateNames: ['Krakow', 'Cultural Capital'],
          parentId: 'pl',
          popularActivities: ['heritage', 'cultural', 'city'],
          description: 'Medieval city with stunning architecture and vibrant culture.',
          bestTimeToVisit: 'May to September',
          knownFor: ['Wawel Castle', 'Main Market Square', 'Auschwitz-Birkenau', 'Jewish Quarter'],
          averageStay: '2-3 days',
          difficulty: 'easy',
          crowdLevel: 'moderate',
          budgetLevel: 'budget',
          coordinates: { latitude: 50.0647, longitude: 19.9450 }
        }
      ]
    },
    // Czech Republic
    {
      id: 'cz',
      name: 'Czech Republic',
      alternateNames: ['CZ', 'Czechia', 'Česká republika'],
      continentId: 'europe',
      currency: 'CZK',
      language: ['Czech'],
      timezone: 'GMT+1',
      description: 'Heart of Europe with fairy-tale castles and medieval towns.',
      coordinates: { latitude: 49.8175, longitude: 15.4730 },
      subLocations: [
        {
          id: 'cz-prague',
          name: 'Prague',
          alternateNames: ['Praha', 'City of a Hundred Spires'],
          parentId: 'cz',
          popularActivities: ['heritage', 'cultural', 'city'],
          description: 'Magical city with Gothic architecture and rich beer culture.',
          bestTimeToVisit: 'April to June, September to October',
          knownFor: ['Prague Castle', 'Charles Bridge', 'Old Town Square', 'Czech Beer'],
          averageStay: '3-4 days',
          difficulty: 'easy',
          crowdLevel: 'high',
          budgetLevel: 'budget',
          coordinates: { latitude: 50.0755, longitude: 14.4378 }
        }
      ]
    },
    // Norway
    {
      id: 'no',
      name: 'Norway',
      alternateNames: ['NO', 'Kingdom of Norway', 'Norge'],
      continentId: 'europe',
      currency: 'NOK',
      language: ['Norwegian'],
      timezone: 'GMT+1',
      description: 'Nordic country famous for fjords, northern lights, and natural beauty.',
      coordinates: { latitude: 60.4720, longitude: 8.4689 },
      subLocations: [
        {
          id: 'no-oslo',
          name: 'Oslo',
          alternateNames: ['Capital', 'Tiger City'],
          parentId: 'no',
          popularActivities: ['cultural', 'heritage', 'city'],
          description: 'Modern capital surrounded by forests and fjords.',
          bestTimeToVisit: 'May to September',
          knownFor: ['Viking Ship Museum', 'Opera House', 'Vigeland Sculpture Park', 'Northern Lights'],
          averageStay: '2-3 days',
          difficulty: 'easy',
          crowdLevel: 'moderate',
          budgetLevel: 'luxury',
          coordinates: { latitude: 59.9139, longitude: 10.7522 }
        }
      ]
    },
    // Sweden
    {
      id: 'se',
      name: 'Sweden',
      alternateNames: ['SE', 'Kingdom of Sweden', 'Sverige'],
      continentId: 'europe',
      currency: 'SEK',
      language: ['Swedish'],
      timezone: 'GMT+1',
      description: 'Scandinavian country known for design, nature, and progressive culture.',
      coordinates: { latitude: 60.1282, longitude: 18.6435 },
      subLocations: [
        {
          id: 'se-stockholm',
          name: 'Stockholm',
          alternateNames: ['Venice of the North', 'Capital'],
          parentId: 'se',
          popularActivities: ['cultural', 'heritage', 'city'],
          description: 'Beautiful capital built on 14 islands with stunning architecture.',
          bestTimeToVisit: 'May to September',
          knownFor: ['Gamla Stan', 'Vasa Museum', 'ABBA Museum', 'Royal Palace'],
          averageStay: '3-4 days',
          difficulty: 'easy',
          crowdLevel: 'moderate',
          budgetLevel: 'luxury',
          coordinates: { latitude: 59.3293, longitude: 18.0686 }
        }
      ]
    },
    // Denmark
    {
      id: 'dk',
      name: 'Denmark',
      alternateNames: ['DK', 'Kingdom of Denmark', 'Danmark'],
      continentId: 'europe',
      currency: 'DKK',
      language: ['Danish'],
      timezone: 'GMT+1',
      description: 'Happy Nordic country with fairy-tale castles and hygge culture.',
      coordinates: { latitude: 56.2639, longitude: 9.5018 },
      subLocations: [
        {
          id: 'dk-copenhagen',
          name: 'Copenhagen',
          alternateNames: ['København', 'City of Spires'],
          parentId: 'dk',
          popularActivities: ['cultural', 'heritage', 'city'],
          description: 'Charming capital with colorful buildings and cycling culture.',
          bestTimeToVisit: 'May to September',
          knownFor: ['Nyhavn', 'Little Mermaid', 'Tivoli Gardens', 'Christiania'],
          averageStay: '2-3 days',
          difficulty: 'easy',
          crowdLevel: 'moderate',
          budgetLevel: 'luxury',
          coordinates: { latitude: 55.6761, longitude: 12.5683 }
        }
      ]
    },
    // Finland
    {
      id: 'fi',
      name: 'Finland',
      alternateNames: ['FI', 'Republic of Finland', 'Suomi'],
      continentId: 'europe',
      currency: 'EUR',
      language: ['Finnish', 'Swedish'],
      timezone: 'GMT+2',
      description: 'Land of thousand lakes with saunas, northern lights, and design.',
      coordinates: { latitude: 61.9241, longitude: 25.7482 },
      subLocations: [
        {
          id: 'fi-helsinki',
          name: 'Helsinki',
          alternateNames: ['Helsingfors', 'Daughter of the Baltic'],
          parentId: 'fi',
          popularActivities: ['cultural', 'heritage', 'city'],
          description: 'Design capital with stunning architecture and Baltic Sea views.',
          bestTimeToVisit: 'May to September',
          knownFor: ['Senate Square', 'Suomenlinna', 'Design District', 'Saunas'],
          averageStay: '2-3 days',
          difficulty: 'easy',
          crowdLevel: 'moderate',
          budgetLevel: 'luxury',
          coordinates: { latitude: 60.1699, longitude: 24.9384 }
        }
      ]
    },
    // Monaco
    {
      id: 'mc',
      name: 'Monaco',
      alternateNames: ['MC', 'Principality of Monaco', 'Monte Carlo'],
      continentId: 'europe',
      currency: 'EUR',
      language: ['French'],
      timezone: 'GMT+1',
      description: 'Glamorous microstate known for luxury, casinos, and Formula 1.',
      coordinates: { latitude: 43.7384, longitude: 7.4246 },
      subLocations: [
        {
          id: 'mc-monte-carlo',
          name: 'Monte Carlo',
          alternateNames: ['Casino Quarter', 'Monaco-Ville'],
          parentId: 'mc',
          popularActivities: ['city', 'cultural', 'amusements'],
          description: 'Luxury district with famous casino and yacht harbor.',
          bestTimeToVisit: 'April to October',
          knownFor: ['Monte Carlo Casino', 'Monaco Grand Prix', 'Prince\'s Palace', 'Yacht Harbor'],
          averageStay: '1-2 days',
          difficulty: 'easy',
          crowdLevel: 'high',
          budgetLevel: 'luxury',
          coordinates: { latitude: 43.7384, longitude: 7.4246 }
        }
      ]
    }
  ]
};

// North America continent data
export const northAmericaData: Continent = {
  id: 'north-america',
  name: 'North America',
  alternateNames: ['North American Continent'],
  description: 'Diverse continent from arctic tundra to tropical beaches.',
  countries: [
    usaData,
    // Canada
    {
      id: 'ca',
      name: 'Canada',
      alternateNames: ['CA', 'Great White North'],
      continentId: 'north-america',
      currency: 'CAD',
      language: ['English', 'French'],
      timezone: 'GMT-3.5 to GMT-8',
      description: 'Vast country with stunning natural beauty and friendly people.',
      coordinates: { latitude: 56.1304, longitude: -106.3468 },
      subLocations: [
        {
          id: 'ca-toronto',
          name: 'Toronto',
          alternateNames: ['T-Dot', 'The 6ix'],
          parentId: 'ca',
          popularActivities: ['city', 'cultural', 'food'],
          description: 'Multicultural metropolis with iconic CN Tower.',
          bestTimeToVisit: 'May to October',
          knownFor: ['CN Tower', 'Niagara Falls', 'Diverse Food Scene', 'Toronto Islands'],
          averageStay: '3-4 days',
          difficulty: 'easy',
          crowdLevel: 'moderate',
          budgetLevel: 'mid-range',
          coordinates: { latitude: 43.6532, longitude: -79.3832 }
        }
      ]
    },
    // Mexico
    {
      id: 'mx',
      name: 'Mexico',
      alternateNames: ['MX', 'United Mexican States', 'México'],
      continentId: 'north-america',
      currency: 'MXN',
      language: ['Spanish'],
      timezone: 'GMT-6',
      description: 'Vibrant country with ancient ruins, beautiful beaches, and rich culture.',
      coordinates: { latitude: 23.6345, longitude: -102.5528 },
      subLocations: [
        {
          id: 'mx-mexico-city',
          name: 'Mexico City',
          alternateNames: ['CDMX', 'Ciudad de México', 'DF'],
          parentId: 'mx',
          popularActivities: ['cultural', 'heritage', 'city', 'food'],
          description: 'Massive capital with ancient Aztec ruins and vibrant culture.',
          bestTimeToVisit: 'March to May, September to November',
          knownFor: ['Zócalo', 'Frida Kahlo Museum', 'Teotihuacán', 'Street Food'],
          averageStay: '4-5 days',
          difficulty: 'moderate',
          crowdLevel: 'high',
          budgetLevel: 'budget',
          coordinates: { latitude: 19.4326, longitude: -99.1332 }
        }
      ]
    }
  ]
};

// South America continent data
export const southAmericaData: Continent = {
  id: 'south-america',
  name: 'South America',
  alternateNames: ['South American Continent'],
  description: 'Vibrant continent with Amazon rainforest and Andes mountains.',
  countries: [
    brazilData,
    // Argentina
    {
      id: 'ar',
      name: 'Argentina',
      alternateNames: ['AR', 'Land of Silver'],
      continentId: 'south-america',
      currency: 'ARS',
      language: ['Spanish'],
      timezone: 'GMT-3',
      description: 'Land of tango, beef, and passionate culture.',
      coordinates: { latitude: -38.4161, longitude: -63.6167 },
      subLocations: [
        {
          id: 'ar-buenos-aires',
          name: 'Buenos Aires',
          alternateNames: ['BA', 'Paris of South America'],
          parentId: 'ar',
          popularActivities: ['cultural', 'food', 'city', 'heritage'],
          description: 'Elegant capital known for tango and European architecture.',
          bestTimeToVisit: 'March to May, September to November',
          knownFor: ['Tango', 'Beef Steaks', 'Recoleta Cemetery', 'La Boca'],
          averageStay: '3-4 days',
          difficulty: 'easy',
          crowdLevel: 'moderate',
          budgetLevel: 'mid-range',
          coordinates: { latitude: -34.6118, longitude: -58.3960 }
        }
      ]
    },
    // Peru
    {
      id: 'pe',
      name: 'Peru',
      alternateNames: ['PE', 'Republic of Peru', 'Perú'],
      continentId: 'south-america',
      currency: 'PEN',
      language: ['Spanish', 'Quechua'],
      timezone: 'GMT-5',
      description: 'Land of the Incas with ancient ruins and diverse landscapes.',
      coordinates: { latitude: -9.1900, longitude: -75.0152 },
      subLocations: [
        {
          id: 'pe-cusco',
          name: 'Cusco',
          alternateNames: ['Cuzco', 'Gateway to Machu Picchu'],
          parentId: 'pe',
          popularActivities: ['heritage', 'cultural', 'outdoors', 'thrill'],
          description: 'Ancient Inca capital and gateway to Machu Picchu.',
          bestTimeToVisit: 'May to September',
          knownFor: ['Machu Picchu', 'Sacred Valley', 'Inca Trail', 'Colonial Architecture'],
          averageStay: '4-5 days',
          difficulty: 'moderate',
          crowdLevel: 'high',
          budgetLevel: 'mid-range',
          coordinates: { latitude: -13.5319, longitude: -71.9675 }
        }
      ]
    }
  ]
};

// Africa continent data
export const africaData: Continent = {
  id: 'africa',
  name: 'Africa',
  alternateNames: ['African Continent'],
  description: 'Cradle of humanity with incredible wildlife and diverse cultures.',
  countries: [
    southAfricaData,
    // Egypt
    {
      id: 'eg',
      name: 'Egypt',
      alternateNames: ['EG', 'Land of Pharaohs'],
      continentId: 'africa',
      currency: 'EGP',
      language: ['Arabic'],
      timezone: 'GMT+2',
      description: 'Ancient civilization with pyramids and the Nile River.',
      coordinates: { latitude: 26.0975, longitude: 31.2357 },
      subLocations: [
        {
          id: 'eg-cairo',
          name: 'Cairo',
          alternateNames: ['City of Thousand Minarets'],
          parentId: 'eg',
          popularActivities: ['heritage', 'cultural', 'city'],
          description: 'Ancient capital with pyramids and rich history.',
          bestTimeToVisit: 'October to April',
          knownFor: ['Pyramids of Giza', 'Sphinx', 'Egyptian Museum', 'Nile River'],
          averageStay: '3-4 days',
          difficulty: 'moderate',
          crowdLevel: 'high',
          budgetLevel: 'budget',
          coordinates: { latitude: 30.0444, longitude: 31.2357 }
        }
      ]
    },
    // Kenya
    {
      id: 'ke',
      name: 'Kenya',
      alternateNames: ['KE', 'Republic of Kenya'],
      continentId: 'africa',
      currency: 'KES',
      language: ['Swahili', 'English'],
      timezone: 'GMT+3',
      description: 'East African country famous for wildlife safaris and diverse landscapes.',
      coordinates: { latitude: -0.0236, longitude: 37.9062 },
      subLocations: [
        {
          id: 'ke-nairobi',
          name: 'Nairobi',
          alternateNames: ['Green City in the Sun', 'Safari Capital'],
          parentId: 'ke',
          popularActivities: ['outdoors', 'cultural', 'city', 'thrill'],
          description: 'Modern capital city and gateway to wildlife safaris.',
          bestTimeToVisit: 'June to October, December to March',
          knownFor: ['Masai Mara', 'Wildlife Safaris', 'Giraffe Centre', 'David Sheldrick Elephant Orphanage'],
          averageStay: '3-4 days',
          difficulty: 'moderate',
          crowdLevel: 'moderate',
          budgetLevel: 'mid-range',
          coordinates: { latitude: -1.2921, longitude: 36.8219 }
        }
      ]
    },
    // Morocco
    {
      id: 'ma',
      name: 'Morocco',
      alternateNames: ['MA', 'Kingdom of Morocco', 'Al-Maghrib'],
      continentId: 'africa',
      currency: 'MAD',
      language: ['Arabic', 'Berber', 'French'],
      timezone: 'GMT+1',
      description: 'North African kingdom with imperial cities and Sahara Desert.',
      coordinates: { latitude: 31.7917, longitude: -7.0926 },
      subLocations: [
        {
          id: 'ma-marrakech',
          name: 'Marrakech',
          alternateNames: ['Marrakesh', 'Red City', 'Pearl of the South'],
          parentId: 'ma',
          popularActivities: ['cultural', 'heritage', 'city', 'food'],
          description: 'Imperial city with vibrant souks and stunning architecture.',
          bestTimeToVisit: 'March to May, September to November',
          knownFor: ['Jemaa el-Fnaa', 'Majorelle Garden', 'Koutoubia Mosque', 'Souks'],
          averageStay: '3-4 days',
          difficulty: 'moderate',
          crowdLevel: 'high',
          budgetLevel: 'mid-range',
          coordinates: { latitude: 31.6295, longitude: -7.9811 }
        }
      ]
    }
  ]
};

// Oceania continent data
export const oceaniaData: Continent = {
  id: 'oceania',
  name: 'Oceania',
  alternateNames: ['Australia & Oceania', 'Pacific Islands'],
  description: 'Island continent with unique ecosystems and laid-back culture.',
  countries: [
    australiaData,
    // New Zealand
    {
      id: 'nz',
      name: 'New Zealand',
      alternateNames: ['NZ', 'Aotearoa', 'Land of Long White Cloud'],
      continentId: 'oceania',
      currency: 'NZD',
      language: ['English', 'Māori'],
      timezone: 'GMT+12',
      description: 'Adventure paradise with stunning landscapes and Māori culture.',
      coordinates: { latitude: -40.9006, longitude: 174.8860 },
      subLocations: [
        {
          id: 'nz-auckland',
          name: 'Auckland',
          alternateNames: ['City of Sails'],
          parentId: 'nz',
          popularActivities: ['outdoors', 'aquatics', 'city'],
          description: 'Largest city with beautiful harbors and outdoor activities.',
          bestTimeToVisit: 'December to March',
          knownFor: ['Sky Tower', 'Waitemata Harbour', 'Adventure Sports', 'Wine Regions'],
          averageStay: '2-3 days',
          difficulty: 'easy',
          crowdLevel: 'moderate',
          budgetLevel: 'luxury',
          coordinates: { latitude: -36.8485, longitude: 174.7633 }
        }
      ]
    }
  ]
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

// NEW: Search including subsublocations
export const searchAllLocations = (query: string): (SubLocation | SubSubLocation)[] => {
  const normalizedQuery = query.toLowerCase().trim();
  const results: (SubLocation | SubSubLocation)[] = [];
  
  placesData.forEach(continent => {
    continent.countries.forEach(country => {
      country.subLocations.forEach(location => {
        // Check main location
        if (location.name.toLowerCase().includes(normalizedQuery)) {
          results.push(location);
        } else if (location.alternateNames.some(altName => 
          altName.toLowerCase().includes(normalizedQuery)
        )) {
          results.push(location);
        }
        
        // NEW: Check subsublocations
        if (location.subSubLocations) {
          location.subSubLocations.forEach(subSubLocation => {
            if (subSubLocation.name.toLowerCase().includes(normalizedQuery)) {
              results.push(subSubLocation);
            } else if (subSubLocation.alternateNames.some(altName => 
              altName.toLowerCase().includes(normalizedQuery)
            )) {
              results.push(subSubLocation);
            }
          });
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

// NEW: Get country by name - for country-level navigation
export const getCountryByName = (name: string): Country | null => {
  const normalizedName = name.toLowerCase().trim();
  
  for (const continent of placesData) {
    for (const country of continent.countries) {
      // Check main name
      if (country.name.toLowerCase() === normalizedName) {
        return country;
      }
      
      // Check alternate names
      if (country.alternateNames.some(altName => 
        altName.toLowerCase() === normalizedName
      )) {
        return country;
      }
    }
  }
  
  return null;
};

// NEW: Unified location resolver - handles SubLocations, Countries, and SubSubLocations
export const resolveLocationForNavigation = (locationName: string): { 
  type: 'sublocation' | 'country' | 'subsublocation' | null;
  location?: SubLocation;
  country?: Country;
  subSubLocation?: SubSubLocation;
  parentSubLocation?: SubLocation; // Parent sublocation for subsublocations
} => {
  // First try to find as SubSubLocation
  const subSubLocation = getSubSubLocationByName(locationName);
  if (subSubLocation) {
    const parentSubLocation = getParentSubLocation(subSubLocation.id);
    const country = parentSubLocation ? getCountryByLocationId(parentSubLocation.id) : null;
    return {
      type: 'subsublocation',
      subSubLocation: subSubLocation,
      parentSubLocation: parentSubLocation || undefined,
      location: parentSubLocation || undefined, // For backward compatibility
      country: country || undefined
    };
  }
  
  // Then try to find as SubLocation
  const subLocation = getLocationByName(locationName);
  if (subLocation) {
    const country = getCountryByLocationId(subLocation.id);
    return {
      type: 'sublocation',
      location: subLocation,
      country: country || undefined
    };
  }
  
  // Finally try to find as Country
  const country = getCountryByName(locationName);
  if (country) {
    return {
      type: 'country',
      country: country
    };
  }
  
  return { type: null };
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

// NEW: Get parent sublocation for a subsublocation
export const getParentSubLocation = (subSubLocationId: string): SubLocation | null => {
  for (const continent of placesData) {
    for (const country of continent.countries) {
      for (const location of country.subLocations) {
        if (location.subSubLocations) {
          const found = location.subSubLocations.find(ssl => ssl.id === subSubLocationId);
          if (found) return location;
        }
      }
    }
  }
  return null;
};

// NEW: Get subsublocation by ID
export const getSubSubLocationById = (id: string): SubSubLocation | null => {
  for (const continent of placesData) {
    for (const country of continent.countries) {
      for (const location of country.subLocations) {
        if (location.subSubLocations) {
          const found = location.subSubLocations.find(ssl => ssl.id === id);
          if (found) return found;
        }
      }
    }
  }
  return null;
};

// NEW: Get subsublocation by name
export const getSubSubLocationByName = (name: string): SubSubLocation | null => {
  const normalizedName = name.toLowerCase().trim();
  
  for (const continent of placesData) {
    for (const country of continent.countries) {
      for (const location of country.subLocations) {
        if (location.subSubLocations) {
          for (const subSubLocation of location.subSubLocations) {
            // Check main name
            if (subSubLocation.name.toLowerCase() === normalizedName) {
              return subSubLocation;
            }
            
            // Check alternate names
            if (subSubLocation.alternateNames.some(altName => 
              altName.toLowerCase() === normalizedName
            )) {
              return subSubLocation;
            }
          }
        }
      }
    }
  }
  
  return null;
};

// All types and functions are exported above
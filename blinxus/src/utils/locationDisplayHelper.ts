import { placesData, Country, SubLocation, SubSubLocation, getSubSubLocationById, getParentSubLocation } from '../constants/placesData';

export interface LocationDisplayOption {
  id: string;
  name: string;
  displayName: string;
  type: 'global' | 'country' | 'sublocation' | 'subsublocation'; // NEW: Add subsublocation type
  country?: string;
  parentLocation?: string; // NEW: Add parent location for subsublocations
  isGeneral: boolean;
  alternateNames?: string[]; // Include alternateNames for better search performance
}

/**
 * CENTRALIZED LOCATION DISPLAY HELPER
 * 
 * This utility provides clean, organized location options for dropdowns and search.
 * It separates "general" locations (countries, global) from specific sublocations
 * to reduce clutter in the UI while maintaining full search functionality.
 * 
 * Features:
 * - General-only display for dropdowns (countries + global)
 * - Full search results when user types
 * - Consistent formatting across the app
 * - Backend-friendly structure
 */
export class LocationDisplayHelper {

  /**
   * Get general location options for dropdowns (countries + global only)
   * This is what shows by default to reduce clutter
   */
  static getGeneralLocations(includeGlobal: boolean = false): LocationDisplayOption[] {
    const options: LocationDisplayOption[] = [];

    // Add Global option if requested (for GlobalFeed)
    if (includeGlobal) {
      options.push({
        id: 'global-all',
        name: 'Global',
        displayName: 'Global',
        type: 'global',
        isGeneral: true,
      });
    }

    // Add all countries as general options
    placesData.forEach(continent => {
      continent.countries.forEach(country => {
        options.push({
          id: country.id,
          name: country.name,
          displayName: country.name,
          type: 'country',
          country: country.name,
          isGeneral: true,
          alternateNames: country.alternateNames,
        });
      });
    });

    return options;
  }

  /**
   * Get all locations for search functionality
   * This includes everything: global, countries, sublocations, and subsublocations
   */
  static getAllLocations(includeGlobal: boolean = false): LocationDisplayOption[] {
    const options: LocationDisplayOption[] = [];

    // Add Global option if requested (for GlobalFeed)
    if (includeGlobal) {
      options.push({
        id: 'global-all',
        name: 'Global',
        displayName: 'Global',
        type: 'global',
        isGeneral: true,
      });
    }

    // Add all countries and their sublocations
    placesData.forEach(continent => {
      continent.countries.forEach(country => {
        // Add country as general option
        options.push({
          id: country.id,
          name: country.name,
          displayName: country.name,
          type: 'country',
          country: country.name,
          isGeneral: true,
          alternateNames: country.alternateNames,
        });

        // Add all sublocations for this country
        country.subLocations.forEach(location => {
          options.push({
            id: location.id,
            name: location.name,
            displayName: includeGlobal 
              ? `${location.name}, ${country.name}` // For GlobalFeed, show "City, Country"
              : location.name, // For country-specific, just show city name
            type: 'sublocation',
            country: country.name,
            isGeneral: false,
            alternateNames: location.alternateNames,
          });
          
          // NEW: Add subsublocations if they exist
          if (location.subSubLocations) {
            location.subSubLocations.forEach(subSubLocation => {
              options.push({
                id: subSubLocation.id,
                name: subSubLocation.name,
                displayName: includeGlobal 
                  ? `${subSubLocation.name}, ${location.name}, ${country.name}` // For GlobalFeed
                  : `${subSubLocation.name}, ${location.name}`, // For country-specific
                type: 'subsublocation',
                country: country.name,
                parentLocation: location.name,
                isGeneral: false,
                alternateNames: subSubLocation.alternateNames,
              });
            });
          }
        });
      });
    });

    return options;
  }

  /**
   * Filter locations based on search query
   * Returns general options when no search, full results when searching
   * INCLUDES alternateNames for code names like BTG, Elyu, SFO, LAX, etc.
   */
  static filterLocations(
    searchQuery: string, 
    includeGlobal: boolean = false
  ): LocationDisplayOption[] {
    // If no search query, return only general locations
    if (!searchQuery.trim()) {
      return this.getGeneralLocations(includeGlobal);
    }

    // If searching, return all matching locations including alternateNames
    const allLocations = this.getAllLocations(includeGlobal);
    const query = searchQuery.toLowerCase();

    // NEW: Enhanced search logic to include subsublocations when searching by parent alternate names
    const matchingResults: LocationDisplayOption[] = [];
    const seenLocationIds = new Set<string>();

    // First pass: Direct matches
    allLocations.forEach(location => {
      const isDirectMatch = 
        location.name.toLowerCase().includes(query) ||
        location.displayName.toLowerCase().includes(query) ||
        (location.country && location.country.toLowerCase().includes(query)) ||
        (location.alternateNames && location.alternateNames.some((altName: string) => 
          altName.toLowerCase().includes(query)
        ));

      if (isDirectMatch && !seenLocationIds.has(location.id)) {
        matchingResults.push(location);
        seenLocationIds.add(location.id);
      }
    });

    // NEW: Second pass - Enhanced alternate name search for subsublocations
    // When searching for a sublocation's alternate name (e.g., "btg" for Batangas),
    // also include all subsublocations within that sublocation
    allLocations.forEach(location => {
      if (location.type === 'sublocation') {
        // Check if this sublocation matches by alternate name
        const matchesAlternateName = location.alternateNames && 
          location.alternateNames.some((altName: string) => 
            altName.toLowerCase().includes(query)
          );

        if (matchesAlternateName) {
          // Find all subsublocations that belong to this matching sublocation
          const subSubLocationsForThisLocation = allLocations.filter(subLoc => 
            subLoc.type === 'subsublocation' && 
            subLoc.parentLocation === location.name &&
            !seenLocationIds.has(subLoc.id)
          );

          // Add all subsublocations to results
          subSubLocationsForThisLocation.forEach(subSubLoc => {
            matchingResults.push(subSubLoc);
            seenLocationIds.add(subSubLoc.id);
          });
        }
      }
    });

    return matchingResults;
  }

  /**
   * Get locations for country-specific components (ForumPostModal, etc.)
   * Shows country as "General" option + all sublocations + subsublocations
   */
  static getCountryLocations(country: Country, searchQuery: string = ''): LocationDisplayOption[] {
    const options: LocationDisplayOption[] = [];

    // Add "General" option for the country
    options.push({
      id: 'all',
      name: 'General',
      displayName: country.name, // Show country name in search results
      type: 'country',
      country: country.name,
      isGeneral: true,
      alternateNames: country.alternateNames,
    });

    // Add all sublocations and their subsublocations
    country.subLocations.forEach(location => {
      options.push({
        id: location.id,
        name: location.name,
        displayName: location.name,
        type: 'sublocation',
        country: country.name,
        isGeneral: false,
        alternateNames: location.alternateNames,
      });
      
      // NEW: Only add subsublocations when there's a search query
      // This ensures forum dropdown shows only sublocations by default
      if (searchQuery.trim() && location.subSubLocations) {
        location.subSubLocations.forEach(subSubLocation => {
          options.push({
            id: subSubLocation.id,
            name: subSubLocation.name,
            displayName: `${subSubLocation.name}, ${location.name}`,
            type: 'subsublocation',
            country: country.name,
            parentLocation: location.name,
            isGeneral: false,
            alternateNames: subSubLocation.alternateNames,
          });
        });
      }
    });

    // Filter based on search query if provided
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      
      // NEW: Enhanced search logic to include subsublocations when searching by parent alternate names
      const matchingResults: LocationDisplayOption[] = [];
      const seenLocationIds = new Set<string>();

      // First pass: Direct matches
      options.forEach(location => {
        const isDirectMatch = 
          location.name.toLowerCase().includes(query) ||
          location.displayName.toLowerCase().includes(query) ||
          (location.parentLocation && location.parentLocation.toLowerCase().includes(query)) ||
          (location.alternateNames && location.alternateNames.some((altName: string) => 
            altName.toLowerCase().includes(query)
          ));

        if (isDirectMatch && !seenLocationIds.has(location.id)) {
          matchingResults.push(location);
          seenLocationIds.add(location.id);
        }
      });

      // NEW: Second pass - Enhanced alternate name search for subsublocations  
      // When searching for a sublocation's alternate name (e.g., "btg" for Batangas),
      // also include all subsublocations within that sublocation
      options.forEach(location => {
        if (location.type === 'sublocation') {
          // Check if this sublocation matches by alternate name
          const matchesAlternateName = location.alternateNames && 
            location.alternateNames.some((altName: string) => 
              altName.toLowerCase().includes(query)
            );

          if (matchesAlternateName) {
            // Find all subsublocations that belong to this matching sublocation
            const subSubLocationsForThisLocation = options.filter(subLoc => 
              subLoc.type === 'subsublocation' && 
              subLoc.parentLocation === location.name &&
              !seenLocationIds.has(subLoc.id)
            );

            // Add all subsublocations to results
            subSubLocationsForThisLocation.forEach(subSubLoc => {
              matchingResults.push(subSubLoc);
              seenLocationIds.add(subSubLoc.id);
            });
          }
        }
      });

      return matchingResults;
    }

    return options;
  }

  /**
   * Create a mock country object for GlobalFeed with clean general locations
   */
  static createGlobalFeedCountry(): Country {
    return {
      id: 'global',
      name: 'Global',
      alternateNames: [],
      continentId: 'global',
      subLocations: this.getGeneralLocations(true).map(option => ({
        id: option.id,
        name: option.name,
        alternateNames: [],
        parentId: 'global',
        popularActivities: [],
      }))
    };
  }

  /**
   * Format location display name consistently
   */
  static formatLocationDisplay(
    locationName: string, 
    isGeneral: boolean, 
    countryName?: string
  ): string {
    if (isGeneral) {
      return locationName; // Countries and Global show as-is
    }
    
    if (countryName && locationName !== countryName) {
      return `${locationName}, ${countryName}`; // Sublocations show "City, Country"
    }
    
    return locationName;
  }

  /**
   * Get location data by ID for accessing alternateNames
   */
  static getLocationDataById(locationId: string): SubLocation | Country | null {
    // Check if it's a country ID
    for (const continent of placesData) {
      for (const country of continent.countries) {
        if (country.id === locationId) {
          return country;
        }
        
        // Check sublocations
        for (const sublocation of country.subLocations) {
          if (sublocation.id === locationId) {
            return sublocation;
          }
        }
      }
    }
    
    return null;
  }

  /**
   * Check if a location should be shown in general display
   */
  static isGeneralLocation(locationName: string): boolean {
    // Check if it's a country name
    const isCountry = placesData.some(continent =>
      continent.countries.some(country => 
        country.name === locationName || 
        country.alternateNames.includes(locationName)
      )
    );

    // Check if it's global
    const isGlobal = locationName === 'Global' || locationName === 'global-all';

    return isCountry || isGlobal;
  }
}

export default LocationDisplayHelper; 
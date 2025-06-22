import { ForumActivityTag } from './forumTypes';

// Country-specific forum tags interface
export interface CountryForumTags {
  countryId: string;
  tags: {
    activity: ForumActivityTag[];
    accommodation: ForumActivityTag[];
    transport: ForumActivityTag[];
    food: ForumActivityTag[];
    culture: ForumActivityTag[];
  };
}

// Philippines-specific tags
const philippinesTags: CountryForumTags = {
  countryId: 'ph',
  tags: {
    activity: [
      { id: 'photography', label: 'Photography', emoji: '📸', category: 'activity' },
      { id: 'outdoors', label: 'Outdoors', emoji: '🌲', category: 'activity' },
      { id: 'city', label: 'City', emoji: '🏙️', category: 'activity' },
      { id: 'island-hopping', label: 'Island Hopping', emoji: '🏝️', category: 'activity' },
      { id: 'beaches', label: 'Beaches', emoji: '🏖️', category: 'activity' },
      { id: 'diving', label: 'Diving', emoji: '🤿', category: 'activity' },
      { id: 'nightlife', label: 'Nightlife', emoji: '🌃', category: 'activity' },
    ],
    accommodation: [
      { id: 'hotels', label: 'Hotels', emoji: '🏨', category: 'accommodation' },
      { id: 'hostels', label: 'Hostels', emoji: '🏠', category: 'accommodation' },
      { id: 'airbnb', label: 'Airbnb', emoji: '🏡', category: 'accommodation' },
      { id: 'resorts', label: 'Beach Resorts', emoji: '🏖️', category: 'accommodation' },
    ],
    transport: [
      { id: 'flights', label: 'Flights', emoji: '✈️', category: 'transport' },
      { id: 'ferries', label: 'Ferries', emoji: '⛴️', category: 'transport' },
      { id: 'jeepneys', label: 'Jeepneys', emoji: '🚐', category: 'transport' },
      { id: 'buses', label: 'Buses', emoji: '🚌', category: 'transport' },
      { id: 'grab', label: 'Grab/Taxis', emoji: '🚕', category: 'transport' },
    ],
    food: [
      { id: 'restaurants', label: 'Restaurants', emoji: '🍽️', category: 'food' },
      { id: 'local-eats', label: 'Filipino Food', emoji: '🍜', category: 'food' },
      { id: 'cafes', label: 'Cafes', emoji: '☕', category: 'food' },
      { id: 'bars', label: 'Bars', emoji: '🍺', category: 'food' },
      { id: 'desserts', label: 'Desserts', emoji: '🍰', category: 'food' },
    ],
    culture: [
      { id: 'festivals', label: 'Festivals', emoji: '🎊', category: 'culture' },
      { id: 'heritage', label: 'Heritage Sites', emoji: '🏛️', category: 'culture' },
      { id: 'traditions', label: 'Local Traditions', emoji: '🎭', category: 'culture' },
      { id: 'markets', label: 'Local Markets', emoji: '🏪', category: 'culture' },
    ],
  },
};

// Japan-specific tags
const japanTags: CountryForumTags = {
  countryId: 'jp',
  tags: {
    activity: [
      { id: 'photography', label: 'Photography', emoji: '📸', category: 'activity' },
      { id: 'outdoors', label: 'Outdoors', emoji: '🌲', category: 'activity' },
      { id: 'city', label: 'City', emoji: '🏙️', category: 'activity' },
      { id: 'temples', label: 'Temples & Shrines', emoji: '⛩️', category: 'activity' },
      { id: 'cherry-blossoms', label: 'Cherry Blossoms', emoji: '🌸', category: 'activity' },
      { id: 'hot-springs', label: 'Hot Springs', emoji: '♨️', category: 'activity' },
      { id: 'shopping', label: 'Shopping', emoji: '🛍️', category: 'activity' },
    ],
    accommodation: [
      { id: 'hotels', label: 'Hotels', emoji: '🏨', category: 'accommodation' },
      { id: 'hostels', label: 'Hostels', emoji: '🏠', category: 'accommodation' },
      { id: 'airbnb', label: 'Airbnb', emoji: '🏡', category: 'accommodation' },
      { id: 'ryokans', label: 'Ryokans', emoji: '🏯', category: 'accommodation' },
    ],
    transport: [
      { id: 'flights', label: 'Flights', emoji: '✈️', category: 'transport' },
      { id: 'jr-pass', label: 'JR Pass', emoji: '🚄', category: 'transport' },
      { id: 'trains', label: 'Local Trains', emoji: '🚃', category: 'transport' },
      { id: 'subway', label: 'Subway', emoji: '🚇', category: 'transport' },
      { id: 'buses', label: 'Buses', emoji: '🚌', category: 'transport' },
    ],
    food: [
      { id: 'restaurants', label: 'Restaurants', emoji: '🍽️', category: 'food' },
      { id: 'local-eats', label: 'Japanese Food', emoji: '🍱', category: 'food' },
      { id: 'cafes', label: 'Cafes', emoji: '☕', category: 'food' },
      { id: 'bars', label: 'Bars', emoji: '🍺', category: 'food' },
      { id: 'desserts', label: 'Desserts', emoji: '🍰', category: 'food' },
    ],
    culture: [
      { id: 'tea-ceremony', label: 'Tea Ceremony', emoji: '🍵', category: 'culture' },
      { id: 'festivals', label: 'Festivals', emoji: '🎊', category: 'culture' },
      { id: 'anime-manga', label: 'Anime & Manga', emoji: '📚', category: 'culture' },
      { id: 'traditions', label: 'Traditions', emoji: '🎭', category: 'culture' },
    ],
  },
};

// Thailand-specific tags
const thailandTags: CountryForumTags = {
  countryId: 'th',
  tags: {
    activity: [
      { id: 'photography', label: 'Photography', emoji: '📸', category: 'activity' },
      { id: 'outdoors', label: 'Outdoors', emoji: '🌲', category: 'activity' },
      { id: 'city', label: 'City', emoji: '🏙️', category: 'activity' },
      { id: 'temples', label: 'Temples', emoji: '🛕', category: 'activity' },
      { id: 'beaches', label: 'Beaches', emoji: '🏖️', category: 'activity' },
      { id: 'island-hopping', label: 'Island Hopping', emoji: '🏝️', category: 'activity' },
      { id: 'massage', label: 'Thai Massage', emoji: '💆', category: 'activity' },
      { id: 'nightlife', label: 'Nightlife', emoji: '🌃', category: 'activity' },
    ],
    accommodation: [
      { id: 'hotels', label: 'Hotels', emoji: '🏨', category: 'accommodation' },
      { id: 'hostels', label: 'Hostels', emoji: '🏠', category: 'accommodation' },
      { id: 'airbnb', label: 'Airbnb', emoji: '🏡', category: 'accommodation' },
      { id: 'resorts', label: 'Beach Resorts', emoji: '🏖️', category: 'accommodation' },
    ],
    transport: [
      { id: 'flights', label: 'Flights', emoji: '✈️', category: 'transport' },
      { id: 'tuk-tuks', label: 'Tuk-tuks', emoji: '🛺', category: 'transport' },
      { id: 'songthaews', label: 'Songthaews', emoji: '🚐', category: 'transport' },
      { id: 'buses', label: 'Buses', emoji: '🚌', category: 'transport' },
      { id: 'boats', label: 'Boats', emoji: '🛥️', category: 'transport' },
    ],
    food: [
      { id: 'restaurants', label: 'Restaurants', emoji: '🍽️', category: 'food' },
      { id: 'local-eats', label: 'Thai Food', emoji: '🍜', category: 'food' },
      { id: 'cafes', label: 'Cafes', emoji: '☕', category: 'food' },
      { id: 'bars', label: 'Bars', emoji: '🍺', category: 'food' },
      { id: 'desserts', label: 'Desserts', emoji: '🍰', category: 'food' },
    ],
    culture: [
      { id: 'muay-thai', label: 'Muay Thai', emoji: '🥊', category: 'culture' },
      { id: 'floating-markets', label: 'Floating Markets', emoji: '🛶', category: 'culture' },
      { id: 'festivals', label: 'Festivals', emoji: '🎊', category: 'culture' },
      { id: 'buddhism', label: 'Buddhism', emoji: '☸️', category: 'culture' },
    ],
  },
};

// Singapore-specific tags
const singaporeTags: CountryForumTags = {
  countryId: 'sg',
  tags: {
    activity: [
      { id: 'photography', label: 'Photography', emoji: '📸', category: 'activity' },
      { id: 'city', label: 'City', emoji: '🏙️', category: 'activity' },
      { id: 'gardens', label: 'Gardens', emoji: '🌿', category: 'activity' },
      { id: 'shopping', label: 'Shopping', emoji: '🛍️', category: 'activity' },
      { id: 'nightlife', label: 'Nightlife', emoji: '🌃', category: 'activity' },
      { id: 'sentosa', label: 'Sentosa Island', emoji: '🏝️', category: 'activity' },
    ],
    accommodation: [
      { id: 'hotels', label: 'Hotels', emoji: '🏨', category: 'accommodation' },
      { id: 'hostels', label: 'Hostels', emoji: '🏠', category: 'accommodation' },
      { id: 'airbnb', label: 'Airbnb', emoji: '🏡', category: 'accommodation' },
    ],
    transport: [
      { id: 'flights', label: 'Flights', emoji: '✈️', category: 'transport' },
      { id: 'mrt', label: 'MRT', emoji: '🚇', category: 'transport' },
      { id: 'buses', label: 'Buses', emoji: '🚌', category: 'transport' },
      { id: 'taxis', label: 'Taxis & Grab', emoji: '🚕', category: 'transport' },
    ],
    food: [
      { id: 'restaurants', label: 'Restaurants', emoji: '🍽️', category: 'food' },
      { id: 'local-eats', label: 'Local Food', emoji: '🍛', category: 'food' },
      { id: 'cafes', label: 'Cafes', emoji: '☕', category: 'food' },
      { id: 'bars', label: 'Bars', emoji: '🍺', category: 'food' },
      { id: 'desserts', label: 'Desserts', emoji: '🍰', category: 'food' },
      { id: 'hawker-centers', label: 'Hawker Centers', emoji: '🍜', category: 'food' },
    ],
    culture: [
      { id: 'multicultural', label: 'Multicultural', emoji: '🌍', category: 'culture' },
      { id: 'festivals', label: 'Festivals', emoji: '🎊', category: 'culture' },
      { id: 'chinatown', label: 'Chinatown', emoji: '🏮', category: 'culture' },
      { id: 'little-india', label: 'Little India', emoji: '🕌', category: 'culture' },
    ],
  },
};

// Hong Kong-specific tags
const hongKongTags: CountryForumTags = {
  countryId: 'hk',
  tags: {
    activity: [
      { id: 'photography', label: 'Photography', emoji: '📸', category: 'activity' },
      { id: 'outdoors', label: 'Outdoors', emoji: '🌲', category: 'activity' },
      { id: 'city', label: 'City', emoji: '🏙️', category: 'activity' },
      { id: 'peak', label: 'Victoria Peak', emoji: '🏔️', category: 'activity' },
      { id: 'shopping', label: 'Shopping', emoji: '🛍️', category: 'activity' },
      { id: 'harbor', label: 'Victoria Harbour', emoji: '🌊', category: 'activity' },
      { id: 'nightlife', label: 'Nightlife', emoji: '🌃', category: 'activity' },
    ],
    accommodation: [
      { id: 'hotels', label: 'Hotels', emoji: '🏨', category: 'accommodation' },
      { id: 'hostels', label: 'Hostels', emoji: '🏠', category: 'accommodation' },
      { id: 'airbnb', label: 'Airbnb', emoji: '🏡', category: 'accommodation' },
    ],
    transport: [
      { id: 'flights', label: 'Flights', emoji: '✈️', category: 'transport' },
      { id: 'mtr', label: 'MTR', emoji: '🚇', category: 'transport' },
      { id: 'star-ferry', label: 'Star Ferry', emoji: '⛴️', category: 'transport' },
      { id: 'buses', label: 'Buses', emoji: '🚌', category: 'transport' },
      { id: 'trams', label: 'Trams', emoji: '🚋', category: 'transport' },
    ],
    food: [
      { id: 'restaurants', label: 'Restaurants', emoji: '🍽️', category: 'food' },
      { id: 'local-eats', label: 'Cantonese Food', emoji: '🍜', category: 'food' },
      { id: 'cafes', label: 'Cafes', emoji: '☕', category: 'food' },
      { id: 'bars', label: 'Bars', emoji: '🍺', category: 'food' },
      { id: 'desserts', label: 'Desserts', emoji: '🍰', category: 'food' },
    ],
    culture: [
      { id: 'east-meets-west', label: 'East Meets West', emoji: '🌏', category: 'culture' },
      { id: 'festivals', label: 'Festivals', emoji: '🎊', category: 'culture' },
      { id: 'markets', label: 'Markets', emoji: '🏪', category: 'culture' },
      { id: 'traditions', label: 'Traditions', emoji: '🎭', category: 'culture' },
    ],
  },
};

// Indonesia-specific tags
const indonesiaTags: CountryForumTags = {
  countryId: 'id',
  tags: {
    activity: [
      { id: 'photography', label: 'Photography', emoji: '📸', category: 'activity' },
      { id: 'outdoors', label: 'Outdoors', emoji: '🌲', category: 'activity' },
      { id: 'beaches', label: 'Beaches', emoji: '🏖️', category: 'activity' },
      { id: 'volcanoes', label: 'Volcanoes', emoji: '🌋', category: 'activity' },
      { id: 'temples', label: 'Temples', emoji: '🛕', category: 'activity' },
      { id: 'diving', label: 'Diving', emoji: '🤿', category: 'activity' },
      { id: 'island-hopping', label: 'Island Hopping', emoji: '🏝️', category: 'activity' },
    ],
    accommodation: [
      { id: 'hotels', label: 'Hotels', emoji: '🏨', category: 'accommodation' },
      { id: 'hostels', label: 'Hostels', emoji: '🏠', category: 'accommodation' },
      { id: 'airbnb', label: 'Airbnb', emoji: '🏡', category: 'accommodation' },
      { id: 'resorts', label: 'Beach Resorts', emoji: '🏖️', category: 'accommodation' },
    ],
    transport: [
      { id: 'flights', label: 'Flights', emoji: '✈️', category: 'transport' },
      { id: 'ferries', label: 'Ferries', emoji: '⛴️', category: 'transport' },
      { id: 'buses', label: 'Buses', emoji: '🚌', category: 'transport' },
      { id: 'ojek', label: 'Ojek/GoJek', emoji: '🏍️', category: 'transport' },
    ],
    food: [
      { id: 'restaurants', label: 'Restaurants', emoji: '🍽️', category: 'food' },
      { id: 'local-eats', label: 'Indonesian Food', emoji: '🍜', category: 'food' },
      { id: 'cafes', label: 'Cafes', emoji: '☕', category: 'food' },
      { id: 'bars', label: 'Bars', emoji: '🍺', category: 'food' },
      { id: 'desserts', label: 'Desserts', emoji: '🍰', category: 'food' },
      { id: 'warungs', label: 'Warungs', emoji: '🏪', category: 'food' },
    ],
    culture: [
      { id: 'batik', label: 'Batik', emoji: '👘', category: 'culture' },
      { id: 'festivals', label: 'Festivals', emoji: '🎊', category: 'culture' },
      { id: 'traditions', label: 'Local Traditions', emoji: '🎭', category: 'culture' },
      { id: 'gamelan', label: 'Gamelan Music', emoji: '🎵', category: 'culture' },
    ],
  },
};

// Malaysia-specific tags
const malaysiaTags: CountryForumTags = {
  countryId: 'my',
  tags: {
    activity: [
      { id: 'photography', label: 'Photography', emoji: '📸', category: 'activity' },
      { id: 'outdoors', label: 'Outdoors', emoji: '🌲', category: 'activity' },
      { id: 'city', label: 'City', emoji: '🏙️', category: 'activity' },
      { id: 'beaches', label: 'Beaches', emoji: '🏖️', category: 'activity' },
      { id: 'island-hopping', label: 'Island Hopping', emoji: '🏝️', category: 'activity' },
      { id: 'shopping', label: 'Shopping', emoji: '🛍️', category: 'activity' },
      { id: 'nightlife', label: 'Nightlife', emoji: '🌃', category: 'activity' },
    ],
    accommodation: [
      { id: 'hotels', label: 'Hotels', emoji: '🏨', category: 'accommodation' },
      { id: 'hostels', label: 'Hostels', emoji: '🏠', category: 'accommodation' },
      { id: 'airbnb', label: 'Airbnb', emoji: '🏡', category: 'accommodation' },
    ],
    transport: [
      { id: 'flights', label: 'Flights', emoji: '✈️', category: 'transport' },
      { id: 'grab', label: 'Grab/Taxis', emoji: '🚕', category: 'transport' },
      { id: 'buses', label: 'Buses', emoji: '🚌', category: 'transport' },
      { id: 'trains', label: 'Trains', emoji: '🚄', category: 'transport' },
    ],
    food: [
      { id: 'restaurants', label: 'Restaurants', emoji: '🍽️', category: 'food' },
      { id: 'local-eats', label: 'Malaysian Food', emoji: '🍜', category: 'food' },
      { id: 'cafes', label: 'Cafes', emoji: '☕', category: 'food' },
      { id: 'bars', label: 'Bars', emoji: '🍺', category: 'food' },
      { id: 'desserts', label: 'Desserts', emoji: '🍰', category: 'food' },
      { id: 'hawker-centers', label: 'Hawker Centers', emoji: '🏪', category: 'food' },
    ],
    culture: [
      { id: 'multicultural', label: 'Multicultural', emoji: '🌍', category: 'culture' },
      { id: 'festivals', label: 'Festivals', emoji: '🎊', category: 'culture' },
      { id: 'traditions', label: 'Traditions', emoji: '🎭', category: 'culture' },
      { id: 'markets', label: 'Night Markets', emoji: '🏪', category: 'culture' },
    ],
  },
};

// Vietnam-specific tags
const vietnamTags: CountryForumTags = {
  countryId: 'vn',
  tags: {
    activity: [
      { id: 'photography', label: 'Photography', emoji: '📸', category: 'activity' },
      { id: 'outdoors', label: 'Outdoors', emoji: '🌲', category: 'activity' },
      { id: 'city', label: 'City', emoji: '🏙️', category: 'activity' },
      { id: 'beaches', label: 'Beaches', emoji: '🏖️', category: 'activity' },
      { id: 'cruises', label: 'Ha Long Bay', emoji: '🛥️', category: 'activity' },
      { id: 'motorbike-tours', label: 'Motorbike Tours', emoji: '🏍️', category: 'activity' },
    ],
    accommodation: [
      { id: 'hotels', label: 'Hotels', emoji: '🏨', category: 'accommodation' },
      { id: 'hostels', label: 'Hostels', emoji: '🏠', category: 'accommodation' },
      { id: 'airbnb', label: 'Airbnb', emoji: '🏡', category: 'accommodation' },
    ],
    transport: [
      { id: 'flights', label: 'Flights', emoji: '✈️', category: 'transport' },
      { id: 'motorbikes', label: 'Motorbike Rental', emoji: '🏍️', category: 'transport' },
      { id: 'trains', label: 'Trains', emoji: '🚄', category: 'transport' },
      { id: 'buses', label: 'Buses', emoji: '🚌', category: 'transport' },
      { id: 'cyclos', label: 'Cyclos', emoji: '🚲', category: 'transport' },
    ],
    food: [
      { id: 'restaurants', label: 'Restaurants', emoji: '🍽️', category: 'food' },
      { id: 'local-eats', label: 'Vietnamese Food', emoji: '🥢', category: 'food' },
      { id: 'cafes', label: 'Cafes', emoji: '☕', category: 'food' },
      { id: 'bars', label: 'Bars', emoji: '🍺', category: 'food' },
      { id: 'desserts', label: 'Desserts', emoji: '🍰', category: 'food' },
    ],
    culture: [
      { id: 'history', label: 'History', emoji: '📚', category: 'culture' },
      { id: 'traditions', label: 'Traditions', emoji: '🎭', category: 'culture' },
      { id: 'festivals', label: 'Festivals', emoji: '🎊', category: 'culture' },
      { id: 'ao-dai', label: 'Ao Dai Culture', emoji: '👘', category: 'culture' },
    ],
  },
};

// South Korea-specific tags
const southKoreaTags: CountryForumTags = {
  countryId: 'kr',
  tags: {
    activity: [
      { id: 'photography', label: 'Photography', emoji: '📸', category: 'activity' },
      { id: 'outdoors', label: 'Outdoors', emoji: '🌲', category: 'activity' },
      { id: 'city', label: 'City', emoji: '🏙️', category: 'activity' },
      { id: 'k-pop', label: 'K-pop Culture', emoji: '🎵', category: 'activity' },
      { id: 'palaces', label: 'Palaces', emoji: '🏯', category: 'activity' },
      { id: 'shopping', label: 'Shopping', emoji: '🛍️', category: 'activity' },
      { id: 'nightlife', label: 'Nightlife', emoji: '🌃', category: 'activity' },
      { id: 'han-river', label: 'Han River', emoji: '🌊', category: 'activity' },
    ],
    accommodation: [
      { id: 'hotels', label: 'Hotels', emoji: '🏨', category: 'accommodation' },
      { id: 'hostels', label: 'Hostels', emoji: '🏠', category: 'accommodation' },
      { id: 'airbnb', label: 'Airbnb', emoji: '🏡', category: 'accommodation' },
      { id: 'jjimjilbangs', label: 'Jjimjilbangs', emoji: '♨️', category: 'accommodation' },
    ],
    transport: [
      { id: 'flights', label: 'Flights', emoji: '✈️', category: 'transport' },
      { id: 'subway', label: 'Subway', emoji: '🚇', category: 'transport' },
      { id: 'buses', label: 'Buses', emoji: '🚌', category: 'transport' },
      { id: 'ktx', label: 'KTX Train', emoji: '🚄', category: 'transport' },
    ],
    food: [
      { id: 'restaurants', label: 'Restaurants', emoji: '🍽️', category: 'food' },
      { id: 'local-eats', label: 'Korean Food', emoji: '🍜', category: 'food' },
      { id: 'cafes', label: 'Cafes', emoji: '☕', category: 'food' },
      { id: 'bars', label: 'Bars', emoji: '🍺', category: 'food' },
      { id: 'desserts', label: 'Desserts', emoji: '🍰', category: 'food' },
    ],
    culture: [
      { id: 'k-culture', label: 'Korean Wave', emoji: '🌊', category: 'culture' },
      { id: 'traditions', label: 'Traditions', emoji: '🎭', category: 'culture' },
      { id: 'festivals', label: 'Festivals', emoji: '🎊', category: 'culture' },
      { id: 'hanbok', label: 'Hanbok Culture', emoji: '👘', category: 'culture' },
    ],
  },
};

// Taiwan-specific tags
const taiwanTags: CountryForumTags = {
  countryId: 'tw',
  tags: {
    activity: [
      { id: 'photography', label: 'Photography', emoji: '📸', category: 'activity' },
      { id: 'outdoors', label: 'Outdoors', emoji: '🌲', category: 'activity' },
      { id: 'city', label: 'City', emoji: '🏙️', category: 'activity' },
      { id: 'night-markets', label: 'Night Markets', emoji: '🌃', category: 'activity' },
      { id: 'hot-springs', label: 'Hot Springs', emoji: '♨️', category: 'activity' },
      { id: 'temples', label: 'Temples', emoji: '⛩️', category: 'activity' },
      { id: 'shopping', label: 'Shopping', emoji: '🛍️', category: 'activity' },
    ],
    accommodation: [
      { id: 'hotels', label: 'Hotels', emoji: '🏨', category: 'accommodation' },
      { id: 'hostels', label: 'Hostels', emoji: '🏠', category: 'accommodation' },
      { id: 'airbnb', label: 'Airbnb', emoji: '🏡', category: 'accommodation' },
    ],
    transport: [
      { id: 'flights', label: 'Flights', emoji: '✈️', category: 'transport' },
      { id: 'hsr', label: 'High Speed Rail', emoji: '🚄', category: 'transport' },
      { id: 'mrt', label: 'MRT', emoji: '🚇', category: 'transport' },
      { id: 'buses', label: 'Buses', emoji: '🚌', category: 'transport' },
      { id: 'scooters', label: 'Scooter Rental', emoji: '🛵', category: 'transport' },
    ],
    food: [
      { id: 'restaurants', label: 'Restaurants', emoji: '🍽️', category: 'food' },
      { id: 'local-eats', label: 'Taiwanese Food', emoji: '🥟', category: 'food' },
      { id: 'cafes', label: 'Cafes', emoji: '☕', category: 'food' },
      { id: 'bars', label: 'Bars', emoji: '🍺', category: 'food' },
      { id: 'desserts', label: 'Desserts', emoji: '🍰', category: 'food' },
    ],
    culture: [
      { id: 'aboriginal', label: 'Aboriginal Culture', emoji: '🏛️', category: 'culture' },
      { id: 'festivals', label: 'Festivals', emoji: '🎊', category: 'culture' },
      { id: 'traditions', label: 'Traditions', emoji: '🎭', category: 'culture' },
      { id: 'tea-culture', label: 'Tea Culture', emoji: '🍵', category: 'culture' },
    ],
  },
};

// Country tags mapping
export const COUNTRY_FORUM_TAGS: Record<string, CountryForumTags> = {
  'ph': philippinesTags,
  'jp': japanTags,
  'th': thailandTags,
  'sg': singaporeTags,
  'hk': hongKongTags,
  'id': indonesiaTags,
  'my': malaysiaTags,
  'vn': vietnamTags,
  'kr': southKoreaTags,
  'tw': taiwanTags,
};

// Helper function to get forum tags for a specific country
export const getForumTagsForCountry = (countryId: string): ForumActivityTag[] => {
  const countryTags = COUNTRY_FORUM_TAGS[countryId];
  if (!countryTags) {
    // Fallback to default tags if country not found
    return [];
  }
  
  return [
    ...countryTags.tags.activity,
    ...countryTags.tags.accommodation,
    ...countryTags.tags.transport,
    ...countryTags.tags.food,
    ...countryTags.tags.culture,
  ];
};

// Helper function to get tags by category for a specific country
export const getForumTagsByCategory = (countryId: string, category: 'activity' | 'accommodation' | 'transport' | 'food' | 'culture'): ForumActivityTag[] => {
  const countryTags = COUNTRY_FORUM_TAGS[countryId];
  if (!countryTags) {
    return [];
  }
  
  return countryTags.tags[category];
};

// Helper function to check if a country has custom tags
export const hasCustomForumTags = (countryId: string): boolean => {
  return countryId in COUNTRY_FORUM_TAGS;
}; 
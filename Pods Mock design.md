import React from 'react';
import { 
  Search, ChevronRight, ArrowLeft, Plus, Heart, 
  MessageSquare, Bookmark, Share2, Grid, Compass, 
  ShoppingBag, Calendar, AlertTriangle, User, Flag, MapPin,
  Send, ThumbsUp, MessageCircle
} from 'lucide-react';

function BlinxusApp() {
  const [activeScreen, setActiveScreen] = React.useState('pods-main');
  const [activeContinent, setActiveContinent] = React.useState('Asia');
  const [activeCountry, setActiveCountry] = React.useState(null);
  const [activeLocation, setActiveLocation] = React.useState(null);
  const [activeTab, setActiveTab] = React.useState('Highlights');
  const [activeSubLocation, setActiveSubLocation] = React.useState("All");

  // Replace "Americas" with "North America" and "South America"
  const continents = ['Asia', 'Europe', 'North America', 'South America', 'Africa', 'Oceania'];
  
  const countries = {
    'Asia': [
      { 
        name: 'Philippines', 
        posts: '324K', 
        members: '5.5M', 
        color: '#34a853', 
        locations: [
          { 
            name: 'Palawan', 
            members: '245K',
            posts: '28K',
            // Base activities for Palawan (will be overridden in dynamic filtering)
            activities: [
              { name: 'Hidden Lagoons', type: 'water' },
              { name: 'Underground River', type: 'nature' },
              { name: 'Island Hopping', type: 'water' }
            ], 
            color: '#4285f4' 
          },
          { 
            name: 'Cebu', 
            members: '198K',
            posts: '22K',
            activities: [
              { name: 'Canyoneering', type: 'adventure' },
              { name: 'Whale Shark Watching', type: 'diving' },
              { name: 'Heritage Sites', type: 'historical' }
            ], 
            color: '#4285f4' 
          },
          { 
            name: 'Boracay', 
            members: '356K',
            posts: '42K',
            activities: [
              { name: 'White Beach', type: 'water' },
              { name: 'Parasailing', type: 'adventure' },
              { name: 'Sunset Sailing', type: 'water' }
            ], 
            color: '#4285f4' 
          },
          { 
            name: 'Manila', 
            members: '187K',
            posts: '19K',
            activities: [
              { name: 'Intramuros Tour', type: 'historical' },
              { name: 'BGC Nightlife', type: 'urban' },
              { name: 'Binondo Food Tours', type: 'food' }
            ], 
            color: '#708090' 
          },
          { 
            name: 'Bohol', 
            members: '156K',
            posts: '18K',
            activities: [
              { name: 'Chocolate Hills', type: 'nature' },
              { name: 'Tarsier Sanctuary', type: 'nature' },
              { name: 'Loboc River Cruise', type: 'water' }
            ], 
            color: '#355E3B' 
          },
          // "Coron" is a sub-location of Palawan.
          { 
            name: 'Coron', 
            members: '128K',
            posts: '16K',
            activities: [
              { name: 'Shipwreck Diving', type: 'diving' },
              { name: 'Safari Experience', type: 'nature' },
              { name: 'Kayangan Lake', type: 'water' },
              { name: 'Limestone Cliffs', type: 'nature' }
            ], 
            color: '#4285f4' 
          },
          { 
            name: 'Siargao', 
            members: '95K',
            posts: '14K',
            activities: [
              { name: 'Cloud 9 Surfing', type: 'water' },
              { name: 'Coconut Groves', type: 'nature' },
              { name: 'Island Life', type: 'lifestyle' }
            ], 
            color: '#4285f4' 
          }
        ]
      },
      { 
        name: 'Japan', 
        posts: '572K', 
        members: '7.2M', 
        color: '#fbbc05', 
        locations: [
          { 
            name: 'Tokyo', 
            members: '567K', 
            posts: '58K', 
            activities: [
              { name: 'Shibuya Crossing', type: 'urban' }, 
              { name: 'Anime District', type: 'urban' }, 
              { name: 'Ramen Tours', type: 'food' }
            ], 
            color: '#708090' 
          },
          { 
            name: 'Kyoto', 
            members: '423K', 
            posts: '45K', 
            activities: [
              { name: 'Temple Visits', type: 'cultural' }, 
              { name: 'Bamboo Forest', type: 'nature' }, 
              { name: 'Tea Ceremonies', type: 'cultural' }
            ], 
            color: '#E2725B' 
          },
          { 
            name: 'Osaka', 
            members: '315K', 
            posts: '31K', 
            activities: [
              { name: 'Takoyaki Tasting', type: 'food' }, 
              { name: 'Dotonbori', type: 'urban' }, 
              { name: 'Castle Exploration', type: 'historical' }
            ], 
            color: '#708090' 
          },
          { 
            name: 'Hokkaido', 
            members: '278K', 
            posts: '27K', 
            activities: [
              { name: 'Snow Festival', type: 'cultural' }, 
              { name: 'Hot Springs', type: 'wellness' }, 
              { name: 'Ski Resorts', type: 'adventure' }
            ], 
            color: '#355E3B' 
          },
          { 
            name: 'Okinawa', 
            members: '196K', 
            posts: '21K', 
            activities: [
              { name: 'Marine Adventures', type: 'diving' }, 
              { name: 'Island Cuisine', type: 'food' }, 
              { name: 'Beach Relaxation', type: 'water' }
            ], 
            color: '#4285f4' 
          }
        ]
      },
      { 
        name: 'Thailand', 
        posts: '418K', 
        members: '6.3M', 
        color: '#4285f4', 
        locations: [
          { 
            name: 'Bangkok', 
            members: '378K', 
            posts: '39K', 
            activities: [
              { name: 'Floating Markets', type: 'cultural' }, 
              { name: 'Temple Hopping', type: 'historical' }, 
              { name: 'Street Food Safari', type: 'food' }
            ], 
            color: '#708090' 
          },
          { 
            name: 'Phuket', 
            members: '289K', 
            posts: '32K', 
            activities: [
              { name: 'Beach Clubs', type: 'water' }, 
              { name: 'Muay Thai Shows', type: 'cultural' }, 
              { name: 'Speedboat Tours', type: 'water' }
            ], 
            color: '#4285f4' 
          },
          { 
            name: 'Chiang Mai', 
            members: '215K', 
            posts: '23K', 
            activities: [
              { name: 'Elephant Sanctuaries', type: 'nature' }, 
              { name: 'Doi Suthep', type: 'cultural' }, 
              { name: 'Lantern Festival', type: 'cultural' }
            ], 
            color: '#E2725B' 
          },
          { 
            name: 'Koh Samui', 
            members: '186K', 
            posts: '19K', 
            activities: [
              { name: 'Wellness Retreats', type: 'wellness' }, 
              { name: 'Luxury Villas', type: 'lifestyle' }, 
              { name: 'Sunset Viewpoints', type: 'water' }
            ], 
            color: '#4285f4' 
          },
          { 
            name: 'Krabi', 
            members: '165K', 
            posts: '16K', 
            activities: [
              { name: 'Rock Climbing', type: 'adventure' }, 
              { name: 'Emerald Pool', type: 'nature' }, 
              { name: 'Four Islands Tour', type: 'water' }
            ], 
            color: '#4285f4' 
          }
        ]
      },
      { 
        name: 'Indonesia', 
        posts: '289K', 
        members: '4.8M', 
        color: '#ea4335', 
        locations: [
          { 
            name: 'Bali', 
            members: '358K', 
            posts: '38K', 
            activities: [
              { name: 'Rice Terraces', type: 'nature' }, 
              { name: 'Surf Beaches', type: 'water' }, 
              { name: 'Balinese Dance', type: 'cultural' }, 
              { name: 'Yoga Retreats', type: 'wellness' }
            ], 
            color: '#4285f4' 
          },
          { 
            name: 'Jakarta', 
            members: '186K', 
            posts: '17K', 
            activities: [
              { name: 'Skyscraper Views', type: 'urban' }, 
              { name: 'Colonial District', type: 'historical' }, 
              { name: 'Night Markets', type: 'food' }
            ], 
            color: '#708090' 
          },
          { 
            name: 'Lombok', 
            members: '148K', 
            posts: '14K', 
            activities: [
              { name: 'Gili Islands', type: 'water' }, 
              { name: 'Mount Rinjani', type: 'hiking' }, 
              { name: 'Sasak Villages', type: 'cultural' }
            ], 
            color: '#4285f4' 
          },
          { 
            name: 'Yogyakarta', 
            members: '127K', 
            posts: '12K', 
            activities: [
              { name: 'Borobudur Sunrise', type: 'historical' }, 
              { name: 'Batik Workshops', type: 'cultural' }, 
              { name: 'Jomblang Cave', type: 'adventure' }
            ], 
            color: '#E2725B' 
          },
          { 
            name: 'Raja Ampat', 
            members: '98K', 
            posts: '9K', 
            activities: [
              { name: 'Coral Reefs', type: 'diving' }, 
              { name: 'Bird Watching', type: 'nature' }, 
              { name: 'Hidden Lagoons', type: 'water' }
            ], 
            color: '#4285f4' 
          }
        ]
      }
    ],
    'Europe': [
      { 
        name: 'Italy', 
        posts: '489K', 
        members: '6.7M', 
        color: '#4285f4', 
        locations: [
          { 
            name: 'Rome', 
            members: '347K', 
            posts: '37K', 
            activities: [
              { name: 'Colosseum Tour', type: 'historical' }, 
              { name: 'Vatican Museums', type: 'cultural' }, 
              { name: 'Roman Cuisine', type: 'food' }
            ], 
            color: '#483C32' 
          },
          { 
            name: 'Venice', 
            members: '286K', 
            posts: '31K', 
            activities: [
              { name: 'Gondola Rides', type: 'water' }, 
              { name: 'Doge Palace', type: 'historical' }, 
              { name: 'Murano Glass', type: 'cultural' }
            ], 
            color: '#483C32' 
          },
          { 
            name: 'Florence', 
            members: '257K', 
            posts: '28K', 
            activities: [
              { name: 'Uffizi Gallery', type: 'cultural' }, 
              { name: 'Ponte Vecchio', type: 'historical' }, 
              { name: 'Tuscan Vineyards', type: 'food' }
            ], 
            color: '#483C32' 
          },
          { 
            name: 'Milan', 
            members: '189K', 
            posts: '21K', 
            activities: [
              { name: 'Fashion District', type: 'urban' }, 
              { name: 'Last Supper', type: 'cultural' }, 
              { name: 'Design Week', type: 'urban' }
            ], 
            color: '#708090' 
          },
          { 
            name: 'Amalfi Coast', 
            members: '156K', 
            posts: '18K', 
            activities: [
              { name: 'Coastal Drive', type: 'nature' }, 
              { name: 'Limoncello Tasting', type: 'food' }, 
              { name: 'Blue Grotto', type: 'water' }
            ], 
            color: '#4285f4' 
          }
        ]
      }
    ]
  };
  
  // Philippines Palawan location posts
  const philippinesPosts = [
    {
      id: 1,
      user: { name: 'Jessica Martinez', avatar: '👩🏽' },
      location: 'El Nido',
      countryName: 'Philippines',
      activityType: 'water',
      content: 'Found paradise today! The crystal clear waters of El Nido are absolutely breathtaking. The island hopping tour took us to secret lagoons and hidden beaches. 🏝️',
      image: '/api/placeholder/600/400',
      likes: 438,
      comments: 32,
      timeAgo: '2h'
    },
    {
      id: 2,
      user: { name: 'Marcus Chen', avatar: '👨🏻' },
      location: 'Coron',
      countryName: 'Philippines',
      activityType: 'nature',
      content: 'The Coron Safari was incredible! We saw exotic wildlife in their natural habitat and enjoyed the breathtaking view of limestone cliffs towering over crystal clear lakes. 🦒',
      image: '/api/placeholder/600/400',
      likes: 217,
      comments: 19,
      timeAgo: '5h'
    },
    {
      id: 3,
      user: { name: 'Sophia Thompson', avatar: '👩🏼' },
      location: 'Port Barton',
      countryName: 'Philippines',
      activityType: 'water',
      content: 'Discovered this hidden gem! Port Barton is so much less crowded than El Nido but equally beautiful. The sunset from our beachfront cabin was absolutely magical. ✨',
      image: '/api/placeholder/600/400',
      likes: 186,
      comments: 24,
      timeAgo: '1d'
    },
    {
      id: 4,
      user: { name: 'David Wilson', avatar: '👨🏾' },
      location: 'Coron',
      countryName: 'Philippines',
      activityType: 'diving',
      content: 'Shipwreck diving in Coron is unbelievable! The visibility was perfect and exploring the Japanese shipwrecks from WWII felt like time traveling. A must for diving enthusiasts! 🤿',
      image: '/api/placeholder/600/400',
      likes: 312,
      comments: 41,
      timeAgo: '3h'
    }
  ];
  
  // Japanese posts
  const japanesePosts = [
    {
      id: 5,
      user: { name: 'Alex Morgan', avatar: '👩🏻' },
      location: 'Tokyo',
      countryName: 'Japan',
      activityType: 'urban',
      content: 'Lost in translation at Shibuya Crossing! The organized chaos of the world\'s busiest intersection is mesmerizing. Don\'t miss the view from Starbucks. 🏙️',
      image: '/api/placeholder/600/400',
      likes: 523,
      comments: 47,
      timeAgo: '6h'
    },
    {
      id: 6,
      user: { name: 'Ryan Tanaka', avatar: '👨🏻' },
      location: 'Kyoto',
      countryName: 'Japan',
      activityType: 'cultural',
      content: 'Morning meditation at Fushimi Inari Shrine before the crowds arrived. Walking through thousands of vermilion torii gates feels like stepping into another world. 🏮',
      image: '/api/placeholder/600/400',
      likes: 412,
      comments: 38,
      timeAgo: '1d'
    }
  ];
  
  // Thai posts
  const thaiPosts = [
    {
      id: 7,
      user: { name: 'Emma Lee', avatar: '👩🏻' },
      location: 'Bangkok',
      countryName: 'Thailand',
      activityType: 'food',
      content: 'Street food paradise in Bangkok! From pad thai to mango sticky rice, every bite is an explosion of flavors. The food scene here is unmatched! 🍜',
      image: '/api/placeholder/600/400',
      likes: 378,
      comments: 29,
      timeAgo: '4h'
    },
    {
      id: 8,
      user: { name: 'Noah Carter', avatar: '👨🏼' },
      location: 'Phuket',
      countryName: 'Thailand',
      activityType: 'water',
      content: 'Beach day in Phuket! Crystal clear waters, white sand, and the perfect sunset. Paradise found. 🏝️',
      image: '/api/placeholder/600/400',
      likes: 295,
      comments: 18,
      timeAgo: '2d'
    }
  ];
  
  // Indonesian posts
  const indonesianPosts = [
    {
      id: 9,
      user: { name: 'Olivia Wilson', avatar: '👩🏼' },
      location: 'Bali',
      countryName: 'Indonesia',
      activityType: 'wellness',
      content: 'Yoga retreat in Ubud was exactly what my soul needed. The rice terraces view during morning practice is absolutely breathtaking. 🧘‍♀️',
      image: '/api/placeholder/600/400',
      likes: 467,
      comments: 42,
      timeAgo: '3d'
    },
    {
      id: 10,
      user: { name: 'Ethan Rahman', avatar: '👨🏽' },
      location: 'Raja Ampat',
      countryName: 'Indonesia',
      activityType: 'diving',
      content: 'Raja Ampat has the most diverse marine life I\'ve ever seen! Spotted manta rays, reef sharks, and countless species of coral. A diver\'s paradise! 🐠',
      image: '/api/placeholder/600/400',
      likes: 389,
      comments: 31,
      timeAgo: '5d'
    }
  ];
  
  // Italian posts
  const italianPosts = [
    {
      id: 11,
      user: { name: 'Sofia Rossi', avatar: '👩🏻' },
      location: 'Rome',
      countryName: 'Italy',
      activityType: 'historical',
      content: 'Standing in the Colosseum feels like time travel. Imagining the gladiatorial games that took place here 2,000 years ago is mind-blowing. History comes alive in Rome! 🏛️',
      image: '/api/placeholder/600/400',
      likes: 512,
      comments: 45,
      timeAgo: '8h'
    },
    {
      id: 12,
      user: { name: 'Marco Bianchi', avatar: '👨🏻' },
      location: 'Venice',
      countryName: 'Italy',
      activityType: 'water',
      content: 'Gondola ride through the canals of Venice at sunset. No cars, no traffic - just the gentle sound of water and occasional accordion music. Pure magic! 🚣',
      image: '/api/placeholder/600/400',
      likes: 427,
      comments: 36,
      timeAgo: '1d'
    }
  ];
  
  // Combine all posts for easy filtering
  const allPosts = [
    ...philippinesPosts, 
    ...japanesePosts, 
    ...thaiPosts, 
    ...indonesianPosts, 
    ...italianPosts
  ];
  
  // Sample Q&A data for both Country and Location screens
  const qaThreads = [
    {
      id: 1,
      user: { name: 'Alex Johnson', avatar: '👨🏻' },
      question: 'What is the best time to visit for avoiding crowds but still having good weather?',
      timeAgo: '2d',
      upvotes: 28,
      views: 346,
      replies: [
        {
          id: 101,
          user: { name: 'Maria Garcia', avatar: '👩🏽' },
          content: 'I went in late April and it was perfect! Weather was great and the crowds hadn\'t picked up yet.',
          timeAgo: '1d',
          upvotes: 15
        },
        {
          id: 102,
          user: { name: 'Thomas Lee', avatar: '👨🏻' },
          content: 'Early November is also good. Rainy season is ending and tourist season hasn\'t fully ramped up.',
          timeAgo: '22h',
          upvotes: 8
        }
      ]
    },
    {
      id: 2,
      user: { name: 'Rachel Kim', avatar: '👩🏻' },
      question: 'Any recommendations for affordable but nice accommodations in the area?',
      timeAgo: '6d',
      upvotes: 35,
      views: 582,
      replies: [
        {
          id: 201,
          user: { name: 'Jason Patel', avatar: '👨🏾' },
          content: 'Check out Sunset Hostel! Private rooms for about $35/night and a great rooftop bar.',
          timeAgo: '5d',
          upvotes: 22
        }
      ]
    },
    {
      id: 3,
      user: { name: 'Emma Wilson', avatar: '👩🏼' },
      question: 'What\'s the best way to get around locally? Is it easy to rent scooters?',
      timeAgo: '3d',
      upvotes: 19,
      views: 231,
      replies: []
    }
  ];
  
  const exploreContent = [
    { image: '/api/placeholder/300/300' },
    { image: '/api/placeholder/300/300' },
    { image: '/api/placeholder/300/300' },
    { image: '/api/placeholder/300/300' },
    { image: '/api/placeholder/300/300' },
    { image: '/api/placeholder/300/300' },
    { image: '/api/placeholder/300/300' },
    { image: '/api/placeholder/300/300' },
    { image: '/api/placeholder/300/300' }
  ];
  
  const marketListings = [
    {
      id: 1,
      title: 'Island Hopping Tour - Tour A',
      location: 'El Nido',
      country: 'Philippines',
      price: '₱1,200',
      image: '/api/placeholder/300/200',
      provider: 'El Nido Adventures',
      rating: 4.8,
      reviews: 243
    },
    {
      id: 2,
      title: 'Palawan Eco Resort - 25% Off',
      location: 'Coron',
      country: 'Philippines',
      price: '₱3,500/night',
      image: '/api/placeholder/300/200',
      provider: 'Sustainable Stays PH',
      rating: 4.6,
      reviews: 128
    },
    {
      id: 3,
      title: 'Underwater Photography Package',
      location: 'Multiple Locations',
      country: 'Multiple',
      price: '₱2,200',
      image: '/api/placeholder/300/200',
      provider: 'Dive Photography Pro',
      rating: 4.9,
      reviews: 57
    },
    {
      id: 4,
      title: 'Tokyo City Tour',
      location: 'Tokyo',
      country: 'Japan',
      price: '¥5,500',
      image: '/api/placeholder/300/200',
      provider: 'Tokyo Explorers',
      rating: 4.7,
      reviews: 189
    },
    {
      id: 5,
      title: 'Bangkok Food Tour',
      location: 'Bangkok',
      country: 'Thailand',
      price: '฿1,200',
      image: '/api/placeholder/300/200',
      provider: 'Thai Flavors',
      rating: 4.8,
      reviews: 215
    },
    {
      id: 6,
      title: 'Bali Villa Retreat',
      location: 'Bali',
      country: 'Indonesia',
      price: 'Rp1,500,000/night',
      image: '/api/placeholder/300/200',
      provider: 'Bali Luxury Stays',
      rating: 4.9,
      reviews: 167
    },
    {
      id: 7,
      title: 'Rome Walking Tour',
      location: 'Rome',
      country: 'Italy',
      price: '€45',
      image: '/api/placeholder/300/200',
      provider: 'Roma Walks',
      rating: 4.7,
      reviews: 231
    }
  ];
  
  const events = [
    {
      id: 1,
      title: 'Palawan Arts Festival',
      date: 'Apr 15-18, 2025',
      location: 'Puerto Princesa',
      country: 'Philippines',
      image: '/api/placeholder/300/150'
    },
    {
      id: 2,
      title: 'Malasimbo Music & Arts Festival',
      date: 'Mar 2-5, 2025',
      location: 'Puerto Galera',
      country: 'Philippines',
      image: '/api/placeholder/300/150'
    },
    {
      id: 3,
      title: 'Cherry Blossom Festival',
      date: 'Mar 25-Apr 5, 2025',
      location: 'Tokyo',
      country: 'Japan',
      image: '/api/placeholder/300/150'
    },
    {
      id: 4,
      title: 'Songkran Water Festival',
      date: 'Apr 13-15, 2025',
      location: 'Bangkok',
      country: 'Thailand',
      image: '/api/placeholder/300/150'
    },
    {
      id: 5,
      title: 'Bali Arts Festival',
      date: 'Jun 13-Jul 11, 2025',
      location: 'Bali',
      country: 'Indonesia',
      image: '/api/placeholder/300/150'
    },
    {
      id: 6,
      title: 'Festa della Repubblica',
      date: 'Jun 2, 2025',
      location: 'Rome',
      country: 'Italy',
      image: '/api/placeholder/300/150'
    }
  ];

  const getActivityColor = (type) => {
    switch(type) {
      case 'water': return 'bg-cyan-500';
      case 'diving': return 'bg-cyan-600';
      case 'nature': return 'bg-green-800';
      case 'hiking': return 'bg-green-700';
      case 'safari': return 'bg-green-700';
      case 'food': return 'bg-purple-900';
      case 'cultural': return 'bg-rose-400';
      case 'historical': return 'bg-amber-800';
      case 'urban': return 'bg-slate-500';
      case 'wellness': return 'bg-purple-300';
      case 'lifestyle': return 'bg-purple-400';
      case 'adventure': return 'bg-red-700';
      default: return 'bg-gray-500';
    }
  };

  // Mapping for dynamic Palawan sub-location activities
  const palawanActivities = {
    "El Nido": [
      { name: "Hidden Lagoons", type: "water" },
      { name: "Island Hopping", type: "water" },
      { name: "Cliff Diving", type: "adventure" },
      { name: "Snorkeling", type: "water" }
    ],
    "Coron": [
      { name: "Safari Experience", type: "nature" },
      { name: "Island Hopping", type: "water" },
      { name: "Free Diving", type: "diving" },
      { name: "Diving", type: "diving" },
      { name: "Snorkeling", type: "water" },
      { name: "Hiking", type: "hiking" }
    ],
    "Port Barton": [
      { name: "Beach Sunset", type: "water" },
      { name: "Turtle Watching", type: "nature" },
      { name: "Snorkeling", type: "water" }
    ],
    "Puerto Princesa": [
      { name: "Underground River", type: "nature" },
      { name: "Firefly Watching", type: "nature" },
      { name: "Island Hopping", type: "water" },
      { name: "Mangrove Paddling", type: "nature" }
    ]
  };

  // Helper function to check if a location is a sublocation of Palawan
  const isPalawanSublocation = (location) => {
    return ["El Nido", "Coron", "Port Barton", "Puerto Princesa"].includes(location);
  };

  // Helper function to get unique activities from Palawan sublocations
  const getUniquePalawanActivities = () => {
    // This will be used to track unique activities
    const uniqueActivities = new Map();
    
    // Process all sublocation activities
    Object.values(palawanActivities).forEach(activities => {
      activities.forEach(activity => {
        // Use activity name as key to ensure uniqueness
        if (!uniqueActivities.has(activity.name)) {
          uniqueActivities.set(activity.name, activity);
        }
      });
    });
    
    // Convert Map back to array
    return Array.from(uniqueActivities.values());
  };

  const handleCountryClick = (country) => {
    setActiveCountry(country);
    setActiveScreen('country-pod');
    setActiveTab('Highlights');
  };

  const handleLocationClick = (location) => {
    setActiveLocation(location);
    setActiveScreen('location-pod');
    setActiveTab('Highlights');
    // Reset sub-location filter when entering a location pod
    setActiveSubLocation("All");
  };

  const handleBackToCountries = () => {
    setActiveScreen('pods-main');
    setActiveCountry(null);
  };

  const handleBackToCountry = () => {
    setActiveScreen('country-pod');
    setActiveLocation(null);
  };

  // Filter countries based on active continent
  const filteredCountries = countries[activeContinent] || [];
  
  // Get active country data
  const countryData = activeCountry ? 
    filteredCountries.find(country => country.name === activeCountry.name) : 
    null;
  
  // QA forum component that can be reused
  const QAForum = ({ location }) => {
    return (
      <div className="space-y-4">
        {/* Ask a question section */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-medium text-gray-800 mb-3">Ask a Question</h3>
          <div className="flex items-start">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
              <User size={16} className="text-blue-500" />
            </div>
            <div className="flex-1">
              <textarea 
                className="w-full border border-gray-200 rounded-lg p-3 text-sm" 
                rows="2" 
                placeholder={`Ask anything about ${location}...`}
              />
              <div className="flex justify-end mt-2">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm flex items-center">
                  <Send size={16} className="mr-1" />
                  Post Question
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Filter/Sort options */}
        <div className="flex justify-between items-center">
          <div className="text-sm font-medium text-gray-800">
            {qaThreads.length} Questions
          </div>
          <div className="flex space-x-2">
            <select className="bg-gray-100 text-gray-700 text-xs rounded-full px-3 py-1.5 border-none">
              <option>Most Recent</option>
              <option>Most Popular</option>
              <option>Unanswered</option>
            </select>
          </div>
        </div>
        
        {/* Q&A Threads */}
        {qaThreads.map(thread => (
          <div key={thread.id} className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                <span>{thread.user.avatar}</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h4 className="font-medium text-gray-800">{thread.user.name}</h4>
                  <span className="text-xs text-gray-500">{thread.timeAgo}</span>
                </div>
                <p className="text-gray-700 mt-1">{thread.question}</p>
                
                <div className="flex items-center mt-3 space-x-4">
                  <button className="flex items-center text-gray-500 text-sm">
                    <ThumbsUp size={16} className="mr-1" />
                    {thread.upvotes}
                  </button>
                  <button className="flex items-center text-gray-500 text-sm">
                    <MessageCircle size={16} className="mr-1" />
                    {thread.replies.length}
                  </button>
                  <span className="text-xs text-gray-400">{thread.views} views</span>
                </div>
              </div>
            </div>
            
            {/* Replies */}
            {thread.replies.length > 0 && (
              <div className="mt-3 pl-10 space-y-3">
                {thread.replies.map(reply => (
                  <div key={reply.id} className="border-l-2 border-gray-200 pl-3">
                    <div className="flex items-start">
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                        <span className="text-sm">{reply.user.avatar}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h5 className="text-sm font-medium text-gray-800">{reply.user.name}</h5>
                          <span className="text-xs text-gray-500">{reply.timeAgo}</span>
                        </div>
                        <p className="text-sm text-gray-700 mt-1">{reply.content}</p>
                        
                        <div className="flex items-center mt-2">
                          <button className="flex items-center text-gray-500 text-xs">
                            <ThumbsUp size={14} className="mr-1" />
                            {reply.upvotes}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Add reply box */}
                <div className="flex items-start mt-2">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                    <User size={12} className="text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <input 
                      type="text" 
                      className="w-full border border-gray-200 rounded-full px-3 py-1.5 text-sm" 
                      placeholder="Add a reply..." 
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* Reply button if no replies yet */}
            {thread.replies.length === 0 && (
              <div className="ml-10 mt-2">
                <button className="text-blue-500 text-sm flex items-center">
                  <MessageCircle size={14} className="mr-1" />
                  Reply to this question
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };
    
  const renderScreen = () => {
    // SCREEN 1: Main PODS page
    if (activeScreen === 'pods-main') {
      return (
        <div className="pb-20">
          {/* Continent tabs */}
          <div className="px-4 py-5 border-b border-gray-100 sticky top-0 bg-white z-10">
            <div className="mb-4">
              <h1 className="text-2xl font-semibold text-gray-800">Pods</h1>
              <p className="text-sm text-gray-500 mt-1">Discover travel destinations</p>
            </div>
            
            <div className="flex overflow-x-auto hide-scrollbar space-x-3 pb-4">
              {continents.map((continent) => (
                <button
                  key={continent}
                  className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${
                    activeContinent === continent 
                      ? 'bg-blue-300 text-white bg-opacity-80' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() => setActiveContinent(continent)}
                >
                  {continent}
                </button>
              ))}
            </div>
            
            {/* Search bar */}
            <div className="bg-gray-100 rounded-full flex items-center px-4 py-3 mt-3">
              <Search size={18} className="text-gray-400 mr-2" />
              <span className="text-gray-500 text-sm">Search destinations...</span>
            </div>
          </div>
          
          {/* Content section */}
          <div className="p-4">
            <h2 className="font-semibold text-lg text-gray-800 mb-4">{activeContinent} Destinations</h2>
            
            {/* Country grid */}
            <div className="grid grid-cols-2 gap-4">
              {filteredCountries.map((country) => (
                <div 
                  key={country.name} 
                  className="rounded-xl overflow-hidden shadow-sm cursor-pointer"
                  onClick={() => handleCountryClick(country)}
                >
                  <div 
                    className="h-24 flex items-end p-3" 
                    style={{ backgroundColor: country.color, opacity: 0.9 }}
                  >
                    <div className="w-full">
                      <h3 className="text-white font-bold mb-1">{country.name}</h3>
                      <p className="text-white text-sm opacity-90">{country.members} members • {country.posts} posts</p>
                    </div>
                  </div>
                  <div className="bg-white p-3">
                    <div className="flex overflow-x-auto hide-scrollbar space-x-2 py-1">
                      {country.locations.slice(0, 3).map((location) => (
                        <span 
                          key={location.name} 
                          className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full whitespace-nowrap"
                        >
                          {location.name}
                        </span>
                      ))}
                      {country.locations.length > 3 && (
                        <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full whitespace-nowrap">
                          +{country.locations.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Recently Visited section */}
            <h2 className="font-semibold text-lg text-gray-800 mt-8 mb-4">Recently Visited</h2>
            <div className="overflow-x-auto hide-scrollbar">
              <div className="flex space-x-4 py-2">
                <div className="w-32 flex-shrink-0 rounded-lg overflow-hidden shadow-sm">
                  <div className="h-24 bg-blue-500 flex items-center justify-center">
                    <span className="text-white font-bold">Palawan</span>
                  </div>
                  <div className="bg-white p-2">
                    <p className="text-xs text-gray-500">245K members • 28K posts</p>
                  </div>
                </div>
                <div className="w-32 flex-shrink-0 rounded-lg overflow-hidden shadow-sm">
                  <div className="h-24 bg-amber-600 flex items-center justify-center">
                    <span className="text-white font-bold">Bali</span>
                  </div>
                  <div className="bg-white p-2">
                    <p className="text-xs text-gray-500">358K members • 38K posts</p>
                  </div>
                </div>
                <div className="w-32 flex-shrink-0 rounded-lg overflow-hidden shadow-sm">
                  <div className="h-24 bg-green-600 flex items-center justify-center">
                    <span className="text-white font-bold">Bangkok</span>
                  </div>
                  <div className="bg-white p-2">
                    <p className="text-xs text-gray-500">378K members • 39K posts</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Trending Pods */}
            <h2 className="font-semibold text-lg text-gray-800 mt-8 mb-4">Trending Pods</h2>
            <div className="space-y-3">
              <div className="bg-white rounded-xl p-3 shadow-sm flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    <Flag size={18} />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium">Boracay</h3>
                    <p className="text-xs text-gray-500">356K members • 42K posts</p>
                  </div>
                </div>
                <div className="bg-gray-100 px-2 py-1 rounded-md text-xs">
                  Trending
                </div>
              </div>
              <div className="bg-white rounded-xl p-3 shadow-sm flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white">
                    <Flag size={18} />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium">Kyoto</h3>
                    <p className="text-xs text-gray-500">423K members • 45K posts</p>
                  </div>
                </div>
                <div className="bg-gray-100 px-2 py-1 rounded-md text-xs">
                  Hot
                </div>
              </div>
              <div className="bg-white rounded-xl p-3 shadow-sm flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white">
                    <Flag size={18} />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium">Phuket</h3>
                    <p className="text-xs text-gray-500">289K members • 32K posts</p>
                  </div>
                </div>
                <div className="bg-gray-100 px-2 py-1 rounded-md text-xs">
                  Rising
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    // SCREEN 2: Country Pod screen
    else if (activeScreen === 'country-pod' && countryData) {
      // Filter posts by country name
      const countryPosts = allPosts.filter(post => post.countryName === countryData.name);
      
      // Group posts by location for current country
      const groupedPosts = {};
      countryPosts.forEach(post => {
        let group = post.location;
        // For Philippines, group sublocations under "Palawan"
        if (countryData.name === "Philippines" && isPalawanSublocation(post.location)) {
          group = "Palawan";
        }
        if (!groupedPosts[group]) groupedPosts[group] = [];
        groupedPosts[group].push(post);
      });
      
      return (
        <div className="pb-20">
          {/* Header with background color */}
          <div className="relative">
            <div className="h-40 p-4 flex flex-col justify-between" style={{ backgroundColor: countryData.color, opacity: 0.8 }}>
              <div>
                <button 
                  className="p-1 rounded-full bg-white bg-opacity-30 hover:bg-opacity-50 inline-flex items-center mb-4"
                  onClick={handleBackToCountries}
                >
                  <ArrowLeft size={18} className="text-white mr-1" />
                  <span className="text-white text-sm">{activeContinent}</span>
                </button>
                
                <div className="ml-1">
                  <h1 className="text-2xl font-bold text-white">{countryData.name}</h1>
                  <p className="text-sm text-white mt-1">{countryData.members} members • {countryData.posts} posts</p>
                </div>
              </div>
              
              {/* Location pills */}
              <div className="overflow-x-auto hide-scrollbar pb-1">
                <div className="flex space-x-2 ml-1">
                  <span className="px-4 py-1.5 rounded-full text-xs text-white bg-white bg-opacity-30 whitespace-nowrap">
                    All
                  </span>
                  {countryData.locations
                    .filter(location => location.name !== "Coron")
                    .map((location) => (
                    <span 
                      key={location.name}
                      className="px-4 py-1.5 rounded-full text-xs text-white bg-white bg-opacity-20 whitespace-nowrap"
                      onClick={() => handleLocationClick(location)}
                    >
                      {location.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="bg-white sticky top-0 shadow-sm z-10">
            <div className="flex overflow-x-auto hide-scrollbar px-1">
              {['Highlights', 'Explore', 'Q&A', 'Market', 'Events', 'Activities', 'Lost & Found'].map((tab) => (
                <button
                  key={tab}
                  className={`py-4 px-3 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab 
                      ? 'text-blue-500 border-b-2 border-blue-500' 
                      : 'text-gray-500'
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          
          {/* Tab content */}
          <div className="p-4">
            {activeTab === 'Highlights' && (
              <div className="space-y-6">
                {/* Featured section */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="font-medium text-gray-800 mb-3">Must Visit in {countryData.name}</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {countryData.locations.slice(0, 3).map((location) => (
                      <div 
                        key={location.name} 
                        className="rounded-lg overflow-hidden relative cursor-pointer"
                        onClick={() => handleLocationClick(location)}
                      >
                        <div className="h-24 bg-gray-200"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-1 bg-gradient-to-t from-black to-transparent">
                          <span className="text-xs font-medium text-white">{location.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Recent posts grouped by location */}
                <h3 className="font-medium text-gray-800">Recent Posts</h3>
                {Object.keys(groupedPosts).length > 0 ? (
                  Object.keys(groupedPosts).map(group => (
                    <div key={group}>
                      <h4 className="font-medium text-gray-800 mt-4">{group}</h4>
                      {groupedPosts[group].map((post) => (
                        <div key={post.id} className="border border-gray-200 rounded-xl p-4 mb-4">
                          <div className="flex justify-between">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-lg">{post.user.avatar}</span>
                              </div>
                              <div className="ml-3">
                                <p className="font-medium text-gray-800">{post.user.name}</p>
                                <div className="flex items-center">
                                  <span className={`inline-block px-2 py-0.5 text-xs text-white mr-2 rounded-full ${getActivityColor(post.activityType)}`}>
                                    {post.location}
                                  </span>
                                  <span className="text-xs text-gray-500">{post.timeAgo}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <p className="mt-3 text-gray-700">{post.content}</p>
                          
                          <div className="mt-3 rounded-xl overflow-hidden">
                            <img src={post.image} alt="Post" className="w-full h-auto" />
                          </div>
                          
                          <div className="flex justify-between mt-4">
                            <div className="flex space-x-5">
                              <button className="flex items-center text-gray-600">
                                <Heart size={18} className="mr-1" />
                                <span className="text-sm">{post.likes}</span>
                              </button>
                              <button className="flex items-center text-gray-600">
                                <MessageSquare size={18} className="mr-1" />
                                <span className="text-sm">{post.comments}</span>
                              </button>
                            </div>
                            <div className="flex space-x-3">
                              <button className="text-gray-600">
                                <Bookmark size={18} />
                              </button>
                              <button className="text-gray-600">
                                <Share2 size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-500">No posts yet for {countryData.name}.</p>
                    <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg text-sm flex items-center mx-auto">
                      <Plus size={16} className="mr-1" />
                      Create First Post
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'Explore' && (
              <div>
                <div className="grid grid-cols-3 gap-1">
                  {exploreContent.map((item, index) => (
                    <div key={index} className="aspect-square bg-gray-200">
                      <img src={item.image} alt="Explore" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'Q&A' && (
              <QAForum location={countryData.name} />
            )}
            
            {activeTab === 'Market' && (
              <div className="space-y-4">
                {marketListings
                  .filter(listing => listing.country === countryData.name || listing.country === "Multiple")
                  .map((listing) => (
                    <div key={listing.id} className="border border-gray-200 rounded-xl overflow-hidden">
                      <div className="h-32 bg-gray-200">
                        <img src={listing.image} alt={listing.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-3">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium text-gray-800">{listing.title}</h3>
                          <span className="font-bold text-blue-600">{listing.price}</span>
                        </div>
                        <div className="flex items-center mt-1">
                          <MapPin size={14} className="text-gray-400 mr-1" />
                          <span className="text-xs text-gray-500">{listing.location}</span>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-gray-500">{listing.provider}</span>
                          <div className="flex items-center">
                            <span className="text-xs font-medium text-gray-800 mr-1">{listing.rating}</span>
                            <span className="text-xs text-gray-500">({listing.reviews})</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
            
            {activeTab === 'Events' && (
              <div className="space-y-4">
                {events
                  .filter(event => event.country === countryData.name)
                  .map((event) => (
                    <div key={event.id} className="border border-gray-200 rounded-xl overflow-hidden">
                      <div className="h-24 bg-gray-200">
                        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium text-gray-800">{event.title}</h3>
                        <div className="flex items-center mt-1">
                          <Calendar size={14} className="text-gray-400 mr-1" />
                          <span className="text-xs text-gray-500">{event.date}</span>
                        </div>
                        <div className="flex items-center mt-1">
                          <MapPin size={14} className="text-gray-400 mr-1" />
                          <span className="text-xs text-gray-500">{event.location}</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
            
            {activeTab === 'Activities' && (
              <div>
                <div className="grid grid-cols-2 gap-3">
                  {countryData.locations.map((location) => (
                    <div 
                      key={location.name}
                      className="border border-gray-200 rounded-xl p-3"
                      onClick={() => handleLocationClick(location)}
                    >
                      <h3 className="font-medium text-gray-800 mb-2">{location.name}</h3>
                      <p className="text-xs text-gray-500 mb-2">{location.members} members • {location.posts} posts</p>
                      <div className="flex flex-wrap gap-1">
                        {location.activities.map((activity, idx) => (
                          <span 
                            key={idx}
                            className={`text-xs px-2 py-1.5 text-white ${getActivityColor(activity.type)}`}
                          >
                            {activity.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'Lost & Found' && (
              <div className="p-4 text-center">
                <AlertTriangle size={48} className="text-amber-500 mx-auto mb-3" />
                <h3 className="font-medium text-gray-800">Lost & Found</h3>
                <p className="text-sm text-gray-500 mt-2">View items reported lost or found in {countryData.name}</p>
              </div>
            )}
          </div>
        </div>
      );
    }
    
    // SCREEN 3: Location Pod screen
    else if (activeScreen === 'location-pod' && activeLocation) {
      const matchingCountry = Object.values(countries)
        .flat()
        .find(country => 
          country.locations.some(loc => loc.name === activeLocation.name)
        );
        
      return (
        <div className="pb-20">
          {/* Header with background color */}
          <div className="relative">
            <div 
              className="h-40 p-4" 
              style={{ 
                backgroundColor: activeLocation.color || '#4285f4', 
                opacity: 0.8 
              }}
            >
              <div className="flex items-center mt-2">
                <button 
                  className="p-1 mr-2 rounded-full bg-white bg-opacity-30 hover:bg-opacity-50"
                  onClick={handleBackToCountry}
                >
                  <ArrowLeft size={20} className="text-white" />
                </button>
                <div className="text-sm text-white opacity-90">
                  {activeContinent} &gt; {matchingCountry?.name}
                </div>
              </div>
              
              <h1 className="text-2xl font-bold text-white mt-3">{activeLocation.name}</h1>
              <p className="text-white opacity-90">
                {activeLocation.members} members • {activeLocation.posts} posts
              </p>
              
              {/* Activity pills - sharp edges for activities */}
              <div className="absolute bottom-0 left-0 right-0 overflow-x-auto hide-scrollbar px-4 pb-2 pt-2">
                <div className="flex space-x-1">
                  {activeLocation.name === "Palawan" ? (
                    // For Palawan, show filtered activities based on sub-location
                    (activeSubLocation === "All" 
                      ? getUniquePalawanActivities() 
                      : palawanActivities[activeSubLocation] || []
                    ).map((activity, idx) => (
                      <span 
                        key={idx}
                        className={`px-2 py-0.5 text-xs font-light text-white whitespace-nowrap ${getActivityColor(activity.type)}`}
                      >
                        {activity.name}
                      </span>
                    ))
                  ) : (
                    // For other locations, display their specific activities
                    activeLocation.activities.map((activity, idx) => (
                      <span 
                        key={idx}
                        className={`px-2 py-0.5 text-xs font-light text-white whitespace-nowrap ${getActivityColor(activity.type)}`}
                      >
                        {activity.name}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sub-location filter pills for Palawan */}
          {activeLocation.name === "Palawan" && (
            <div className="overflow-x-auto hide-scrollbar pb-1 mt-2 px-4">
              <div className="flex space-x-2">
                {["All", "El Nido", "Coron", "Port Barton", "Puerto Princesa"].map(filter => (
                  <span 
                    key={filter}
                    className={`cursor-pointer px-4 py-1.5 rounded-full text-xs whitespace-nowrap ${activeSubLocation === filter ? "bg-gray-600 text-white" : "bg-gray-200 text-gray-700"}`}
                    onClick={() => setActiveSubLocation(filter)}
                  >
                    {filter}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Tabs */}
          <div className="bg-white sticky top-0 shadow-sm z-10">
            <div className="flex overflow-x-auto hide-scrollbar px-1">
              {['Highlights', 'Explore', 'Q&A', 'Market', 'Events', 'Lost & Found'].map((tab) => (
                <button
                  key={tab}
                  className={`py-4 px-3 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab 
                      ? 'text-blue-500 border-b-2 border-blue-500' 
                      : 'text-gray-500'
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          
          {/* Content - simplified version with just the Highlights tab filled */}
          <div className="p-4">
            {activeTab === 'Highlights' && (
              <div className="space-y-6">
                {/* Quick info */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="font-medium text-gray-800 mb-2">About {activeLocation.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {activeLocation.name} is known for its {activeLocation.activities.map(a => a.name).join(', ')}.
                    One of the most beautiful destinations in {matchingCountry?.name}.
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white p-2 rounded-lg">
                      <h4 className="text-xs font-medium text-gray-500">Best time to visit</h4>
                      <p className="text-sm">November - May</p>
                    </div>
                    <div className="bg-white p-2 rounded-lg">
                      <h4 className="text-xs font-medium text-gray-500">Known for</h4>
                      <p className="text-sm">{activeLocation.activities[0].name}</p>
                    </div>
                  </div>
                </div>
                
                {/* Location-specific posts - Improved Filtering Logic */}
                <h3 className="font-medium text-gray-800">Recent Posts</h3>
                {allPosts
                  .filter(post => {
                    // Match posts with the correct country first
                    if (matchingCountry && post.countryName !== matchingCountry.name) {
                      return false;
                    }
                    
                    // Handle Palawan location separately
                    if (activeLocation.name === "Palawan") {
                      // For Palawan location, show posts from Palawan sublocations
                      if (activeSubLocation === "All") {
                        return isPalawanSublocation(post.location);
                      }
                      return post.location === activeSubLocation;
                    } else if (isPalawanSublocation(activeLocation.name)) {
                      // For Palawan sublocations like Coron, El Nido, etc.
                      return post.location === activeLocation.name;
                    } else {
                      // For other locations (Cebu, Bohol, etc.), only show posts specific to them
                      return post.location === activeLocation.name;
                    }
                  })
                  .map((post) => (
                    <div key={post.id} className="border border-gray-200 rounded-xl p-4 mb-4">
                      <div className="flex justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-lg">{post.user.avatar}</span>
                          </div>
                          <div className="ml-3">
                            <p className="font-medium text-gray-800">{post.user.name}</p>
                            <div className="flex items-center">
                              <span className={`inline-block px-2 py-0.5 text-xs text-white mr-2 rounded-full ${getActivityColor(post.activityType)}`}>
                                {post.location}
                              </span>
                              <span className="text-xs text-gray-500">{post.timeAgo}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <p className="mt-3 text-gray-700">{post.content}</p>
                      
                      <div className="mt-3 rounded-xl overflow-hidden">
                        <img src={post.image} alt="Post" className="w-full h-auto" />
                      </div>
                      
                      <div className="flex justify-between mt-4">
                        <div className="flex space-x-5">
                          <button className="flex items-center text-gray-600">
                            <Heart size={18} className="mr-1" />
                            <span className="text-sm">{post.likes}</span>
                          </button>
                          <button className="flex items-center text-gray-600">
                            <MessageSquare size={18} className="mr-1" />
                            <span className="text-sm">{post.comments}</span>
                          </button>
                        </div>
                        <div className="flex space-x-3">
                          <button className="text-gray-600">
                            <Bookmark size={18} />
                          </button>
                          <button className="text-gray-600">
                            <Share2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                
                {/* If no matching posts, show an empty state */}
                {allPosts.filter(post => {
                  if (matchingCountry && post.countryName !== matchingCountry.name) {
                    return false;
                  }
                  
                  if (activeLocation.name === "Palawan") {
                    if (activeSubLocation === "All") {
                      return isPalawanSublocation(post.location);
                    }
                    return post.location === activeSubLocation;
                  } else if (isPalawanSublocation(activeLocation.name)) {
                    return post.location === activeLocation.name;
                  } else {
                    return post.location === activeLocation.name;
                  }
                }).length === 0 && (
                  <div className="text-center py-6">
                    <p className="text-gray-500">No posts for this location yet.</p>
                    <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg text-sm flex items-center mx-auto">
                      <Plus size={16} className="mr-1" />
                      Create First Post
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'Explore' && (
              <div>
                <div className="grid grid-cols-3 gap-1">
                  {exploreContent.map((item, index) => (
                    <div key={index} className="aspect-square bg-gray-200">
                      <img src={item.image} alt="Explore" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'Q&A' && (
              <QAForum location={activeLocation.name} />
            )}
            
            {activeTab === 'Market' && (
              <div className="space-y-4">
                {marketListings
                  .filter(listing => {
                    if (activeLocation.name === "Palawan") {
                      if (activeSubLocation === "All") {
                        return (listing.country === matchingCountry?.name && 
                                isPalawanSublocation(listing.location)) || 
                                listing.location === "Multiple Locations";
                      }
                      return listing.location === activeSubLocation || 
                            listing.location === "Multiple Locations";
                    } else {
                      return listing.location === activeLocation.name || 
                            listing.location === "Multiple Locations";
                    }
                  })
                  .map((listing) => (
                    <div key={listing.id} className="border border-gray-200 rounded-xl overflow-hidden">
                      <div className="h-32 bg-gray-200">
                        <img src={listing.image} alt={listing.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-3">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium text-gray-800">{listing.title}</h3>
                          <span className="font-bold text-blue-600">{listing.price}</span>
                        </div>
                        <div className="flex items-center mt-1">
                          <MapPin size={14} className="text-gray-400 mr-1" />
                          <span className="text-xs text-gray-500">{listing.location}</span>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-gray-500">{listing.provider}</span>
                          <div className="flex items-center">
                            <span className="text-xs font-medium text-gray-800 mr-1">{listing.rating}</span>
                            <span className="text-xs text-gray-500">({listing.reviews})</span>
                          </div>
                        </div>
                      </div>
                    </div>
                ))}
                
                {marketListings.filter(listing => {
                  if (activeLocation.name === "Palawan") {
                    if (activeSubLocation === "All") {
                      return (listing.country === matchingCountry?.name && 
                              isPalawanSublocation(listing.location)) || 
                              listing.location === "Multiple Locations";
                    }
                    return listing.location === activeSubLocation || 
                          listing.location === "Multiple Locations";
                  } else {
                    return listing.location === activeLocation.name || 
                          listing.location === "Multiple Locations";
                  }
                }).length === 0 && (
                  <div className="text-center py-6">
                    <p className="text-gray-500">No listings for this location yet.</p>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'Events' && (
              <div className="space-y-4">
                {events
                  .filter(event => {
                    if (activeLocation.name === "Palawan") {
                      if (activeSubLocation === "All") {
                        return event.country === matchingCountry?.name && 
                              isPalawanSublocation(event.location);
                      }
                      return event.location === activeSubLocation;
                    } else {
                      return event.location === activeLocation.name;
                    }
                  })
                  .map((event) => (
                    <div key={event.id} className="border border-gray-200 rounded-xl overflow-hidden">
                      <div className="h-24 bg-gray-200">
                        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium text-gray-800">{event.title}</h3>
                        <div className="flex items-center mt-1">
                          <Calendar size={14} className="text-gray-400 mr-1" />
                          <span className="text-xs text-gray-500">{event.date}</span>
                        </div>
                        <div className="flex items-center mt-1">
                          <MapPin size={14} className="text-gray-400 mr-1" />
                          <span className="text-xs text-gray-500">{event.location}</span>
                        </div>
                      </div>
                    </div>
                ))}
                
                {events.filter(event => {
                  if (activeLocation.name === "Palawan") {
                    if (activeSubLocation === "All") {
                      return event.country === matchingCountry?.name && 
                            isPalawanSublocation(event.location);
                    }
                    return event.location === activeSubLocation;
                  } else {
                    return event.location === activeLocation.name;
                  }
                }).length === 0 && (
                  <div className="text-center py-6">
                    <p className="text-gray-500">No events for this location yet.</p>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'Lost & Found' && (
              <div className="p-4 text-center">
                <AlertTriangle size={48} className="text-amber-500 mx-auto mb-3" />
                <h3 className="font-medium text-gray-800">Lost & Found</h3>
                <p className="text-sm text-gray-500 mt-2">View items reported lost or found in {activeLocation.name}</p>
              </div>
            )}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="font-sans bg-gray-50 min-h-screen">
      <div className="max-w-lg mx-auto bg-white shadow-sm min-h-screen">
        {renderScreen()}
        
        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-3 max-w-lg mx-auto">
          <button className="flex flex-col items-center">
            <Compass size={20} className="text-gray-400" />
            <span className="text-xs text-gray-500 mt-1">Explore</span>
          </button>
          <button className="flex flex-col items-center">
            <Grid size={20} className="text-blue-500" />
            <span className="text-xs text-blue-500 mt-1">Pods</span>
          </button>
          <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center -mt-6 shadow-md">
            <Plus size={24} className="text-white" />
          </div>
          <button className="flex flex-col items-center">
            <ShoppingBag size={20} className="text-gray-400" />
            <span className="text-xs text-gray-500 mt-1">Market</span>
          </button>
          <button className="flex flex-col items-center">
            <User size={20} className="text-gray-400" />
            <span className="text-xs text-gray-500 mt-1">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}

const BlinxusAppWrapper = () => {
  return (
    <div className="w-full max-w-md mx-auto">
      <BlinxusApp />
    </div>
  );
};

export default BlinxusAppWrapper;
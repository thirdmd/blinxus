# BLINXUS MVP PROJECT CONTEXT

## Project Overview
Blinxus is a centralized travel directory designed to organize travel content into immersive, location-tagged, community-driven stories. It is not just a social app — it is a structured, gamified, and collaborative platform for travelers, powered by tools for discovering places, saving ideas, planning trips, and co-creating experiences. Its mission is to reimagine how people access and share travel — transforming fragmented travel data into an organized, intuitive, and interactive system.

**Current MVP Focus:** Blinxus MVP is a lean but powerful foundation focused on:
- Basic social networking features: sign-up/authentication, post creation, explore feed, profile, and Pods
- Three-screen architecture: Explore (home feed), Pods (location-based communities), and Profile
- Users can post Regular posts (text, or photo + text) tagged with a specific location and activity color-coded category
- Lucids: Blinxus' signature immersive storytelling format — structured, chronological travel albums
- Users can save posts into their Library, which auto-sorts all saved content by activity and location

## App Logic & UX Flow
**Blinxus = Instagram + Reddit + Facebook + X — but built only for Travel**

### Navigation Flow:
1. App Launch → Splash Screen → Login/Signup Screen
2. Includes "Explore as Guest" (to reduce entry friction)
3. Lands straight to Explore Page

### Three Main Screens:
1. **Explore Page (Menu Tab 1/3)** - Homepage showing all post cards (like instagram homepage):
   - Regular Posts (Text / Text + Image)
   - Lucids (immersive albums)
   - Blinxs (12-hour ephemeral back-camera stories - location-based, not user-based) - located in a horizontal scroll bar on the upper portion of the screen like in instagram  

2. **Pods (Menu Tab 2/3)** - Centralized location-based communities
   - Hierarchy: Continent > Country > City > Sub-location
   - Top Tabs: Highlights, Explore, Q&A, Events, Activities, Lost & Found

3. **Profile (Menu Tab 3/3)** - User profile with swipeable tabs for Posts/Lucids

## Features

### MVP Features:
- Full authentication system (email, phone, Gmail, Facebook, Apple + Guest mode)
- Post creation with required location + activity tagging
- Color-coded activity system (12 categories)
- Library system for saved posts (auto-organized by activity and location)
- Floating Create Button (FAB)
- Top-right menu in Profile (Settings, Account Info, Help & Support, Library)

### Post Types:
1. **Regular Posts**: Image + Text (Required: Location + Image, Activity tag optional)
2. **Lucids**: Structured travel albums grouped by Day → Moments

### Color Code System (Activity Tagging):
    adventure: '#D30000',       // Specific Red - exact red shade requested
    attractions: '#FF6F61',     // Electric Coral - keep this one
    cultural: '#D2691E',        // Chocolate/Saddle Brown - warm brown, distinct from historical
    culinary: '#800020',        // Burgundy - DEEP burgundy wine color
    historical: '#8B4513',      // Saddle Brown - OBVIOUSLY brown now
    mountains: '#228B22',       // Forest Green - OBVIOUSLY green now
    special: '#FFD700',         // Gold - keep this one
    stays: '#0047AB',           // Cobalt Blue - using the main cobalt color
    urban: '#708090',           // Slate Blue - keep this one
    water: '#00BCD4',           // Cyan Blue - keep this one
    wellness: '#9370DB',        // Medium
    
### Future Features:
- Fully featured Pods with expanded tabs
- Marketplace with its own menu tab
- Chat and Collaborative Libraries
- AI Integration for contextual travel assistant
- SpaceView Mapping System
- Nimbus Cloud Collaboration for Travel Planning

## Technical Specifications

### Tech Stack:
- **React Native** (with Expo)
- **Nativewind** (Tailwind for React Native)
- **Zustand** (State management)
- **React Navigation**
- **Firebase Auth** (for login/sign up)
- **Firebase Firestore** (for user data)
- **Firebase Storage** (for future post uploads)
- **Firebase Functions** (for backend logic)

### 🔁 PROJECT FILE STRUCTURE
```
/src
├── assets/
│   └── (images, logos, fonts, icons)
│
├── components/
│   ├── Button.tsx
│   └── PillTag.tsx
│
├── constants/
│   ├── colors.ts
│   ├── activityTags.ts
│   └── index.ts
│
├── navigation/
│   ├── AppNavigator.tsx
│   ├── BottomTabs.tsx
│   └── AuthNavigator.tsx
│
├── screens/
│   ├── Auth/
│   │   ├── LoginScreen.tsx
│   │   ├── SignupMethodSelect.tsx
│   │   ├── SignupEmailPhoneForm.tsx
│   │   └── SignupOptions.tsx
│   │
│   ├── Explore/
│   │   └── ExploreScreen.tsx
│   │
│   ├── Pods/
│   │   ├── PodsMain.tsx
│   │   ├── PodLocations.tsx
│   │   ├── PodsSearch.tsx
│   │   └── PodsStructure.tsx
│   │
│   ├── Profile/
│   │   ├── ProfileScreen.tsx
│   │   ├── FriendsList.tsx
│   │   ├── SettingsScreen.tsx
│   │   ├── AccountInfoScreen.tsx
│   │   ├── HelpSupportScreen.tsx
│   │   └── LibraryScreen.tsx
│   │
│   ├── Create/
│   │   ├── CreatePost.tsx
│   │   ├── CreateLucids.tsx
│   │   ├── CreateBlinx.tsx
│   │   └── CreateRegularPost.tsx
│
├── store/
│   ├── useUserStore.ts
│   ├── useAuthStore.ts
│   └── index.ts
│
├── utils/
│   ├── firebaseConfig.ts
│   ├── authHelpers.ts
│   └── index.ts
│
├── types/
│   ├── structures/
│   │   ├── all_post_structure.ts
│   │   ├── blinx_structure.ts
│   │   └── lucids_profileview_structure.ts
│   │
│   ├── userData/
│   │   ├── blinx_data.ts
│   │   ├── create_lucids_data.ts
│   │   ├── create_post_data.ts
│   │   ├── create_profile_data.ts
│   │   └── merchants_data.ts (not included in MVP)
│   │
│   └── index.ts
│
├── App.tsx
└── main.ts
```

### Required Screen Files:
- `ExploreScreen.tsx` (Tab 1/3)
- `PodsMain.tsx` (Tab 2/3)
- `ProfileScreen.tsx` (Tab 3/3)
- `SettingsScreen.tsx`
- `AccountInfoScreen.tsx`
- `HelpSupportScreen.tsx`
- `LibraryScreen.tsx`
- `CreatePost.tsx`

## MVP Checklist Requirements

### ✅ BLINXUS MVP CHECKLIST:

1. **Splash Screen**
   - Basic Blinxus splash with app name/logo
   - Auto-transition to login screen after timeout

2. **Login/Signup Screen (Fully Functional with Firebase Auth)**
   - Login with Email + Password
   - Login with Phone Number
   - Login with Gmail, Facebook, Apple
   - "Explore as Guest" button (no auth required)

3. **Bottom Tab Menu Navigation**
   - Explore, Pods, Profile tabs
   - All screens accessible and properly linked

4. **Top-Right Menu inside Profile Screen**
   - Settings & Privacy → SettingsScreen.tsx
   - Account Info → AccountInfoScreen.tsx
   - Help & Support → HelpSupportScreen.tsx
   - Library (Saved Posts) → LibraryScreen.tsx

5. **Floating Create Button (FAB)**
   - Circular button in bottom right
   - Disappears on scroll down, reappears on scroll up
   - Navigates to CreatePost.tsx

## Design/UI Requirements
- Culture-first design focused on travel photography and experience sharing
- Clean, modern interface
- Color-coded activity system throughout the app
- Auto-sorting system logic (users don't organize manually)
- Fast launch priority with iteration after MVP

## BLINXUS DESIGN CONCEPT (PSYCHOLOGY-DRIVEN, SOFT-INTERFACE EDITION)
Modern. Minimal. Structured by memory. Designed for clarity. Feels like emotion.

### 🧠 PHILOSOPHY OF DESIGN
We are not building a UI.
We are designing a sensory experience.
Blinxus is a spatial memory engine. A place where moments are revisited and experiences are structured intuitively — by place, activity, and sequence. Everything you touch should feel like memory. Every screen should behave like emotion. Every animation, label, and layout should serve psychological clarity.
This is cognitive design. Visual storytelling. Emotional UX.

### 🎯 CORE PRINCIPLES (HUMAN-FIRST MINIMALISM)
1. Structure mirrors memory — organized by location, activity, and flow 
2. Interface = invisible — users should feel what to do, not think 
3. Soft and smooth always — nothing sharp, jarring, or mechanical 
4. Design for recall, not search — tap into how humans remember 
5. Remove friction, preserve intention — every tap should feel meaningful 

### 🎨 VISUAL SYSTEM
* **Color** 
    * Background: Pure white or light gray 
    * Accents: Cobalt Blue (#0047AB) 
    * All colors muted, clean, non-aggressive  
* **Typography** 
    * Rounded geometric sans (e.g. Inter, SF Pro Rounded, Manrope) 
    * Large enough to scan, soft on the eyes 
    * Hierarchical: Titles = semi-bold, Body = regular, Labels = light 
* **Corners & Cards** 
    * Soft radius: 20–28px on all elements 
    * Cards float subtly (shadow opacity < 10%) 
    * No hard borders, just subtle elevation and background shift 
* **Icons** 
    * Thin line-based icons 
    * Metaphorical and universal (no novelty icons) 
    * Always secondary to text unless universally understood 

### 🌀 MOTION + FEEDBACK
* Transition Timing: 200–350ms, all easing should be easeInOut or soft spring 
* FAB Behavior: fades + scales in on scroll up, hides on scroll down 
* Menu Behavior: slides up gently with blurred background 
* Interaction Feedback: micro-glow, soft pulse, gentle haptic (where applicable) 
* No bounce. No pop. Only fluidity. 

### 🧠 COGNITIVE & PSYCHOLOGICAL FRAMEWORKS
* Hick's Law → Limit options per screen to reduce decision fatigue 
* Fitts's Law → All tap targets should be large, reachable by thumb 
* Von Restorff Effect → Use one strong highlight per screen to draw attention 
* Serial Position Effect → Prioritize actions at the top or bottom of flows 
* Peak-End Rule → Design Lucids and trips to end with emotional peaks 
All UX flows should reduce memory effort, and promote emotional clarity.

### 📐 LAYOUT LOGIC
* Z-shaped scan pattern 
* Strong left alignment, center-aligned titles 
* Content is spaced generously — we let screens breathe 
* Never cluttered. Never dense. No more than one idea per screen 

### 📲 COMPONENT GUIDELINES
**Buttons**
* Rounded pill shapes 
* Text-first (not icon-only) unless symbol is universal 
* Active state = soft shadow + color shift 

**Pill Tags**
* Color-coded activity system 
* Rounded, no border, soft fill 
* Tappable and used consistently in Explore, Pods, and Saved 

**FAB (Floating Action Button)**
* Circular, 64x64 
* Cobalt background, white "+" 
* Soft drop shadow 
* Floating just above bottom right corner, visible at rest 

**Modals / Bottom Sheets**
* Rounded top corners 
* Slide-up with fade-in 
* Blurred background for focus 

### 🔧 BEHAVIORAL STRATEGY
* Curiosity Triggers → blurred previews, thumbnail Lucids, "Top Places" carousels 
* Completion Motivation → track Lucid progress subtly, suggest "what's next" 
* Safe Creation → gentle onboarding, zero-pressure draft saving 
* Auto-organization → content files itself (no hashtags, no stress) 

### 💬 TONE OF VOICE (IN UI COPY)
* Conversational, light, supportive 
* "Let's add this to your journey" instead of "Upload post" 
* "Explore quietly" instead of "Continue without login" 
* Warmth and clarity in every phrase 

### 🌊 WHAT THE INTERFACE SHOULD FEEL LIKE
* Calm, breathable, like flipping through a travel journal 
* Soft as paper, smooth as memory 
* UI that's always beneath the experience — never shouting over it 

### ✅ BLINXUS DESIGN CHECKLIST (PSYCHOLOGICAL + VISUAL)
* Does this screen feel emotionally quiet? 
* Can a user instinctively understand what to do next? 
* Are all actions easy to reach and visually prioritized? 
* Does the screen feel like a memory — not just a layout? 
* Are all visual elements rounded, soft, and non-aggressive? 
* Could this design be printed as a beautiful minimalist album? 

### 🔥 FINAL NOTE
Blinxus is a new paradigm for travel. Not chaotic. Not social. Not cluttered.
It's a structured emotional system — for reliving, planning, and discovering travel experiences in the way humans actually think and remember.
Design for memory. Design for emotion. Design for clarity. Design softly.

## Additional Notes
- Every post must include: location + activity tag (color-coded)
- No user-created groups - Pods are centralized and official
- Focus on structured, relevant content (no viral content chaos)
- All main pages should be working navigational stubs initially
- Fast launch is priority, iteration comes after MVP release

---

**Instructions for use:**
1. This file contains the complete Blinxus MVP context and requirements
2. Reference this file when generating any code for the project
3. Update this file if requirements change during development 
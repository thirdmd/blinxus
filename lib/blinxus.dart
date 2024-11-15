import 'package:flutter/material.dart';
import 'dart:async';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:scrollable_positioned_list/scrollable_positioned_list.dart';
import 'login_screen.dart'; // Import this if needed

// All your classes and widgets go here

class BlinxusApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Blinxus',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        visualDensity: VisualDensity.adaptivePlatformDensity,
        scaffoldBackgroundColor: Colors.grey.shade100,
        fontFamily: 'Roboto',
        textTheme: TextTheme(
          bodyMedium: TextStyle(
            color: Colors.black87,
            fontSize: 15, // Adjusted body text size
          ),
        ),
        appBarTheme: AppBarTheme(
          backgroundColor: Colors.white,
          elevation: 1,
          iconTheme: IconThemeData(color: Colors.black),
          titleTextStyle: TextStyle(
            color: Colors.black87,
            fontSize: 22, // Adjusted title font size
            fontWeight: FontWeight.bold,
          ),
          centerTitle: true,
        ),
        bottomNavigationBarTheme: BottomNavigationBarThemeData(
          backgroundColor: Colors.white,
          selectedItemColor: Color(0xFF92478A),
          unselectedItemColor: Colors.grey.shade600,
          type: BottomNavigationBarType.fixed,
          elevation: 5,
          selectedLabelStyle: TextStyle(
            fontWeight: FontWeight.w400,
          ),
          unselectedLabelStyle: TextStyle(
            fontWeight: FontWeight.w400,
          ),
        ),
      ),
      home: SplashScreen(),
    );
  }
}

class SplashScreen extends StatefulWidget {
  @override
  _SplashScreenState createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: Duration(seconds: 2),
      vsync: this,
    );
    _animation =
        CurvedAnimation(parent: _controller, curve: Curves.easeInOut);

    _controller.forward().whenComplete(() {
      Future.delayed(Duration(seconds: 1), () {
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (context) => BlinxusPage()),
        );
      });
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Center(
        child: FadeTransition(
          opacity: _animation,
          child: Image.asset(
            'assets/images/blinxus_logo.png',
            width: 110,
            height: 110,
          ),
        ),
      ),
    );
  }
}

class Post {
  final String imagePath;
  final String profileImagePath;
  final String name;
  final String username;
  final String content;
  final DateTime date;
  final List<String> tags;

  Post({
    required this.imagePath,
    required this.profileImagePath,
    required this.name,
    required this.username,
    required this.content,
    required this.date,
    required this.tags,
  });
}

final List<String> places = [
  'Anilao',
  'Bohol',
  'Boracay',
  'Cebu',
  'Coron',
  'Davao',
  'El Nido',
  'La Union',
  'Siargao',
  'Zambales',
  'Pangasinan',
  'Baguio',
  'Sagada',
  'Tagaytay',
  'Batangas',
  'Bicol',
  'Ilocos',
  'Subic',
  'Camiguin',
  'Batanes',
  'Rizal'
];

List<Post> allPosts = [
  Post(
    imagePath: '',
    profileImagePath: 'assets/images/lem.png',
    name: 'Lem Antonio',
    username: '@sprtn_lem',
    content: 'I love Bohol',
    date: DateTime.now().subtract(Duration(minutes: 6)),
    tags: [],
  ),
  Post(
    imagePath: '',
    profileImagePath: 'assets/images/pj.png',
    name: 'PJ Reyes',
    username: '@pj_reyes',
    content: 'I love Boracay',
    date: DateTime.now().subtract(Duration(hours: 18)),
    tags: [],
  ),
  // Dr. Third Camacho's posts
  Post(
    imagePath: '',
    profileImagePath: 'assets/images/3rd.png',
    name: 'Dr. Third Camacho',
    username: '@3rd',
    content: 'Enjoying the beach',
    date: DateTime(2024, 10, 4),
    tags: [],
  ),
  Post(
    imagePath: 'assets/images/Media.PNG',
    profileImagePath: 'assets/images/3rd.png',
    name: 'Dr. Third Camacho',
    username: '@3rd',
    content: 'Solid dito sa Boracay',
    date: DateTime(2024, 10, 5),
    tags: [],
  ),
  Post(
    imagePath: 'assets/images/surfing.png',
    profileImagePath: 'assets/images/3rd.png',
    name: 'Dr. Third Camacho',
    username: '@3rd',
    content: 'Surfing in Siargao 🏄🏾‍♂️',
    date: DateTime(2024, 10, 6),
    tags: [],
  ),
  Post(
    imagePath: 'assets/images/coron.png',
    profileImagePath: 'assets/images/3rd.png',
    name: 'Dr. Third Camacho',
    username: '@3rd',
    content: 'Island Hopping in Coron 🏖️',
    date: DateTime(2024, 10, 7),
    tags: [],
  ),
];

void initializeTags() {
  for (var post in allPosts) {
    post.tags.clear();
    for (var place in places) {
      if (RegExp(r'\b' + place + r'\b', caseSensitive: false)
          .hasMatch(post.content)) {
        post.tags.add(place);
      }
    }
  }
}

class BlinxusPage extends StatefulWidget {
  @override
  _BlinxusPageState createState() => _BlinxusPageState();
}

class _BlinxusPageState extends State<BlinxusPage> {
  int _selectedIndex = 0;

  final List<String> _titles = [
    'Explore',
    'Market',
    'Create',
    'Spaceview',
    'Profile',
  ];

  final List<GlobalKey<NavigatorState>> _navigatorKeys = List.generate(
    5,
        (index) => GlobalKey<NavigatorState>(),
  );

  void _onItemTapped(int index) {
    if (_selectedIndex == index) {
      _navigatorKeys[index].currentState!.popUntil((route) => route.isFirst);
    } else {
      setState(() {
        _selectedIndex = index;
      });
    }
  }

  Future<bool> _onWillPop() async {
    final isFirstRouteInCurrentTab =
    !await _navigatorKeys[_selectedIndex].currentState!.maybePop();
    if (isFirstRouteInCurrentTab) {
      if (_selectedIndex != 0) {
        setState(() {
          _selectedIndex = 0;
        });
        return false;
      }
    }
    return isFirstRouteInCurrentTab;
  }

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: _onWillPop,
      child: Scaffold(
        appBar: AppBar(
          automaticallyImplyLeading: false,
          backgroundColor: Colors.white,
          elevation: 1,
          leading: Padding(
            padding: const EdgeInsets.only(left: 12.0),
            child: Image.asset(
              'assets/images/blinxus_logo.png',
              height: 90,
            ),
          ),
          actions: [
            // Notifications icon
            IconButton(
              icon: FaIcon(
                FontAwesomeIcons.bell,
                color: Colors.grey.shade700,
                size: 18,
              ),
              onPressed: () {},
            ),
            // Chat icon
            IconButton(
              icon: FaIcon(
                FontAwesomeIcons.comments,
                color: Colors.grey.shade700,
                size: 18,
              ),
              onPressed: () {
                _navigatorKeys[_selectedIndex].currentState!.push(
                  MaterialPageRoute(
                    builder: (context) => ChatPage(),
                  ),
                );
              },
            ),
          ],
        ),
        body: IndexedStack(
          index: _selectedIndex,
          children: [
            _buildTabNavigator(0, ExplorePage()),
            _buildTabNavigator(1, MarketPage()),
            _buildTabNavigator(2, CreatePage()),
            _buildTabNavigator(3, SpaceviewPage()),
            _buildTabNavigator(4, ProfilePage()),
          ],
        ),
        bottomNavigationBar: BottomNavigationBar(
          items: [
            BottomNavigationBarItem(
              icon: Icon(Icons.explore_rounded),
              label: 'Explore',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.store_mall_directory_rounded),
              label: 'Market',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.add_circle, size: 40),
              label: 'Create',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.map_rounded),
              label: 'Spaceview',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.account_circle_rounded),
              label: 'Profile',
            ),
          ],
          currentIndex: _selectedIndex,
          selectedItemColor: Color(0xFF92478A),
          unselectedItemColor: Colors.grey.shade600,
          backgroundColor: Colors.white,
          showSelectedLabels: true,
          showUnselectedLabels: false,
          iconSize: 25,
          onTap: _onItemTapped,
          selectedIconTheme: IconThemeData(size: 28),
          unselectedIconTheme: IconThemeData(size: 25),
        ),
      ),
    );
  }

  Widget _buildTabNavigator(int index, Widget child) {
    return Navigator(
      key: _navigatorKeys[index],
      onGenerateRoute: (RouteSettings settings) {
        return MaterialPageRoute(builder: (context) => child);
      },
    );
  }
}

// TextStyle constants for consistency
const TextStyle kPostNameTextStyle = TextStyle(
  fontSize: 16,
  fontWeight: FontWeight.bold,
  color: Colors.black87,
);

const TextStyle kPostUsernameTimeTextStyle = TextStyle(
  fontSize: 14,
  color: Colors.grey,
);

const TextStyle kPostContentTextStyle = TextStyle(
  fontSize: 15,
  color: Colors.black87,
  height: 1.5,
);

// PostWidget class
class PostWidget extends StatelessWidget {
  final Post post;

  PostWidget({required this.post});

  String _formatTimeAgo(DateTime date) {
    final Duration difference = DateTime.now().difference(date);
    if (difference.inMinutes < 60) {
      return '${difference.inMinutes} minutes ago';
    } else if (difference.inHours < 24) {
      return '${difference.inHours} hours ago';
    } else {
      return '${difference.inDays} days ago';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      margin:
      EdgeInsets.symmetric(vertical: 6.0, horizontal: 12.0), // Reduced margins
      padding: EdgeInsets.all(12.0), // Reduced padding
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16), // Adjusted border radius
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 6,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Profile Information
          Row(
            children: [
              CircleAvatar(
                backgroundImage: AssetImage(post.profileImagePath),
                radius: 24,
              ),
              SizedBox(width: 8),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Text(
                          post.name,
                          style: kPostNameTextStyle,
                        ),
                        if (post.name == 'Dr. Third Camacho') ...[
                          SizedBox(width: 4),
                          Image.asset(
                            'assets/images/blinxus_founder.png',
                            height: 18,
                            width: 18,
                          ),
                        ],
                      ],
                    ),
                    Text(
                      '${post.username} • ${_formatTimeAgo(post.date)}',
                      style: kPostUsernameTimeTextStyle,
                    ),
                  ],
                ),
              ),
            ],
          ),
          SizedBox(height: 8),
          // Content Text
          if (post.content.isNotEmpty)
            Padding(
              padding: const EdgeInsets.only(bottom: 4),
              child: Text(
                post.content,
                style: kPostContentTextStyle,
              ),
            ),
          // Optional Image
          if (post.imagePath.isNotEmpty)
            SizedBox(
              height: 8,
            ),
          if (post.imagePath.isNotEmpty)
            GestureDetector(
              onTap: () {
                // Navigate to FullScreenImagePage
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => FullScreenImagePage(
                      imagePath: post.imagePath,
                    ),
                  ),
                );
              },
              child: ClipRRect(
                borderRadius: BorderRadius.circular(12),
                child: Image.asset(
                  post.imagePath,
                  fit: BoxFit.cover,
                  width: double.infinity,
                  height: 180,
                ),
              ),
            ),
          SizedBox(height: 8),
          // Action Buttons (Like, Comment, Share)
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              IconButton(
                icon: FaIcon(
                  FontAwesomeIcons.heart,
                  color: Colors.grey.shade700,
                  size: 20,
                ),
                onPressed: () {},
              ),
              IconButton(
                icon: FaIcon(
                  FontAwesomeIcons.commentDots,
                  color: Colors.grey.shade700,
                  size: 20,
                ),
                onPressed: () {},
              ),
              IconButton(
                icon: FaIcon(
                  FontAwesomeIcons.paperPlane,
                  color: Colors.grey.shade700,
                  size: 18,
                ),
                onPressed: () {},
              ),
            ],
          ),
        ],
      ),
    );
  }
}

// ExplorePage
class ExplorePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    initializeTags();

    return ListView(
      padding: EdgeInsets.symmetric(horizontal: 12.0, vertical: 8.0), // Adjusted padding
      children: [
        // Search Bar
        Padding(
          padding: const EdgeInsets.symmetric(vertical: 6.0),
          child: Container(
            height: 45,
            child: TextField(
              style: TextStyle(fontFamily: 'Roboto', fontSize: 15),
              decoration: InputDecoration(
                prefixIcon: Icon(Icons.search, color: Colors.grey),
                hintText: 'Explore places, activities, and more',
                hintStyle: TextStyle(fontFamily: 'Roboto', fontSize: 15),
                filled: true,
                fillColor: Colors.grey.shade200,
                contentPadding: EdgeInsets.zero, // Reduce padding inside TextField
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(25),
                  borderSide: BorderSide.none,
                ),
              ),
            ),
          ),
        ),
        // Places and Activities Cards
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            _buildExploreCard(context, 'Places', Icons.location_on,
                Colors.blue, Colors.indigo),
            _buildExploreCard(context, 'Activities', Icons.local_activity,
                Colors.orange, Colors.deepOrangeAccent),
          ],
        ),
        SizedBox(height: 16.0),
        // Feed Header
        Text(
          'Feed',
          style: TextStyle(
            fontSize: 24, // Adjusted font size
            fontWeight: FontWeight.bold,
          ),
        ),
        SizedBox(height: 12.0),
        // Display posts
        ...allPosts.map((post) => PostWidget(post: post)).toList(),
      ],
    );
  }

  Widget _buildExploreCard(BuildContext context, String title, IconData icon,
      Color startColor, Color endColor) {
    return GestureDetector(
      onTap: () {
        if (title == 'Places') {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => PlacesPage()),
          );
        } else if (title == 'Activities') {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => ActivitiesPage()),
          );
        }
      },
      child: Container(
        width: MediaQuery.of(context).size.width * 0.44,
        padding: EdgeInsets.all(10.0), // Adjusted padding
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16),
          gradient: LinearGradient(
            colors: [startColor.withOpacity(0.85), endColor.withOpacity(0.85)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.15),
              spreadRadius: 1,
              blurRadius: 6,
              offset: Offset(0, 3),
            ),
          ],
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 32, color: Colors.white.withOpacity(0.9)),
            SizedBox(height: 6.0),
            Text(
              title,
              style: TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.w600,
                color: Colors.white.withOpacity(0.9),
                letterSpacing: 0.5,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// MarketPage
class MarketPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Text('Market Page', style: TextStyle(fontSize: 24)),
    );
  }
}

// CreatePage
class CreatePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Text('Create Page', style: TextStyle(fontSize: 24)),
    );
  }
}

// SpaceviewPage (Placeholder for now)
class SpaceviewPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Text('Spaceview Page', style: TextStyle(fontSize: 24)),
    );
  }
}

// UserProfile Model
class UserProfile {
  final String name;
  final String title;
  final String username;
  final String displayPhoto;
  final bool isVerified;
  final int age;
  final String sex;
  final List<String> nationalities;
  final List<String> languages;
  final List<String> interests;
  final String bio;
  final String school;
  final String occupation;
  final int bxp;
  final int followers;
  final int following;
  final List<Friend> friends;
  final List<String> followingList;
  final List<Group> groups;
  final List<Post> posts;
  final List<String> favoriteFoods;

  UserProfile({
    required this.name,
    required this.title,
    required this.username,
    required this.displayPhoto,
    required this.isVerified,
    required this.age,
    required this.sex,
    required this.nationalities,
    required this.languages,
    required this.interests,
    required this.bio,
    required this.school,
    required this.occupation,
    required this.bxp,
    required this.followers,
    required this.following,
    required this.friends,
    required this.followingList,
    required this.groups,
    required this.posts,
    required this.favoriteFoods,
  });
}

// Friend Model
class Friend {
  final String name;
  final String image;

  Friend({
    required this.name,
    required this.image,
  });
}

// Group Model
class Group {
  final String name;
  final List<Friend> members;

  Group({required this.name, required this.members});
}

// ProfilePage
class ProfilePage extends StatelessWidget {
  final UserProfile userProfile = UserProfile(
    name: 'Third Camacho',
    title: 'Dr.',
    username: '@3rd',
    displayPhoto: 'assets/images/3rd.png',
    isVerified: true,
    age: 26,
    sex: 'Male',
    nationalities: ['Filipino 🇵🇭'],
    languages: ['English', 'Filipino', 'Bisakol'],
    interests: ['🏖️ Beach', '⛰️ Mountains', '🏀 Basketball'],
    bio: 'Founder & CEO of Blinxus 🏀',
    school: '',
    occupation: '',
    bxp: 1269,
    followers: 2,
    following: 2,
    friends: [
      Friend(name: 'Lem Antonio', image: 'assets/images/lem.png'),
      Friend(name: 'PJ Reyes', image: 'assets/images/pj.png'),
    ],
    followingList: [
      'AdventureGear',
      'NaturePhotography',
    ],
    groups: [
      Group(
        name: 'Boracay',
        members: [
          Friend(name: 'Lem Antonio', image: 'assets/images/lem.png'),
          Friend(name: 'PJ Reyes', image: 'assets/images/pj.png'),
        ],
      ),
    ],
    posts: [
      // User's text post
      Post(
        imagePath: '', // Empty for text post
        profileImagePath: 'assets/images/3rd.png',
        name: 'Dr. Third Camacho',
        username: '@3rd',
        content: 'Enjoying the beach',
        date: DateTime(2024, 10, 4),
        tags: [], // Will be filled automatically
      ),
      Post(
        imagePath: 'assets/images/Media.PNG', // Media post
        profileImagePath: 'assets/images/3rd.png',
        name: 'Dr. Third Camacho',
        username: '@3rd',
        content: 'Solid dito sa Boracay',
        date: DateTime(2024, 10, 5),
        tags: [], // Will be filled automatically
      ),
      Post(
        imagePath: 'assets/images/surfing.png',
        profileImagePath: 'assets/images/3rd.png',
        name: 'Dr. Third Camacho',
        username: '@3rd',
        content: 'Surfing in Siargao 🏄🏾‍♂️',
        date: DateTime(2024, 10, 6),
        tags: [],
      ),
      Post(
        imagePath: 'assets/images/coron.png',
        profileImagePath: 'assets/images/3rd.png',
        name: 'Dr. Third Camacho',
        username: '@3rd',
        content: 'Island Hopping in Coron 🏖️',
        date: DateTime(2024, 10, 7),
        tags: [],
      ),
    ],
    favoriteFoods: ['🥩 Steak', '🍔 Burger', '🍦 Ice Cream'],
  );

  @override
  Widget build(BuildContext context) {
    initializeTags(); // Ensure posts are tagged

    return Scaffold(
      // Updated AppBar without the logo or title
      appBar: AppBar(
        automaticallyImplyLeading: false,
        backgroundColor: Colors.white,
        elevation: 1,
        actions: [
          IconButton(
            icon: Icon(Icons.edit, color: Colors.blueGrey),
            onPressed: () {
              // Edit profile action
            },
          ),
        ],
      ),
      body: ListView(
        children: [
          // Profile Header
          _buildProfileHeader(),
          Divider(),
          // Profile Details Section
          _buildProfileDetails(),
          Divider(),
          // Posts Section
          _buildPostsSection(context),
        ],
      ),
    );
  }

  Widget _buildProfileHeader() {
    return Padding(
      padding: EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          CircleAvatar(
            backgroundImage: AssetImage(userProfile.displayPhoto),
            radius: 80, // Slightly smaller for a refined look
          ),
          SizedBox(height: 12.0),

          // Name with Logo
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                '${userProfile.title} ${userProfile.name}',
                style: TextStyle(
                  fontSize: 23, // Increased by 1
                  fontWeight: FontWeight.w500,
                  color: Colors.black87,
                ),
              ),
              SizedBox(width: 8.0),
              Image.asset(
                'assets/images/blinxus_founder.png', // Path to logo
                height: 20,
                width: 20,
              ),
            ],
          ),

          Text(
            userProfile.username,
            style: TextStyle(
              fontSize: 16, // Increased by 1
              color: Colors.grey.shade500,
            ),
          ),
          SizedBox(height: 8.0),

          Text(
            userProfile.bio,
            style: TextStyle(
              fontSize: 16, // Increased by 1
              color: Colors.grey.shade600,
              fontWeight: FontWeight.w400,
            ),
            textAlign: TextAlign.center,
          ),

          SizedBox(height: 12.0),

          // Blinkscore with Logo
          Container(
            decoration: BoxDecoration(
              color: Colors.purple.shade50,
              borderRadius: BorderRadius.circular(40),
            ),
            padding: EdgeInsets.symmetric(horizontal: 10.0, vertical: 2.0),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Image.asset(
                  'assets/images/blinxus_bxs.png', // Path to Blinkscore logo
                  height: 30,
                  width: 30,
                ),
                SizedBox(width: 2.0),
                Text(
                  '${userProfile.bxp}',
                  style: TextStyle(
                    fontSize: 15, // Increased by 1
                    fontWeight: FontWeight.w500,
                    color: Colors.purple.shade400,
                  ),
                ),
              ],
            ),
          ),

          SizedBox(height: 12.0),

          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Column(
                children: [
                  Text(
                    '${userProfile.followers}',
                    style: TextStyle(
                      fontSize: 17, // Increased by 1
                      fontWeight: FontWeight.bold,
                      color: Colors.black87,
                    ),
                  ),
                  Text(
                    'Followers',
                    style: TextStyle(
                      fontSize: 14, // Increased by 1
                      color: Colors.grey.shade500,
                    ),
                  ),
                ],
              ),
              SizedBox(width: 40.0),
              Column(
                children: [
                  Text(
                    '${userProfile.following}',
                    style: TextStyle(
                      fontSize: 17, // Increased by 1
                      fontWeight: FontWeight.bold,
                      color: Colors.black87,
                    ),
                  ),
                  Text(
                    'Following',
                    style: TextStyle(
                      fontSize: 14, // Increased by 1
                      color: Colors.grey.shade500,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildProfileDetails() {
    return Padding(
      padding: EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildSectionHeader('Languages'),
          SizedBox(height: 8.0),
          _buildTags(userProfile.languages),
          SizedBox(height: 16.0),
          _buildSectionHeader('Interests'),
          SizedBox(height: 8.0),
          _buildTags(userProfile.interests),
          SizedBox(height: 16.0),
          _buildSectionHeader('Food'),
          SizedBox(height: 8.0),
          _buildTags(userProfile.favoriteFoods),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Text(
      title,
      style: TextStyle(
        fontSize: 16,
        fontWeight: FontWeight.w500,
        color: Colors.black87,
      ),
    );
  }

  Widget _buildTags(List<String> items) {
    return Wrap(
      spacing: 8.0,
      runSpacing: 8.0,
      children: items.map((item) {
        return Container(
          decoration: BoxDecoration(
            color: Colors.grey.shade200,
            borderRadius: BorderRadius.circular(20),
          ),
          padding: EdgeInsets.symmetric(horizontal: 12.0, vertical: 6.0),
          child: Text(
            item,
            style: TextStyle(
              fontSize: 15,
              color: Colors.grey.shade700,
            ),
          ),
        );
      }).toList(),
    );
  }

  Widget _buildTagList(List<String> items) {
    return Wrap(
      spacing: 8.0,
      runSpacing: 8.0,
      children: items.map((item) {
        return Container(
          decoration: BoxDecoration(
            color: Colors.grey.shade200,
            borderRadius: BorderRadius.circular(20),
          ),
          padding: EdgeInsets.symmetric(horizontal: 12.0, vertical: 6.0),
          child: Text(
            item,
            style: TextStyle(
              fontSize: 14,
              color: Colors.grey.shade700,
            ),
          ),
        );
      }).toList(),
    );
  }

  // Posts Section
  Widget _buildPostsSection(BuildContext context) {
    return DefaultTabController(
      length: 2, // Text and Media
      child: Column(
        children: [
          TabBar(
            tabs: [
              Tab(text: 'Text'),
              Tab(text: 'Media'),
            ],
            labelColor: Colors.black,
            unselectedLabelColor: Colors.grey,
            indicatorColor: Colors.black,
          ),
          Container(
            // Height is required for TabBarView inside Column
            height: 400, // Adjust as needed
            child: TabBarView(
              children: [
                // Text Posts
                _buildTextPosts(),
                // Media Posts
                _buildMediaPosts(context),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTextPosts() {
    // Filter text posts
    List<Post> textPosts = userProfile.posts
        .where((post) => post.imagePath.isEmpty)
        .toList();

    if (textPosts.isEmpty) {
      return Center(child: Text('No text posts'));
    }

    return ListView.builder(
      itemCount: textPosts.length,
      itemBuilder: (context, index) {
        Post post = textPosts[index];
        return PostWidget(post: post);
      },
    );
  }

  // Updated Media Posts with GridView and Soft UI
  Widget _buildMediaPosts(BuildContext context) {
    // Filter media posts
    List<Post> mediaPosts = userProfile.posts
        .where((post) => post.imagePath.isNotEmpty)
        .toList();

    if (mediaPosts.isEmpty) {
      return Center(child: Text('No media posts'));
    }

    return GridView.builder(
      padding: EdgeInsets.zero,
      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 3, // Number of columns in the grid
        crossAxisSpacing: 1.0,
        mainAxisSpacing: 12.0,
        childAspectRatio: 1.0, // For square items
      ),
      itemCount: mediaPosts.length,
      itemBuilder: (context, index) {
        Post post = mediaPosts[index];
        return GestureDetector(
          onTap: () {
            // Navigate to the scrollable version
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => MediaPostsPage(
                  initialIndex: index,
                  mediaPosts: mediaPosts,
                ),
              ),
            );
          },
          child: Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16.0),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.08),
                  blurRadius: 6,
                  offset: Offset(0, 3),
                ),
              ],
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(16.0),
              child: Image.asset(
                post.imagePath,
                fit: BoxFit.cover,
                width: double.infinity,
                height: double.infinity,
              ),
            ),
          ),
        );
      },
    );
  }
}

// MediaPostsPage to display media posts in a scrollable vertical list
class MediaPostsPage extends StatefulWidget {
  final int initialIndex;
  final List<Post> mediaPosts;

  MediaPostsPage({required this.initialIndex, required this.mediaPosts});

  @override
  _MediaPostsPageState createState() => _MediaPostsPageState();
}

class _MediaPostsPageState extends State<MediaPostsPage> {
  final ItemScrollController itemScrollController = ItemScrollController();

  @override
  void initState() {
    super.initState();

    // Scroll to the initial index after the first frame
    WidgetsBinding.instance.addPostFrameCallback((_) {
      itemScrollController.jumpTo(index: widget.initialIndex);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Media Posts'),
      ),
      body: ScrollablePositionedList.builder(
        itemScrollController: itemScrollController,
        itemCount: widget.mediaPosts.length,
        itemBuilder: (context, index) {
          Post post = widget.mediaPosts[index];
          return PostWidget(post: post);
        },
      ),
    );
  }
}

// FullScreenImagePage
class FullScreenImagePage extends StatelessWidget {
  final String imagePath;

  FullScreenImagePage({required this.imagePath});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: GestureDetector(
        onTap: () {
          Navigator.pop(context); // Close full-screen view on tap
        },
        child: Center(
          child: Image.asset(
            imagePath,
            fit: BoxFit.contain, // Ensures the image fits within the screen
            width: double.infinity,
            height: double.infinity,
          ),
        ),
      ),
    );
  }
}

// PlacesPage
class PlacesPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final List<String> placesList = [
      'Anilao',
      'Bohol',
      'Boracay',
      'Cebu',
      'Coron',
      'Davao',
      'El Nido',
      'La Union',
      'Siargao',
      'Zambales',
      'Pangasinan',
      'Baguio',
      'Sagada',
      'Tagaytay',
      'Batangas',
      'Bicol',
      'Ilocos',
      'Subic',
      'Camiguin',
      'Batanes',
      'Rizal',
    ];
    placesList.sort();

    return Scaffold(
      appBar: AppBar(
        title: Text('Places'),
      ),
      body: Column(
        children: [
          // Search Bar
          buildSearchBar('Search Places'),
          // Grid of Places
          Expanded(
            child: GridView.builder(
              padding: EdgeInsets.all(16.0),
              gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                crossAxisSpacing: 16.0,
                mainAxisSpacing: 16.0,
              ),
              itemCount: placesList.length,
              itemBuilder: (context, index) {
                return GestureDetector(
                  onTap: () {
                    // Navigate to PlaceDetailsPage
                    Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (context) =>
                            PlaceDetailsPage(placeName: placesList[index]),
                      ),
                    );
                  },
                  child: Card(
                    elevation: 2,
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12)),
                    child: Center(
                      child: Padding(
                        padding: EdgeInsets.all(16.0),
                        child: Text(
                          placesList[index],
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w500,
                            fontFamily: 'Roboto',
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

// PlaceDetailsPage
class PlaceDetailsPage extends StatelessWidget {
  final String placeName;

  PlaceDetailsPage({required this.placeName});

  final List<String> tabs = [
    'Feed',
    'Activities',
    'Marketplace',
    'Active Events',
    'Daily News',
    'Tags',
    'Itineraries',
  ];

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: tabs.length,
      child: Scaffold(
        appBar: AppBar(
          title: Text(placeName),
          bottom: TabBar(
            isScrollable: true,
            indicatorColor: Colors.black,
            tabs: tabs.map((tab) => Tab(text: tab)).toList(),
          ),
        ),
        body: TabBarView(
          children: tabs.map((tab) {
            if (tab == 'Tags') {
              // Display posts tagged with this place
              List<Post> taggedPosts = allPosts
                  .where((post) => post.tags.contains(placeName))
                  .toList();

              if (taggedPosts.isEmpty) {
                return Center(
                  child: Text(
                    'No posts tagged with $placeName yet.',
                    style: TextStyle(fontSize: 18),
                  ),
                );
              }

              return ListView.builder(
                padding: EdgeInsets.all(16.0),
                itemCount: taggedPosts.length,
                itemBuilder: (context, index) {
                  Post post = taggedPosts[index];
                  return PostWidget(post: post);
                },
              );
            } else {
              return Center(
                child: Text(
                  '$tab Content for $placeName',
                  style: TextStyle(fontSize: 18),
                ),
              );
            }
          }).toList(),
        ),
      ),
    );
  }
}

// ActivitiesPage
class ActivitiesPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // Separate activities into Land and Water Activities
    final List<String> landActivities = [
      'ATV',
      'Bike Trail',
      'Bungee Jumping',
      'Camping Sites',
      'Caving',
      'City Tours',
      'Cliff Diving',
      'Glamping',
      'Heritage Tours',
      'Helicopter Ride',
      'Hiking',
      'Horseback Riding',
      'Hot Springs',
      'Mountains',
      'Museums',
      'Parks',
      'Paragliding',
      'Roadtrip',
      'Rock Climbing',
      'Sightseeing',
      'Skydiving',
      'Snow Boarding',
      'Spa',
      'Sunset & Sunrise Viewing',
      'Temples',
      'Tree Top',
      'Valleys',
      'Zoo',
      'Ziplining',
    ];
    landActivities.sort();

    final List<String> waterActivities = [
      'Banana Boat',
      'Beaches',
      'Canoeing',
      'Diving',
      'Freediving',
      'Island Hopping',
      'Kayaking',
      'Paragliding',
      'Scuba Diving',
      'Spearfishing',
      'Speed Boat',
      'Surfing',
      'Turtle Hatching',
      'Wakeboarding',
    ];
    waterActivities.sort();

    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: AppBar(
          title: Text('Activities'),
          bottom: TabBar(
            labelColor: Colors.black,
            unselectedLabelColor: Colors.grey,
            indicatorColor: Colors.black,
            tabs: [
              Tab(text: 'Land'),
              Tab(text: 'Water'),
            ],
          ),
        ),
        body: TabBarView(
          children: [
            // Land Activities Grid
            _buildActivitiesGrid(landActivities),
            // Water Activities Grid
            _buildActivitiesGrid(waterActivities),
          ],
        ),
      ),
    );
  }

  Widget _buildActivitiesGrid(List<String> activities) {
    return GridView.builder(
      padding: EdgeInsets.all(16.0),
      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 16.0,
        mainAxisSpacing: 16.0,
      ),
      itemCount: activities.length,
      itemBuilder: (context, index) {
        return Card(
          elevation: 2,
          shape:
          RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          child: Center(
            child: Padding(
              padding: EdgeInsets.all(16.0),
              child: Text(
                activities[index],
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w500,
                  fontFamily: 'Roboto',
                ),
                textAlign: TextAlign.center,
              ),
            ),
          ),
        );
      },
    );
  }
}

Widget _buildPlaceOrActivityItem(String itemName) {
  return Container(
    margin: EdgeInsets.symmetric(vertical: 10.0, horizontal: 16.0),
    padding: EdgeInsets.all(20.0),
    decoration: BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.circular(24), // Rounded edges for bubble look
      boxShadow: [
        BoxShadow(
          color: Colors.black.withOpacity(0.05),
          blurRadius: 10,
          offset: Offset(0, 4), // Soft shadow for lifted effect
        ),
      ],
    ),
    child: Center(
      child: Text(
        itemName,
        style: TextStyle(
          fontSize: 18,
          fontWeight: FontWeight.w500,
          color: Colors.black87,
          height: 1.6,
        ),
        textAlign: TextAlign.center,
      ),
    ),
  );
}

// ChatPage
class ChatPage extends StatelessWidget {
  final List<ChatUser> chatUsers = [
    ChatUser(
      name: 'Lem Antonio',
      image: 'assets/images/lem.png',
      message: 'Bro, san kayo ngayon?',
      time: '5:30 PM',
    ),
    ChatUser(
      name: 'PJ Reyes',
      image: 'assets/images/pj.png',
      message: 'Ayos, tara dive tayo.',
      time: 'Yesterday',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Chats'),
      ),
      body: ListView.builder(
        itemCount: chatUsers.length,
        itemBuilder: (context, index) {
          return _buildChatTile(chatUsers[index], context);
        },
      ),
    );
  }

  Widget _buildChatTile(ChatUser user, BuildContext context) {
    return ListTile(
      leading: CircleAvatar(
        backgroundImage: AssetImage(user.image),
        radius: 24,
      ),
      title: Text(
        user.name,
        style: TextStyle(
          fontFamily: 'Roboto',
          fontWeight: FontWeight.bold,
        ),
      ),
      subtitle: Text(user.message),
      trailing: Text(
        user.time,
        style: TextStyle(color: Colors.grey),
      ),
      onTap: () {
        // Navigate to ChatDetailPage
        Navigator.of(context).push(
          MaterialPageRoute(
            builder: (context) => ChatDetailPage(user: user),
          ),
        );
      },
    );
  }
}

// ChatUser Class
class ChatUser {
  final String name;
  final String image;
  final String message;
  final String time;

  ChatUser({
    required this.name,
    required this.image,
    required this.message,
    required this.time,
  });
}

// ChatDetailPage
class ChatDetailPage extends StatelessWidget {
  final ChatUser user;

  ChatDetailPage({required this.user});

  @override
  Widget build(BuildContext context) {
    // Sample messages for the conversation
    final List<Message> messages = [
      Message(
        text: 'Hey, how are you?',
        isSentByMe: false,
        time: '5:28 PM',
      ),
      Message(
        text: 'I\'m good, just exploring Blinxus!',
        isSentByMe: true,
        time: '5:29 PM',
      ),
      Message(
        text: user.message,
        isSentByMe: false,
        time: user.time,
      ),
    ];

    return Scaffold(
      appBar: AppBar(
        title: Text(user.name),
      ),
      body: Column(
        children: [
          // Messages List
          Expanded(
            child: ListView.builder(
              padding: EdgeInsets.all(16.0),
              reverse: true,
              itemCount: messages.length,
              itemBuilder: (context, index) {
                return _buildMessageBubble(
                    messages[messages.length - index - 1]);
              },
            ),
          ),
          // Input Field
          _buildMessageInputField(),
        ],
      ),
    );
  }

  Widget _buildMessageBubble(Message message) {
    Alignment alignment =
    message.isSentByMe ? Alignment.centerRight : Alignment.centerLeft;
    Color color =
    message.isSentByMe ? Colors.blueAccent : Colors.grey.shade300;
    TextStyle textStyle =
    TextStyle(color: message.isSentByMe ? Colors.white : Colors.black87);

    return Align(
      alignment: alignment,
      child: Container(
        margin: EdgeInsets.symmetric(vertical: 4.0),
        padding: EdgeInsets.symmetric(horizontal: 12.0, vertical: 8.0),
        decoration: BoxDecoration(
          color: color,
          borderRadius: BorderRadius.circular(12.0),
        ),
        child: Text(
          message.text,
          style: textStyle,
        ),
      ),
    );
  }

  Widget _buildMessageInputField() {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 8.0),
      color: Colors.white,
      child: TextField(
        decoration: InputDecoration(
          hintText: 'Type a message',
          border: InputBorder.none,
          suffixIcon: IconButton(
            icon: Icon(Icons.send, color: Colors.blueAccent),
            onPressed: () {
              // Send message action
            },
          ),
        ),
      ),
    );
  }
}

// Message Class
class Message {
  final String text;
  final bool isSentByMe;
  final String time;

  Message({
    required this.text,
    required this.isSentByMe,
    required this.time,
  });
}

// Helper function for search bars
Widget buildSearchBar(String hintText) {
  return Padding(
    padding: const EdgeInsets.all(16.0),
    child: TextField(
      decoration: InputDecoration(
        prefixIcon: Icon(Icons.search, color: Colors.grey),
        hintText: hintText,
        filled: true,
        fillColor: Colors.grey.shade200,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(30),
          borderSide: BorderSide.none,
        ),
      ),
    ),
  );
}

// Constants (if needed)
const kPrimaryColor = Colors.blueAccent;
const kTextStyle = TextStyle(fontFamily: 'Roboto', fontSize: 16);
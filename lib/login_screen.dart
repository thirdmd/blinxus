import 'package:flutter/material.dart';
import 'blinxus.dart'; // Ensure this file exists and is correctly imported

class LoginScreen extends StatefulWidget {
  @override
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  // Controllers for text fields
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  // For toggling password visibility
  bool _obscureText = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // Optional: Remove AppBar if you prefer a full-screen login
      appBar: AppBar(
        title: Text('Login'),
        backgroundColor: Colors.white,
        elevation: 1,
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.symmetric(horizontal: 24.0),
        child: Column(
          children: [
            SizedBox(height: 60.0),
            // App Logo
            Image.asset(
              'assets/images/blinxus_logo.png',
              height: 100,
              width: 100,
            ),
            SizedBox(height: 40.0),
            // Email TextField
            TextField(
              controller: _emailController,
              keyboardType: TextInputType.emailAddress,
              style: TextStyle(
                fontSize: 16.0,
                fontFamily: 'Roboto',
              ),
              decoration: InputDecoration(
                labelText: 'Email',
                labelStyle: TextStyle(
                  fontFamily: 'Roboto',
                ),
                prefixIcon: Icon(Icons.email_outlined),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(30.0),
                ),
              ),
            ),
            SizedBox(height: 20.0),
            // Password TextField
            TextField(
              controller: _passwordController,
              obscureText: _obscureText,
              style: TextStyle(
                fontSize: 16.0,
                fontFamily: 'Roboto',
              ),
              decoration: InputDecoration(
                labelText: 'Password',
                labelStyle: TextStyle(
                  fontFamily: 'Roboto',
                ),
                prefixIcon: Icon(Icons.lock_outline),
                suffixIcon: IconButton(
                  icon: Icon(
                    _obscureText
                        ? Icons.visibility_off_outlined
                        : Icons.visibility_outlined,
                  ),
                  onPressed: () {
                    setState(() {
                      _obscureText = !_obscureText;
                    });
                  },
                ),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(30.0),
                ),
              ),
            ),
            SizedBox(height: 30.0),
            // Login Button
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  // TODO: Implement login functionality
                  // For now, navigate to BlinxusPage
                  Navigator.of(context).pushReplacement(
                    MaterialPageRoute(builder: (context) => BlinxusPage()),
                  );
                },
                style: ElevatedButton.styleFrom(
                  padding: EdgeInsets.symmetric(vertical: 14.0),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(30.0),
                  ),
                  backgroundColor: Color(0xFF92478A), // Use your primary color
                ),
                child: Text(
                  'Login',
                  style: TextStyle(fontSize: 18.0, fontFamily: 'Roboto'),
                ),
              ),
            ),
            SizedBox(height: 20.0),
            // Sign Up Option
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  'Don\'t have an account?',
                  style: TextStyle(fontSize: 16.0, fontFamily: 'Roboto'),
                ),
                TextButton(
                  onPressed: () {
                    // Navigate to Sign Up Screen
                    // TODO: Implement Sign Up Screen
                  },
                  child: Text(
                    'Sign Up',
                    style: TextStyle(
                      fontSize: 16.0,
                      color: Color(0xFF92478A), // Use your accent color
                      fontWeight: FontWeight.bold,
                      fontFamily: 'Roboto',
                    ),
                  ),
                ),
              ],
            ),
            // Forgot Password Option
            TextButton(
              onPressed: () {
                // Navigate to Forgot Password Screen
                // TODO: Implement Forgot Password Screen
              },
              child: Text(
                'Forgot Password?',
                style: TextStyle(
                  fontSize: 16.0,
                  color: Colors.grey.shade600,
                  fontFamily: 'Roboto',
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
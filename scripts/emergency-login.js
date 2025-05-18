const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const emergencyLogin = async () => {
  try {
    // 1. Connect to the database
    const db = process.env.MONGO_URI || 'mongodb://localhost:27017/alumni';
    await mongoose.connect(db);
    console.log('MongoDB Connected...');
    
    // 2. Reset/create the admin user
    let adminUser = await User.findOne({ email: 'admin@example.com' });
    
    if (adminUser) {
      console.log('Found existing admin user, updating...');
      // Reset password and ensure admin role
      const salt = await bcrypt.genSalt(10);
      adminUser.password = await bcrypt.hash('password123', salt);
      adminUser.role = 'admin';
      adminUser.name = 'Administrator';
      await adminUser.save();
    } else {
      console.log('Creating new admin user...');
      // Create new admin
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);
      
      adminUser = new User({
        name: 'Administrator',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin'
      });
      
      await adminUser.save();
    }
    
    console.log('Admin user ready:', {
      id: adminUser._id,
      name: adminUser.name,
      email: adminUser.email,
      role: adminUser.role
    });
    
    // 3. Generate a valid token
    const jwtSecret = process.env.JWT_SECRET || 'mysecrettoken';
    const payload = {
      user: {
        id: adminUser._id,
        email: adminUser.email,
        role: adminUser.role,
        name: adminUser.name
      }
    };
    
    const token = jwt.sign(payload, jwtSecret, { expiresIn: 360000 });
    
    // 4. Try a direct login via API
    console.log('Testing direct API login...');
    
    try {
      const loginResponse = await axios.post('http://localhost:5006/api/auth', {
        email: 'admin@example.com',
        password: 'password123'
      });
      
      if (loginResponse.data && loginResponse.data.token) {
        console.log('✓ API login successful!');
        console.log('Token from API:', loginResponse.data.token.substring(0, 15) + '...');
      } else {
        console.log('✗ API login failed - no token received');
      }
    } catch (apiError) {
      console.error('✗ API login failed:', apiError.message);
    }
    
    // 5. Output emergency login commands
    console.log('\n==========================================================');
    console.log('🔐 EMERGENCY LOGIN INSTRUCTIONS');
    console.log('==========================================================');
    console.log('1. Open your browser to http://localhost:3001');
    console.log('2. Open the developer console (F12 or right-click > Inspect > Console)');
    console.log('3. Copy and paste ALL these commands:');
    console.log(`
// Clear any existing auth data
localStorage.removeItem('token');
localStorage.removeItem('user');
localStorage.removeItem('adminSession');

// Set new auth data
localStorage.setItem('token', '${token}');
localStorage.setItem('adminSession', 'true');
localStorage.setItem('user', '${JSON.stringify({
  id: adminUser._id,
  _id: adminUser._id,
  name: adminUser.name,
  email: adminUser.email,
  role: adminUser.role
}).replace(/'/g, "\\'")}');

// Force reload the page
window.location.reload();
`);
    console.log('4. You should now be logged in as admin');
    console.log('==========================================================');
    
    // Disconnect from database
    mongoose.disconnect();
    
  } catch (err) {
    console.error('Error:', err);
  }
};

emergencyLogin(); 
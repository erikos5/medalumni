const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const fixAuth = async () => {
  try {
    const db = process.env.MONGO_URI || 'mongodb://localhost:27017/alumni';
    await mongoose.connect(db);
    console.log('MongoDB Connected...');
    
    // 1. Check for admin user
    let adminUser = await User.findOne({ email: 'admin@example.com' });
    
    if (!adminUser) {
      console.log('No admin user found, creating one...');
      // Create admin user
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);
      
      adminUser = new User({
        name: 'Administrator',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin'
      });
      
      await adminUser.save();
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user exists, verifying role and password...');
      
      // Ensure admin role
      if (adminUser.role !== 'admin') {
        adminUser.role = 'admin';
        await adminUser.save();
        console.log('Updated user role to admin');
      }
      
      // Reset password
      const salt = await bcrypt.genSalt(10);
      adminUser.password = await bcrypt.hash('password123', salt);
      await adminUser.save();
      console.log('Reset admin password');
    }
    
    // 2. Generate a token for admin user
    const payload = {
      user: {
        id: adminUser._id,
        email: adminUser.email,
        role: adminUser.role,
        name: adminUser.name
      }
    };
    
    const jwtSecret = process.env.JWT_SECRET || 'mysecrettoken';
    const token = jwt.sign(payload, jwtSecret, { expiresIn: 360000 });
    
    // 3. Output admin login info
    console.log('\n----------------------------------------');
    console.log('🔑 ADMIN LOGIN CREDENTIALS:');
    console.log('----------------------------------------');
    console.log('Email: admin@example.com');
    console.log('Password: password123');
    console.log('----------------------------------------');
    
    // 4. Output admin user details
    console.log('\n----------------------------------------');
    console.log('👤 ADMIN USER DETAILS:');
    console.log('----------------------------------------');
    console.log('ID:', adminUser._id);
    console.log('Name:', adminUser.name);
    console.log('Email:', adminUser.email);
    console.log('Role:', adminUser.role);
    console.log('----------------------------------------');
    
    // 5. Output localStorage commands for manual fix
    console.log('\n----------------------------------------');
    console.log('⚙️ MANUAL FIX INSTRUCTIONS:');
    console.log('----------------------------------------');
    console.log('If login is still not working, open your browser console and run:');
    console.log(`
localStorage.setItem('token', '${token}');
localStorage.setItem('adminSession', 'true');
localStorage.setItem('user', '${JSON.stringify({
  id: adminUser._id,
  _id: adminUser._id,
  name: adminUser.name,
  email: adminUser.email,
  role: adminUser.role
}).replace(/'/g, "\\'")}');
    `);
    console.log('Then refresh the page.');
    console.log('----------------------------------------');
    
    mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
  }
};

fixAuth(); 
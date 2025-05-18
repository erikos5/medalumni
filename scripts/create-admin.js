const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const createAdminUser = async () => {
  try {
    const db = process.env.MONGO_URI || 'mongodb://localhost:27017/alumni';
    await mongoose.connect(db);
    console.log('MongoDB Connected...');
    
    // Check if admin already exists
    let adminUser = await User.findOne({ email: 'admin@example.com' });
    
    if (adminUser) {
      console.log('Admin user already exists');
      
      // Update the role if needed
      if (adminUser.role !== 'admin') {
        adminUser.role = 'admin';
        await adminUser.save();
        console.log('Updated user role to admin');
      }
      
      // Update the password
      const salt = await bcrypt.genSalt(10);
      adminUser.password = await bcrypt.hash('password123', salt);
      await adminUser.save();
      console.log('Updated admin password');
    } else {
      // Create new admin user
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
    }
    
    console.log('Admin user details:', {
      id: adminUser._id,
      name: adminUser.name,
      email: adminUser.email,
      role: adminUser.role
    });
    
    console.log('\nYou can now log in with:');
    console.log('Email: admin@example.com');
    console.log('Password: password123');
    
    mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
  }
};

createAdminUser(); 
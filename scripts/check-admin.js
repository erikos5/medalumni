const mongoose = require('mongoose');
const User = require('../models/User');

const checkAdminUser = async () => {
  try {
    const db = process.env.MONGO_URI || 'mongodb://localhost:27017/alumni';
    await mongoose.connect(db);
    console.log('MongoDB Connected...');
    
    const adminUser = await User.findOne({ email: 'admin@example.com' });
    console.log('Admin user exists:', !!adminUser);
    if (adminUser) {
      console.log('Admin user details:', {
        id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role
      });
    } else {
      console.log('No admin user found in database');
    }
    
    mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
  }
};

checkAdminUser(); 
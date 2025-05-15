const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mediterranean-alumni');
    console.log('MongoDB Connected...');
    
    // Check if admin user already exists
    const adminExists = await User.findOne({ email: 'admin@example.com' });
    
    if (adminExists) {
      console.log('Admin user already exists');
      return process.exit();
    }
    
    // Create new admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    const admin = new User({
      name: 'Administrator',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin'
    });
    
    await admin.save();
    console.log('Admin user created successfully');
    process.exit();
    
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
};

connectDB(); 
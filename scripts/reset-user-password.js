const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoURI = 'mongodb://localhost:27017/mediterranean-alumni';
    mongoose.set('strictQuery', false);
    await mongoose.connect(mongoURI);
    console.log('MongoDB Connected: ' + mongoose.connection.host);
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

const resetUserPassword = async () => {
  try {
    await connectDB();
    
    // Find the user by email
    const user = await User.findOne({ email: 'yannos@example.com' });
    
    if (!user) {
      console.error('User with email yannos@example.com not found!');
      mongoose.disconnect();
      return;
    }
    
    console.log(`Found user: ${user.name} (${user.email})`);
    
    // Generate hash for password123
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    // Update the user's password
    user.password = hashedPassword;
    await user.save();
    
    console.log('Password successfully reset to "password123"');
    
    mongoose.disconnect();
    console.log('Database connection closed');
  } catch (err) {
    console.error('Error:', err);
    mongoose.disconnect();
  }
};

resetUserPassword(); 
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/mediterranean-alumni';
    
    console.log('Connecting to MongoDB...');
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (err) {
    console.error(`Error connecting to MongoDB: ${err.message}`);
    process.exit(1);
  }
};

const createAdminUser = async () => {
  try {
    await connectDB();

    // Check if admin user already exists
    const existingUser = await User.findOne({ email: 'admin@example.com' });
    if (existingUser) {
      console.log('Admin user already exists with ID:', existingUser._id);
      
      // Update admin password if it exists but doesn't match
      const isMatch = await bcrypt.compare('password123', existingUser.password);
      if (!isMatch) {
        console.log('Updating admin password...');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);
        
        existingUser.password = hashedPassword;
        await existingUser.save();
        console.log('Admin password updated successfully');
      }
      
      // Make sure the role is set to admin
      if (existingUser.role !== 'admin') {
        existingUser.role = 'admin';
        await existingUser.save();
        console.log('Admin role updated successfully');
      }
      
    } else {
      // Create a new admin user
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);
      
      const adminUser = new User({
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
        _id: mongoose.Types.ObjectId('5f8f8c8f8c8f8c8f8c8f8c9d') // Use the same ID as in the code
      });
      
      await adminUser.save();
      console.log('Admin user created successfully with ID:', adminUser._id);
    }

    mongoose.disconnect();
    console.log('MongoDB disconnected');
  } catch (err) {
    console.error('Error creating admin user:', err.message);
    process.exit(1);
  }
};

// Run the function
createAdminUser(); 